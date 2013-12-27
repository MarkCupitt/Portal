<?php

class Service{

  private $SQL;
  private $table = "service";

  public function __construct($SQL) {
    $this->SQL = $SQL;
  }

  public function search($searchterm = "") {
    $words = preg_split("/\s+/", $searchterm);
    $validWords = array();
    $WHERE = array();
    for ($i = 0; $i < count($words); $i++) {
      $words[$i] = trim($words[$i]);
      if (strlen($words[$i]) < 2) {
        continue;
      }
      $validWords[] = str_replace('%', '\%', $words[$i]);
//      $WHERE[] = "CONCAT_WS(' ', a.title, a.descr, b.crs) LIKE '%%%s%%'";
      $WHERE[] = "CONCAT_WS(' ', title, descr) LIKE '%%%s%%'";
    }
    if (!count($validWords)) {
      return;
    }

    $res = $this->SQL->query("
      SELECT
        *
      FROM
        ".$this->table."
      WHERE
        ".implode(" AND ", $WHERE)
    , $validWords);

    return $res->fetchAll();

  }

  public function getList($filter = NULL) {
    $res = $this->SQL->query("
      SELECT
        id,
        title,
        date,
        descr
      FROM
        ".$this->table."
      ORDER BY
        date
    ");
    return $res->fetchAll();
  }

  public function getItem($id, $filter = NULL) {
    $res = $this->SQL->query("
      SELECT
        id,
        title,
        date,
        descr,
        lang,
        keywords,
        input_format,
        date_creation,
        url_reference,
        url_data,
        is_latest,
        reference_data,
        input_crs
      FROM
        ".$this->table."
      WHERE
        id = %u
    ", array($id));
    return $res->fetchRow();
  }

/* Search by bbox
list($n, $e, $s, $w) = explode(",", $bbox);
...
WHERE
  wkb_geometry && ST_SetSRID(
    ST_MakeBox2D(
      ST_Point(%F,%F),
      ST_Point(%F,%F)
    ), 4326
  )
", array($w, $s, $e, $n));
*/ 

  public function saveItem($id = NULL, $data) {
    $data["reference_data"] = "<"."?xml version=\"1.0\"?><root/>";

    if ($id) {
      $this->SQL->query("
        UPDATE
          ".$this->table."
        SET
          title = '%s',
          date = (TIMESTAMP '%s'),
          descr = '%s',
          lang = %u,
          keywords = %u,
          input_format= %u,
          date_creation = (TIMESTAMP '%s'),
          url_reference = '%s',
          url_data = '%s',
          is_latest = '%s',
          reference_data = XMLParse(DOCUMENT '%s'),
          input_crs = %u
        WHERE
          id = %u
      ", array(
        $data["title"],
        $data["date"],
        $data["descr"],
        $data["lang"],
        $data["keywords"],
        $data["input_format"],
        $data["date_creation"],
        $data["url_reference"],
        $data["url_data"],
        $data["is_latest"],
        $data["reference_data"],
        $data["input_crs"],
        $id
      ));

      return $id;
    }

    $this->SQL->query("
      INSERT INTO
        ".$this->table." (title, date, descr, lang)
      VALUES
        ('%s', CURRENT_DATE, '%s', '%s')
    ", array(
      $data["title"],
//    $data["date"], => CURRENT_DATE
      $data["descr"],
      $data["lang"],
      $data["keywords"],
      $data["input_format"],
      $data["date_creation"],
      $data["url_reference"],
      $data["url_data"],
      $data["is_latest"],
      $data["reference_data"],
      $data["input_crs"]
    ));

    return $SQL->insertId;
  }
}
?>