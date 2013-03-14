MLS.util = {
    getUrlParam : function(param) {
        var results = new RegExp('[\\?&amp;]' + param + '=([^&amp;#]*)').exec(window.location.href);
        return results[1] || 0;
    }
};