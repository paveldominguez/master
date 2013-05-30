var contentLanding = {
    init: function () {
        $jQ('#load-more-articles').on('click', contentLanding.loadMore);
    },

    finalize: function () {
        $jQ('#load-more-articles').unbind('click', contentLanding.loadMore);
    },

    reInit: function () {
        contentLanding.finalize();
        contentLanding.init();
    },

    loadMore: function (e) {
        e.preventDefault();

        var $elem = $jQ(e.currentTarget),
            params,
            $loadMore;

        params = MLS.util.getParamsFromUrl($elem.attr('href'));

        MLS.ajax.sendRequest(
            MLS.ajax.endpoints.CONTENT_LANDING_LOAD_MORE,
            params,
            function (data) {
                if (data.hasOwnProperty('success')) {
                    $loadMore = $jQ('#load-more-articles');
                    // append results
                    $jQ('#main-column').find('.featured-stories').append(data.success.responseHTML);

                    // If there's more results to load
                    if (typeof data.success.more !== 'undefined' && data.success.more.count !== '0') {

                        MLS.ui.socialShare.init();
                        // re-initialize social buttons
                        try {
                            FB.XFBML.parse();
                            twttr.widgets.load();
                        } catch (ex) {}

                        // update data-offset
                        $loadMore.attr('href', data.success.more.url)
                            // update button "load %loadManyMore count" button
                            .find('.article-count').text(data.success.more.count);

                        // update "load remaining %remainingCount products" link
                        $jQ('#load-remaining').find('.article-count').text(data.success.more.remainingCount);

                        $loadMore.show();

                    } else { // hide buttons is there's no more
                        $loadMore.hide();
                    }

                    MLS.article.init();
                }
            }
        );
    }
};
