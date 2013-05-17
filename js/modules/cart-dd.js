MLS.cart.dd = {
    init: function () {
        console.log('v18');

        $jQ(".color , #pdp-size-select").click(function() {
            MLS.cart.dd.get.sizes();
        });

        $jQ().change(function() {


        });

    },

    get: {
        // colors: function(){
        //                 var itemId = $jQ("#pdp-add-to-cart-submit").data("data-cart-add");
        //                 var itemSize = $jQ("#pdp-size-select").val();

        //                 MLS.ajax.sendRequest(
        //             MLS.ajax.endpoints.GET_CART_DD_COLORS,
        //             {
        //                 id : itemId,
        //                 size : itemSize
        //             },
        //             function(response){
        //                     MLS.cart.dd.populate(response, "#pdp-color-select")
        //                         MLS.cart.dd.get.carousel();
        //                 }
        //         );
        //     },

        sizes: function(){
            var itemId = $jQ("#pdp-add-to-cart-submit").data("data-cart-add");
            var itemColor = $jQ(".color.active").data("data-color");

            //console.log("inside sizes");

            MLS.ajax.sendRequest(
            MLS.ajax.endpoints.GET_CART_DD_SIZES,
                {
                    id : itemId,
                    Color : itemColor
                },
                function(response){
                    //console.log("inside sizes ajax response ");
                    MLS.cart.dd.populate(response, "#pdp-size-select");
                    MLS.cart.dd.get.carousel();
                }
            );
        },

        carousel: function(itemColor){
            var itemId = $jQ("#pdp-add-to-cart-submit").data("data-cart-add");
            var itemSize = $jQ("#pdp-size-select").val();
            var itemColor = $jQ(".color.active").data("data-color");

            MLS.ajax.sendRequest(
                MLS.ajax.endpoints.GET_CART_DD_CAROUSEL,
                {
                    id : itemId,
                    size : itemSize,
                    Color : itemColor
                },
                function(response){
                    MLS.cart.dd.populate(response, "#focus .slides")

                    $jQ('#focus').data("flexslider", null).flexslider({
                        animation: "slide",
                        controlNav: false,
                        animationLoop: true,
                        slideshow: true,
                        sync: "#thumbs"
                    });
                }
            );
        }

    },

    populate : function (data, container) {
        var values = data.hasOwnProperty('success') ? data.success.responseHTML : data.error.responseHTML
        $jQ(container).html(values);
    }

}
