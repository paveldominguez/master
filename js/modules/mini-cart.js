MLS.miniCart = {
	callbacks : 
	{
		addItem: function(e) 
		{
			MLS.miniCart.addItem($jQ(this).data("cart-add"), e.form ? $jQ(e.form).find("[name=size-select]").val() : null, e.form ? $jQ(e.form).find("[name=color-select]").val() : null);
        	return false;
        },

        removeItem: function(e) 
		{
			MLS.miniCart.removeItem($jQ(this).data("cart-remove"));
        	return false;
        },

        updateItemSuccess : function (data) {
	    	if (data.hasOwnProperty('error') && data.error.responseHTML != "") {
	    	    // error, unable to add to cart
	            // display error response: .append(data.error.responseHTML);
	            return MLS.modal.open(data.error ? data.error.responseHTML : null);
	        }

            $jQ('#nav-cart, #nav-tab4').removeClass("empty").addClass('active' + ((data.success.itemCount == 0) ? " empty" : ""));

            // response needs to contain both elements and updated total
            MLS.miniCart.init($jQ('#minicart-form').html(data.success.responseHTML));
	    }
	},

	init : function (d) 
	{
		var $d = $jQ(d || document);

		$d.find('[data-cart-add]').bind('click', this.callbacks.addItem);
        $d.find('[data-cart-remove]').bind('click', this.callbacks.removeItem);
    },

    finalize: function()
    {
    	$jQ('[data-cart-add]').unbind('click', this.callbacks.addItem);	
    	$jQ('[data-cart-remove]').bind('click', this.callbacks.removeItem);	
    },

    update: function() {
		MLS.ajax.sendRequest(
            MLS.ajax.endpoints.GET_CART,
            
            {
            },

            MLS.miniCart.updateItemSuccess
        );
    },

    addItem : function (id, size, color) {
    	MLS.ajax.sendRequest(
            MLS.ajax.endpoints.ADD_TO_CART,
            
            {
            	id: id,
            	size: size,
            	color: color,
            	qty: 1,
            	action: "add"
            },

            this.callbacks.updateItemSuccess
        );
    },

    updateItem : function (id, qty) {
    	MLS.ajax.sendRequest(
            MLS.ajax.endpoints.ADD_TO_CART,
            
            {
            	id: id,
            	qty: qty,
            	action: "udpate"
            },

            this.callbacks.updateItemSuccess
        );
    },

    removeItem : function (id) {
    	MLS.ajax.sendRequest(
            MLS.ajax.endpoints.ADD_TO_CART,
            
            {
            	id: id,
            	action: "remove"
            },

            this.callbacks.updateItemSuccess
        );
    }
};