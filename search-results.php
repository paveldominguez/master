<!DOCTYPE html>

<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js lt-ie9" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
  <meta charset="utf-8" />

  <!-- Set the viewport width to device width for mobile -->
  <meta name="viewport" content="width=device-width" />

  <title>Verizon Wireless | Search Results</title>

  <!-- Included CSS Files -->
  <link rel="stylesheet" href="css/styles.css">
  <script src="js/foundation/modernizr.foundation.js"></script>
</head>
<body id="search-results" class="search-results-page content-grid-page">
  <?php include('inc/header.html'); ?>

  <!-- End Header and Nav -->

  <!-- Main Grid Section -->

  <section class="content-grid-section">

    <!-- Begin Search Input Field -->
    <?php include('inc/fragments/search.input.field.php');?>
    <!-- End Search Input Field -->

    <!-- Begin Search Category Tabs -->
    <?php include('inc/fragments/search.category.tabs.php');?>
    <!-- End Search Category Tabs -->

    <!-- Begin Search Results Header -->
    <?php include('inc/fragments/search.results.header.php');?>
    <!-- End Search Results Header -->

    <div class="wrapper">

      <!-- Being Left Column -->
      <aside id="secondary-column" class="secondary-column">
        <?php include('inc/product-filter.html'); ?>
      </aside>
      <!-- End Left Column -->

      <!-- Begin Main Content Container -->      
      <section id="main-column" class="main-column">

        <!-- Begin Product Listing -->
        <ul class="content-grid">
          <?php include('inc/fragments/product.list.featured.item.php');?>
          <?php $productCount = 24; include('inc/fragments/product.list.item.php');?>
        </ul>
        <!-- End Product Listing -->

      </section> 
      <!-- End Main Content Container -->

    </div>
  </section>

  <!-- End Grid Section -->

  <!-- Footer -->

  <?php include('inc/footer.html');?>
</body>
</html>