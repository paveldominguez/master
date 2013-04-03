MLS.lifestyle = {
    init : function() {
        $jQ('li.product-board-slide li.content-item').on('click',function(e){
            e.preventDefault();
            var offset = $jQ(this).offset();
            var position = $jQ(this).position();
            var width = $jQ(this).width();
            var height = $jQ(this).height();
            var detailHeight = $jQ('#grid-pop-out .details').height();
            $jQ('#grid-pop-out').css({top:offset.top - 20, left:offset.left, width:width+2,height:height+40+detailHeight}).show();
            $jQ('#grid-pop-out .close').one('click',function(){
                $jQ('#grid-pop-out').hide();
            });
            //Grab the details div from the source directly then calculate height, alternatively can use data atrib
        });

        //gallery
        $jQ('#lifestyle-gallery').flexslider({
            animation: 'slide',
            controlsContainer: '#lifestyle-gallery .slide-nav',
            animationLoop: true,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500,
            itemWidth: $jQ(window).outerWidth() * 0.93
        });
        $jQ(window).resize(function() {
            $jQ('#lifestyle-gallery').data('flexslider').setOpts({itemWidth: $jQ(window).outerWidth() * 0.93});
        });

        //guides
        $jQ('#lifestyle-guides').flexslider({
            animation: 'slide',
            controlsContainer: '#lifestyle-guides .slide-nav',
            animationLoop: true,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500
        });

        //product pinterst gallery
        $jQ('#lifestyle-product-board').flexslider({
            animation: 'slide',
            controlsContainer: '#lifestyle-product-board .slide-nav',
            animationLoop: true,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500
        });

        //user reviews
        $jQ('#lifestyle-user-reviews').flexslider({
            animation: 'slide',
            controlsContainer: '#lifestyle-user-reviews .slide-nav',
            animationLoop: true,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500
        });

        //lifestyle products
        $jQ('#lifestyle-products').flexslider({
            animation: 'slide',
            controlsContainer: '#lifestyle-products .slide-nav',
            animationLoop: true,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500,
            itemWidth: $jQ(window).outerWidth() * 0.85
        });
        $jQ(window).resize(function() {
            $jQ('#lifestyle-products').data('flexslider').setOpts({itemWidth: $jQ(window).outerWidth() * 0.85});
        });
    }
};