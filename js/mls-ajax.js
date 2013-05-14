MLS.ajax = {
    sendRequest : function (url, data, success, error) {
        $jQ.ajax({
            url: url,
            data: data,
            cache : false,
            success : success,
            error : error,
            dataType: 'json'
        });
    },

















































    cart : {
        init : function (context) {
            $jQ('.add-cart-cta').on('click', context, MLS.ajax.cart.addItem);
        },
        addItem : function (e) {
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
                if(data.success.itemExists) {
                    //ignore html & update minicart qty

                }


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
                MLS.ajax.quickView.update()
            );
        },
        update: function (data) {
            MLS.ui.updateContent($jQ('.wrapper', '#quick-view-overlay'), data.hasOwnProperty('success') ? data.success.responseHTML : data.error.responseHTML);
            //contentGrid.quickViewShow();
        }
    }
};
