// Shopping Cart Onload 

	//edit cart button
	
	$jQ('.edit-cart').click(function() {
		editCart(this);
	});










// Shopping Cart Functions

function editCart(button){
	
	var panel = $jQ(button).parent().siblings('.edit-panel');
	
	panel.fadeIn('slow');
	panel.parents('.table-row').addClass('this-row');
	
	//set up close button
	panel.find('.edit-panel-close').click(function(){
		panel.fadeOut('slow');
		panel.parents('.table-row').removeClass('this-row');
	});
	
	
} // end editCart

