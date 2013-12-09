<?php

define("DEBUG", TRUE);

$config = array(
	"db" => array(
		"host" => "localhost",
		"database" => "DBNAME",
		"port" => 5432,
		"user" => "USERNAME",
		"password" => "PASSWORD"
	),
  "rest" => array(
    "origin" => "*",
    "age" => 8*60*60, // 8h
    "path" => "cache",
    "size" => 1024*1024*1024 // 1GB
  )
);

?>