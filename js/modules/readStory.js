MLS.readStory = {

    init: function () {
    	$jQ('#article-modal-overlay').hide();
        $jQ('.content-cta').on('click', MLS.readStory.getArticleContent);
         console.log('v1');
    },
    getArticleContent : function (e) {

        console.log("click on ajax");

        e.preventDefault();
        if ($jQ(this).hasClass('article')) {
            MLS.ajax.sendRequest(
                'sample-response.json',
                { id : $jQ(this).data('article-id') },
                MLS.readStory.displayContent
            );
        }
    },
    displayContent : function (data) {
        MLS.ui.updateContent('#article-detail', data.hasOwnProperty('success') ? data.success.responseHTML : data.error.responseHTML);

        MLS.readStory.onClose();
        MLS.readStory.onOpen();
    },

    onOpen: function(){
        var height = $jQ('#article-detail').height();

        $jQ('#article-detail').css({'top': -1* (height + 160)}).animate({top: 160}, 500, function () {
            $jQ('#article-modal-overlay').fadeIn();
        });
    },

    onClose: function(){
        $jQ('#article-detail .close').unbind().bind('click', function () {
            var height = $jQ('#article-detail').height();
            $jQ('#article-detail').animate({top: '-' + height}, 500, function () {
                $jQ('#article-modal-overlay').fadeOut();
                $jQ('#article-detail').empty();
            });
        });
    }
}