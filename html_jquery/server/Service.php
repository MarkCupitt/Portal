<?php

class Service{

  private $SQL;

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
        service
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
        service
      WHERE
        id = %u
    ", array($id));
    return $res->fetchRow();
  }

  public function saveItem($id = NULL) {
    if ($id) {
      $this->SQL->query("
        UPDATE
          service
        SET
          title = '%s',
          date = '%s',
          descr = '%s',
          lang = '%s'
        WHERE
          id = %u
      ", array(
        $HTTP->params["title"],
        $HTTP->params["date"],
        $HTTP->params["descr"],
        $HTTP->params["lang"],
        $HTTP->params["id"]
      ));

      return $id;
    }

    $this->SQL->query("
      INSERT INTO
        service title, date, descr, lang)
      VALUES
        ('%s', '%s', '%s', %s')
    ", array(
      $HTTP->params["title"],
      $HTTP->params["date"],
      $HTTP->params["descr"],
      $HTTP->params["lang"]
    ));

    return $SQL->insertId;
  }
}
?>