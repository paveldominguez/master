MLS.ui = {

	tabs: function(element) {
		var scope = element,
			tabs = $('.tab-content li', scope),
			activeClass = "active";

		$('.tab-menu li', scope).each(function(i, el) {
			$(this).add(tabs[i]).attr("tab", i + 1);
		});

		$('.tab-menu li', scope).on('click', function() {
			var tab = $(this).attr("tab");
			$('.tab-menu li, .tab-content li').removeClass(activeClass);
			$(this).addClass(activeClass);
			$('.tab-content li[tab=' + tab + ']', scope).addClass(activeClass);
		});

		$('.tab-menu li:first-child,.tab-content li:first-child', scope).addClass(activeClass);
	}
};