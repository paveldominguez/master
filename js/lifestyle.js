MLS.lifestyle = {
    init : function() {
        var contentItem = '.product-board-slide .content-item';
        MLS.ui.gridHover(contentItem, contentItem + ' .details', 40);

        //gallery
        $jQ('#gallery-module').flexslider({
            animation: 'slide',
            controlsContainer: '#gallery-module .slide-nav',
            animationLoop: false,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500,
            itemWidth: $jQ(window).outerWidth() * 0.93
        });
        $jQ(window).resize(function () {
            $jQ('#gallery-module').data('flexslider').setOpts({itemWidth: $jQ(window).outerWidth() * 0.93});
        });

        //guides
        $jQ('#guides-module').flexslider({
            animation: 'slide',
            controlsContainer: '#guides-module .slide-nav',
            animationLoop: true,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500
        });

        //user reviews
        $jQ('#user-reviews-module').flexslider({
            animation: 'slide',
            controlsContainer: '#user-reviews-module .slide-nav',
            animationLoop: true,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500
        });

        //lifestyle products
        $jQ('#shop-products-module').flexslider({
            animation: 'slide',
            controlsContainer: '#shop-products-module .slide-nav',
            animationLoop: false,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500,
            itemWidth: $jQ(window).outerWidth() * 0.85
        });
        $jQ(window).resize(function () {
            $jQ('#shop-products-module').data('flexslider').setOpts({itemWidth: $jQ(window).outerWidth() * 0.85});
        });
    }
};