// var debounce = (function(){
//     var timer = 0;
//     return function(callback, ms){
//         clearTimeout (timer);
//         timer = setTimeout(callback, ms);
//     };
// })();

// Debounce function from underscore.js
var debounce = (function() {
  var timeout;
  return function(func, wait, immediate) {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
})();

jQuery(document).ready(function() {
    var doc = jQuery(window);
    jQuery(window).on('resize', function() { // this is for debugging purposes, can be removed when no longer needed
        debounce(function() {
            console.log('Document width: %dpx', doc.width());
        }, 200);
    });

    jQuery('#product-grid .product').each(function() {
        var context = this;
        jQuery(context).hover(
            function() { // hover in
                jQuery(context).addClass('over');
                jQuery(context).find('.product-hover').fadeIn('fast');
                jQuery(context).find('.rating img').attr('src','img/stars.png');
            },
            function() { // hover out
                jQuery(context).removeClass('over');
                jQuery(context).find('.product-hover').fadeOut('fast');
                jQuery(context).find('.rating img').attr('src','img/stars-gray.png');
            }
        );
    });

    // var simpleTemplate = ['AA...','AA...','.....'];

    // // tiles.js test
    // var el = document.getElementById('product-grid'),
    // grid = new Tiles.Grid(el);
    // grid.template = Tiles.Template.fromJSON(simpleTemplate);

    // grid.resizeColumns = function() {
    //     return this.template.numCols;
    // };

    // // jQuery('#product-grid .product').each(function(i){
    // //     var self = this;
    // //     grid.createTile = function() {
    // //         var tile = new Tiles.Tile(self);
    // //         return tile;
    // //     };
    // // });

    // // set the new template and resize the grid
    // grid.isDirty = true;
    // grid.resize();


    // jQuery(window).on('resize',function() {
    //     grid.resize();
    //     grid.redraw(true);
    // });
    
});


