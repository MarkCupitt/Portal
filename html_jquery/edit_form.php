<!DOCTYPE html>
<html>
<head>
<title>Details</title>
<meta charset="UTF-8">
<script src="jquery-2.0.3.js"></script>
</head>

<body>
<script>
function parse(template, data) {
  return template.replace(/\{([\w_]+)\}/g, function(tag, key) {
  return data[key] || tag;
  });
}

var id = '<?php echo $_REQUEST["id"]?>';

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
  }
  });
  console.log(JSON.stringify(_data));
  });

  $('#btn_cancel').click(function() {
    location.href = 'index.php';
  });

  var json = 'server/?details/id/'+ id;
  var _data;

  $.getJSON(json, function(data) {
    _data = data;
    $('.input').each(function(i, field) {
      field.value=_data[field.name] || '';
    });
  });
});
</script>

<div id="content">
  <h1>Form for data editing</h1>
  <form id="editForm">
  <p>Titel:<br><input name="title" class="input" type="text" size="30" maxlength="30"></p>
  <p>Datum:<br><input name="date" class="input" type="text" size="30" maxlength="30"></p>
  <p>Beschreibung:<br><textarea name="descr" class="input" cols="50" rows="10"></textarea></p>
  <p>Sprachen:<br><input name="lang" class="input" type="text" size="30" maxlength="30"></p>
  </form>
</div>

<p id="buttons">
  <button id="btn_save" type="button" value="save">SAVE</button>
<button id="btn_cancel" type="button" value ="cancel">CANCEL</button>
</p>

<a href="index.php">Zurück zur Liste</a>

</body>
</html>
