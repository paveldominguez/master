

// Minicart ............................................................................................

	// initial click : extend minicart box height if required
	$jQ('#nav-cart').one('mouseenter', function() {
	
	 	var bannerCt = $jQ('#minicart-banner-box').find('.minicart-banner').length;
		var cartCt = $jQ('#minicart-cart').find('.minicart-item').length;
		if (cartCt >= bannerCt ){
			setTimeout(function(){
				var cartHt = $jQ('#minicart-cart').height();
				//alert(cartHt);
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
	// set up phone number
	
		jQuery.validator.addMethod("phoneUS", function(phone_number, element) {
    		phone_number = phone_number.replace(/\s+/g, ""); 
			return this.optional(element) || phone_number.length > 9 && phone_number.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/);
		}, "Please specify a valid phone number");
	
	
	// validation rules : 'begin checkout' > sign into Verizon	
		$jQ('#my-Verizon-login').validate({
			rules: {
				myVerizonEmail: {
					required: true,
					email: true
				},
				myVerizonPassword: {
					required: true,
					minlength: 4
				}
			},
			
			messages: {
				myVerizonEmail: "Please enter a valid email address",
				myVerizonPassword: {
					required: "Please enter your password",
					minlength: "Your password must be at least 4 characters long"
				}
			}
		});	
			
	// validation rules : 'begin checkout' > create login 
	
		$jQ('#create-vzn-login').validate({
		
			rules: {
				createLoginFromMobile: {
					required: true,
					phoneUS: true,	
				},
				createLoginPassword: {
					required: true,
					minlength: 4
				},
				createLoginVerify: {
					equalTo: '#new-vzn-password'
				}
			},
			
			messages: {
				createLoginFromMobile: {
					required: "Please enter your Verizon Wireless number",
					phoneUS: "Please enter your Verizon Wireless number"
					},
				createLoginPassword: {
					required: "Please enter a password",
					minlength: "Your password must be at least 4 characters long"
					},
				createLoginVerify: {
					required: 'Please re-enter your password to confirm',
					equalTo: 'Sorry, your passwords don\'t match'
					}
			},
			success: function () {
				//alert('yeah');
			}
		});	
	
		
	// 'begin checkout' : make elements pretty
		$jQ(".create-login-checkbox").uniform();
		$jQ(".begin-checkout-submit").uniform();
		
	// 'begin checkout' : create vzn login
		$jQ('.create-login-checkbox').change(function() {
			$jQ('.create-login-fields').toggle('fast');	
		});
		
	// 'begin checkout' : password requirements
		$jQ('.pass-req').click(function() {
			$jQ('#password-requirements').toggle('fast');
		});


	// 'begin checkout' : successful entrance to guest checkout
		$jQ('#create-vzn-login').submit(function(e) {
			e.preventDefault();
			if ($jQ(this).valid()) {
				$jQ('#begin-checkout').fadeOut(300);
				$jQ('.checkout-title').text('Checkout');
			}
		});
		
		


