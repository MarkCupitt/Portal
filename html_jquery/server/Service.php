<?php

class Service{

  private $SQL;
  private $table = "service";

  public function __construct($SQL) {
    $this->SQL = $SQL;
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

  public function getList($filter = NULL) {
    $WHERE    = "1 = 1";
    $ORDER_BY = "date";
    $LIMIT    = 1000000;

    $tags = array();

    if ($filter["search"]) {
      $words = preg_split("/\s+/", $filter["search"]);
      $tags = array();
      $likeStr = array();
      for ($i = 0; $i < count($words); $i++) {
        $words[$i] = trim($words[$i]);
        if (strlen($words[$i]) < 2) {
          continue;
        }
        $tags[] = str_replace('%', '\%', $words[$i]);
        $likeStr[] = "CONCAT_WS(' ', title, descr, keywords, input_crs) ILIKE '%%%s%%'"; // results in: ILIKE '%word%'
      }

      if (count($likeStr)) {
        $WHERE = implode(" AND ", $likeStr);
      } else {
        $LIMIT = 10;
      }
    }

    if ($filter["latest"]) {
      $LIMIT = $filter["latest"];
      $ORDER_BY = "date DESC";
    }

    $res = $this->SQL->query($q="
      SELECT
        id,
        title,
        date,
        descr
      FROM
        ".$this->table."
      WHERE
        $WHERE
      ORDER BY
        $ORDER_BY
      LIMIT
        $LIMIT
    ", $tags);

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
        input_crs,
        ST_AsGeoJSON(
         ST_Transform(
            geometry, 4326
          ), 5
        ) AS geometry
      FROM
        ".$this->table."
      WHERE
        id = %u
    ", array($id));
    $row = $res->fetchRow();
    $row["geometry"] = json_decode($row["geometry"], TRUE);
    return $row;
  }

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
          lang = '%s',
          keywords = '%s',
          input_format= '%s',
          date_creation = (TIMESTAMP '%s'),
          url_reference = '%s',
          url_data = '%s',
          is_latest = '%s',
          reference_data = XMLParse(DOCUMENT '%s'),
          input_crs = '%s',
          geometry = '%s'
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
        $data["geometry"],
        $id
      ));

      return $id;
    }

    $this->SQL->query("
      INSERT INTO
        ".$this->table." (title, date, descr, lang, keywords, input_format, date_creation, url_reference, url_data,
          is_latest, reference_data, input_crs, geometry)
      VALUES
        ('%s', CURRENT_DATE, '%s', '%s', '%s', '%s', CURRENT_DATE, '%s', '%s',
         TRUE, '%s', '%s', '%s')
    ", array(
      $data["title"],
//    $data["date"], => CURRENT_DATE
      $data["descr"],
      $data["lang"],
      $data["keywords"],
      $data["input_format"],
//    $data["date_creation"], => CURRENT_DATE
      $data["url_reference"],
      $data["url_data"],
//    $data["is_latest"], => TRUE
      $data["reference_data"],
      $data["input_crs"],
      $data["geometry"],
      ));

    return $SQL->insertId;
  }
}
?>