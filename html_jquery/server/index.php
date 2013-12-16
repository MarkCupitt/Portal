<?php
require_once("config.php");

error_reporting(DEBUG ? E_ERROR : E_NONE);
session_start();

require_once("PostgreSQL.php");
$SQL = new PostgreSQL($config["db"]);

require_once("HTTP.php");
$HTTP = new HTTP($config["http"]);

// $HTTP->params
// $HTTP->filter

if ($HTTP->resource == "list") {
  $res = $SQL->query("SELECT id, title, date, descr FROM service ORDER BY date");
  return $HTTP->sendResponse($res->fetchAll());
}

if ($HTTP->resource == "details") {
  $res = $SQL->query("SELECT id, title, date, descr, lang FROM service WHERE id = %u", array($HTTP->params["id"]));
  return $HTTP->sendResponse($res->fetchRow());
}

$HTTP->sendStatus(422);
?>