var contentFilter = (function() {
    // separate front-end  from business logic (below)
    var toggleElement = function(o, remove) {
        $jQ(o).slideToggle('fast', function() {
            if(remove) {
                $jQ(this).remove();
            }
        });
    },
    // separate business logic from front-end (below)
    $cf = $jQ('#content-filter'),
    pub = {
        init : function() {
            var $fs = $jQ('#filter-selections'),
            $collapsible = $cf.find('.collapsible .dimension-header'),
            $multis = $cf.find('.multi-select .facet'),
            $facets = $cf.find('.facet'),
            $removable = $fs.find('.removable');
            
            $jQ('#clear-selections').on('click', function(e) {
                e.preventDefault();
                $removable.each(function() {
                    toggleElement(this, true);
                });
            });
            $collapsible.not(':first').next().slideToggle('slow'); // collpase all but first dimension

            // handling of various clicks
            $facets.add($collapsible).on('click', pub.clickBridge); // prevent default action of click
            $collapsible.on('click', pub.dimensionClick); // handle clicks on dimension (expansion/collapse)
            $multis.on('click', pub.multiFacetClick); // handle clicks on multi-facet
            $removable.on('click', pub.removeClick); // handle clicks on removable action
        },
        clickBridge : function(e) {
            e.preventDefault();
        },
        dimensionClick : function() {
            toggleElement($jQ(this).next(), false);
        },
        facetClick : function() {
            // var $hide = $jQ(this).hasParent('.dimension') ? $jQ(this).closest('.dimension') : $jQ(this);
            // toggleElement($hide, false); // this will hide the dimension containing clicked facet, or facet itself..
            
            // logic to add clicked facet to filter-selections ?
        },
        multiFacetClick : function() {
            $jQ(this).toggleClass('selected');
        },
        removeClick : function() {
            toggleElement(this, true);

            // logic to remove element from filter and re-show ?
        }
    };
    return pub;
}());