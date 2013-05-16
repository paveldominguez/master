MLS.util = {
    getUrlParam : function(param, loc) {
        var results = new RegExp('[\\?&amp;]' + param + '=([^&amp;#]*)').exec(loc);
        return results[1] || 0;
    },

    getParamsFromUrl: function (href) {
        var queryParams = [],
            params = {},
            param,
            j = 0;

        console.log(href);

        if (href.match(/\?/)) {
            // make params based on the url located in the a[href]
            queryParams = href.split('?')[1].split('&');

            for (j = 0; j < queryParams.length; j++) {
                param = queryParams[j].split('=');
                params[param[0]] = param[1];
            }
        }

        return params;
    }
};
