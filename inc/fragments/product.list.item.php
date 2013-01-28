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
      <li class="price">$189.00</li>
      <li class="rating"><img src="img/stars-gray.png" /></li>
    </ul>
  </a>
  <div class="product-hover">
    <div class="color-picker"><a href="javascript:void(0)"><img src="img/colorpicker.png"></a></div>
    <div class="quick-view"><a href="javascript:void(0)">quick view</a></div>
  </div>
</li>

<?php 
  }};
?>