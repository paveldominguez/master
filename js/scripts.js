var $jQ = jQuery.noConflict(), // Prevent any future library conflicts
MLS = {}, // Container for firing common and page-specic JavaScript
MLSUTIL = {}, //
isTouch = $jQ('html.touch').length > 0 ? true : false,
R = this.Response;

/* Response.js Hook */
Response.create({
    prop: 'width', // property to base tests on
    prefix: 'r src', // custom aliased prefixes
    breakpoints: [0, 320, 768, 1024, 1280], // custom breakpoints
    lazy: true // enable lazyloading
});

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
            $jQ(this).next('label').removeClass('success');

        }
    });
    $jQ(':text').blur();
    $jQ(active).focus();
    $jQ('form').submit(function () {
        $jQ(this).find('.hasPlaceholder').each(function () { $jQ(this).val(''); });
    });
}

function navHelpHandler(needHelp, opts) {
    if (R.viewportW() < 1024 && R.viewportW() >= 768) {
        needHelp.on('click', function () {
            opts.fadeToggle('fast');
        });
    } else {
        needHelp.off('click');
        opts.attr('style', '');
    }
}

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
            // iniitialize site nav tabs
            MLS.ui.navTabs('#mls-nav');
            MLS.ui.navTabs('#mls-nav-mobile');
            MLS.ui.navAccordion('#nav-mobile-tab1 .accordion-nav');
            MLS.ui.tabs('#nav-tab2', true);
            MLS.article.init();
            MLS.cart.dd.init();
            MLS.ui.complexItem.init();

            var navHelp = $jQ('#nav-help'),
            needHelp = navHelp.find('.need-help'),
            opts = navHelp.find('.help-options-container');
            navHelpHandler(needHelp, opts);

            win.on('resize', function () { // this is for debugging purposes, can be removed when no longer needed
                debounce(function () {
                    navHelpHandler(needHelp, opts);
                    console.log('Window width: %dpx', win.width());// DEBUG FOR MEDIA QUERIES, WILL NOT BE IN FINAL JS
                }, 300);
            });
        },
        finalize: function () {
            // non priority calls go here, runs after all init functions
        }
    },
    'home-page' : {
        init : function () {
            MLS.header.init();
            MLS.home.init();
            MLS.miniCart.init();
        }
    },
    'brand-landing-page' : {
        init : function () {
            // $jQ('#sort-options').uniform();
            MLS.header.init();
            contentGrid.init();
            MLS.ajax.colorPicker.init();

            MLS.contentFilter.init({
                endpoint: MLS.ajax.endpoints.PRODUCT_LISTING,
                container: $jQ('#main-column .content-grid'),
                callback: function () {
                    contentGrid.reInit();
                }
            });

            MLS.miniCart.init();
        }
    },
    'cart-page': {
    	init : function () {
            MLS.header.init();
            MLS.cart.init();
            MLS.miniCart.init(null, MLS.cart.options);
        }
    },
    'checkout-page': {
        init : function () {
            MLS.header.init();
            MLS.checkout.init();
            MLS.miniCart.init(null, MLS.checkout.options);
        }
    },
    'checkout-success-page': {
        init : function () {
            MLS.header.init();
            MLS.ui.socialShare.init();
            MLS.productDetail.init();
            MLS.miniCart.init();
        }
    },
    'content-landing-page' : {
        init : function () {
            //searchResults.styleDropDown();
            MLS.header.init();
            contentGrid.init();
            contentLanding.init();

            MLS.contentFilter.init({
                endpoint: MLS.ajax.endpoints.CONTENT_FILTER,
                callback: function () {
                    MLS.article.init();
                    MLS.ui.socialShare.init();
                    contentLanding.reInit();
                },
                container: $jQ('#main-column')
            });

            MLS.miniCart.init();
            MLS.ui.socialShare.init();

            //tabs
            $jQ('.category-tabs li a').on('click', function (e) {
                var tab = $jQ(this).attr('href'),
                    type = $jQ('.tab-content-wrapper[data-tab=' + tab + ']').attr('data-type'),
                    results = $jQ('.tab-content-wrapper[data-tab=' + tab + ']').attr('data-result-count');

                // e.preventDefault();

                $jQ('.category-tabs li a').parent().removeClass('active');
                $jQ(this).parent().addClass('active');
                $jQ('.tab-content-wrapper').removeClass('active');
                $jQ('.tab-content-wrapper[data-tab=' + tab + ']').addClass('active');
                $jQ('.content-landing-header .results-count').text(results);
                $jQ('.content-landing-header .type').text(type);
            });

            if (document.location.hash != "")
            {
                $jQ('.category-tabs li a[href*=' + document.location.hash.substr(1) + ']').click();
            }
        }
    },
    'category-landing-page' : {
        init : function () {
            MLS.header.init();
            MLS.categoryLanding.init();
            contentGrid.init();
            MLS.ajax.colorPicker.init();

            MLS.contentFilter.init({
                endpoint: MLS.ajax.endpoints.CATEGORY_PAGE,
                container: $jQ('#main-column'),
                callback: function () {
                     contentGrid.reInit();
                     MLS.categoryLanding.init();
                     MLS.article.init();
                }
            });

            MLS.miniCart.init();
        }
    },
    'lifestyle-landing-page' : {
        init : function() {
            MLS.header.init();
            MLS.lifestyle.init();
            contentGrid.init();
            MLS.miniCart.init();
        }
    },
    'product-listing-page' : {

        init : function () {
            MLS.header.init();
            contentGrid.init();
            MLS.miniCart.init();
            MLS.ajax.colorPicker.init();

            MLS.contentFilter.init({
                endpoint: MLS.ajax.endpoints.PRODUCT_LISTING,
                container: $jQ('#main-column .content-grid'),
                callback: function () {
                    contentGrid.reInit();
                }
            });

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
        init : function () {
            MLS.header.init();
            MLS.ui.socialShare.init();
            MLS.productDetail.init();
            MLS.miniCart.init();
        }
    },

    'search-results-page' : {
        init : function() {
            MLS.header.init();
            $jQ("#sort-options").uniform();
            contentGrid.init();
            MLS.ajax.colorPicker.init();
            MLS.contentFilter.init({
                endpoint: MLS.ajax.endpoints.PRODUCT_LISTING,
                container: $jQ('#main-column .content-grid'),
                callback: function () {
                    contentGrid.reInit();
                }
            });
            MLS.ajax.cart.init();
        }
    },

    'special-offers-landing-page' : {
        init : function() {
            MLS.header.init();
            contentGrid.init();
            MLS.miniCart.init();
            MLS.specialOffers.init();
            MLS.ajax.colorPicker.init();

            MLS.contentFilter.init({
                endpoint: MLS.ajax.endpoints.SPECIAL_OFFERS,
                container: $jQ('#main-column'),
                callback: function () {
                    contentGrid.reInit();
                    MLS.specialOffers.init();
                }
            });
        }
    },
    'fourofour-page' : {
        init : function() {
            MLS.header.init();
            MLS.page404.init();
            contentGrid.init();
            MLS.miniCart.init();
        }
    }

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

$jQ("#lightbox-email-send").uniform(); // make selects pretty


