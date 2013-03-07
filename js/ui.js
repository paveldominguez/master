MLS.ui = {
	// clickable tabs
	tabs: function(element, startOpen) {

		var scope = element,
			$contentTabs = $jQ(scope + ' > .tab-content > .tab'),
			activeClass = "active";

		$jQ(scope + ' > .tab-menu > .tab').each(function(i, el) {
			$jQ(this).add($contentTabs[i]).attr("tab", i + 1);
		});

		$jQ(scope + ' > .tab-menu > .tab').on('click', function(e) {
			e.preventDefault();
			var tab = $jQ(this).attr("tab");
			$jQ(scope + ' > .tab-menu > .tab').add(scope + ' > .tab-content > .tab').removeClass(activeClass);
			$jQ(this).add(scope + ' > .tab-content > .tab[tab=' + tab + ']').addClass(activeClass);
		});

		if( startOpen !== undefined ) {
			$jQ(scope + ' > .tab-menu > .tab:first-child').add(scope + ' > .tab-content > .tab:first-child').addClass(activeClass);
		}
	}
};