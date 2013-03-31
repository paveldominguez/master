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

		//Madlib
		MLS.home.madlib.init();


	},

	madlib: {

		init:function(){
			//Generic Typeahead
			$jQ('#madlib-device').typeahead({
				name: 'devices',
				remote: 'js/data/devices.json',
				limit: 10
			}).on('typeahead:selected',function(){
				console.log($jQ(this).val());
				$jQ(this).stop().animate({
				width: $jQ(this).val().length*18
				},100);
			});
		}
	}
};