MLS.cart.dd = {
    init: function () {
        console.log("v.10");

        MLS.cart.dd.triggers.ddColor(); // needs to be initialized before the form trigger otherwise it will not update the form
        MLS.cart.dd.triggers.form();

    },

    triggers: {
        form: function (){
            $jQ(".data-product-attributes").change(function(){

                var formAttr = $jQ(this).serialize();

                MLS.cart.dd.getJson(formAttr);
                //console.log (formAttr);
            });
        },

        ddColor: function(){
            // update the custom color dd
            $jQ(".color a").click(function (){
                var $dd = $jQ(this).parents('form').find("[name=pdpColorSelect]"),
                color = MLS.util.getUrlParam("color", $jQ(this).attr("href"));
                $dd.val(color);
                $jQ(".data-product-attributes").change(); // needs to triger the form change

                console.log(' color');

            })
        }
    },

    getJson : function(formAttr) {
            MLS.ajax.sendRequest(
            MLS.ajax.endpoints.GET_CART_DD_ATTRIBUTES,
            formAttr,
            function(response) {
                MLS.cart.dd.populate.init(response);
            }
        );
    },

    populate : {
        init: function (data){
            var values = data.hasOwnProperty('success') ? data.success.responseHTML : data.error.responseHTML

            MLS.cart.dd.populate.ddSizes(data.success.responseHTML.sizes);
            MLS.cart.dd.populate.carousel(data.success.responseHTML.carousel);
        },

        ddSizes: function(data){
            $jQ("#pdp-size-select").html(data);
        },

        carousel : function (data){
            var $slides = $jQ("#focus .slides").remove();

            $jQ("#focus").html("").append($slides);
            $jQ('#focus').flexslider("pause");

            $jQ("#focus .slides").html(data);
            $jQ('#focus').data("flexslider", null).flexslider({
                animation: "slide",
                controlNav: false,
                animationLoop: true,
                slideshow: true,
                sync: "#thumbs"
            });
        }
    }
}




