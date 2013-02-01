<?php
  function random_product(){
    $dir = 'img/product-category-listing';
    $files = glob($dir . '/pcl*.jpg');
    $file = array_rand($files);
    echo($files[$file]);
  };
?>


<?php
 if (isset($productCount)) {
    for($n = 0; $n < $productCount; $n++) {
?>


<li class="product">
  <a class="product-link" href="#" title="product title">
    <figure class="product-fig">
      <img alt="<?php random_product();?>" src="<?php random_product();?>"/>
    </figure>
    <ul class="product-detail">
      <li class="name"><span><span class="brand">Klipsch</span> X7i White In-Ear Headphones</span></li>
      <li class="price">$189.00<span class="sale"><!--sale price would go to the left, and original would be here--></span></li>
      <li class="rating"><img src="img/stars-gray.png" /></li>
    </ul>
  </a>
  <div class="product-hover">
    <div class="product-message"><a href="#product-message" title="Sale!">sale 15% off</a></div>
    <div class="color-picker"><a href="#pick-color" title="Select color"><img src="img/colorpicker.png"></a></div>
    <div class="quick-view"><a href="#quick-view" title="Quickview">quickview</a></div>
    <div class="add-cart"><a class="add-cart-cta" href="#add-to-cart" title="Add to Cart"><span>add to cart</span></a></div>
  </div>
</li>

<?php 
  }};
?>