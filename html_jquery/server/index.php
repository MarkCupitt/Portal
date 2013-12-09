<?php
require_once("config.php");

error_reporting(DEBUG ? E_ERROR : E_NONE);
session_start();

require_once("PostgreSQL.php");
//$SQL = new PostgreSQL($config["db"]);

require_once("REST.php");
$REST = new REST($config["rest"]);

// $REST->params
// $REST->filter

if ($REST->resource == "list") {
//  $res = $SQL->query("SELECT id, title, data, descr FROM mytable ORDER BY date");
//  return $REST->sendResponse($res->fetchAll());

  $res = array();
  for ($i = 0; $i < 10; $i++) {
    $res[] = array(
        "id"    => ($i+1) * 100,
        "title" => "Some title". ($i+1),
        "date"  => date("Y-m-d H:i:s"),
        "descr" => "There is an extraordinary long descripion available"
    );
  }

  $REST->sendResponse($res);
}

if ($REST->resource == "details") {
// $res = $SQL->query("SELECT id, title, data, descr FROM mytable WHERE id = %u", $REST->params[]);
// return $REST->sendResponse($res->fetchRow());

  $res = array(
      "id"    => $_REQUEST["id"],
      "title" => "Some title for ID ". $_REQUEST["id"],
      "date"  => date("Y-m-d H:i:s"),
      "descr" => "There is an extraordinary long descripion available\nbut it wraps to a new line.",
      "lang"  => array("de", "en")
  );

  $REST->sendResponse($res);
}

$REST->sendStatus(422);
?>