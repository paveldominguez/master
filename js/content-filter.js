MLS.contentFilter = (function () {

    var $cf = $jQ('#content-filter'),
        pub = {

            /*============================
            =            Init            =
            ============================*/

            init: function () {
                $cf = $jQ('#content-filter');
                var $fs = $jQ('#filter-selections'),
                    $collapsible = $cf.find('.collapsible'),
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

                $facets.on('click', pub.processRequest);

                // remove filter
                $fs.find('a').on('click', pub.removeFilter);

                // compability services
                $jQ('.compatibility-filter').children('select').on('change', pub.processRequest);

            },

            /*-----  End of Init  ------*/

            finalize: function () {
                $cf = $jQ('#content-filter');
                var $fs = $jQ('#filter-selections'),
                    $collapsible = $cf.find('.collapsible'),
                    $facets = $cf.find('.facet');

                 /*==========  bind click events  ==========*/

                // reset all
                $jQ('#clear-selections').unbind('click', pub.resetFilter);

                // dimension (expansion/collapse)
                $collapsible.find('.dimension-header').unbind('click', pub.dimensionClick);

                // handle clicks on multi-facet
                // $facets.not('.multi').on('click', pub.facetClick);
                // $multis.on('click', pub.multiFacetClick);
                $facets.unbind('click', pub.processRequest);

                // remove filter
                $fs.find('a').unbind('click', pub.removeFilter);

                // compability services
                $jQ('.compatibility-filter').children('select').unbind('change', pub.processRequest);
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




            /*=============================================
            =            Remove selected facet            =
            =============================================*/

            removeFilter: function (e) {
                e.preventDefault();
                window.location.hash = '';
                pub.processRequest(e);
            },


            /*-----  End of Remove selected facet  ------*/





            /*=======================================
            =            process request            =
            =======================================*/

            processRequest : function (e) {
                e.preventDefault();

                var queryParams = [],
                    params = {},
                    param,
                    $elem = $jQ(this),
                    href = '',
                    j = 0;

                if (e.currentTarget.tagName === 'SELECT') { // for dropdowns
                    href = $elem.find('option:selected').attr('value');
                } else {
                    href = $elem.find('a').attr('href');
                }

                // update hash
                window.location.hash = href;

                // make params based on the url located in the a[href]
                queryParams = href.split('?')[1].split('&');

                for (j = 0; j < queryParams.length; j++) {
                    param = queryParams[j].split('=');
                    params[param[0]] = param[1];
                }

                // make request
                MLS.ajax.sendRequest(
                    MLS.ajax.endpoints.PRODUCT_LISTING,
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
                    MLS.ui.updateContent('#main-column .content-grid', data.success.responseHTML);
                    contentGrid.init(); // reload contentGrid
                    // ... and result count ...
                    $jQ('#content-filter-count').find('strong').text(data.success.count);
                    // ... and filters
                    $cf.replaceWith(data.success.filtersHTML);
                    pub.init();
                } else {
                    MLS.ui.updateContent('#main-column .content-grid', data.error.responseHTML);
                }

            },

            /*-----  End of update grid  ------*/



        };
    return pub;
}());

