// var debounce = (function(){
//     var timer = 0;
//     return function(callback, ms){
//         clearTimeout (timer);
//         timer = setTimeout(callback, ms);
//     };
// })();
// Debounce function from underscore.js
var debounce=function(){var e;return function(t,n,r){var i=this,s=arguments,o=function(){e=null;r||t.apply(i,s)},u=r&&!e;clearTimeout(e);e=setTimeout(o,n);u&&t.apply(i,s)}}();jQuery(document).ready(function(){var e=jQuery(window);jQuery(window).on("resize",function(){debounce(function(){console.log("Document width: %dpx",e.width())},200)});jQuery("#product-grid .product").each(function(){var e=this;jQuery(e).hover(function(){jQuery(e).addClass("over");jQuery(e).find(".product-hover").fadeIn("fast");jQuery(e).find(".rating img").attr("src","img/stars.png")},function(){jQuery(e).removeClass("over");jQuery(e).find(".product-hover").fadeOut("fast");jQuery(e).find(".rating img").attr("src","img/stars-gray.png")})})});