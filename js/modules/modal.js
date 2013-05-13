MLS.modal = {
	counter: 0,

	open: function(msg)
	{
		msg = msg ? msg : "[modules/modal.js] Generic Error Message";

		MLS.modal.counter++;
		var $overlay = $jQ('<div id="modal-' + MLS.modal.counter + '" style="display: none;"><div class="modal-overlay-background"></div><div class="modal-overlay"><a class="close-btn" href="#"></a><div class="modal-content"></div></div></div>').appendTo("body");
		$overlay.find(".modal-content").html(msg);
		$overlay.find(".close-btn").click(function(e) {
			MLS.modal.close($overlay);
			return false;
		});

		$overlay.fadeIn();
		return $overlay;
	},

	close: function($overlay)
	{
		$overlay.fadeOut(function() {
			$overlay.remove();
		});
	}
};