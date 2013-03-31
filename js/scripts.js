var $jQ = jQuery.noConflict(), // Prevent any future library conflicts
MLS = {}, // Container for firing common and page-specic JavaScript
MLSUTIL = {}, //
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
 * Cross Browser Placeholder
 */
jQuery(function() {
    jQuery.support.placeholder = false;
    var test = document.createElement('input');
    if('placeholder' in test) {jQuery.support.placeholder = true;}
});
if(!$jQ.support.placeholder) {
    var active = document.activeElement;
    $jQ(':text').focus(function () {
        if ($jQ(this).attr('placeholder') !== '' && $jQ(this).val() === $jQ(this).attr('placeholder')) {
            $jQ(this).val('').removeClass('hasPlaceholder');
        }
    }).blur(function () {
        if ($jQ(this).attr('placeholder') !== '' && ($jQ(this).val() === '' || $jQ(this).val() === $jQ(this).attr('placeholder'))) {
            $jQ(this).val($jQ(this).attr('placeholder')).addClass('hasPlaceholder');
        }
    });
    $jQ(':text').blur();
    $jQ(active).focus();
    $jQ('form').submit(function () {
        $jQ(this).find('.hasPlaceholder').each(function() { $jQ(this).val(''); });
    });
}

/*
 * Page Specific Functionality
 */


/*
 * Enable and Fire Page Specific Functionality
 */

MLS = {
    config : {
        // container for commonly used configs throughout site
    },
    common : {
        init : function() {
            // initialize things that are used on every page
            var win = $jQ(window);
            $jQ(window).on('resize', function() { // this is for debugging purposes, can be removed when no longer needed
                debounce(function() {
                    console.log('Window width: %dpx', win.width());
                }, 300);
            });
            // END - FOR DEBUGGING MEDIA QUERIES, WILL NOT BE IN FINAL JS
            // iniitialize site nav tabs
            MLS.ui.navTabs('#mls-nav');
            MLS.ui.navTabs('#mls-nav-mobile');
            MLS.ui.navAccordion('#nav-mobile-tab1 .accordion-nav');
            MLS.ui.tabs('#nav-tab2');
        },
        finalize: function() {
            // non priority calls go here, runs after all init functions
        }
    },
    'home-page' : {
        init : function() {
            MLS.home.init();
        }
    },
    'brand-landing-page' : {
        init : function() {
            $jQ("#sort-options").uniform();
            contentGrid.init();
            contentFilter.init();
            MLS.ajax.cart.init();
        }
    },
    'content-landing-page' : {
        init : function() {
            //searchResults.styleDropDown();
            contentFilter.init();
            MLS.ajax.article.init();
        }
    },
    'category-listing-page' : {
        init : function() {
            contentGrid.init();
            contentFilter.init();
            MLS.ajax.cart.init();
        }
    },
    'lifestyle-landing-page' : {
        init : function() {
            contentFilter.init();

            //gallery
            $jQ('#lifestyle-gallery').flexslider({
                animation: 'slide',
                controlsContainer: '#lifestyle-gallery .slide-nav',
                animationLoop: false,
                controlNav: false,
                directionNav: true,
                slideshow: false,
                animationSpeed: 500,
                itemWidth: $jQ(window).outerWidth() * 0.93
            });
            $jQ(window).resize(function() {
                $jQ('#lifestyle-gallery').data('flexslider').setOpts({itemWidth: $jQ(window).outerWidth() * 0.93});
            });

            //guides
            $jQ('#lifestyle-guides').flexslider({
                animation: 'slide',
                controlsContainer: '#lifestyle-guides .slide-nav',
                animationLoop: false,
                controlNav: false,
                directionNav: true,
                slideshow: false,
                animationSpeed: 500
            });

            //product pinterst gallery
            $jQ('#lifestyle-product-board').flexslider({
                animation: 'slide',
                controlsContainer: '#lifestyle-product-board .slide-nav',
                animationLoop: false,
                controlNav: false,
                directionNav: true,
                slideshow: false,
                animationSpeed: 500
            });

            //user reviews
            $jQ('#lifestyle-user-reviews').flexslider({
                animation: 'slide',
                controlsContainer: '#lifestyle-user-reviews .slide-nav',
                animationLoop: false,
                controlNav: false,
                directionNav: true,
                slideshow: false,
                animationSpeed: 500
            });

            //gallery
            $jQ('#lifestyle-products').flexslider({
                animation: 'slide',
                controlsContainer: '#lifestyle-products .slide-nav',
                animationLoop: false,
                controlNav: false,
                directionNav: true,
                slideshow: false,
                animationSpeed: 500,
                itemWidth: $jQ(window).outerWidth() * 0.85
            });
            $jQ(window).resize(function() {
                $jQ('#lifestyle-products').data('flexslider').setOpts({itemWidth: $jQ(window).outerWidth() * 0.85});
            });
        }
    },
    'product-listing-page' : {
        init : function() {
            contentGrid.init();
            contentFilter.init();
            MLS.ajax.cart.init();
            // simple offer toggle..
            // may break out into a general module that handles interactions (if other js is necessary) in offers
            var hdrOffer = $jQ('#spec-offer-header'),
            hdrOfferHeight = hdrOffer.outerHeight();
            hdrOffer.find('.offer-actions .toggle').on('click', function(e) {
                e.preventDefault();
                hdrOffer.toggleClass('open');
                /*
                hdrOffer.toggleClass('open', 1600).promise().done(function() {
                    var height = hdrOffer.hasClass('open') ? hdrOffer.prop('scrollHeight') : hdrOfferHeight;
                    hdrOffer.animate({ height: height }, 'slow');
                });
                */
            });
            // end offer toggle
        }
    },
    'product-detail' : {
        init : function() {
            productDetail.init();
        }
    },
    'search-results-page' : {
        init : function() {
            $jQ("#sort-options").uniform();
            contentGrid.init();
            contentFilter.init();
            MLS.ajax.cart.init();
        }
    }
};



/*
 * Markup-based DOM-Ready Execution
 * Credit: Paul Irish - http://paulirish.com/2009/markup-based-unobtrusive-comprehensive-dom-ready-execution/
 */

MLSUTIL = {
    fire : function(func, funcname, args) {
        var namespace = MLS;  // indicate your obj literal namespace here
        funcname = (funcname === undefined) ? 'init' : funcname;
        if (func !== '' && namespace[func] && typeof namespace[func][funcname] === 'function') {
            namespace[func][funcname](args);
        }
    },
    loadEvents : function() {
        var bodyId = document.body.id;
        MLSUTIL.fire('common');
        $jQ.each(document.body.className.split(/\s+/),function(i, classnm) {
            MLSUTIL.fire(classnm);
            MLSUTIL.fire(classnm, bodyId);
        });
        MLSUTIL.fire('common', 'finalize');
    }
};

// Initialize
$jQ(document).ready(MLSUTIL.loadEvents);