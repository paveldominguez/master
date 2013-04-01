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
            $jQ('.content-cta').on('click', MLS.ajax.article.getArticleContent);
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
            $jQ('.add-cart-cta').on('click', MLS.ajax.cart.addItem);
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
            if(data.hasOwnProperty('success')) {
                $jQ('#minicart-item-list').append(data.success.responseHTML);
            }
            else {
                // error, unable to add to cart
                // display error response: .append(data.error.responseHTML);
            }
        }
    },
    minicart : {
        init : function() {
            // remove item from mini cart
        }
    },
    homepage : {
        init : function() {
            // homepage madlib
        }
    },
    pdpsearch : {
        init : function() {
            // pdp in-page search functionality
        }
    },
    colorPicker : {
        contentItem : null,
        init : function() {
            $jQ('.content-grid .content-item .colors .color a').on('click', MLS.ajax.colorPicker.updateImage);
        },
        updateImage : function(e) {
            e.preventDefault();
            MLS.ajax.colorPicker.contenItem = $jQ(this).parent().parent().parent();
            MLS.ajax.sendRequest(
                $jQ(this).href,
                { color : $jQ(this).data('color'), existingImageUrl: $jQ(this).src },
                MLS.ajax.colorPicker.updateImageSuccess
            );
        },
        updateImageSuccess : function(data) {
            MLS.ui.updateContent($jQ(MLS.ajax.colorPicker.contentItem).find('.content-fig'), data.hasOwnProperty('success') ? data.success.responseHTML : data.error.responseHTML);
        }
    }
};