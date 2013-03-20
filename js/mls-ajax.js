MLS.ajax = {
    sendRequest : function(url, data, success) {
        $jQ.ajax({
            url: url,
            data: data,
            cache : false,
            success : success,
            dataType: 'json'
        });
    },
    article : {
        init: function() {
            $jQ('.content-cta').live('click', MLS.ajax.article.getArticleContent);
        },
        getArticleContent : function(e) {
            e.preventDefault();
            if($jQ(this).hasClass('article')) {
                MLS.ajax.sendRequest(
                    this.href,
                    { aritcleId : $jQ(this).data('article-id') },
                    MLS.ajax.article.displayContent
                );
            }
        },
        displayContent : function(data) {
            MLS.ui.updateContent('#article-content', data.hasOwnProperty('success') ? data.success.responseHTML : data.error.responseHTML);
        }
    },
    cart : {
        init : function() {
            $jQ('.add-cart-cta').live('click', MLS.ajax.cart.addItem);
        },
        addItem : function(e) {
            e.preventDefault();
            var $theForm = $jQ(this.form);
            MLS.ajax.sendRequest(
                $theForm.attr('action'),
                $theForm.serialize(),
                MLS.ajax.cart.addItemSuccess
            );
        },
        addItemSuccess : function(data) {
            // unable to create complete response handler at the moment (mini cart not complete...)
            // we will provide the proper fragment to return here
            alert(data);
        }
    }
};