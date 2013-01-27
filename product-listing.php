<!DOCTYPE html>

<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js lt-ie9" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
  <meta charset="utf-8" />

  <!-- Set the viewport width to device width for mobile -->
  <meta name="viewport" content="width=device-width" />

  <title>Verizon Wireless | Product Listing</title>

  <!-- Included CSS Files (Uncompressed) -->
  <!--
  <link rel="stylesheet" href="stylesheets/foundation.css">
  -->
  
  <!-- Included CSS Files (Compressed) -->
  <!-- <link rel="stylesheet" href="css/app.css"> -->
  <link rel="stylesheet" href="css/styles.css">
  <script src="js/foundation/modernizr.foundation.js"></script>
</head>
<body id="product-list" class="product-list">
  <?php include('inc/header.html'); ?>

  <!-- End Header and Nav -->

  <!-- Main Grid Section -->

  <section class="product-list-section">
    <header id="product-list-header" class="product-list-header">
      <div class="wrapper">
        <div class="product-list-heading">
          <h1 class="product-list-category">Headphones</h1>
          <h3 id="product-filter-count" class="product-filter-count"><strong>298</strong> Products</h3>
        </div>
        <div id="sort-options" class="sort-options">
          <ul class="inline-list">
            <li class="active hide-for-touch"><a href="#">All</a><a href="#" class="hover"></a></li>
            <li class="hide-for-touch"><a href="#">Newest</a><a href="#" class="hover"></a></li>
            <li class="hide-for-touch"><a href="#">Highest Rated</a><a href="#" class="hover"></a></li>
            <li class="hide-for-touch"><a href="#">$-$$</a><a href="#" class="hover"></a></li>
            <li class="hide-for-touch"><a href="#">$$-$</a><a href="#" class="hover"></a></li>
            <li id="drawer-filter" class="show-for-touch"><a href="#">filter</a></li>
            <li id="drawer-sort" class="show-for-touch"><a href="#">sort</a></li>
          </ul>
        </div>
      </div>
    </header>

    <div class="wrapper">

      <!-- Being Left Column -->
      <aside id="left-column" class="left-column">
        <?php include('inc/product-filter.html'); ?>
      </aside>
      <!-- End Left Column -->

      <!-- Begin Main Content Container -->      
      <div id="main" class="main">

        <!-- Begin Product Listing -->
        <section class="products">
          <ul id="product-grid" class="product-grid">
            <?php include('inc/fragments/product.featured.item.php');?>
            <?php $productCount = 24; include('inc/fragments/product.list.item.php');?>
          </ul>
        </section>
        <!-- End Product Listing -->

      </div> 
      <!-- End Main Content Container -->

    </div>
</section>

  <!-- End Grid Section -->

  <!-- Footer -->

  <?php include('inc/footer.html');?>
</body>
</html>