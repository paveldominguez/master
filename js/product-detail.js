var productDetail = (function() {

    var pub = {
        init : function() {


//ONLOAD : special offer display .........................................................

    // offers off
      //  $jQ('.offer').css('display', 'none');
      //  $jQ('.no-offer').css('display', 'list-item');

    // offers on
        $jQ('.offer').css('display', 'list-item');
        $jQ('.no-offer').css('display', 'none');
        
        
        
		
// ONLOAD : universal vars for contextual/dynamic layouts
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

// ONLOAD : flexslider install ..........................................................

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

        //$jQ(zoomFocus).flexslider({
        //    animation: "slide",
        //    controlNav: "thumbnails"
        //});

        $jQ(zoomFocus).removeClass('flexslider').addClass('vzn-slide');

// ONLOAD & RESIZE: responsive layout adjustments........................................

        // hero onload : force hero layout > 960+
            if (pgWidth > 959) {
                setTimeout(function() {
                    var heroHt = $jQ(heroCrsl).height();
                    //alert(heroHt);
                    heroCart.style.height = heroHt + 'px';


                }, 200);
            } // end if

    // hero resize : force cart layout > 767+
            $jQ(window).resize(function(){
               var resizePg = document.body.clientWidth;
                var resizeHt = $jQ(hero).height();
               if (resizePg > 767) {
                    heroCart.style.height = resizeHt + 'px';

               } else {
                   heroCart.style.height = 'auto';

                } // end if/else
           });


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

        // hero resize : toggle carousel thumb center
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
 






// ONLOAD : initial vzn-active display ..................................................

    // hero : carousel current thumb,
            $jQ('#thumbs .flex-active-slide').find('.vzn-active').css('width', '100%');
    // below the fold : current tab
             $jQ('.tabs .active').find('.vzn-active').css('width', '100%');



// ONLOAD : preload zoom panel components ...............................................

    preloadZoom(zoomBlock);



// ONLOAD : make form elements pretty

    $jQ("select").uniform();



// ONLOAD : install custom tab function :P

	$jQ('.tabs dd a').click(function(){
		pdpTab(this);
	});


// ONLOAD : install overview tabs more/less interaction below the fold ...................

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


// ONLOAD : install vzn-sliders .........................................................

    $jQ('.vzn-slide').each(function(){
        element = $jQ(this);
        instance =  $jQ(this).attr('id');

        if ( instance.indexOf('simple') > -1 ) {
            $jQ(this).addClass('simple');
            type = 'simple';
        } else if ( instance.indexOf('fancy') > -1 ) {
            $jQ(this).addClass('fancy');
            type = 'fancy';
        } else if ( instance.indexOf('zoom') > -1 ) {
            $jQ(this).addClass('zoom');
            type = 'zoom';
        }
        vznSlideInstall(element,type);
        //alert(element); alert(type);
    });



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




     //   $jQ('.color-option').click(function(){
     //       $jQ(this).parent().find('.selected').removeClass('selected');
     //       $jQ(this).addClass('selected');

     //       var selectedTitle = $jQ('.color-option.selected').attr('title');
     //       $jQ(this).parents('.color-stock-block').find('span.color-option').html(selectedTitle).textTransform="uppercase";
     //   });


    // create contextual zoom panel ..........................
        $jQ(zoomBtn).click(function () {
            createZoomPanel();
        });





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
                	
                } else if ( pdpType == 'pdp-plus' ) {
                
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
            });


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
            });


        // vzn-slide nav button interaction "on" .......................
            $jQ('.vzn-slide-prev, .vzn-slide-next').click(function() {
                vznSlideButtons(this);
            });

        // vzn-slide nav button interaction "off"
            $jQ('.vzn-slide-prev.off, .vzn-slide-next.off').click(function(){
                return false;
            });





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
            childHt = (childHt + 60);  // mod for larger touch buttons
            parent.addClass('single-more-less');
            $jQ(element).parents('.tab-wrapper').find('.more-less').first().clone().prependTo(parent).attr({
                'data-child-height' : childHt,
                'data-parent-height' : parentHt
            }); //end attr
        }

    } // end single more/less


    function singleShowMore(element) { // ................... single showMore click ......

        //select these
        var childHt = $jQ(element).parent().attr('data-child-height');
        var parent = $jQ(element).parents('.single-more-less');
        
        //change 'em
        $jQ(parent).css('height', childHt).addClass('less').find('.see-all').addClass('on');
        $jQ(element).text('Less').css('background', 'url(../img/sprites/pdp/blue-less.png) 0 4px no-repeat');
        event.preventDefault();



    } // end singleShowMore

    function singleShowLess(element) { // ................... single showLess click ......

        //select these
        var parentHt = $jQ(element).parent().attr('data-parent-height');
        var parent = $jQ(element).parents('.single-more-less');
        
        
        // chnage'em
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
        $jQ(zoomBlock).css({
            'left': hOffset + 'px',
            'width' : hSize + 'px',
            'height': pgHt + 'px' });
        $jQ(zoomBlock).attr('data-h-return', hOffset);

        //carousel
        $jQ(zoomCrsl).css({
            'width' : crslWd + 'px',
            'height': pgHt + 'px' });

        //focus window
        $jQ(zoomFocus).css({
            'width' : crslWd + 'px',
            'height': pgHt + 'px' });

        // slide list
        $jQ(zoomSlides).css({
            'left' : lstOff + 'px' });

        //slide
        $jQ(zoomSlides).find('li').css({
            'width' : crslWd + 'px',
            'height': pgHt + 'px' });

        // slide image
        $jQ(zoomSlides).find('li').find('img').each(function(){
            var imgHt = $jQ(this).height();
            var imgMgn = (imgHt / -2);
            this.style.marginTop = imgMgn + 'px';
            this.style.marginLeft = imgMgn + 'px';
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

        // ONCLICK : 'bigger'
            $jQ('#zoom-controls .bigger, #current-zoom-slide').click(function(){
                var currentSld = window.document.getElementById('current-zoom-slide');
                biggerView(currentSld);
            });


        // ONCLICK : 'smaller'
            $jQ('#zoom-controls .smaller').click(smallerView);

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
        vznZoomImg(image, format);

    // make it draggable
        vznDragImg(slide, format);

} // end biggerView definition


function smallerView() { // ................................. zoom panel 'smaller'........

    // get fresh page dimensions
        var pgWd = document.body.clientWidth;
        var pgHt = document.body.clientHeight;



    /* retrieve & restore to original values
        var startCrsl = $jQ(zoomCrsl).attr('data-strt-width');

        zoomCrsl.style.width = startCrsl + 'px';
        zoomFocus.style.width = startCrsl + 'px';

        // snap
        $jQ(window).trigger('resize');

    // reduce & restore li
        $jQ(zoomSlides).find('li').each(function(){
            restoreImages(this);
        }); //end each li


    // add fresh zoom function to li
        $jQ('#zoom-slides .flex-active-slide').click(biggerView); */

} // end smallerView






function vznZoomImg(image, format) { // ... zoom image for 'bigger' & replace with background ...

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



function vznDragImg(slide, format) {

}

    /* expand, convert to background & reposition
        $jQ(zoomSlides).find('li').each(function(){

            // get image url
                var imgURL = $jQ(this).attr('data-thumb');
            // declare math vars
                var lgDim = 0;
                var vertWin = 0;
                var topAdj = 0;

            // dynamic outside dimenions
                if (window.getComputedStyle) { //modern
                    lgDim = window.getComputedStyle(zoomCrsl).width;
                } else { // IE<9
                    lgDim = $jQ(zoomCrsl).width();
                }

            // parse image dimension
            var parsedDim = parseInt(lgDim, 10);

            //  adjust vars based on context
                if (pgHt >= pgWd) { // portrait
                    lgDim = parsedDim * 1.4;
                    topAdj = 250;

                    // adjust increment
                    zoomFocus.style.width = lgDim + 'px';
                    $jQ(window).trigger('resize');

                } else { // landscape
                    lgDim = parsedDim;
                    topAdj = 50;
                }

            // dynamic vertical center
                if (window.getComputedStyle) { //modern
                    vertWin = window.getComputedStyle(zoomCrsl).height;
                } else { // IE<9
                    vertWin = $jQ(zoomCrsl).height();
                }
                var parsedWin = parseInt(vertWin, 10);

                var vertOne = ((parsedWin - topAdj) / 2);
                var vertTwo = parsedDim / 2;
                var liZoomTop = vertOne - vertTwo;

            // hide <img> & set opacity for restore
                $jQ(this).find('img').each(function(){
                    this.style.display = 'none';
                    this.style.opacity = 0;
                });

            // apply css

                this.style.width = 0;
                this.style.height = 0;
                this.style.minWidth = lgDim + 'px';
                this.style.background = 'url(' + imgURL + ') no-repeat';
                this.style.backgroundSize = lgDim + 'px';
                this.style.width = lgDim + 'px';
                this.style.height = lgDim + 'px';
                this.style.marginTop = liZoomTop + 'px';
            // add identifier & data attr
                $jQ(this).addClass('zoomed').attr({
                    'data-top': 0,
                    'data-left': 0,
                    'data-state': 0
                }); // end attr

        }); // end each

        //apply drag functions
            var zoomed = $jQ('.zoomed');
            zoomed.mousedown(function(event){
                handleDown(event, this);
            }); */




// 'bigger' drag image functions

    function handleDown(ev,element){ // ..................... image drag mousedown .......
    // get current state position
        var checkMove = $jQ(element).attr('data-state');
        var checkTop = $jQ(element).attr('data-top');
        var checkLft = $jQ(element).attr('data-left');
        // var if already moved
        var startTop = checkTop;
        var startLft = checkLft;

        if(ev.button == 0){
            $(element).bind('mousemove', function(event){
                if ( checkMove == 0) { // not moved yet
                    startTop = ev.pageY;
                    startLft = ev.pageX;
                }

                $jQ(element).attr({
                    'data-top': startTop,
                    'data-left': startLft
                }); // end attr

                handleMove(event, element);

                $jQ(this).attr('data-state', 1);
            });// end bind mousemove
        }// end if button

        $(element).bind('mouseup', function(event) {
            handleUp(event, element);
        });// end bind mouse up
    } // end  handledown


    function handleUp(ev, element){ // ..................... image drag mouseup ..........
        $(element).unbind('mousemove');
     } // end handleUp


    function handleMove(ev, element){ // ..................... image drag mousemove ......
        var startTop = $jQ(element).attr('data-top');
        var startLft = $jQ(element).attr('data-left');
        //alert(startTop);alert(startLft);


        var newTop = (ev.pageY - startTop);
        var newLft = (ev.pageX - startLft);
        startTop = newTop;
        startLft = newLft;
        //alert(newTop); alert(newLft); alert(startTop); alert(startLft);

        $jQ(element).css({
            'top': newTop +'px',
            'left': newLft + 'px'
        }); // end css
        $jQ(element).attr({
            'data-top': newTop,
            'data-left': newLft
        });// end attr
    } // end handleMove



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

// get fresh page dimensions
    var pgWd = document.body.clientWidth;
    var pgHt = document.body.clientHeight;

    var startHt = $jQ(element).attr('data-start-height');
    element.style.minWidth = 0;
    element.style.backgroundSize = 0;
    element.style.height = startHt + 'px';
    element.style.marginTop = 0;
    element.style.marginLeft = 0;
    element.style.top = 0;
    element.style.left = 0;
    $jQ(element).removeClass('zoomed').removeAttr('data-state').off();

    // restore the img while we're here
    $jQ(element).find('img').each(function(){
        this.style.display = 'block';
        var imgRePos = $jQ(this).attr('data-vert-pos'); // both
        var imgReTop = 50; // both
        var imgReLft = 0; // landscape
        if ( pgHt >= pgWd ) { // portrait
            imgReLft = 0.5; //90;
        } // end if
        this.style.left = imgReLft + '%';
        this.style.top = imgReTop + '%';
        this.style.marginTop = imgRePos + 'px';
        this.style.opacity = 1;
    }); // end each

} // end restoreImages



function closeZoomPanel() { // ................................ zoom panel 'close'........
    //reselect these
        var zoomBlock = window.document.getElementById('zoom-block');
        var zoomCrsl = window.document.getElementById('zoom-carousel-block');
        var zoomSlides = window.document.getElementById('zoom-slides');


    // fade out controls
        setTimeout(function() {
            $jQ('#zoom-block .center-block, #zoom-close, #zoom-controls').fadeOut('slow');
        }, 250);

    //restore vertical scroll
        $jQ('html, body').removeClass('body-zoom');

    // slide out panel
        var sldReturn = $jQ(zoomBlock).attr('data-h-return');


        hSlide(zoomBlock, sldReturn);


    // retrieve & restore original values
        var strtWd = $jQ(zoomCrsl).attr('data-strt-width');
        zoomCrsl.style.width = strtWd  + 'px';

    // restore images & clear dragged info
        $jQ(zoomSlides).find('li').each(function(){
            restoreImages(this);
            clearDragged(this);
        }); // end each

    //snap
        $jQ(window).trigger('resize');

} // end set closeZoomPanel




function vznSlideInstall (element, type) { //.................. vznSlide Install .........

    //  first assemble these contextual values

        if (type == 'simple') {

            var startOff = $jQ('.vzn-slide.simple').first().offset().left;  // needsRESIZE
            var baseIncr = $jQ(element).find('li').width();
            var multi = getMulti(type);
            $jQ(element).attr('data-start-off', startOff);


        } else if (type == 'fancy') {

            var startOff = $jQ('.vzn-slide.fancy').first().offset().left;  // needsRESIZE
            var baseIncr = $jQ(element).find('.large-item').width();
            var multi = getMulti(type);
            $jQ(element).attr('data-start-off', startOff);


            // while we're here, remodel list items for current design
            $jQ(element).find('li').each(function() {
                var title= $jQ(this).find('.product-title');
                $jQ(this).find('.fancy-ratings').appendTo(title);
            });

        } else if (type == 'zoom') {

            // select these at time of zoom panel creation
            var zoomBlock = window.document.getElementById('zoom-block'); // needs RESIZE
            var zoomSlides = window.document.getElementById('zoom-slides');

            // establish dynamic width value & apply to slides along with initial current id
            zSldWd = $jQ(zoomBlock).width();
            $jQ(zoomSlides).find('li').css('width', zSldWd ).first().attr('id', 'current-zoom-slide');
;


            // copied from original pattern
            var startOff = 0;
            var baseIncr = $jQ(element).find('li').width();
            var multi = 1;
            $jQ(element).attr('data-start-off', startOff);

        }

    // math = amount to advance simple slider on each click
            var advIncr = (baseIncr * multi);
            var prvIncr = advIncr;
            var nxtIncr = ( advIncr * -1 );

    // then get length of curent slide container....
            var list = $jQ(element).find('.slides');
            var itemCount = list.find('li').length;

    // ... and use it to set proper width for slide container regardless of rel position elements
            var listIncr = 0;
           if (type == 'fancy') {
                listIncr = baseIncr / 2;
            }  else {
                listIncr = baseIncr;
            }
            var listLength = (( itemCount * listIncr ) + 1);

    // finally, apply this to actual elements
            list.css('width', listLength + 'px' ).attr('data-length', listLength );

            $jQ('<div class="vzn-slide-prev"></div>').appendTo(element.parent()).attr('data-incr', prvIncr).addClass('off');
            $jQ('<div class="vzn-slide-next"></div>').appendTo(element.parent()).attr('data-incr', nxtIncr);

} // end vznSlideInstall




function vznSlideButtons (element) { // ........................ vznSlide Buttons ........

        // select these
            var tabWrap = $jQ(element).parent();

        // create these
            var slideWindow = tabWrap.find('.vzn-slide');
            var list = slideWindow.find('.slides');

        //start these fresh each time
            var newOff = 0;
            var begDiff = 0;
            var endDiff = 0;
            var stopFctr = 0;
            var endStop = 0;

        // get these values
            var winLngRaw = slideWindow.width();
            var stOffRaw = $jQ(slideWindow).attr('data-start-off');
            var lstLngRaw = $jQ(list).attr('data-length');
            var advRaw = $jQ(element).attr('data-incr');
            var curOffRaw = $jQ(list).offset().left;


        // parse them all
            var windowLength = parseInt(winLngRaw, 10);
            var startOff = parseInt(stOffRaw, 10);
            var listLength = parseInt(lstLngRaw, 10);
            var advance = parseInt(advRaw, 10);
            var currentOff = parseInt(curOffRaw, 10);



//alert(listLength); alert(windowLength);  alert(advance); alert(startOff);alert(currentOff);


        // do the math
            newOff = ((currentOff + advance)- startOff);
            stopFctr = listLength + newOff ;
            endStop = ((listLength - windowLength) * -1);

//alert(currentOff); alert(newOff); alert(stopFctr); alert(endStop);

        //decide what to do
            if ( newOff >= 0) { // back at beginning

                newOff = 0;

            //move it
                hSlide(list, newOff);

            // turn prev off, leave next on
                $jQ(tabWrap).find('.vzn-slide-prev').addClass('off');
                $jQ(tabWrap).find('.vzn-slide-next').removeClass('off');

            } else if ( newOff <= endStop ) { // at end

                endDiff = newOff + stopFctr;

            // move it
                hSlide(list, endDiff);

            // turn next off, turn prev on
                $jQ(tabWrap).find('.vzn-slide-next').addClass('off');
                $jQ(tabWrap).find('.vzn-slide-prev').removeClass('off');

            } else { // somewhere in between
            // move it
                hSlide(list,newOff);

            // make sure both are on
                $jQ(tabWrap).find('.vzn-slide-next').removeClass('off');
                $jQ(tabWrap).find('.vzn-slide-prev').removeClass('off');
            }

}



function getMulti(type) { //........ responsive multipliers for vznSlide ............

    if (type == 'simple') {
       if ( pgWidth < 480 ) {  // mobile portrait
                    multi = 1;
                } else if ( pgWidth > 479 && pgWidth <720 ) { // mobile landscape
                    multi = 2;
                } else if ( pgWidth > 719 && pgWidth < 960 ) { // tablet portrait
                    multi = 3;
                } else if ( pgWidth > 959 && pgWidth < 1280 ) { // 1024 layout
                    multi = 4;
                } else if ( pgWidth > 1279 && pgWidth < 1440 ) { // 1280 layout
                    multi = 4;
                } else { // 1440+ layout
                    multi = 5
                } //end responsive val

    } else if (type == 'fancy') {
            if ( pgWidth < 480 ) {  // mobile portrait
                    multi = 1;
                } else if ( pgWidth > 479 && pgWidth <720 ) { // mobile landscape
                    multi = 1.5;
                } else if ( pgWidth > 719 && pgWidth < 960 ) { // tablet portrait
                    multi = 2;
                } else if ( pgWidth > 959 && pgWidth < 1280 ) { // 1024 layout
                    multi = 2.5;
                } else if ( pgWidth > 1279 && pgWidth < 1440 ) { // 1280 layout
                    multi = 3;
                } else { // 1440+ layout
                    multi = 3.5;
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




//........................... TEMP development stuff......................................



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