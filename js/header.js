MLS.header = (function () {

    /*=========================================
    =            Private variables            =
    =========================================*/

    var $modal = $jQ('#mls-compatibility-mobile-modal'),
        $input = $jQ('#search-device-or-brand').find('input#search-input'),
        $detectedDevices = $jQ('#compatibility-detected-device'),
        $compatibleDevices = $jQ('#compatibility-devices'),
        $closeButton = $modal.find('.close');

    /*-----  End of Private variables  ------*/

    // function deviceLI (name, url) {
    //     url = url || '#';
    //     var $elem = $jQ('<li><span class="facet-check"></span></li>')
    //             .prepend($jQ('<a href="' + url + '"><span class="facet-name">' + name + '</span>'));

    //     return $elem;
    // }



    var pub = {

        /*===================================
        =            Initializer            =
        ===================================*/

        init : function () {

            pub.openModal(); // demo


            // search text field
            $input.typeahead({
                name: 'devices',
                remote: {
                    url: MLS.ajax.endpoints.SEARCH_DEVICES + '?search=%QUERY'
                },
                limit: 10
            }).on('change keyup typeahead:selected typeahead:closed', pub.getDevices);


            // close modal
            $closeButton.bind('click', pub.closeModal);


        },

        /*-----  End of Initializer  ------*/




        /*================================================
        =            Finalize (unbing events)            =
        =================================================*/

        finalize : function () {
            // search text field
            $input.unbind(pub.getDevices);

            // close modal
            $closeButton.unbind('click', pub.toggleModal);
        },

        /*-----  End of Finalize (unbing events)  ------*/


        /*============================================
        =            Reinit: on ajax load            =
        ============================================*/

        reInit: function () {
            pub.finalize();
            pub.init();
        },

        /*-----  End of Reinit: on ajax load  ------*/



        /*========================================
        =            Open/Close Modal            =
        ========================================*/

        // Using the same toggle approach from content-grid.js
        // so we can re-use the styles.

        openModal: function () {
            var viewportHeight = Response.viewportH();

            $modal.show(function () {
                    $jQ(this).children('.filter-panel').show();
                    $jQ(this).animate({height: viewportHeight});
                });
        },

        closeModal: function () {
            $modal.animate({height: 0}, function () {
                $jQ(this).hide();
            });
        },

        /*-----  End of Open/Close Modal  ------





        /*===================================
        =            Get devices            =
        ===================================*/

        getDevices: function (e, item) {

            if (e.type === 'typeahead:closed') {
                $jQ(this).blur();
            }

            e.type === 'typeahead:selected' && pub.selectDevice(item);

        },

        /*-----  End of Get devices  ------*/



        /*==============================================
        =            Select Device Callback            =
        ==============================================*/

        selectDevice: function (item) {
            // do something...
            alert('item id:' + item.id + ' pressed');
        }

        /*-----  End of Select Device Callback  ------*/




    };

    return pub;

}());