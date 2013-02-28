// Shopping Cart Onload 

	// edit cart button
		$jQ('.edit-cart').click(function() {
			editCart(this);
		});

	// make form elements pretty
		$jQ(".cart-item-qty").uniform();
	 	$jQ("select").uniform();


// Shopping Cart Functions

function editCart(button){
	
	var panel = $jQ(button).parent().siblings('.edit-panel');
	var current = $jQ(button).parent();
	
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










