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

                // collapse all but first dimension
                $collapsible.find('.facet-list').slideToggle('slow');



                // add data attributes to facets
                for (var i = 0; i < $facets.length; i++) {
                    var $facet = $jQ($facets[i]),
                        url = $facet.find('a').attr('href'),
                        params = url.match(/\?(.*)[&|&amp;](.*)/);

                    // set data attributes
                    $facet
                        .attr('data-n', params[1].split('=')[1])
                        .attr('data-nr', params[2].split('=')[1]);

                }



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
                $fs.find('a').on('click', pub.removeFilter);

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

                var $elem = $jQ(this),
                    href = $elem.find('a').attr('href');

                // update hash
                window.location.hash = href;

                // make request
                MLS.ajax.sendRequest(
                    MLS.ajax.endpoints.PRODUCT_LISTING,
                    {
                        'N': $elem.attr('data-n'),
                        'Nr': $elem.attr('data-nr')
                    },
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

