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
<body id="product-grid" class="product-list product-grid">
  <?php include('inc/header.html'); ?>

  <!-- End Header and Nav -->

  <!-- Main Grid Section -->

  <section class="product-list-section">

    <!-- Begin Product List Header -->
    <?php include('inc/fragments/product.list.header.php');?>
    <!-- End Product List Header -->

    <div class="wrapper">

      <!-- Being Left Column -->
      <aside id="secondary-column" class="secondary-column">
        <?php include('inc/product-filter.html'); ?>
      </aside>
      <!-- End Left Column -->

      <!-- Begin Main Content Container -->      
      <div id="main-column" class="main-column">

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