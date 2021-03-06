MLS.productDetail = (function() {

var pub = {
    init : function() {

        this.pdpDetailTabs();
        this.showMoreDevices();
        this.pdpFeaturesShowMore();
        this.compatibleDropDowns();
        this.compatibleTypeAhead();
        this.mapProductDetailTabs();
        this.phpFeaturesGraphicTab();
        this.selectCompatibleProducts();
        this.relatedStoriesSlider();
        MLS.ui.module.trendingLifestyles();
        $jQ("#pdp-size-select, #pdp-color-select, #pdp-add-to-cart-submit, .secondary-add-cart, #anchor-add-to-cart, #scale-device-comparison, #product-add-to-cart").uniform(); // make selects pretty

       var prepSmall = new MLS.productDetail.pdpMobileContent();

        $jQ('.pdp-banner-shipping').each(function(){
            MLS.ui.dropdownDisplay(this);
        });

        $jQ('.pdp-cart-shipping-item').each(function(){
            MLS.ui.dropdownDisplay(this);
        });

        MLS.ui.moreLessBlock();
        MLS.productDetail.moreLessBlockTruncate();
        MLS.productDetail.pdpColorOptions();
        MLS.productDetail.addCartValidation();

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

        $jQ('#zoom-thumbs').flexslider({
            animation: "slide",
            controlNav: false,
            animationLoop: false,
            slideshow: false,
            itemWidth: 45,
            itemMargin: 10,
            asNavFor: '#zoom-focus'
        });

        $jQ('#zoom-focus').flexslider({
            animation: "slide",
            controlNav: false,
            animationLoop: false,
            slideshow: false,
            sync: "#zoom-thumbs"
        });

        $jQ('#pdp-similar-products-module').flexslider({
            animation: 'slide',
            controlsContainer: '#pdp-similar-products-module .slide-nav',
            animationLoop: false,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500,
            itemWidth: 215
        });

        $jQ('#pdp-others-bought-module').flexslider({
            animation: 'slide',
            controlsContainer: '#pdp-others-bought-module .slide-nav',
            animationLoop: false,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500,
            itemWidth: $jQ(window).outerWidth() * 0.85
        });

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

        $jQ(window).resize(function () {
            MLS.ui.moreLessBlock();

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
        });

        MLS.productDetail.pdpColorSelect();

        $jQ('#view-scale, #carousel-zoom, #view-360').on('click', function(){
            var which = $jQ(this).attr('id');
            var thisPanel = new MLS.productDetail.createZoomPanel(which);
        });

        $jQ('#view-scale').click(function(){
            $jQ('#toggle-scale').text('Hide Scale').parent().toggleClass('hide-action');
            $jQ('#zoom-thumbs').toggle();
        });

        $jQ('#toggle-scale').on('click', function(){
            // toggle scale content
            $jQ('#zoom-block').find("#zoom-scale-content").toggle();
            $jQ('#zoom-thumbs').toggle();
            $jQ('#zoom-focus').toggleClass('hide-slides');
            //toggle link class and text
            if ($jQ(this).parent().hasClass('hide-action')) {
                $jQ(this).text('View to Scale').parent().removeClass('hide-action');
            } else {
                 $jQ(this).text('Hide Scale').parent().addClass('hide-action');
            }


        });

        $jQ('#pdp-add-to-cart-submit').click(function(){
            $jQ("#pdp-add-to-cart-submit").validate();
            var formValid = $jQ("#pdp-add-to-cart").valid();
            if (formValid == true){
                $jQ('.size-select-box').find('.selector').removeClass('error');
                return false;
            } else {
                $jQ('.size-select-box').find('.selector').addClass('error');
                return false;
            }
        });

        $jQ('#pdp-size-select').change(function(){ // remove select error on choice
            $jQ('.size-select-box').find('.selector').removeClass('error');
            $jQ('.size-select-box').find('label.error').hide();
        });

        $jQ('.pdp-bundle-block .item').click(function(e){ // bundle modal
            e.preventDefault;
            MLS.ui.lightbox(this);
        });

        $jQ('#add-cart-server-error').find('.lightbox-close').click(function(){ // close click
            $jQ('#add-cart-server-error').fadeOut(300); // fade out
        });

        $jQ('.pdp-accordion').find('.acc-control').click(function(){
            MLS.ui.simpleAcc(this);
            setTimeout(function(){
                MLS.ui.moreLessBlock();
            }, 350);
        });

        $jQ('#mobile-similar .acc-control').click(function(){ // initialize flexslider

            $jQ('#mobile-similar #pdp-similar-products-module').flexslider({  // similar products : flexslider install
                animation: 'slide',
                controlsContainer: '#pdp-similar-products-module .slide-nav',
                animationLoop: false,
                controlNav: false,
                directionNav: true,
                slideshow: false,
                animationSpeed: 500,
                itemWidth: 215
            });

        });

        // RELATED STORIES MODULE SEQUENCE

         $jQ('#pdp-related-stories-module').find('li.small-story').each(function(i, el){
             if ( i%2 > 0) {
                var previous = $jQ(this).prev('li.small-story')
                $jQ(this).addClass('adjusted').appendTo(previous);
            }
        });

        $jQ('#pdp-related-stories-module dd a').click(function(){
            var whichClick = $jQ(this).attr('id');
            var whichClickArray = whichClick.split('-');
            whichClick = whichClickArray[2];

            var navs = $jQ(this).parents('section').find('.slide-nav');
            $jQ(navs).hide();
            $jQ(navs).each(function(){
                var whichNav = $jQ(this).attr('id');
                var whichNavArray = whichNav.split('-');
                whichNav = whichNavArray[1];
                if (whichClick == whichNav) {
                    $jQ(this).show();
                    return false;
                }
            });
        });

        $jQ('.product-reveal').click(function(){
            var targetNode = $jQ(this).parent(),
                closeNode = targetNode.find('.close-related');
                targetNode.addClass('reveal');

            targetNode.click(function(){
                targetNode.removeClass('reveal');
            });
        });

    },
    moreLessBlockTruncate : function(){
        $jQ('.pdp-overview-content .more-less-block .two-thirds').truncate(575);
    },
    pdpFeaturesShowMore : function(){
        var featuresContainer = $jQ('.pdp-features-content'),
            showMoreCTA = featuresContainer.find('.more-less-link');
            detailsList = featuresContainer.find('.details-list');

            showMoreCTA.click(function(){
                var currentNode = $jQ(this);
                currentNode.toggleClass('toggle');
                detailsList.toggleClass('toggle');
            });
    },
    mapProductDetailTabs : function(){
        var reviewsBTN = $jQ('#pdp-cart-review-count'),
            compatBTN = $jQ('span.compat-link'),
            tabsParent = $jQ('#product-details');
            var activeTab = function(selector){
                selector.click(function(){
                    var currentNode = $jQ(this),
                    targetTab = tabsParent.find('li').filter(function(){return $jQ(this).data('tabname') == currentNode.data('tabname');}).find('span');
                    targetTab.click();
                    MLS.ui.scrollPgTo(targetTab, 100);
                });
            };
            activeTab(reviewsBTN);
            activeTab(compatBTN);
    },

    ellipsis : function(){
    },

    relatedStoriesSlider : function(){
        var parentSelector = $jQ('#related'),
            targetTabs = parentSelector.find('.tabs-content > li'),
            tabNavigaton = parentSelector.find('.tabs-controller > li');

            tabNavigaton.click(function(e){
                e.preventDefault();
                tabNavigaton.removeClass('active');
                var currentNode = $jQ(this),
                    currentIndex = currentNode.index();
                    currentNode.addClass('active');
                    targetTabs.removeClass('active');
                    targetTabs.eq(currentIndex).addClass('active');
            });

        $jQ('.vzn-slide').flexslider({
            animation: 'slide',
            animationLoop: true,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500,
            itemWidth: 387
        });
    },

    pdpDetailTabs : function() {
        var detailSection = $jQ('#product-details'),
            visualTabs = detailSection.find('.detail-tabs > li'),
            tabContent = detailSection.find('.detail-tabs-accordion > li'),
            mobileTabs = tabContent.find('> span');

            mobileTabs.each(function(){
                var currentScope = $jQ(this),
                    contentTarget = currentScope.parent().find('.tab-wrapper');
                currentScope.click(function(){
                    currentScope.toggleClass('toggle');
                    contentTarget.toggleClass('toggle');
                });
            });

            visualTabs.each(function(){
                var currentScope = $jQ(this);
                currentScope.click(function(){
                    var currentNode = $jQ(this),
                        targetTab = currentNode.data('tabname');

                    visualTabs.removeClass('active');
                    currentScope.addClass('active');
                    tabContent.removeClass('active');
                    tabContent.filter(function(){
                        return $jQ(this).data('tabname') == targetTab;
                    }).addClass('active');
                });
            });
    },

    phpFeaturesGraphicTab : function(){
        var tabContainer = $jQ('.pdp-features-tab-box'),
            visualTabs =  tabContainer.find('#pdp-feature-tabs > dd'),
            tabContent = tabContainer.find('.tabs-content > li');

            visualTabs.each(function(){
                var currentScope = $jQ(this);
                currentScope.click(function(){
                    var currentNode = $jQ(this),
                        targetTab = currentNode.data('lifestyle');

                    visualTabs.removeClass('active');
                    currentScope.addClass('active');

                    tabContent.removeClass('active');
                    tabContent.filter(function(){
                        return $jQ(this).data('lifestyle') == targetTab;
                    }).addClass('active');
                });
            });
    },

    pdpColorOptions : function(){
        var numColors = $jQ('#product-colors').find('.color').length;
        if ( numColors > 6){
            $jQ('.light').addClass('reduced');
            $jQ('.dark').addClass('expanded');
        } else {
            $jQ('.light').removeClass('reduced');
            $jQ('.dark').removeClass('expanded');

            if (numColors > 3){
                $jQ('.size-select-box').addClass('more-than-3');
            }
        }
    },

    pdpColorSelect : function(){
        $jQ('#product-colors .color').on('click', function () {
            if($jQ(this).hasClass('out-of-stock')) {
                return false;
            }
            var colorTitle = $jQ(this).find('a').attr('title');
            $jQ('#product-colors .color').removeClass('active');
            $jQ(this).addClass('active');
            $jQ('#pdp-current-color').text(colorTitle);
            $jQ('#pdp-color-select').val([]);
            $jQ('#pdp-color-select').find('option[value=' + colorTitle + ']').prop('selected', 'selected');
            var choice =  $jQ('#pdp-color-select option:selected').text();
        });
    },

    pdpMobileContent:  function () {
        $jQ('#pdp-cart-header').clone().appendTo('#pdp-mobile-cart-header');
        $jQ('.pdp-cart-shipping').clone().appendTo('.mobile-fieldset.shipping');
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
           $jQ('#toggle-scale').text('View to Scale').parent().removeClass('hide-action'); // reset scale toggle
           $jQ('.zoom-content').css('display','none'); // hide all extras
           $jQ('#zoom-thumbs').css('display', 'block'); // restore thumbs if hidden
           $jQ(zoomFocus).removeClass('hide-slides'); // restore slides if hidden
        }, 500);
        $jQ(window).trigger('resize'); //snap
    },

    vznReveal : function(element, ht, wd) {
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
    vznHide : function(element) {
        $jQ(element).css({
            '-webkit-transform' : ' translate3d(0, 0, 0)',
            '-moz-transform' : ' translate3d(0, 0, 0)',
            '-ms-transform' : ' translate3d(0, 0, 0)',
            '-o-transform' : ' translate3d(0, 0, 0)',
            'transform' : ' translate3d(0, 0, 0)'
        });
    },
    showMoreDevices : function(){
        var baselineNode = $jQ('#product-details .compatibility'),
        clickNode = baselineNode.find('.read-more'),
        scrollNode = baselineNode.find('.device-scroll');
        scrollNode.tinyscrollbar({ sizethumb: 65 });

        clickNode.click(function(){
            $jQ(this).toggleClass('toggle');
            scrollNode.toggleClass('scroll');
            scrollNode.tinyscrollbar_update();
        });
    },
    compatibleDropDowns : function(){
        $jQ('#detail-brand-select, #detail-device-select').uniform();
    },

    selectCompatibleProducts : function(){
        /*
        var itemsTotal = $jQ('#total-items > span'),
            returnedItems = $jQ('#returned-items');
        */
        $jQ('#detail-brand-select, #detail-device-select').change(this.searchCompatibleProducts);

        /*function(){
            // var selectType = $jQ(this).data('type'),
            selectID =  $jQ(this).val(),
            form = $jQ(this).closest('form'),
            formSubmit = form.attr('action');

            MLS.ajax.sendRequest(
                formSubmit,
                form.serialize(),
                function(data){
                    returnedItems.html(data.success.responseHTML);
                    returnedItems.closest('.device-scroll').tinyscrollbar_update();
                    itemsTotal.html(data.success.count);
                }
            );
        });
        */
    },

    searchCompatibleProducts: function(e) {
        e && e.preventDefault();
        
        var itemsTotal = $jQ('#total-items > span'),
            returnedItems = $jQ('#returned-items'),
            $form = $jQ("#compatibilityForm");

        MLS.ajax.sendRequest(
            $form.attr("action"),

            $form.serialize(),

            function (data) {
                returnedItems.html(data.success.responseHTML);
                returnedItems.closest('.device-scroll').tinyscrollbar_update();
                itemsTotal.html(data.success.count);
            }
        );

        return false;
    },

    compatibleTypeAhead : function(){
        /*
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
                    typeAheadList.html(data.success.responseHTML);
                }
            );
        });
        */

        var $input = $jQ('#detail-search-box'),
            self = this;

        $input.typeahead({
            name: 'devices',
            prefetch: {
                url: $input.data('actionpage') + '?search=%QUERY'
            },
            limit: 10
        }).on('change keyup typeahead:selected typeahead:closed', function (e,item) {
            // do somehting?
            if (e.type === 'typeahead:closed') {
                $jQ(this).blur();
            }

            if (e.type === 'typeahead:selected') {
                self.searchCompatibleProducts(e);
            }
        });
    },

    addCartValidation : function() {
        jQuery.validator.addMethod("noEmptySelect", function (value, element) {
            if (value == '0') {
                return false;
            } else {
                return true;
            }
        });

        $jQ('#pdp-add-to-cart').validate({
            rules: {
                pdpColorSelect: {
                    required: true
                },
                pdpSizeSelect: {
                    required: true,
                    noEmptySelect: true
                }
            },
            messages: {
                pdpColorSelect: "Please choose a color",
                pdpSizeSelect: {
                    required: "Please choose a size",
                    noEmptySelect: "Please choose a size"
                }
            }
        });
    }

};
return pub;
}());

