// Minicart 

	// initial click : extend minicart box height if required
	$jQ('#nav-cart').one('click', function() {
	
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


// Shopping Cart Page : Onload 

	// edit cart button
		$jQ('.edit-cart').click(function() {
			editCart(this);
		});

	// make form elements pretty
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