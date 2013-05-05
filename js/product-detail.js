var productDetail = (function() {

var pub = {
    init : function() {

// ONLOAD : common, hero & zoom ..............................................................

	$jQ(".product-detail select").uniform(); // make selects pretty ...................
	
	var prepSmall = new pdpMobileContent(); // create mobile elements
	
	var pgWidth = document.body.clientWidth;
	var heroThumbs = window.document.getElementById('thumbs');
    var zoomThumbs = window.document.getElementById('zoom-thumbs');
    	
    $jQ(heroThumbs).flexslider({ // hero : flexslider install ........................
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
     
   	
    $jQ(zoomThumbs).flexslider({ // zoom : flexslider install .......................
        animation: "slide",
        controlNav: false,
        animationLoop: true,
        slideshow: false,
        itemWidth: 45,
        itemMargin: 10,
        asNavFor: '#zoom-focus'
    });

    $jQ('#zoom-focus').flexslider({
        animation: "slide",
        controlNav: false,
        animationLoop: true,
        slideshow: false,
        sync: "#zoom-thumbs"
    });
     
    var heroThumbDisplay = new thumbDisplay(heroThumbs, pgWidth); // count & center thumbs in hero slider 
    var zoomThumbDisplay = new thumbDisplay(zoomThumbs, pgWidth); // count & center thumbs in zoom slider
     
     
    $jQ('.pdp-banner-shipping').each(function(){ // set dropdown display actions for offer banners
     	MLS.ui.dropdownDisplay(this);
    });
     
	$jQ('.pdp-cart-shipping-item').each(function(){ // set dropdown display actions for shipping offers
     	MLS.ui.dropdownDisplay(this);
    });
     
     
     
     
     
     
     
  // ONLOAD : below the fold .............................................................  
     
    $jQ('#pdp-similar-products-module').flexslider({  // similar products slider install......
        animation: 'slide',
        controlsContainer: '#pdp-similar-products-module .slide-nav',
        animationLoop: false,
        controlNav: false,
        directionNav: true,
        slideshow: false,
        animationSpeed: 500,
        itemWidth: 215
    });
    
    
 
    	$jQ('#lifestyles-alpha-slider').flexslider({  // related stories products slider installs ......
        	animation: 'slide',
        	controlsContainer: '#pdp-related-stories-module .slide-nav',
        	animationLoop: false,
        	controlNav: false,
        	directionNav: true,
        	slideshow: false,
        	animationSpeed: 500,
        	itemWidth: 516
    	});
  
   		/* $jQ('#lifestyles-beta-slider').flexslider({  // related stories products slider installs ......
        	animation: 'slide',
        	controlsContainer: '#pdp-related-stories-module .slide-nav',
        	animationLoop: false,
        	controlNav: false,
        	directionNav: true,
        	slideshow: false,
        	animationSpeed: 500,
        	itemWidth: 516
   		});
  
    	$jQ('#lifestyles-gamma-slider').flexslider({  // related stories products slider installs ......
        	animation: 'slide',
        	controlsContainer: '#pdp-related-stories-module .slide-nav',
        	animationLoop: false,
        	controlNav: false,
        	directionNav: true,
        	slideshow: false,
        	animationSpeed: 500,
        	itemWidth: 516
    	}); */
    
    
    
    

    $jQ('#pdp-others-bought-module').flexslider({  // lifestyle products slider install ......
        animation: 'slide',
        controlsContainer: '#pdp-others-bought-module .slide-nav',
        animationLoop: false,
        controlNav: false,
        directionNav: true,
        slideshow: false,
        animationSpeed: 500,
        itemWidth: $jQ(window).outerWidth() * 0.85
    });
    
    
    $jQ(window).resize(function () {
        $jQ('#pdp-others-bought-module').data('flexslider').setOpts({itemWidth: $jQ(window).outerWidth() * 0.85});
        
    });












// HERO & ZOOM CLICKS .....................................................................................

    $jQ('#view-scale, #carousel-zoom, #view-360, #toggle-scale, #toggle-view-360').on('click', function(){ // create contextual zoom panels 
    	var which = $jQ(this).attr('id');
    	var thisPanel = new createZoomPanel(which);
    }); 
	
	$jQ('#zoom-carousel-zoom').click(function() { // fire draggable zoom options 
        // panel itself already exists if this is clicked
    }); 

	$jQ(' ').click(function(e){ // cart header reviews click to tab
     	e.preventDefault();
       	alert('click to tab, coming soon');
     });
     
    $jQ(' ').click(function(e){ // cart compatibility, click to tab
     	e.preventDefault();
     	alert('click to tab, coming soon');
     });
        	
     $jQ(' ').click(function(e){ // cart size select, custom select
     	e.preventDefault();
     	alert('slide in size selector, coming soon');
     });    
	
	$jQ(' ').click(function(e){ // cart color select, custom select
     	e.preventDefault();
     	alert('slide in color selector, coming soon');
     });



// BELOW THE FOLD CLICKS .....................................................................................

  	$jQ('.tabs dd a').click(function(){ // activate tabs 
		pdpTab(this);
	});




















// RESIZING ...................................................................................

	$jQ(window).resize(function(){
		var pgWidth = document.body.clientWidth;
		var heroThumbs = window.document.getElementById('thumbs');
    	var zoomThumbs = window.document.getElementById('zoom-thumbs');
		
		var resizeHeroThumbDisplay = new thumbDisplay(heroThumbs, pgWidth); // count & center thumbs in hero slider 
    	var resizeZoomThumbDisplay = new thumbDisplay(zoomThumbs, pgWidth); // count & center thumbs in zoom slider
	
	});




	
//  OBJECTS ....................................................................................
    
    function pdpMobileContent() { // copies loaded data into mobile only elements
    	$jQ('#pdp-cart-header').clone().appendTo('#pdp-mobile-cart-header');
    	$jQ('.pdp-cart-shipping').clone().appendTo('#pdp-mobile-form-shipping');
    	
    	//var deskForm = document.getElementById('pdp-add-to-cart');
    	var deskForm = $jQ('#pdp-add-to-cart');
    	deskForm.find('.size-select-box').clone().appendTo('#pdp-mobile-form-size');
    	deskForm.find('.color-select-box').clone().appendTo('#pdp-mobile-form-color');
    	deskForm.find('.price-block').clone().appendTo('#pdp-mobile-form-price');
    	deskForm.find('.add-cart-box').clone().appendTo('#pdp-mobile-form-submit');
    
    	
    	} // end pdpMobileContent
    
    function thumbDisplay(parent, context) { // ........carousel thumbs ..........
    	// do the math and store as data
    		var countThmb = $jQ(parent).find('.slides').find('li').length;
        	var thmbWd = (countThmb * 55);
        	var totalWd = (thmbWd + 105 ); //add standard width of zoom & view 360 buttons
        	var thmbMgnLft = (totalWd / -2);
        	$jQ(parent).css('width', totalWd + 'px').attr('data-center', thmbMgnLft );

        // only apply in desktop presentation
            if ( context > 959 ) {
            	$jQ(parent).css({
            		'left': '50%',
            		'right': 'auto',
            		'margin-left': thmbMgnLft +'px'
            	});
            } else {
            	$jQ(parent).css({
            		'left': 'auto',
            		'right': '15px',
            		'margin-left': '0px',
            	});
            }
    	}// end thumbDisplay
    	
  
    	
    function createZoomPanel(which) { // ..... create zoom panel ..........
    
		var zoomBlock = window.document.getElementById('zoom-block');
        var zoomCrsl = window.document.getElementById('zoom-carousel-block');
        var zoomFocus = window.document.getElementById('zoom-focus');
        var zoomSlides = window.document.getElementById('zoom-slides');
        var pgWd = document.body.clientWidth;
        var pgHt = document.body.clientHeight;
		
    	// create panel width & offset to match current dimensions
        	var hSize = (pgWd + 15); //scroll bar width in Chrome, generate dynamically
        	var hOffset = (hSize * -1);

    	// new var for contextual layout differences
        	var crslWd = hSize;  // landscape
        	var lstOff = 0;    // landscape

        	if ( pgHt >= pgWd ) { crslWd = pgWd; } // limit slide width and increment to screen width if portrait

    	// set element dimensions & starting positions
       		$jQ(zoomBlock).css({ 'left': hOffset + 'px' }).attr('data-h-return', hOffset);  //block


		// select context 
			if(which == undefined || which == "carousel-zoom"){
				// do nothing extra
			} else if(which == "view-scale"){
				$jQ(zoomBlock).find("#zoom-scale-content").toggle(); 
				$jQ(zoomFocus).toggleClass('hide-slides');
			} else if(which == "view-360"){
				$jQ(zoomBlock).find("#zoom-view-360-content").toggle();
				$jQ(zoomFocus).toggleClass('hide-slides'); 
			} else if(which == "toggle-scale"){
				$jQ(zoomBlock).find("#zoom-scale-content").toggle(); 
				$jQ(zoomFocus).toggleClass('hide-slides');
				return false; // panel already exists
			} else if(which == "toggle-view-360"){
				$jQ(zoomBlock).find("#zoom-view-360-content").toggle(); 
				$jQ(zoomFocus).toggleClass('hide-slides');
				return false; //panel already exists
			}
		
			
        MLS.ui.hSlide(zoomBlock, hSize); // slide in panel
		setTimeout(function() { // hide vertical scroll after
                $jQ('html, body').addClass('body-zoom');
            }, 750);

       	setTimeout(function() {  // fade in controls
                $jQ('#zoom-block .center-block, #zoom-close, #zoom-controls, .vzn-slide-prev, .vzn-slide-next').fadeIn('slow');
            }, 500);
 		$jQ('#zoom-close').click(closeZoomPanel); // close zoom panel
 		} // end create zoom panel


    function closeZoomPanel() { // .................. zoom panel 'close'.................
		var zoomBlock = window.document.getElementById('zoom-block');
        var zoomCrsl = window.document.getElementById('zoom-carousel-block');
        var zoomFocus = window.document.getElementById('zoom-focus');
        var currentSld =  window.document.getElementById('current-zoom-slide');
        
    	setTimeout(function() { // fade out controls
            $jQ('#zoom-block .center-block, #zoom-close, #zoom-controls').fadeOut('slow');
        }, 250);

    	$jQ('html, body').removeClass('body-zoom'); //restore vertical scroll

    	var sldReturn = $jQ(zoomBlock).attr('data-h-return'); // slide out panel
        MLS.ui.hSlide(zoomBlock, sldReturn);

		setTimeout(function(){ // restore current image if required & close xtra states
    		if ($jQ(currentSld).hasClass('zoomed')) {
    			var currentWin = $jQ(zoomCrsl).height();
            	smallerView(currentSld, currentWin);
    			}
    			$jQ('.zoom-content').css('display','none');
    			$jQ(zoomFocus).removeClass('hide-slides');
    		}, 500);
    	
        	$jQ(window).trigger('resize'); //snap
		} // end set closeZoomPanel	
    	


	function vznActiveTabs(element) { //..............vzn-active tabs ............
    	$jQ(element).parent().siblings().find('.vzn-active').css('width','0px');
    	$jQ(element).parent().find('.vzn-active').css('width', '100%');
		} // end active tab animation


	function pdpTab(href) { // ............. product details tab function .........
		
		$jQ(href).parents('.tabs').children().removeClass('active'); //remove active class from all tabs
		$jQ(href).parent().addClass('active'); //apply it to (this) clicked tab

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






// ........................... END OBJECTS ..............................................



        
    } // end init
}; // end pub var
return pub;
}());
      