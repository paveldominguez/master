MLS.home = {

	init: function() {

		//Flex Slider hero
		$jQ('#home-hero-slider').flexslider({
			animation: "fade",
			controlNav: true,
			animationLoop: true,
			slideshow: true,
			directionNav: true

		});

		//init vzSliders
		MLS.ui.vzSlider.init();


	}

};