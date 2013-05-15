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
                //$socialItems.animate({ width: '20%' }, { duration: 'medium', queue: false });
                //console.log($context);
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

            function modalClose() {
                $jQ('#share-modal-overlay, #share-modal-display').fadeOut('medium');
                $jQ(document).off('keyup.social');
            }
            //$socialItems.find('.overlay').css('display', 'none');

            socialItemReset();
            $socialItems.not('.active').on('click', function (e) {
                e.preventDefault();
                $scope = $jQ(this);
                $socialItemsWithContext = $scope.parents('.social-list').find('.social-item');

                socialItemReset($socialItemsWithContext);
                $scope.addClass('active');

                if ($scope.hasClass('email')) {
                    $jQ('.social-link').click(function(e){ // Share Email overlay
                        e.preventDefault;
                        MLS.ui.lightbox(this);
                    });
                    /* Commenting out share modal overlay. Using lightbox instead */
                    /*if ($jQ('#share-modal-overlay').length <= 0) {
                        $jQ(document.body).append('<div id="share-modal-overlay"/>');
                    }
                    if ($jQ('#share-modal-display').length <= 0) {
                        $jQ(document.body).append('<div id="share-modal-display"/>');
                    }

                    $socialItemsWithContext.stop(false, false).animate({ width: '20%' }, { duration: 'medium', queue: false });
                    $jQ('#share-modal-overlay, #share-modal-display').fadeIn('medium', function () {
                        $jQ('#share-modal-overlay').one('click', function () {
                            modalClose();
                        });
                        $jQ('#share-modal-display').one('click', '.close-overlay', function (e) {
                            e.preventDefault();
                            modalClose();
                        });
                        $jQ(document).on('keyup.social', function (e) {
                            if (e.keyCode === 27) { // 27 == esc key
                                modalClose();
                            }
                        });
                    });

                    $jQ('#share-modal-display').css({
                        top: ($jQ(window).outerHeight() / 2 - $jQ('#share-modal-display').outerHeight() / 2) + $jQ(document).scrollTop(),
                        left: ($jQ(window).outerWidth() / 2 - $jQ('#share-modal-display').outerWidth() / 2) - $jQ(document).scrollLeft()
                    });
                    var $shareModalDisplay = $jQ('#share-modal-display');
                    $shareModalDisplay.html('<h3 class="share-title">Share This Item</h3><a href="#" id="close-social-overlay" class="close-overlay"></a><div class="overlay-content"><figure class="share-fig"><img src="img/product-detail-page/pdp-plus/dre-beats-1.png"><figcaption>Lorem Ipsum Descriptum</figcaption></figure><form id="share-modal" name="share-modal" class="share-modal" method="post" action="social-share-example.json"><div class="fieldwrapper"><label for="share-email">Your Email</label><input id="share-email" name="share-email" type="email" class="share-field"></div><div class="fieldwrapper"><label for="share-recipient">Recipient Email</label><input id="share-recipient" name="share-recipient" type="email" class="share-field"></div><input type="submit" id="share-submit" class="button share-cta"></form></div>');
                    $jQ('#share-submit').uniform();
                    $jQ('#share-modal').on('submit', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        var $theForm = $jQ(this.form);
                        MLS.ajax.sendRequest(
                            $theForm.attr('action'),
                            $theForm.serialize(),
                            function (d) { // AJAX request success
                                if (data.hasOwnProperty('success')) { // server-side success response
                                    $shareModalDisplay.html(d.success.responseHTML);
                                } else { // server-side error response
                                    $shareModalDisplay.html(d.error.responseHTML);
                                }
                            },
                            function (d) { // AJAX request error
                                $shareModalDisplay.html('<h3 class="share-title message">There was a problem sharing. Please try again later.</h3><a href="#" id="close-social-overlay" class="close-overlay">');
                            }
                        );
                    });*/
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
    vzSlider: {
        init: function () {
            _self = this;
            //Search for slide
            $jQ('.vzn-slide').each(function () {
                element = $jQ(this);
                instance = $jQ(this).attr('id');
                increment = $jQ(this).find('li:first').width();

                if (instance.indexOf('simple') > -1) {
                    $jQ(this).addClass('simple');
                    type = 'simple';
                } else if (instance.indexOf('fancy') > -1) {
                    $jQ(this).addClass('fancy');
                    type = 'fancy';
                } else if (instance.indexOf('zoom') > -1) {
                    $jQ(this).addClass('zoom');
                    type = 'zoom';
                } else if (instance.indexOf('lifestyles') > -1) {
                    $jQ(this).addClass('lifestyles');
                    type = 'lifestyles';
                }
            });
            _self.initSlider(element, type, increment);

        },
        initSlider: function(element, type, increment) {
            _self = this;
            //  first assemble these contextual values
            var multi, mod;

            var baseIncr = increment;

            if (type == 'simple') {
                multi = getMulti(type); // for responsive change
                mod = 0;

            } else if (type == 'fancy') {
                multi = getMulti(type); // for responsive change
                mod = 1;

            } else if (type == 'lifestyles') {

                baseIncr = baseIncr + 1; // accomodate box-sizing border math
                multi = 1.5; // use function when we get to responsive
                mod = -1;

            } else if (type == 'zoom') {

                // select these at time of zoom panel creation
                var zoomBlock = window.document.getElementById('zoom-block'); // needs RESIZE
                var zoomSlides = window.document.getElementById('zoom-slides');

                // establish dynamic width value & apply to slides along with initial current id
                zSldWd = $jQ(zoomBlock).width();
                $jQ(zoomSlides).find('li').css('width', zSldWd).first().attr('id', 'current-zoom-slide');

                // copied from original pattern
                var startOff = 0;
                multi = 1;
                mod = 0;
                $jQ(element).attr('data-start-off', startOff);

            } // end type check

            // math = amount to advance simple slider on each click
            var advIncrFormula = (baseIncr * multi);
            advIncr = advIncrFormula + mod;

            var prvIncr = advIncr;
            var nxtIncr = (advIncr * -1);

            // then get length of curent slide container....
            var list = $jQ(element).find('.slides');
            var itemCount = list.find('li').length;

            // ... and use it to set proper width for slide container
            var listIncr = 0;
            if (type === 'fancy' || type == 'lifestyles') {
                listIncr = baseIncr / 2;

                // add logic for end of list if last element is large product/story !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

            } else {
                listIncr = baseIncr;
            }
            var listLength = ((itemCount * listIncr) + 1);



            // finally, apply this to actual elements
            list.css('width', listLength + 'px').attr('data-length', listLength).attr('data-items', itemCount);

            $jQ('<div class="vzn-slide-prev"></div>').appendTo(element.parent()).attr('data-incr', prvIncr).addClass('off');
            $jQ('<div class="vzn-slide-next"></div>').appendTo(element.parent()).attr('data-incr', nxtIncr);

            _self.bindEvents();
        },
        bindEvents: function() {
            _self = this;

            // vzn-slide 'others also bought' : layout
            var fncyList = $jQ('.fancy').find('.slides');

            $jQ(fncyList).each(function() {
                var increment = $jQ(this).find('li:first').width();
                $jQ(this).find('li').each(function(index, element) {
                    fancyPosition(element, index, increment);
                });
            });


            // vzn-slide 'pdp lifestyles' : layout
            if ($jQ('#lifestyles').length) {
                var lsList = $jQ('#lifestyles').find('.slides');

                $jQ(lsList).each(function() {
                    var increment = $jQ(this).find('li:first').width();
                    $jQ(this).find('li').each(function(index, element) {
                        _self.lifestylePosition(element, index, increment);
                    });
                }); // end each list
            } // end 'if pdp plus' : lifestyles vzn-slide



            // vzn-slide nav button : "on" .......................
            $jQ('.vzn-slide-prev, .vzn-slide-next').click(function() {
                var lstLngth, thisIncr, endMod;
                // create modifier for lifestyles slider based on actual number of items
                if ($jQ(this).siblings('.vzn-slide').hasClass('lifestyles')) {
                    lstLngth = $jQ(this).siblings('.vzn-slide').find('.slides').attr('data-length'),
                    thisIncr = $jQ(this).attr('data-incr'),
                    endMod = lstLngth / thisIncr;
                } else {
                    endMod = 0;
                }

                _self.slideButtons(this, endMod);

                $jQ('.tabs dd a').click(function() {
                    alert();
                    _self.slideTab(this);
                });

            });
        },
        slideButtons: function() {
            _self = this;
            // select these
            var tabWrap = $jQ(element).parent();

            // create these
            var slideWindow = tabWrap.find('.vzn-slide');
            var list = slideWindow.find('.slides');

            //start fresh each time
            var newPosition = 0;

            // get these values
            var winLngRaw = slideWindow.width(); // window length
            var lstLngRaw = $jQ(list).attr('data-length');
            var advRaw = $jQ(element).attr('data-incr');
            var curPosRaw = $jQ(list).position().left;



            // parse them all
            var windowLength = parseInt(winLngRaw, 10);
            var listLength = parseInt(lstLngRaw, 10);
            var advance = parseInt(advRaw, 10);
            var currentPosition = parseInt(curPosRaw, 10);

            //calculate end position
            var endPosition = (windowLength - listLength);
            // if this is 0 or positive, no slideshow at all ADD THIS LOGIC!!!!!!!!!!!!!!!!!

            //alert(listLength); alert(windowLength);  alert(advance); alert(currentPosition); alert(endPosition);

            // do the 'loop' math
            newPosition = (currentPosition + advance);

            //decide what to do

            if (slideWindow.hasClass('lifestyles') && $jQ(tabWrap).find('.vzn-slide-next').hasClass('off')) { // end position check : lifestyles only

                var lifestyleEndCheck = listLength + currentPosition;
                var lifestyleIncr = Math.abs(advance) * 2;
                //alert (lifestyleIncr); alert( lifestyleEndCheck);
                if (lifestyleEndCheck < lifestyleIncr) { //  modify first 'prev' advance only

                    var leftGap = windowLength - advance;

                    advance = advance - leftGap - 3;

                    newPosition = (currentPosition + advance);

                    //alert(advance); alert (newPosition); alert( lifestyleEndCheck);
                    //newPosition = ( currentPosition + lifestyleEndCheck );

                    // move it
                    hSlide(list, newPosition);

                    // turn both on
                    $jQ(tabWrap).find('.vzn-slide-next').removeClass('off');
                    $jQ(tabWrap).find('.vzn-slide-prev').removeClass('off');


                } // end mod prev advance

            } else { //run through the loop for everyone



                if (newPosition >= 0) { // back at beginning
                    newPosition = 0;

                    //move it
                    hSlide(list, newPosition);

                    // turn prev off, leave next on
                    $jQ(tabWrap).find('.vzn-slide-prev').addClass('off');
                    $jQ(tabWrap).find('.vzn-slide-next').removeClass('off');

                } else if (newPosition <= endPosition) { // at end

                    // modify to hide border-right as req

                    if (slideWindow.hasClass('simple')) { // don't mod simple
                        newPosition = endPosition;
                    } else if (slideWindow.hasClass('fancy')) {
                        newPosition = endPosition + 5; // do mod fancy
                    } else if (slideWindow.hasClass('lifestyles')) { // do mod lifestyles
                        var endModify = mod * -2;
                        newPosition = endPosition + endModify; // do mod lifestyles
                    }

                    // move it
                    hSlide(list, newPosition);

                    // leave prev on, turn next off
                    $jQ(tabWrap).find('.vzn-slide-next').addClass('off');
                    $jQ(tabWrap).find('.vzn-slide-prev').removeClass('off');

                } else { // somewhere in between

                    // move it
                    hSlide(list, newPosition);

                    // make sure both are on
                    $jQ(tabWrap).find('.vzn-slide-next').removeClass('off');
                    $jQ(tabWrap).find('.vzn-slide-prev').removeClass('off');
                }

            } // end loop for everyone
        },

        slideTab: function(href) {
            //remove active class from all tabs
            $jQ(href).parents('.tabs').children().removeClass('active');

            //apply it to (this) clicked tab
            $jQ(href).parent().addClass('active');



            // get tab content target name
            var rawName = $jQ(href).attr('href');
            var tabName = rawName.substring(1);
            var contentName = (tabName + 'Tab');


            // remove active class from all tab content, find the right one and reapply
            contentList = $jQ(href).parents('.tab-block').find('.tabs-content');
            $jQ(contentList).children().removeClass('active').each(function() {
                var thisID = $jQ(this).attr('id');
                if (thisID == contentName) {
                    $jQ(this).addClass('active');
                    return false;
                }

            });
        },
        lifestylePosition: function(item, position, increment) {

            var incr = increment / 2;
            var addIncr = increment;
            var left = 0;
            var nextLeft = 0;
            var top = 0;

            if (position < 3) { // check for initial special case

                if (position === 0) { // do nothing to position-0
                } else { // left value for positions-1-2
                    left = 2 * incr;
                }

                if (position == 2) { //top value for positions-2
                    top = incr;
                }

                $jQ(item).css({
                    'top': top + 'px',
                    'left': left + 'px'
                });

            } else {
                //cycle of 3

                if (position % 3 === 0) { // values for positions-3-6-9-etc

                    left = position * incr;
                    $jQ(item).css({
                        'left': left + 'px'
                    });

                    nextLeft = left + addIncr;

                    $jQ(item).next('li').css({
                        'left': nextLeft + 'px'
                    }); // values for positions-4-7-10-etc

                    $jQ(item).next('li').next('li').css({ // values for positions-5-8-11-etc
                        'left': nextLeft + 'px',
                        'top': incr + 'px'
                    });

                } // do nothing until position divides by 3 again
            } // end special-case-check-then-loop
        }, // end lifestylePosition
        fancyPosition: function(item, position, increment) {

            var incr = increment / 2;
            var addIncr = increment;

            // general li values
            var left = incr * position;
            var top = 0;

            // exceptions
            if (position === 1 || position % 5 === 1) { //left values for positions-1-6-11-16-etc
                left = left + incr;
            }

            if (position % 5 === 2 || position % 5 === 3) { //top values for positions-2-3-7-8-12-13-etc
                top = incr;
            }

            // apply values

            $jQ(item).css({
                'left': left + 'px',
                'top': top + 'px'
            });

            // then, edit layout inside each item (all of them )
            $jQ(item).each(function() {
                var title = $jQ(this).find('.product-title');
                $jQ(this).find('.fancy-ratings').appendTo(title);
            });
        }
    }
};
