
	
	
	

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

	// onload : edit cart button 
		$jQ('.edit-cart').click(function() {
			editCart(this);
		});

	// onload : make form elements pretty 
		$jQ(".cart-item-qty").uniform(); // edit cart text input
	 	$jQ("select").uniform(); //all select/option instances
	 	$jQ("input.button").uniform(); // input type="submit" per ATG spec


// Shopping Cart Functions

function editCart(button){
	
	var panel = $jQ(button).parents('.detail-panel').siblings('.edit-panel');
	var current = $jQ(button).parents('.detail-panel');
	
	panel.fadeIn('slow');
	panel.parents('.table-row').addClass('this-row');
	
	//set up close button
	panel.find('.edit-panel-close').click(function(){
		panel.fadeOut('slow');
		panel.parents('.table-row').removeClass('this-row');
	});
	
	// get values and populate
	var currentQty = current.find('.qty .item-data').text();
	var currentColor = current.find('.color .item-data').text();
	var currentSize = current.find('.size .item-data').text();
	
	// qty
	panel.find('.cart-item-qty').val(currentQty);
	
	//color
	panel.find('.cart-item-color option').each(function(){ 
		var thisOption = $jQ(this).text();
		if ( thisOption == currentColor ){
			//change data
			$jQ(this).attr('selected', true);
			//change output
			$jQ(this).parents('.selector').find('span').text(currentColor);
		} 
	});
	
	// size
	panel.find('.cart-item-size option').each(function(){ 
		var thisOption = $jQ(this).text();
		if ( thisOption == currentSize ){
			//change form data
			$jQ(this).attr('selected', true);
			//change output
			$jQ(this).parents('.selector').find('span').text(currentSize);
		} 
	});

	
	// update cart button
		$jQ(panel).find('.save-cart-changes').click(function() {
			updateCart(panel);
		});
	
} // end editCart function


function updateCart(panel){

	var edit = $jQ(panel);

	// get new values
		var newQty = edit.find('.cart-item-qty').val();
		var newColor = edit.find('.cart-item-color').find(':selected').text();
		var newSize = edit.find('.cart-item-size').find(':selected').text();

	// update static output
		var detail = $jQ(panel).siblings('.detail-panel');
	
		detail.find('.qty').find('.item-data').text(newQty);
		detail.find('.color').find('.item-data').text(newColor);
		detail.find('.size').find('.item-data').text(newSize);
	
	
	// add 'updated' status to button
		detail.find('.updated').fadeIn('fast');
		detail.find('.update-pointer').fadeIn('fast');
	
	// close edit panel
		edit.fadeOut('slow');
		edit.parents('.table-row').removeClass('this-row');
		


} // end updateCart function




// Checkout ............................................................................................
	
	
	
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
	
		// close this panels summary next
			$jQ(this).parents('.step-info-summary').addClass('hidden');

		// show this panels inputs & buttons
        	thisStep.find('.hide-complete').removeClass('hidden');
        	
        // last, scroll page to top of re-opened section
        	scrollPgTo (thisStep, 20);
        	
       
	});
	


// validation rules & messages ( validate.js ) : full checkout sequence


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
					minlength: 16,
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





// STEP 1 SPECIFICS : Residence/business form adjustment

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




// STEP 3 SPECIFICS in user order

	// first, account or card selection
	
		$jQ('.billing-select').change(function(){
		
		// uncheck other option & switch container styles
			$jQ(this).parents('.billing-option').addClass('checked').siblings().find('span').removeClass('checked').find('.billing-select').prop(
				'checked', false).parents('.billing-option').removeClass('checked');
			
		// add checked style to checked 'tab'
		//	$jQ(this).parents('.billing-select-box').find('span.checked').parents('.billing-option').addClass('checked');
		
		// hide unchecked content
			$jQ('.billing-details-block').find('.hidden').removeClass('hidden').siblings().addClass('hidden');
		
	
		// show checked content
		
		
		
		
		
		
		
		});



















// Sidebar : 1024+ responsive positioning

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

function copyInputs( section, inputI, data ) {
	
	//alert(section); alert(inputI); alert(data);
	//alert('yep');
	$jQ('#' + section ).parents('.checkout-step').find('.summary').each(function(sumI) {
		//alert(sumI); alert(data);
		if (inputI == sumI ) {
			//alert('woot!'); alert(data);
			$jQ(this).text(data);
		}
	});
} // end copyInputs


function copySelects( section, inputI, data ) {
	
	//alert(section); alert(inputI); alert(data);
	//alert('yep');
	$jQ('#' + section ).parents('.checkout-step').find('.select-summary').each(function(sumI) {
		//alert(sumI); alert(data);
		if (inputI == sumI ) {
			//alert('woot!'); alert(data);
			$jQ(this).text(data);
		}
	});
} // end copy Selects



function scrollPgTo( where, topPad) {
        if (topPad == undefined) {
            topPadding = 0;
        }
        var moveTo = $jQ(where).offset().top - topPad;
        $jQ('html, body').stop().animate({
            scrollTop: moveTo
        }, 250);
    }















// ............. TEMP state toggle buttons in header .........

	var stndrd = document.getElementById('state-standard');
	var sale = document.getElementById('state-sale');
	
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


