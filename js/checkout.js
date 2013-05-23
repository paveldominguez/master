MLS.checkout = {
    options: { // minicart options
        disableFlyout: true
    },

    updateShippingOptions: function(zipcode) {
        MLS.ajax.sendRequest(
            MLS.ajax.endpoints.CHECKOUT_SHIPPING_OPTIONS,

            {
                zipcode: zipcode
            },

            function(r) {
                if (r.hasOwnProperty('error') && r.error.responseHTML != "") {
                    return MLS.modal.open(r.error ? r.error.responseHTML : null);
                }

                $jQ(".shipping-option-radios").html(r.success.responseHTML).find("input[name=shipRadio]").click(MLS.checkout.selectShippingOption);

                $jQ('.shipping-option-radios .checkout-dropdown').each(function(){
                    MLS.ui.dropdownDisplay(this);
                });
            }
        );
    },

    /* disabled: requirement on hold
    selectShippingOption: function() {
        MLS.ajax.sendRequest(
            MLS.ajax.endpoints.CHECKOUT_SELECT_SHIPPING,

            {
                shipping: $jQ(".shipping-option-radios input[name=shipRadio]:checked").val()
            },

            function(r) {
                if (r.hasOwnProperty('error') && r.error.responseHTML != "") {
                    return MLS.modal.open(r.error ? r.error.responseHTML : null);
                }

                MLS.checkout.update(r);
            }
        );
    },
    */

    // EDIT VALIDATED INFO BUTTON (after next-step click)
    editStepCallback: function(e)
    {
        var thisStep = $jQ(this).parents('.checkout-step');
        thisStep.siblings('.checkout-step').find('.hide-complete').each(function() { // close open input & open its summary
            $jQ(this).not('hidden').addClass('hidden').siblings('.step-info-summary').not('.blank').removeClass('hidden');
        });
        $jQ(this).parents('.step-info-summary').addClass('hidden'); // close this panel's summary next

        // if step 2
        if ($jQ(this).hasClass('edit-billing')) {
            $jQ('.new-billing-info-form, .billing-detail-content.details-card').find('.checkout-input').removeClass('not'); // make fields validate-able again

            $jQ('.new-billing-info-form').addClass('hidden'); // hide form so edit button in summary works

            $jQ('.sidebar-finish').removeClass('on'); // reverse side bar changes
            $jQ('.checkout-accordion.sidebar').find('.acc-info').css('display', 'none');

            if ($jQ('#bill-to-account').is(':checked')){ // IF account hide billing summary for pay with account
                $jQ(this).parents('.checkout-step').find('.step-info-summary.billing-address').addClass('hidden');
            }
        }
        // show this panel's inputs & buttons
        thisStep.find('.hide-complete').removeClass('hidden');
        // last, scroll page to top of re-opened section
        MLS.ui.scrollPgTo (thisStep, 7);
    },

    initEditStep: function() {
        $jQ('.edit-checkout-step').not('#saved-info-edit').unbind("click", this.editStepCallback).click(this.editStepCallback);
    },

    init : function() {
        // don't trigger the first minicart update
        MLS.miniCart.started = true;

        /* disabled: featured removed from batch 3
        $jQ('select[name=final-qty]').change(function() {
            MLS.miniCart.updateItem(
                $jQ(this).data("cart-id"), // id
                null, // size (null = do not change)
                null, // color (null = do not change)
                $jQ(this).val()
            );
        });
        */

        // ONLOAD ...............................................................................
        var pgWidth = document.body.clientWidth; // get page width

        // COMMON (cart, minicart & checkout)
        MLS.checkout.vzwValidationRules(); // add methods to all validations
        $jQ("input:submit, input:checkbox, select.checkout-input, select.cart-revise-qty,  .cart-item-qty, .checkout-final, .next-step-input").uniform(); // style form elements

        $jQ('.checkout-dropdown').each(function(){ // display rules for inline dropdowns
            MLS.ui.dropdownDisplay(this);
        });

        $jQ('.special-offer-block').each(function(){ // display rules for offer dropdowns
            MLS.ui.dropdownDisplay(this);
        });

        // CHECKOUT only
        // MLS.checkout.beginCheckoutValidation();
        MLS.checkout.mainCheckoutValidation();

        // MLS.checkout.checkoutSidebarScroll(pgWidth); // set scrolling
        MLS.checkout.smallScreenContent(); // prepare small device content
        $jQ('#checkout-sequence .selector').find('span').addClass('select-placeholder');    // enhance initial uniform.js select style
        $jQ('#checkout-sequence .selector').find('select').change(function(){               // enhance uniform.js select performance
            $jQ(this).parents('.selector').find('span').removeClass('select-placeholder');
            $jQ(this).parents('.selector').removeClass('error-style');
            $jQ(this).parents('.selector').find('.select-error-message').remove();
        });
    //  ........................................................................END ONLOAD



    // ON RESIZE ......................................................................................

        // CHECKOUT
        /*
        $jQ(window).resize(function(){
            var resizePgWidth = document.body.clientWidth;
            MLS.checkout.checkoutSidebarScroll(resizePgWidth);
        });
        */

    // .........................................................................END RESIZE

    // CHECKOUT SIGN IN
    //    MLS.checkout.beginCheckoutEvents(); // signin page



    // CHECKOUT EVENTS ........................................................................
        /* disabled: requirement on hold
        $jQ("#checkout-ship-zip").keyup(function(e) {
            if ($jQ(this).val().length == 5)
            {
                // assume valid zipcode
                MLS.checkout.updateShippingOptions($jQ(this).val());
            }
        });
        */

        // checkout sidebar special offer
        $jQ('#checkout-sidebar').find('.special-offer-block').each(function(){
            MLS.ui.dropdownDisplay(this);
        });

        // checkout accordions
        $jQ('.checkout-accordion .acc-control').click(function() {
            if ($jQ(this).parents('.checkout-accordion').hasClass("disabled"))
            {
                return false;
            }
            MLS.ui.simpleAcc(this);
        });

        $jQ('#checkout-where-to-ship').change(function(){ // main checkout sequence : step 1, home/business select
            $jQ(this).parents('.step-info-block').find('#destination').children().each(function(){
                if ( $jQ(this).hasClass('not') ) {
                    $jQ(this).removeClass('not');
                    $jQ(this).find('.checkout-input').removeClass('not');
                } else {
                    $jQ(this).addClass('not');
                    $jQ(this).find('.checkout-input').addClass('not');
                }
            })
        });

        MLS.checkout.stepTwoSequence(); // card & billing decisions

        MLS.checkout.giftCardSequence();   // discount code & giftcards

        MLS.checkout.nextStepSequence(); // next step button for steps 1 & 2

        MLS.checkout.initEditStep(); // 'edit step' button after a step has been completed

        // if BTA is selected, disable gift card
        MLS.checkout.initGiftCard();
    //............................................................................... END CHECKOUT EVENTS

    }, // end init

    appliedGiftCards: 0,

    disabledCallback: function(e)
    {
        e.preventDefault();
        $jQ(e.target).blur();
        return false;
    },

    initGiftCard: function() {
        var $form = $jQ("#vzn-checkout-gift"),
            $billing = $jQ("#vzn-checkout-billing"),
            $bta = $jQ("#bill-to-account"),
            $cc = $jQ("#pay-with-card");
        
        if ($bta.is(":checked"))
        {
            $form.addClass("disabled");
        } else {
            $form.removeClass("disabled");
        }

        $form.find(".open").click(function() {
            return !$form.hasClass("disabled");
        });

        $billing.find(".bill-account").click(function(e) {
            var $self = $jQ(this);

            if ($self.hasClass("disabled"))
            {
                return false;
            }

            setTimeout(function() {
                if (!$self.hasClass(".checked"))
                {
                    $form.addClass("disabled");
                } else {
                    $form.removeClass("disabled");
                }
            }, 100);

            return false;
        });

        $billing.find(".bill-card").click(function(e) {
            var $self = $jQ(this);
            setTimeout(function() {
                if (!$self.hasClass(".checked"))
                {
                    $form.removeClass("disabled");
                } else {
                    $form.addClass("disabled");
                }
            }, 100);
        });
    },  

    checkBTATabs: function() {
        var $billing = $jQ("#vzn-checkout-billing");

        if (MLS.checkout.appliedGiftCards <= 0)
        {
            // enable tab
            $billing.find(".bill-account").removeClass("disabled");
        } else {
            // disable tab
            $billing.find(".bill-account").addClass("disabled");
        }
    },

    vzwValidationRules : function() { // ALL VALIDATION add these methods.................... BEGIN FUNCTIONS ...................
        jQuery.validator.addMethod("phoneUS", function(phone_number, element) { // phone number format
            phone_number = phone_number.replace(/\s+/g, "");
            return this.optional(element) || phone_number.length > 9 && phone_number.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/);
        }, "Please specify a valid phone number");

		jQuery.validator.addMethod("zipcodeUS", function(value, element) {
			return this.optional(element) || /^\d{5}-\d{4}$|^\d{5}$/.test(value);
		}, "Please enter a valid zip code");
		
		jQuery.validator.addMethod("alphanumeric", function(value, element) {
			return this.optional(element) || /^([a-zA-Z0-9]+)$/.test(value);
		}, "Please enter a valid card number");

        jQuery.validator.addMethod("noPlaceholder", function (value, element) { // don't validate placeholder text
            if (value == $jQ(element).attr('placeholder')) {
                return false;
            } else {
                return true;
            }
        });

        jQuery.validator.addMethod("ccRecognize", function (value, element) { // improved credit card recognition
            relValue = value.substring(0,2);
            if (relValue >= 40 && relValue <= 49 ) { // visa
                return true;
            } else if (relValue == 34 || relValue == 37) { // amex
                return true;
            } else if (relValue >= 50 && relValue <=55 ) { // mc
                return true;
            } else if (relValue == 65 ) { // discover
                return true;
            } else {
                return false;
            }
        });
    },

    update: function(r) {
        $jQ(".checkout-cart-summary").html("").html(r.success.summaryHTML);
        $jQ(".final-cart-table").html("").html(r.success.finalCartHTML);

        /* feature removed
        $jQ(".final-cart-table").find('select[name=final-qty]').change(function() {
            MLS.miniCart.updateItem(
                $jQ(this).data("cart-id"), // id
                null, // size (null = do not change)
                null, // color (null = do not change)
                $jQ(this).val()
            );
        }).uniform();
        */

        $jQ(".final-cart-table select[name=final-qty]").uniform();

        $jQ(".final-cart-table .checkout-final").click(function(e) {
            this.form.action = MLS.ajax.endpoints.CHECKOUT_STEP_3;
            return true;
        }).uniform();

        // checkout accordions
        $jQ('.checkout-cart-summary .checkout-accordion .acc-control').click(function() {
            MLS.ui.simpleAcc(this);
        });
    },

    /* THIS PIECE SHOULD GO TO THE SIGNIN PAGE
    beginCheckoutEvents : function() { // for signin/guest cover page events ..................................................
        $jQ('#checkout-sign-in').click(function(e) { // begin checkout : signin button
            e.preventDefault();
            var form = $jQ(this).parents('form');
            $jQ(form).validate();
            if (form.valid()) {
                alert('Welcome, signed-in guest!');
                return false;
            }
        });

        $jQ('.create-login-checkbox').change(function() { // begin checkout : create vzn login checkbox
            $jQ('.create-login-message').slideToggle(300);
        });
    },
    */

    /*
    checkoutSidebarScroll : function(pgWidth) { // CHECKOUT floating sidebar ..................................................
        if (pgWidth > 959){
            $jQ(window).scroll(function(){
                if($jQ('#checkout').hasClass('visible')) {
                    var scrollPos = $jQ(this).scrollTop();
                    var sidebar = $jQ('.visible #checkout-sidebar')
                    var startTop = sidebar.attr('data-start-top');

                    if ( scrollPos >= startTop ) {
                        sidebar.addClass('fixed');
                    } else {
                        sidebar.removeClass('fixed');
                    } // end 'if position'
                } // end 'if visible '
            });
        } // end 'if desktop'
    },
    */

    smallScreenContent : function() { // CHECKOUT copy to mobile-only fields ....................................................
        // top
        $jQ('#checkout .checkout-accordion.sidebar').clone().appendTo('#mobile-checkout-summary');
        $jQ('#mobile-checkout-summary .checkout-accordion.sidebar .item-color').each(function(){
            var newDiv = $jQ(this).next('.item-size');
            $jQ(this).appendTo(newDiv);
        });

        // bottom
        $jQ('#checkout .special-offer-block').clone().appendTo('#mobile-checkout-offers');
        $jQ('#checkout .sidebar-finish').clone().appendTo('#mobile-checkout-place-cta');
        $jQ('#checkout .totals').clone().appendTo('#mobile-checkout-totals');
        $jQ('#checkout .checkout-disclaimers').clone().appendTo('#mobile-checkout-disclaimers');
    },

    stepTwoSequence : function() { // CHECKOUT card & billing choices...............................................................
        $jQ('.billing-option', '#billing-info').on('click', function() {
            if ($jQ(this).hasClass("disabled"))
            {
                return false;
            }

            var $context = $jQ(this),
            $billingOpts = $context.siblings(),
            $billingOptsInfo = $jQ('.billing-detail-content', '#billing-info .billing-info-block');

            $billingOpts.removeClass('checked').find('span').removeClass('checked');
            $context.addClass('checked').find('span').addClass('checked');

            $billingOptsInfo.hide();
            $jQ($billingOptsInfo[$context.index()]).show();
        });

        $jQ('input[name=cardChoice]').change(function(){ //signed-in new card or saved card
            $jQ(this).siblings('.card-choice-detail-block').removeClass('hidden').parent().siblings('.form-input-wrap').find('.card-choice-detail-block').addClass('hidden'); // handle detail block under button

            if ($jQ(this).parent().hasClass('new-card')) {
                // new card, show form, hide summary
                $jQ(".step-info-summary.billing-address").addClass("hidden").hide();
                $jQ('.billing-address.new-billing-info-form').removeClass('hidden').show();
            } else {
                // old card, hide form, show summary
                $jQ(".step-info-summary.billing-address").removeClass('hidden').show();
                $jQ('.billing-address.new-billing-info-form').addClass('hidden').hide();
            }



            /*
            if ($jQ(this).parent().hasClass('new-card')) { // handle edit button visibility
                $jQ('.edit-saved-card').addClass('hidden');
            } else {
                $jQ('.edit-saved-card').removeClass('hidden');
            }
            $jQ('.billing-address').each(function(){ // handle saved billing/new billing form below
                $jQ(this).toggleClass('hidden');
            });
            */
        });

        $jQ('.edit-saved-card').click(function(){ // signed-in edit saved card information
            // saved card off
            $jQ('.saved-card').find('.checkout-radio-input').prop('checked', false).siblings('.card-choice-detail-block').addClass('hidden');
            // new card on
            $jQ('.new-card').find('.checkout-radio-input').prop('checked', true).siblings('.card-choice-detail-block').removeClass('hidden');
            // edit button off
            $jQ(this).addClass('hidden');

            // handle saved billing/new billing form below
            $jQ('.billing-address').each(function(){
                $jQ(this).toggleClass('hidden');
            });
        });

        $jQ('#same-as-shipping').change(function() { // billing info same as shipping
            if($jQ(this).hasClass('check')){
                $jQ(this).removeClass('check');
                $jQ('#shipping-info').find('.SaS').each(function(shipI){
                    var shipValue = $jQ(this).val();
                    $jQ('.billing-address-block').find('.SaS').each(function(billI){ // paste stuff
                        if ( shipI == billI ) { //paste it
                            $jQ(this).val(shipValue).addClass('valid');
                            $jQ.uniform.update(this);
                            return false;
                        }
                    });
                });
            } else { // clear all fields
                $jQ('.billing-address-block').find('.SaS').each(function(){
                    $jQ(this).val('').removeClass('valid');
                });
                $jQ(this).addClass('check');
            }
        });


        // main checkout sequence : step 2, edit saved billing information information
        $jQ('#saved-info-edit').click(function(){
            $jQ(this).parents('.billing-address').slideToggle(300).next('.billing-address').slideToggle(300);

            if (!$jQ("#same-as-shipping").is("checked"))
            {
                $jQ("#same-as-shipping").click();
            }
        });


        // main checkout sequence : step 2, new card info : card icon recognition
        $jQ('#card-number, #card-number-gc').on('keyup', function() {
            if(this.value.length === 2) {
                var number = this.value;
                var cardListItem = 0;
                if (number >= 40 && number <= 49 ) {
                    cardListItem = 'visa';
                } else if (number == 34 || number == 37) {
                     cardListItem='amex';
                } else if ( number >= 50 && number <=55 ) {
                    cardListItem='mastercard';
                } else if ( number == 65 ) {
                    cardListItem='discover';
                }
                $jQ(this).parents('.form-input-wrap').next().find('.' + cardListItem).addClass('entered').siblings().removeClass('entered');
                $jQ('.bill-summary-card').find('.card-image').addClass(cardListItem);
            } else if(this.value == "" || this.value.length === 1) {
                $jQ(this).parents('.form-input-wrap').next().find('li').removeClass('entered');
            }
        });
    },

    giftCardSequence : function() { // main checkout sequence : step 2 .............................................................
        // toggle the message & form
        $jQ('#begin-gift-card').click(function(e){ //grab CC info (if present) and copy to GC form
            if ($jQ("#vzn-checkout-gift").hasClass("disabled"))
            {
                return false;
            }

            var ecValid = true;
            $jQ('#enter-card-info').find('.selector').each(function(){ // validate main cc selects first
                var selectsValid = MLS.checkout.validateSelect(this);
                if(selectsValid == false) {
                    ecValid = false;
                }
            });

            $jQ('#vzn-checkout-billing').validate(); // validate the rest
        });

        $jQ('.checkout-discount-block .add-gift-card, .checkout-discount-block .add-discount-code').click(function(){  // add another gift card 
            if ($jQ("#vzn-checkout-gift").hasClass("disabled"))
            {
                return false;
            }

            $jQ(this).toggleClass('close'); 
            $jQ(this).parents("form").next('form').slideToggle(300); 
        });

        $jQ("#vzn-checkout-code form").each(function() {
            var $form = $jQ(this);
            $form.find("input[type=submit]").click(function(e) {
                var $self = $jQ(this);
                e.preventDefault();
                $form.validate();

                $self.valid() &&
                MLS.ajax.sendRequest(
                    MLS.ajax.endpoints.CHECKOUT_APPLY_DISCOUNT,
                    $form.serialize(),
                    function(r) {
                        if (r.hasOwnProperty('error') && r.error.responseHTML != "") {
                            return MLS.modal.open(r.error ? r.error.responseHTML : null);
                        }

                        $form.find(".discount-success div:eq(0)").html(r.success.responseHTML).parent().slideToggle(300).find("a.discount-remove").click(function(ev) {
                            var $remove = $jQ(this);
                            ev.preventDefault();

                            MLS.ajax.sendRequest(
                                MLS.ajax.endpoints.CHECKOUT_APPLY_DISCOUNT,
                                $remove.attr("href").split("#")[0].split("?")[1],
                                function(r) {
                                    $form.find("input.valid").removeClass('valid').addClass('hasPlaceholder');
                                    $remove.parents('.discount-success').prev('.discount-input').slideToggle(300);
                                    $remove.parents('.discount-success').slideToggle();
                                    MLS.checkout.update(r); // update totals
                                }
                            );

                            return false;
                        });

                        $self.parents('.discount-input').slideToggle(300);
                        // $self.parents('.discount-input').next('.discount-success').slideToggle(300);

                        MLS.checkout.update(r); // update totals
                    }
                );

                return false;
            });
        });

        $jQ("#vzn-checkout-gift form").each(function() {
            var $form = $jQ(this);

            $form.find('input[type=submit]').click(function(e){ // apply & validate gift card 1
                e.preventDefault();
                if ($jQ("#vzn-checkout-gift").hasClass("disabled"))
                {
                    return false;
                }

                var gcValid = true,
                    $self = $jQ(this); // staying optimistic

                $self.parents('.checkout-discount-block').find('.selector').each(function(){ // validate selects first
                    var selectsValid = MLS.checkout.validateSelect(this);
                    if(selectsValid == false) {
                        gcValid = false;
                    }
                });

                $form.validate(); // validate form
                if ($form.find('input[type=text]').valid() && gcValid == true ) {
                    MLS.ajax.sendRequest(
                        MLS.ajax.endpoints.CHECKOUT_APPLY_GIFTCARD,
                        $form.serialize(),
                        function(r) {
                            if (r.hasOwnProperty('error') && r.error.responseHTML != "") {
                                return MLS.modal.open(r.error ? r.error.responseHTML : null);
                            }

                            MLS.checkout.appliedGiftCards++; // increase applied discounts
                            MLS.checkout.checkBTATabs();

                            $form.find(".discount-success div:eq(0)").html(r.success.responseHTML).parent().slideToggle(300).find("a.discount-remove").click(function(ev) {
                                // re-initialize remove buttons
                                var $remove = $jQ(this);
                                e.preventDefault();
                                if ($form.hasClass("disabled"))
                                {
                                    return false;
                                }

                                MLS.ajax.sendRequest(
                                    MLS.ajax.endpoints.CHECKOUT_APPLY_GIFTCARD,
                                    $remove.attr("href").split("#")[0].split("?")[1],
                                    function(r) {
                                        if (r.hasOwnProperty('error') && r.error.responseHTML != "") {
                                            return MLS.modal.open(r.error ? r.error.responseHTML : null);
                                        }

                                        MLS.checkout.appliedGiftCards--; // decrease applied discounts
                                        MLS.checkout.checkBTATabs();

                                        $form.find("input.valid").removeClass('valid').addClass('hasPlaceholder');
                                        
                                        // $jQ('.gift-card-cc-block').slideToggle(300); // what is this one?
                                        $remove.parents('.discount-success').prev('.discount-input').slideToggle();
                                        $remove.parents('.discount-success').slideToggle();

                                        MLS.checkout.update(r); // update totals
                                    }
                                );

                                return false;
                            });

                            // $jQ('.gift-card-cc-block').slideToggle(300); // what's this one?
                            $self.parents('.discount-input').slideToggle();
                            // $self.parents('.discount-input').next('.discount-success').slideToggle();

                            MLS.checkout.update(r); // update totals
                        }
                    );
                }

                return false;
            });
        });

        /*
        $jQ('#apply-discount-code').click(function(e){ //  apply & validate discount code
            var $self = $jQ(this);
            e.preventDefault();
            $jQ('#vzn-checkout-code').validate();

            if ($jQ('#discount-code-input').valid() == true) {
                MLS.ajax.sendRequest(
                    MLS.ajax.endpoints.CHECKOUT_APPLY_DISCOUNT,
                    $jQ(this).parents("form").serialize(),
                    function(r) {
                        if (r.hasOwnProperty('error') && r.error.responseHTML != "") {
                            // error, unable to add to cart
                            // display error response: .append(data.error.responseHTML);
                            return MLS.modal.open(r.error ? r.error.responseHTML : null);
                        }

                        $jQ('#checkout-cart-discount-code').html(r.success.responseHTML).slideToggle(300); //removeClass('na');
                        $self.parents('.discount-input').slideToggle(300);
                        $self.parents('.discount-input').next('.discount-success').slideToggle(300);

                        MLS.checkout.update(r); // update totals
                    }
                );
            }

            return false;
        });

        // once activated, we need to enable the remove button
        $jQ('#remove-discount-code').click(function(e){ // remove discount code
            var $self = $jQ(this);
            e.preventDefault();

            MLS.ajax.sendRequest(
                MLS.ajax.endpoints.CHECKOUT_APPLY_DISCOUNT,
                $jQ(this).parents("form").serialize(),
                function(r) {
                    $jQ('#discount-code-input').removeClass('valid').addClass('hasPlaceholder');
                    $jQ('#checkout-cart-discount-code').slideToggle(300);
                    $self.parents('.discount-success').prev('.discount-input').slideToggle(300);
                    $self.parents('.discount-success').slideToggle();
                    MLS.checkout.update(r); // update totals
                }
            );

            return false;
        });

        $jQ('#begin-gift-card').click(function(e){ //grab CC info (if present) and copy to GC form
            var ecValid = true;
            $jQ('#enter-card-info').find('.selector').each(function(){ // validate main cc selects first
                var selectsValid = MLS.checkout.validateSelect(this);
                if(selectsValid == false) {
                    ecValid = false;
                }
            });
            $jQ('#vzn-checkout-billing').validate(); // validate the rest
        });

        $jQ('#apply-gift-card-1').click(function(e){ // apply & validate gift card 1
            e.preventDefault();
            if ($jQ(this).parents("form").hasClass("disabled"))
            {
                return false;
            }

            var gcValid = true,
                $self = $jQ(this); // staying optimistic

            $jQ(this).parents('.checkout-discount-block').find('.selector').each(function(){ // validate selects first
                var selectsValid = MLS.checkout.validateSelect(this);
                if(selectsValid == false) {
                    gcValid = false;
                }
            });

            $jQ('#vzn-checkout-gift').validate(); // validate the rest
            if ($jQ('.GCV').valid() && gcValid == true ) {
                MLS.ajax.sendRequest(
                    MLS.ajax.endpoints.CHECKOUT_APPLY_GIFTCARD,
                    $jQ(this).parents("form").serialize(),
                    function(r) {
                        if (r.hasOwnProperty('error') && r.error.responseHTML != "") {
                            return MLS.modal.open(r.error ? r.error.responseHTML : null);
                        }

                        MLS.checkout.appliedGiftCards++; // increase applied discounts
                        MLS.checkout.checkBTATabs();

                        $jQ('#checkout-cart-gift-card-1').html(r.success.responseHTML).slideToggle(300); // hide & show
                        $jQ('.gift-card-cc-block').slideToggle(300);
                        $self.parents('.discount-input').slideToggle();
                        $self.parents('.discount-input').next('.discount-success').slideToggle();

                        MLS.checkout.update(r); // update totals
                    }
                );
            }

            return false;
        });

        $jQ('#remove-gift-card-1').click(function(e){ // remove gift card 1
            var $self = $jQ(this);
            e.preventDefault();
            if ($jQ(this).parents("form").hasClass("disabled"))
            {
                return false;
            }

            MLS.ajax.sendRequest(
                MLS.ajax.endpoints.CHECKOUT_APPLY_GIFTCARD,
                $jQ(this).parents("form").serialize(),
                function(r) {
                    if (r.hasOwnProperty('error') && r.error.responseHTML != "") {
                        return MLS.modal.open(r.error ? r.error.responseHTML : null);
                    }

                    MLS.checkout.appliedGiftCards--; // decrease applied discounts
                    MLS.checkout.checkBTATabs();

                    $jQ('#checkout-cart-gift-card-1').removeClass('valid').addClass('hasPlaceholder');
                    $jQ('#checkout-cart-gift-card-1').slideToggle(300);
                    $jQ('.gift-card-cc-block').slideToggle(300);
                    $self.parent('.discount-success').prev('.discount-input').slideToggle();
                    $self.parent('.discount-success').slideToggle();

                    MLS.checkout.update(r); // update totals
                }
            );

            return false;
        });

        $jQ('#add-gift-card-2').click(function(){  // add another gift card 
            if ($jQ(this).parents("form").hasClass("disabled"))
            {
                return false;
            }

			$jQ(this).toggleClass('close'); 
			$jQ(this).parent().parent().next('.acc-info').slideToggle(300); 
		});

        $jQ('#apply-gift-card-2').click(function(e){ // apply & validate gift card 2
            var $self = $jQ(this);
            if ($jQ(this).parents("form").hasClass("disabled"))
            {
                return false;
            }

            e.preventDefault();
            $jQ('#vzn-checkout-gift').validate();
            if ($jQ('#gift-card-2-input').valid() == true && $jQ('#gift-card-2-pin').valid() == true){
                MLS.ajax.sendRequest(
                    MLS.ajax.endpoints.CHECKOUT_APPLY_GIFTCARD,
                    $jQ(this).parents("form").serialize(),
                    function(r) {
                        if (r.hasOwnProperty('error') && r.error.responseHTML != "") {
                            return MLS.modal.open(r.error ? r.error.responseHTML : null);
                        }

                        MLS.checkout.appliedGiftCards++; // increase applied discounts
                        MLS.checkout.checkBTATabs();

                        $jQ('#checkout-cart-gift-card-2').html(r.success.responseHTML).slideToggle(300);
                        $self.parents('.discount-input').slideToggle();
                        $self.parents('.discount-input').next('.discount-success').slideToggle();

                        MLS.checkout.update(r); // update totals
                    }
                );
            }

            return false;
        });

        $jQ('#remove-gift-card-2').click(function(e){  // remove gift card 2
            var $self = $jQ(this);
            e.preventDefault();
            if ($jQ(this).parents("form").hasClass("disabled"))
            {
                return false;
            }

            MLS.ajax.sendRequest(
                MLS.ajax.endpoints.CHECKOUT_APPLY_GIFTCARD,
                $jQ(this).parents("form").serialize(),
                function(r) {
                    if (r.hasOwnProperty('error') && r.error.responseHTML != "") {
                        return MLS.modal.open(r.error ? r.error.responseHTML : null);
                    }

                    MLS.checkout.appliedGiftCards--; // decrease applied discounts
                    MLS.checkout.checkBTATabs();

                    $jQ('#checkout-cart-gift-card-2').removeClass('valid').addClass('hasPlaceholder');
                    $jQ('#checkout-cart-gift-card-2').slideToggle(300);
                    $self.parent('.discount-success').prev('.discount-input').slideToggle();
                    $self.parent('.discount-success').slideToggle();

                    MLS.checkout.update(r); // update totals
                }
            );

            return false;
        });
        */
    },

    validateSelect : function(selector, ignored) { // CHECKOUT  validation/error messages for custom selects created with uniform.js
        var thisSelect = $jQ(selector).find('select');
        if (ignored == undefined) {
            var ignoredClass = 0;
        } else {
            var ignoredClass = ignored;
        }

        if ($jQ(thisSelect).hasClass(ignoredClass)){
            var selectsValid = true; // we're not validating it
        } else { // we are
            var thisValue = $jQ(selector).find(':selected').val();
            var selectsValid = true; // because we're optimists

            if (thisValue == 0) {
                $jQ(selector).addClass('select-box-error');
                if ($jQ(thisSelect).hasClass('error')) { //don't add multiple messages
                } else {
                    $jQ('<div class="select-error-message error">Please click to select </div>').appendTo(selector);
                }
                $jQ(thisSelect).addClass('error');
                selectsValid = false;
            } else { // remove any error states & messages & proceed
                $jQ(selector).removeClass('select-box-error');
                $jQ(selector).find('.select-error-message').remove();
                $jQ(thisSelect).removeClass('error');
            }
        }
        return selectsValid;
    },

    /* HOOK THE AJAX CALLS IN HERE */
    nextStepSequence : function(){ // CHECKOUT  next step event .................................................................
        $jQ('.next-step-input').click(function(e) {
            e.preventDefault();
            $jQ(this).parents('.checkout-step').find('label.error').each(function(){
                $jQ(this).hide().removeClass('success'); // reset all error & success messages on next step click
            });

            var which = $jQ(this).attr('id'),
                valid = true,
                $form = "";

            if (which == 'ship-info-complete') { // STEP 1 prevalidate
                var radios = $jQ(this).parents('.next-step-button-box').siblings('.step-info-block').find('.checkout-radio-input'); // validate step 1 radio buttons
                var radioValid = false;
                var i = 0;

                $jQ(radios).each(function(i) {
                    if (this.checked) {
                        radioValid = true;
                        $jQ('#no-shipping-selected').hide();
                        var shippingType = $jQ('input[name=shipRadio]:checked').siblings('label').html();
                        $jQ('#sum-shipping').html(shippingType);
                    }
                }); // end each
                if (radioValid == false ) {
                    $jQ('#no-shipping-selected').show();
                    MLS.ui.scrollPgTo('#no-shipping-selected', 40);
                    return false;
                }

                $form = $jQ("form#vzn-checkout-shipping");
            } // endstep 1 prevalidate

            if (which == 'billing-info-complete') { // STEP 2 prevalidate
                var signedinBranch = 'new';
                var seq = $jQ('#checkout');
                if($jQ('.billing-complete').is(':not(.blank)')){ // if second time through, remove previous info
                    $jQ('#name-on-card').empty();
                    $jQ('#bill-address-summary-name').empty();
                }
                if ($jQ(seq).hasClass('signed-in')){ // check for saved info
                    if ($jQ('#bill-to-account').is(':checked') || $jQ('#choose-saved-card').is(':checked')) { // saved info, no validation required
                        signedinBranch = 'saved';
                        $jQ('.new-billing-info-form, .billing-detail-content.details-card').find('.checkout-input').addClass('not');
                        $jQ('.step-info-summary.billing-address').addClass('hidden');
                    }
                }

                $form = $jQ("form#vzn-checkout-billing");
            } // end if step 2 prevalidate

            var validator = $form.validate(); // VALIDATE
            var formValid = $form.valid();

            var completed;

            if (valid && formValid) {

                if (which == 'ship-info-complete') { // STEP 1 postvalidate
                    MLS.ajax.sendRequest(
                        MLS.ajax.endpoints.CHECKOUT_STEP_1,
                        $form.serialize(),

                        function (r) {
                            if (r.hasOwnProperty('error') && r.error.hasOwnProperty("responseHTML") && r.error.responseHTML != "") {
                                return MLS.modal.open(r.error ? r.error.responseHTML : null);
                            }

                            if (r.hasOwnProperty('error') && r.error.hasOwnProperty("inlineHTML")) {
                                $jQ(".error.success").removeClass("success");

                                validator.showErrors(r.error.inlineHTML);
                                return;
                            }

                            // billingHTML
                            // step 2 restart
                            $jQ("#vzn-checkout-billing").replaceWith(r.success.billingHTML);
                            $jQ("#vzn-checkout-billing").find("input:submit, input:checkbox, select.checkout-input, select.cart-revise-qty,  .cart-item-qty, .checkout-final, .next-step-input").uniform(); // style form elements

                            $jQ("#vzn-checkout-billing").find('.checkout-dropdown').each(function(){ // display rules for inline dropdowns
                                MLS.ui.dropdownDisplay(this);
                            });

                            $jQ("#vzn-checkout-billing").find('.special-offer-block').each(function(){ // display rules for offer dropdowns
                                MLS.ui.dropdownDisplay(this);
                            });

                            MLS.checkout.mainCheckoutValidation($jQ("#vzn-checkout-billing"));
                            MLS.checkout.stepTwoSequence();
                            MLS.checkout.initGiftCard();
                            // end step 2 restart

                            $jQ(".step-info-summary:eq(0)").html(r.success.responseHTML);
                            MLS.checkout.initEditStep();

                            completed = $jQ('#shipping-info'); // hide/show/scroll ..............
                            completed.find('.hide-complete').addClass('hidden');
                            completed.find('.step-info-summary').removeClass('hidden');

                            var step2Complete = $jQ('#billing-info .billing-complete'); // which part of step 2 to open
                            if ($jQ(step2Complete).hasClass('blank')){
                                $jQ('#billing-info .hide-complete').removeClass('hidden');
                            } else {
                                $jQ('#confirm-order').find('.hide-complete').removeClass('hidden'); // open step 3 form & leave step 2 alone
                            }
                            MLS.ui.scrollPgTo(completed, 7);
                            MLS.checkout.update(r);
                        }
                    );
                } // end step 1 postvalidate

                if (which == 'billing-info-complete'){ // STEP 2 postvalidate
                    MLS.ajax.sendRequest(
                        MLS.ajax.endpoints.CHECKOUT_STEP_2,
                        $form.serialize(),
                        function (r) {
                            if (r.hasOwnProperty('error') && r.error.responseHTML != "") {
                                return MLS.modal.open(r.error ? r.error.responseHTML : null);
                            }

                            $jQ(".step-info-summary:eq(1), .step-info-summary:eq(2)").html(r.success.responseHTML);
                            MLS.checkout.initEditStep();

                            completed = $jQ('#billing-info');

                            $jQ('.sidebar-finish').addClass('on'); // reveal red CTA in sidebar
                            $jQ('.checkout-accordion.sidebar').find('.acc-info').css('display', 'none'); // close side bar acc

                            completed.find('.hide-complete').addClass('hidden');  //  hide/show/scroll ..............
                            completed.find('.step-info-summary').removeClass('hidden');
                            $jQ('#vzn-checkout-confirm .checkout-step .hide-complete').removeClass('hidden');
                            MLS.ui.scrollPgTo(completed, 7);
							var checkoutConfirm = $jQ('#vzn-checkout-confirm').position(); 
							$jQ('#checkout-sidebar').animate({top:"+" + checkoutConfirm.top},600); // align cart summary with step 3 
                            MLS.checkout.update(r);

                            setTimeout(function(){
                                $jQ('.billing-complete').removeClass('blank');  // remove flag for first time through
                            }, 300);
                        }
                    );
                } // end step 2 postvalidate

            } else { // NOT VALID
                $jQ('select').each(function(){ // apply error style to select(s) if req
                    if ($jQ(this).hasClass('error')){
                        $jQ(this).parents('.selector').addClass('error-style');
                    }
                });
                $jQ('.error').each(function(){ // loop through 'input, select', find first error & scroll to
                    var whichInput = $jQ(this).attr('id');
                    if (whichInput == undefined) { // do nothing
                    } else {
                        MLS.ui.scrollPgTo('#' + whichInput +'', 40);
                        return false;
                    }
                });
            }

            return false;
        }); // end click
    },

