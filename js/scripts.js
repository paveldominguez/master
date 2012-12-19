var debounce = (function(){
    var timer = 0;
    return function(callback, ms){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();

jQuery(document).ready(function() {
    var doc = jQuery(window);
    jQuery(window).on('resize', function() { // this is for debugging purposes, can be removed when no longer needed
        debounce(function() {
            console.log('Document width: %dpx', doc.width());
        }, 100);
    });
});