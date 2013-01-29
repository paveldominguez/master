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
var productGrid = {
    productHover : function() {
        $jQ('#product-grid .product').on({
            mouseenter : function() {
                $jQ(this).addClass('over');
                $jQ(this).find('.product-hover').fadeIn('fast');
                $jQ(this).find('.rating img').attr('src','img/stars.png'); // temporary..
            },
            mouseleave : function() {
                $jQ(this).removeClass('over');
                $jQ(this).find('.product-hover').fadeOut('fast');
                $jQ(this).find('.rating img').attr('src','img/stars-gray.png'); // temporary..
            },
            click : function(e) {
                if(typeof console !== undefined) console.log(e.target);
            }
        });
    }
};

var contentFilter = (function() {
    // any private functions would go here..
    var _contentFilter = {
        init : function() {
            var cf = $jQ('#content-filter'),
            collapsible = cf.find('.collapsible .dimension-header'),
            multi = cf.find('.multi-select .facet');

            collapsible.not(':first').next().toggle('slow'); // collpase all but first dimension
            collapsible.on('click', _contentFilter.toggleDimension); // handle dimension expansion/collapse
            multi.on('click', _contentFilter.multiFacetHandler); // handle clicks of multi-facet selection
        },
        toggleDimension : function(e) {
            e.preventDefault();
            $jQ(this).next().toggle('fast');
        },
        multiFacetHandler : function(e) {
            e.preventDefault();
            $jQ(this).toggleClass('selected');
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
            // REMOVE THIS CODE LATER ***
            var doc = $jQ(window);
            $jQ(window).on('resize', function() { // this is for debugging purposes, can be removed when no longer needed
                debounce(function() {
                    if(typeof console !== undefined) console.log('Document width: %dpx', doc.width());
                }, 200);
            });
            // END REMOVE THIS CODE LATER ***
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
    }
};



/* ================== PDP functions ==============================*/

/*------------------- HERO section  --------------------- */

var pageWidth = $jQ(document).width();

/* hero image override onload using cart height to max out */

var cartHt = $jQ('#pdp-hero #cart-block').height();

// 768 & up: tie main image size to cart height on load 
	if (pageWidth == 768){ 
			$jQ('#pdp-hero #carousel-block #the-carousel .focus').css( 'width', cartHt + 'px');
			$jQ('#the-carousel').css( 'width', cartHt + 'px');
		} else if (pageWidth > 999) {
			$jQ('#pdp-hero #carousel-block #the-carousel .focus').css( 'width', cartHt + 'px');
			$jQ('#the-carousel').css( 'width', cartHt + 'px');
		}
			
// tablet portrait: crop image by shoving to left		
			if ( pageWidth == 768 ) {
				$jQ('#pdp-hero #carousel-block #the-carousel .focus').css( 'margin-left', '-30%');
			}
			else {
				$jQ('#pdp-hero #carousel-block #the-carousel .focus').css( 'margin-left', '0px');
			}
/* end hero image onload */		


/* 768 & up: tie main image size to cart height on window resize */

	$(window).resize(function(){
	
		var resizePage = $jQ(document).width();
		var resizeCart = $jQ('#pdp-hero #cart-block').height();
		
	if (resizePage == 768) {
			$jQ('#pdp-hero #carousel-block #the-carousel .focus').css( 'width', resizeCart + 'px');
			$jQ('#the-carousel').css( 'width', resizeCart + 'px');
		} else if (resizePage > 999) {
			$jQ('#pdp-hero #carousel-block #the-carousel .focus').css( 'width', resizeCart + 'px');
			$jQ('#the-carousel').css( 'width', resizeCart + 'px');
		} else if ((resizePage >768) && ( resizePage < 999)){
			$jQ('#pdp-hero #carousel-block #the-carousel .focus').css( 'width', '100%');
			$jQ('#the-carousel').css( 'width', '75%');
		
		}
		
		// tablet portrait: crop image by shoving to left	
			if ( resizePage == 768) {
				$jQ('#pdp-hero #carousel-block #the-carousel .focus').css( 'margin-left', '-30%');
			} else {
				$jQ('#pdp-hero #carousel-block #the-carousel .focus').css( 'margin-left', '0px');
			}
			
	}); 
/*  end hero image changes on window resize */

	
	
	
	

		

		






/* ================== END PDP ====================================*/




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