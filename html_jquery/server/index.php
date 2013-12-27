<?php
require_once("config.php");

error_reporting(DEBUG ? E_ERROR : E_NONE);
session_start();

require_once("PostgreSQL.php");
$SQL = new PostgreSQL($config["db"]);

require_once("HTTP.php");
$HTTP = new HTTP($config["http"]);

require_once("Service.php");
$service = new Service($SQL);

if ($HTTP->method == "GET") {
  if ($HTTP->resource == "list") {
    $HTTP->sendResponse($service->getList());
  }

  if ($HTTP->resource == "details") {
    $HTTP->sendResponse($service->getItem($HTTP->params["id"]));
  }

  if ($HTTP->resource == "search") {
    $HTTP->sendResponse($service->search($HTTP->filter["searchterm"]));
  }

  $HTTP->sendStatus(422);
}

if ($HTTP->method == "POST") {
  return $HTTP->sendResponse($service->saveItem($HTTP->params["id"], $HTTP->data));
}

?>