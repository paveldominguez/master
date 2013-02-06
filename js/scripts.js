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
var productGrid = (function() {
    var pub = {
        init : function() {
            var $productGrid = $jQ('#product-grid'),
            $products = $productGrid.find('.product'),
            $quickviewLinks = $products.find('.quick-view');
            if(!isTouch) {
                $products.hover(pub.productTileEnter,pub.productTileLeave);
                $quickviewLinks.on('click',pub.quickViewHandler);
            }
        },
        productTileEnter : function() {
            $jQ(this).addClass('over');
            $jQ(this).find('.product-hover').stop(true,true).fadeIn('fast');
            $jQ(this).find('.product-detail').stop(true,true).animate( { opacity:0 }, 'fast');
        },
        productTileLeave : function() {
            $jQ(this).removeClass('over');
            $jQ(this).find('.product-hover').fadeOut('fast');
            $jQ(this).find('.product-detail').animate( { opacity:1 }, 'fast');
        },
        quickViewHandler : function() {
            var $quickView = $jQ('#quick-view-overlay'),
            $productTile = $jQ(this).parent().parent(),
            $pTposition = $productTile.position();
            console.log('product tile height: %d', $productTile.outerHeight());
            $quickView.css(
                {
                    'display' : 'block',
                    'position' : 'absolute',
                    'top' : $pTposition.top ,
                    'right' : 0,
                    'height' : ( $productTile.outerHeight() * 2 ) - 1,
                    'background-color' : '#FFF',
                    'z-index' : '99999'
                }
            );
            console.log('window height: %d\nscrolltop of clicked product: %d',$jQ(window).height(),$pTposition.top);
            $jQ('html, body').animate( {
                scrollTop : $pTposition.top + ($productTile.outerHeight() / 2 )
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
        $jQ("#sort-by").uniform();
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
    'product-grid' : {
        init : function() {
            productGrid.init();
            contentFilter.init();
        }
    },
    'product-detail' : {


         init : function() {


	//======================== PDP : HERO =================================//

         // ONLOAD : flexslider set-up
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


		// ONLOAD : ZOOM flexslider set-up
			$jQ('#zoom-focus').flexslider({
				animation: "slide",
                controlNav: "thumbnails"
			});


		// ONLOAD : force cart layout tablet & above
			setTimeout(function() {
				var pgWidth = $jQ(document).width();
				var heroHt = $jQ('#pdp-hero').height();
				if (pgWidth > 767) {
					$jQ('#cart-block').css('height', heroHt + 'px' );
					}
			}, 200);


		// ONLOAD : show vzn-active on current thumb
			$('#thumbs .flex-active-slide').find('.vzn-active').css('width', '45px');


//............. zoom panel functions could be broken out as sep file? ..................//

		// ONLOAD : insert elements into flexslider js-generated
			$jQ('#zoom-block .flex-control-thumbs').wrap('<div class="center-thumbs"><div class="center-block">'); // for styling
			$jQ('<div class="vzn-active"></div>').appendTo('#zoom-block .flex-control-thumbs li'); // insert thumb animation element
			$jQ('<div class="rounded"><ul id="avail-colors" class="inline-list"><li class="color-option black "><div class="select-area"></div></li><li class="color-option grey "><div class="select-area"></div></li><li class="color-option white selected"><div class="select-area"></div></li><li class="color-option blue"><div class="select-area"></div></li></ul></div>').appendTo('.center-block'); // insert color selector


		// ONCLICK : create & show zoom panel
			$jQ('#carousel-zoom').click(function () {

				// get page dimensions at time of click
				var pgHeight = ($jQ(window).height() - 60);

					// set element dimensions
					$jQ('#zoom-carousel-block').css('width', pgHeight + 'px').css('height', pgHeight + 'px');
					$jQ('#zoom-focus .flex-viewport li').css('width', pgHeight + 'px').css('height', pgHeight + 'px' );

					// set active thumb
					$jQ('.flex-control-thumbs .flex-active').parent().find('.vzn-active').css('width', '100%' );

					// set active thumb animation
					$jQ('.flex-control-thumbs li').click(function () {
						$jQ(this).siblings().find('.vzn-active').stop().animate({ 'width':'0px' }, 250 );
						$jQ(this).find('.vzn-active').stop().animate({ 'width': '100%' }, 500 );
					});

				// BRING IT!
					//scroll to top first
					$jQ('html,body').scrollTop(0);

					// slide in panel
					$jQ('#zoom-block').css('height', pgHeight + 'px').animate({
						'left': '0' }, 1200, function() {
							$jQ('.product-detail').addClass('body-zoom'); });

					//snap after to reset flexslider transform values
					$jQ(window).trigger('resize');

					// fade in controls
					setTimeout(function() {
						$jQ('#zoom-block .center-block, #zoom-close, #zoom-controls').fadeIn('slow');
					}, 500);


				// BIGGER
				$jQ('#zoom-controls .bigger').click(function () {

					// get & store current
					var startWd = $jQ(this).parents('#zoom-block').find('#zoom-carousel-block').width();
					$jQ(this).parent().siblings('#zoom-carousel-block').attr('data-current', startWd );

					// window
					$jQ(this).parent().siblings('#zoom-carousel-block').
						transition({ width: '90%', easing: 'snap', duration:'1000ms'});

					// images
					$jQ(this).parents('#zoom-block').find('.flex-active-slide').siblings().css('opacity', '0');

					$jQ(this).parents('#zoom-block').find('#zoom-slides li').
						transition({ scale:1.5, easing: 'snap', duration: '2000ms', delay: 500, queue:false }).
						transition({ x: '15%', duration: '2000ms', queue:false });

					// add nav class
					$jQ('#zoom-focus .flex-control-thumbs').addClass('big-nav');

					// snap
					$jQ(window).trigger('resize');

				}); /* end bigger */



				// SMALLER
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


				// LOSE IT!
				$jQ('#zoom-close').click(function () {

					// fade out controls
					setTimeout(function() {
						$jQ('#zoom-block .center-block, #zoom-close, #zoom-controls').fadeOut('slow');
					}, 250);

					//restore vertical scroll
					$jQ('.product-detail').removeClass('body-zoom');

					// slide out panel
					$jQ('#zoom-block').animate({'left': '-3000' }, 1200 );

				}); // end set close

		}); // end onclick create panel



//............. END zoom panel functions could be broken out as sep file? ..................//


		// ONCLICK : active thumb animation
			$jQ('#thumbs li').click(function () {
				$(this).siblings().find('.vzn-active').stop().animate({
					'width':'0px'
				}, 250 );
				$(this).find('.vzn-active').stop().animate({
					'width':'45px'
				}, 500 );
			}); /* end onclick */


		// ONCLICK : color selector
			$jQ('.color-option').click(function(){
				$jQ(this).parent().find('.selected').removeClass('selected');
				$jQ(this).addClass('selected');

				var selectedTitle = $jQ('.color-option.selected').attr('title');
				$jQ(this).parents('.color-stock-block').find('span.color-option').html(selectedTitle).textTransform="uppercase";
			});


		// RESIZE : cart layout tablet & above
			$(window).resize(function(){
				var resizePg = $jQ(document).width();
				var resizeHt = $jQ('#carousel').height();

					if (resizePg > 767) {
							$jQ('#cart-block').css('height', resizeHt + 'px' );
						} else {
							$jQ('#cart-block').css('height', 'auto' );
						}
				});

		// RESIZE : carousel zoom -----------------------------------------------
			$(window).resize(function(){
				var zoomResize = ($jQ(window).height() - 60 );
				$jQ('#zoom-block').css('height', zoomResize + 'px' );
				$jQ('#zoom-carousel-block').css('width', zoomResize + 'px').css('height', zoomResize + 'px' ).css('min-height', zoomResize + 'px' );
				$jQ('#zoom-focus .flex-viewport li').css('width', zoomResize + 'px').css('min-width', zoomResize + 'px').css('min-height', zoomResize + 'px' );

			});


	//======================== END PDP : HERO =================================//



	//=============================== PDP : BTF =============================//


		// ONCLICK :  active tab animation

			// ONLOAD : show vzn-active on current tab
			$jQ('.tabs .active').find('.vzn-active').css('width', '100%' );

			// ONCLICK : active tab animation
			$jQ('.tabs a').click(function () {
				$jQ(this).parent().siblings().find('.vzn-active').stop().animate({
					'width':'0px'
				}, 250 );

				$jQ(this).parent().find('.vzn-active').stop().animate({
					'width': '100%'
				}, 500 );
			}); /* end onclick */



		// ONLOAD : install overview tabs more/less interaction

			// apply 'show' class for assessing actual content
			$jQ('#overviewTab').siblings().each(function() {
				$jQ(this).addClass('show');
			});

			// loop through each tab & activate more-less where required
			$jQ('#product-details .tab-wrapper').each(function() {
				var tabWrap = $jQ(this);
				var wrapHt = tabWrap.height();
				var tallest = -1;
				var tabID = $jQ(this).parent().attr('id');

				tabWrap.children().each(function(i, child) {

					tallest = tallest > $(child).height() ? tallest : $(this).height();

					if ( tallest > wrapHt  && tabID !== "compatTab" ){
						// turn on more/less
						tabWrap.find('.more-less').css('display', 'block');
						// store data
						var newHt = (tallest + 30);
						tabWrap.attr('data-height', newHt);
					} else if ( tallest > wrapHt  && tabID === "compatTab" ) {
						// turn on more/less
						tabWrap.find('.more-less').css('display', 'block');
						// store data
						var compatHt = (tallest + 98);
						tabWrap.attr('data-height', compatHt);

					}
				});
			});

			// remove temp 'show' class after activation
				$jQ('#overviewTab').siblings().each(function() {
					$jQ(this).removeClass('show');
				});
				$jQ('#product-details .tabs-content').css('overflow', 'visible').css('height','auto');



		// ONCLICK : more/less interaction
			$jQ('a.more-less-link').toggle(function(event) {
				var target = $jQ(this).parents('.tab-wrapper');
				var full = (target.attr('data-height'));

				target.animate({ 'height' : full }, 250, function() { target.addClass('less'); target.find('.see-all').addClass('on'); });
				$jQ(this).text('Less').css('background', 'url(../img/sprites/pdp/tab-less-arrow.png) no-repeat');
				event.preventDefault();
			}, function (event) {
				var target = $jQ(this).parents('.tab-wrapper');

				target.animate({ 'height' : '285px' }, 250, function() { target.removeClass('less'); target.find('.see-all').removeClass('on'); });
				$jQ(this).text('More').css('background', 'url(../img/sprites/pdp/tab-more-arrow.png) no-repeat');
				event.preventDefault();
			});


		// ONCLICK : featured tab graphic block interaction

			$jQ('.features li').toggle(function(){
				$jQ(this).find('.image').addClass('top');
				$jQ(this).find('.hover-text').animate({ 'left': 0 }, 450 );
			}, function() {
				$jQ(this).find('.hover-text').animate({ 'left': '-500' }, 450 );
				$jQ(this).find('.image').removeClass('top');
			});

		// ONCLICK : download success interaction

			$jQ('.download-link').click(function() {

				$jQ('#download-click').animate({ 'left': 0 }, 450 ).delay(4000).animate({ 'left': '-500px' }, 450 );

			});




		//=============================== END PDP : BTF =============================//


		}
	},
    'search-results' : {
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