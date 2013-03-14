MLS.article = {
    articleHandler : function() {
        var articleLinks = $jQ('.content-cta');
        articleLinks.on('click', MLS.article.getArticleContent);
    },
    getArticleContent : function(e) {
        e.preventDefault();
        if($jQ(this).hasClass('article')) {
            $jQ.ajax({
                url: '../article.html', // this will need to be replaced with the url that will return the article html
                data: { articleId : MLS.util.getUrlParam('articleId') },
                success : MLS.article.displayContent,
                dataType: 'html'
            });
        }
    },
    displayContent : function(data) {
        MLS.ui.updateContent('#article-content', data);
    }
};