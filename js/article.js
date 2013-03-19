MLS.article = {
    articleHandler : function() {
        $jQ('.content-cta').live('click', MLS.article.getArticleContent);
    },
    getArticleContent : function(e) {
        e.preventDefault();
        if($jQ(this).hasClass('article')) {
            $jQ.ajax({
                url: this.href, // DEV: 'sample-response.json',
                data: { articleId : $jQ(this).data('article-id') },
                success : MLS.article.displayContent,
                dataType: 'json'
            });
        }
    },
    displayContent : function(data) {
        MLS.ui.updateContent('#article-content', data.hasOwnProperty('success') ? data.success.responseHTML : data.error.responseHTML);
    }
};