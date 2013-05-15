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
                    // $fs = $jQ('#filter-selections'),
                    // i = j = 0,
                    // $facet = null,
                    // param,
                    $facets = $cf.find('.facet');


                // collapse all but first dimension
                $collapsible.find('.facet-list').slideToggle('slow');

                // add data attributes to facets
                // for (i = 0; i < $facets.length; i++) {
                //     $facet = $facets.eq(i),
                //     url = $facet.children('a').attr('href'),

                //     params = url.split('?')[1].split('&');


                //     for (j=0; j< params.length; j++) {
                //         param = params[j].split('=');
                //         $facet.attr('data-' + param[0], param[1])
                //     }
                // }



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
                    $jQ('#content-grid-header').replaceWith(data.success.sortByHTML);

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

