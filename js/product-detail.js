var productDetail = (function() {

    var pub = {
        init : function() {

		
// ONLOAD for js: universal vars for contextual/dynamic layouts
        var pgWidth = document.body.clientWidth;
        var pdpType = $jQ('body').attr('id');
        var hero = document.getElementById('pdp-hero');
        var heroThumbs = window.document.getElementById('thumbs');
        var heroFocus = window.document.getElementById('focus');
        var heroCart = window.document.getElementById('cart-block');
        var heroCrsl = window.document.getElementById('carousel-block');
        var zoomBtn = window.document.getElementById('carousel-zoom');
        var zoomBlock = window.document.getElementById('zoom-block');
        var zoomCrsl = window.document.getElementById('zoom-carousel-block');
        var zoomFocus = window.document.getElementById('zoom-focus');
        var zoomSlides = window.document.getElementById('zoom-slides');
        var zoomThmbs = window.document.getElementById('zoom-thumbs');
        var zoomClrs = window.document.getElementById('zoom-color-select');
        var zoomClose = window.document.getElementById('zoom-close');



// ONLOAD hero : flexslider install ..........................................................

        $jQ(heroThumbs).flexslider({
            animation: "slide",
            controlNav: false,
            animationLoop: true,
            slideshow: false,
            itemWidth: 45,
            itemMargin: 10,
            asNavFor: '#focus'
        });

        $jQ(heroFocus).flexslider({
            animation: "slide",
            controlNav: false,
            animationLoop: true,
            slideshow: false,
            sync: "#thumbs"
        });
        
        
        // handle extras for pdp-plus absolute positioned expanded images
        	if ( pdpType == 'pdp-plus' ) {
        		setTimeout(function(){
        			$jQ(heroFocus).find('li').each(function(){
        				var liWd = $jQ(this).width();
        				$jQ(this).css('height', liWd);
        				$jQ(this).find('img').each(function(){
        					var xCrd = $jQ(this).attr('data-xcoord');
        					var yCrd = $jQ(this).attr('data-ycoord');
        			
        					if ( pgWidth > 1279 ) { 
        						var parsedY = parseInt(yCrd, 10);
        						yCrd = parsedY + 75; 
        					} // build out this logic with more example photography
        				
        					$jQ(this).css({
        						'right' : xCrd + 'px',
        						'bottom' : yCrd + 'px'
        					});
        				}); // find img
        			}); // find li
        		}, 200 );
        	} // end pdp type
        
		// make zoom panel vzn-slide instead
        	$jQ(zoomFocus).removeClass('flexslider').addClass('vzn-slide');




// ONLOAD hero : responsive layout adjustments........................................

        // hero onload : force hero layout > 960+
            if (pgWidth > 959) {
                setTimeout(function() {
                    var heroHt = $jQ(heroCrsl).height();
                    //alert(heroHt);
                    heroCart.style.height = heroHt + 'px';


                }, 200);
            } // end if

    	

        // hero onload : set hero nav width & store margin for centering > 768+
                var countThmb = $jQ('#thumbs .slides').find('li').length;
                var thmbWd = (countThmb * 55);
                var totalWd = (thmbWd + 105 ); //add standard width of zoom & view 360 buttons
                var thmbMgnLft = (totalWd / -2);
                heroThumbs.style.width = totalWd + 'px';
                $jQ(heroThumbs).attr('data-center', thmbMgnLft );


        // hero onload : center carousel thumbs
            if ( pgWidth > 959 ) {
                var cntrThmb = $jQ(heroThumbs).attr('data-center');
                heroThumbs.style.marginLeft = cntrThmb + 'px';
            }

// ONLOAD hero : preload zoom panel components ...............................................

    preloadZoom(zoomBlock);



// ONLOAD both : initial vzn-active display ..................................................

    // hero : carousel current thumb,
            $jQ('#thumbs .flex-active-slide').find('.vzn-active').css('width', '100%');
    // below the fold : current tab
             $jQ('.tabs .active').find('.vzn-active').css('width', '100%');



// ONLOAD both : make form elements pretty...................................................

    $jQ("select").uniform();




// ONLOAD both : install vzn-sliders .........................................................

    // find each instance of 'vzn-slide' & apply class/functions
    	$jQ('.vzn-slide').each(function(){
    	
    	
        	element = $jQ(this);
        	instance =  $jQ(this).attr('id');
        	increment = $jQ(this).find('li:first').width();
		
        	if ( instance.indexOf('simple') > -1 ) {
            	$jQ(this).addClass('simple');
            	var type = 'simple';
        	} else if ( instance.indexOf('fancy') > -1 ) {
            	$jQ(this).addClass('fancy');
            	var type = 'fancy';
        	}  else if ( instance.indexOf('lifestyles') > -1 ) {
            	$jQ(this).addClass('lifestyles');
            	var type = 'lifestyles';
        	}
        	vznSlideInstall(element,type, increment);
        	
    	});


	// vzn-slide 'others also bought' : layout
			var fncyList = $jQ('.fancy').find('.slides');
			
			$jQ(fncyList).each(function() {
				var increment = $jQ(this).find('li:first').width();
				$jQ(this).find('li').each(function(index, element) {
					fancyPosition(element, index, increment);
				});
			});	
	

	// vzn-slide 'pdp lifestyles' : layout
			if ( pdpType == "pdp-plus" ) {
			 	var lsList = $jQ('#lifestyles').find('.slides');
			 	
			 	$jQ(lsList).each(function(){
			 		var increment = $jQ(this).find('li:first').width();
			 		$jQ(this).find('li').each(function(index, element) {	
			 			lifestylePosition(element, index, increment);
			 		});
			 	}); // end each list 
			} // end 'if pdp plus' : lifestyles vzn-slide
			
		
			
	// vzn-slide nav button : "on" .......................
        $jQ('.vzn-slide-prev, .vzn-slide-next').click(function() {
        	// create modifier for lifestyles slider based on actual number of items
        	if ($jQ(this).siblings('.vzn-slide').hasClass('lifestyles')) {
        		//alert('yes');
        		var lstLngth = $jQ(this).siblings('.vzn-slide').find('.slides').attr('data-length');
        		var thisIncr = $jQ(this).attr('data-incr');
        		var endMod = lstLngth/thisIncr;
        		//alert(lstLngth); alert(thisIncr);
        
        	} else {
        	
        		var endMod = 0;
        	
        	}
        	
        	
            vznSlideButtons(this, endMod);
        });

    // vzn-slide nav button : "off"
        $jQ('.vzn-slide-prev.off, .vzn-slide-next.off').click(function(){
            return false;
        });





// ONLOAD below the fold : install custom tab function :P ....................................

	$jQ('.tabs dd a').click(function(){
		pdpTab(this);
	});
	


	
// ONLOAD below the fold : position product details hero image on pdp-plus ....................
	
	if ( pdpType == 'pdp-plus' ) {
	
		$jQ('#detail-hero-image-box').find('img').each(function(){
		
			var xCrd= $jQ(this).attr('data-xcoord');
			var yCrd= $jQ(this).attr('data-ycoord');
			
			$jQ(this).css({ 
				'top': yCrd + 'px',
				'left': xCrd + 'px'
			});
		});
	}
	


// ONLOAD below the fold : install more/less interaction on product detail tabs ...................

    // select these
        var allDetails = window.document.getElementById('product-details');
        var overTab = window.document.getElementById('overviewTab');
        var featTab = window.document.getElementById('featuresTab');
        var specTab = window.document.getElementById('specsTab');

    if (pgWidth > 959 ) { //desktop installation
    

    	if ( pdpType == 'pdp' ) {

			// apply 'show' class for assessing actual content
        		$jQ(overTab).siblings().each(function() {
            		$jQ(this).addClass('show');
        		});

    		// compare & activate more-less where required
        		$jQ('#product-details .tab-wrapper').each(function() {
            		installDesktopMoreLess(this);
        		});

    		// remove temp hiding css after activation
        		$jQ(overTab).siblings().each(function() {
            		$jQ(this).removeClass('show');
        		});
        		$jQ('#product-details .tabs-content').css('overflow', 'visible').css('height','auto');
                	
                	
            } else if ( pdpType == 'pdp-plus' ) {

				// move these
        			
        			$jQ(compatTab).find('.see-all').appendTo('.compat-results .tab-inner');

        		// apply 'show' class for assessing actual content
        			$jQ(overTab).siblings().each(function() {
            			$jQ(this).addClass('show');
        			});

        		// compare & activate where required
        			$jQ(allDetails).find('.tab-inner').each(function(){
            			singleMoreLess(this);
        			});

        		// remove temp hiding css after activation
        			$jQ(overTab).siblings().each(function() {
            			$jQ(this).removeClass('show');
        			});
        			$jQ('#product-details .tabs-content').css('overflow', 'visible').css('height','auto');

			} // end pdp type check

    } else if (pgWidth < 960 ) { //phablet installation

        // move these
        $jQ(featTab).find('.third.center .details-list').appendTo('#featuresTab .third.left .tab-inner');
        $jQ(specTab).find('.third.center').appendTo('#specsTab .third.left .tab-inner');
        $jQ(compatTab).find('.see-all').appendTo('.compat-results .tab-inner');

        // apply 'show' class for assessing actual content
        $jQ(overTab).siblings().each(function() {
            $jQ(this).addClass('show');
        });

        // compare & activate where required
        $jQ(allDetails).find('.tab-inner').each(function(){
            singleMoreLess(this);
        });

        // remove temp hiding css after activation
        $jQ(overTab).siblings().each(function() {
            $jQ(this).removeClass('show');
        });
        $jQ('#product-details .tabs-content').css('overflow', 'visible').css('height','auto');

    } // end more/less installation



			
			
			
			

// ONCLICK : hero .......................................................................

    // active thumb animation..............................
        $jQ(heroThumbs).find('li').click(function(){
            vznActiveThumbs(this);
        });


    // color selectors .....................................
        $jQ('.color-select').change(function() {
        	var selectedSpan = $jQ(this).parent().find('span');
        	var selectedColor =  selectedSpan.text();
            var colorChip = $jQ(this).parents('.color-select-box').find('.swatch');
            
            var bgHx = 'fff';

            if (selectedColor == 'Black') {
                bgHx = '2e2e2e';

            } else if (selectedColor == 'Grey') {
                bgHx = 'b1b0b0';

            } else if (selectedColor == 'White') {
                bgHx = 'fff';

            } else if (selectedColor == 'Blue') {
                bgHx = '51b0d8';

            }
           $jQ(colorChip).css({ 
           		'background-color' : '#' + bgHx,
           		'height' : '43px' });
           $jQ(selectedSpan).css({ 'padding-left' : '54px' });

        });



    // create contextual zoom panel ..........................
        $jQ(zoomBtn).click(function () {
            createZoomPanel();
           
        }); // create zoom panel




            



	// special offers pop-ups in cart
		if ( pdpType == "pdp-plus" ) { //TEMP 'if' until pdp templates are finalized
	
			$jQ('.offer-more-icon').click(function() {
				var iconPos = $jQ(this).position().left;
				var boxPos = iconPos + 20;
			
				$jQ(this).parent().find('.pdp-offer-pop').css('left', boxPos).fadeIn('fast');
			});
		
			$jQ('.offer-close').click(function(){
				$jQ(this).parents('.pdp-offer-pop').fadeOut('fast');
			});
		} // end TEMP 'if'



// ONCLICK : below the fold ..............................................................

        // all tabs : active tab animation .......................
            $jQ('.tabs a').click(function () {
                vznActiveTabs(this);
            });


        // desktop tabs : more/less interaction ..................
            if (pgWidth > 959 ){
            
            	if ( pdpType == 'pdp' ) { 

                	$jQ('a.more-less-link').toggle(function(event) {
                    	showMore(this);
                	}, function (event) {
                    	showLess(this);
                	});
                	
                } else if ( pdpType == 'pdp-plus' ) { // pdp-plus never uses the 'tabs' version
                
                	$jQ('a.more-less-link').toggle(function(event) {
                    	singleShowMore(this);
                	}, function (event) {
                    	singleShowLess(this);
                	});
      
                }   
            } // end desktop if statement


        // phablet tabs : more/less interaction ....................
            if (pgWidth < 960 ){
               $jQ('a.more-less-link').toggle(function(event) {
                    singleShowMore(this);
                }, function (event) {
                    singleShowLess(this);
                });
            }


		// pdp-plus details : hero image & hotspot interaction
			if ( pdpType == "pdp-plus" ) {
			
			// select these
				var spot = $jQ('#detail-hotspot');
				var box = spot.next();
			// get hotspot starting point
				var spotLft = spot.attr('data-xcoord');
				var spotTop = spot.attr('data-ycoord');
			
			// do math for content box position
				var lftVar = parseInt(spotLft, 10);
				var boxLft = (lftVar + 34);
				
				var topVar = parseInt(spotTop, 10);
				var boxTop = ((topVar) );
			
			
			//apply positioning	
				spot.css({
					'left': spotLft + 'px',
					'top' : spotTop + 'px'
				});
				
				box.css({
					'left': boxLft + 'px',
					'top' : boxTop + 'px'
				});
			
			
			//hotspot click functions	
				spot.click(function(){
					box.fadeIn();
				});
		
				box.find('.hotspot-close').click(function(){
					$jQ(this).parent().fadeOut();
				});
				
			
			// hide hero image for bazaar voice tabs, show for the rest
				
				var dTabs = window.document.getElementById('detail-tabs');

				$jQ(dTabs).find('.overview a').click(function(){
					$jQ('#detail-hero-image-box').show();
				});
				
				$jQ(dTabs).find('.features a').click(function(){
					$jQ('#detail-hero-image-box').show();
				});
				
				$jQ(dTabs).find('.specs a').click(function(){
					$jQ('#detail-hero-image-box').show();
				});
				
				$jQ(dTabs).find('.compat a').click(function(){
					$jQ('#detail-hero-image-box').show();
				});

				$jQ(dTabs).find('.reviews a').click(function(){
					$jQ('#detail-hero-image-box').hide();
				}); 
				
				$jQ(dTabs).find('.questions a').click(function(){
					$jQ('#detail-hero-image-box').hide();
				});

			} // end 'if pdp plus' : product detail clicks
			
				
		
    	// featured tab : graphic block interaction ..................
            $jQ('.features li').toggle(function(){
                $jQ(this).find('.image').addClass('top');
                hover = $jQ(this).find('.hover-text');
                offset = 500 ;
                hSlide(hover, offset);
            }, function() {
                hover = $jQ(this).find('.hover-text');
                offset = -500 ;
                hSlide(hover, offset);
                $jQ(this).find('.image').removeClass('top');
            }); //end graphic block clicks



        // specs tab : download success interaction ....................
            $jQ('#download-link').click(function() {

                var hover = $jQ('#download-click');
                offset = 500;
                hSlide(hover, offset);
                //$jQ('#download-click').css('left', '0px');
                setTimeout(function() {
                offset = -500;
                hSlide(hover, offset);
                    //$jQ('#download-click').css('left', '-500px');
                }, 4000 );
                event.preventDefault();
            }); // end specs tab click

		
		
		// pdp lifestyles : reveal item clicks
			if ( pdpType == "pdp-plus" ) {
			
				$jQ('.product-reveal').stop().click(function(){	
					var rThis = $jQ(this).next();
					var rHt = rThis.width() ; 
					var rWd = rThis.height() ;
					vznReveal( rThis, rHt, rWd );
				}); // end reveal click
				
				$jQ('.related-product').stop().click(function(){	
					vznHide(this);
				}); // end reveal click
			} // end pdp lifestyle reveal clicks

			
			
			
			
// ONSCROLL : introduce anchor bar when user is below the fold.............................

            var btFold = $jQ('#anchor-trigger').offset().top;
            var anchorShow = 0;

            var checkScroll = setInterval(function() {

                if (anchorShow === 0) {
                    if ($jQ(window).scrollTop() >= btFold) {
                    $jQ('.anchor-bar').slideToggle(300);
                    anchorShow = 1;
                    }
                } else {
                    if ($jQ(window).scrollTop() < btFold) {
                        $jQ('.anchor-bar').slideToggle(100);
                        anchorShow = 0;
                    }
                }
            },10 );


// ONRESIZE : various enhancements to responsive presentation

	// hero : force cart layout > 767+
        $jQ(window).resize(function(){
            var resizePg = document.body.clientWidth;
            var resizeHt = $jQ(hero).height();
            if (resizePg > 767) {
                heroCart.style.height = resizeHt + 'px';

            } else {
            	heroCart.style.height = 'auto';

            } // end if/else
        });


	// hero : toggle carousel thumb center
        $jQ(window).resize(function(){
            var heroThumbs = window.document.getElementById('thumbs');
            var resizePg = document.body.clientWidth;

            if (resizePg < 960 && resizePg >= 768) { // tablet
                heroThumbs.style.marginLeft = 0;
                //$jQ(heroThumbs).css('margin-left', '0px');

            } else if ( resizePg > 959 ) { // desktop
                var cntrThmb = $jQ(heroThumbs).attr('data-center');
                heroThumbs.style.marginLeft = cntrThmb + 'px';
                //$jQ('#thumbs').css('margin-left', cntrThmb + 'px');
            }
        });


	// hero : zoom block adjustments
		$jQ(window).resize(function(){

			var isZoom = $jQ(zoomBlock).position().left;
			
			if(isZoom == 0){ 
			
				$jQ(zoomSlides).each(function(){ 
			
					var currentSld = window.document.getElementById('current-zoom-slide');
					var resizeWhatItem = $jQ(currentSld).index();
					
					var resizePgHt = document.body.clientHeight;
					var resizePgWd = document.body.clientWidth;
					var resizeMgnTop = resizePgHt / -2;
					
					var currentWin = $jQ(zoomCrsl).height();
					//alert(currentWin);
                	smallerView(currentSld, currentWin);
					
					// line-items first
						$jQ(this).css('margin-top', resizeMgnTop + 'px').find('li').each(function() {
					
						// first do line-item
							$jQ(this).css({
							'width': resizePgWd + 'px',
							'height' : resizePgHt + 'px',
							});
							
							
						// then do its image
							var resizeImgMgn = $jQ(this).find('img').width() / -2;
							$jQ(this).find('img').css({
								'margin-top' : resizeImgMgn + 'px', 
								'margin-left' :	resizeImgMgn + 'px'	
							});
	
						}); // end li each
					
					//parent list second
					
						var itemCount = $jQ(this).children().length;
						var resizeListWidth = itemCount * resizePgWd;
						var resizeListPosition = resizeWhatItem * resizePgWd * -1;
						
						$jQ(this).css({
							'width' : resizeListWidth + 'px',
							'margin-top' : resizeMgnTop + 'px',
							'-webkit-transform' : 'translate3d(' + resizeListPosition + 'px, 0, 0)'
						}).attr('data-length', resizeListWidth);
						
						
					// button increments last
					
						var resizePrev = Math.abs(resizePgWd);
						var resizeNext = resizePrev * -1;
						
						
						$jQ(this).parents('#zoom-carousel-block').find('.vzn-slide-prev').attr('data-incr', resizePrev );
						$jQ(this).parents('#zoom-carousel-block').find('.vzn-slide-next').attr('data-incr', resizeNext );
							
		
				}); // end ul each
			
			} // end if

		});


/* ===================================================================================
=============================== DEFINE FUNCTIONS =====================================
==================================================================================== */




function vznActiveThumbs(element) { //....................... vzn-active thumbs ..........
    $jQ(element).siblings().find('.vzn-active').css('width','0px');
    $jQ(element).find('.vzn-active').css('width', '100%');
}


function vznActiveTabs(element) { //......................... vzn-active tabs ............
    $jQ(element).parent().siblings().find('.vzn-active').css('width','0px');
    $jQ(element).parent().find('.vzn-active').css('width', '100%');
}



function preloadZoom(element) { //........................ preload zoom components .......
    // create anchor bar
        $jQ('.anchor-bar').clone().appendTo(element); //clone & insert current anchor bar
        $jQ('#zoom-block .anchor-bar').css({
            'top': '0px',
            'display': 'block',
            'position': 'absolute'
        }).removeAttr('id');

    //$jQ('#zoom-block .flex-control-thumbs').attr('id', 'zoom-thumbs');
    //$jQ('#zoom-thumbs').wrap('<div class="center-thumbs"><div class="center-block">'); // for styling
    //$jQ('<div class="vzn-active"></div>').appendTo('#zoom-block .flex-control-thumbs li'); // insert thumb animation element
    //$jQ('<div id="zoom-color-select"><ul id="avail-colors" class="inline-list"><a class="color-option black" title="color option: black"><div class="select-area"></div></a><a class="color-option grey" title="color option: grey"><div class="select-area"></div></a><a class="color-option white selected" title="color option: white"><div class="select-area"></div></a><a class="color-option blue"><div class="select-area"></div></a></ul></div>').appendTo('.center-block'); // insert color selector


    // 'element' passed is #zoom-block

} // end preload zoom




function pdpTab(href) { // ...................... custom tab function ...................

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
		$jQ(contentList).children().removeClass('active').each(function(){
			var thisID = $jQ(this).attr('id');
			if ( thisID == contentName ) {
				$jQ(this).addClass('active');
				return false;
			}
		
		});

} // end tab function



function installDesktopMoreLess(element) { //........ install tabs moreLess ...........

        // select these
            var tabWrap = $jQ(element);
            var wrapHt = tabWrap.height();

        // store starting container height
            tabWrap.attr('data-start', wrapHt);

        // declare math vars
            var newHt = -1;
            var tallest = -1;
            var xtra = -1;

        // get ID's to check for exclusions/variations
            var tabID = $jQ(this).parent().attr('id');
            if (tabID === "compatTab") {
                xtra = 98;
            } else {
                xtra = 30;
            }
        // loop through and get tallest
            tabWrap.children().each(function(i, child) {
                var check = $jQ(child).height();

                if ( check > tallest ) {
                    tallest = check;
                }
            });

        // compare tallest to starting height
            if ( tallest > wrapHt ) {
            // turn on more/less
                tabWrap.find('.more-less').css('display', 'block');
            // store full container height for click interaction
                newHt = (tallest + xtra);
                tabWrap.attr('data-height', newHt);
            }

    } // end installMoreLess defintion


function showMore(element) { //.......................... tabs showMore click ..........

        var target = $jQ(element).parents('.tab-wrapper');
        var full = (target.attr('data-height'));

        $jQ(target).css('height', full).addClass('less').find('.see-all').addClass('on');
        $jQ(element).text('Less').css('background', 'url(../img/sprites/pdp/blue-less.png) 0 4px no-repeat');
        event.preventDefault();

    } // end showMore


function showLess(element) { //............................. tabs showLess click .......

        var target = $jQ(element).parents('.tab-wrapper');
        var start = (target.attr('data-start'));

        $jQ(target).css('height', start).removeClass('less').find('.see-all').removeClass('on');
        $jQ(element).text('More').css('background', 'url(../img/sprites/pdp/blue-more.png) 0 4px no-repeat');
        event.preventDefault();

    }// end showLess



function singleMoreLess(element) { //................. install single moreLess ...........

    // select these
        var child = $jQ(element);
        var parent = $jQ(child).parent();
        var parentID = parent.attr('class');

    // get their respective heights
        var childHt = child.height();
        var parentHt = ( parent.height() + 20 );

    // if needed, clone link and activate
        if ( childHt > parentHt ) {
            childHt = (childHt + 10);  // mod for larger touch buttons
            parent.addClass('single-more-less');
            $jQ(element).parents('.tab-wrapper').find('.more-less').first().clone().appendTo(parent).attr({
                'data-child-height' : childHt,
                'data-parent-height' : parentHt
            }); //end attr
        }

    } // end single more/less


    function singleShowMore(element) { // ................... single showMore click ......

        //select these
        var childHt = $jQ(element).parent().attr('data-child-height');
        var parentHt = $jQ(element).parent().attr('data-parent-height');
        var parent = $jQ(element).parents('.single-more-less');
        
        
        // if pdp-plus 960+
        var pgWd = document.body.clientWidth;
        var template = $jQ('body').attr('id');
        
        //alert(template); alert(pgWd);
        if (template == 'pdp-plus' && pgWd > 959) {
        
        	// do the math
        	var curTab  = $jQ(parent).parent();
        	var curTabHt  = $jQ(curTab).height();
        	var htDiff = ((childHt - parentHt));
        	var newTabHt = curTabHt + htDiff;
        	
        	// make the change
        	//alert(curTabHt); alert(htDiff);
        	curTab.css('height', newTabHt);
        }// if pdp plus 960+
        
        // make the change
        $jQ(parent).css('height', childHt).addClass('less').find('.see-all').addClass('on');
        $jQ(element).text('Less').css('background', 'url(../img/sprites/pdp/blue-less.png) 0 4px no-repeat');
        event.preventDefault();



    } // end singleShowMore

    function singleShowLess(element) { // ................... single showLess click ......

        //select these
        var parentHt = $jQ(element).parent().attr('data-parent-height');
        var childHt = $jQ(element).parent().attr('data-child-height');
        var parent = $jQ(element).parents('.single-more-less');
        
        
        
        // if pdp-plus 960+
        var pgWd = document.body.clientWidth;
        var template = $jQ('body').attr('id');
        
        //alert(template); alert(pgWd);
        if (template == 'pdp-plus' && pgWd > 959) {
        
        	// do the math
        	var curTab  = $jQ(parent).parent();
        	var curTabHt  = $jQ(curTab).height();
        	var htDiff = ((childHt - parentHt));
        	var newTabHt = curTabHt - htDiff;
        	
        	// make the change
        	//alert(curTabHt); alert(htDiff); alert(newTabHt);
        	curTab.css('height', newTabHt);
        }// if pdp plus 960+
        
        
        // make the change
        $jQ(parent).css('height', parentHt ).removeClass('less').find('.see-all').removeClass('on');
        $jQ(element).text('More').css('background', 'url(../img/sprites/pdp/blue-more.png) 0 4px no-repeat');
        event.preventDefault();


    } // end singleShowLess





function createZoomPanel() { // ............................ create zoom panel ..........
	//alert('yes');
    // reselect these
        var zoomBlock = window.document.getElementById('zoom-block');
        var zoomCrsl = window.document.getElementById('zoom-carousel-block');
        var zoomFocus = window.document.getElementById('zoom-focus');
        var zoomSlides = window.document.getElementById('zoom-slides');

    // get current page dimensions
        var pgWd = document.body.clientWidth;
        var pgHt = document.body.clientHeight;
		

    // create panel width & offset to match current dimensions
        var hSize = (pgWd + 15); //scroll bar width in Chrome, generate dynamically
        var hOffset = (hSize * -1);

    // new var for contextual layout differences
        var crslWd = hSize;  // landscape
        var lstOff = 0;    // landscape

    // modify for portrait
        if ( pgHt >= pgWd ) {
            crslWd = pgHt;
            lstOff = ((pgWd - crslWd)/2);
            }

    // set element dimensions & starting positions
        //block
        $jQ(zoomBlock).css({ 'left': hOffset + 'px' }).attr('data-h-return', hOffset);


        //slide
        $jQ(zoomSlides).find('li').css({
            'width' : crslWd + 'px',
            'height': pgHt + 'px' });
            
        // set 'current' on first slide
        $jQ(zoomSlides).find('li:first').attr('id', 'current-zoom-slide');


        // slide image
        $jQ(zoomSlides).find('li').find('img').each(function(){
            var imgHt = $jQ(this).height();
            var imgMgn = (imgHt / -2);
            this.style.marginTop = imgMgn + 'px';
            this.style.marginLeft = imgMgn + 'px';
        });


		// slide list
		var ulMgnTop = $jQ(zoomSlides).find('li:first').height() / -2;
        $jQ(zoomSlides).css({
            'left' : lstOff + 'px',
            'top': '50%',
            'margin-top' : ulMgnTop
             });



		// install vzn-slide
			var type = 'zoom';
			$jQ(zoomFocus).addClass('zoom');    	
			vznSlideInstall(zoomFocus, type, crslWd);

		// activate next,prev buttons
		 $jQ(zoomBlock).find('.vzn-slide-prev, .vzn-slide-next').click(function() {
        	var endMod = 0;
            vznSlideButtons(this, endMod);
        });

    	// set off state
         $jQ(zoomBlock).find('.vzn-slide-prev, .vzn-slide-next').click(function() {
            return false;
        });


        // slide in panel
            hSlide(zoomBlock, hSize);


        // hide vertical scroll after
            setTimeout(function() {
                $jQ('html, body').addClass('body-zoom');
            }, 750);

        // fade in controls
            setTimeout(function() {
                $jQ('#zoom-block .center-block, #zoom-close, #zoom-controls, .vzn-slide-prev, .vzn-slide-next').fadeIn('slow');
            }, 500);

        // ONCLICK : 'bigger' click on fixed button & initial current slide
            $jQ('#zoom-controls .bigger, #current-zoom-slide').click(function(){ 
                var currentSld = window.document.getElementById('current-zoom-slide');
                biggerView(currentSld);
            });


        // ONCLICK : 'smaller'
            $jQ('#zoom-controls .smaller').click(function(){
            	var currentSld = window.document.getElementById('current-zoom-slide');
            	var currentWin = $jQ(zoomCrsl).height();
                smallerView(currentSld, currentWin);
            });

        // ONCLICK : 'close'
            $jQ(zoomClose).click(closeZoomPanel);


 } // end create zoom panel




function biggerView(slide){ // ................................. zoom panel 'bigger'..........

    // declare these
        image = slide.getElementsByTagName('img');
        var format = 'decide';

    // get fresh page dimensions
        var pgWd = document.body.clientWidth;
        var pgHt = document.body.clientHeight;

    // check format
        if (pgHt >= pgWd) {
            format = 'portrait';
        } else {
            format = 'landscape';
        }

    // zoom the image
        vznZoomIn(image, format);

    // make it draggable
    setTimeout( function(){
        vznDragImg(slide, format);
    }, 200);

} // end biggerView definition


function smallerView(slide, winHt) { // ................................. zoom panel 'smaller'........
	
	// declare these
        image = slide.getElementsByTagName('img');
        var format = 'decide';
	
	// get fresh page dimensions
        var pgWd = document.body.clientWidth;
        var pgHt = document.body.clientHeight;

    // check format
        if (pgHt >= pgWd) {
            format = 'portrait';
        } else {
            format = 'landscape';
        }
        
	// first bring back image, remove class, & hide background 
		$jQ(slide).css({
			'background-image' : 'none',
		}).removeClass('zoomed').find('img').show();
	
	
	// zoom out image
		setTimeout(function(){
        	vznZoomOut(image, format);
        }, 50);
	
	//now reset container styles
		var currentWindowHt = winHt;
		$jQ(slide).css({
			'height' : currentWindowHt + 'px',
			'margin-top': '0px',
			'top' : '0px',
			'left' :'0px'
		});
	

} // end smallerView







function closeZoomPanel() { // ................................ zoom panel 'close'........
    //reselect these
        var zoomBlock = window.document.getElementById('zoom-block');
        var zoomCrsl = window.document.getElementById('zoom-carousel-block');
        var zoomSlides = window.document.getElementById('zoom-slides');
        var currentSld =  window.document.getElementById('current-zoom-slide');
        
    // fade out controls
        setTimeout(function() {
            $jQ('#zoom-block .center-block, #zoom-close, #zoom-controls').fadeOut('slow');
        }, 250);

    //restore vertical scroll
        $jQ('html, body').removeClass('body-zoom');

    // slide out panel
        var sldReturn = $jQ(zoomBlock).attr('data-h-return');
        hSlide(zoomBlock, sldReturn);


    // restore current image if required
    	setTimeout(function(){
    		if ($jQ(currentSld).hasClass('zoomed')) {
    			var currentWin = $jQ(zoomCrsl).height();
            	smallerView(currentSld, currentWin);
    		}
    	}, 500);
    	

    //snap
        $jQ(window).trigger('resize');

} // end set closeZoomPanel







function vznSlideInstall (element, type, increment) { //.................. vznSlide Install .........

    //  first assemble these contextual values

		var baseIncr = increment;

        if (type == 'simple') { 
            var multi = getMulti(type); // for responsive change
            var mod = 0;
            
        } else if (type == 'fancy') {
            var multi = getMulti(type); // for responsive change
            var mod = 1;

        } else if (type == 'lifestyles') {

        	baseIncr = baseIncr + 1; // accomodate box-sizing border math
        	var multi = 1.5; // use function when we get to responsive
        	var mod = -1;
      
        } else if (type == 'zoom') {

			baseIncr = increment;
			var multi = 1;
			var mod = 0;
			
            

        }  // end type check

    // math = amount to advance simple slider on each click
            var advIncr = (baseIncr * multi);
            advIncr = advIncr + mod;
            
            var prvIncr = advIncr;
            var nxtIncr = ( advIncr * -1 );

    // then get length of curent slide container....
            var list = $jQ(element).find('.slides');
            var itemCount = list.find('li').length;

    // ... and use it to set proper width for slide container 
            var listIncr = 0;
           if (type == 'fancy' || type == 'lifestyles' ) {
                listIncr = baseIncr / 2;
                
                // add logic for end of list if last element is large product/story !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                
            }  else {
                listIncr = baseIncr;
            }
            var listLength = (( itemCount * listIncr ) + 1);
            
            if (type == 'zoom'){ // the only instance without border issues
            	listLength = listLength - 1; 
            }
            


    // finally, apply this to actual elements
            list.css('width', listLength + 'px' ).attr('data-length', listLength ).attr('data-items', itemCount);
			
			var sldCntnr = $jQ(element).parent();
            $jQ('<div class="vzn-slide-prev"></div>').appendTo(sldCntnr).attr('data-incr', prvIncr).addClass('off');
            $jQ('<div class="vzn-slide-next"></div>').appendTo(sldCntnr).attr('data-incr', nxtIncr);

} // end vznSlideInstall




function vznSlideButtons (element, mod) { // ........................ vznSlide Buttons ........
		
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
			var endPosition = (windowLength - listLength) ; 
			// if this is 0 or positive, no slideshow at all ADD THIS LOGIC!!!!!!!!!!!!!!!!!


//alert(listLength); alert(windowLength);  alert(advance); alert(currentPosition); alert(endPosition);


        // do the 'loop' math
            newPosition = (currentPosition + advance);
            
        //decide what to do
        
        	
        	 
        if ( slideWindow.hasClass('lifestyles')  && $jQ(tabWrap).find('.vzn-slide-next').hasClass('off') ) { // end position check : lifestyles only
        			
        			var lifestyleEndCheck = listLength + currentPosition;
        			var lifestyleIncr = Math.abs(advance) * 2 ;
        					//alert (lifestyleIncr); alert( lifestyleEndCheck);
        			if ( lifestyleEndCheck <   lifestyleIncr ) { //  modify first 'prev' advance only 
        			 
        				var leftGap = windowLength - advance;
        				
        				advance = advance - leftGap - 3;
        				
        			 	newPosition = (currentPosition + advance);
        			 
        			 			//alert(advance); alert (newPosition); alert( lifestyleEndCheck);
        			 			//newPosition = ( currentPosition + lifestyleEndCheck );
        			
        			 
        			 	// move it
                			hSlide(list,newPosition);
                			
                		// turn both on
                			$jQ(tabWrap).find('.vzn-slide-next').removeClass('off');
                			$jQ(tabWrap).find('.vzn-slide-prev').removeClass('off');	
        			 
        		
        			} // end mod prev advance : lifestyles only
        
        	} else { //run through the loop for everyone
        
        	// first, if zoom, reassign 'current' id & erase dragging data if any
        			 	
        		if(slideWindow.hasClass('zoom')) {
        		
        			// erase dragging
        				var currentSld =  window.document.getElementById('current-zoom-slide');
    					setTimeout(function(){
    						if ($jQ(currentSld).hasClass('zoomed')) {
    							var currentWin = $jQ(zoomCrsl).height();
    							
            					smallerView(currentSld, currentWin);
    						}
    					}, 0);

        			// current ID
        			 	var oldCurrent = $jQ(slideWindow).find('#current-zoom-slide');
        				
        				if (advance < 0) {
        					//'next' click
        					//alert('next will be new current');
        					oldCurrent.next('li').attr('id', 'current-zoom-slide');
        					oldCurrent.removeAttr('id');
        				} else {
        					//'prev' click
        					//alert('prev will be new current');
        					oldCurrent.prev('li').attr('id', 'current-zoom-slide');
        					oldCurrent.removeAttr('id');
        				}
        				
        			// give new current slide 'bigger' click function	
        				$jQ('#current-zoom-slide').click(function(){
        					biggerView(this);
        				});




        				
        		} // end zoom only duties
        
        	// get on with it already
            	if ( newPosition >= 0) { // back at beginning
                	newPosition = 0;
					//alert('begin'); alert(newPosition); alert(endPosition);
            		//move it
                		hSlide(list, newPosition);

            		// turn prev off, leave next on
                		$jQ(tabWrap).find('.vzn-slide-prev').addClass('off');
                		$jQ(tabWrap).find('.vzn-slide-next').removeClass('off');

            	} else if ( newPosition <= endPosition ) { // at end
            
            		// modify to hide border-right as req
        
         				if (slideWindow.hasClass('simple')) { // don't mod simple
        					newPosition = endPosition;
        				} else if (slideWindow.hasClass('fancy')) {
							newPosition = endPosition + 5; // do mod fancy 
						} else if (slideWindow.hasClass('lifestyles')) { // do mod lifestyles 
							var endModify = mod * -2;
						newPosition = endPosition + endModify; // do mod lifestyles 
						} else if (slideWindow.hasClass('zoom')) {
							//alert('end'); alert(newPosition); alert(endPosition);
							newPosition = endPosition;
						}
					
					// move it
                			hSlide(list,newPosition);
                			
                		
                	// leave prev on, turn next off
                		$jQ(tabWrap).find('.vzn-slide-next').addClass('off');
                		$jQ(tabWrap).find('.vzn-slide-prev').removeClass('off');
		

            	} else { // somewhere in between
            		//alert('between'); alert(newPosition); alert(endPosition);
            		// move it
                		hSlide(list,newPosition);

            		// make sure both are on
                		$jQ(tabWrap).find('.vzn-slide-next').removeClass('off');
                		$jQ(tabWrap).find('.vzn-slide-prev').removeClass('off');
            	}
            
            
            
            } // end loop for everyone

} // end vznSlideButtons



function getMulti(type) { //........ responsive multipliers for vznSlide ............

    if (type == 'simple') {
       if ( pgWidth < 480 ) {  // mobile portrait
                    multi = 1;
                } else if ( pgWidth > 479 && pgWidth <720 ) { // mobile landscape
                    multi = 2;
                } else if ( pgWidth > 719 && pgWidth < 960 ) { // tablet portrait
                    multi = 3;
                } else if ( pgWidth > 959 ) { // 1024 layout
                    multi = 4;
                } //end responsive val

    } else if (type == 'fancy') {
            if ( pgWidth < 480 ) {  // mobile portrait
                    multi = 1;
                } else if ( pgWidth > 479 && pgWidth <720 ) { // mobile landscape
                    multi = 1.5;
                } else if ( pgWidth > 719 && pgWidth < 960 ) { // tablet portrait
                    multi = 2;
                } else if ( pgWidth > 959 ) { // 1024 layout
                    multi = 2.5;
                } // end responsive val

    } // end type check

    return multi;

} // end getMulti function



function hSlide(element,hValue) { //....... horiz move only .............
    $jQ(element).css({
        '-webkit-transform': 'translate3d(' + hValue + 'px, 0, 0)',
  		'-moz-transform' : 'translate3d(' + hValue + 'px, 0, 0)',
  		'-ms-transform' : 'translate3d(' + hValue + 'px, 0, 0)',
 		'-o-transform' : 'translate3d(' + hValue + 'px, 0, 0)',
  		'transform' : 'translate3d(' + hValue + 'px, 0, 0)'
  	}); // end css
} // end hSlide function


function zSlide(element,hValue, vValue) { //....... horiz/vert move .............
    $jQ(element).css({
        '-webkit-transform': 'translate3d(' + hValue + 'px,' + vValue + 'px, 0)',
  		'-moz-transform' : 'translate3d(' + hValue + 'px,' + vValue + 'px, 0)',
  		'-ms-transform' : 'translate3d(' + hValue + 'px,' + vValue + 'px, 0)',
 		'-o-transform' : 'translate3d(' + hValue + 'px,' + vValue + 'px, 0)',
  		'transform' : 'translate3d(' + hValue + 'px,' + vValue + 'px, 0)'
  	}); // end css
} // end hSlide function


function vznReveal(element, ht, wd) { // ...... reveal element from bottom right, goes with vznHide
	var wdIncr = (wd * .985 ) * -1;
	var htIncr = (ht * .9775) * -1; 
		
	$jQ(element).css({
		'-webkit-transform' : ' translate3d(' + wdIncr + 'px,' + htIncr + 'px, 0) ',
        '-moz-transform' : ' translate3d(' + wdIncr + 'px,' + htIncr + 'px, 0) ',
        '-ms-transform' : ' translate3d(' + wdIncr + 'px,' + htIncr + 'px, 0) ',
        '-o-transform' : ' translate3d(' + wdIncr + 'px,' + htIncr + 'px, 0) ',
        'transform' : ' translate3d(' + wdIncr + 'px,' + htIncr + 'px, 0) ' 

	}); // end css
} // end vznReveal

function vznHide(element) { // ...... hide element from top left, goes with vznReveal
	$jQ(element).css({
		'-webkit-transform' : ' translate3d(0, 0, 0)',
        '-moz-transform' : ' translate3d(0, 0, 0)',
        '-ms-transform' : ' translate3d(0, 0, 0)',
        '-o-transform' : ' translate3d(0, 0, 0)',
        'transform' : ' translate3d(0, 0, 0)' 

	}); // end css
} // end vznHide



function fancyPosition (item, position, increment) { //... position fancy slider elements pdp+ ...

	var incr = increment / 2;
	var addIncr = increment;
	
	// general li values
		var left = incr * position;;
		var top = 0;

	// exceptions 
		if ( position === 1 || position%5 === 1 ) { //left values for positions-1-6-11-16-etc
			left = left + incr;
			}
	
		if ( position%5 === 2 || position%5 === 3 ) { //top values for positions-2-3-7-8-12-13-etc
			top = incr;
		}
		
	// apply values
		
		$jQ(item).css({
			'left' : left + 'px',
			'top' : top + 'px'
		});
		
	// then, edit layout inside each item (all of them )
        $jQ(item).each(function() {
            var title= $jQ(this).find('.product-title');
            $jQ(this).find('.fancy-ratings').appendTo(title);
        });
}






function lifestylePosition(item, position, increment) { //... position lifestyle slider elements pdp+ ...
	
	var incr = increment / 2;
	var addIncr = increment;
	var left = 0;
	var nextLeft = 0;
	var top = 0;
	
	if (position < 3) {// check for initial special case
		
		if (position == 0) { // do nothing to position-0	 
			} else { // left value for positions-1-2
			left = 2 * incr;
		}
		
		if (position == 2) { //top value for positions-2
			top = incr;
		}
		
		$jQ(item).css({ 
			'top' : top +'px',
			'left' : left + 'px'
		});
	
	} else {
		//cycle of 3
	
		if ( position%3 === 0 ) { // values for positions-3-6-9-etc
		
			left = position * incr;
			$jQ(item).css({ 'left' : left + 'px' });
			
			nextLeft = left + addIncr
			
			$jQ(item).next('li').css({ 'left' : nextLeft + 'px' }); // values for positions-4-7-10-etc
			
			$jQ(item).next('li').next('li').css({ // values for positions-5-8-11-etc
				'left' : nextLeft + 'px',
				'top' : incr + 'px' });
	
		} // do nothing until position divides by 3 again 
	} // end special-case-check-then-loop
} // end lifestylePosition


function vznZoomIn(image, format) { // ........... zoom in for 'bigger' .................

  if ( format == 'portrait' ) {
    $jQ(image).css({
        '-webkit-transform' : ' scale(1.5) translate3d(20%, 0%, 0)',
        '-moz-transform' : ' scale(1.5) translate3d(20%, 0%, 0)',
        '-ms-transform' : ' scale(1.5) translate3d(20%, 0%, 0)',
        '-o-transform' : ' scale(1.5) translate3d(20%, 0%, 0)',
        'transform' : ' scale(1.5) translate3d(20%, 0%, 0)' });
  } else if ( format == 'landscape' ) {
    $jQ(image).css({
        '-webkit-transform' : ' scale(1.5) translate3d(0%, 0%, 0)',
        '-moz-transform' : ' scale(1.5) translate3d(0%, 0%, 0)',
        '-ms-transform' : ' scale(1.5) translate3d(0%, 0%, 0)',
        '-o-transform' : ' scale(1.5) translate3d(0%, 0%, 0)',
        'transform' : ' scale(1.5) translate3d(0%, 0%, 0)' });
  }
} // end vznZoomImg



function vznZoomOut(image, format) { // .............  zoom out for 'smaller' ............

  if ( format == 'portrait' ) {
    $jQ(image).css({
        '-webkit-transform' : ' scale(1) translate3d(20%, 0%, 0)',
        '-moz-transform' : ' scale(1) translate3d(20%, 0%, 0)',
        '-ms-transform' : ' scale(1) translate3d(20%, 0%, 0)',
        '-o-transform' : ' scale(1) translate3d(20%, 0%, 0)',
        'transform' : ' scale(1) translate3d(20%, 0%, 0)' });
  } else if ( format == 'landscape' ) {
    $jQ(image).css({
        '-webkit-transform' : ' scale(1) translate3d(0%, 0%, 0)',
        '-moz-transform' : ' scale(1) translate3d(0%, 0%, 0)',
        '-ms-transform' : ' scale(1) translate3d(0%, 0%, 0)',
        '-o-transform' : ' scale(1) translate3d(0%, 0%, 0)',
        'transform' : ' scale(1) translate3d(0%, 0%, 0)' });
  }
} // end vznZoomImg





function vznDragImg(slide, format) { //............ make image draggable on zoom ..........

		setTimeout(function(){
		
		// get the image 
			var imgURL = $jQ(slide).find('img').attr('src');
		
		// get new container height
			var newHt = $jQ(slide).width();
			
		// get vertical center dimension
            if (window.getComputedStyle) { //modern
                    vertWin = window.getComputedStyle(zoomCrsl).height;
            } else { // IE<9
                    vertWin = $jQ(zoomCrsl).height();
            }
            
            var verticalWindow = parseInt(vertWin, 10);
            var containerHeight = parseInt(newHt, 10);	
             
            var diff = verticalWindow - containerHeight;
            var newMgnTop = diff/2;
            
        // make the change
			
			$jQ(slide).css({
				'background' : 'url(' + imgURL + ') center center no-repeat',
				'background-size' : '105%',
				'height' : newHt + 'px',
				'margin-top' : newMgnTop + 'px'
				}).find('img').hide(); 
			}, 200 );


        // make it draggable
			$jQ(slide).addClass('zoomed');   
        	var $dragging = null;
    	
    		$jQ('body').on("mousedown", ".zoomed", function(e) {
        		$jQ(this).attr('unselectable', 'on').addClass('draggable');
        		
        		var startX = $jQ(this).offset().left; //offset at time of mousedown
        		var startY = $jQ(this).offset().top; 
        		
        		//alert(startX); alert(startY);
        		
        		var downMouseX = e.pageY; // where mouse is down
        		var downMouseY = e.pageX;
        		
        		//alert(downMouseX); alert(downMouseY);
        		
        		var el_w = $jQ('.draggable').outerWidth(),
            		el_h = $jQ('.draggable').outerHeight();
        		$jQ('body').on("mousemove", function(e) {
        		
        			var dragChangeX = e.pageX - downMouseX;
                	var dragChangeY = e.pageY - downMouseY;
                	
                	//alert(downMouseX); alert(downMouseY);
                	//alert(dragChangeX); alert(dragChangeY);
                	
            		if ($dragging) {
                		$dragging.offset({ //was offset
                		
                			
                			
                    		//top: dragChangeY,
                    		//left: dragChangeX
                    		
                    		
                    		
                    		top: e.pageY -  el_h / 2,
                    		left: e.pageX -  el_w / 2
                    		
                    		
                		});
                		
            		}
        		});
        		$dragging = $jQ(e.target);
    		}).on("mouseup", ".draggable", function(e) {
        		$dragging = null;
        		$jQ(this).removeAttr('unselectable').removeClass('draggable');
    		});

} // end vznDragImg



function clearDragged(element) { //.................... clear dragged img info ...........

    element.style.top = 0;
    element.style.left = 0;
    $jQ(element).attr({
        'data-top' : 0,
        'data-left' : 0,
        'data-state' : 0
    }); // end attr

} // end clearDragged


function restoreImages(element){ //....restore images for zoom panel 'smaller' & close ...

//element is the li

	$jQ(element).find('img').each(function(){

		this.style.marginLeft = 'auto';

	});

}// end restoreImages





//........................... TEMP development stuff......................................


// ............. TEMP state toggle buttons in header .........

	var stndrd = document.getElementById('state-standard');
	var sale = document.getElementById('state-sale');
	var prod = document.getElementById('product-oos');
	var clr = document.getElementById('color-oos');


	$jQ(stndrd).click(function() {
	
		var stndrd = document.getElementById('state-standard');
		var sale = document.getElementById('state-sale');
		var prod = document.getElementById('product-oos');
		var clr = document.getElementById('color-oos');

	
		// change font colors for nav
			$jQ(this).addClass('on');
			$jQ(sale).removeClass('on');
			$jQ(prod).removeClass('on');
			$jQ(clr).removeClass('on');
		
		//turn off everything else
	
		  	// turn off sale, restore standard where req
        		$jQ('.offer').css('display', 'none');
        		$jQ('.no-offer').css('display', 'list-item');
        	
        	// turn off product, restore button
        		$jQ('.OOS.product').css('display', 'none');
        		$jQ('.add-cart-cta').removeClass('oos');
        	
        	
        	// turn off color, 
				$jQ('.OOS.color').css('display', 'none');
				
			// restore cta button
        		$jQ('#add-cart-box').removeClass('oos');	
	
	});
	
	
	
	$jQ(sale).click(function() {
	
		var stndrd = document.getElementById('state-standard');
		var sale = document.getElementById('state-sale');
		var prod = document.getElementById('product-oos');
		var clr = document.getElementById('color-oos');

		// change font colors for nav
			$jQ(this).addClass('on');
			$jQ(stndrd).removeClass('on');
	
		// turn on sale elements, hide standard where req
        	$jQ('.offer').css('display', 'list-item');
        	$jQ('.no-offer').css('display', 'none');
	});


	$jQ(prod).click(function() {
	
		var stndrd = document.getElementById('state-standard');
		var sale = document.getElementById('state-sale');
		var prod = document.getElementById('product-oos');
		var clr = document.getElementById('color-oos');

		// change font colors for nav
			$jQ(this).addClass('on');
			$jQ(stndrd).removeClass('on');
			$jQ(clr).removeClass('on');
	
		//turn on product, turn off color where req,
			$jQ('.OOS.product').css('display', 'block');
			$jQ('.OOS.color').css('display', 'none');	
			$jQ('.add-cart-cta').addClass('oos');
			
		// mod cta button
			$jQ('#add-cart-box').addClass('oos');
	});



	$jQ(clr).click(function() {
	
		var stndrd = document.getElementById('state-standard');
		var sale = document.getElementById('state-sale');
		var prod = document.getElementById('product-oos');
		var clr = document.getElementById('color-oos');

		// change font colors for nav
			$jQ(this).addClass('on');
			$jQ(stndrd).removeClass('on');
			$jQ(prod).removeClass('on');
	
		//turn on product, turn off color where req,
			$jQ('.OOS.color').css('display', 'block');
			$jQ('.OOS.product').css('display', 'none');
			
		// mod cta button
			$jQ('#add-cart-box').addClass('oos');

			
	}); // end TEMP state buttons 



  


        
       
        


$jQ('.product-link').each(function() { //......... get info for TEMP product click .......
        var prodName = $jQ(this).find('.product-title').text();
        var param = prodName.replace(/\s+/g, '');

        $jQ(this).attr('title', 'Click to view ' + prodName );
        $jQ(this).find('img').attr('title', 'Click to view ' + prodName );
        $jQ(this).attr('href', 'pdp-temp-click.html' + '?' + param);
});

var tempProdName = window.location.search.substring(1); // ..... show TEMP click info ....
$jQ('.temp-wrap h2').text(tempProdName);




        }
    };
    return pub;
}());







