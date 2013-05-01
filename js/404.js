MLS.page404 = {
    init : function() {
        var backElem = $jQ('#back');
        backElem.click(function(e){
            history.back();
            e.preventDefault();
        });
    }
};