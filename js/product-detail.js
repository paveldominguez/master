var productDetail = (function() {

    var pub = {
        init : function() {

            //======================== PDP : HERO =================================//

            // ONLOAD : force cart layout tablet & above
            setTimeout(function() {
                var pgWidth = $jQ(document).width();
                var heroHt = $jQ('#pdp-hero').height();
                    if (pgWidth > 767) {
                        $jQ('#cart-block').css('height', heroHt + 'px' );
                    }
                }, 200);


             // ONLOAD : main flexslider set-up
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


            // ONLOAD : zoom flexslider set-up
            $jQ('#zoom-focus').flexslider({
                animation: "slide",
                controlNav: "thumbnails"
            });


            // ONLOAD : show vzn-active on current thumb
            $('#thumbs .flex-active-slide').find('.vzn-active').css('width', '45px');





            //............. zoom panel functions could be broken out as sep file? ..................//

            // ONLOAD : insert elements into flexslider js-generated
            $jQ('#zoom-block .flex-control-thumbs').wrap('<div class="center-thumbs"><div class="center-block">'); // for styling
            $jQ('<div class="vzn-active"></div>').appendTo('#zoom-block .flex-control-thumbs li'); // insert thumb animation element
            $jQ('<div class="rounded"><ul id="avail-colors" class="inline-list"><li class="color-option black "><div class="select-area"></div></li><li class="color-option grey "><div class="select-area"></div></li><li class="color-option white selected"><div class="select-area"></div></li><li class="color-option blue"><div class="select-area"></div></li></ul></div>').appendTo('.center-block'); // insert color selector


            // ONCLICK : create & show zoom panel
            $jQ('#carousel-zoom').click(function () {

                    // set outer limit
                    $jQ('#zoom-block').wrapInner('<div class="zoom-wrap" />');



                    // get page dimensions at time of click
                    var pgHeight = ($jQ(window).height() ); //-60
                    var imgHeight = (pgHeight * 1.2 );

                        // set element dimensions
                        $jQ('#zoom-carousel-block').css('width', pgHeight + 'px').css('height', pgHeight + 'px').attr('data-strt-width', pgHeight );
                        $jQ('#zoom-focus .flex-viewport li').css('width', imgHeight + 'px').css('height', imgHeight + 'px' );

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

                        // set panel height;
                        $jQ('#zoom-block').css('height', pgHeight + 'px');


                        //slide in panel & anchor bar
                        $jQ('#zoom-block, #anchor-bar').animate({
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

                    // get current values
                        var zBlk = $jQ('#zoom-carousel-block');
                        var strtWd = zBlk.width();
                        var moveUp = ( strtWd / -7 );

                    // store current settings, expand/move components & snap
                        $jQ(zBlk).css('width', '85%');
                        $jQ(window).trigger('resize');

                    // move image to background for mousemove

                        $jQ('#zoom-slides li').each(function(){

                            var imgURL = $jQ(this).attr('data-thumb');
                            var bigDim = zBlk.width();

                            $jQ(this).addClass('zoomed').css({
                                'background': 'url(' + imgURL + ') no-repeat',
                                'background-size': bigDim,
                                'height': bigDim,
                                'margin-top': moveUp
                            });

                            // hide <img>
                            $jQ('.zoomed img').css('display', 'none');

                            // insert pointer
                            $jQ('<div class="zoom-point"></div>').appendTo(this);



                        });




                    // add mousemove to expanded image

                            $jQ('.zoomed').on({
                                mousedown: function (el) {
                                    var startTop = el.pageY;
                                    var startLft = el.pageX;
                                    $jQ(this).attr('data-top', startTop ).attr('data-left', startLft).attr('data-state', 'down');
                                },
                                mouseup: function () {
                                    $jQ(this).attr('data-state','up');
                                },
                                mousemove: function (el) {
                                    var state = $jQ(this).attr('data-state');

                                        if (state === 'down') {
                                            var startTop = $(this).attr('data-top');
                                            var startLft = $(this).attr('data-left');

                                            var newTop = (el.pageY - startTop);
                                            var newLeft = (el.pageX - startLft);

                                            $jQ(this).css('top', newTop +'px').css('left', newLeft + 'px');
                                        }
                                    }
                            }); /* end on */

                    }); /* end bigger */



                    // SMALLER
                    $jQ('#zoom-controls .smaller').click(function () {



                    // retrieve original values
                        var zBlk = $jQ('#zoom-carousel-block');
                        var strtWd = zBlk.attr('data-strt-width');

                    // reduce/move components & snap
                        $jQ(zBlk).css('width', strtWd );

                        $jQ('#zoom-slides li').each(function(){

                            $jQ(this).removeClass('zoomed').removeAttr('data-state').css({
                                'background': 'transparent',
                                'background-size': '0',
                                'height': strtWd,
                                'margin-top': '0px',
                                'top': '0px',
                                'left': '0px'
                            });

                            // restore <img>
                            $jQ(this).find('img').css('display', 'block');
                            // turn off drag interaction
                            $jQ(this).off();
                            // remove pointer
                            $jQ(this).find('.zoom-point').remove();


                        });

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
                        $jQ('#zoom-block, #anchor-bar').animate({'left': '-3000' }, 1200 );

                        // retrieve & restore original values
                        var zBlk = $jQ('#zoom-carousel-block');
                        var strtWd = zBlk.attr('data-strt-width');
                        var active = $jQ('.zoomed');

                    // reduce/move components & snap
                        $jQ(zBlk).css('width', strtWd );

                        $jQ('#zoom-slides li').each(function(){

                            $jQ(this).removeClass('zoomed').removeAttr('data-state').css({
                                'background': 'transparent',
                                'background-size': '0',
                                'height': strtWd,
                                'margin-top': '0px',
                                'top': '0px',
                                'left': '0px'
                            });
                            // restore <img>
                            $jQ(this).find('img').css('display', 'block');
                            // turn off drag interaction
                            $jQ(this).off();
                            // remove pointer
                            $jQ(this).find('.zoom-point').remove();
                        });

                        $jQ(window).trigger('resize');

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

            // ONLOAD : ad slider CSS class to element IDs
            $jQ('#simple-similar-slider, #simple-others-slider, #simple-works-slider, #fancy-similar-slider, #fancy-others-slider, #fancy-works-slider').addClass('vzn-slide');


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
                var newHt = -1;
                var tallest = -1;
                var tabID = $jQ(this).parent().attr('id');
                var xtra = -1;

                if (tabID === "compatTab") {
                    xtra = 98;
                } else {
                    xtra = 30;
                }

                tabWrap.children().each(function(i, child) {
                    var check = $jQ(child).height();
                    if ( check > tallest ) {
                        tallest = check;
                    }
                 });

                if ( tallest > wrapHt ) {
                    // turn on more/less
                    tabWrap.find('.more-less').css('display', 'block');
                    // store data
                    newHt = (tallest + xtra);
                    tabWrap.attr('data-height', newHt);
                }
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


            // ONSCROLL : introduce anchor bar when user is below the fold

            var btFold = $jQ('#price-block').offset().top;
            var anchorShow = 0;

            var checkScroll = setInterval(function() {

                if (anchorShow === 0) {
                    if ($jQ(window).scrollTop() >= btFold) {
                    $jQ('#anchor-bar').stop().animate({'left': '0' }, 450 );
                    anchorShow = 1;
                    }
                } else {
                    if ($jQ(window).scrollTop() < btFold) {
                            $jQ('#anchor-bar').stop().animate({'left': '-3000' }, 450 );
                            anchorShow = 0;
                    }
                }
            },250 );











// ************ VZN_SLIDE CUSTOM CAROUSEL : split off into own  .js page for use beyond PDP ***************************//

// ONLOAD : set up carousel from actual content
    $jQ('.vzn-slide').each(function(){
    // default counter
        var advInc = -1;
        var listInc = -1;

    // set exact list length & increment by context & content
        var window = $jQ(this);
        var winLength = window.width();
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

        //alert(itemCount); alert(listLength);

        list.css('width', listLength ).attr('data-length', listLength );

    // create nav buttons & set initial display
        $jQ('<div class="vzn-slide-prev"></div>').appendTo(window.parent()).attr('data-inc', prevInc).addClass('off');
        $jQ('<div class="vzn-slide-next"></div>').appendTo(window.parent()).attr('data-inc', nextInc);

    // last minute css adjustments
        if ( instance.indexOf('fancy') > -1 ) { $jQ(this).find('.fancy-slider-item').each(function(){
            var title= $jQ(this).find('h3');
            $jQ(this).find('.fancy-ratings').appendTo(title);
        }); }

    });

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

    // alert(curPos); alert(newPos); alert(listLength); alert(stop);
    // alert(listLength);

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

    });

// ONCLICK : nav button interaction in "off" state
    $jQ('.vzn-slide-prev.off, .vzn-slide-next.off').click(function() { return false; });


//********************* END VZN-SLIDE ***********************************//












            //=============================== END PDP : BTF =============================//

        }
    };
    return pub;
}());