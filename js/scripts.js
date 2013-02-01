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


    //======================== PDP Hero =================================

         // HERO: flexslider set-up
            $jQ('#thumbs').flexslider({
                animation: "slide",
                controlNav: false,
                animationLoop: true,
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


        // HERO: zoom flexslider set-up
            $jQ('#zoom-focus').flexslider({
                animation: "slide",
                controlNav: "thumbnails"
            });



        // HERO : force cart layout

            //onload: cart layout tablet & above

            setTimeout(function() {
                var pgWidth = $jQ(document).width();
                var heroHt = $jQ('#pdp-hero').height();
                if (pgWidth > 767) {
                    $jQ('#cart-block').css('height', heroHt + 'px' );
                    }
            }, 200);


            // resize: cart layout
            $(window).resize(function(){
                    var resizePg = $jQ(document).width();
                    var resizeHt = $jQ('#carousel').height();
                // force cart-block on resize: tablet & above
                    if (resizePg > 767) {
                        $jQ('#cart-block').css('height', resizeHt + 'px' );
                    } else {
                        $jQ('#cart-block').css('height', 'auto' );
                    }
            });


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



        // HERO color selection
        $jQ('.color-option').click(function(){
            $jQ(this).parent().find('.selected').removeClass('selected');
            $jQ(this).addClass('selected');
        });


        // ------------- HERO flexslider : ZOOM functions -----------------------

            //ONLOAD : insert elements into flexslider js generated nav (once)
                // center thumb nav
                    $jQ('#zoom-block .flex-control-thumbs').wrap('<div class="center-thumbs"><div class="center-block">');
                // active thumb element
                    $jQ('<div class="vzn-active"></div>').appendTo('#zoom-block .flex-control-thumbs li');
                // color selector
                    $jQ('<div class="rounded"><ul id="avail-colors" class="inline-list"><li class="color-option black "><div class="select-area"></div></li><li class="color-option grey "><div class="select-area"></div></li><li class="color-option white selected"><div class="select-area"></div></li><li class="color-option blue"><div class="select-area"></div></li></ul></div>')
                        .appendTo('.center-block');

            // ONCLICK : carousel zoom
            $jQ('#carousel-zoom').click(function () {

                $jQ('html,body').scrollTop(0);

                var pgHeight = ($jQ(window).height() - 60);
                var leftStart = ($jQ(window).width() / -1);
                var leftFinish = $jQ(window).width();

                // Panel setup -------------------------------------------------

                // set start position for fixed zoom panel
                $jQ('#zoom-block').css('left', leftStart +'px').css('height', pgHeight + 'px');

                //set up window specific for layout for fixed zoom panel
                $jQ('#zoom-carousel-block').css('width', pgHeight + 'px').css('height', pgHeight + 'px');
                $jQ('#zoom-focus .flex-viewport li').css('width', pgHeight + 'px').css('height', pgHeight + 'px' ).css('min-width', pgHeight + 'px').css('min-height', pgHeight + 'px' );



                // BRING IT! -----------------------------------------------------
                $jQ('#zoom-block').css('height', pgHeight + 'px').transition({ x : leftFinish + 'px',
                    easing: 'snap',
                    duration: '1100ms'});
                //snap after to reset flexslider transform values
                $jQ(window).trigger('resize');

                // lose vertical scroll
                setTimeout(function() {
                    $jQ('.product-detail').addClass('body-zoom');
                }, 1100 );

                // fade in controls
                setTimeout(function() {
                    $jQ('#zoom-block .center-block, #zoom-close, #zoom-controls').fadeIn('slow');
                }, 500);


                // add in current thumb & color selection -----------------------------------
                    //onload: show vzn-active on current
                    $jQ('#zoom-block .flex-control-thumbs .flex-active').parent().find('.vzn-active').css('width', '100%' );

                    //onclick: fadeIn vzn-active, fadeOut
                    $jQ('#zoom-block .flex-control-thumbs li').click(function () {
                    $jQ(this).siblings().find('.vzn-active').stop().animate({
                        'width':'0px'
                        }, 250 );
                    $jQ(this).find('.vzn-active').stop().animate({
                        'width': '100%'
                        }, 500 );
                    }); /* end thumb onclick */

                    // color selection
                    $jQ('.color-option').click(function(){
                        $jQ(this).parent().find('.selected').removeClass('selected');
                        $jQ(this).addClass('selected');
                    });


                //set lefthand zoom controls ----------------------------------------
                // bigger
                $jQ('#zoom-controls .bigger').click(function () {

                    // get & store current
                    var startWd = $jQ(this).parents('#zoom-block').find('#zoom-carousel-block').width();
                    $jQ(this).parent().siblings('#zoom-carousel-block').attr('data-current', startWd );

                    // window
                    $jQ(this).parent().siblings('#zoom-carousel-block').
                        transition({ width: '90%', easing: 'snap', duration:'1000ms'});

                    // images
                    $jQ(this).parents('#zoom-block').find('#zoom-slides .flex-active-slide').siblings().css('opacity', '0');

                    $jQ(this).parents('#zoom-block').find('#zoom-slides li').transition({
                        marginRight: '5px', duration: '10ms'}).transition({
                        scale:1.5, easing: 'snap', duration: '2000ms', delay: 500, queue:false }).
                        transition({ x: '15%', duration: '2000ms', queue:false });

                    // add nav class
                    $jQ('#zoom-focus .flex-control-thumbs').addClass('big-nav');

                    // snap
                    $jQ(window).trigger('resize');

                }); /* end bigger */

                // smaller
                $jQ('#zoom-controls .smaller').click(function () {

                    // get stored
                    var startWd = $jQ(this).parents('#zoom-block').find('#zoom-carousel-block').attr('data-current');

                    //increment
                    $jQ('#zoom-slides').css('-webkit-transform', startWd + 'px');

                    // restore
                    $jQ(this).parents('#zoom-block').find('#zoom-slides li').siblings().css('opacity', '1');

                    // window
                    $jQ(this).parent().siblings('#zoom-carousel-block').
                        transition({ width: startWd +'px', easing: 'snap', duration:'500ms'});


                    // image li
                    $jQ(this).parents('#zoom-block').find('#zoom-slides li').stop().transition({
                        width: startWd +'px', easing: 'snap', duration: '500ms', queue:false }).
                        transition({ scale:1, easing: 'snap', duration: '500ms',  queue:false }).
                        transition({ x: '0', duration: '500ms', queue:false }).
                        transition({ marginRight: '5px', duration: '500ms', queue:false });

                    // image
                    $jQ(this).parents('#zoom-block').find('#zoom-slides li img').transition({
                        maxWidth: startWd +'px', easing: 'snap', duration: '2000ms', queue:false }).
                        transition({ x: '0', duration: '2000ms', queue:false }).
                        transition({ marginRight: '5px', duration: '2000ms', queue:false });

                    // remove nav class
                    $jQ('#zoom-focus .flex-control-thumbs').removeClass('big-nav');

                    // snap
                    $jQ(window).trigger('resize');


                }); /* end smaller */




                // CLOSE IT! ----------------------------------------------------------
                $jQ('#zoom-close').click(function () {

                    // fade out controls
                    setTimeout(function() {
                        $jQ('#zoom-block .center-block, #zoom-close, #zoom-controls').fadeOut('slow');
                    }, 250);

                    //lose it
                        $jQ('#zoom-block').transition({ x : leftStart + 'px',
                            easing: 'out',
                            duration: '1000ms' } );

                    // restore vertical scroll
                        setTimeout(function() {
                            $jQ('.product-detail').removeClass('body-zoom');
                        }, 400 );
                }); // end set close

            }); // end carousel onclick


            // RESIZE : carousel zoom -----------------------------------------------
            $(window).resize(function(){
                var zoomResize = ($jQ(window).height() - 60 );
                $jQ('#zoom-block').css('height', zoomResize + 'px' );
                $jQ('#zoom-carousel-block').css('width', zoomResize + 'px').css('height', zoomResize + 'px' ).css('min-height', zoomResize + 'px' );
                $jQ('#zoom-focus .flex-viewport li').css('width', zoomResize + 'px').css('min-width', zoomResize + 'px').css('min-height', zoomResize + 'px' );


            }); // ------------- HERO : end all ZOOM functions ----------------------




    //=============================== PDP Below the Fold =============================

        // DETAILS tabs: active thumb animation

            //onload: show vzn-active on current
            $jQ('#detail-tabs .active').find('.vzn-active').css('width', '100%' );

            //resize: show vzn-active on current
            $(window).resize(function(){
                $jQ('#detail-tabs .active').find('.vzn-active').css('width', '100%' );
            });/* end resize */


            //onclick: fadeIn current, fadeOut last
            $jQ('#detail-tabs a').click(function () {
                $jQ(this).parent().siblings().find('.vzn-active').stop().animate({
                    'width':'0px'
                }, 250 );
                $jQ(this).parent().find('.vzn-active').stop().animate({
                    'width': '100%'
                }, 500 );
            }); /* end onclick */

        // SIMPLE CAROUSEL tabs: active thumb animation

            //onload: show vzn-active on current
            $jQ('#simple-carousel-tabs .active').find('.vzn-active').css('width', '100%' );

            //resize: show vzn-active on current
            $(window).resize(function(){
                $jQ('#simple-carousel-tabs .active').find('.vzn-active').css('width', '100%' );
            });/* end resize */


            //onclick: fadeIn current, fadeOut last
            $jQ('#simple-carousel-tabs a').click(function () {
                $jQ(this).parent().siblings().find('.vzn-active').stop().animate({
                    'width':'0px'
                }, 250 );
                $jQ(this).parent().find('.vzn-active').stop().animate({
                    'width': '100%'
                }, 500 );
            }); /* end onclick */


        // REVIEWS tabs: active thumb animation

            //onload: show vzn-active on current
            $jQ('#review-tabs .active').find('.vzn-active').css('width', '100%' );

            //resize: show vzn-active on current
            $(window).resize(function(){
                $jQ('#review-tabs .active').find('.vzn-active').css('width', '100%' );
            });/* end resize */


            //onclick: fadeIn current, fadeOut last
            $jQ('#review-tabs a').click(function () {
                $jQ(this).parent().siblings().find('.vzn-active').stop().animate({
                    'width':'0px'
                }, 250 );
                $jQ(this).parent().find('.vzn-active').stop().animate({
                    'width': '100%'
                }, 500 );
            }); /* end onclick */



        // FANCY CAROUSEL tabs: active thumb animation

            //onload: show vzn-active on current
            $jQ('#fancy-carousel-tabs .active').find('.vzn-active').css('width', '100%' );

            //resize: show vzn-active on current
            $(window).resize(function(){
                $jQ('#fancy-carousel-tabs .active').find('.vzn-active').css('width', '100%' );
            });/* end resize */


            //onclick: fadeIn current, fadeOut last
            $jQ('#fancy-carousel-tabs a').click(function () {
                $jQ(this).parent().siblings().find('.vzn-active').stop().animate({
                    'width':'0px'
                }, 250 );
                $jQ(this).parent().find('.vzn-active').stop().animate({
                    'width': '100%'
                }, 500 );
            }); /* end onclick */
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