<?php

class Service{

  private $SQL;
  private $table = "service";

  public function __construct($SQL) {
    $this->SQL = $SQL;
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
        lang
      FROM
        ".$this->table."
      WHERE
        id = %u
    ", array($id));
    return $res->fetchRow();
  }

  public function saveItem($id = NULL, $data) {
    if ($id) {
      $this->SQL->query("
        UPDATE
          ".$this->table."
        SET
          title = '%s',
          date = '%s',
          descr = '%s',
          lang = '%s'
        WHERE
          id = %u
      ", array(
        $data["title"],
        $data["date"],
        $data["descr"],
        $data["lang"],
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
      $data["lang"]
    ));

    return $SQL->insertId;
  }
}
?>