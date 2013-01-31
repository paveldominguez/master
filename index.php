<?php
  include('inc/phpFunctions/phpFunctions.php');
?>

<!DOCTYPE html>

<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js lt-ie9" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
  <meta charset="utf-8" />
  <title>Verizon Wireless | MLS </title>
  <!-- Set the viewport width to device width for mobile -->
  <meta name="viewport" content="width=device-width" />
  <style>
    body{font-family: Helvetica, Arial, sans-serif;font-size: 11px;}
    h1{color:#BC0301;}
    h2{margin: 0;font-size:12px;}
    a{text-transform: capitalize;}
    ul{margin:20px 0 0 20px;padding: 0 0 0 10px;}
    li{margin: 0 0 10px;font-size: 12px;}
  </style>

</head>
<body class="vzw-mls-pages">
  <h1>Verizon <img src="logo.png" alt="Verizon MLS Logo" /></h1>
  <h2>Template Lising</h2>
  <ul>
    <?php
      $currentURL = curPageURL();
      $paths = array_filter(glob($docRoot.'/*.php'), function($v) {
        return false === strpos($v, 'index.php');
      });
      foreach ($paths as $filename){
        $name = basename($filename);
        $url = $currentURL . $name;
        $url = str_replace(" ","", $url);
        $name = str_replace("-"," ", $name);
        $name = str_replace(".php"," ", $name);
        echo('<li><a href="' . $url .'">'. $name);
      }
    ?>
  </ul>
</body>
</html>
