MLS.contentFilter = (function () {

    var $cf = $jQ('#content-filter'),
        hashLoaded = false,
        options = {
            endpoint: null,
            callback: function () {},
            container: null
        },

        pub = {

            /*============================
            =            Init            =
            ============================*/

            init: function (o) {
                options = $jQ.extend(options, o);

                // endpoint = endpoint ? endpoint : (ep || MLS.ajax.endpoints.PRODUCT_LISTING);
                // callback = c || contentGrid.reInit;


                $cf = $jQ('#content-filter');
                var $collapsible = $cf.find('.collapsible'),
                    $facets = $cf.find('.facet');


                // collapse all but first dimension
                $collapsible.find('.facet-list').slideToggle('slow');


                // load content on load (if hash)
                !hashLoaded && pub.loadFromHash();
                hashLoaded = true;

                /*==========  bind click events  ==========*/

                // dimension (expansion/collapse)
                $collapsible.find('.dimension-header').on('click', pub.dimensionClick);

                $facets.on('click', pub.facetClick);
                $jQ('.filter-panels li').on('click', pub.facetClick); /* mobile option */

                // remove filter
                $jQ('#filter-selections').find('a').on('click', pub.removeFilter);

                // compability services
                $jQ('.compatibility-filter').find('select').on('change', pub.compabilitySearch);

                // type ahead (searc)
                $jQ('.compatibility-filter').find('input.type-ahead').on('keyup', pub.compabilitySearch);

                // sort links
                $jQ('#sort-options').find('li').on('click', pub.sort);
                $jQ('#mobile-sort-filter li.sort-option').on('click', pub.sort);
            },
            /*-----  End of Init  ------*/



            /*================================================
            =            Finalize (unbind events)            =
            =================================================*/

            finalize: function () {
                $cf = $jQ('#content-filter');
                var $collapsible = $cf.find('.collapsible'),
                    $facets = $cf.find('.facet');

                 /*==========  bind click events  ==========*/


                // dimension (expansion/collapse)
                $collapsible.find('.dimension-header').unbind('click', pub.dimensionClick);


                $facets.unbind('click', pub.facetClick);
                $jQ('.filter-panels li').unbind('click', pub.facetClick); /* mobile option */

                // remove filter
                $jQ('#clear-selections').find('li').find('a').unbind('click', pub.removeFilter);

                // compability services
                $jQ('.compatibility-filter').find('select').unbind('change', pub.compabilitySearch);

                // type ahead (searc)
                $jQ('.compatibility-filter').find('input.type-ahead').unbind('keyup', pub.compabilitySearch);

                 // sort links
                $jQ('#sort-options').find('li').unbind('click', pub.sort);
                $jQ('#mobile-sort-filter li.sort-option').unbind('click', pub.sort);

            },

            /*-----  End of Finalize (unbind events)  ------*/




            /*============================================
            =            Reinit: on ajax load            =
            ============================================*/

            reInit: function () {
                MLS.contentFilter.finalize();
                MLS.contentFilter.init();

            },

            /*-----  End of Reinit: on ajax load  ------*/




            /*======================================
            =            Load from Hash            =
            ======================================*/
            // If the url contains paramaters in the hash when it
            // is first loaded then request content

            loadFromHash: function () {

                var hash = window.location.hash,
                params = {};

                if (hash !== '') { // we have a hash
                    params = MLS.util.getParamsFromUrl(hash);

                    if (!$jQ.isEmptyObject(params)) {
                        pub.processRequest(params);
                    }

                }

            },

            /*-----  End of Load from Hash  ------*/




            /*=======================================
            =            Listing sorting            =
            =======================================*/

            sort: function (e) {
                e.preventDefault();
                var $elem = $jQ(this),
                    href = $elem.find('a').attr('href'),
                    params = MLS.util.getParamsFromUrl(href);

                window.location.hash = MLS.util.setHash(href);
                pub.processRequest(params);

            },

            /*-----  End of Listing sorting  ------*/


            /*===================================
            =            Facet click            =
            ===================================*/

            facetClick: function (e) {
                e.preventDefault();
                var $elem = $jQ(this),
                href = $elem.find('a').attr('href'),
                params = MLS.util.getParamsFromUrl(href);

                window.location.hash = MLS.util.setHash(href);
                pub.processRequest(params);

            },

            /*-----  End of Facet click  ------*/





            /*=======================================
            =            dimension click            =
            =======================================*/

            dimensionClick: function (e) {
                e.preventDefault();
                $jQ(this).toggleClass('active').promise().done(function () {
                    $jQ(this).next().slideToggle('slow');
                });
            },

            /*-----  End of dimension click  ------*/





            /*==========================================
            =            Compability search            =
            ==========================================*/

            compabilitySearch: function () {
                var $form = $jQ(this).parents('form'),
                    data = $form.serialize();


                $form.unbind('submit').on('submit', function (e) { e.preventDefault(); }); // do not submit form in enter

                // set hash
                window.location.hash = data;

                // make request
                pub.processRequest(data);
            },


            /*-----  End of Compability search  ------*/



            /*=============================================
            =            Remove selected facet            =
            =============================================*/

            removeFilter: function (e) {
                e.preventDefault();
                var $elem = $jQ(this),
                    href = $elem.attr('href'),
                    params = MLS.util.getParamsFromUrl(href);
                window.location.hash = MLS.util.setHash(href);
                pub.processRequest(params);
            },

            /*-----  End of remove facet  ------*/



            /*=======================================
            =            process request            =
            =======================================*/

            processRequest: function (params) {

                // make request
                MLS.ajax.sendRequest(
                    options.endpoint,
                    params,
                    pub.updateResults
                );
            },

            /*-----  End of process request  ------*/



            /*===================================
            =            update grid            =
            ===================================*/

            updateResults : function (data) {
                if (data.hasOwnProperty('success')) {

                    // update results...
                    options.container.html(data.success.responseHTML);

                    // ... and result count ...
                    $jQ('#content-filter-count').find('strong').text(data.success.count);

                    // ... and filters
                    $cf.replaceWith(data.success.filtersHTML);

                    // ... and even the sort by
                    $jQ('#sort-options').find('ul').replaceWith(data.success.sortByHTML);

                    options.callback();
                    pub.reInit();

                } else {
                    options.container.html(data.error.responseHTML);
                }

            },

            /*-----  End of update grid  ------*/



        };


    return pub;
}());


