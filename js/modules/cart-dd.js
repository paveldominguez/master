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
            MLS.cart.dd.populate.carousel(data.success.responseHTML.carousel, data.success.responseHTML.thumbnails);

            $jQ("#product-sku-field").html("SKU #" + data.success.responseHTML.sku);
            $jQ("#pdp-hero input[name=sku]").val(data.success.responseHTML.sku); // in case the sku # has to be sent back to the server on new calls
            $jQ("#pdp-hero .data-product-attributes .price-block").html(data.success.responseHTML.price);
        },

        ddSizes: function(data){
            var $s = $jQ("#pdp-size-select"),
                val = $s.val(),
                tx = $s.find("option:selected").html();

            $jQ("#pdp-size-select").html(data).val(val).siblings("span").html(tx);
        },

        carousel : function (data, thumb) {
            // reinitialize sliders (only the ones already created)

            var $slides = $jQ("<div></div>").html(data),
                $thumbs = $jQ("<div></div>").html(thumb);

            $jQ('#focus, #zoom-focus, #quick-view-slider').each(function() {
                var s = $jQ(this).data("flexslider");
                if (!s) {
                    return;
                }

                s.slides.each(function() {
                    s.removeSlide(this);
                });

                $slides.children("li").each(function() {
                    s.addSlide($jQ(this).clone());
                });

                $jQ(this).flexslider(0);
            });

            $jQ('#zoom-thumbs, #thumbs, #quick-view-overlay .slider-controls').each(function() {
                var s = $jQ(this).data("flexslider"),
                    first = null;

                if (!s) {
                    return;
                }

                s.slides.each(function() {
                    s.removeSlide(this);
                });

                $thumbs.children("li").each(function(i) {
                    var $e = $jQ(this).clone();

                    if (i == 0) {
                        $e.addClass("active flex-active-slide");
                    }

                    s.addSlide($e.click(function() {
                        $jQ('#focus , #zoom-focus, #quick-view-slider').each(function() {
                            var slider = $jQ(this).data('flexslider');
                            if (slider)
                            {
                                $jQ(this).flexslider($e.index());
                            }
                        });
                    }));
                });

                $jQ(this).flexslider(0);
            });

            $slides.remove();
            $slides = null;
            $thumbs.remove();
            $thumbs = null;
            return;
        }
    }
}


