var contentGrid = (function() {
    var pub = {
        init : function() {
            var $contentGrid = $jQ('#main-column .content-grid'),
            $contentItems = $contentGrid.find('.content-item'),
            $quickviewLinks = $contentItems.find('.quick-view');
            if(!isTouch) {
                $contentItems.hover(pub.productTileEnter,pub.productTileLeave);
                $quickviewLinks.on('click',{ '$contentGrid' : $contentGrid }, pub.quickViewHandler);
            }
        },
        productTileEnter : function() {
            $jQ(this).addClass('over');
            $jQ(this).find('.content-hover').stop(true,true).fadeIn('fast');
            $jQ(this).find('.content-detail').stop(true,true).animate( { opacity:0 }, 'fast');
        },
        productTileLeave : function() {
            $jQ(this).removeClass('over');
            $jQ(this).find('.content-hover').fadeOut('fast');
            $jQ(this).find('.content-detail').animate( { opacity: 1 }, 'fast');
        },
        quickViewHandler : function(e) {
            var $quickView = $jQ('#quick-view-overlay'),
            $parentTile = $jQ(this).parent().parent(),
            $contentTile = $parentTile.hasClass('featured') ? $parentTile.next() : $parentTile,
            $cTposition = $contentTile.position(),
            $closeQv = $jQ('#close-quick-view').on('click', { qv : $quickView }, pub.quickViewClose);
            $jQ('#quick-view-modal').fadeIn('fast');
            $quickView.css({
                'display' : 'block',
                'top' : $cTposition.top + ($parentTile.hasClass('featured') ? $parentTile.outerHeight() : 0),
                'height' : ( $contentTile.outerHeight() * 2 ) - 1,
                'width' : ( e.data.$contentGrid.outerWidth() )
            });
            $jQ('html, body').animate( {
                scrollTop : $cTposition.top + ($contentTile.outerHeight() / 2 ) + ( $parentTile.hasClass('featured') ? $parentTile.outerHeight() : 0 )
            }, 500, function() {
                pub.initSlider();
                setTimeout(function() { // ensure scroll is fully complete before attaching these event handlers
                    $jQ(window).on({
                        'resize.quickView' : pub.quickViewClose,
                        'scroll.quickView' : pub.quickViewClose,
                        'click.quickView' : function(e) {
                            if ($jQ(e.target).closest($quickView).length === 0) {
                                pub.quickViewClose(e);
                            }
                        }
                    }, { 'qv' : $quickView });
                }, 1);
            });
        },
        initSlider : function() {
            $jQ('#quick-view-slider').flexslider({
                animation: 'slide',
                controlNav: true,
                directionNav: false,
                controlsContainer: '#slider-controls',
                manualControls : '.flex-control-thumbs li',
                slideshow: false
            });

            var $sliderThumbs = $jQ('#slider-controls .flex-control-thumbs');
            $sliderThumbs.attr('style','');
            pub.setThumbnailMargins($sliderThumbs, ($jQ(window).width() >= 1024 ? 'left' : 'top'));
        },
        setThumbnailMargins : function($sT, pos) {
            var offset = pos === 'left' ? $sT.outerWidth() : $sT.outerHeight();
            $sT.css('margin-' + pos, '-' + (offset / 2) + 'px');
        },
        quickViewClose : function(e) {
            e.preventDefault();
            pub.removeCloseListeners();
            var $qv = $jQ(e.data.qv);
            $qv.fadeOut('fast');
            $jQ('#quick-view-modal').fadeOut('fast');
        },
        removeCloseListeners : function() {
            $jQ(window).off('resize.quickView');
            $jQ(window).off('scroll.quickView');
            $jQ(window).off('click.quickView');
        }
    };
    return pub;
}());