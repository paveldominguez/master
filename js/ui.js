MLS.ui = {

	tabs: function(element, startOpen) {
		var scope = element,
			$tabs = $jQ('.tab-content > .tab', scope),
			activeClass = "active";

		$jQ('.tab-menu > .tab', scope).each(function(i, el) {
			$jQ(this).add($tabs[i]).attr("tab", i + 1);
		});

		$jQ('.tab-menu > .tab', scope).on('click', function(e) {
			e.preventDefault();
			var tab = $jQ(this).attr("tab");
			$jQ('.tab-menu > .tab, .tab-content > .tab').removeClass(activeClass);
			$jQ('.tab-content > .tab[tab=' + tab + ']', scope).addClass(activeClass);
		});

		if( startOpen !== undefined ) {
			$jQ('.tab-menu > .tab:first-child, .tab-content > .tab:first-child', scope).addClass(activeClass);
		}
	}
};