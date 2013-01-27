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
  <a href="#">
    <figure>
      <img alt="<?php random_product();?>" src="<?php random_product();?>"/>
    </figure>
  </a>
  <div class="product-hover">
    <div class="color-picker"><a href="javascript:void(0)"><img src="img/colorpicker.png"></a></div>
    <div class="quick-view"><a href="javascript:void(0)">quick view</a></div>
  </div>
  <ul class="product-detail">
    <li class="name"><a href="#"><span><span class="brand">Klipsch</span> X7i White In-Ear Headphones</span></a></li>
    <li class="price">$189.00</li>
    <li class="rating"><img src="img/stars-gray.png" /></li>
  </ul>
</li>

<?php 
  }};
?>