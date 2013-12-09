<html>
<head>
<title>Liste</title>
<script src="jquery-2.0.3.js"></script>
</head>

<body>
<script>
$.getJSON('list2.json', function(list) {
  var html = '';
  $.each(list, function(i, listItem) {
    html += '<li><a href="details.php?id='+ (i+1) +'">'+
      listItem.title + ' | ' + listItem.date + ' | ' + listItem.descr +
      '</a></li>';
  });

  $('<ul/>', {
    'class': 'services',
    html: html
  }).appendTo('body');
});

</script>
</body>
</html>