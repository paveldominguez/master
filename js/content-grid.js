var contentGrid = {
    init : function() {
        var $contentGrid = $jQ('#main-column .content-grid'),
        $contentItems = $contentGrid.find('.content-item'),
        $quickviewLinks = $contentItems.find('.quick-view');
        $featuredHover = $contentItems.find('.featured-corner');
        $featuredReveal = $contentItems.find('.shop-this');
        $featuredHide = $contentItems.find('.back-to-story');
        $featuredReveal.click(contentGrid.featuredReveal);
        $featuredHide.click(contentGrid.featuredHide);
        if(!isTouch) {
            $contentItems.hover(contentGrid.productTileEnter, contentGrid.productTileLeave);
            $quickviewLinks.on('click',{ '$contentGrid' : $contentGrid }, contentGrid.quickViewHandler);
            $featuredHover.hover(contentGrid.featuredHover, contentGrid.featuredHoverOff);
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
        $closeQv = $jQ('#close-quick-view').on('click', { qv : $quickView }, contentGrid.quickViewClose);
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
            contentGrid.initSlider();
            setTimeout(function() { // ensure scroll is fully complete before attaching these event handlers
                $jQ(window).on({
                    'resize.quickView' : contentGrid.quickViewClose,
                    'scroll.quickView' : contentGrid.quickViewClose,
                    'click.quickView' : function(e) {
                        if ($jQ(e.target).closest($quickView).length === 0) {
                            contentGrid.quickViewClose(e);
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
        contentGrid.setThumbnailMargins($sliderThumbs, ($jQ(window).width() >= 1024 ? 'left' : 'top'));
    },
    setThumbnailMargins : function($sT, pos) {
        var offset = pos === 'left' ? $sT.outerWidth() : $sT.outerHeight();
        $sT.css('margin-' + pos, '-' + (offset / 2) + 'px');
    },
    quickViewClose : function(e) {
        e.preventDefault();
        contentGrid.removeCloseListeners();
        var $qv = $jQ(e.data.qv);
        $qv.fadeOut('fast');
        $jQ('#quick-view-modal').fadeOut('fast');
    },
    removeCloseListeners : function() {
        $jQ(window).off('resize.quickView');
        $jQ(window).off('scroll.quickView');
        $jQ(window).off('click.quickView');
    },
    featuredHover : function() {
    	var rThis = $jQ(this).parent().find('.featured-item-hover').stop(true,true).fadeIn('fast'); 
    },
    featuredHoverOff : function() {
    	var rThis = $jQ(this).parent().find('.featured-item-hover').stop().fadeOut('fast');
    },
    featuredReveal : function(e) { 
    	e.preventDefault();
    	var rThis = $jQ(this).parent().siblings('.featured-item');
		var rWd = rThis.width() ; 
		var rHt = rThis.height() ;
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
    featuredHide : function(e) { 
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