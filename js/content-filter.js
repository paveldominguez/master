MLS.contentFilter = (function () {

    // TODO: refactor this thing...
    var $cf = $jQ('#content-filter'),
        pub = {

            /*============================
            =            Init            =
            ============================*/

            init: function () {
                $cf = $jQ('#content-filter');
                var $fs = $jQ('#filter-selections'),
                    $collapsible = $cf.find('.collapsible'),
                    $facets = $cf.find('.facet');

                // collapase all but first dimension
                $collapsible.find('.facet-list').slideToggle('slow');



                /*==========  bind click events  ==========*/

                // reset all
                $jQ('#clear-selections').on('click', pub.resetFilter);

                // dimension (expansion/collapse)
                $collapsible.find('.dimension-header').on('click', pub.dimensionClick);

                // handle clicks on multi-facet
                // $facets.not('.multi').on('click', pub.facetClick);
                // $multis.on('click', pub.multiFacetClick);
                $facets.on('click', pub.processRequest);

                // remove filter
                $fs.on('click', '.removable', pub.processRequest);

                // load filtered data
                // $jQ('#content-filter .facet-list .facet a').on('click', pub.processRequest);
            },

            /*-----  End of Init  ------*/



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



            /*=======================================
            =            process request            =
            =======================================*/

            processRequest : function (e) {
                e.preventDefault();

                var name = $jQ(this).attr('data-facet-dimension'),
                    value = $jQ(this).attr('data-facet-info'),
                    filterArray = [name, value];

                // update hash
                MLS.hash.update(name, value);

                // make request
                MLS.ajax.sendRequest(
                    MLS.ajax.endpoints.PRODUCT_LISTING,
                    {data : filterArray},
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

            }

            /*-----  End of update grid  ------*/

        };
    return pub;
}());

