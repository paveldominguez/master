var contentGrid = {
    init : function () {
        $jQ('.content-grid .add-cart-cta, .quick-view-details .add-cart-cta').uniform();
        var $contentGrid = $jQ('#main-column .content-grid, .home-page .content-grid').not('.guide-grid'),
        $contentItems = $contentGrid.find('.content-item'),
        $quickviewLinks = $contentItems.find('.quick-view');
        $featuredHover = $contentItems.find('.featured-corner');
        $featuredReveal = $contentItems.find('.shop-this');
        $featuredHide = $contentItems.find('.back-to-story');
        $featuredReveal.click(contentGrid.featuredReveal);
        $featuredHide.click(contentGrid.featuredHide);
        $jQ('#load-more').click(MLS.ajax.lazyLoad.more);
        $jQ('#load-remaining').click(MLS.ajax.lazyLoad.remaining);
        contentGrid.sortHeader();
        contentGrid.mobileFilter.init();
        if (!isTouch) {
            MLS.ui.gridHover($contentItems.not('.large'), {
                topBar: $contentItems.find('.color-picker'),
                actions: $contentItems.find('.content-details')
            }, 10);
            //$contentItems.hover(contentGrid.productTileEnter, contentGrid.productTileLeave);
            $quickviewLinks.not('.large').on('click', {'$contentGrid' : $contentGrid}, contentGrid.quickViewHandler);
            $featuredHover.hover(contentGrid.featuredHover, contentGrid.featuredHoverOff);
        }
    },
    sortHeader: function () {
        $jQ('li', '#sort-options').on('click', function (e) {
            e.preventDefault();
            var type = $jQ(this).attr('data-type');
            //Fire Ajax
            MLS.ajax.gridSort(type);
            $jQ('li', '#sort-options').removeClass('active');
            $jQ(this).addClass('active');
        });
    },
    mobileFilter : {
        init: function () {
            //Event handler for clicks !!!D.R.Y:-(
            $jQ('a.filter', '#mobile-sort-filter').on('click', function (e) {
                e.preventDefault();
                if ($jQ(this).hasClass('active')) {
                    $jQ(this).removeClass('active').css({height: '45px'});
                    $jQ('.dropdown-menu', '#mobile-sort-filter').slideUp(200);
                } else {
                    $jQ('.dropdown-cta', '#mobile-sort-filter').not(this).removeClass('active').css({height: '45px'});
                    $jQ(this).addClass('active').css({height: '50px'});
                    $jQ('.dropdown-menu', '#mobile-sort-filter').slideDown(200);
                    $jQ('.submenu-list', '#mobile-sort-filter').hide();
                    $jQ('.filter-options-list', '#mobile-sort-filter').show();
                }
            });
            $jQ('a.sort', '#mobile-sort-filter').on('click', function (e) {
                e.preventDefault();
                if ($jQ(this).hasClass('active')) {
                    $jQ(this).removeClass('active').css({height: '45px'});
                    $jQ('.dropdown-menu', '#mobile-sort-filter').slideUp(200);
                } else {
                    $jQ('.dropdown-cta', '#mobile-sort-filter').not(this).removeClass('active').css({height: '45px'});
                    $jQ(this).addClass('active').css({height: '50px'});
                    $jQ('.dropdown-menu', '#mobile-sort-filter').slideDown(200);
                    $jQ('.submenu-list', '#mobile-sort-filter').hide();
                    $jQ('.sort-options-list', '#mobile-sort-filter').show();
                }
            });

            $jQ('li.filter-option', '.filter-options-list').on('click', function () {
                var dimension = $jQ(this).attr('data-type');
                contentGrid.mobileFilter.filterPanel(dimension);
            });
            //Toggle states for multi select
            $jQ('.list-option', '.filter-panel .multi-select').on('click', function () {
                $jQ(this).toggleClass('selected');
            });
            //Toggle states for single select
            $jQ('.list-option', '.filter-panel .single-select').on('click', function () {
                $jQ(this).parent('ul').find('li').removeClass('selected');
                $jQ(this).toggleClass('selected');
            });

        },
        filterPanel: function (dimension) {
            var viewportHeight = Response.viewportH();
            $jQ('.filter-panels .filter-panel').hide();
            $jQ('.filter-panel.' + dimension).show();
            $jQ('.filter-panels').show(function () {
                $jQ(this).animate({height: viewportHeight});
            });
            $jQ('.filter-panels .close').one('click', function () {
                $jQ('.filter-panels').animate({height: 0}, function () {
                    $jQ(this).hide();
                });
            });
        },
        updateFilters: function () {

        }
    },
    productTileEnter : function () {
        $jQ(this).addClass('active');
    },
    productTileLeave : function () {
        $jQ(this).removeClass('active');
    },
    quickViewHandler : function (e) {
        var pid = $jQ(e.currentTarget).find('a').attr('data-pid');
        var el = $jQ(e.currentTarget);
        MLS.ajax.quickView.init(pid, el);
    },
    quickViewShow: function (e) {
        var $quickView = $jQ('#quick-view-overlay'),
        $parentTile = $jQ(e).parent().parent(),
        $contentTile = $parentTile.hasClass('featured') ? $parentTile.next() : $parentTile,
        $cTposition = $contentTile.position(),
        $closeQv = $jQ('#close-quick-view').on('click', { qv : $quickView }, contentGrid.quickViewClose);
        if ($parentTile.hasClass('bundle')) {
            $quickView = $jQ('.quick-view-overlay.bundle');
        }
        $jQ('#quick-view-modal').fadeIn('fast');
        $quickView.css({
            'display' : 'block',
            'top' : $cTposition.top + ($parentTile.hasClass('featured') ? $parentTile.outerHeight() : 0) + 15,
            'height' : $jQ('.content-item').not('.featured').outerHeight() * 2,
            'width' : $jQ('#main-column .content-grid, .home-page .content-grid').not('.guide-grid').outerWidth()
        });
        $quickView.attr('scroll', $jQ(window).scrollTop());
        $jQ('html, body').animate({
            scrollTop : $cTposition.top + $contentTile.outerHeight() + 200
        }, 500, function () {
            contentGrid.initSlider();
            setTimeout(function () { // ensure scroll is fully complete before attaching these event handlers
                $jQ(window).on({
                    'resize.quickView' : contentGrid.quickViewClose,
                    'scroll.quickView' : contentGrid.quickViewClose,
                    'click.quickView' : function (e) {
                        if ($jQ(e.target).closest($quickView).length === 0) {
                            contentGrid.quickViewClose(e);
                        }
                    }
                }, { 'qv' : $quickView });
            }, 1);
        });
        $jQ('#product-colors .color', '#quick-view-overlay').on('click', function () {
            var colorTitle = $jQ(this).find('a').attr('title');
            $jQ('#product-colors .color').removeClass('active');
            $jQ(this).addClass('active');
            $jQ('.color-info .color-option', '#quick-view-overlay').text(colorTitle);
        });
    },
    initSlider : function () {
        $jQ('#quick-view-slider').flexslider({
            animation: 'slide',
            controlNav: 'thumbnails',
            directionNav: false,
            controlsContainer: '.slider-controls',
            slideshow: false,
            start: function (slider) {
                $jQ('.flex-control-thumbs li', '#quick-view-overlay').append('<div class="decoration"></div>');
                var controls = $jQ('.flex-control-thumbs li', '#quick-view-overlay');
                var activeControl = controls[slider.currentSlide];
                $jQ('.flex-control-thumbs li', '#quick-view-overlay').removeClass('flex-active');
                $jQ(activeControl).addClass('flex-active');
                var $sliderThumbs = $jQ('.flex-control-thumbs', '#quick-view-overlay');
                var $sliderWidth = $jQ('.flex-control-thumbs', '#quick-view-overlay').width();
                $sliderThumbs.css('margin-left', '-' + $sliderWidth / 2 + 'px').css('display', 'block');
            },
            after: function (slider) {
                var controls = $jQ('.flex-control-thumbs li', '#quick-view-overlay');
                var activeControl = controls[slider.currentSlide];
                $jQ('.flex-control-thumbs li', '#quick-view-overlay').removeClass('flex-active');
                $jQ(activeControl).addClass('flex-active');
            }
        });
        var $sliderThumbs = $jQ('.slider-controls .flex-control-thumbs');
        //contentGrid.setThumbnailMargins($sliderThumbs, ($jQ(window).width() >= 1024 ? 'left' : 'top'));
    },
    setThumbnailMargins : function ($sT, pos) {
        var offset = pos === 'left' ? $sT.outerWidth() : $sT.outerHeight();
        $sT.css('margin-' + pos, '-' + (offset / 2) + 'px');
    },
    quickViewClose : function (e) {
        if (Math.abs(parseFloat($jQ('#quick-view-overlay').attr('scroll')) - parseFloat($jQ(window).scrollTop())) > 250 || e.type === 'click') {
            e.preventDefault();
            contentGrid.removeCloseListeners();
            var $qv = $jQ(e.data.qv);
            $qv.fadeOut('fast');
            $jQ('#quick-view-modal').fadeOut('fast');
        }
    },
    removeCloseListeners : function () {
        $jQ(window).off('resize.quickView');
        $jQ(window).off('scroll.quickView');
        $jQ(window).off('click.quickView');
    },
    featuredHover : function () {
        var rThis = $jQ(this).parent().find('.featured-item-hover').stop(true, true).fadeIn('fast');
    },
    featuredHoverOff : function () {
        var rThis = $jQ(this).parent().find('.featured-item-hover').stop().fadeOut('fast');
    },
    featuredReveal : function (e) {
        e.preventDefault();
        var rThis = $jQ(this).parent().siblings('.featured-item');
        var rWd = rThis.width();
        var rHt = rThis.height();
        var wdIncr = (rWd) * -1;
        var htIncr = (rHt * .98) * -1;
        $jQ(rThis).css({
            'opacity' : 1,
            '-webkit-transform' : ' translate3d(' + wdIncr + 'px,' + htIncr + 'px, 0) ',
            '-moz-transform' : ' translate3d(' + wdIncr + 'px,' + htIncr + 'px, 0) ',
            '-ms-transform' : ' translate3d(' + wdIncr + 'px,' + htIncr + 'px, 0) ',
            '-o-transform' : ' translate3d(' + wdIncr + 'px,' + htIncr + 'px, 0) ',
            'transform' : ' translate3d(' + wdIncr + 'px,' + htIncr + 'px, 0) '

        }); // end css
    }, // end vznReveal
    featuredHide : function (e) {
        e.preventDefault();
        var hThis = $jQ(this).parents('.featured-item');
        $jQ(hThis).css({
            'opacity' : 0,
            '-webkit-transform' : ' translate3d(0 ,0 , 0) ',
            '-moz-transform' : ' translate3d(0 ,0 , 0) ',
            '-ms-transform' : ' translate3d(0 ,0 , 0) ',
            '-o-transform' : ' translate3d(0 ,0 , 0) ',
            'transform' : ' translate3d(0 ,0 , 0) '
        }); // end css
    }// end featuredHide
};

