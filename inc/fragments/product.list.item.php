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


<li class="content-item">
  <a class="content-link" href="#" title="content title">
    <figure class="content-fig">
      <img alt="<?php random_product();?>" src="<?php random_product();?>"/>
    </figure>
    <section class="content-detail">
      <h1 class="name"><span><span class="brand">Klipsch</span> X7i White In-Ear Headphones</span></h1>
      <div class="price">$189.00<span class="sale"><!--sale price would go to the left, and original would be here--></span></div>
      <div class="rating"><img src="img/stars-gray.png" /></div>
    </section>
  </a>
  <div class="content-hover">
    <div class="content-message"><a href="#content-message" title="Sale!">sale 15% off</a></div>
    <div class="color-picker"><a href="#pick-color" title="Select color"><img src="img/colorpicker.png"></a></div>
    <div class="quick-view"><a href="#quick-view" title="Quickview">quickview</a></div>
    <div class="add-cart"><a class="button add-cart-cta" href="#add-to-cart" title="Add to Cart"><span>add to cart</span></a></div>
  </div>
</li>

<?php 
  }};
?>