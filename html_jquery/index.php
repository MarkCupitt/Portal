<html>
<head>
<title>Liste</title>
<script src="jquery-2.0.3.js"></script>
<link rel="stylesheet" type="text/css" href="index.css">
</head>

<body>
<script>
function parse(template, data) {
  return template.replace(/\{([\w_]+)\}/g, function(tag, key) {
  return data[key] || tag;
  });
}

var template = '<li><div class="listItem_title"><a href="details.php?id={id}">' +
  '{title}</a></div>'+
  '<div class="listItem_date">{date}</div>' +
  '<div class="listItem_descr">{descr}</div><br>' +
  '</li>';

$(function(){
$.getJSON('server/?list', function(list) {
  var html ='';
  $.each(list, function(i, listItem) {
  html += parse(template, listItem);

  });

  $('<ul/>', {
  'class': 'services',
  html: html
  }).appendTo('#content');
});

$('#btn_add_data').click(function(){
  location.href='edit_form.php';
  });
});
</script>
<div id='content'>
<h1>Web-Services<br></h1>
</div>
<div id="buttons">
<button id="btn_add_data" type="button">Add data</button>
</div>
</body>
</html>