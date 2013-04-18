MLS.ajax = {
    sendRequest : function (url, data, success) {
        $jQ.ajax({
            url: url,
            data: data,
            cache : false,
            success : success,
            dataType: 'json'
        });
    },
    article : {
        init: function () {
            $jQ('.content-cta').on('click', MLS.ajax.article.getArticleContent);
            $jQ('.article-cta').hover(
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
        },
        getArticleContent : function (e) {
            e.preventDefault();
            if ($jQ(this).hasClass('article')) {
                MLS.ajax.sendRequest(
                    this.href,
                    { aritcleId : $jQ(this).data('article-id') },
                    MLS.ajax.article.displayContent
                );
            }
        },
        displayContent : function (data) {
            MLS.ui.updateContent('#article-content', data.hasOwnProperty('success') ? data.success.responseHTML : data.error.responseHTML);
        }
    },
    cart : {
        init : function (context) {
            $jQ(context).on('click', '.add-cart-cta', MLS.ajax.cart.addItem);
        },
        addItem : function (e) {
            console.log('cart');
            e.stopPropagation();
            e.preventDefault();
            var $theForm = $jQ(this.form);
            MLS.ajax.sendRequest(
                $theForm.attr('action'),
                $theForm.serialize(),
                MLS.ajax.cart.addItemSuccess
            );
        },
        addItemSuccess : function (data) {
            if (data.hasOwnProperty('success')) {
                $jQ('#nav-cart, #nav-tab4').addClass('active');
                $jQ('#minicart-item-list').append(data.success.responseHTML);
            }
            else {
                // error, unable to add to cart
                // display error response: .append(data.error.responseHTML);
            }
        }
    },
    homepage : {
        init : function () {
            // homepage madlib
        }
    },
    pdpSearch : {
        init : function () {
            // pdp in-page search functionality
        }
    },
    colorPicker : {
        contentItem : null,
        init : function () {
            $jQ('.content-grid .content-item .colors .color a').on('click', MLS.ajax.colorPicker.updateContent);
        },
        updateContent : function (e) {
            e.preventDefault();
            MLS.ajax.colorPicker.contenItem = $jQ(this).parent().parent().parent(); // re-work this if possible...
            MLS.ajax.sendRequest(
                $jQ(this).href,
                { color : $jQ(this).data('color'), existingImageUrl: $jQ(this).src },
                MLS.ajax.colorPicker.updateContentSuccess
            );
        },
        updateContentSuccess : function (data) {
            MLS.ui.updateContent($jQ(MLS.ajax.colorPicker.contentItem).find('.content-fig'), data.hasOwnProperty('success') ? data.success.responseHTML : data.error.responseHTML);
        }
    }
};