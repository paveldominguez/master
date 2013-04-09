var contentFilter = (function () {
    // separate front-end from business logic (below)
    var toggleElement = function (o, remove, multi) {
        if (multi) {
            $jQ(o).remove();
        } else {
            $jQ(o).slideToggle('fast', function () {
                if (remove) {
                    $jQ(this).remove();
                }
            });
        }
    },
    // separate business logic from front-end (below)
    $cf = $jQ('#content-filter'),
    filterArray = null,
        pub = {
            init: function () {
                var $fs = $jQ('#filter-selections'),
                    $collapsible = $cf.find('.collapsible .dimension-header'),
                    $multis = $cf.find('.multi-select .facet'),
                    $facets = $cf.find('.facet');
                    //$removable = $fs.find('.removable');
                $jQ('#clear-selections').on('click', pub.resetFilter);
                $collapsible.not(':first').next().slideToggle('slow'); // collpase all but first dimension

                // handling of various clicks
                $facets.add($collapsible).on('click', pub.clickBridge); // prevent default action of click
                $collapsible.on('click', pub.dimensionClick); // handle clicks on dimension (expansion/collapse)
                $facets.not('.multi').on('click', pub.facetClick); // handle clicks on multi-facet
                $multis.on('click', pub.multiFacetClick);
                // handle clicks on removable action
                $fs.on('click', '.removable', pub.removeFilter);
                $jQ('#content-filter .facet-list .facet a').on('click', pub.processRequest);
            },
            addFilter: function (el) {
                var single = $jQ(el).parents().hasClass('dimension') ? false : true;
                var facetTitle, facetDimension, facetParent, multi;
                if (single) {
                    facetParent = $jQ(el).attr('id');
                    facetTitle = $jQ(el).attr('data-facet-info');
                    facetDimension = false;
                } else {
                    facetParent = $jQ(el).closest('.dimension').attr('id');
                    facetDimension = $jQ(el).closest('.dimension').attr('data-dimension');
                    facetTitle = $jQ(el).attr('data-facet-info');
                    multi = $jQ(el).hasClass('multi') ? true : false;
                }
                var addedFilter = '<li class="removable" data-multi="' + multi + '" data-facet-title="' + facetTitle + '" data-facet-parent="' + facetParent + '" data-facet-dimension="' + facetDimension + '">' + facetTitle + '<a href="#remove-facet" class="action"></a></li>';
                $jQ('.selected-facets', $cf).prepend(addedFilter);
                //Update Filter
                pub.updateFilter();
            },
            clickBridge: function (e) {
                e.preventDefault();
            },
            dimensionClick: function () {
                $jQ(this).toggleClass('active').promise().done(function () {
                    toggleElement($jQ(this).next(), false);
                });
            },
            facetClick: function () {
                // this will hide the dimension containing clicked facet, or facet itself..
                var $hide = $jQ(this).parents().hasClass('dimension') ? $jQ(this).closest('.dimension') : $jQ(this);
                toggleElement($hide, false);
                //add to filter
                pub.addFilter($jQ(this));
            },
            multiFacetClick: function () {
                //if class selected
                if ($jQ(this).hasClass('selected')) {
                    //remove selected
                    $jQ(this).toggleClass('selected');
                    //Remove from filter
                    pub.removeFilter(false, $jQ(this), true);
                } else {
                    //if not selected add selected class
                    $jQ(this).toggleClass('selected');
                    //add to filter
                    pub.addFilter($jQ(this));
                }
            },
            removeFilter: function (element, el, multi) {
                if ($jQ(el).length > 0) {
                    var title = $jQ(el).attr('data-facet-info');
                    var parent = $jQ(el).closest('.dimension').attr('id');
                    var selectedFacet = $jQ('.removable[data-facet-title="' + title + '"][data-facet-parent="' + parent + '"]');
                    toggleElement(selectedFacet, true, multi);
                } else {
                    var hiddenDimension = $jQ(this).attr('data-facet-parent');
                    //Remove facet from selected facets
                    var isMulti = $jQ(this).attr('data-multi');
                    if (isMulti === 'true') {
                        toggleElement(this);
                        //toggleElement($jQ('#' + hiddenDimension), false,true);
                    } else {
                        toggleElement(this, true, true);
                        toggleElement($jQ('#' + hiddenDimension), false);
                    }
                }
                //Update Filter
                pub.updateFilter();
            },
            resetFilter: function (e) {
                e.preventDefault();
                //Reset filter on 'clear selection'
                $cf.find('.facet').removeClass('selected');
                $jQ('.removable', '#filter-selections').each(function () {
                    if ($jQ(this).attr('data-multi') === 'true') {
                        $jQ(this).remove();
                    } else {
                        $jQ(this).click();
                    }
                });
                pub.updateFilter();
            },
            updateFilter: function () {
                filterArray = [];
                $jQ('.selected-facets li', '#filter-selections').each(function () {
                    var filterName = $jQ(this).attr('data-facet-dimension');
                    var filterValue = $jQ(this).attr('data-facet-title');
                    var newFilter = { name: filterName, value: filterValue};
                    filterArray.push(newFilter);
                });
                pub.processRequest();
            },
            processRequest : function () {
                MLS.ajax.sendRequest(
                    'guided-navigation.jsp',
                    {data : filterArray},
                    pub.updateGrid
                );
            },
            updateGrid : function (data) {
                MLS.ui.updateContent('#main-column .content-grid', data.hasOwnProperty('success') ? data.success.responseHTML : data.error.responseHTML);
                //Update Result Count
                $jQ('.results-count', '.content-landing-header').text(data.resultsCount);
                //Update content Type
                $jQ('.results-count', '.content-landing-header').text(data.contentType);
                //Get Current options
                $jQ('.dimension[data-dimension]').each(function () {
                    var dimension = $jQ(this).attr('data-dimension');
                    if ($jQ.inArray(dimension, data.options) < 0) {
                        $jQ(this).hide();
                    }
                });



            }
        };
    return pub;
}());
