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
var debounce = (function () {
    var timeout;
    return function (func, wait, immediate) {
        var context = this, args = arguments,
        later = function () {
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
 * Cross Browser Placeholder
 */
jQuery(function () {
    jQuery.support.placeholder = false;
    var test = document.createElement('input');
    if ('placeholder' in test) {
        jQuery.support.placeholder = true;
    }
});
if (!$jQ.support.placeholder) {
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
        $jQ(this).find('.hasPlaceholder').each(function () { $jQ(this).val(''); });
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
        init : function () {
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
            MLS.ui.tabs('#nav-tab2', true);
            MLS.ajax.article.init();
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
            MLS.ajax.cart.init(document.body);
            MLS.ajax.colorPicker.init();
        }
    },
    'cart-and-checkout': {
    	init : function() {
    		MLS.cartCheckout.init();
    	}
    },
    'content-landing-page' : {
        init : function() {
            //searchResults.styleDropDown();
            contentGrid.init();
            contentFilter.init();
            MLS.ajax.article.init();
            //tabs
            $jQ('.category-tabs li a').on('click', function (e) {
                var tab = $jQ(this).attr('href');
                var type = $jQ('.tab-content-wrapper[data-tab='+tab+']').attr('data-type');
                var results = $jQ('.tab-content-wrapper[data-tab='+tab+']').attr('data-result-count');
                e.preventDefault();
                $jQ('.category-tabs li a').parent().removeClass('active');
                $jQ(this).parent().addClass('active');
                $jQ('.tab-content-wrapper').removeClass('active');
                $jQ('.tab-content-wrapper[data-tab='+tab+']').addClass('active');
                $jQ('.content-landing-header .results-count').text(results);
                $jQ('.content-landing-header .type').text(type);
            });
        }
    },
    'category-landing-page' : {
        init : function() {
            MLS.categoryLanding.init();
            contentGrid.init();
            MLS.ajax.colorPicker.init();
            contentFilter.init();
            MLS.ajax.cart.init(document.body);
        }
    },
    'lifestyle-landing-page' : {
        init : function() {
            contentFilter.init();
            MLS.lifestyle.init();
        }
    },
    'product-listing-page' : {
        init : function() {
            contentGrid.init();
            MLS.ajax.colorPicker.init();
            contentFilter.init();
            MLS.ajax.cart.init(document.body);
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
    'product-detail' : { // add -page
        init : function() {
            productDetail.init();
            MLS.ajax.cart.init('#add-cart-box .button span');
        }
    },
    // 'search-results-page' : {
    //     init : function() {
    //         $jQ("#sort-options").uniform();
    //         contentGrid.init();
    //         MLS.ajax.colorPicker.init();
    //         contentFilter.init();
    //         MLS.ajax.cart.init();
    //     }
    // },
    'special-offers-landing-page' : {
        init : function() {
            contentFilter.init();
            MLS.specialOffers.init();
        }
    },
  
};



/*
 * Markup-based DOM-Ready Execution
 * Credit: Paul Irish - http://paulirish.com/2009/markup-based-unobtrusive-comprehensive-dom-ready-execution/
 */

MLSUTIL = {
    fire : function (func, funcname, args) {
        var namespace = MLS;  // indicate your obj literal namespace here
        funcname = (funcname === undefined) ? 'init' : funcname;
        if (func !== '' && namespace[func] && typeof namespace[func][funcname] === 'function') {
            namespace[func][funcname](args);
        }
    },
    loadEvents : function () {
        var bodyId = document.body.id;
        MLSUTIL.fire('common');
        $jQ.each(document.body.className.split(/\s+/), function (i, classnm) {
            MLSUTIL.fire(classnm);
            MLSUTIL.fire(classnm, bodyId);
        });
        MLSUTIL.fire('common', 'finalize');
    }
};

// Initialize
$jQ(document).ready(MLSUTIL.loadEvents);