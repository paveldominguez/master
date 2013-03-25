var contentFilter = (function() {
    // separate front-end from business logic (below)
    var toggleElement = function(o, remove) {
        $jQ(o).slideToggle('fast', function() {
            if (remove) {
                $jQ(this).remove();
            }
        });
    },
    // separate business logic from front-end (below)
    $cf = $jQ('#content-filter'),
        pub = {
            init: function() {
                var $fs = $jQ('#filter-selections'),
                    $collapsible = $cf.find('.collapsible .dimension-header'),
                    $multis = $cf.find('.multi-select .facet'),
                    $facets = $cf.find('.facet'),
                    $removable = $fs.find('.removable');
                $jQ('#clear-selections').on('click', function(e) {
                    e.preventDefault();
                    $jQ('.removable', '#filter-selections').each(function() {
                        //Cheating I know
                        $jQ(this).click();
                    });
                    pub.resetFilter();
                });
                $collapsible.not(':first').next().slideToggle('slow'); // collpase all but first dimension

                // handling of various clicks
                $facets.add($collapsible).on('click', pub.clickBridge); // prevent default action of click
                $collapsible.on('click', pub.dimensionClick); // handle clicks on dimension (expansion/collapse)
                $facets.on('click', pub.facetClick); // handle clicks on multi-facet
                $removable.on('click', pub.removeFilter); // handle clicks on removable action

            },
            addFilter: function(el) {
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
            clickBridge: function(e) {
                e.preventDefault();
            },
            dimensionClick: function() {
                toggleElement($jQ(this).next(), false);
            },
            facetClick: function(e) {
                // this will hide the dimension containing clicked facet, or facet itself..
                var $hide = $jQ(this).parents().hasClass('dimension') ? $jQ(this).closest('.dimension') : $jQ(this);

                if ($jQ(this).hasClass('multi')) {
                    //if class selected
                    if ($jQ(this).hasClass('selected')) {
                        //remove selected
                        $jQ(this).toggleClass('selected');
                        //Remove from filter
                        pub.removeFilter(false, $jQ(this));
                    } else {
                        //if not selected add selected class
                        $jQ(this).toggleClass('selected');
                        //add to filter
                        pub.addFilter($jQ(this));
                    }
                } else {
                    toggleElement($hide, false);
                    //add to filter
                    pub.addFilter($jQ(this));
                }
            },
            removeFilter: function(element, el) {
                if ($jQ(el).length > 0) {
                    var title = $jQ(el).attr('data-facet-info');
                    var parent = $jQ(el).closest('.dimension').attr('id');
                    var selectedFacet = $jQ('.removable[data-facet-title="' + title + '"][data-facet-parent="' + parent + '"]');
                    toggleElement(selectedFacet, true);
                } else {
                    var multi = $jQ(this).attr('data-multi');
                    var hiddenDimension = $jQ(this).attr('data-facet-parent');
                    //Remove facet from selected facets
                    toggleElement(this, true);
                    //Show hidden dimension if not visible
                    if (multi == "false") {
                        toggleElement($jQ('#' + hiddenDimension));
                    }
                }
                //Update Filter
                pub.updateFilter();
            },
            resetFilter: function() {
                //Reset filter on 'clear selection'
                $cf.find('.facet').removeClass('selected');
                pub.updateFilter();
            },
            updateFilter: function() {

            }
        };
    return pub;
}());