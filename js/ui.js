MLS.ui = {

    /*
     * Social Share - Handle clicking of social share toolbar
     *
     */

    socialShare : {
        init: function () {
            var $socialList = $jQ('.social-share-module').find('.social-list'),
            $socialItems = $socialList.find('.social-item'),
            $socialItemsWithContext,
            $overlay,
            $scope,
            listWidth,
            overlayWidth;

            function socialItemReset($context) {
                if ($context !== undefined) {
                    $context.removeClass('active');
                    $context.find('.overlay').hide();
                    $context.find('.social-link').show();
                } else {
                    $socialItems.removeClass('active');
                    $socialItems.find('.overlay').hide();
                    $socialItems.find('.social-link').show();
                }
            }

            function modalClose($context, $content) {
                $jQ('#share-modal-overlay, #share-modal-display').fadeOut('medium');
                $jQ(document).off('keyup.social');
                $jQ($context).html($content);
            }

            socialItemReset();
            $socialItems.not('.active').on('click', function (e) {
                e.preventDefault();
                $scope = $jQ(this);
                $socialItemsWithContext = $scope.parents('.social-list').find('.social-item');

                socialItemReset($socialItemsWithContext);
                $scope.addClass('active');

                if ($scope.hasClass('email')) {
                    var $emlOverlay = $scope.find('.overlay'),
                    $emlModal = $emlOverlay.html();
                    if ($jQ('#share-modal-overlay').length <= 0) {
                        $jQ(document.body).append('<div id="share-modal-overlay"/>');
                    }
                    if ($jQ('#share-modal-display').length <= 0) {
                        $jQ(document.body).append('<div id="share-modal-display"/>');
                    }

                    $socialItemsWithContext.css('width', '20%');
                    $jQ('#share-modal-overlay, #share-modal-display').hide().fadeIn('medium', function () {
                        $jQ('#share-modal-overlay').one('click', function () {
                            modalClose($emlOverlay, $emlModal);
                        });
                        $jQ('#share-modal-display').one('click', '.close-overlay', function (e) {
                            e.preventDefault();
                            modalClose($emlOverlay, $emlModal);
                        });
                        $jQ(document).on('keyup.social', function (e) {
                            if (e.keyCode === 27) {
                                modalClose($emlOverlay, $emlModal);
                            }
                        });
                    });

                    // center modal on screen
                    $jQ('#share-modal-display').css({
                        top: ($jQ(window).outerHeight() / 2 - $jQ('#share-modal-display').outerHeight() / 2) + $jQ(document).scrollTop(),
                        left: ($jQ(window).outerWidth() / 2 - $jQ('#share-modal-display').outerWidth() / 2) - $jQ(document).scrollLeft()
                    });

                    var $shareModalDisplay = $jQ('#share-modal-display');
                    $shareModalDisplay.html($emlModal);
                    $emlOverlay.html('');
                    $jQ('#share-submit').uniform();
                    $jQ('#share-modal').on('submit', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        var $theForm = $jQ(this.form);
                        MLS.ajax.sendRequest(
                            $theForm.attr('action'),
                            $theForm.serialize(),
                            // AJAX request success
                            function (d) {
                                // server success response
                                if (data.hasOwnProperty('success')) {
                                    $shareModalDisplay.html(d.success.responseHTML);
                                }
                                // server error response
                                else {
                                    $shareModalDisplay.html(d.error.responseHTML);
                                }
                            },
                            // AJAX request error
                            function (d) {
                                $shareModalDisplay.html('<h3 class="share-title">An error has occurred.<br>Please try again later.</h3><a href="#" id="close-social-overlay" class="close-overlay"></a>');
                            }
                        );
                    });
                } else {
                    $overlay = $scope.find('.overlay'),
                    $socialList = $socialItemsWithContext.parents('.social-list'),
                    listWidth = $socialList.outerWidth();

                    overlayWidth = $overlay.outerWidth();
                    $overlay.show().css('width', 0);
                    $scope.find('.social-link').hide();

                    $socialItemsWithContext.not($scope).stop(false, false).animate({
                        width: ((listWidth - overlayWidth) / $socialItemsWithContext.length)
                    }, { duration: 'medium', queue: false });

                    $overlay.stop(false, false).animate({
                        width: overlayWidth
                    }, { duration: 'medium', queue: false });

                    $scope.stop(false, false).animate({
                        width: overlayWidth
                    }, { duration: 'medium', queue: false });

                }
            });
        }
    },

    complexItem: {
        init: function () {
            $jQ('.close-btn', '#complex-item-modal').on('click', MLS.ui.complexItem.close);
        },
        open: function () {
            $jQ('#complex-item-modal-overlay').show(300, function () {
                $jQ('#complex-item-modal').show(200);
            });
        },
        close: function () {
            $jQ('#complex-item-modal').fadeOut(300, function () {
                $jQ('#complex-item-modal-overlay').fadeOut(200);
            });
        }
    },
    /*
     * Grid Hover (popout)
     * @selector: grid item(s), @details: detail contents to push into grid pop out, @padding: control offset amount
     */
    gridHover : function (selector, content, padding) {
        $jQ(selector).on('mouseenter', function (e) {
            e.preventDefault();
            var el = $jQ(this),
            offset = el.offset(),
            width = el.outerWidth(),
            height = el.outerHeight(),
            detailHeight = $jQ('#grid-pop-out .details').height(); // need to dump contents from cell into this...
            padding = (padding !== undefined) ? padding : 40;
            if (Response.band(920)) {
                $jQ('.content-item.active').removeClass('active grid-hover active');
                el.addClass('active grid-hover-active');
                if (content.topBar !== undefined) {
                    $jQ('#grid-pop-out .top-bar').html($jQ(content.topBar).html());
                }
                if (content.actions !== undefined) {
                    $jQ('#grid-pop-out .details').html($jQ(content.actions).clone(true));

                    $jQ('#grid-pop-out input:submit').unbind("click").click(function(e) {
                        e.preventDefault();
                        $jQ(content.actions).find("input:submit").click();
                        return false;
                    });
                }

                $jQ('#grid-pop-out').css({
                    top: offset.top - (padding / 2),
                    left: offset.left - (padding / 2),
                    width: width + padding,
                    height: height + padding + detailHeight
                }).stop(true, true).fadeIn('fast').on('mouseleave', function () {
                    el.removeClass('active grid-hover-active');
                    $jQ('#grid-pop-out .details').empty();
                    $jQ(this).stop(true, true).fadeOut('fast');
                });
            }
        });
    },

    /*
     * Clickable Tabs
     * @element: (string) parent (containing) element
     */

    tabs: function (element, hover) {
        var scope = element,
            $contentTabs = $jQ(scope + ' > .tab-content > .tab'),
            activeClass = 'active';

        $jQ(scope + ' > .tab-menu > .tab').each(function (i, el) {
            $jQ(this).add($contentTabs[i]).attr('tab', i + 1);
        });

        $jQ(scope + ' > .tab-menu > .tab').on((hover ? 'mouseenter' : 'click'), function (e) {
            if (!hover) {
                e.preventDefault();
            }
            var tab = $jQ(this).attr('tab');
            $jQ(scope + ' > .tab-menu > .tab').add(scope + ' > .tab-content > .tab').removeClass(activeClass);
            $jQ(this).add(scope + ' > .tab-content > .tab[tab=' + tab + ']').addClass(activeClass);
        });

        $jQ(scope + ' > .tab-menu > .tab:first-child').add(scope + ' > .tab-content > .tab:first-child').addClass(activeClass);
    },

    /*
     * Navigation Tabs
     * @element: (string) containing element
     */
    navTabs: function (element) {
        var scope = element,
            $contentTabs = $jQ(element + ' > .tab-content > .tab'),
            activeClass = 'active';

        $jQ(scope + ' > .tab-menu > .tab').each(function (i) {
            $jQ(this).add($contentTabs[i]).attr('tab', i + 1);
        });

        $jQ(scope + ' > .tab-menu > .nav-item').on({
            'mouseenter': function () {
                if ($jQ(this).hasClass('tab')) {
                    var tab = $jQ(this).attr('tab');
                    $jQ(scope + ' > .tab-menu > .tab').add(scope + ' > .tab-content > .tab').removeClass(activeClass);
                    $jQ(this).add(scope + ' > .tab-content > .tab[tab=' + tab + ']').addClass(activeClass);

                    $jQ(scope).one('mouseleave', function (e) {
                        $jQ(scope + ' > .tab-menu > .tab').add(scope + ' > .tab-content > .tab').removeClass(activeClass);
                    });
                } else if (!$jQ(this).hasClass('.tab')) {
                    $jQ(scope + ' > .tab-menu > .tab').add(scope + ' > .tab-content > .tab').removeClass(activeClass);
                }
            },
            'click': function(e) {
                if ($jQ(this).hasClass('tab')) {
                    e.preventDefault();
                    var tab = $jQ(this).attr("tab");
                    $jQ(scope + ' > .tab-menu > .tab').add(scope + ' > .tab-content > .tab').removeClass(activeClass);
                    $jQ(this).add(scope + ' > .tab-content > .tab[tab=' + tab + ']').addClass(activeClass);
                }
            }
        });
    },
    /*
     * Navigation Accordion (for mobile view)
     * @element: (string) containing element
     */
    navAccordion: function(element) {
        var scope = element,
            $accordionTabs = $jQ(scope + ' > .tab > a'),
            activeClass = "active";

        $accordionTabs.on('click', function(e) {
            $jQ(scope + ' > .tab').removeClass(activeClass);
            var $acContent = $jQ(this).next(),
                $wHeight = $jQ(window).outerHeight(),
                $navHeight = $jQ('#nav-mobile-tabs-primary').outerHeight(),
                $acTabHeight = $jQ(scope + ' > .tab').outerHeight();

            if ($acContent.hasClass('accordion-content')) {
                e.preventDefault();
                $jQ(this).parent().addClass(activeClass);
                $acContent.css('height', $wHeight);
            }
        });

        $jQ('#nav-mobile-tabs-primary .nav-actions').on('click', function () {
            if ($jQ(this).hasClass(activeClass)) {
                $jQ(this).add('.tab').removeClass(activeClass);
            }
        });
    },
    /*
     * Update Content
     * @container: (string) containing element
     * @data: (string) html data
     */
    updateContent: function (container, data) {
        $jQ(container).html(data);
    },
    /*
     * Generic vertical scroll using 3dTransform, attaches new position as data atrribute
     *
     */
    vScroll: function(element, vValue) {
        $jQ(element).css({
            '-webkit-transform': 'translate3d(0,' + vValue +'px,  0)',
            '-moz-transform' : 'translate3d(0,' + vValue +'px,  0)',
            '-ms-transform' : 'translate3d(0,' + vValue +'px,  0)',
            '-o-transform' : 'translate3d(0,' + vValue +'px,  0)',
            'transform' : 'translate3d(0,' + vValue +'px,  0)'
        }); // end css
        $jQ(element).attr('data-vpos', vValue);
    },

    /*
     * Generic horizontal slide action using 3dTransform
     *
     */
    hSlide:  function (element,hValue) {
    	$jQ(element).css({
        	'-webkit-transform': 'translate3d(' + hValue + 'px, 0, 0)',
  			'-moz-transform' : 'translate3d(' + hValue + 'px, 0, 0)',
  			'-ms-transform' : 'translate3d(' + hValue + 'px, 0, 0)',
 			'-o-transform' : 'translate3d(' + hValue + 'px, 0, 0)',
  			'transform' : 'translate3d(' + hValue + 'px, 0, 0)'
  		}); // end css
	},
    /*
     * Generic scroll page to certain point
     *
     */
    scrollPgTo: function(whereTo, topPad) {
        if (topPad == undefined) {
            topPadding = 0;
        }
        var moveTo = $jQ(whereTo).offset().top - topPad;
        $jQ('html, body').stop().animate({
            scrollTop: moveTo
        }, 250);
    },
    /*
     * Generic simple accordion for options in checkout, pdp, etc
     *
     */
    simpleAcc: function(control) {
        // change icon
        $jQ(control).find('.icon').toggleClass('close');
        // open/close panel
        $jQ(control).next('.acc-info').slideToggle(300);
    },
    /*
     * Generic dropdown display:
     *  no-touch : hover and no click
     * 	touch : touch/click and no hover
     */
    dropdownDisplay: function(container){
		if ($jQ('html').hasClass('no-touch')){
			var link = $jQ(container).find('.dropdown-link');
			$jQ(link).click(function(e){
				e.preventDefault();
			});
			$jQ(link).hover(
				function() {
					$jQ(this).parents('section').find('.dropdown-panel').fadeOut(25);
					$jQ(this).next('.dropdown-panel').fadeIn(200);
				},
				function() { $jQ(this).next('.dropdown-panel').delay(200).fadeOut(200); }
			);
			$jQ('.dropdown-panel').hover(
				function() { $jQ(this).stop().show(); },
				function() { $jQ(this).fadeOut(300); }
			);
		} else {
			$jQ(link).click(function(e){
				e.preventDefault();
				$jQ(this).siblings('.dropdown-panel').toggle();
			});
		}
	},
    /*
     *  Lightbox activation for modal states using HTML pattern
     *  established in cart-base.html & CSS in _global.scss
     *
     */
    lightbox : function (clicked){
        var thisModal = $jQ(clicked).attr('data-modal-id');
        $jQ(thisModal).fadeIn(300); // fade in

        $jQ(thisModal).find('.lightbox-close').click(function(){ // close click
            $jQ(thisModal).fadeOut(300); // fade out
        });

    },
    moreLessBlock : function(){
        $jQ('.more-less-block').each(function(){
            var thisHeight = $jQ(this).height();
            if (thisHeight > 280) { // turn on more/less button
                $jQ(this).addClass('bound').removeClass('not-bound');
            } else { // turn off more/less button
                $jQ(this).addClass('not-bound').removeClass('bound');
            }
        });
    },
    module: {
        trendingLifestyles: function () {
            var $lifestyleModule = $jQ('.trending-lifestyles-module');
            var $scrollWidth = $lifestyleModule.width() - 170;
            $jQ('.lifestyle-tab-content').width($scrollWidth);
            $jQ('.trendingLifestyleSlider').flexslider({
                animation: 'slide',
                controlsContainer: '.trending-lifestyles-module .slide-nav',
                animationLoop: true,
                controlNav: false,
                directionNav: true,
                slideshow: false,
                animationSpeed: 500,
                itemWidth: 770
            });
            $jQ(window).resize(function () {
                $jQ('.lifestyle-tab-content').width($jQ('#site-container').width() - 170);
            });
            $jQ('.section-tabs a', '.trending-lifestyles-module').on('click', function (e) {
                e.preventDefault();
                var setTab = $jQ(this).attr('href');
                $jQ('.section-tabs .tab', '.trending-lifestyles-module').removeClass('active');
                $jQ(this).parent().addClass('active');
                $jQ('.tab-content', '.lifestyle-tab-content').removeClass('active');
                $jQ(setTab).addClass('active');
            });
    }
};
