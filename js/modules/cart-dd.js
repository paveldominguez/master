MLS.cart.dd = {
    init: function () {
        // needs to be initialized before the form trigger otherwise it will not update the form
        MLS.cart.dd.triggers.ddColor();
        MLS.cart.dd.triggers.form();

    },

    triggers: {
        form: function (){
            $jQ(".data-product-attributes").change(function(){
                var p = $jQ('.pdp-size-color :input', this).serialize();
                if (p != MLS.cart.dd.params)
                {
                    MLS.cart.dd.params = p;
                    MLS.cart.dd.getJson(MLS.cart.dd.params);
                }
            });
        },

        ddColor: function(){
            // update the custom color dd
            $jQ(".color a").click(function () {
                var $dd = $jQ(this).parents('form').find("[name=pdpColorSelect], #colorSelect"),
                    color = MLS.util.getUrlParam("color", $jQ(this).attr("href"));
                    // color = $jQ(this).attr("href").split("=")[1];

                $dd.val(color);
                $jQ(".data-product-attributes").change(); // needs to triger the form change
            })
        }
    },

    getJson : function(formAttr) {
        MLS.ajax.sendRequest(
            MLS.ajax.endpoints.GET_CART_DD_ATTRIBUTES,
            formAttr,
            MLS.cart.dd.populate.init
        );
    },

    populate : {
        init: function (data){
            if (data.hasOwnProperty('error') && data.error.responseHTML != "") {
                return MLS.modal.open(data.error ? data.error.responseHTML : null);
            }

            var values = data.hasOwnProperty('success') ? data.success.responseHTML : data.error.responseHTML;

            MLS.cart.dd.populate.ddSizes(data.success.responseHTML.sizes);
            MLS.cart.dd.populate.carousel(data.success.responseHTML.carousel);

            $jQ("#product-sku-field").html("SKU #" + data.success.responseHTML.sku);
            $jQ("#pdp-hero input[name=sku]").val(data.success.responseHTML.sku); // in case the sku # has to be sent back to the server on new calls
            $jQ("#pdp-hero .data-product-attributes .price-block").html(data.success.responseHTML.price);
        },

        ddSizes: function(data){
            $jQ("#pdp-size-select").html(data);
        },

        carousel : function (data){
            var $slides = $jQ("#focus .slides, #quick-view-slider .slides").remove();

            $jQ("#focus , #quick-view-slider").html("").append($slides);
            $jQ('#focus , #quick-view-slider').flexslider("pause");

            $jQ("#focus .slides, #quick-view-slider .slides").html(data);
            $jQ('#focus, #quick-view-slider').data("flexslider", null).flexslider({
                animation: "slide",
                controlNav: false,
                animationLoop: true,
                slideshow: true,
                sync: "#thumbs"
            });
        }
    }
}


