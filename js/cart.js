




// Minicart ............................................................................................


	// move to Nav Overlay on Checkout Page Only
	$jQ('#checkout-minicart').each(function() {

		// tab
			var minicartTab = $jQ(this).parents('#checkout-page').find('#nav-cart').html();
			$jQ(this).siblings('#checkout-minicart-tab').html(minicartTab);

		// contents
			var minicartContents = $jQ(this).parents('#checkout-page').find('#nav-tab4').html();
			$jQ(this).html(minicartContents);
	});


	// show checkout minicart on hover

		$jQ('#checkout-minicart-tab, #checkout-minicart').hover(

			function(){
				$jQ('#checkout-minicart-tab').addClass('hover');
				$jQ('#checkout-minicart').show();

				var bannerCt = $jQ('#minicart-banner-box').find('.minicart-banner').length;
				var cartCt = $jQ('#minicart-cart').find('.minicart-item').length;

				if (cartCt >= bannerCt ){

					setTimeout(function(){
						var cartHt = $jQ('#minicart-cart').height();

						cartHt = parseInt(cartHt, 10) + 90;
						$jQ('#minicart-cart').css('height', cartHt + 'px');
					}, 200);
				}
			},

			function(){
				$jQ('#checkout-minicart-tab').removeClass('hover');
				$jQ('#checkout-minicart').hide();
			}
		);



	// initial click : extend minicart box height if required
	$jQ('#nav-cart').one('mouseenter', function() {


	 	var bannerCt = $jQ('#minicart-banner-box').find('.minicart-banner').length;
		var cartCt = $jQ('#minicart-cart').find('.minicart-item').length;

		if (cartCt >= bannerCt ){
			setTimeout(function(){
				var cartHt = $jQ('#minicart-cart').height();
				cartHt = parseInt(cartHt, 10) + 90;
				$jQ('#minicart-cart').css('height', cartHt + 'px');
			}, 200);
		}
	});




	// button actions

	$jQ('.remove').find('a').each(function(){
		minicartEdit(this);
	});


	function minicartEdit(removeBtn){

		$jQ(removeBtn).click(function(e){ // first 'remove' click
			e.preventDefault();
			var block = $jQ(removeBtn).parents('.minicart-item');
			var editBox = $jQ(removeBtn).parents('.minicart-edit');

			$jQ(editBox).css('width', '120px').find('.edit').html('<a href="#" class="minicart-cancel-remove">Cancel</a>');
			$jQ('<div class="remove-msg">Are you sure you want to remove this item?</div>').appendTo($jQ(block).find('.item-info-block'));
			$jQ(block).css('background-color' , '#d6d9d9');
			$jQ(removeBtn).addClass('yes-remove');


		// second 'remove' click
			$jQ('.yes-remove').click(function(){
				$jQ(block).remove();
			});

		// cancel remove
			$jQ('.minicart-cancel-remove').click(function(e){
				e.preventDefault();

				$jQ('.remove-msg').remove();
				$jQ(block).css('background-color' , '#e5eaea');
				$jQ(editBox).css('width', '96px').find('.edit').html('<a href="cart-base.html">Edit</a>');
				$jQ(editBox).find('.yes-remove').removeClass('yes-remove').unbind('click');

				minicartEdit(removeBtn);

			});

		});

	}// end define minicartEdit

// End Minicart









