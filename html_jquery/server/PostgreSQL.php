<?php

class PostgreSQL {

	var $_link;
	var $affectedRows = 0;
	var $insertId = NULL;

	function PostgreSQL($config) {
		$this->_link = pg_connect("host=".$config["host"]." port=".$config["port"]." dbname=".$config["database"]." user=".$config["user"]." password=".$config["password"]." options='--client_encoding=UTF8'");
		if (!$this->_link) {
			$this->_error(pg_last_error());
			return;
		}
	}

	function _error($message) {
		$this->_debug("PostgreSQL ERROR:\n$message");
	}

	function _debug($message) {
		if (!DEBUG) {
			return;
		}
		echo $message;
	}

  function escape($data) {
    if (!is_array($data)) {
      return pg_escape_string($this->_link, $data);
    }
    array_map("pg_escape_string", $data);
    return "'".implode("','", $data)."'";
  }

	function query($query, $args = NULL) {
		if ($args) {
			$query = vsprintf($query, array_map(array($this, "escape"), $args));
		}

		$resId = pg_query($this->_link, $query);

		if (!$resId) {
			$this->_error(pg_last_error()."\n".$query);
			return;
		}

		$this->numRows = pg_affected_rows($this->_link);

		if (preg_match("~^\s*(SHOW|SELECT|DESCRIBE)\s+~", $query)) {
			return new PostgreSQLResult($resId);
		}
	}
}


class PostgreSQLResult {

	var $_id = NULL;
	var $numRows = 0;

	function PostgreSQLResult($id) {
		$this->_id = $id;
		$this->numRows = pg_num_rows($this->_id);
	}

	function fetchRow() {
		return pg_fetch_assoc($this->_id);
	}

	function fetchAll() {
		$data = array();
		while ($row = $this->fetchRow()) {
      $data[] = $row;
    }
		pg_free_result($this->_id);
		return $data;
	}
}
?>