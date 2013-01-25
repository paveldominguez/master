var $jQ = jQuery.noConflict(), // Prevent any future library conflicts
VZ = {}, // Container for firing common and page-specic JavaScript
UTIL = {}; // Container for stuff..

VZ = {
// container for commonly used configs throughout site
    config : {

    },
    common : {
        init : function() {
            // REMOVE THIS CODE LATER...
            var doc = $jQ(window);
            $jQ(window).on('resize', function() { // this is for debugging purposes, can be removed when no longer needed
                debounce(function() {
                    console.log('Document width: %dpx', doc.width());
                }, 200);
            });
            // END REMOVE THIS CODE LATER...
        },
        finalize: function() {

        }
    },
    'product-category-list' : {
        init : function() {
            productDetail.productHover();
        }
    }
};

var productDetail = {
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
                console.log(e.target.innerHTML);
            }
        });
    }
};

/*
 * Debounce (Credit: underscore.js)
 *
 */
var debounce = (function() {
    var timeout;
    return function(func, wait, immediate) {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
})();



/* ================== PDP functions ==============================*/

/*------------------- HERO section  --------------------- */

var pageWidth = $(document).width();
var cartHt = $jQ('#pdp-hero #cart-block').height();

// tie main image size to cart height on load & shove it over on phablet
			$jQ('#pdp-hero #carousel-block #the-carousel .focus').css( 'width', cartHt + 'px');
			$jQ('#the-carousel').css( 'width', cartHt + 'px');
			
			if ( (pageWidth < 1024) && (pageWidth > 767)){
				$jQ('#pdp-hero #carousel-block #the-carousel .focus').css( 'margin-left', '-30%');
			}
		

// tie main image size to cart height on window resize & shove it over on phablet
	$(window).resize(function(){
		var resizePage = $(document).width();
		var resizeCart = $jQ('#pdp-hero #cart-block').height();
			$jQ('#pdp-hero #carousel-block #the-carousel .focus').css( 'width', resizeCart + 'px');
			$jQ('#the-carousel').css( 'width', resizeCart + 'px');
			
			if ( (resizePage < 1024) && (resizePage > 767)){
				$jQ('#pdp-hero #carousel-block #the-carousel .focus').css( 'margin-left', '-30%');
			} else {
				$jQ('#pdp-hero #carousel-block #the-carousel .focus').css( 'margin-left', '0px');
			}
			
		});

	
	
	
	

		

		






/* ================== END PDP ====================================*/




/*
 *
 * Markup-based DOM-Ready Execution
 * Credit: Paul Irish - http://paulirish.com/2009/markup-based-unobtrusive-comprehensive-dom-ready-execution/
 *
 */

UTIL = {
    fire : function(func,funcname, args){
    var namespace = VZ;  // indicate your obj literal namespace here
    funcname = (funcname === undefined) ? 'init' : funcname;
    if (func !== '' && namespace[func] && typeof namespace[func][funcname] == 'function'){
        namespace[func][funcname](args);
    }
},
loadEvents : function(){
    var bodyId = document.body.id;
    UTIL.fire('common');
    $jQ.each(document.body.className.split(/\s+/),function(i,classnm){
        UTIL.fire(classnm);
        UTIL.fire(classnm,bodyId);
    });
    UTIL.fire('common','finalize');
}
};

// Initialize
$jQ(document).ready(UTIL.loadEvents);