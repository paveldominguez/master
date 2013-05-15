MLS.ajax = {
    starded: false,

    endpoints: {
        ADD_TO_MINICART: "/services/add_to_cart.json",
        UPDATE_MINICART: "/services/add_to_cart.json",
        REMOVE_FROM_MINICART: "/services/add_to_cart.json",
        GET_MINICART: "/services/add_to_cart.json",
        GET_CART: "/services/cart.json",
        ARTICLE: "/services/article.json",
        HOMEPAGE_PRODUCTS: "/services/homepage.json",
        SEARCH_DEVICES: "/services/devices.json",

        // Products
        PRODUCT_LISTING: "/services/product-listing.json",
        PRODUCT_LOAD_MORE: "/services/product-listing.json",
        PRODUCT_LOAD_ALL: "/services/product-listing.json",
        PRODUCT_SORT: "/services/product-listing.json",

        // Lifestyle
        LIFESTYLE_LANDING_SEARCH: "/services/lifestyle-landing.json",

        // CONTENT
        CONTENT_FILTER: "/services/content.json",

        // SPECIAL OFFERS
        SPECIAL_OFFERS: "/services/special_offers.json"
    },

    init: function() {
        if (!this.started)
        {
            var $loadingModal = null;
            $jQ(document).ajaxStart(function() {
                if ($loadingModal == null)
                {
                    $loadingModal = MLS.modal.open("<img src='/img/ajax-loader.gif' alt='loading...' />", true);
                }
            });

            $jQ(document).ajaxStop(function() {
                if ($loadingModal != null)
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

    // this is now in the content-grid.js
    // lazyLoad : {
    //     more : function (e) {
    //         e.preventDefault();
    //         console.log('load more');
    //     },
    //     remaining : function (e) {
    //         e.preventDefault();
    //         console.log('load all');
    //     }
    // },

    // gridSort: function (type) {
    //     console.log('sort by ' + type);
    // },

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
