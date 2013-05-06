
MLS.cartCheckout = (function() {

// ............................................ ONLOAD ....................................

		checkoutSidebarScroll(pgWidth); // set scrolling
		smallScreenContent(); // prepare small device content

		var pgWidth = document.body.clientWidth; // get page width

	// minicart, cart & checkout : uniform.js
		$jQ("input:submit, input:checkbox, select.checkout-input, select.cart-revise-qty,  .cart-item-qty, .checkout-final").uniform(); // style form elements
		$jQ('.checkout-dropdown').each(function(){ // display rules for inline dropdowns
			dropdownDisplay(this);
		});

		$jQ('.special-offer-block').each(function(){ // display rules for offer dropdowns
			dropdownDisplay(this);
		});

	// minicart only
		minicartTempContent(); // TEMP for demos, PA remove this
		$jQ('#minicart-cart').find('.minicart-item').attr('data-vpos', 0); // for item scrolling
		minicartLayout(); // empty state & scrolling controls

	 // cart only
	 	checkCartQty(); // empty states, scroll controls, any new conditionals

	 // checkout only
	 	$jQ('#vzn-checkout .selector').find('span').addClass('select-placeholder'); // enhance initial uniform.js select style
		$jQ('#vzn-checkout .selector').find('select').change(function(){ // enhance uniform.js select performance
			$jQ(this).parents('.selector').find('span').removeClass('select-placeholder');
			$jQ(this).parents('.selector').removeClass('select-box-error');
			$jQ(this).parents('.selector').find('.select-error-message').remove();
		});



//............................................  END ONLOAD ..................................








$jQ(window).resize(function(){ //...................... ON RESIZE ............................
	var resizePgWidth = document.body.clientWidth;

	checkoutSidebarScroll(resizePgWidth);


}); // ..............................................  END ON RESIZE .........................










// CART clicks ...........................................................................
	// header : save cart link
		$jQ('.save-cart-link').click(function(){
			$jQ('#save-cart-modal').fadeIn(300);
		});


	// items table : update qty message
		$jQ('.cart-revise-qty').change(function() {
			$jQ(this).parents('.detail-box').find('.update-msg').show().delay(3000).fadeOut(1000);
		});

	 // items table : remove item button
	 	$jQ('.remove a').click(function(e) {
	 		e.preventDefault();
	 		$jQ(this).parents('.remove').next('.confirm-remove').fadeIn(300);
	 	});

	 // items table : confirm remove panel
	 	$jQ('.cart-remove-links').find('.cancel').click(function(e) {
	 		e.preventDefault();
	 		$jQ(this).parents('.confirm-remove').fadeOut(300);
	 	});


	 	$jQ('.cart-remove-links').find('.remove').click(function(e) {
	 		//e.preventDefault();
	 		$jQ(this).parents('.table-row').remove();
	 		$jQ('#shopping-cart-form').submit();
	 		checkCartQty();
	 	});

	 // sidebar : banner dropdowns
	 	$jQ('.cart-sidebar').find('.special-offer-block').each(function() {
	 		dropdownDisplay(this);
	 	});


	 //sidebar : tax calc submit
	 	// validate zip code -- NEED TO DO THIS WHEN FEATURE MADE LIVE!!!!!!!

	 	// get value
	 	//	var tempValue = '24.31'; // TEMP

	 	// button action
	 	//	$jQ('#tax-calc-button').click(function(e) {
	 	//		e.preventDefault();

	 			//insert tax value
	 	//			$jQ('#cart-tax').html(tempValue);

	 			// update cart total
	 	//			var cartTotal = $jQ('#cart-total').text();
	 	//
	 	//			pCartTotal = parseFloat(cartTotal);
	 	//			pTempValue = parseFloat(tempValue);

	 	//			cartTotal = pCartTotal + pTempValue;
	 	//			$jQ('#cart-total').text(cartTotal);

	 			// show message
	 	//			$jQ('.calc-msg').show().delay(3000).fadeOut(1000);
	 	//	});

	 // lightbox modals

		$jQ('.lightbox-close').click(function(){
			$jQ(this).parents('.lightbox').fadeOut(300);
		});

	 	// validate save cart email
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
		}); // end save cart validate


		// save cart successful submit action
		$jQ('#save-cart-submit').click(function(e) {

			if ($jQ('#save-cart-form').valid()) {
				$jQ(this).parents('.modal-info-block').find('h3').html('Cart Saved!').next().html('Please check your email');
				$jQ(this).parents('.modal-info-block').find('#save-cart-form').remove();
			};

		}); // end save cart submit actions

		// back to cart  click
		$jQ('.lightbox-back').click(function(){
			$jQ(this).parents('.lightbox').fadeOut(300);
		});

		// dropdowns
		$jQ('.lightbox-fineprint').find('li').each(function(){
			dropdownDisplay(this);
		});



