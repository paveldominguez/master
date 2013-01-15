 // debounce utility from underscorejs.org
 var debounce = function(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        if (immediate && !timeout) func.apply(context, args);
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

jQuery(document).ready(function() {
    // var doc = jQuery(window);
    // jQuery(window).on('resize', function() { // this is for debugging purposes, can be removed when no longer needed
    //     debounce(function() {
    //         console.log('Document width: %dpx', doc.width());
    //     }, 200, true);
    // });


    var simpleTemplate = [
        'AA...',
        'AA...',
        '.....'];

    // tiles test
    var el = document.getElementById('product-grid'),
    grid = new Tiles.Grid(el);

    // set the new template and resize the grid
    grid.template = Tiles.Template.fromJSON(simpleTemplate);
    grid.isDirty = true;
    grid.resize();
    grid.redraw(true);

    // template is selected by user, not generated so just
    // return the number of columns in the current template
    grid.resizeColumns = function() {
        return this.template.numCols;
    };

    jQuery('.products-atf .product').each(function(){
        var self = this;
        grid.createTile = function() {
            var tile = new Tiles.Tile(self);
            return tile;
        };
    });
    
    var debouncedResize = debounce(function() {
        grid.resize();
        grid.redraw(true);
    }, 200);

    jQuery(window).on('resize',debouncedResize);
});

