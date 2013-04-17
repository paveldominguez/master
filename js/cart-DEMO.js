// MINICART/CART/CHECKOUT DEMO js


	var stndrd = document.getElementById('state-standard');
	var sale = document.getElementById('state-sale');
	var oos = document.getElementById('state-oos');
	var too = document.getElementById('state-too-many');
	var miniEmpty = document.getElementById('state-mini-empty');
	var mini1Item = document.getElementById('state-mini-1');
	var mini7Item = document.getElementById('state-mini-7');
	
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
			$jQ(this).toggleClass('on');
			$jQ(stndrd).removeClass('on');
	
		// turn on sale elements, hide standard where req
        	$jQ('.offer').css('display', 'inline-block');
        	$jQ('.no-offer').css('display', 'none');
        	
        	$jQ('.offer-toggle').toggle();
        	
        
        	
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
	
	
	
	
	$jQ(miniEmpty).click(function() {
		var mini1Item = document.getElementById('state-mini-1');
		var mini7Item = document.getElementById('state-mini-7');
		// change font colors for nav
		$jQ(this).addClass('on');
		$jQ(mini1Item).removeClass('on');
		$jQ(mini7Item).removeClass('on');
		//hide items
		$jQ('.minicart-item').removeClass('on');
		//check items and re-layout
		minicartLayout();		
	});
	
	
	
	$jQ(mini1Item).click(function() {
		var miniEmpty = document.getElementById('state-mini-empty');
		var mini7Item = document.getElementById('state-mini-7');
		// change font colors for nav
		$jQ(this).addClass('on');
		$jQ(miniEmpty).removeClass('on');
		$jQ(mini7Item).removeClass('on');
		//show/hide inc fragment
		$jQ('#single-item-inc .minicart-item').addClass('on');
		$jQ('#multi-item-inc .minicart-item').removeClass('on');
		//check items and re-layout	
		minicartLayout();	
	});
		


	$jQ(mini7Item).click(function() {
		var miniEmpty = document.getElementById('state-mini-empty');
		var mini1Item = document.getElementById('state-mini-1');
		// change font colors for nav
		$jQ(this).addClass('on');
		$jQ(miniEmpty).removeClass('on');
		$jQ(mini1Item).removeClass('on');
		//show/hide inc fragment
		$jQ('#single-item-inc .minicart-item').removeClass('on');
		$jQ('#multi-item-inc .minicart-item').addClass('on');
		//check items and re-layout	
		minicartLayout();	
	});