// MINICART clicks
	// free shipping modal
	$jQ('.minicart-banner.ship').find('.minicart-cta').click(function(){
		$jQ('#minicart-shipping-modal').show();
	});


	// remove item - client side manipulation
	$jQ('#minicart-box .remove').find('a').each(function(){
		minicartEdit(this);
	});

	// next 3 items
	$jQ('.next-items-link').click(function(e){
		e.preventDefault();
		var type = "next";
		minicartScroll(type);
	});


	// prev 3 items
	$jQ('.prev-items-link').click(function(e){
		e.preventDefault();
		var type = "prev";
		minicartScroll(type);
	});


//CHECKOUT CLICKS
	// begin checkout : signin button
	$jQ('#checkout-sign-in').click(function(e) {
		e.preventDefault();
		var form = $jQ(this).parents('form');

        $jQ(form).validate();
        if (form.valid()) {
            var name = $jQ(form).find('#vzw-user').val(); // TEMP : swap for backend data: signed-in user first name
		      $jQ('#checkout').addClass('visible').addClass('signed-in');
		      $jQ('.checkout-title').text('Hi, ' + name + '!');
			enterCheckout();
			return false;
			}
		});

	// begin checkout : create vzn login checkbox
		$jQ('.create-login-checkbox').change(function() {
			$jQ('.create-login-message').slideToggle(300);
		});

	// begin checkout : 'checkout as guest' button
		$jQ('#checkout-as-guest').click(function(e) {
			e.preventDefault();
			$jQ('#checkout').addClass('visible').addClass('guest');
			$jQ('.checkout-title').text('Checkout')
			enterCheckout();
		});


	// checkout accordions
	$jQ('.checkout-accordion').find('.acc-control').click(function(){
		MLS.ui.simpleAcc(this);
	});


	// checkout sidebar special offer
	$jQ('#checkout-sidebar').find('.special-offer-block').each(function(){
		dropdownDisplay(this);
	});


	// main checkout sequence : step 1 home/business select
	$jQ('#checkout-where-to-ship').change(function(){
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

	// main checkout sequence : step 2 billing info choices
	$jQ('.billing-select').change(function(){ // ........ signed-in:  account or card selection

		// uncheck other option & switch container styles
			$jQ(this).parents('.billing-option').addClass('checked').siblings().find('span').removeClass('checked').find('.billing-select').prop(
				'checked', false).parents('.billing-option').removeClass('checked');

		// hide unchecked content / reveal checked
			$jQ('.billing-details-block').find('.billing-detail-content.hidden').removeClass('hidden').siblings().addClass('hidden');

		// enforce proper show/hide of billing address info/form below billing-info block
			if($jQ(this).parents('.billing-option').hasClass('bill-account')){ /* hide both on any 'account' click ' */
		 		$jQ('.step-info-summary.billing-address').addClass('hidden');
		 		$jQ('.new-billing-info-form').addClass('hidden');
		 	} else  { /* decide which to show on any 'card' click */
		 		var currentCardChoice = $jQ('input[name=cardChoice]:checked').attr('id');
		 		if (currentCardChoice == 'choose-saved-card') {
		 			$jQ('.step-info-summary.billing-address').removeClass('hidden');
		 		} else {
		 			$jQ('.new-billing-info-form').removeClass('hidden');
		 		}
		 	}
		});



	$jQ('input[name=cardChoice]').change(function(){ // ............ signed-in: new card or saved card .............

		// handle detail block under button
			$jQ(this).siblings('.card-choice-detail-block').removeClass('hidden').parent().siblings('.form-input-wrap').find('.card-choice-detail-block').addClass('hidden');

		// handle edit button visibility
			if ($jQ(this).parent().hasClass('new-card')) {
				$jQ('.edit-saved-card').addClass('hidden');
			} else {
				$jQ('.edit-saved-card').removeClass('hidden');
			}

		// handle saved billing/new billing form below
			$jQ('.billing-address').each(function(){
				$jQ(this).toggleClass('hidden');
			});
		});


	$jQ('.edit-saved-card').click(function(){ // ................. signed-in: edit saved card information .........

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




	$jQ('#same-as-shipping').change(function() { //.......... new card info: billing info same as shipping
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



	$jQ('#saved-info-edit').click(function(){ // ................. edit saved billing information information .........
		$jQ(this).parents('.billing-address').slideToggle(300).next('.billing-address').slideToggle(300);
	});


	$jQ('#card-number, #card-number-gc').on('keyup', function() { //.............. new card info : card icon recognition ...........
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


	$jQ('#apply-discount-code').click(function(e){ /* ................... apply & validate discount code .......... */
		e.preventDefault();
		$jQ('#vzn-checkout').validate();
        if ($jQ('#discount-code-input').valid() == true){
        	$jQ('#checkout-cart-discount-code').slideToggle(300); //removeClass('na');
        	$jQ(this).parents('.discount-input').slideToggle(300);
			$jQ(this).parents('.discount-input').next('.discount-success').slideToggle(300);
			return false;
		}
	});


	$jQ('#remove-discount-code').click(function(e){ /*.................... remove discount code ........................ */
		e.preventDefault();
		$jQ('#discount-code-input').removeClass('valid').addClass('hasPlaceholder');
		$jQ('#checkout-cart-discount-code').slideToggle(300);
		$jQ(this).parents('.discount-success').prev('.discount-input').slideToggle(300);
		$jQ(this).parents('.discount-success').slideToggle();
		return false;
	});


	$jQ('#begin-gift-card').click(function(e){ /* .................. grab cc info and copy down if present ............ */

 		var ecValid = true;
		$jQ('#enter-card-info').find('.selector').each(function(){ // validate main cc selects first
			var selectsValid = validateSelect(this);
			if(selectsValid == false) {
				ecValid = false;
			}
		});

		$jQ('#vzn-checkout').validate(); // validate the rest
        if ($jQ('.CCV').valid() && ecValid == true ) {
        	copyCardInfo('CCV', 'GCV'); // copy valid card info down
		}
	});


	$jQ('#apply-gift-card-1').click(function(e){ /* ........................... apply & validate gift card 1 .......... */
		e.preventDefault();
		var gcValid = true; // staying optimistic

		$jQ(this).parents('.checkout-discount-block').find('.selector').each(function(){ // validate selects first
			var selectsValid = validateSelect(this);
			if(selectsValid == false) {
				gcValid = false;
			}
		});

		$jQ('#vzn-checkout').validate(); // validate the rest
        if ($jQ('.GCV').valid() && gcValid == true ) {
        	copyCardInfo('GCV', 'CCV'); // copy valid card info back up to main cc form

        	$jQ('#checkout-cart-gift-card-1').slideToggle(300); // hide & show
        	$jQ('.gift-card-cc-block').slideToggle(300);
        	$jQ(this).parents('.discount-input').slideToggle();
			$jQ(this).parents('.discount-input').next('.discount-success').slideToggle();
			return false;
		}
	});

	$jQ('#remove-gift-card-1').click(function(e){ /* ........................... remove gift card 1 ....................... */
		e.preventDefault();
		$jQ('#checkout-cart-gift-card-1').removeClass('valid').addClass('hasPlaceholder');
		$jQ('#checkout-cart-gift-card-1').slideToggle(300);
		$jQ('.gift-card-cc-block').slideToggle(300);
		$jQ(this).parent('.discount-success').prev('.discount-input').slideToggle();
		$jQ(this).parent('.discount-success').slideToggle();
		return false;
	});


	$jQ('#add-gift-card-2').click(function(){  $jQ(this).toggleClass('close'); }); /*  toggle action governed by element class */

	$jQ('#apply-gift-card-2').click(function(e){ /* ........................... apply & validate gift card 2 .......... */
		e.preventDefault();
		$jQ('#vzn-checkout').validate();
        if ($jQ('#gift-card-2-input').valid() == true && $jQ('#gift-card-2-pin').valid() == true){
        	$jQ('#checkout-cart-gift-card-2').slideToggle(300);
        	$jQ(this).parents('.discount-input').slideToggle();
			$jQ(this).parents('.discount-input').next('.discount-success').slideToggle();
			return false;
		}
	});

	$jQ('#remove-gift-card-2').click(function(e){ /* ........................... remove gift card 2 ....................... */
		e.preventDefault();
		$jQ('#checkout-cart-gift-card-2').removeClass('valid').addClass('hasPlaceholder');
		$jQ('#checkout-cart-gift-card-2').slideToggle(300);
		$jQ(this).parent('.discount-success').prev('.discount-input').slideToggle();
		$jQ(this).parent('.discount-success').slideToggle();
		return false;
	});


	$jQ('.checkout-next').click(function(e) { // ............................  NEXT STEP CLICK SEQUENCE .................

		e.preventDefault();
		$jQ(this).parents('.checkout-step').find('label.error').each(function(){
			$jQ(this).hide().removeClass('success'); // reset all error & success messages on next step click
		});
		var which = $jQ(this).attr('id');
		var valid = true;

		if (which == 'ship-info-complete') { // ............................. STEP 1 PRE VALIDATE ...............................
			var radios = $jQ(this).siblings('.step-info-block').find('.checkout-radio-input'); // ... validate step 1 radio buttons ...
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

			$jQ(this).parents('fieldset').find('.selector').each(function(){ // ..... validate uniform.js selects .........
				var selectsValid = validateSelect(this);
				if(selectsValid == false) {
					valid = false;
				}
			});
		} // endstep 1


		if (which == 'billing-info-complete') {// ........................... STEP 2 PRE VALIDATE..................................
		var signedinBranch = 'new';
		var seq = document.getElementById('checkout');

			//setTimeout(function(){
				if($jQ('.billing-complete').is(':not(.blank)')){ // not the first time through
			//		alert('emptying');
					$jQ('#name-on-card').empty();
    				$jQ('#bill-address-summary-name').empty();
				}
			//}, 25);

			if ($jQ(seq).hasClass('signed-in')){ // check for saved info
				if ($jQ('#bill-to-account').is(':checked') || $jQ('#choose-saved-card').is(':checked')) { // saved info, no validation required
					signedinBranch = 'saved';
					$jQ('.new-billing-info-form, .billing-detail-content.details-card').find('.checkout-input').addClass('not');
					$jQ('.step-info-summary.billing-address').addClass('hidden');
				}
			} else { // else validate new card info

				$jQ(this).parents('fieldset').find('.selector').each(function(){ // ........ validate uniform.js selects ..........
					var ignoreThese = 'GCV';
					var selectsValid = validateSelect(this, ignoreThese);
					if(selectsValid == false) {
						valid = false;
					}
				});
			}

		} // end if step 2


	// VALIDATE

		var validator = $jQ("#vzn-checkout").validate();
    	var $inputs = $jQ(this).siblings('.step-info-block').find('.checkout-input').not('.not');
		var section = $jQ(this).attr('id');

		// check if inputs are valid, prepare summaries if so
			$inputs.each(function(inputI) { // checks each input, copies value to summary if valid
    			if (!validator.element(this) && valid) {
            	valid = false; // stops copying if invalid elements
        		} else {
        			var data = $jQ(this).val();
					copyInputs( section, inputI, data );
					setTimeout(function(){
					}, 50);
        		}
        		//alert(inputI); alert(data);
    		});

    	if (valid) {
    		if (section == 'ship-info-complete'){ // .................. STEP 1 POST VALIDATE BRANCH .......................
    			var completed = $jQ('#shipping-info');
    			var shipName = $jQ('#ship-name-block').html();
    			$jQ('#copy-ship-name-block').html(shipName).find('.summary').removeClass('summary'); // copy name to additional field in summary
				var nextDest = $jQ('#checkout-where-to-ship').find('option:selected').val();  // check if home or business and adjust summary accordingly
				if (nextDest == "business") {
					$jQ('#shipping-info').find('.sum-first-name, .sum-last-name').each(function(){ // add classes for 'business' summary
						$jQ(this).addClass('biz');
					});
					$jQ('.same-as-shipping').remove(); // remove 'same as shipping' in step 2 if 'business' in step 1
				} // else if residence do nothing


				var thisBlock = $jQ(this).parents('.checkout-step'); // ....... if valid : hide/show/scroll ..............
       			thisBlock.find('.hide-complete').addClass('hidden');
        		thisBlock.find('.step-info-summary').removeClass('hidden');

        		var step2Complete = thisBlock.next('.checkout-step').find('.billing-complete'); // which part of step 2 to open
        		if ($jQ(step2Complete).hasClass('blank')){
        			thisBlock.next('.checkout-step').find('.hide-complete').removeClass('hidden');// open step 2 form
        		 } else {
        		 	$jQ('#confirm-order').find('.hide-complete').removeClass('hidden'); // open step 3 form & leave step 2 alone

        		 }
        		MLS.ui.scrollPgTo(completed, 7);

    		} // end step 1 valid branch



    		if (section == 'billing-info-complete'){ // .................. STEP 2 POST VALIDATE BRANCH......................
    			var completed = $jQ('#billing-info');

    			if (signedinBranch == 'saved'){ // copy saved info to final summary

    				if ($jQ('#bill-to-account').is(':checked')) {
    					var accountAddress = $jQ('.account-billing-address').clone();  // copy account html block
    					var accountContact = $jQ('.account-contact').clone();
    					$jQ('.bill-summary-card-block').html(accountAddress);
    					$jQ('.bill-summary-address-block').html(accountContact);

    				} else if ($jQ('#choose-saved-card').is(':checked')) {

    					var $inputs = $jQ('.saved-summary.copy'); /* loop through and get saved info */
						$inputs.each(function(savedI) {
    						var data = $jQ(this).text();

							$jQ(completed).find('.summary.saved-sum').each(function(sumI){
								if (savedI == sumI){
									$jQ(this).text(data);
								}
							});
        				});
        				var savedName = $jQ('#bill-card-summary-name').html(); /* copy name into two fields */
    					$jQ('#name-on-card').html(savedName).find('.saved-sum').removeClass('saved-sum');
    					$jQ('#bill-address-summary-name').html(savedName).find('.saved-sum').removeClass('saved-sum');

    					var cardType = $jQ('.card-choice-block .card-image').attr('data-saved-card-type'); /* data for card icon */
    					$jQ(completed).find('.step-info-summary .card-image').addClass(cardType);
    				}

    			} else if (signedinBranch == 'new'){ // copy new info to section summary

    				var billName = $jQ('#bill-card-summary-name').html();
    				$jQ('#name-on-card').html(billName).find('.saved-sum').removeClass('saved-sum');
    				$jQ('#bill-address-summary-name').html(billName).find('.saved-sum').removeClass('saved-sum');

    				var lastFour = $jQ('#confirmed-last-four').text();
    				lastFour = lastFour.substr(lastFour.length - 4);
    				$jQ('#confirmed-last-four').html(lastFour);

    			}

    			$jQ('.sidebar-finish').addClass('on'); // reveal red CTA in sidebar
    			$jQ('.checkout-accordion.sidebar').find('.acc-info').css('display', 'none'); // close side bar acc

    			var thisBlock = $jQ(this).parents('.checkout-step'); // ....... if valid : hide/show/scroll ..............
       			thisBlock.find('.hide-complete').addClass('hidden');
        		thisBlock.find('.step-info-summary').removeClass('hidden');
        		thisBlock.next('.checkout-step').find('.hide-complete').removeClass('hidden');
        		MLS.ui.scrollPgTo(completed, 7);

    			setTimeout(function(){
    				$jQ('.billing-complete').removeClass('blank');  // remove flag for first time through
    			}, 300);

    		} // end step 2 valid branch

    	} else { // .......................................................... IF NOT VALID .......................................
    			$jQ('.error').each(function(){ //'input, select'
    				var whichInput = $jQ(this).attr('id');
    				if (whichInput == undefined) { // do nothing
    				} else {
    					MLS.ui.scrollPgTo('#' + whichInput +'', 40);
    					return false;
    				}
    			});
    		}

		}); // ........................................... END NEXT STEP ............................................................



	$jQ('.edit-checkout-step').not('#saved-info-edit').click(function(){ //... EDIT VALIDATED INFO BUTTON (after next-step click)....
		var thisStep = $jQ(this).parents('.checkout-step');

		// close open input & open its summary
        	thisStep.siblings('.checkout-step').find('.hide-complete').each(function() {
        		$jQ(this).not('hidden').addClass('hidden').siblings('.step-info-summary').not('.blank').removeClass('hidden');
        	});

		// close this panel's summary next
			$jQ(this).parents('.step-info-summary').addClass('hidden');


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
	}); //.................................................. END EDIT VALIDATED ............................















// FUNCTIONS .....................................................................................


function checkoutSidebarScroll (pgWidth) {
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
} // end function sidebar scroll


function smallScreenContent(){
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

} // end small screen content

function dropdownDisplay(container){  // ALL dropdown panels
	if ($jQ('html').hasClass('no-touch')){
		var link = $jQ(container).find('.dropdown-link');
		$jQ(link).click(function(e){
			e.preventDefault();
		});
		$jQ(link).hover(
			function() { $jQ(this).next('.dropdown-panel').fadeIn(300); },
			function() { $jQ(this).next('.dropdown-panel').delay(300).fadeOut(300); }
		);
		$jQ('.dropdown-panel').hover(
			function() { $jQ(this).stop().show(); },
			function() { $jQ(this).fadeOut(300); }
		);
	} else {
		$jQ(link).click(function(e){
			e.preventDefault();
			$jQ(this).siblings('.dropdown-panel').toggle();
		});
	}
}

function checkCartQty() {  // CART setup

	 var inCart = $jQ('.cart-table').children('.table-row').not('.empty-cart').length;

	 if (inCart < 1) {
	 // show empty cart message & update header & label
	 	$jQ('.table-header, .proceed-block').hide();
	 	$jQ('.empty-cart').show();
	 	$jQ('#cart-header-summary').html(inCart).next().html('Items');
	 } else if (inCart == 1) {
	 // update header-summary & label
	 	$jQ('#cart-header-summary').html(inCart).next().html('Item');
	 } else {
	 // update header summary & label
		$jQ('#cart-header-summary').html(inCart).next().html('Items');
	}
} // end checkCartQty

function minicartLayout( ){ // MINICART layout by # of items
	var inMini = $jQ('#minicart-cart').find('.minicart-item').length;

	if (inMini < 1) { // layout empty cart
	 	$jQ('#nav-tab4, #checkout-minicart').addClass('empty');
	} else if (inMini > 0 && inMini < 4 ) {
		$jQ('#nav-tab4, #checkout-minicart').removeClass('empty');
		$jQ('.minicart-next').css('display', 'none');
	} else if (inMini > 3) {
		$jQ('#nav-tab4, #checkout-minicart').removeClass('empty');
		$jQ('.minicart-next').addClass('on');
	}

    // update item total
        var itemsInMini = 0
        $jQ('#minicart-item-list').find('.minicart-item-qty').each(function(){
            var thisItemQty = $jQ(this).html();
            thisItemQty = parseInt(thisItemQty, 10);
            itemsInMini = itemsInMini + thisItemQty;
        });
        $jQ('#nav-cart').find('.count').html(itemsInMini);

    //$jQ('#nav-cart').find('.count').html(inMini);
} // end minicartLayout

function minicartEdit(removeBtn){ // MINICART remove/confirm remove sequence
	$jQ(removeBtn).click(function(e){ // first 'remove' click
		e.preventDefault();
		var block = $jQ(removeBtn).parents('.minicart-item');
		var editBox = $jQ(removeBtn).parents('.minicart-edit');

		$jQ(block).css('background-color' , '#d6d9d9');
		$jQ(editBox).css('width', '120px').find('.edit').html('<a href="#" class="minicart-cancel-remove">Cancel</a>');
		$jQ('<div class="remove-msg">Are you sure you want to remove this item?</div>').appendTo($jQ(block).find('.item-info-block'));
		$jQ(removeBtn).addClass('yes-remove');

		// confirm remove item from cart .................
		$jQ('.yes-remove').click(function(){
			var itemID = $jQ(this).parents('.minicart-item').attr('id');
			MLS.ajax.sendRequest($jQ('#minicart-form').attr('action'), { itemId : itemID }, function(data){
				$jQ('#nav-cart .count').html(data.success.cartCount);
				$jQ(element).remove();
			});
			//minicartLayout( );
		});

		// cancel remove
		$jQ('.minicart-cancel-remove').click(function(e){
			e.preventDefault();

			//$jQ(this).parents('.minicart-item').find('.remove-msg').remove();
			$jQ(block).css('background-color' , '#e5eaea').find('.remove-msg').remove();
			$jQ(editBox).css('width', '96px').find('.edit').html('<a href="cart-base.html">Edit</a>');
			$jQ(editBox).find('.yes-remove').removeClass('yes-remove').unbind('click');

			minicartEdit(removeBtn);
		});
	});
} // end minicartEdit


function minicartScroll(type) { // MINICART function: next/prev items scroll
	if (type == "next") {

	// calculate current max scroll up
		var inMini = $jQ('#minicart-item-list').find('.minicart-item').length;
		var maxScrollTimes = inMini / 3;
		var maxScrollInt = parseInt(maxScrollTimes, 10);
		var maxScrollPos = maxScrollInt * -247;

	// get current position
		var curPos = $jQ('.minicart-item.one').attr('data-vpos');

	//calculate new offset before actually moving
		var newPos = curPos - 247;

	// check position, move and adjust options as required
		if (newPos > maxScrollPos) { // beginning/middle

			$jQ('.minicart-item').each(function(){ // move up
				MLS.ui.vScroll(this, newPos);
			});
			$jQ('.prev-items-link').addClass('on'); //turn on prev
			$jQ('.next-items-link').removeClass('off'); //turn on next if needed

		} else if (newPos == maxScrollPos) { // end

			$jQ('.minicart-item').each(function(){ // move up
				MLS.ui.vScroll(this, newPos);
			});
			$jQ('.next-items-link').addClass('off'); //turn off next
		}

	} else {

	// get current position
		var curPos = $jQ('.minicart-item.one').attr('data-vpos');
		var curPosParse = parseInt(curPos, 10);

	//calculate new offset before actually moving
		var newPos = curPosParse + 247;

	// check position, move and adjust options as required
		if (newPos == 0) { // beginning/middle

			$jQ('.minicart-item').each(function(){ //move down
				MLS.ui.vScroll(this, newPos);
			});
			$jQ('.prev-items-link').removeClass('on'); //turn off prev
			$jQ('.next-items-link').removeClass('off'); //turn on next

		} else { // end

			$jQ('.minicart-item').each(function(){ //move down
				MLS.ui.vScroll(this, newPos);
			});
			$jQ('.next-items-link').removeClass('off'); //turn on next
		}
	}
} // end minicart scroll function



function enterCheckout(pgWidth) { // CHECKOUT enter main sequence
	window.scrollTo(0,0);
	$jQ('#begin-checkout').fadeOut(300);
	var sidebar = $jQ('.visible #checkout-sidebar');
	var startTop = sidebar.offset().top;

	var pgWidth = document.body.clientWidth; // get page width for single case desktop resize
	if (pgWidth < 960) {
		startTop= 302;
	}
	sidebar.attr({
		'data-start-top' : startTop,
	});

	var checkoutType=document.getElementById('checkout'); // adjust billing input fields based on type of login
	if ($jQ(checkoutType).hasClass('guest')){ //remove fields & show form

			$jQ('#core-cc-form').removeClass('hidden').appendTo('.billing-details-block');
			$jQ('.billing-select-block, .billing-detail-content').remove();
			$jQ('.new-billing-info-form').removeClass('hidden');

	} // else proceed as signedin

	$jQ('h1.checkout-title').addClass('main'); // re-justify with checkout sequence
} // end checkout entrance

function copyInputs( section, inputI, data ) { // CHECKOUT copy text input info for summaries on 'next step' clicks

	$jQ('#' + section ).parents('.checkout-step').find('.summary').each(function(sumI) {
		if (inputI == sumI ) {
			$jQ(this).text(data);

		}
	});
} // end copyInputs

function copyCardInfo(fromClass, toClass) { // move valid card info on page from one fieldset to the other

	var fromFset = $jQ('.' + fromClass).parents('.credit-card-info');
	var toFset = $jQ('.' + toClass).parents('.credit-card-info');

	$jQ(fromFset).find('.' + fromClass).each(function(fromI){
		thisValue = $jQ(this).val();
		$jQ(toFset).find('.' + toClass).each(function(toI){
			if (fromI == toI) {
				$jQ(this).val(thisValue).removeClass('error').removeClass('hasPlaceholder').next('label').addClass('success');
				$jQ.uniform.update(this);
				return false;
			}
		});
	});
} // end copyCardInfo

function validateSelect(selector, ignored) { // CHECKOUT  validation/error messages for custom selects created with uniform.js

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
} // validate select






// CHECKOUT VALIDATION RULES .............................................................................

// add these methods to all validation

	// phone number format
	jQuery.validator.addMethod("phoneUS", function(phone_number, element) {
    	phone_number = phone_number.replace(/\s+/g, "");
		return this.optional(element) || phone_number.length > 9 && phone_number.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/);
	}, "Please specify a valid phone number");

	// don't validate placeholder text
	jQuery.validator.addMethod("noPlaceholder", function (value, element) {
		if (value == $jQ(element).attr('placeholder')) {
			return false;
		} else {
			return true;
		}
	});

	// improved credit card recognition

	jQuery.validator.addMethod("ccRecognize", function (value, element) {
		relValue = value.substring(0,2);
		if (relValue >= 40 && relValue <= 49 ) { // visa
			return true;
		} else if (relValue == 34 || relValue == 37) { //amex
			return true;
		} else if (relValue >= 50 && relValue <=55 ) { // mc
			return true;
		} else if (relValue == 65 ) { // discover
			return true;
		} else {
			return false;
		}

	});


// begin checkout : validation rules & messages
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


//  main checkout sequence : validation rules & messages
	$jQ('#vzn-checkout').validate({
		ignore: '.ignore, :hidden',
		onfocusout: true,
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
				digits: true,
				minlength: 5,
				noPlaceholder: true,
			},
			cardNumber: {
				required: true,
				noPlaceholder: true,
				rangelength: [15, 16],
				ccRecognize: true
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
				noPlaceholder: true
			},
			discountCode: {
				required: false,
				noPlaceholder: true,
				minlength: 4

			},
			giftCard1: {
				required: false,
				noPlaceholder: true,
				minlength: 8
			},
			giftCard1Pin: {
				required: false,
				noPlaceholder: true,
				minlength: 4
			},
			giftCard2: {
				required: false,
				noPlaceholder: true,
				minlength: 8
			},
			giftCard2Pin: {
				required: false,
				noPlaceholder: true,
				minlength: 4
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
				minlength: "Please enter your 5 digit zip code"
			},
			cardNumber: {
				required: "Please enter your card number",
				noPlaceholder: "Please enter your card number",
				rangelength: "Please enter a valid card number",
				ccRecognize : "Please enter a valid card number"
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
				noPlaceholder: "Please enter your zip code"
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

















// TEMP FOR DEMO ...............................................................................

function minicartTempContent () { // TEMP demo only =========== PA remove this
	$jQ('.minicart-demo-1 .minicart-item').each(function(){
		if ($jQ(this).hasClass('one')) {
			// do nothing
		} else {
			$jQ(this).remove();
		}
	});

	$jQ('.minicart-demo-empty .minicart-item').each(function(){
		$jQ(this).remove();
	});
} // END TEMP demo only ======================================================








}()); // end namespace bracketing
