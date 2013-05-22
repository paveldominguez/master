MLS.errors = {
	checkForInlineErrors: function(r)
	{
		// r is a server response that might have a 'error'.'inlineHTML' node
		return this.checkForMinicartErrors(r) || this.checkForArticleErrors(r) || this.checkForQuickViewErrors(r);
	},

	checkForMinicartErrors: function(r)
	{
		var $m = $jQ(".complex-item-modal:visible"),
            error = false;

        if ($m.length > 0)
        {
            if (r.hasOwnProperty('error') && r.error.inlineHTML != "") 
            {
                // add inline error
                $m.find(".modal-content > p.error").remove();
                $m.find(".modal-content").prepend($jQ("<p></p>").addClass("error").html(r.error.inlineHTML));
                error = true;
            } 
            else 
            {
                MLS.modal.close($m);
            }
        }

        return error;
	},

	checkForArticleErrors: function(r)
	{
		var $m = $jQ(".article-detail:visible"),
            error = false;

        if ($m.find(".close").length > 0 && r.hasOwnProperty('error') && r.error.inlineHTML != "")
        {
            // add inline error
            $m.children("p.error").remove();
            $m.prepend($jQ("<p></p>").addClass("error").html(r.error.inlineHTML));
            error = true;
        }

        return error;
	},

	checkForQuickViewErrors: function(r)
	{
		var $m = $jQ("#quick-view-overlay:visible"),
            $h = $m.find(".quick-view-header"),
            error = false;

        if ($h.length > 0 && r.hasOwnProperty('error') && r.error.inlineHTML != "")
        {
            // add inline error
            $m.find(".wrapper > p.error").remove();
            $m.find(".wrapper").prepend($jQ("<p></p>").addClass("error").html(r.error.inlineHTML));
            error = true;
        }

        return error;
	}
};