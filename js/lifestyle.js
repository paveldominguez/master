MLS.lifestyle = {
    search: function () {
        var $form = $jQ(this).parents('form'),
            data = $form.serialize();

        $form.unbind('submit').on('submit', function (e) { e.preventDefault(); }); // do not submit form in enter

        window.location.hash = data;

        // make request
        MLS.ajax.sendRequest(
            MLS.ajax.endpoints.LIFESTYLE_LANDING_SEARCH,
            data,

            function(r) {
                if (r.hasOwnProperty('error') && r.error.responseHTML != "") {
                    return MLS.modal.open(r.error ? r.error.responseHTML : null);
                }

                $jQ("#search-modules").html(r.success.responseHTML);

                MLS.miniCart.init();
                MLS.article.init();
                MLS.lifestyle.init(true);
                contentGrid.init();
            }
        );
    },

    init : function (noglobal) {
        // search pieces
        // compability services
        $jQ('.compatibility-filter').find('select').unbind('change', this.search).on('change', this.search);

        // type ahead (searc)
        $jQ('.compatibility-filter').find('input.type-ahead').unbind('keyup', this.search).on('keyup', this.search);

        var contentItem = '.product-board-slide .content-item';
        MLS.ui.gridHover(contentItem, contentItem + ' .details', 40);

        noglobal || $jQ('#lifestyle-nav').find('.collapsible .dimension-header').on('click', function () {
            $jQ(this).next().slideToggle('fast');
            $jQ(this).toggleClass('active');
        });

        //trending
        $jQ('#trending-module').flexslider({
            animation: 'slide',
            controlsContainer: '#trending-module .slide-nav',
            animationLoop: false,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500
        });

        $jQ('#featured-story-module').flexslider({
            animation: 'slide',
            controlsContainer: '#featured-story-module .slide-nav',
            animationLoop: true,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500,
            itemWidth: $jQ(window).outerWidth() * 0.93
        });

        noglobal || $jQ(window).resize(function () {
            $jQ('#featured-story-module').data('flexslider').setOpts({itemWidth: $jQ(window).outerWidth() * 0.93});
        });

        //gallery
        $jQ('#gallery-module').flexslider({
            animation: 'slide',
            controlsContainer: '#gallery-module .slide-nav',
            animationLoop: false,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500,
            itemWidth: $jQ(window).outerWidth() * 0.93
        });

        noglobal || $jQ(window).resize(function () {
            $jQ('#gallery-module').data('flexslider').setOpts({itemWidth: $jQ(window).outerWidth() * 0.93});
        });

        //guides
        $jQ('#guides-module').flexslider({
            animation: 'slide',
            controlsContainer: '#guides-module .slide-nav',
            animationLoop: true,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500
        });

        //user reviews
        $jQ('#user-reviews-module').flexslider({
            animation: 'slide',
            controlsContainer: '#user-reviews-module .slide-nav',
            animationLoop: true,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500
        });

        //lifestyle products
        $jQ('#shop-products-module').flexslider({
            animation: 'slide',
            controlsContainer: '#shop-products-module .slide-nav',
            animationLoop: false,
            controlNav: false,
            directionNav: true,
            slideshow: false,
            animationSpeed: 500,
            itemWidth: $jQ(window).outerWidth() * 0.85
        });
        noglobal || $jQ(window).resize(function () {
            $jQ('#shop-products-module').data('flexslider').setOpts({itemWidth: $jQ(window).outerWidth() * 0.85});
        });
    }
};
