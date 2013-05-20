MLS.ajax = {
    starded: false,

    endpoints: {
        CART_PAGE: '/cart-base.html',
        ADD_TO_MINICART: '/services/add_to_minicart.json',
        GET_MINICART: '/services/get_minicart.json',
        REMOVE_FROM_MINICART: '/services/remove_from_minicart.json',
    
        GET_CART: '/services/get_cart.json',
        ADD_TO_CART: '/services/add_to_cart.json',
        UPDATE_CART: '/services/update_cart.json',
        REMOVE_FROM_CART: '/services/remove_from_cart.json',

        GET_CART_DD_ATTRIBUTES: "/services/dd_getAttributes.json",
        
        ARTICLE: '/services/article.json',
        HOMEPAGE_PRODUCTS: '/services/homepage.json',
        SEARCH_DEVICES: '/services/devices.json',

        // Products
        PRODUCT_LISTING: '/services/product-listing.json',
        PRODUCT_LOAD_MORE: '/services/product-listing.json',
        PRODUCT_LOAD_ALL: '/services/product-listing.json',
        PRODUCT_SORT: '/services/product-listing.json',

        // Lifestyle
        LIFESTYLE_LANDING_SEARCH: '/services/lifestyle-landing.json',

        // CONTENT
        CONTENT_FILTER: '/services/content.json',

        // SPECIAL OFFERS
        SPECIAL_OFFERS: '/services/special_offers.json',

        // Product Listing Page
        CATEGORY_PAGE: '/services/category.json',

        // Checkout
        CHECKOUT_SHIPPING_OPTIONS: '/services/checkout_shipping_options.json',
        CHECKOUT_SELECT_SHIPPING: '/services/checkout_select_shipping.json',
        CHECKOUT_STEP_1: '/services/checkout_step_1.json',
        CHECKOUT_STEP_2: '/services/checkout_step_2.json',
        CHECKOUT_STEP_3: '/checkout-success.html',

        CHECKOUT_APPLY_DISCOUNT: '/services/checkout_apply_discount.json',
        CHECKOUT_APPLY_GIFTCARD: '/services/checkout_apply_giftcard.json',

        // Quick View
        QUICKVIEW_DETAILS: '/services/quickview_details.json'
    },

    init: function () {
        if (!this.started)
        {
            var $loadingModal = null;
            $jQ(document).ajaxStart(function () {
                if ($loadingModal === null)
                {
                    $loadingModal = MLS.modal.open('<img src="/img/ajax-loader.gif" alt="loading..."" />', true);
                }
            });

            $jQ(document).ajaxStop(function () {
                if ($loadingModal !== null)
                {
                    MLS.modal.close($loadingModal);
                    $loadingModal = null;
                }
            });

            this.started = true;
        }
    },

    sendRequest : function (url, data, success, error) {
        this.init();

        $jQ.ajax({
            // type: "POST",
            url: url,
            data: data,
            cache : false,
            success : success,

            error : error || function () {
                MLS.modal.open('Server is not responding,<br />please refresh and try again.');
            },
            dataType: 'json'
        });
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


    quickView: {
        init: function (pid, el) {
            MLS.ajax.sendRequest(
                MLS.ajax.endpoints.QUICKVIEW_DETAILS,
                pid,
                function(data) {
                    MLS.ajax.quickView.update(data, el);
                }
            );
        },

        update: function (data, el) {
            if (data.hasOwnProperty('error') && data.error.responseHTML != "") {
                return MLS.modal.open(data.error ? data.error.responseHTML : null);
            }

            MLS.ui.updateContent($jQ('.wrapper', '#quick-view-overlay'), data.success.responseHTML);
            contentGrid.quickViewShow(el);
        }
    }
};
