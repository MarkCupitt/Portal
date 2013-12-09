<?php
header("Content-Type: application/json");

if (isset($_REQUEST["list"])) {
  $res = array();
  for ($i = 0; $i < 10; $i++) {
    $res[] = array(
        "id"    => ($i+1) * 100,
        "title" => "Some title",
        "date"  => date("Y-m-d H:i:s"),
        "descr" => "There is an extraordinary long descripion available"
    );
  }

  echo json_encode($res);
}

if (isset($_REQUEST["details"])) {
  $res = array(
      "id"    => $_REQUEST["id"],
      "title" => "Some title for ID ". $_REQUEST["id"],
      "date"  => date("Y-m-d H:i:s"),
      "descr" => "There is an extraordinary long descripion available\nbut it wraps to a new line.",
      "lang"  => array("de", "en")
  );

  echo json_encode($res);
}
?>