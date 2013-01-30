var $jQ = jQuery.noConflict(), // Prevent any future library conflicts
VZ = {}, // Container for firing common and page-specic JavaScript
UTIL = {}, //
isTouch = $jQ('html.touch').length > 0 ? true : false;

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
            if (!immediate) { func.apply(context, args); }
        },
        callNow;
        callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) { func.apply(context, args); }
    };
})();

/*
 * Page Specific Functionality
 */
var productGrid = {
    productHover : function() {
        $jQ('#product-grid .product').on({
            mouseenter : function() {
                $jQ(this).addClass('over');
                $jQ(this).find('.product-hover').fadeIn('fast');
            },
            mouseleave : function() {
                $jQ(this).removeClass('over');
                $jQ(this).find('.product-hover').fadeOut('fast');
            }
        });
    }
};

var contentFilter = (function() {
    var $cf = $jQ('#content-filter');
    var _contentFilter = {
        init : function() {
            var $fs = $jQ('#filter-selections'),
            $collapsible = $cf.find('.collapsible .dimension-header'),
            $multi = $cf.find('.multi-select .facet'),
            $removable = $fs.find('.removable');

            $cf.find('.facet, .dimension-header').on('click', _contentFilter.clickBridge);

            $jQ('#clear-selections').on('click', function(e) {
                e.preventDefault();
                $removable.each(function() {
                    $jQ(this).fadeOut('medium', function() { $jQ(this).remove(); });
                });
            });
            $collapsible.not(':first').next().toggle('slow'); // collpase all but first dimension
            $collapsible.on('click', _contentFilter.toggleDimension); // handle dimension expansion/collapse
            $multi.on('click', _contentFilter.multiFacetHandler); // handle clicks of multi-facet selection
            $removable.on('click', _contentFilter.removableHandler);
        },
        clickBridge : function(e) {
            e.preventDefault();

        },
        toggleDimension : function(e) {
            e.preventDefault();
            $jQ(this).next().toggle('fast');
        },
        multiFacetHandler : function(e) {
            e.preventDefault();
            $jQ(this).toggleClass('selected');
        },
        removableHandler : function(e) {
            e.preventDefault();
            $jQ(this).animate(
                {
                    left : -($cf.width()),
                    opacity : 0
                },
                'slow',
                function() {
                    $jQ(this).remove();
                }
            );
        }
    };
    return _contentFilter;
})();
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
    'product-list' : {
        init : function() {
            if(!isTouch) {
                productGrid.productHover();
            }
            contentFilter.init();
        }
    },
    'product-detail' : {
         init : function() {
         // general use
             var pgWidth = $jQ(document).width();


         // HERO flexslider set-up
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


		// HERO onload: force cart layout
			setTimeout(function() {

			// force cart-block height: tablet & above
				if (pgWidth > 767) {
					var heroHt = $jQ('#pdp-hero').height();
					$jQ('#cart-block').css('height', heroHt + 'px' );
					}

			}, 200);// end onload layout


		// HERO resize: force cart layout
			$(window).resize(function(){
					var resizePg = $jQ(document).width();
					var resizeHt = $jQ('#carousel').height();
				// force cart-block	on resize: tablet & above
					if (resizePg > 767) {
						$jQ('#cart-block').css('height', resizeHt + 'px' );
					} else {
						$jQ('#cart-block').css('height', 'auto' );
					}

			});//end resize layout


		// HERO flexslider: active thumb animation

			//onload: apply vzn-active
			$('#thumbs .flex-active-slide').find('.vzn-active').css('width', '45px');

			//onclick: fadeIn current, fadeOut last
			$jQ('#thumbs li').click(function () {
				$(this).siblings().find('.vzn-active').stop().animate({
					'width':'0px'
				}, 250 );
				$(this).find('.vzn-active').stop().animate({
					'width':'45px'
				}, 500 );
			}); /* end onclick */


		// DETAILS : switch active to overview below 768

			//onload
			if (pgWidth < 769) {
					$jQ('#detail-tabs .details').removeClass('active');
					$jQ('#detail-tabs .overview').addClass('active');
				} else {
					$jQ('#detail-tabs .details').addClass('active');
				}/* end onload */

			//resize
			$(window).resize(function(){
				var resizePg = $jQ(document).width();
				if (resizePg < 769) {
						$jQ('#detail-tabs .details').removeClass('active');
						$jQ('#detail-tabs .overview').addClass('active');
					} else {
						$jQ('#detail-tabs .details').addClass('active');
					}
			});/* end resize */



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