// Shopping Cart .........................................................................................

	// onload : make form elements pretty
		$jQ(".cart-item-qty").uniform(); // edit cart text input
	 	$jQ('select:not(.customSelect)').uniform(); //all select/option instances
	 	$jQ("input.button").uniform(); // input type="submit" per ATG spec

	 // onload : check if cart is empty/fill header field
	 	checkCartQty();


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
	 		e.preventDefault();
	 		$jQ(this).parents('.table-row').remove();
	 		checkCartQty();
	 	});



	 // sidebar : banner dropdowns
	 	$jQ('.cart-offer-text').click(function() {
	 		$jQ(this).find('.cart-dropdown-panel').toggle();
	 	});


	 //sidebar : tax calc submit

	 	// validate zip code?

	 	// get value
	 	var tempValue = '24.31'; // TEMP

	 	// button action
	 		$jQ('#tax-calc-button').click(function(e) {
	 			e.preventDefault();

	 			//insert tax value
	 				$jQ('#cart-tax').html(tempValue);

	 			// update cart total
	 				var cartTotal = $jQ('#cart-total').text();

	 				pCartTotal = parseFloat(cartTotal);
	 				pTempValue = parseFloat(tempValue);


	 				cartTotal = pCartTotal + pTempValue;
	 				$jQ('#cart-total').text(cartTotal);

	 			// show message
	 				$jQ('.calc-msg').show().delay(3000).fadeOut(1000);
	 		});


	 // save cart & too many items modal

		$jQ('.modal-close').click(function(){
			$jQ(this).parents('.cart-modal').fadeOut(300);
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


		// dropdown panel clicks
		$jQ('.cart-modal').find('.dropdown-link').each(function(){
			$jQ(this).click(function(){
				$jQ(this).next().toggle(300);
			});
		});



		// save cart successful submit action
		$jQ('#save-cart-submit').click(function(e) {

			if ($jQ('#save-cart-form').valid()) {
				$jQ(this).parents('.modal-info-block').find('h3').html('Cart Saved!').next().html('Please check your email');
				$jQ(this).parents('.modal-info-block').find('#save-cart-form').remove();
			};

		}); // end save cart submit actions


		// back to cart  click
		$jQ('.modal-back').click(function(){
			$jQ(this).parents('.cart-modal').fadeOut(300);
		});












// CHECKOUT ............................................................................................



	// make all instances of these inputs pretty with uniform
		$jQ("input:submit, input:checkbox").uniform();



	// add these methods to validation

		// phone number format

		jQuery.validator.addMethod("phoneUS", function(phone_number, element) {
    		phone_number = phone_number.replace(/\s+/g, "");
			return this.optional(element) || phone_number.length > 9 && phone_number.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/);
		}, "Please specify a valid phone number");



		// ignore placeholder text

		jQuery.validator.addMethod("noPlaceholder", function (value, element) {
			if (value == $jQ(element).attr('placeholder')) {
				return false;
			} else {
				return true;
			}
		});









// 'Begin Checkout' Forms ............................................................

	// validation rules & messages ( validate.js ) : 'begin checkout' > sign into Verizon
		$jQ('#my-Verizon-login').validate({
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
					noPlaceholder: "Please enter your password",
					minlength: "Your password must be at least 4 characters long"
				}
			}
		});

	// validation rules & messages ( validate.js )  : 'begin checkout' > create login

		$jQ('#create-vzn-login').validate({

			rules: {
				createLoginFromMobile: {
					required: false,
					noPlaceholder: true,
					phoneUS: true,
				},
				createLoginPassword: {
					required: false,
					noPlaceholder: true,
					minlength: 4
				},
				createLoginVerify: {
					equalTo: '#new-vzn-password'
				}
			},

			messages: {
				createLoginFromMobile: {
					required: "Please enter your Verizon Wireless number",
					noPlaceholder: "Please enter your Verizon Wireless number",
					phoneUS: "Please enter your Verizon Wireless number"
					},
				createLoginPassword: {
					required: "Please enter a password",
					noPlaceholder: "Please enter your own unique password",
					minlength: "Your password must be at least 4 characters long"
					},
				createLoginVerify: {
					required: 'Please re-enter your password to confirm',
					equalTo: 'Sorry, your passwords don\'t match'
					}
			},
			success: function () {
				//alert('yeah');
			},
			ignore : '.ignore'
		});

	// 'begin checkout' : create vzn login
		$jQ('.create-login-checkbox').change(function() {

			$jQ('.create-login-fields').toggle('fast');
			if ($jQ(this).is(':checked')) {

				$jQ(this).parents('.guest-checkout').find('.button').find('span').html(
					'Register & Checkout<input name="create-login-submit" type="submit" class="begin-checkout-submit" value="Register & Checkout">'
				);

			} else {

				$jQ(this).parents('.guest-checkout').find('.button').find('span').html(
					'Guest Checkout<input name="create-login-submit" type="submit" class="begin-checkout-submit" value="Guest Checkout">'
				);
			}
		});

	// 'begin checkout' : password requirements
		$jQ('.pass-req').click(function() {
			$jQ('#password-requirements').toggle('fast');
		});


	// 'begin checkout' : successful entrance to guest checkout
		$jQ('#create-vzn-login').submit(function(e) {
			e.preventDefault();
			if ($jQ(this).valid()) {
				window.scrollTo(0,0);
				$jQ('#begin-checkout').fadeOut(300);
				$jQ('#checkout').addClass('visible');
				$jQ('.checkout-title').text('Checkout');

				var sidebar = $jQ('.visible #checkout-sidebar');
				var startTop = sidebar.offset().top;
				var startLeft = sidebar.offset().left;
				var startWidth = sidebar.width();
				sidebar.attr({
					'data-start-top' : startTop,
					'data-start-left' : startLeft,
					'data-start-width' : startWidth
					});

				$jQ('#checkout.visible').find('input');

			}// end guest entrance if
		});



