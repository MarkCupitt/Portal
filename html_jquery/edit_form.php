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

var id = '<?php if (isset($_REQUEST["id"])) echo $_REQUEST["id"]?>';

$(function(){
  $('#btn_save').click(function() {
  $('.input').each(function(i, field) {
    _data[field.name] = field.value;
    });

  $.ajax({
  type: "POST",
  url: 'server/?details/id/'+ id,
  data: _data,
  dataType: 'json',
  success: function(){
    alert('Works!');
    location.href = 'details.php?id='+ id;
  }
  });
  console.log(JSON.stringify(_data));
  });

  $('#btn_cancel').click(function() {
    location.href = 'details.php?id='+ id;
  });

  var json = 'server/?details/id/'+ id;
  var _data;

  if (id !== ''){
  $.getJSON(json, function(data) {
    _data = data;
    $('.input').each(function(i, field) {
      field.value=_data[field.name] || '';
    });
  });
  }
 });
</script>

<div id="content">
  <h1>Form for data editing</h1>
  <form id="editForm">
  <p>Title:<br><input name="title" class="input" type="text" size="30" maxlength="30"></p>
  <!--<p>date:<br><input name="date" class="input" type="text" size="30" maxlength="30"></p>-->
  <p>Description:<br><textarea name="descr" class="input" cols="50" rows="10"></textarea></p>
  <p>Keywords:<br><input name="keywords" class="input" type="text" size="30" maxlength="30"></p>
  <p>Languages:<br><input name="lang" class="input" type="text" size="30" maxlength="30"></p>
  <p>Input-Format:<br><input name="input_format" class="input" type="text" size="30" maxlength="30"></p>
  <p>Date creation:<br><input name="date_creation" class="input" type="text" size="30" maxlength="30"></p>
  <p>Reference:<br><input name="url_reference" class="input" type="text" size="30" maxlength="30"></p>
  <p>URL data:<br><input name="url_data" class="input" type="text" size="30" maxlength="30"></p>
  <p>Up to date?:<br><input name="is_latest" class="input" type="text" size="30" maxlength="30"></p>
  <p>GetCapabilities:<br><input name="reference_data" class="input" type="text" size="30" maxlength="30"></p>
  <p>Input CRS:<br><input name="input_crs" class="input" type="text" size="30" maxlength="30"></p>
  </form>
</div>

<p id="buttons">
  <button id="btn_save" type="button" value="save">SAVE</button>
<button id="btn_cancel" type="button" value ="cancel">CANCEL</button>
</p>

<a href="index.php">Zurück zur Liste</a>

</body>
</html>
