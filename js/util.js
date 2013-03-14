MLS.util = {
    getUrlParam : function(param, loc) {
        var results = new RegExp('[\\?&amp;]' + param + '=([^&amp;#]*)').exec(loc);
        return results[1] || 0;
    }
};