MLS.home = {

	init: function () {

		//Flex Slider hero
		$jQ('#home-hero-slider').flexslider({
			animation: 'fade',
			controlNav: true,
			animationLoop: true,
			slideshow: true,
			directionNav: true,
            slideshowSpeed: 7000

		});

		//Madlib
		MLS.home.madlib.init();

		//MiniCart
		MLS.miniCart.init();

		//Flex Sliders
		MLS.home.sliders.init();

		//Featured Reviews
		MLS.home.featuredReviews();

        MLS.ui.vzSlider.init();

		//Trending Products tabs
        $jQ('dd', '#detail-tabs').on('click', function (e) {
			e.preventDefault();
			var tab = $jQ(this).find('a').attr('href');
			$jQ('dd', '#detail-tabs').removeClass('active');
			$jQ(this).addClass('active');
			$jQ('.tabs-content > li', '.trending-products').removeClass('active');
			$jQ('.tabs-content ' + tab, '.trending-products').addClass('active');
		});

        contentGrid.init(true);
        MLS.ajax.colorPicker.init();

	},
	featuredReviews: function () {
		//select random color for each item entry
		var colorArray = ['green', 'yellow', 'blue', 'red', 'purple', 'charcoal'];
		$jQ('.featured-review .product-img').each(function () {
			var color = Math.floor((Math.random() * colorArray.length) + 1);
			$jQ(this).addClass(colorArray[color]);
		});
	},
	sliders: {
		init: function () {
            $jQ('.trending-categories .fslider').flexslider({
                animation: 'slide',
                controlsContainer: 'section.trending-categories .slide-nav',
                animationLoop: true,
                controlNav: false,
                directionNav: true,
                slideshow: false,
                animationSpeed: 500,
                itemWidth: 212,
                maxItems: 4,
                itemMargin: 0
            });
            $jQ(window).resize(function () {
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
            $jQ(window).resize(function () {
                $jQ('.featuredReviewSlider').data('flexslider').setOpts({itemWidth: $jQ('.featuredReviewSlider').outerWidth() * 0.85});
            });
		}
	},
	madlib: {

		init: function () {
			//Generic Typeahead
			$jQ('#madlib-device').typeahead({
				name: 'devices',
				remote: MLS.ajax.endpoints.SEARCH_DEVICES,
				limit: 10
			}).on('change keyup typeahead:selected typeahead:closed', function (e) {
				//console.log($jQ(this).val());
				if (e.type === 'typeahead:closed') {
					$jQ(this).blur();
				}

				if (e.type === 'typeahead:selected') {
					MLS.home.searchProducts($jQ(e.target).val(), $jQ("[name=madlib-select]").val())
				}

				if ($jQ(this).val() === 'enter device' || $jQ(this).val() === '') {
					$jQ(this).stop().animate({
						width: 173
					}, 100);
				} else if ($jQ(this).val().length <= 20) {
					if ($jQ(this).val().length > 3) {
						$jQ(this).stop().animate({
							width: $jQ(this).val().length * 17
						}, 100);
                    }
				}
			});

            $jQ('#madlib-select').customSelectMenu({
                menuClass: 'madlib-select',
                openedClass: 'open',
                selectedClass: 'active',
                selectionMadeClass: 'selected'
            }).on('change', function() {
            	MLS.home.searchProducts($jQ('#madlib-device').val(), $jQ("[name=madlib-select]").val());
            });
		}
	},

	searchProducts: function(device, category) {
		MLS.ajax.sendRequest(
            MLS.ajax.endpoints.HOMEPAGE_PRODUCTS,
            
            {
            	device: device,
            	category: category
            },

            function(r) {
            	if (r.hasOwnProperty('error') && r.error.responseHTML != "") {
		    	    return MLS.modal.open(r.error ? r.error.responseHTML : null);
		        }

                $jQ("ul.content-grid:eq(0)").replaceWith(r.success.responseHTML);
                MLS.miniCart.init($jQ("ul.content-grid:eq(0)"));
                contentGrid.init(true);
            }
        );
	}
};
