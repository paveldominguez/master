MLS.modal = {
	counter: 0,

	open: function(msg, noclose)
	{
		msg = msg ? msg : "[modules/modal.js] Generic Error Message";

		MLS.modal.counter++;
		var $overlay = $jQ('<div id="modal-' + MLS.modal.counter + '" class="lightbox-info-block"><div class="modal-overlay-background"></div><div class="modal-overlay"><a class="close-btn" href="#"></a><div class="modal-content"></div></div></div>').appendTo("body"),
			$container = $overlay.find(".modal-overlay"),
			$content = $overlay.find(".modal-content").html(msg);

		$container.css({
			top: $jQ(window).height() - $container.height()
		});

		if (noclose)
		{
			$overlay.find(".close-btn").remove();
		}
		else
		{
			$overlay.find(".close-btn").click(function(e) {
                console.log('closing overlay');
				MLS.modal.close($overlay);
				return false;
			});
		}

		$overlay.hide().fadeIn();
		return $overlay;
	},

	close: function($overlay)
	{
		$overlay.fadeOut(function() {
			$overlay.remove();
		});
	}
};