// ............. TEMP state toggle buttons in header .........

var stndrd = document.getElementById('state-standard');
var newProd = document.getElementById('state-new-products');
var featSale = document.getElementById('state-sale-featured');
var itemSale = document.getElementById('state-sale-item');

$jQ(stndrd).click(function () {

    var stndrd = document.getElementById('state-standard');
    var newProd = document.getElementById('state-new-products');
    var featSale = document.getElementById('state-sale-featured');
    var itemSale = document.getElementById('state-sale-item');

    // change font colors for nav
    $jQ(this).addClass('on');
    $jQ(newProd).removeClass('on');
    $jQ(featSale).removeClass('on');
    $jQ(itemSale).removeClass('on');

    //turn off all special cases
    $jQ('.new-product').css('display', 'none');
    $jQ('.sale-featured').css('display', 'none');
    $jQ('.sale-item').css('display', 'none');

});

$jQ(newProd).click(function () {

    var stndrd = document.getElementById('state-standard');
    var newProd = document.getElementById('state-new-products');
    var featSale = document.getElementById('state-sale-featured');
    var itemSale = document.getElementById('state-sale-item');

    // change font colors for nav
    $jQ(this).addClass('on');
    $jQ(stndrd).removeClass('on');

    // turn on new product elements
    $jQ('.new-product').css('display', 'block');

});

$jQ(featSale).click(function () {

    var stndrd = document.getElementById('state-standard');
    var newProd = document.getElementById('state-new-products');
    var featSale = document.getElementById('state-sale-featured');
    var itemSale = document.getElementById('state-sale-item');

    // change font colors for nav
    $jQ(this).addClass('on');
    $jQ(stndrd).removeClass('on');

    //turn on featured sale elements & add class depending on screen width
    var pageWidth = document.body.clientWidth;
    if (pageWidth < 1281) {
        $jQ('.sale-featured.three-across').css('display', 'block').parent().addClass('sale-featured-block');
    } else if (pageWidth > 1280) {
        $jQ('.sale-featured.four-across').css('display', 'block').parent().addClass('sale-featured-block');
    }
});

$jQ(itemSale).click(function () {

    var stndrd = document.getElementById('state-standard');
    var newProd = document.getElementById('state-new-products');
    var featSale = document.getElementById('state-sale-featured');
    var itemSale = document.getElementById('state-sale-item');

    // change font colors for nav
    $jQ(this).addClass('on');
    $jQ(stndrd).removeClass('on');

    //turn on item sale elements & turn off hover
    $jQ('.sale-item').css('display', 'block');

}); // end TEMP state buttons
