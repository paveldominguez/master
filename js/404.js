MLS.page404 = {
    init : function() {
        var backElem = $jQ('#back');
        backElem.click(function(e){
            history.back();
            e.preventDefault();
        });

	    /*$jQ('#best-sellers-module').flexslider({
	        animation: 'slide',
	        controlsContainer: '#best-sellers-module .slide-nav',
	        animationLoop: true,
	        controlNav: false,
	        directionNav: true,
	        minItems: 1,
    		maxItems: 4,
	        slideshow: false,
	        animationSpeed: 500,
	        itemMargin: 0,
			itemWidth: 200
        });

        $jQ(window).resize(function () {
            $jQ('#best-sellers-module').data('flexslider').setOpts({itemWidth: 200});
        });*/

    $jQ('#best-sellers-module').flexslider({  // similar products slider install......
        animation: 'slide',
        controlsContainer: '#best-sellers-module .slide-nav',
        animationLoop: false,
        controlNav: false,
        directionNav: true,
        slideshow: false,
        animationSpeed: 500,
        itemWidth: 215
    });
    

	}
};

