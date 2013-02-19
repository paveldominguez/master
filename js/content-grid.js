var contentGrid = (function() {
    var pub = {
        init : function() {
            var $contentGrid = $jQ('#main-column .content-grid'),
            $contentItems = $contentGrid.find('.content-item'),
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
            $jQ(this).find('.content-detail').animate( { opacity:1 }, 'fast');
        },
        quickViewHandler : function() {
            var $quickView = $jQ('.quick-view-overlay'),
            $contentTile = $jQ(this).parent().parent(),
            $cTposition = $contentTile.position();
            console.log('content tile height: %d', $contentTile.outerHeight());
            $quickView.css(
                {
                    'display' : 'block',
                    'position' : 'absolute',
                    'top' : $cTposition.top,
                    'right' : 0,
                    'height' : ( $contentTile.outerHeight() * 2 ) - 1,
                    'background-color' : '#FFF',
                    'z-index' : '99999'
                }
            );
            console.log('window height: %d\nscrolltop of clicked product: %d',$jQ(window).height(),$cTposition.top);
            $jQ('html, body').animate( {
                scrollTop : $cTposition.top + ($contentTile.outerHeight() / 2 )
            }, 'slow', function() {
                // pseudo:
                // (on complete of showing quickview block...)
                // on either:
                //      scroll (target outside quick view), close quick view
                //      click (target outside quick view), close quick view
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