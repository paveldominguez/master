MLS.categoryLanding = {
    init : function () {
        //new arrivals
        $jQ('#new-arrivals-module').flexslider({
            animation: 'slide',
            controlsContainer: '#new-arrivals-module .slide-nav',
            animationLoop: true,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500,
            itemWidth: (R.viewportW() < 768 ? $jQ(window).outerWidth() * 0.93 : $jQ(window).outerWidth())
        });

        //new arrivals
        $jQ('#latest-stories-module').flexslider({
            animation: 'slide',
            controlsContainer: '#latest-stories-module .slide-nav',
            animationLoop: true,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500,
            itemWidth: (R.viewportW() < 768 ? $jQ(window).outerWidth() * 0.93 : $jQ(window).outerWidth())
        });

        //guides
        $jQ('#guides-module').flexslider({
            animation: 'slide',
            controlsContainer: '#guides-module .slide-nav',
            animationLoop: true,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500,
            itemWidth: (R.viewportW() < 768 ? $jQ(window).outerWidth() * 0.93 : $jQ(window).outerWidth())
        });

        //stories and guides


        //best sellers
        $jQ('#best-sellers-module').flexslider({
            animation: 'slide',
            controlsContainer: '#best-sellers-module .slide-nav',
            animationLoop: true,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500,
            itemWidth: (R.viewportW() < 768 ? $jQ(window).outerWidth() * 0.93 : $jQ(window).outerWidth())
        });

        $jQ(window).resize(function () {
            $jQ('#new-arrivals-module').data('flexslider').setOpts({itemWidth: (R.viewportW() < 768 ? $jQ(window).outerWidth() * 0.93 : $jQ(window).outerWidth() )});
            $jQ('#latest-stories-module').data('flexslider').setOpts({itemWidth: (R.viewportW() < 768 ? $jQ(window).outerWidth() * 0.93 : $jQ(window).outerWidth() )});
            $jQ('#guides-module') .data('flexslider').setOpts({itemWidth: (R.viewportW() < 768 ? $jQ(window).outerWidth() * 0.93 : $jQ(window).outerWidth() )});
            $jQ('#best-sellers-module').data('flexslider').setOpts({itemWidth: (R.viewportW() < 768 ? $jQ(window).outerWidth() * 0.93 : $jQ(window).outerWidth() )});
        });
    }
}