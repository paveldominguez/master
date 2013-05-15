MLS.cart = {
    initCartDetails: function() {
        $jQ("#cart-data").find("input:submit, input:checkbox, select.checkout-input, select.cart-revise-qty,  .cart-item-qty, .checkout-final, .next-step-input").uniform(); // style form elements

        $jQ('#cart-data .checkout-dropdown').each(function(){ // display rules for inline dropdowns
            MLS.ui.dropdownDisplay(this);
        });

        $jQ('#cart-data .special-offer-block').each(function(){ // display rules for offer dropdowns
            MLS.ui.dropdownDisplay(this);
        });

        // items table : update qty message
        $jQ('#cart-data .cart-revise-qty').change(function() {
            MLS.miniCart.updateItem(
                $jQ(this).data("cart-id"), // id
                null, // size (null = do not change)
                null, // color (null = do not change)
                $jQ(this).val()
            );
        });

        // items table : remove item button
        $jQ('#cart-data .remove a').click(function(e) {
            e.preventDefault();
            $jQ(this).parents('.remove').next('.confirm-remove').fadeIn(300);
        });

        // items table : confirm remove panel
        $jQ('#cart-data .cart-remove-links').find('.cancel').click(function(e) { // panel : cancel
            e.preventDefault();
            $jQ(this).parents('.confirm-remove').fadeOut(300);
        });

        // sidebar : banner dropdowns
        $jQ('#cart-data .cart-sidebar').find('.special-offer-block').each(function() {
            MLS.ui.dropdownDisplay(this);
        });
    },

    init : function() {
        $jQ(".mini-cart").bind("cart-updated cart-item-updated cart-item-removed", MLS.cart.update);

        // ONLOAD ...............................................................................
        var pgWidth = document.body.clientWidth; // get page width

        // CART only
        MLS.cart.saveCartValidation();

        this.initCartDetails();
        //  ........................................................................END ONLOAD

        // CART EVENTS ...........................................................................
        // header : save cart link
        $jQ('.save-cart-link').click(function(){
            MLS.ui.lightbox(this);
        });

        // save cart modal : successful submit action
        $jQ('#save-cart-submit').click(function(e) {
            if ($jQ('#save-cart-form').valid()) {
                $jQ(this).parents('.modal-info-block').find('h3').html('Cart Saved!').next().html('Please check your email');
                $jQ(this).parents('.modal-info-block').find('#save-cart-form').remove();
            };
        }); // end save cart submit actions
        // .................................................................... END CART EVENTS
    },

    saveCartValidation : function() { // CART validate save cart email form...................................................
        $jQ('#save-cart-form').validate({
            rules: {
                saveCartEmail: {
                required: true,
                noPlaceholder: true,
                email: true
                }
            },
            messages: {
                saveCartEmail: {
                    required: 'Please enter your email to save your cart',
                    noPlaceholder: 'Please enter a valid email',
                    email: 'Please enter a valid email'
                }
            }
        });
    },

    update: function(evt, r) {
        $jQ("#cart-header-summary").html(r.success ? r.success.itemCount : "0");

        MLS.ajax.sendRequest(
            MLS.ajax.endpoints.GET_CART,
            
            {
            },

            function(r) {
                if (r.hasOwnProperty('error') && r.error.responseHTML != "") {
                    // error, unable to add to cart
                    // display error response: .append(data.error.responseHTML);
                    return MLS.modal.open(r.error ? r.error.responseHTML : null);
                }

                $jQ("#cart-data").html(r.success.responseHTML);
                $jQ("#cart-data").find('.update-msg:visible').fadeOut(1000);
                MLS.cart.initCartDetails();
                MLS.miniCart.init("#cart-data"); // initialize remove buttons
            }
        );
    }

}; // end cartCheckout




