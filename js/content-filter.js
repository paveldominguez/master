MLS.contentFilter = (function () {

    var $cf = $jQ('#content-filter'),
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



                /*==========  bind click events  ==========*/

                // reset all
                $jQ('#clear-selections').on('click', pub.resetFilter);

                // dimension (expansion/collapse)
                $collapsible.find('.dimension-header').on('click', pub.dimensionClick);

                $facets.on('click', pub.facetClick);

                // remove filter
                $jQ('#clear-selections').find('li').find('a').on('click', pub.removeFilter);

                // compability services
                $jQ('.compatibility-filter').children('select').on('change', pub.compabilitySelect);

                // type ahead (searc)
                $jQ('.compatibility-filter').children('input.type-ahead').on('keyup', pub.compabilitySearch);

                // sort links
                $jQ('#sort-options').find('li').on('click', pub.sort);


            },
            /*-----  End of Init  ------*/

            finalize: function () {
                $cf = $jQ('#content-filter');
                var $collapsible = $cf.find('.collapsible'),
                    $facets = $cf.find('.facet');

                 /*==========  bind click events  ==========*/

                // reset all
                $jQ('#clear-selections').unbind('click', pub.resetFilter);

                // dimension (expansion/collapse)
                $collapsible.find('.dimension-header').unbind('click', pub.dimensionClick);


                $facets.unbind('click', pub.facetClick);

                // remove filter
                $jQ('#filter-selections').find('li').find('a').on('click', pub.removeFilter);

                // compability services
                $jQ('.compatibility-filter').children('select').unbind('change', pub.compabilitySelect);

                // type ahead (searc)
                $jQ('.compatibility-filter').children('input.type-ahead').unbind('keyup', pub.compabilitySearch);


            },

            reInit: function () {
                MLS.contentFilter.finalize();
                MLS.contentFilter.init();

            },


            sort: function (e) {
                e.preventDefault();
                var $elem = $jQ(this),
                    // type = $elem.attr('data-type'),
                    // $sortOptions = $jQ('#sort-options'),
                    href = $elem.find('a').attr('href');

                params = MLS.util.getParamsFromUrl(href);
                pub.processRequest(params);

                //Fire Ajax


                // MLS.ajax.sendRequest(
                //     MLS.ajax.endpoints.PRODUCT_SORT,
                //     MLS.util.getParamsFromUrl(href),
                //     function (data) {
                //         if (data.hasOwnProperty('success')) {
                //             $sortOptions.find('li').removeClass('active');
                //             $elem.addClass('active');
                //             // load content...
                //             $jQ('#main-column .content-grid').html(data.success.responseHTML);
                //              // ... and even the sort by
                //             $jQ('#sort-options').replaceWith(data.success.sortByHTML);
                //             contentGrid.reInit();
                //         }
                //     }
                // );
            },


            /*=======================================
            =            dimension click            =
            =======================================*/

            dimensionClick: function (e) {
                e.preventDefault();
                $jQ(this).toggleClass('active').promise().done(function () {
                    // toggleElement($jQ(this).next(), false);
                    $jQ(this).next().slideToggle('slow');
                });
            },

            /*-----  End of dimension click  ------*/


            compabilitySearch: function (e) {
                var $elem = $jQ(this),
                    params = {search: $elem.val()};
                if (e.keyCode === 13) {
                    pub.processRequest(params);
                }
            },

            compabilitySelect: function () {
                var $elem = $jQ(this),
                    href = $elem.find('option:selected').attr('value'),
                    params;

                // update hash
                window.location.hash = href;

                params = MLS.util.getParamsFromUrl(href);
                pub.processRequest(params);
            },

            facetClick: function (e) {
                e.preventDefault();

                var $elem = $jQ(this),//e.currentTarget,
                    href = $elem.find('a').attr('href'),
                    params;

                // update hash
                window.location.hash = href;

                params = MLS.util.getParamsFromUrl(href);
                pub.processRequest(params);
            },


            /*=============================================
            =            Remove selected facet            =
            =============================================*/

            removeFilter: function (e) {
                var $elem = $jQ(this),
                    params = {removeFilter: 'xxx'};
                e.preventDefault();
                window.location.hash = '';
                pub.processRequest(params);
            },


            /*-----  End of Remove selected facet  ------*/

            resetFilter: function (e) {
                var $elem = $jQ(this),
                    params = {reset: 'filters'};
                e.preventDefault();
                window.location.hash = '';
                pub.processRequest(params);
            },



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
                    // MLS.ui.updateContent('#main-column .content-grid', data.success.responseHTML);
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

