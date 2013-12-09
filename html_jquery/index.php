<html>
<head>
<title>Liste</title>
<script src="jquery-2.0.3.js"></script>
</head>

<body>
<script>
function parse(template, data) {
  return template.replace(/\{([\w_]+)\}/g, function(tag, key) {
  return data[key] || tag;
  });
}

var template = '<li><a href="details.php?id={id}">' +
  '{title} | '+
  '{date} | ' +
  '{descr}' +
  '</a></li>';

$.getJSON('list2.json', function(list) {
  var html ='';
  $.each(list, function(i, listItem) {
  html += parse(template, listItem);

  });

  $('<ul/>', {
  'class': 'services',
  html: html
  }).appendTo('body');
});

</script>
</body>
</html>