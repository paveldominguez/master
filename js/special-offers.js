MLS.specialOffers = {
    init : function() {
        //guides

        $jQ('#offers-onsale').flexslider({
            animation: 'slide',
            controlsContainer: '#offers-onsale .slide-nav',
            animationLoop: true,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500,
        });

        $jQ('#bundle-deals').flexslider({
            animation: 'slide',
            controlsContainer: '#bundle-deals .slide-nav',
            animationLoop: true,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500
        });

        $jQ('#special-offers').flexslider({
            animation: 'slide',
            animationLoop: true,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500,
            controlsContainer: '#special-offers .slide-nav'
        });
    }
}