// Main Checkout Sequence.................................................................

	// make elements pretty
		$jQ(".checkout-final").uniform();

	// inline dropdowns action
		$jQ('.checkout-dropdown-link').click(function(e){
			e.preventDefault();
			$jQ(this).siblings('.checkout-dropdown-panel').toggle();
		});


	// validation loop for 'next step' buttons

	$jQ('.checkout-next').click(function(e) {
		e.preventDefault();
		var which = $jQ(this).attr('id');

		// clear unused fields
			$jQ('.not').remove();


		// step-specific rules
		if (which == 'ship-method-complete') {

			var radios = $jQ(this).siblings('.step-info-block').find('.checkout-radio-input');
			var valid = false;

			var i = 0;
			$jQ(radios).each(function(i) {

				if (this.checked) {
					//alert(i);
					valid = true;
					$jQ('#no-shipping-selected').hide();
					var shippingType = $jQ('input[name=shipRadio]:checked').siblings('h5').html();
					$jQ('#sum-shipping').html(shippingType);

				}

			}); // end each

			if (valid == false ) {
				$jQ('#no-shipping-selected').show();
			}

		} else {


			var validator = $jQ("#vzn-checkout").validate();
			var valid = true;
    		var $inputs = $jQ(this).siblings('.step-info-block').find('.checkout-input');
    		var $selects = $jQ(this).siblings('.step-info-block').find('.checkout-select-input');
			var section = $jQ(this).attr('id');

    		$inputs.each(function(inputI) {

        		if (!validator.element(this) && valid) {
            		valid = false;
        		} else {

        			var data = $jQ(this).val();

        			copyInputs( section, inputI, data );

        		}
    		});

    		$selects.each(function(slctI) {
        			//alert('selects');
        			//alert(slctI);
        			data = $jQ(this).find(':selected').text();
        			copySelects( section, slctI, data );
        	});
        }

    	if (valid) {
    		//alert('valid');

    		if (section == 'ship-info-complete') { // special case : copy name to additional field
    			var shipName = $jQ('#ship-name-block').html();
    			$jQ('#copy-ship-name-block').html(shipName).find('.summary').removeClass('summary');
    		}

    		if (section == 'billing-info-complete') { // special case : copy name to out-of-sequence field
    			var first = $jQ('#confirmed-first-name').text();
    			var last = $jQ('#confirmed-last-name').text();
    			$jQ('#name-on-card').text( first + ' ' + last);
    		}

        	// show/hide as required
        		var thisBlock = $jQ(this).parents('.checkout-step');

        	// hide current block inputs & buttons
       			thisBlock.find('.hide-complete').addClass('hidden');

        	// show current block summary
        		thisBlock.find('.step-info-summary').removeClass('hidden');

        	// then open the next panel
        		thisBlock.next('.checkout-step').find('.hide-complete').removeClass('hidden');

        	// last, scroll page to where all data is visible
        		scrollPgTo('#shipping-info', 20);

    	}
	}); // end next step click




