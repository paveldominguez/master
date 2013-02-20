var contentGrid = (function() {
    var $contentGrid = $jQ('#main-column .content-grid');
    var pub = {
        init : function() {
            var $contentItems = $contentGrid.find('.content-item'),
            $quickviewLinks = $contentItems.find('.quick-view');
            if(!isTouch) {
                $contentItems.hover(pub.productTileEnter,pub.productTileLeave);
                $quickviewLinks.on('click',pub.quickViewHandler);
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
        quickViewHandler : function() {
            var $quickView = $jQ('#quick-view-overlay'),
            $parentTile = $jQ(this).parent().parent(),
            $contentTile = $parentTile.hasClass('featured') ? $parentTile.next() : $parentTile,
            $cTposition = $contentTile.position();
            console.log($parentTile.next());
            $quickView.css({
                'display' : 'block',
                'top' : $cTposition.top + ($parentTile.hasClass('featured') ? $parentTile.outerHeight() : 0),
                'height' : ( $contentTile.outerHeight() * 2 ) - 1,
                'width' : ( $contentGrid.outerWidth() )
            });
            $jQ('html, body').animate( {
                scrollTop : $cTposition.top + ($contentTile.outerHeight() / 2 ) + ( $parentTile.hasClass('featured') ? $parentTile.outerHeight() : 0 )
            }, 'slow', function() {
                $jQ('#quick-view-slider').flexslider({
                    animation: 'slide',
                    controlNav: "thumbnails",
                    directionNav: false,
                    slideshow: false
                });
                $jQ('#quick-view-slider .flex-control-thumbs').css('margin-left','-' + ($jQ('#quick-view-slider .flex-control-thumbs').outerWidth() / 2) + 'px');
                // pseudo:
                // (on complete of showing quickview block...)
                // on either:
                //      scroll (target outside quick view), close quick view
                //      click (target outside quick view), close quick view
                //      resize (without debounce), close quick view
                // in both (previous) cases, remove even listener for scroll/click...




                // $jQ(document).one(
                //     {
                //         'resize.quickView' : function(e) {
                //             console.log('resizin');
                //             $quickView.fadeOut('fast');
                //         },
                //         'scroll.quickView' : function(e) {
                //             console.log('scrollin');
                //             if(!$jQ(e.target).hasClass('.quick-view')) {
                //                 $quickView.fadeOut('fast');
                //             }
                //         }
                //     }
                // );
                // $jQ(document).on('mouseup.quickView', function(e) {
                //     console.log(e.target);
                //     if ($jQ(e.target).closest($quickView).length === 0 && !$jQ(e.target).hasClass('.quick-view') ) {
                //         $quickView.fadeOut('fast');
                //         $jQ(document).off('mouseup.quickView');
                //     }
                // });
            });
        }
    };
    return pub;
}());