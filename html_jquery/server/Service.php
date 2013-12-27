<?php

class Service{

  private $SQL;
  private $table = "service";

  public function __construct($SQL) {
    $this->SQL = $SQL;
  }

  public function search($searchterm = "") {
    $cleanSearchterm = trim($searchterm);
    if ($cleanSearchterm == "") {
      return;
    }

    $sql = "SELECT * FROM ".$this->table." WHERE descr LIKE '%$cleanSearchterm%' OR title LIKE '%$cleanSearchterm%'";

    $res = $this->SQL->query($sql);
    return $res->fetchAll();
/*
    while ($row = $res->fetchRow($res)){
      $title = $row["title"];
      $descr = $row["descr"];
      $input_crs = $row["input_crs"];
      echo $descr." ".$input_crs;
    }
*/
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
        ('%s', '%s', '%s', %s')
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
      $data["input_crs"]
    ));

    return $SQL->insertId;
  }
}
?>