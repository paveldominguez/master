MLS.article = {
    init: function (d) {
        //console.log("v5");

        if ($jQ('#article-modal-overlay').length == 0)
        {
            $jQ('<div id="article-modal-overlay" /><div id="article-detail" class="article-detail" />').appendTo("body");
        }

        d = $jQ(d || document);
        $jQ('#article-modal-overlay').hide();
        d.find('.data-article').on('click', function(e){
            e.preventDefault();

           var data = $jQ(this).attr("href").split("?")[1].split("#")[0];

           // console.log("data: ", data);

           MLS.article.getArticleContent(data);
        });
    },

    getArticleContent : function (data) {
        MLS.ajax.sendRequest(
            MLS.ajax.endpoints.ARTICLE,
            data,
            MLS.article.displayContent
        );
    },

    displayContent : function (data) {
        if (MLS.errors.checkForInlineErrors(data))
        {
            return;
        }

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
        var scrollTop = $jQ(window).scrollTop(),
            height = 0;

        if (scrollTop == 0) {
            height = $jQ('#article-detail').height();
        } else {
            height = $jQ('#article-detail').height() + 160;
        }

        $jQ('#article-detail').css({ 
            display: 'block', 
            top: scrollTop - height
        }).animate({
            top: $jQ(window).scrollTop() + 160
        }, 500, function () {
            $jQ('#article-modal-overlay').fadeIn();
        });
    },

    onClose: function(){
        $jQ('#article-detail .close, #article-modal-overlay').unbind().bind('click', function(e) {
            e.preventDefault();
            var scrollTop = $jQ(window).scrollTop(),
                height = 0;

            if (scrollTop == 0) {
                height = $jQ('#article-detail').height();
            }
            else {
                height = $jQ('#article-detail').height() + 160;
            }

            $jQ('#article-detail').animate({top: scrollTop - height}, 500, function () {
                $jQ('#article-modal-overlay').fadeOut();
                $jQ('#article-detail').empty();
            });
        });
    }
}