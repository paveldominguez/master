MLS.ui = {
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
	vScroll: function(element, position) {
		$jQ(element).css({
        	'-webkit-transform': 'translate3d(0,' + position +'px,  0)',
  			'-moz-transform' : 'translate3d(0,' + position +'px,  0)',
  			'-ms-transform' : 'translate3d(0,' + position +'px,  0)',
 			'-o-transform' : 'translate3d(0,' + position +'px,  0)',
  			'transform' : 'translate3d(0,' + position +'px,  0)'
  		}); // end css
  		$jQ(element).attr('data-vpos', position);
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
	vzSlider: {
		init: function () {
			console.log('init');
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
			console.log("initSlider");
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
			console.log("bindEvents");
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
			console.log("slideButtons");
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
