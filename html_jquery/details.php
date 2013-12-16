<!DOCTYPE html>
<html>
<head>
<title>Details</title>
<meta http-equiv="content-type" content="text/html; charset=utf-8">
<link rel="stylesheet" type="text/css" href="index.css">
<script src="js/jquery-2.0.3.js"></script>
<script src="js/util.js"></script>
</head>

<body>
<script>
function parse(template, data) {
  return template.replace(/\{([\w_]+)\}/g, function(tag, key) {
    return data[key] || tag;
  });
}

$(function() {
  var template = $('#content').html();
  var id = '<?php echo $_REQUEST["id"]?>';
  var json = 'server/?details/id/'+ id;
  $.getJSON(json, function(data) {
    var html = '';
    html += parse(template, data);
  $('#content').html(html);
  });

  $('#btn_edit').click(function(){
    location.href='edit_form.php?id=' + id;
  });
});
</script>

<div id="content">
  <h1>{title}</h1>
  <p>Date: {date}</p>
  <p>Describtion: {descr}</p>
  <p>Keywords: {keywords}</p>
  <p>Languages: {lang}</p>
  <p>Input Format: {input_format}</p>
  <p>Date creation: {date creation}</p>
  <p>Reference: <a href={url_reference}>{url_reference}</a></p>
  <p>URL data: <a href={url_data}>{url_data}</a></p>
  <p>Up to date?: {is_latest}</p>
  <p>GetCapabilities: <a href={reference_data}>{reference_data}</a></p>
  <p>Input CRS: {input_crs}</p>
</div>

<p id='buttons'>
  <button id='btn_edit' type='button' value='Editieren'>EDIT</button>
  <button id='btn_delete' type='button' value ='Loeschen' onclick='alert("Löschen");'>DELETE</button>
</p>

<a href='index.php'>Zurück zur Liste</a>

</body>
</html>
