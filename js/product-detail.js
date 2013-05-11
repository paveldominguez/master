MLS.productDetail = (function() {

var pub = {
    init : function() {
        this.showMoreDevices();
        this.compatibleTypeAhead();
        this.compatibleDropDowns();
        this.selectCompatibleProducts();

        // ONLOAD page-wide ..........................................................................................
        $jQ("#pdp-add-to-cart-submit, .secondary-add-cart, #anchor-add-to-cart").uniform(); // make selects pretty

       var prepSmall = new MLS.productDetail.pdpMobileContent(); // create mobile elements

        $jQ('.pdp-banner-shipping').each(function(){ // set dropdown display actions for offer banners
            MLS.ui.dropdownDisplay(this);
        });

        $jQ('.pdp-cart-shipping-item').each(function(){ // set dropdown display actions for shipping offers
            MLS.ui.dropdownDisplay(this);
        });

        MLS.ui.moreLessBlock(); // evaluate & initialize all more/less elements




        // ONLOAD hero & zoom panel ..................................................................................
        var pgWidth = document.body.clientWidth;
        var heroThumbs = window.document.getElementById('thumbs');
        var zoomThumbs = window.document.getElementById('zoom-thumbs');
        $jQ(heroThumbs).flexslider({ // hero : flexslider install
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

        $jQ(zoomThumbs).flexslider({ // zoom : flexslider install
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
        var heroThumbDisplay = new MLS.productDetail.thumbDisplay(heroThumbs, pgWidth); // count & center thumbs in hero slider
        var zoomThumbDisplay = new MLS.productDetail.thumbDisplay(zoomThumbs, pgWidth); // count & center thumbs in zoom slider




        // ONLOAD : below the fold ..............................................................................
        $jQ('#pdp-similar-products-module').flexslider({  // similar products : flexslider install
            animation: 'slide',
            controlsContainer: '#pdp-similar-products-module .slide-nav',
            animationLoop: false,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500,
            itemWidth: 215
        });

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
        // ...................................................................................... END ONLOAD

        // ONSCROLL : introduce anchor bar when user is below the fold.............................
        if ($jQ(window).width() > 719) {
            $jQ(window).scroll(function() {
                if ($jQ(window).scrollTop() > $jQ('#product-details').offset().top - 60) {
                    $jQ('#btf-anchor').addClass('show-anchor');
                    $jQ('#mls-nav').addClass('fixed-nav');
                }    
                else {
                    $jQ('#btf-anchor').removeClass('show-anchor');
                    $jQ('#mls-nav').removeClass('fixed-nav');
                }    
            });
        }
 

        // ON RESIZE..............................................................................................
        $jQ(window).resize(function () {
            var pgWidth = document.body.clientWidth; // thumbnail navigation display
            var heroThumbs = window.document.getElementById('thumbs');
            var zoomThumbs = window.document.getElementById('zoom-thumbs');
            var resizeHeroThumbDisplay = new MLS.productDetail.thumbDisplay(heroThumbs, pgWidth); // count & center thumbs in hero slider
            var resizeZoomThumbDisplay = new MLS.productDetail.thumbDisplay(zoomThumbs, pgWidth); // count & center thumbs in zoom slider

            MLS.ui.moreLessBlock(); // revaluate & re-initialize more/less elements

            $jQ('#pdp-others-bought-module').data('flexslider').setOpts({itemWidth: $jQ(window).outerWidth() * 0.85}); // responsive slider boxes
        });
        // .................................................................................... END RESIZE





        // HERO & ZOOM EVENTS .....................................................................................
        $jQ('.review-link').click(function(e){ // cart header reviews click to tab
            e.preventDefault();
            MLS.productDetail.heroLinktoTab('#detail-tabs .reviews a');
        });

        $jQ('.compat-link').click(function(e){ // cart compatibility, click to tab
            e.preventDefault();
            MLS.productDetail.heroLinktoTab('#detail-tabs .compat a');
        });

        $jQ(' ').click(function(e){ // cart size select, custom select
          e.preventDefault();
          alert('slide in size selector, coming soon');
        });

       $jQ(' ').click(function(e){ // cart color select, custom select
          e.preventDefault();
          alert('slide in color selector, coming soon');
        });

        $jQ('#view-scale, #carousel-zoom, #view-360, #toggle-scale, #toggle-view-360').on('click', function(){ // create contextual zoom panels
            var which = $jQ(this).attr('id');
            var thisPanel = new MLS.productDetail.createZoomPanel(which);
        });

        $jQ('#zoom-carousel-zoom').click(function() { // fire draggable zoom options
            // panel itself already exists if this is clicked
        });
        // ..................................................................................... END HERO & ZOOM EVENTS



        // BELOW THE FOLD EVENTS .....................................................................................
        $jQ('#detail-tabs dd a').click(function(){ // product detail tabs
            MLS.productDetail.pdpTab(this);
            MLS.ui.moreLessBlock(); // evaluate & initialize more/less elements in open tab
        });

        $jQ('.more-less-link').click(function(e){ // more/less click
            var block = $jQ(this).parents('.more-less-block');
            if ($jQ(block).hasClass('bound')) {
                $jQ(this).text('Less');
            } else {
                $jQ(this).text('More');
            }
            e.preventDefault();
            $jQ(block).toggleClass('bound');

        });


        $jQ('.pdp-bundle-block .secondary-add-cart').click(function(e){ // bundle modal
            e.preventDefault;
            MLS.ui.lightbox(this);
        });


        $jQ('#pdp-feature-tabs dd a').click(function(){ // tabbed graphic box in features-tab
            MLS.productDetail.pdpTab(this);
        });






// RELATED STORIES MODULE SEQUENCE

         $jQ('#pdp-related-stories-module').find('li.small-story').each(function(i, el){ // modify layout before init flexslider
             if ( i%2 > 0) { // adjust
                var previous = $jQ(this).prev('li.small-story')
                $jQ(this).addClass('adjusted').appendTo(previous);
            } // else do nothing
        });


        $jQ('#lifestyles-alpha-slider').flexslider({ // init alpha related stories products slider onload
            animation: 'slide',
            controlsContainer: '#nav-alpha',
            animationLoop: true,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500,
            itemWidth: 387

        });



        $jQ('#pdp-related-stories-module dd a').click(function(){ // related stories tab clicks
            MLS.productDetail.pdpTab(this); // PDP tab function

            var whichClick = $jQ(this).attr('id'); // identify current tab
            var whichClickArray = whichClick.split('-');
            whichClick = whichClickArray[2];

            var navs = $jQ(this).parents('section').find('.slide-nav');
            $jQ(navs).hide();
            $jQ(navs).each(function(){ // toggle slider nav
                var whichNav = $jQ(this).attr('id');
                var whichNavArray = whichNav.split('-');
                whichNav = whichNavArray[1];
                if (whichClick == whichNav) {
                    $jQ(this).show();
                    return false;
                }
            });
        });



        $jQ('#lifestyles-tab-beta').one('click', function(){ // init beta related stories products slider on first tab click
            $jQ('#lifestyles-beta-slider').flexslider({
                animation: 'slide',
                controlsContainer: '#nav-beta',
                animationLoop: false,
                controlNav: false,
                directionNav: true,
                slideshow: false,
                animationSpeed: 500,
                itemWidth: 516
            });
        });

        $jQ('#lifestyles-tab-gamma').one('click', function(){ // init gamma related stories products slider on first tab click
            $jQ('#lifestyles-gamma-slider').flexslider({
                animation: 'slide',
                controlsContainer: '#nav-gamma',
                animationLoop: false,
                controlNav: false,
                directionNav: true,
                slideshow: false,
                animationSpeed: 500,
                itemWidth: 516
            });
        });


        $jQ('.product-reveal').click(function(){
            var showThis = $jQ(this).next('.related-product');
            MLS.productDetail.vznReveal(showThis, 486, 486);
        });

        $jQ('.close-related').click(function(){
            var hideThis = $jQ(this).parents('.related-product');
            MLS.productDetail.vznHide(hideThis);
        });

// END RELATED STORIES ........................


        // .................................................................... END BELOW THE FOLD EVENTS & INIT
    },
    pdpMobileContent:  function () { // copies loaded data into mobile only elements .................. BEGIN FUNCTIONS .................
        $jQ('#pdp-cart-header').clone().appendTo('#pdp-mobile-cart-header'); // cart header
        $jQ('.pdp-cart-shipping').clone().appendTo('#pdp-mobile-form-shipping'); // shipping & offers
        var deskForm = $jQ('#pdp-add-to-cart');
        deskForm.find('.size-select-box').clone().appendTo('#pdp-mobile-form-size'); // add to cart form elements
        deskForm.find('.color-select-box').clone().appendTo('#pdp-mobile-form-color');
        deskForm.find('.price-block').clone().appendTo('#pdp-mobile-form-price');
        deskForm.find('.add-cart-box').clone().appendTo('#pdp-mobile-form-submit');
    },
    thumbDisplay: function (parent, context) { // carousel thumbs ........................................................................
        var countThmb = $jQ(parent).find('.slides').find('li').length;// do the math and store as data
        var thmbWd = (countThmb * 55);
        var totalWd = (thmbWd + 105 ); //add standard width of zoom & view 360 buttons
        var thmbMgnLft = (totalWd / -2);
        $jQ(parent).css('width', totalWd + 'px').attr('data-center', thmbMgnLft );
        if ( context > 959 ) { // only apply in desktop presentation
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
    },
    heroLinktoTab : function(targetLink){ // link to tabs form hero section .............................................................
        MLS.productDetail.pdpTab(targetLink); //open tab programatically
        MLS.ui.scrollPgTo('#product-details', 80); //scroll page to open tab
    },
    createZoomPanel : function (which) { // create zoom panel ...........................................................................
        var zoomBlock = window.document.getElementById('zoom-block'); // gather requirements
        var zoomCrsl = window.document.getElementById('zoom-carousel-block');
        var zoomFocus = window.document.getElementById('zoom-focus');
        var zoomSlides = window.document.getElementById('zoom-slides');
        var pgWd = document.body.clientWidth;
        var pgHt = document.body.clientHeight;

        var hSize = (pgWd + 15); // create panel width & offset from current, adjust for scroll bar width in Chrome
        var hOffset = (hSize * -1);

        var crslWd = hSize;  // new var for contextual layout differences
        var lstOff = 0;
        if ( pgHt >= pgWd ) { crslWd = pgWd; } // limit slide width and increment to screen width if portrait

        $jQ(zoomBlock).css({ 'left': hOffset + 'px' }).attr('data-h-return', hOffset);  // set starting position & return

        if(which == undefined || which == "carousel-zoom"){  // contextual display
          // do nothing extra
       } else if(which == "view-scale"){ // if view-to-scale
          $jQ(zoomBlock).find("#zoom-scale-content").toggle();
          $jQ(zoomFocus).toggleClass('hide-slides');
       } else if(which == "view-360"){ // if view-360
          $jQ(zoomBlock).find("#zoom-view-360-content").toggle();
          $jQ(zoomFocus).toggleClass('hide-slides');
       } else if(which == "toggle-scale"){ // toggle scale on/off in loaded panel
          $jQ(zoomBlock).find("#zoom-scale-content").toggle();
          $jQ(zoomFocus).toggleClass('hide-slides');
          return false; // panel already exists
       } else if(which == "toggle-view-360"){ //toggle view-360 on/off in loaded panel
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
        $jQ('#zoom-close').click(MLS.productDetail.closeZoomPanel); // close zoom panel
    },
    closeZoomPanel: function () { // zoom panel 'close'..........................................................................
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
    },
    vznActiveTabs : function (element) { // vzn-active tabs .........................................................................
        $jQ(element).parent().siblings().find('.vzn-active').css('width','0px');
        $jQ(element).parent().find('.vzn-active').css('width', '100%');
    },
    pdpTab: function(href) { // product details tab function .........................................................................
       $jQ(href).parents('.tabs').first().children().removeClass('active'); //remove active class from all sister tabs
       $jQ(href).parent().addClass('active'); //apply it to (this) clicked tab

       var rawName = $jQ(href).attr('href'); // get tab content target name
       var tabName = rawName.substr(1);
       var contentName = (tabName + 'Tab');

       // remove active class from all tab content, find the right one and reapply
       contentList = $jQ(href).parents('.tab-block').first().children('.tabs-content');
       $jQ(contentList).children().removeClass('active').each(function(){
            var thisID = $jQ(this).attr('id');
            if ( thisID == contentName ) {
                $jQ(this).addClass('active');
                return false;
            }
       });
    },
    vznReveal : function(element, ht, wd) { // reveal element from bottom right, goes with vznHide .......................................
        var wdIncr = (wd) * -1;
        var htIncr = (ht) * -1;

        $jQ(element).css({
            '-webkit-transform' : ' translate3d(' + wdIncr + 'px,' + htIncr + 'px, 0) ',
            '-moz-transform' : ' translate3d(' + wdIncr + 'px,' + htIncr + 'px, 0) ',
            '-ms-transform' : ' translate3d(' + wdIncr + 'px,' + htIncr + 'px, 0) ',
            '-o-transform' : ' translate3d(' + wdIncr + 'px,' + htIncr + 'px, 0) ',
            'transform' : ' translate3d(' + wdIncr + 'px,' + htIncr + 'px, 0) '
        });
    },
    vznHide : function(element) { // ...... hide element from top left, goes with vznReveal
        $jQ(element).css({
            '-webkit-transform' : ' translate3d(0, 0, 0)',
            '-moz-transform' : ' translate3d(0, 0, 0)',
            '-ms-transform' : ' translate3d(0, 0, 0)',
            '-o-transform' : ' translate3d(0, 0, 0)',
            'transform' : ' translate3d(0, 0, 0)'
        }); // end css
    },
    // end vznHide
    /* begin Compatibility Tab Functionality */
    showMoreDevices : function(){
        var baselineNode = $jQ('#compatTab'),
        clickNode = baselineNode.find('.read-more'),
        scrollNode = baselineNode.find('.device-scroll');
        scrollNode.tinyscrollbar({ sizethumb: 65 });
        
        clickNode.click(function(){
            $jQ(this).toggleClass('toggle');
            scrollNode.toggleClass('scroll');
            scrollNode.tinyscrollbar_update();
        });
    },
    /* end Compatibility Tab Functionality */
    
    /* begin Uniform drop downs */
    compatibleDropDowns : function(){
        $jQ('#detail-brand-select, #detail-device-select').uniform();
    },
    /* begin Uniform drop downs */
    
    /* begin Compatible Device AJAX/JSON */
    selectCompatibleProducts : function(){
        var itemsTotal = $jQ('#total-items > span'),
                returnedItems = $jQ('#returned-items');

        $jQ('#detail-brand-select, #detail-device-select').change(function(){
            var selectType = $jQ(this).data('type'),
            selectID =  $jQ(this).val(),
            formSubmit = $jQ(this).closest('form').attr('action');

            MLS.ajax.sendRequest(
                formSubmit,
                {
                    type : selectType,
                    typeID : selectID
                },
                function(data){
                    returnedItems.html(data.success.responseHTML);
                    returnedItems.closest('.device-scroll').tinyscrollbar_update();
                    itemsTotal.html(data.success.count);
                }
            );
        });
    },
    /* end Compatible Device AJAX/JSON */
    
    /* begin Compatible Device type ahead */
    compatibleTypeAhead : function(){
        var searchInput = $jQ('#detail-search-box'),
        typeAheadList = searchInput.parent().find('.type-ahead');
        processingPage = searchInput.data('actionpage');

        searchInput.keyup(function(){
            var keyword = $jQ(this).val();

            MLS.ajax.sendRequest(
                processingPage,
                {
                    keyword : keyword
                },
                function(data){
                    
                }
            );
        });
    }
    /* begin Compatible Device type ahead */
}; // end pub var
return pub;
}());

