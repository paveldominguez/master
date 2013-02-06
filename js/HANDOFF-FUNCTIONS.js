function includeFragment(path) {
  var filePath = path,
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET",filePath,false);
  xmlhttp.send(null);
  var fileContent = xmlhttp.responseText;
  document.write(fileContent);
}