var productDetail = (function() {

    var pub = {
        init : function() {

// ONLOAD : universal vars for contextual/dynamic layouts
        var pgWidth = document.body.clientWidth;

        var heroThumbs = window.document.getElementById('thumbs');
        var heroFocus = window.document.getElementById('focus');
        var heroCart = window.document.getElementById('cart-block');

        var zoomBtn = window.document.getElementById('carousel-zoom');
        var zoomBlock = window.document.getElementById('zoom-block');
        var zoomCrsl = window.document.getElementById('zoom-carousel-block');
        var zoomFocus = window.document.getElementById('zoom-focus');
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

        $jQ(zoomFocus).flexslider({
            animation: "slide",
            controlNav: "thumbnails"
        });



// ONLOAD & RESIZE: responsive layout adjustments........................................

        // hero onload : force cart layout > 960+
            if (pgWidth > 959) {
                setTimeout(function() {
                    var hero = document.getElementById('pdp-hero');
                    var heroHt = 0;
                    if (window.getComputedStyle) { //modern
                        heroHt = window.getComputedStyle(hero).height;

                    } else { // IE<9
                        heroHt = $jQ(hero).height();
                    }
                    var cart = document.getElementById('cart-block');
                    cart.style.height = heroHt;
                }, 200);
            } // end if

        // hero resize : force cart layout > 767+
            $(window).resize(function(){
                var resizePg = document.body.clientWidth;
                var resizeHt = $jQ('#carousel').height();
                if (resizePg > 767) {
                    heroCart.style.height = resizeHt + 'px';
                } else {
                    heroCart.style.height = 'auto';
                } // end if/else
            });


        // hero onload : set hero nav width & store margin for centering > 768+
                var countThmb = $jQ('#thumbs .slides').find('li').length;
                var thmbWd = (countThmb * 55);
                var totalWd = (thmbWd + 45 ); //add standard width of zoom button
                var thmbMgnLft = (totalWd / -2);
                heroThumbs.style.width = totalWd + 'px';
                $jQ(heroThumbs).attr('data-center', thmbMgnLft );


        // hero onload : center carousel thumbs
            if ( pgWidth > 959 ) {
                var cntrThmb = $jQ(heroThumbs).attr('data-center');
                heroThumbs.style.marginLeft = cntrThmb + 'px';
            }

        // hero resize : toggle carousel thumb center
            $(window).resize(function(){
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

    // hero : carousel current thumb, below the fold : current tab
            $jQ('#thumbs .flex-active-slide, .tabs .active').find('.vzn-active').css('width', '100%');



// ONLOAD : install overview tabs more/less interaction below the fold ...................

    //select these
    var overTab = window.document.getElementById('overviewTab');

    //desktop installation
    if (pgWidth > 959 ){

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

    } // end desktop more/less install


    //phablet installation

    if (pgWidth < 960 ){
        //select these
        var allDetails = window.document.getElementById('product-details');

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

    } // end install phablet more/less

// end more/less installation





// ONLOAD : insert zoom elements into flexslider js-generated..................................
            $jQ('#zoom-block .flex-control-thumbs').attr('id', 'zoom-thumbs');
            $jQ('#zoom-thumbs').wrap('<div class="center-thumbs"><div class="center-block">'); // for styling
            $jQ('<div class="vzn-active"></div>').appendTo('#zoom-block .flex-control-thumbs li'); // insert thumb animation element
            $jQ('<div id="zoom-color-select"><ul id="avail-colors" class="inline-list"><a class="color-option black" title="color option: black"><div class="select-area"></div></a><a class="color-option grey" title="color option: grey"><div class="select-area"></div></a><a class="color-option white selected" title="color option: white"><div class="select-area"></div></a><a class="color-option blue"><div class="select-area"></div></a></ul></div>').appendTo('.center-block'); // insert color selector
            $jQ('.anchor-bar').clone().appendTo('#zoom-block'); //clone & insert current anchor bar
            $jQ('#zoom-block .anchor-bar').css({
                'top': '-60px',
                'display': 'block',
                'position': 'absolute'
            }); // localize anchor-bar css



// ONCLICK : hero interactions ...........................................................

            // active thumb animation
            $jQ(heroThumbs).find('li').click(function(){
                vznActiveThumbs(this);
            });


            // color selector
            $jQ('.color-option').click(function(){
                $jQ(this).parent().find('.selected').removeClass('selected');
                $jQ(this).addClass('selected');

                var selectedTitle = $jQ('.color-option.selected').attr('title');
                $jQ(this).parents('.color-stock-block').find('span.color-option').html(selectedTitle).textTransform="uppercase";
            });


            // create contextual zoom panel
            $jQ(zoomBtn).click(function () {

                    // get page dimensions at time of click
                        var pgWd = document.body.clientWidth;
                        var pgHt = document.body.clientHeight;

                    // reselect these
                        var zoomThmbs = window.document.getElementById('zoom-thumbs');
                        var zoomClrs = window.document.getElementById('zoom-color-select');

                    // get starting left panel position & store
                        var blkLft = $jQ(zoomBlock).css('left');
                        $jQ(zoomBlock).attr('data-return', blkLft);

                    // declare vars for image math, set on conditionals below
                        var imgWd = 0;
                        var imgHt = 0;
                        var imgPs = 0;
                        var imgLf = 0;

                    // adjust images depending on presentation
                        if ( pgHt >= pgWd ) { // portrait math
                            imgWd = pgWd;
                            imgHt = pgHt;
                            imgPs = ((imgWd / -2 )-90);
                            imgLf = 0.5;

                        } else { // landscape math
                            imgHt = (pgHt * 1.2 );
                            imgWd = imgHt;
                            imgPs = ((imgWd / -2 ) -90);
                            imgLf = 0;
                        } // end if else


                    // apply math to images css
                        $jQ(zoomFocus).find('.flex-viewport li img').each(function(){
                            this.style.maxWidth = imgWd + 'px';
                            this.style.top = '50%';
                            this.style.marginTop = imgPs + 'px';
                            this.style.left = imgLf + '%';
                            $jQ(this).attr('data-vert-pos', imgPs );
                        });


                    // set zoomed carousel dimensionS & attributes
                            zoomCrsl.style.width = pgHt + 'px';
                            zoomCrsl.style.height = pgHt + 'px';
                            $jQ(zoomCrsl).attr('data-strt-width', pgHt);

                    // set li zoomed image containers & attributes
                            $jQ(zoomFocus).find('.flex-viewport li').css({ 'height': imgHt + 'px' }).attr('data-start-height', imgHt );

                    // set active thumb
                        $jQ(zoomThmbs).find('.flex-active').parent().find('.vzn-active').css('width', '100%' );

                    // set center-block width based on content
                        var countZThmb = $jQ(zoomThmbs).find('li').length;
                        var countZColors = $jQ(zoomClrs).find('a').length;
                        var zThmbWd = ( (countZThmb * 55) + 1);// 1 for border-right
                        var colorWidth = ( (countZColors * 45) + 15);// 15 for padding-left
                        var centerWidth = ( zThmbWd + colorWidth );
                        $jQ('.center-block').css('width', centerWidth + 'px');


                    // SLIDE IN ZOOM PANEL & set up inside controls based on current window settings

                        // scroll to top first
                        window.scrollTo(0,0);

                        // set panel height based on curent window
                        zoomBlock.style.height = pgHt + 'px';

                        // slide in panel
                        $jQ(zoomBlock).css({ 'left': '0' });
                        $jQ('html, body').addClass('body-zoom');

                        // snap after to reset flexslider transform values
                        $jQ(window).trigger('resize');

                        // fade in controls
                            setTimeout(function() {
                                $jQ('#zoom-block .center-block, #zoom-close, #zoom-controls').fadeIn('slow');
                            }, 500);


                        // ONCLICK : 'bigger'
                        $jQ('#zoom-controls .bigger, #zoom-slides .flex-active-slide').click(biggerView);


                        // ONCLICK : 'smaller'
                        $jQ('#zoom-controls .smaller').click(smallerView);


                        // ONCLICK : add to thumb navigation
                        $jQ(zoomThmbs).find('li').click(function() {

                            vznActiveThumbs(this);

                            // clear dragged li info
                            var zoomSlides = window.document.getElementById('zoom-slides');
                            $jQ(zoomSlides).find('li').each(function(){
                                clearDragged(this);
                            }); // end each

                        }); // end click


                        // ONCLICK : 'close'
                        $jQ(zoomClose).click(closeZoomPanel);


                        // RESIZE : handle zoom panel resize
                        $(window).resize(function(){

                            $jQ(window).trigger('resize');
                        });

            }); // end create zoom panel




// ONCLICK : below the fold ..............................................................

        // all tabs : active tab animation
            $jQ('.tabs a').click(function () {
                vznActiveTabs(this);
            });


        // desktop tabs : more/less interaction
            if (pgWidth > 959 ){
                $jQ('a.more-less-link').toggle(function(event) {
                    showMore(this);
                }, function (event) {
                    showLess(this);
                });
            }


        // phablet tabs : more/less interaction
            if (pgWidth < 960 ){
               $jQ('a.more-less-link').toggle(function(event) {
                    singleShowMore(this);
                }, function (event) {
                    singleShowLess(this);
                });
            }



        // featured tab : graphic block interaction
            $jQ('.features li').toggle(function(){
                $jQ(this).find('.image').addClass('top');
                $jQ(this).find('.hover-text').animate({ 'left': 0 }, 450 );
            }, function() {
                $jQ(this).find('.hover-text').animate({ 'left': '-500' }, 450 );
                $jQ(this).find('.image').removeClass('top');
            });

        // specs tab : download success interaction

            $jQ('.download-link').click(function() {
                $jQ('#download-click').animate({ 'left': 0 }, 450 ).delay(4000).animate({ 'left': '-500px' }, 450 );
            });



// ONSCROLL : introduce anchor bar when user is below the fold

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
            },250 );




// DEFINE FUNCTIONS ......................................................................


function vznActiveThumbs(element) { //....................... vzn Active Thumbs ..........
    $jQ(element).siblings().find('.vzn-active').css('width','0px');
    $jQ(element).find('.vzn-active').css('width', '100%');
}


function vznActiveTabs(element) { //......................... vzn Active Tabs ............
    $jQ(element).parent().siblings().find('.vzn-active').css('width','0px');
    $jQ(element).parent().find('.vzn-active').css('width', '100%');
}


// desktop more/less accordion functions

    function installDesktopMoreLess(element) { //................ install Desktop MoreLess ..............

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


    function showMore(element) { //................... showMore click for MoreLess........

        var target = $jQ(element).parents('.tab-wrapper');
        var full = (target.attr('data-height'));

        $jQ(target).css('height', full).addClass('less').find('.see-all').addClass('on');
        $jQ(element).text('Less').css('background', 'url(../img/sprites/pdp/blue-less.png) 0 4px no-repeat');
        event.preventDefault();

    } // end showMore


    function showLess(element) { //....................... showLess click for MoreLess........

        var target = $jQ(element).parents('.tab-wrapper');
        var start = (target.attr('data-start'));

        $jQ(target).css('height', start).removeClass('less').find('.see-all').removeClass('on');
        $jQ(element).text('More').css('background', 'url(../img/sprites/pdp/blue-more.png) 0 4px no-repeat');
        event.preventDefault();

    }// end showLess



// single more/less accordion functions

    function singleMoreLess(element) { //.................. install single MoreLess ......

    // select these
        var child = $jQ(element);
        var parent = $jQ(child).parent();

    // get their respective heights
        var childHt = child.height();
        var parentHt = parent.height();

    // if need, clone link and activate
        if ( childHt > parentHt ) {
            parent.addClass('single-more-less');
            $jQ(element).parents('.tab-wrapper').find('.more-less').first().clone().prependTo(parent).attr({
                'data-child-height' : childHt,
                'data-parent-height' : parentHt
            }); //end attr
        }

    } // end single more/less


    function singleShowMore(element) { // ................... singleShowMore click ......

        //select these
        var childHt = $jQ(element).parent().attr('data-child-height');
        var parent = $jQ(element).parents('.single-more-less');
        $jQ(parent).css('height', childHt).addClass('less').find('.see-all').addClass('on');
        $jQ(element).text('Less').css('background', 'url(../img/sprites/pdp/blue-less.png) 0 4px no-repeat');
        event.preventDefault();



    } // end singleShowMore

    function singleShowLess(element) { // ................... singleShowLess click ......

        //select these
        var parentHt = $jQ(element).parent().attr('data-parent-height');
        var parent = $jQ(element).parents('.single-more-less');
        $jQ(parent).css('height', parentHt ).removeClass('less').find('.see-all').removeClass('on');
        $jQ(element).text('More').css('background', 'url(../img/sprites/pdp/blue-more.png) 0 4px no-repeat');
        event.preventDefault();


    } // end singleShowLess






function biggerView(){ // ................................. zoom panel 'bigger'..........

    // get fresh page dimensions
        var pgWd = document.body.clientWidth;
        var pgHt = document.body.clientHeight;

    // reselect these
        var zoomSlides = window.document.getElementById('zoom-slides');
        var zoomCrsl = window.document.getElementById('zoom-carousel-block');
        var zoomFocus = window.document.getElementById('zoom-focus');

    //set window & snap
        zoomCrsl.style.width ='100%';
        $jQ(window).trigger('resize');

    // expand, convert to background & reposition
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
                    topAdj = 450;

                    // adjust increment
                    zoomFocus.style.width = lgDim + 'px';
                    $jQ(window).trigger('resize');

                } else { // landscape
                    lgDim = parsedDim;
                    topAdj = 105;
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
            });

} // end biggerView definition



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






function smallerView() { // ................................. zoom panel 'smaller'........

    // get fresh page dimensions
        var pgWd = document.body.clientWidth;
        var pgHt = document.body.clientHeight;

    // reselect these
        var zoomSlides = window.document.getElementById('zoom-slides');
        var zoomCrsl = window.document.getElementById('zoom-carousel-block');
        var zoomFocus = window.document.getElementById('zoom-focus');


    // retrieve & restore to original values
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
        $jQ('#zoom-slides .flex-active-slide').click(biggerView);

} // end smallerView



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
        var sldReturn = $jQ(zoomBlock).attr('data-return');
        zoomBlock.style.left = sldReturn;

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










// VZN-SLIDE FUNCTIONS ....................................................................

        // ONLOAD : set up carousel from actual content
            $jQ('.vzn-slide').each(function(){
                // default counter
                var advInc = -1;
                var listInc = -1;

            // set exact list length & increment by context & content
                var window = $jQ(this);
                //var winLength = window.width();
                var instance = window.attr('id');
                var list = window.find('.slides');
                var itemCount = list.find('li').length;

            //var simpleInc = ( winLength * 0.25 );  replace below with this  with resize & data field to make responsive
                var simpleInc = 215;

                if ( instance.indexOf('simple') > -1 ) { listInc = simpleInc; advInc = ( listInc * 4 ); }
                if ( instance.indexOf('fancy') > -1 ) { advInc = 344; listInc = ( advInc / 2 ); advInc = ( advInc * 2.5 ); }

                var listLength = (( itemCount * listInc ) + 1);
                var prevInc = advInc;
                var nextInc = ( advInc * -1 );

                list.css('width', listLength ).attr('data-length', listLength );

            // create nav buttons & set initial display
                $jQ('<div class="vzn-slide-prev"></div>').appendTo(window.parent()).attr('data-inc', prevInc).addClass('off');
                $jQ('<div class="vzn-slide-next"></div>').appendTo(window.parent()).attr('data-inc', nextInc);

            // fancy slider mod
                if ( instance.indexOf('fancy') > -1 ) {
                    $jQ(this).find('.fancy-slider-item').each(function(){
                        var title= $jQ(this).find('h3');
                        $jQ(this).find('.fancy-ratings').appendTo(title);
                    });
                }
            }); // end onload vzn-slide


        // ONCLICK : nav button interaction
            $jQ('.vzn-slide-prev, .vzn-slide-next').click(function() {
                // get the facts
                    var box = $jQ(this).parent();
                    var window = box.find('.vzn-slide');
                    var list = window.find('.slides');
                    var winLength = window.width();
                    var listLength = parseInt($jQ(list).attr('data-length'), 10);
                    var curPos = parseInt($jQ(list).css('left'), 10);
                    var advance = parseInt($jQ(this).attr('data-inc'), 10);

                // do the math
                    var newPos = curPos + advance;
                    var stop = listLength + newPos ;

                //decide what to do

                    if ( newPos === 0) { // back at beginning
                        //move it
                            $jQ(list).animate({ 'left': newPos + 'px' }, 450 );
                        // turn prev off, leave next on
                            $(box).find('.vzn-slide-prev').addClass('off');
                            $(box).find('.vzn-slide-next').removeClass('off');

                    } else if ( stop <= winLength ) { // at end
                    //move it
                        $jQ(list).animate({ 'left': newPos + 'px' }, 450 );
                    // turn next off, turn prev on
                        $(box).find('.vzn-slide-next').addClass('off');
                        $(box).find('.vzn-slide-prev').removeClass('off');

                    } else {
                    //move it
                        $jQ(list).animate({ 'left': newPos + 'px' }, 450 );
                    // make sure both are on
                        $(box).find('.vzn-slide-next').removeClass('off');
                        $(box).find('.vzn-slide-prev').removeClass('off');
                    }
            }); // end onclick vzn-slide


        // ONCLICK : nav button "off" state
            $jQ('.vzn-slide-prev.off, .vzn-slide-next.off').click(function() { return false; });












        }
    };
    return pub;
}());