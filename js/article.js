MLS.article = {
    articleHandler : function() {
        var articleLinks = $jQ('.content-cta');
        articleLinks.on('click', MLS.article.getArticleContent);
    },
    getArticleContent : function(e) {
        e.preventDefault();
        if($jQ(this).hasClass('article')) {
            $jQ.ajax({
                url: 'sample-response.json', // this will need to be replaced with the url that will return the article json
                data: { articleId : MLS.util.getUrlParam('articleId', this.href) },
                success : MLS.article.displayContent,
                dataType: 'json'
            });
        }
    },
    displayContent : function(data) {
        MLS.ui.updateContent('#article-content', data.responseHTML);
    }
};