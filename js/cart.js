
MLS.cartCheckout = (function() {
// ONLOAD
	//minicart, cart & checkout
		$jQ("input:submit, input:checkbox, select, .cart-item-qty, .checkout-final").uniform(); // style form elements
		$jQ('.checkout-dropdown').each(function(){
			dropdownDisplay(this);
		}); // display rules for all dropdowns

	//minicart
		minicartTempContent(); // TEMP for demos, PA remove this
		minicartLayout(); // empty state & scrolling controls
		
	 // cart 
	 	checkCartQty();
		



// CART clicks ......................................................................................... 
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
	 	$jQ('.cart-sidebar').find('.special-offer-block').each(function() {
	 		dropdownDisplay(this);
	 	});
	 
	 
	 //sidebar : tax calc submit
	 	// validate zip code
	 	
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
	
	
	// remove item
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
		var name = $jQ(form).find('#vzw-user').val(); // TEMP : swap for backend data: signed-in user first name
		$jQ('#checkout').addClass('visible').addClass('signed-in');
		$jQ('.checkout-title').text('Hi, ' + name + '!').addClass('main');
			if (form.valid()) {
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


	// main checkout sequence : generic next step click
		$jQ('.checkout-next').click(function(e) {
			e.preventDefault();
			var which = $jQ(this).attr('id');
		
		// clear unused fields
			$jQ('.not').remove();
		
		if (which == 'ship-info-complete') { // do this for checkout step 1 only
		// validate shipping method
			var radios = $jQ(this).siblings('.step-info-block').find('.checkout-radio-input');
			var valid = false;
			
			var i = 0;
			$jQ(radios).each(function(i) {
			
				if (this.checked) { 
					//alert(i);
					valid = true; 
					$jQ('#no-shipping-selected').hide();
					var shippingType = $jQ('input[name=shipRadio]:checked').siblings('label').html();
					$jQ('#sum-shipping').html(shippingType);
				} 
				
			}); // end each
			
			if (valid == false ) {
				$jQ('#no-shipping-selected').show();
				// last, scroll page to where all data is visible
        		MLS.ui.scrollPgTo('#no-shipping-selected', 20);	
				return false;
			}
			
		} 
			
		var validator = $jQ("#vzn-checkout").validate(); // do this for both steps 1 & 2
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
        	data = $jQ(this).find(':selected').text();	
        	copySelects( section, slctI, data );	
        });
        

    	if (valid) {
    		//alert('valid');
    		
    		if (section == 'ship-info-complete') { // special case : copy name to additional field	
    			var shipName = $jQ('#ship-name-block').html();
    			$jQ('#copy-ship-name-block').html(shipName).find('.summary').removeClass('summary');
    			
    		// check if home or business and adjust summary accordingly
				var nextDest = $jQ('#checkout-where-to-ship').find('option:selected').val();
				if (nextDest == "business") {
					$jQ('#shipping-info').find('.sum-first-name, .sum-last-name').each(function(){
						$jQ(this).addClass('biz');
					});
				} // else if residence do nothing
			
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
        		MLS.ui.scrollPgTo('#shipping-info', 7);	
        		
    	} else { // scroll page up to first error field
    		$jQ('input').each(function(){
    			if($jQ(this).hasClass('error')){
    			var whichInput = $jQ(this).attr('id');
    			MLS.ui.scrollPgTo('#' + whichInput +'', 40);
    			return false;
    			}
    		});
   
    	}
	}); // end next step click



	
	// main checkout sequence : generic edit step-info (after next-step validation)
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
        	MLS.ui.scrollPgTo (thisStep, 7); 
	});
	
	
	
	
	// main checkout sequence : step 1 home/business select
	$jQ('#checkout-where-to-ship').change(function(){
	
		// check if option has already been changed by user & if so, connect toggling loop
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
		
		// then remove/replace elements as needed
			var removed = $jQ('#destination').find('.not').html();
			$jQ('#destination').find('.not').remove();
			$jQ('#destination').attr('data-removed', removed);
	});
	
	
	
	// main checkout sequence : step 2 billing info
	

	

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
			
		// get saved info and populate form on this click only !!!!!!!!!!!!!!!!!!!!!!!!!!
		
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
	
	
	$jQ('#remove-discount-code').click(function(e){ /*.................... remove discount code ........................*/
		e.preventDefault();
		$jQ('#discount-code-input').removeClass('valid').addClass('hasPlaceholder');
		$jQ('#checkout-cart-discount-code').slideToggle(300);
		$jQ(this).parents('.discount-success').prev('.discount-input').slideToggle(300);	
		$jQ(this).parents('.discount-success').slideToggle(); 
		return false;
	});
	
	
	
	$jQ('#apply-gift-card-1').click(function(e){ /* ........................... apply & validate gift card 1 .......... */
		e.preventDefault();
		$jQ('#vzn-checkout').validate();
        if ($jQ('.GCV').valid()) {  
        	$jQ('#checkout-cart-gift-card-1').slideToggle(300);
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
		$jQ(this).parents('.discount-success').prev('.discount-input').slideToggle();
		$jQ(this).parents('.discount-success').slideToggle();
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
		$jQ(this).parents('.discount-success').prev('.discount-input').slideToggle();
		$jQ(this).parents('.discount-success').slideToggle();
		return false;
	});
	
	
	
	
	
	
	
	
	
	
// CHECKOUT SCROLL
	$jQ(window).scroll(function(){ // side bar floating position
		
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



// FUNCTIONS .....................................................................................

function dropdownDisplay(container){  // ALL dropdown panels
	if ($jQ('html').hasClass('no-touch')){
		var link = $jQ(container).find('.dropdown-link');
		$jQ(link).click(function(e){
			e.preventDefault();
		});
		$jQ(link).hover(
			function() { $jQ(this).next('.dropdown-panel').stop().fadeIn(300); },
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







function minicartLayout(){ // MINICART layout by # of items
	var inMini = $jQ('#minicart-cart').find('.minicart-item').length;
	$jQ('#minicart-cart').find('.minicart-item').first().attr('data-vpos', 0);

	if (inMini < 1) { // layout empty cart
	 	$jQ('#nav-tab4, #checkout-minicart').addClass('empty');					 
	} else if (inMini > 0 && inMini < 4 ) {
		$jQ('#nav-tab4, #checkout-minicart').removeClass('empty');
		$jQ('.minicart-next').css('display', 'none');										
	} else if (inMini > 3) {
		$jQ('#nav-tab4, #checkout-minicart').removeClass('empty');
		$jQ('.minicart-next').addClass('on');			
	}
} // end minicartLayout



function minicartEdit(removeBtn){ // MINICART remove/confirm remove sequence
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
			
		// move up
			$jQ('.minicart-item').each(function(){
				MLS.ui.vScroll(this, newPos);
			});
		//turn on prev
			$jQ('.prev-items-link').addClass('on');
		//turn on next if needed
			$jQ('.next-items-link').removeClass('off');
					
		} else if (newPos == maxScrollPos) { // end
					
		// move up
			$jQ('.minicart-item').each(function(){
				MLS.ui.vScroll(this, newPos);
			});
		//turn off next
			$jQ('.next-items-link').addClass('off');			
		}

	} else {

	// get current position
		var curPos = $jQ('.minicart-item.one').attr('data-vpos');
		var curPosParse = parseInt(curPos, 10);
		
	//calculate new offset before actually moving 
		var newPos = curPosParse + 247;
		
	// check position, move and adjust options as required
		if (newPos == 0) { // beginning/middle
			//move down
			$jQ('.minicart-item').each(function(){
				MLS.ui.vScroll(this, newPos);
			});
			//turn off prev
				$jQ('.prev-items-link').removeClass('on');
			//turn on next
				$jQ('.next-items-link').removeClass('off');
	
		} else { // end
		
			//move down
			$jQ('.minicart-item').each(function(){
				MLS.ui.vScroll(this, newPos);
			});
			//turn on next
			$jQ('.next-items-link').removeClass('off');
		}
	}
} // end minicart scroll function



function enterCheckout() { // CHECKOUT enter main sequence
	window.scrollTo(0,0);
	$jQ('#begin-checkout').fadeOut(300);
	var sidebar = $jQ('.visible #checkout-sidebar');
	var startTop = sidebar.offset().top;
	var startWidth = sidebar.width();
	sidebar.attr({
		'data-start-top' : startTop,
		'data-start-width' : startWidth
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




function copySelects( section, inputI, data ) { // CHECKOUT: copy select input info for summaries on 'next step' clicks
	$jQ('#' + section ).parents('.checkout-step').find('.select-summary').each(function(sumI) {
		if (inputI == sumI ) {
			$jQ(this).text(data);
		}
	});
} // end copySelects









// CHECKOUT VALIDATION RULES .............................................................................

// add these methods to all validation
	
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
			
	
// begin checkout : validation rules & messages	
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
				noPlaceholder: "Please enter your password!",
				minlength: "Your password must be at least 4 characters long"
			}
		}
	});	
				

//  main checkout sequence : validation rules & messages
	$jQ('#vzn-checkout').validate({
		ignore: '.ignore, :hidden',
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
				minlength: 15,
				maxlength:  16,
				digits: true
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
				minlength: "Please enter a valid card number",
				maxlength:  "Please enter a valid card number",
				digits: "Please enter a valid card number"
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

 
// TEMP for  MINI CART TESTING..............................................................

	$jQ('.view-cart').find('a').click(function(){
		alert('view cart clicked');
	});
	
	$jQ('.checkout').find('input').click(function(){
		alert('checkout clicked');
	});

 // END TEMP FOR MINI CART===================
 
 
 
        	

}()); // end namespace bracketing
