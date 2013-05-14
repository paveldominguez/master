MLS.ajax = {
    endpoints: {
        ADD_TO_CART: "/services/add_to_cart.json",
        REMOVE_FROM_CART: "/services/add_to_cart.json",
        GET_CART: "/services/add_to_cart.json",
        PRODUCT_LISTING: "/services/product-listing.json"
    },

    sendRequest : function (url, data, success, error) {
        $jQ.ajax({
            url: url,
            data: data,
            cache : false,
            success : success,
            error : error || function() {
                MLS.modal.open("Server is not responding,<br />please refresh and try again.");
            },
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
                    { articleId : $jQ(this).data('article-id') },
                    MLS.ajax.article.displayContent
                );
            }
        },

        displayContent : function (data) {
            MLS.ui.updateContent('#article-content', data.hasOwnProperty('success') ? data.success.responseHTML : data.error.responseHTML);
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
    },

    lazyLoad : {
        more : function (e) {
            e.preventDefault();
            console.log('load more');
        },
        remaining : function (e) {
            e.preventDefault();
            console.log('load all');
        }
    },

    gridSort: function (type) {
        console.log('sort by ' + type);
    },

    quickView: {
        init: function (pid, el) {
            //For demo purposes content is already loaded
            contentGrid.quickViewShow(el);
            MLS.ajax.sendRequest(
                this.href,
                { productID : pid },
                MLS.ajax.quickView.update
            );
        },
        update: function (data) {
            MLS.ui.updateContent($jQ('.wrapper', '#quick-view-overlay'), data.hasOwnProperty('success') ? data.success.responseHTML : data.error.responseHTML);
            //contentGrid.quickViewShow();
        }
    }
};
