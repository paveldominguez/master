<?php
  error_reporting(E_ALL);
  ini_set("display_errors", 1);

  $docRoot = $_SERVER['DOCUMENT_ROOT'];
  if(!function_exists('glob_recursive')){
    function glob_recursive($pattern, $flags = 0){
      $files = glob($pattern, $flags);
      foreach (glob(dirname($pattern).'/*', GLOB_ONLYDIR|GLOB_NOSORT) as $dir){
        $files = array_merge($files, glob_recursive($dir.'/'.basename($pattern), $flags));
      };
      return $files;
    };
  };


  function curPageURL(){
    $pageURL = 'http';
    $pageURL .= "://";
    if($_SERVER["SERVER_PORT"] != "80"){
      $pageURL .= $_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"];
    }else{
      $pageURL .= $_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"];
    }
   return $pageURL;
  };

?>
