MLS.page404 = {
    init : function() {
        var backElem = $jQ('#back');
        backElem.click(function(e){
            history.back();
            e.preventDefault();
        });

	    //guides
	    $jQ('#best-sellers-module').flexslider({
	        animation: 'slide',
	        controlsContainer: '#best-sellers-module .slide-nav',
	        animationLoop: true,
	        controlNav: false,
	        directionNav: true,
	        slideshow: false,
	        animationSpeed: 500
	    });
	}
};