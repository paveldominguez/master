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

		//Flex Sliders
		MLS.home.sliders.init();

		//Trending Products tabs Dirty
		$jQ('dd','#detail-tabs').on('click',function(e){
			e.preventDefault();
			var tab = $jQ(this).find('a').attr('href');
			$jQ('dd','#detail-tabs').removeClass('active');
			$jQ(this).addClass('active');
			$jQ('.tabs-content > li','.trending-products').removeClass('active');
			$jQ('.tabs-content '+ tab,'.trending-products').addClass('active');
		});


	},

	sliders:{
		init:function(){
			// $jQ('.home-page').find('.fslider').each(function(){
			// console.log($jQ(this));
			// });
			$jQ('.fslider').flexslider({
				animation: "slide",
				animationLoop: true,
				itemWidth: 212,
				itemMargin: 0,
				maxItems:4,
				slideshow:false

			});
		}
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