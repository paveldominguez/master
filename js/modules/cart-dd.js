MLS.cart.dd = {
    init: function () {
        $jQ(".color").unbind("click", MLS.cart.dd.get.sizes).click(MLS.cart.dd.get.sizes);
        $jQ("#pdp-size-select").unbind("change", MLS.cart.dd.get.sizes).change(MLS.cart.dd.get.sizes);
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

        sizes: function(e) {
            var itemId = $jQ("#pdp-add-to-cart-submit").data("cart-add"),
                itemColor = $jQ(".color.active").data("color"),
                itemSize = $jQ("#pdp-size-select").val();

            MLS.ajax.sendRequest(
                MLS.ajax.endpoints.GET_CART_DD_SIZES,
                {
                    id : itemId,
                    color : itemColor,
                    size: itemSize
                },

                function(response) {
                    MLS.cart.dd.populate(response, "#pdp-size-select");
                    $jQ("#pdp-size-select")[0].selectedIndex = $jQ("#pdp-size-select option[value=" + itemSize + "]").index();
                    MLS.cart.dd.get.carousel(itemId, itemColor, itemSize);
                }
            );
        },

        carousel: function(itemId, itemColor, itemSize) {
            MLS.ajax.sendRequest(
                MLS.ajax.endpoints.GET_CART_DD_CAROUSEL,
                {
                    id : itemId,
                    size : itemSize,
                    color : itemColor
                },

                function(response) {
                    var $slides = $jQ("#focus .slides").remove();
                    $jQ("#focus").html("").append($slides);
                    MLS.cart.dd.populate(response, "#focus .slides");

                    $jQ('#focus').flexslider("pause");
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
