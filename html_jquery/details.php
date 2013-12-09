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
  <p>Datum: {date}</p>
  <p>Beschreibung: {descr}</p>
  <p>Sprachen: {lang}</p>
</div>

<p id='buttons'>
  <button id='btn_edit' type='button' value='Editieren'>EDIT</button>
  <button id='btn_delete' type='button' value ='Loeschen' onclick='alert("Löschen");'>DELETE</button>
</p>

<a href='index.php'>Zurück zur Liste</a>

</body>
</html>
