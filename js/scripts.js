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
				// force cart-block	on resize: tablet & above
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


			// big-nav actions
			//	$jQ('.big-nav li').click(function () {
			//			alert('yes');
			//		$jQ(this).parents('#zoom-focus').find('#zoom-slides li').css('opacity', '0');
			//		$jQ(this).parents('#zoom-focus').find('#zoom-slides .flex-active-slide').css('opacity', '1');


			//	});



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