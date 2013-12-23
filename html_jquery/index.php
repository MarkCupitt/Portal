<!DOCTYPE html>
<html>
<head>
<title>Liste</title>
<meta http-equiv="content-type" content="text/html; charset=utf-8">
<link rel="stylesheet" type="text/css" href="index.css">
<script src="js/jquery-2.0.3.js"></script>
<script src="js/util.js"></script>
</head>

<body>
<script>
var template = '<li><div class="listItem_title"><a href="details.html?id={id}">' +
  '{title}</a></div>'+
  '<div class="listItem_date">{date}</div>' +
  '<div class="listItem_descr">{descr}</div><br>' +
  '</li>';

$(function() {
  $.getJSON('server/?list', function(list) {
  var html = '';
  $.each(list, function(i, listItem) {
    html += util.parse(template, listItem);
  });

  $('<ul/>', {
  'class': 'services',
  html: html
  }).appendTo('#content');
  });

  $('#btn_add_data').click(function() {
    location.href = 'edit.html';
  });
});
</script>

<div id="content">
<h1>Web-Services<br></h1>
</div>
<div id="buttons">
<button id="btn_add_data" type="button">Add data</button>
</div>
<div id="search">
<form action="index.php" method="POST">
<input type="text" name="searchbox">
<input type="submit" name="btn_search_enter" value="Search">
</form>
</div>
<?php
if(isset($_POST['btn_search_enter'])){
  $host = 'localhost';
  $port = 5432;
  $db_name = 'test_db';
  $user = 'test_user';
  $password = 'test1234';
  $con = pg_connect("host=$host port=$port dbname=$db_name user=$user password=$password");
  $searchterm = trim(htmlentities(stripslashes(pg_escape_string($_POST['searchbox']))));

  $sql = 'SELECT * FROM service WHERE
  descr LIKE '%$searchterm%' OR
  input_crs LIKE '%$searchterm%'
  ';

  $query =  pg_query($con, $sql);
  echo '<ul>';
  WHILE ($row = pg_fetch_assoc($query)){
  $title = $row['title'];
  $descr = $row['descr'];
  $input_crs = $row['input_crs'];
  echo '<li>TEST $descr $ input_crs</li>';
  }
  echo '</ul>';
  }
?>

</body>
</html>
