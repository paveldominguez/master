MLS.article = {
    callbacks : {
        getArticleContent : function (e) {
            e.preventDefault();
            // if ($jQ(this).hasClass('article')) {
            MLS.ajax.sendRequest(
                MLS.ajax.endpoints.ARTICLE,
                { id : $jQ(this).data('article-id') },
                MLS.article.displayContent
            );
            // }
        }
    },

    init: function (d) {
        d = $jQ(d || document);
    	$jQ('#article-modal-overlay').hide();
        d.find('[data-article-id]').on('click', MLS.article.callbacks.getArticleContent);
        console.log('v5');
    },

    displayContent : function (data) {
        MLS.ui.updateContent('#article-detail', data.hasOwnProperty('success') ? data.success.responseHTML : data.error.responseHTML);

        $jQ('#article-detail .article-cta').hover(
            function () {
                $jQ(this).next('.article-preview-container').show();
            },
            function () {
                $jQ(this).next('.article-preview-container').hide();
            }
        );

        $jQ('#article-detail .close').on('click', function () {
            var height = $jQ('#article-detail').height();
            $jQ('#article-detail').animate({top: '-' + height}, 300, function () {
                $jQ('#article-modal-overlay').fadeOut();
                $jQ('#article-detail').empty();
            });
        });

        MLS.article.onClose();
        MLS.article.onOpen();

        MLS.article.init('#article-detail');
    },

    onOpen: function(){
        var height = $jQ('#article-detail').height();

        $jQ('#article-detail').css({'top': -1 * (height + 160)}).animate({top: 160}, 500, function () {
            $jQ('#article-modal-overlay').fadeIn();
        });

        // $jQ("html,body").animate({ scrollTop: 0 });
    },

    onClose: function(){
        $jQ('#article-detail .close').on('click', function () {
            var height = $jQ('#article-detail').height();
            $jQ('#article-detail').animate({top: '-' + height}, 500, function () {
                $jQ('#article-modal-overlay').fadeOut();
                $jQ('#article-detail').empty();
            });
        });
    }
}