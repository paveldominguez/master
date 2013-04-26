MLS.categoryLanding = {
    init : function () {
        //trending
        $jQ('#new-arrivals-module').flexslider({
            animation: 'slide',
            controlsContainer: '#new-arrivals-module .slide-nav',
            animationLoop: true,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500
        });
    }
}