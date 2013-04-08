MLS.specialOffers = {
    init : function() {
        //guides
        $jQ('#special-offers').flexslider({
            animation: 'slide',
            controlsContainer: '#special-offers .slide-nav',
            animationLoop: true,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500
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

    }
}