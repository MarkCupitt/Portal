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
  document.addEventListener('DOMContentLoaded', function(){


var template = $('#content').html();
debugger
console.log(template);
var id = '<?php echo $_REQUEST["id"]?>';
var json = 'details' + id + '.json';
$.getJSON(json, function(data) {
  var html = '';
  html += parse(template, data);
$('#content').html(html);
});

  });

</script>

<p id="content">
  <h1>{title}</h1>
  <p> Datum: {date}</p>
  <p> Beschreibung: {descr}</p>
  <p> Sprachen: {lang}</p>
</p>

<p id='buttons'>
<button name='Edit' type='button'
  value='Editieren' onclick='alert("Editieren");'>EDIT</button>
<button name='Delete' type='button'
  value ='Loeschen' onclick='alert("Löschen");'>DELETE</button>
</p>
<a href='index.php'>Zurück zur Liste</a>

</body>
</html>
