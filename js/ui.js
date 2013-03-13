MLS.ui = {
	/* 
	 * Clickable Tabs
	 * @element: (string) parent (containing) element
	 */

	tabs: function(element) {
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

		$jQ(scope + ' > .tab-menu > .tab:first-child').add(scope + ' > .tab-content > .tab:first-child').addClass(activeClass);
	},

	/* 
	 * Navigation Tabs
	 * @element: (string) containing element
	 */
	navTabs : function(element) {
		var scope = element,
			$contentTabs = $jQ(element + ' > .tab-content > .tab'),
			activeClass = "active";

		$jQ(scope + ' > .tab-menu > .tab').each(function(i, el) {
			$jQ(this).add($contentTabs[i]).attr("tab", i + 1);
		});

		$jQ(scope + ' > .tab-menu > .nav-item').on({
			'hover' : function() {
				if($jQ(this).hasClass('tab')) {
					var tab = $jQ(this).attr("tab");
					$jQ(scope + ' > .tab-menu > .tab').add(scope + ' > .tab-content > .tab').removeClass(activeClass);
					$jQ(this).add(scope + ' > .tab-content > .tab[tab=' + tab + ']').addClass(activeClass);

					$jQ(scope).one('mouseleave', function(e) {
						$jQ(scope + ' > .tab-menu > .tab').add(scope + ' > .tab-content > .tab').removeClass(activeClass);
					});
				} else
				if(!$jQ(this).hasClass('.tab')) {
					$jQ(scope + ' > .tab-menu > .tab').add(scope + ' > .tab-content > .tab').removeClass(activeClass);
				}
			},
			'click' : function() {
				if($jQ(this).hasClass('tab')) {
					var tab = $jQ(this).attr("tab");
					$jQ(scope + ' > .tab-menu > .tab').add(scope + ' > .tab-content > .tab').removeClass(activeClass);
					$jQ(this).add(scope + ' > .tab-content > .tab[tab=' + tab + ']').addClass(activeClass);
				}
			}
		});
	},
	/* 
	 * Navigation Accordion (for mobile view)
	 * @element: (string) containing element
	 */
	navAccordion : function(element) {
		var scope = element,
		$accordionTabs = $jQ(scope + ' > .tab > a'),
		activeClass = "active";

		$accordionTabs.on('click', function(e) {
			$jQ(scope + ' > .tab').removeClass(activeClass);
			var $acContent = $jQ(this).next(),
			$wHeight = $jQ(window).outerHeight(),
			$navHeight = $jQ('#nav-mobile-tabs-primary').outerHeight(),
			$acTabHeight = $jQ(scope + ' > .tab').outerHeight();

			if($acContent.hasClass('accordion-content')) {
				e.preventDefault();
				$jQ(this).parent().addClass(activeClass);
				$acContent.css('height', $wHeight);
			}
		});

		$jQ('#nav-mobile-tabs-primary .nav-actions').on('click', function() {
			if($jQ(this).hasClass(activeClass)) {
				$jQ(this).add('.tab').removeClass(activeClass);
			}
		})
	},
	/* 
	 * Update Content
	 * @container: (string) containing element
	 * @data: (string) html data
	 */
	updateContent : function(container, data) {
		$jQ(container).html(data);
	}
};