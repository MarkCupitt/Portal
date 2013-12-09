<?php
require_once("config.php");

error_reporting(DEBUG ? E_ERROR : E_NONE);
session_start();

require_once("PostgreSQL.php");
$SQL = new PostgreSQL($config["db"]);

require_once("REST.php");
$REST = new REST($config["rest"]);

// $REST->params
// $REST->filter

if ($REST->resource == "list") {
  $res = $SQL->query("SELECT id, title, date, descr FROM service ORDER BY date");
  return $REST->sendResponse($res->fetchAll());
}

if ($REST->resource == "details") {
  $res = $SQL->query("SELECT id, title, date, descr, lang FROM service WHERE id = %u", array($REST->params["id"]));
  return $REST->sendResponse($res->fetchRow());
}

$REST->sendStatus(422);
?>