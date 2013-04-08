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

		//Featured Reviews
		MLS.home.featuredReviews();

		//Trending Products tabs
		$jQ('dd','#detail-tabs').on('click',function(e){
			e.preventDefault();
			var tab = $jQ(this).find('a').attr('href');
			$jQ('dd','#detail-tabs').removeClass('active');
			$jQ(this).addClass('active');
			$jQ('.tabs-content > li','.trending-products').removeClass('active');
			$jQ('.tabs-content '+ tab,'.trending-products').addClass('active');
		});


	},
	featuredReviews: function(){
		//select random color for each item entry
		var colorArray = ['green','yellow','blue','red','purple','charcoal'];
		$jQ('.featured-review .product-img').each(function(){
			var color = Math.floor((Math.random()*colorArray.length)+1);
			$jQ(this).addClass(colorArray[color]);
		});
	},
	sliders:{
		init:function(){
            $jQ('.trending-categories .fslider').flexslider({
                animation: 'slide',
                controlsContainer: 'section.trending-categories .slide-nav',
                animationLoop: true,
                controlNav: false,
                directionNav: true,
                slideshow: false,
                animationSpeed: 500,
                itemWidth: 212,
                maxItems:4,
                itemMargin: 0
            });
            $jQ(window).resize(function() {
                $jQ('.featuredReviewSlider').data('flexslider').setOpts({itemWidth: $jQ('.featuredReviewSlider').outerWidth() * 0.85});
            });
            $jQ('.featuredReviewSlider').flexslider({
                animation: 'slide',
                controlsContainer: 'section.featured-reviews .slide-nav',
                animationLoop: true,
                controlNav: false,
                directionNav: true,
                slideshow: false,
                animationSpeed: 500,
                itemWidth: $jQ('.featuredReviewSlider').outerWidth() * 0.875
            });
            $jQ(window).resize(function() {
                $jQ('.featuredReviewSlider').data('flexslider').setOpts({itemWidth: $jQ('.featuredReviewSlider').outerWidth() * 0.85});
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
			}).on('change keyup typeahead:selected typeahead:closed',function(e){
				console.log($jQ(this).val());
				if ( e.type === "typeahead:closed" ){
					$jQ(this).blur();
				}
				if ( e.type === "typeahead:selected" ){
					//Fire secondary
				}
				if ( $jQ(this).val() === "enter device" || $jQ(this).val() === "" ){
					$jQ(this).stop().animate({
						width: 173
					},100);
				}else{
					if ($jQ(this).val().length > 3){
						$jQ(this).stop().animate({
							width: $jQ(this).val().length*17
						},100);
					}
				}
			});
		}
	}
};