/* THIS NEEDS TO GO TO THE SIGNIN PAGE
    beginCheckoutValidation : function() { // CHECKOUT signin validation ...........................................................

        $jQ('#my-Verizon-login').validate({
            onfocusout: true,
            success: function(label){
                label.toggleClass('success')
            },
            ignore : '.ignore, :hidden, .not',
            rules: {
                myVerizonID: {
                    required: true,
                    noPlaceholder: true
                },
                myVerizonPassword: {
                    required: true,
                    noPlaceholder: true,
                    minlength: 4
                }
            },
            messages: {
                myVerizonID: "Please enter your User ID",
                myVerizonPassword: {
                    required: "Please enter your password",
                    noPlaceholder: "Please enter your password!",
                    minlength: "Your password must be at least 4 characters long"
                }
            }
        });
    },
*/

    mainCheckoutValidation : function(forms) { // CHECKOUT
        $jQ(forms || '#checkout-sequence form').each(function() {
            $jQ(this).validate({
                ignore: '.ignore, :hidden',
                success: function(label){
                    label.addClass('success').text('');
                },
                focusCleanup: true,
                rules: {
                    checkoutFirstName: {
                        required: true,
                        noPlaceholder: true,
                    },
                    checkoutLastName: {
                        required: true,
                        noPlaceholder: true,
                    },
                    checkoutCompany: {
                        required: true,
                        noPlaceholder: true,
                    },
                    checkoutAttention: {
                        required: true,
                        noPlaceholder: true,
                    },
                    checkoutEmail: {
                        required: true,
                        noPlaceholder: true,
                        email: true
                    },
                    checkoutPhone: {
                        required: true,
                        noPlaceholder: true,
                        phoneUS: true
                    },
                    checkoutAddress: {
                        required: true,
                        noPlaceholder: true,
                    },
                    checkoutAddress2: {
                        required: false,
                        noPlaceholder: false,
                    },
                    checkoutCity: {
                        required: true,
                        noPlaceholder: true,
                    },
                    checkoutState: {
                        required: true
                    },
                    checkoutZip: {
	                    required: true,
						zipcodeUS: true,
						minlength: 5,
	                    noPlaceholder: true
                    },
                    cardNumber: {
                        required: true,
                        noPlaceholder: true,
                        rangelength: [15, 16],
                        ccRecognize: true
                    },
                    ccMonth: {
                        required: true
                    },
                    ccYear: {
                        required: true
                    },
                    ccCode: {
                        required: true,
                        noPlaceholder: true,
                        minlength: 3,
                        maxlength:  4,
                        digits: true
                    },
                    billingFirstName: {
                        required: true,
                        noPlaceholder: true,
                    },
                    billingLastName: {
                        required: true,
                        noPlaceholder: true,
                    },
                    billingPhone: {
                        required: true,
                        noPlaceholder: true,
                        phoneUS: true
                    },
                    billingAddress: {
                        required: true,
                        noPlaceholder: true,
                    },
                    billingAddress2: {
                    },
                    billingCity: {
                        required: true,
                        noPlaceholder: true
                    },
                    billingZip: {
	                    required: true,
						zipcodeUS: true,
						minlength: 5,
	                    noPlaceholder: true
                    },
                    discountCode: {
	                    required: false,
	                    noPlaceholder: true,
						digits: true,
	                    minlength: 8,
						maxlength: 16
                    },
                    giftCard1: {
	                    required: false,
	                    noPlaceholder: true,
						digits: true,
	                    minlength: 8,
						maxlength: 16
                    },
                    giftCard1Pin: {
	                    required: false,
	                    noPlaceholder: true,
						digits: true,
	                    minlength: 7,
						maxlength: 7
                    },
	                giftCard2: {
	                    required: false,
	                    noPlaceholder: true,
						digits: true,
	                    minlength: 8,
						maxlength: 16
	                },
	                giftCard2Pin: {
	                    required: false,
	                    noPlaceholder: true,
						digits: true,
	                    minlength: 7,
						maxlength: 7
	                },                    
					cardNumberGC: {
                        required: false,
                        noPlaceholder: true,
                        rangelength: [15, 16],
                        ccRecognize: true
                    },
                    ccCodeGC: {
                        required: false,
                        noPlaceholder: true,
                        minlength: 3,
                        maxlength:  4,
                        digits: true
                    },
                },
                messages: {
                    checkoutFirstName: {
                        required: "Please enter your first name",
                        noPlaceholder: "Please enter your first name"
                    },
                    checkoutLastName: {
                        required: "Please enter your last name",
                        noPlaceholder: "Please enter your last name"
                    },
                    checkoutCompany: {
                        required: "Please enter your company name",
                        noPlaceholder: "Please enter your company name"
                    },
                    checkoutAttention: {
                        required: "Please enter your first and last name",
                        noPlaceholder: "Please enter your first and last name"
                    },
                    checkoutEmail: {
                        required: "Please enter your email address",
                        noPlaceholder: "Please enter your email address",
                        email: "Please enter a valid email address"
                    },
                    checkoutPhone: {
                        required: "Please enter your phone number",
                        noPlaceholder: "Please enter your phone number",
                        phoneUS: "Please enter a valid phone number"
                    },
                    checkoutAddress: {
                        required: "Please enter your street address",
                        noPlaceholder: "Please enter your street address"
                    },
                    checkoutAddress2: {
                    },
                    checkoutCity: {
                        required: "Please enter your city",
                        noPlaceholder: "Please enter your city"
                    },
                    checkoutState: {
                        required: "Please select your state"
                    },
                    checkoutZip: {
	                    required: "Please enter your zip code",
	                    noPlaceholder: "Please enter your zip code",
	                    digits: "Please enter your 5 digit zip code",
	                    minlength: "Please enter your 5 digit zip code",
	                    zipcodeUS: "Please enter a valid zip code"
                    },
                    cardNumber: {
                        required: "Please enter your card number",
                        noPlaceholder: "Please enter your card number",
                        rangelength: "Please enter a valid card number",
                        ccRecognize : "Please enter a valid card number"
                    },
                     ccMonth: {
                        required: "Please select month expiry"
                    },
                    ccYear: {
                        required: "Please select year expiry"
                    },
                    ccCode: {
                        required: "Please enter the security code on the back of your card",
                        noPlaceholder: "Please enter your security code",
                        minlength: "Please enter a valid security code",
                        maxlength:  "Please enter a valid security code",
                        digits: "Please enter a valid security code"
                    },
                    billingFirstName: {
                        required: "Please enter your first name",
                        noPlaceholder: "Please enter your first name"
                    },
                    billingLastName: {
                        required: "Please enter your last name",
                        noPlaceholder: "Please enter your last name"
                    },
                    billingPhone: {
                        required: "Please enter your phone number",
                        noPlaceholder: "Please enter your phone number",
                        phoneUS: "Please enter a valid phone number"
                    },
                    billingAddress: {
                        required: "Please enter your street address",
                        noPlaceholder: "Please enter your street address"
                    },
                    billingAddress2: {
                    },
                    billingCity: {
                        required: "Please enter your city",
                        noPlaceholder: "Please enter your city"
                    },
                    billingState: {
                        required: "Please select your state",
                        noPlaceholder: "Please enter your state"
                    },
                    billingZip: {
	                    required: "Please enter your zip code",
	                    noPlaceholder: "Please enter your zip code",
	                    digits: "Please enter your 5 digit zip code",
	                    minlength: "Please enter your 5 digit zip code",
	                    zipcodeUS: "Please enter a valid zip code"
                    },
                    discountCode: {
                        required: "Please enter a valid discount code",
                        noPlaceholder: "Please enter a valid discount code",
                        minlength: "Please enter a valid discount code"
                    },
                    giftCard1: {
                        required: "Please enter a valid gift card number",
                        noPlaceholder: "Please enter a valid gift card number",
                        minlength: "Please enter a valid gift card number"
                    },
                    giftCard1Pin: {
                        required: "Please enter a valid gift card PIN",
                        noPlaceholder: "Please enter a valid gift card PIN",
                        minlength: "Please enter a valid gift card PIN"
                    },
                    giftCard2: {
                        required: "Please enter a valid gift card number",
                        noPlaceholder: "Please enter a valid gift card number",
                        minlength: "Please enter a valid gift card number"
                    },
                    giftCard2Pin: {
                        required: "Please enter a valid gift card PIN",
                        noPlaceholder: "Please enter a valid gift card PIN",
                        minlength: "Please enter a valid gift card PIN"
                    },
                    cardNumberGC: {
                        required: "Please enter your card number",
                        noPlaceholder: "Please enter your card number",
                        rangelength: "Please enter a valid card number",
                        ccRecognize : "Please enter a valid card number"
                    },
                    ccCodeGC: {
                        required: "Please enter the security code on the back of your card",
                        noPlaceholder: "Please enter your security code",
                        minlength: "Please enter a valid security code",
                        maxlength:  "Please enter a valid security code",
                        digits: "Please enter a valid security code"
                    },
                }
            });
        });
    }
};
