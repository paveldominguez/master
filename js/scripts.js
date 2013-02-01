var $jQ = jQuery.noConflict(), // Prevent any future library conflicts
VZ = {}, // Container for firing common and page-specic JavaScript
UTIL = {}, //
isTouch = $jQ('html.touch').length > 0 ? true : false;

jQuery.extend( jQuery.fn, {
    hasParent: function(p) {
        return this.parents().filter(p).length > 0 ? true : false;
    }
});
/*
 * Global Functions
 */

/* Debounce Function
 * Credit: underscore.js
 */
var debounce = (function() {
    var timeout;
    return function(func, wait, immediate) {
        var context = this, args = arguments,
        later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        },
        callNow;
        callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
})();

/*
 * Page Specific Functionality
 */
var contentGrid = (function() {
    var pub = {
        init : function() {
            var $contentGrid = $jQ('#main-column .content-grid'),
            $contentItems = $contentGrid.find('.content-item'),
            $quickviewLinks = $contentItems.find('.quick-view');
            if(!isTouch) {
                $contentItems.hover(pub.productTileEnter,pub.productTileLeave);
                $quickviewLinks.on('click',pub.quickViewHandler);
            }
        },
        productTileEnter : function() {
            $jQ(this).addClass('over');
            $jQ(this).find('.content-hover').stop(true,true).fadeIn('fast');
            $jQ(this).find('.content-detail').stop(true,true).animate( { opacity:0 }, 'fast');
        },
        productTileLeave : function() {
            $jQ(this).removeClass('over');
            $jQ(this).find('.content-hover').fadeOut('fast');
            $jQ(this).find('.content-detail').animate( { opacity:1 }, 'fast');
        },
        quickViewHandler : function() {
            var $quickView = $jQ('#quick-view-overlay'),
            $contentTile = $jQ(this).parent().parent(),
            $cTposition = $contentTile.position();
            console.log('content tile height: %d', $contentTile.outerHeight());
            $quickView.css(
                {
                    'display' : 'block',
                    'position' : 'absolute',
                    'top' : $cTposition.top ,
                    'right' : 0,
                    'height' : ( $contentTile.outerHeight() * 2 ) - 1,
                    'background-color' : '#FFF',
                    'z-index' : '99999'
                }
            );
            console.log('window height: %d\nscrolltop of clicked product: %d',$jQ(window).height(),$cTposition.top);
            $jQ('html, body').animate( {
                scrollTop : $cTposition.top + ($contentTile.outerHeight() / 2 )
            }, 'slow', function() {
                $jQ(document).one(
                    {
                        'resize.quickView' : function(e) {
                            console.log('resizin');
                            $quickView.fadeOut('fast');
                        },
                        'scroll.quickView' : function(e) {
                            console.log('scrollin');
                            if(!$jQ(e.target).hasClass('.quick-view')) {
                                $quickView.fadeOut('fast');
                            }
                        }
                    }
                );
                $jQ(document).on('mouseup.quickView', function(e) {
                    console.log(e.target);
                    if ($jQ(e.target).closest($quickView).length === 0 && !$jQ(e.target).hasClass('.quick-view') ) {
                        $quickView.fadeOut('fast');
                        $jQ(document).off('mouseup.quickView');
                    }
                });
            });
        }
    };
    return pub;
}());

/* begin Search Results Page */

var searchResults = {
    styleDropDown : function () {
        $jQ("#sort-options").uniform();
    }
};

/* end Search Results Page */

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
/*
 * Enable and Fire Page Specific Functionality
 */

VZ = {
    config : {
        // container for commonly used configs throughout site
    },
    common : {
        init : function() {
            // initialize things that are used on every page
        },
        finalize: function() {
            // non priority calls go here, runs after all init functions
        }
    },
    'content-grid-page' : {
        init : function() {
            contentGrid.init();
            contentFilter.init();
        }
    },
    'product-detail' : {
         init : function() {
         //  flexslider set-up
            $jQ('#thumbs').flexslider({
                animation: "slide",
                controlNav: false,
                animationLoop: false,
                slideshow: false,
                itemWidth: 45,
                itemMargin: 10,
                asNavFor: '#focus'
            });

            $jQ('#focus').flexslider({
                animation: "slide",
                controlNav: false,
                animationLoop: true,
                slideshow: false,
                sync: "#thumbs"
                });

        // ONLOAD: force cart layout

            setTimeout(function() {
            // cart-block height
                var heroHt = $jQ('#pdp-hero').height();
                $jQ('#cart-block').css('height', heroHt + 'px' );
            }, 200);

        //RESIZE: force cart layout

            $jQ(window).resize(
                debounce(function(){
                    var resizePg = $jQ(document).width();
                    var resizeHt = $jQ('#carousel').height();
                // force cart-block on resize 768 and above
                    if (resizePg > 767) {
                        $jQ('#cart-block').css('height', resizeHt + 'px' );
                    }
                }, 500)
            );//end resizing
        }
    },
    'search-results-page' : {
        init : function() {
            searchResults.styleDropDown();
        }
    }
};



/*
 * Markup-based DOM-Ready Execution
 * Credit: Paul Irish - http://paulirish.com/2009/markup-based-unobtrusive-comprehensive-dom-ready-execution/
 */

UTIL = {
    fire : function(func, funcname, args) {
        var namespace = VZ;  // indicate your obj literal namespace here
        funcname = (funcname === undefined) ? 'init' : funcname;
        if (func !== '' && namespace[func] && typeof namespace[func][funcname] === 'function') {
            namespace[func][funcname](args);
        }
    },
    loadEvents : function() {
        var bodyId = document.body.id;
        UTIL.fire('common');
        $jQ.each(document.body.className.split(/\s+/),function(i, classnm) {
            UTIL.fire(classnm);
            UTIL.fire(classnm, bodyId);
        });
        UTIL.fire('common', 'finalize');
    }
};

// Initialize
$jQ(document).ready(UTIL.loadEvents);