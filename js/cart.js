// Shopping Cart Onload 

	// edit cart button
		$jQ('.edit-cart').click(function() {
			editCart(this);
		});

	// make form elements pretty
		$jQ(".cart-item-qty").uniform();
	 	$jQ("select").uniform();



/* 					<div class="edit-panel"><!-- fades in -->
							
							<div class="edit-panel-close">X</div>
							
							<div class="edit-box qty">
								<div class="edit-label">Qty:</div>
								
									<input type="text" name="quantity" class="cart-item-qty">
								
							</div><!-- end qty detail -->
							
							<div class="edit-box color">
								<div class="edit-label">Color:</div>
								
									<select name="color" class="cart-item-color">
										<option value="black">Black</option>
										<option value="grey">Grey</option>
										<option value="white">White</option>
										<option value="blue">Blue</option>
									</select>
								
							</div><!-- end qty detail -->
							
							<div class="edit-box size">
								<div class="edit-label">Size:</div>
								
									<select name="size" class="cart-item-color">
										<option value="small">Small</option>
										<option value="medium">Medium</option>
										<option value="large">Large</option>	
									</select>
								
							</div><!-- end qty detail -->
						
						
						
*/

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
	
	panel.find('.cart-item-qty').val(currentQty);
	
	panel.find('.cart-item-color option').each(function(){ 
		var thisOption = $jQ(this).text();
		if ( thisOption == currentColor ){
			this.attr('selected', true);
		} else {
		
		}
		//this.selected = (this.text == currentColor);
	
	});
	//val(currentColor);
	
	
	
	
	
	panel.find('.cart-item-size option').val(currentSize);
	
	
	
	
} // end editCart function

