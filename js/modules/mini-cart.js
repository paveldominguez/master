MLS.miniCart = {
    started : true, // set to false if an ajax call is needed on pageload to refresh the minicart

	callbacks : 
	{
		addItem: function(e) 
		{
			MLS.miniCart.addItem($jQ(e.target).parents("form").serialize());
        	return false;
        },

        removeItem: function(e) 
		{
            if ($jQ(this).hasClass("data-confirm-removal"))
            {
                MLS.miniCart.confirmItemRemoval($jQ(this));
            }
			else 
            {
                MLS.miniCart.removeItem($jQ(this).is("a") ? $jQ(this).attr("href").split("?")[1] : $jQ(e.target).parents("form").serialize());
            }

            return false;
        },

        updateItemSuccess : function (data) {
            if (data.hasOwnProperty('error') && data.error.responseHTML != "") {
	    	    // error, unable to add to cart
	            // display error response: .append(data.error.responseHTML);
	            return MLS.modal.open(data.error ? data.error.responseHTML : null);
	        }

            var $tabs = $jQ('#nav-cart, .mini-cart'),
                $form = $jQ('#minicart-form');

            $tabs.removeClass("empty").addClass(((MLS.miniCart.started && $jQ("#nav-cart").is(":visible"))? 'active' : '') + ((data.success.itemCount == 0) ? " empty" : ""));

            MLS.miniCart.started = true;

            // response needs to contain both elements and updated total
            $jQ("#nav-cart .count").html(data.success.itemCount);
            MLS.miniCart.init($form.hide().html(data.success.responseHTML));
            $form.find("input:submit").uniform();
            
            // initialize scroll buttons on the mini-cart
            if (data.success.itemCount > 0 && data.success.itemCount < 4 ) {
                $jQ('.minicart-next').hide();
            } else if (inMini > 3) {
                $jQ('.minicart-next').addClass('on');
            }

            if (MLS.miniCart.started && $jQ("#nav-cart").is(":visible"))
            {
                $form.fadeIn();
            }
	    },

        scrollPrevious: function(e){
            e.preventDefault();
            var type = "next";
            MLS.miniCart.callbacks.scroll(type);
        },

        scrollNext: function(e){
            e.preventDefault();
            var type = "prev";
            MLS.miniCart.callbacks.scroll(type);
        },

        scroll: function(type) { // MINICART  scroll minicart items .............................................................
            if (type == "next") { // if scroll up, calculate max scroll up
                var inMini = $jQ('#minicart-item-list').find('.minicart-item').length;
                var maxScrollTimes = inMini / 3;
                var maxScrollInt = parseInt(maxScrollTimes, 10);
                var maxScrollPos = maxScrollInt * -247;

                // get current position
                var curPos = $jQ('.minicart-item.one').attr('data-vpos');

                //calculate new offset before actually moving
                var newPos = curPos - 247;

                // check position, move and adjust options as required
                if (newPos > maxScrollPos) { // if beginning/middle
                    $jQ('.minicart-item').each(function(){ // move up
                        MLS.ui.vScroll(this, newPos);
                    });
                    $jQ('.prev-items-link').addClass('on'); //turn on prev
                    $jQ('.next-items-link').removeClass('off'); //turn on next if needed

                } else if (newPos == maxScrollPos) { // if end
                    $jQ('.minicart-item').each(function(){ // move up
                        MLS.ui.vScroll(this, newPos);
                    });
                    $jQ('.next-items-link').addClass('off'); //turn off next
                }

            } else { // if scroll down
                // get current position
                var curPos = $jQ('.minicart-item.one').attr('data-vpos');
                var curPosParse = parseInt(curPos, 10);

                //calculate new offset before actually moving
                var newPos = curPosParse + 247;

                // check position, move and adjust options as required
                if (newPos == 0) { // if beginning/middle
                    $jQ('.minicart-item').each(function(){ //move down
                        MLS.ui.vScroll(this, newPos);
                    });
                    $jQ('.prev-items-link').removeClass('on'); //turn off prev
                    $jQ('.next-items-link').removeClass('off'); //turn on next

                } else { // if end
                    $jQ('.minicart-item').each(function(){ //move down
                        MLS.ui.vScroll(this, newPos);
                    });
                    $jQ('.next-items-link').removeClass('off'); //turn on next
                }
            }
        },
	},

    options: {

    },

	init : function (d, opts) 
	{
        var $d = $jQ(d || document);

        this.options = $jQ.extend({
            getCartEndpoint: MLS.ajax.endpoints.GET_MINICART,
            addToCartEndpoint: MLS.ajax.endpoints.ADD_TO_MINICART,
            updateCartEndpoint: MLS.ajax.endpoints.UPDATE_CART,
            removeFromCartEndpoint: MLS.ajax.endpoints.REMOVE_FROM_MINICART,
            successCallback: MLS.miniCart.callbacks.updateItemSuccess
        }, opts);

		$d.find('.data-cart-add').bind('click', this.callbacks.addItem);
        $d.find('.data-cart-remove').bind('click', this.callbacks.removeItem);

        // free shipping modal
        $d.find('.minicart-banner.ship').find('.minicart-cta').click(function() {
            $jQ('#minicart-shipping-modal').show();
        });

        $jQ("#minicart-form input:submit").uniform();

        if ($jQ("#minicart-item-list").children("li").length == 0)
        {
            $tabs = $jQ('#nav-cart, .mini-cart').addClass("empty");
        }

        // next 3 items
        $d.find('.prev-items-link').click(this.callbacks.scrollPrevious);
        $d.find('.next-items-link').click(this.callbacks.scrollNext);

        !this.started && this.update();
    },

    // previously called 'minicartEdit'
    confirmItemRemoval : function($btn) {
        var $block = $btn.parents('.minicart-item'),
            $editBox = $btn.parents('.minicart-edit'),
            removeCallback = function() {
                MLS.miniCart.removeItem($jQ(this).attr("href").split("?")[1]);
            };

        $block.css('background-color' , '#d6d9d9');
        $editBox.css('width', '120px').find('.edit').html('<a href="#" class="minicart-cancel-remove">Cancel</a>');
        $jQ('<div class="remove-msg">Are you sure you want to remove this item?</div>').appendTo($block.find('.item-info-block'));
        $btn.addClass('yes-remove').click(removeCallback);

        $editBox.find('.minicart-cancel-remove').click(function(e) { // cancel remove
            e.preventDefault();
            $block.removeAttr("style").find('.remove-msg').remove();
            $editBox.css('width', '96px').find('.edit').html('<a href="' + $btn.attr("href") + '">Edit</a>');
            $btn.removeClass('.yes-remove').removeClass('yes-remove').unbind('click', removeCallback);

            // avoid memory leak
            removeCallback = $block = $editBox = null;
        });
    },

    finalize: function()
    {
    	$jQ('[data-cart-add]').unbind('click', this.callbacks.addItem);	
    	$jQ('[data-cart-remove]').unbind('click', this.callbacks.removeItem);	
        $jQ('.next-items-link').unbind('click', this.callbacks.scrollUp);
        $jQ('.prev-items-link').unbind('click', this.callbacks.scrollNext);
    },

    update : function (params) {
        MLS.ajax.sendRequest(
            this.options.getCartEndpoint,
            params,
            this.options.successCallback
        );
    },

    addItem : function (params) {
    	MLS.ajax.sendRequest(
            this.options.addToCartEndpoint,
            params,
            this.options.successCallback
        );
    },

    updateItem : function (params) {
    	MLS.ajax.sendRequest(
            this.options.updateCartEndpoint,
            params,
            this.options.successCallback
        );
    },

    removeItem : function (params) {
    	MLS.ajax.sendRequest(
            this.options.removeFromCartEndpoint,
            params,
            this.options.successCallback
        );
    }
};