// edit step-info after next-step validation

	$jQ('.edit-checkout-step').click(function(){

		var thisStep = $jQ(this).parents('.checkout-step');

		// close open input & open its summary
        	thisStep.siblings('.checkout-step').find('.hide-complete').each(function() {
        		$jQ(this).not('hidden').addClass('hidden').siblings('.step-info-summary').removeClass('hidden');
        	});

		// close this panel's summary next
			$jQ(this).parents('.step-info-summary').addClass('hidden');

		// show this panel's inputs & buttons
        	thisStep.find('.hide-complete').removeClass('hidden');

        // last, scroll page to top of re-opened section
        	scrollPgTo (thisStep, 20);


	});



// validation rules & messages : full checkout sequence

		$jQ('#vzn-checkout').validate({
			rules: {
				checkoutFirstName: {
					required: true,
					noPlaceholder: true

				},
				checkoutLastName: {
					required: true,
					noPlaceholder: true

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
					minlength: 15,
					maxlength:  16,
					digits: true
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

					},
				giftCardNumber: {

					},
				discountCardPin: {

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
					minlength: "Please enter a valid card number",
					maxlength:  "Please enter a valid card number",
					digits: "Please enter a valid card number"
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
				}
			});





// CHECKOUT STEP 1 SPECIFICS : Residence/business form adjustment

	$jQ('#checkout-where-to').change(function(){

		//var which = $jQ(this).find('option:selected').val();

		var replace = $jQ('#destination').attr('data-removed');
		if (replace != "") {

			$jQ('<div class="replaced not"></div>').appendTo('#destination').html(replace);

		}

		// first change what shows

			$jQ(this).parents('.step-info-block').find('#destination').children().each(function(){

				if ( $jQ(this).hasClass('not') ) {
					$jQ(this).removeClass('not');
				} else {
					$jQ(this).addClass('not');
				}
			})


		// then remove/replace elements

			var removed = $jQ('#destination').find('.not').html();
			$jQ('#destination').find('.not').remove();
			$jQ('#destination').attr('data-removed', removed);
	});




// CHECKOUT STEP 3 SPECIFICS in user order

	// 1. billing-info-block :  account or card selection

		$jQ('.billing-select').change(function(){

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


	// 2. billing-info-block : saved card or new card

		$jQ('input[name=cardChoice]').change(function(){

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



	// 3.  billing-info-block : edit saved card button

		$jQ('.edit-saved-card').click(function(){

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

			// get saved info and populate form on this click only !!!!!!!!!!!!!!!!!!!!!!!!!!
		});


	// 4. billing-info-block : credit card icon selection on input

		$jQ('#card-number').on('keyup', function() {
			if(this.value.length === 2) {

			var number = $jQ(this).val();
			var cardListItem = 0;

				if (number >= 40 && number <= 49 ) {
					cardListItem = 'visa';
				} else if (number == 34 || number == 37) {
					cardListItem='amex';
				} else if ( number >= 50 && number <=55 ) {
					cardListItem='mc';
				} else if ( number == 65 ) {
					cardListItem='discover';
				}

				$jQ(this).parents('.form-input-wrap').next().find('.' + cardListItem).addClass('entered').siblings().removeClass('entered');


			} /* end if 2 digits */
		});


	// 5. billing-address : same as shipping checkbox

		$jQ('#same-as-shipping').change(function(){

			//  if this is now checked, fill in fields

				// loop through summary fields

					// loop through this form and paste in


					// tweak for business name and first/last difference






			// otherwise, loop through and clear fields


		});



// CHECKOUT SIDEBAR : 1024+ ONSCROLL positioning

	$jQ(window).scroll(function(){

		if($jQ('#checkout').hasClass('visible')) {

			var scrollPos = $jQ(this).scrollTop();

			var sidebar = $jQ('.visible #checkout-sidebar')
			var startTop = sidebar.attr('data-start-top');
			var startWidth = sidebar.attr('data-start-width');

			if ( scrollPos >= startTop ) {
				sidebar.addClass('fixed').css({
					'width': startWidth + 'px'
				});
			} else {
				sidebar.removeClass('fixed').css({
					'width' : '25%'
				});
			} // end 'if sidebar position'
		} // end 'if checkout visible '

	});




















// FUNCTIONS ...............................................................................


// main cart : quantity check and revise fields

function checkCartQty() {

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



// checkout : copy text input info for summaries on 'next step' clicks

function copyInputs( section, inputI, data ) {

	$jQ('#' + section ).parents('.checkout-step').find('.summary').each(function(sumI) {
		if (inputI == sumI ) {
			$jQ(this).text(data);
		}
	});
} // end copyInputs



// checkout : copy select input info for summaries on 'next step' clicks

function copySelects( section, inputI, data ) {

	$jQ('#' + section ).parents('.checkout-step').find('.select-summary').each(function(sumI) {
		if (inputI == sumI ) {
			$jQ(this).text(data);
		}
	});
} // end copy Selects



// checkout : scroll page to desired location on 'next step' clicks

function scrollPgTo( where, topPad) {
    if (topPad == undefined) {
        topPadding = 0;
    }
    var moveTo = $jQ(where).offset().top - topPad;
    $jQ('html, body').stop().animate({
        scrollTop: moveTo
    }, 250);
} // end scrollPgTo















// ............. TEMP state toggle buttons in header .........

	var stndrd = document.getElementById('state-standard');
	var sale = document.getElementById('state-sale');
	var oos = document.getElementById('state-oos');
	var too = document.getElementById('state-too-many');


	$jQ(stndrd).click(function() {

		var stndrd = document.getElementById('state-standard');
		var sale = document.getElementById('state-sale');

		// change font colors for nav
			$jQ(this).addClass('on');
			$jQ(sale).removeClass('on');

		//turn off everything else

		  	// turn off sale, restore standard where req
        		$jQ('.offer').css('display', 'none');
        		$jQ('.no-offer').css('display', 'inline-block');

        	// turn off oos
        		$jQ('.table-row.oos').find('.cart-product-image').removeClass('oos');
				$jQ('.table-row.oos').find('.oos-msg').hide();

			// turn off too-many-items
       			$jQ('#too-many-modal').hide();
	});


	$jQ(sale).click(function() {

		var stndrd = document.getElementById('state-standard');
		var sale = document.getElementById('state-sale');


		// change font colors for nav
			$jQ(this).addClass('on');
			$jQ(stndrd).removeClass('on');

		// turn on sale elements, hide standard where req
        	$jQ('.offer').css('display', 'inline-block');
        	$jQ('.no-offer').css('display', 'none');



	});


	$jQ(oos).click(function() {

		// change font colors for nav
			$jQ(this).addClass('on');
			$jQ(stndrd).removeClass('on');

		// toggle oos states on and off
			$jQ('.table-row.oos').find('.cart-product-image').toggleClass('oos');
			$jQ('.table-row.oos').find('.oos-msg').toggle();

	});


	$jQ(too).click(function() {

		// change font colors for nav
			$jQ(this).addClass('on');
			$jQ(stndrd).removeClass('on');

			$jQ('#too-many-modal').toggle();

	});
