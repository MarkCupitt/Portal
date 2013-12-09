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

            var template = '<h1>{title}</h1>'+
                '<p> Datum: {date}</p>'+
                '<p> Beschreibung: {descr}</p>'+
                '<p> Sprachen: {lang}</p>';

            var id = parseInt('<?php echo $_REQUEST["id"]?>', 10);

            $.getJSON('details.json', function(data) {
                template = parse(template, data);

                $( '<p/>', {
                html: template
                }).appendTo('body');
            });

        </script>


    </body>
</html>
