MLS.lifestyle = {
    init : function() {
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

        //gallery
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