<?php

define("DEBUG", TRUE);

$config = array(
	"db" => array(
		"host" => "localhost",
		"database" => "test_db",
		"port" => 5432,
		"user" => "test_user",
		"password" => "test1234"
	),
  "rest" => array(
    "origin" => "*",
    "age" => 8*60*60, // 8h
    "path" => "cache",
    "size" => 1024*1024*1024 // 1GB
  )
);

?>