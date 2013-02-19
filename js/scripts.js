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

            var win = $jQ(window);
            $jQ(window).on('resize', function() { // this is for debugging purposes, can be removed when no longer needed
                debounce(function() {
                    console.log('Window width: %dpx', win.width());
                }, 300);
            });
            // END - FOR DEBUGGING MEDIA QUERIES, WILL NOT BE IN FINAL JS
        },
        finalize: function() {
            // non priority calls go here, runs after all init functions
        }
    },
    'category-listing-page' : {
        init : function() {
            contentFilter.init();
        }
    },
    'product-listing-page' : {
        init : function() {
            contentGrid.init();
            contentFilter.init();
        }
    },
    'product-detail' : {
        init : function() {
            productDetail.init();
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