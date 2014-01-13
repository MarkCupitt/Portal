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
        $likeStr[] = "CONCAT_WS(' ', title, descr, keywords, source_crs) ILIKE '%%%s%%'"; // results in: ILIKE '%word%'
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

    $res = $this->SQL->query("
      SELECT
        id,
        title,
        date,
        descr,
        ST_AsGeoJSON(ST_Centroid(geometry), 5) AS center
      FROM
        ".$this->table."
      WHERE
        $WHERE
      ORDER BY
        $ORDER_BY
      LIMIT
        $LIMIT
    ", $tags);

    $data = array();

    while ($row = $res->fetchRow()) {
      $center = json_decode($row["center"], TRUE);
      $row["center"] = array(
        "latitude"=>$center["coordinates"][1],
        "longitude"=>$center["coordinates"][0]
      );
      $data[] = $row;
    }

    return $data;
  }

  public function importItem($filter = NULL) {
    global $HTTP;

    $res = array();

    $str = $HTTP->sendRequest($filter["url"]);

    $xml = simplexml_load_string($str);
    $xml->registerXPathNamespace("wms", "http://www.opengis.net/wms");

    // http://cmgds.marine.usgs.gov/geoserver/bathy/ows?SERVICE=WMS&SERVICE=WMS&REQUEST=GetCapabilities
    // => http://localhost:8000/osm/Portal/html_jquery/server/index.php?import&url=http%3A//cmgds.marine.usgs.gov/geoserver/bathy/ows%3FSERVICE%3DWMS%26SERVICE%3DWMS%26REQUEST%3DGetCapabilities

    $res = $xml->xpath("wms:Service/wms:Title");

    return $res;


//    var_dump($res);
//
//    exit;
//
//    return $res;
  }

  public function getItem($id, $filter = NULL) {
    $res = $this->SQL->query("
      SELECT
        id,
        title,
        date,
        descr,
        keywords,
        source_format,
        source_date,
        url_reference,
        source_url,
        import_url,
        is_latest,
        reference_data,
        source_crs,
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
          keywords = '%s',
          source_format= '%s',
          source_date = (TIMESTAMP '%s'),
          url_reference = '%s',
          source_url = '%s',
          import_url = '%s',
          is_latest = '%s',
          reference_data = XMLParse(DOCUMENT '%s'),
          source_crs = '%s',
          geometry = ".(isset($data["geometry"]) ? "ST_GeometryFromText('".$data["geometry"]."', 4326)" : NULL)."
        WHERE
          id = %u
      ", array(
        $data["title"],
        $data["date"],
        $data["descr"],
        $data["keywords"],
        $data["source_format"],
        $data["source_date"],
        $data["url_reference"],
        $data["source_url"],
        $data["import_url"],
        $data["is_latest"],
        $data["reference_data"],
        $data["source_crs"],
        $id
      ));

      return $id;
    }

    $this->SQL->query("
      INSERT INTO
        ".$this->table." (title, date, descr, keywords, source_format, source_date, url_reference, source_url, import_url,
          is_latest, reference_data, source_crs, geometry)
      VALUES
        ('%s', CURRENT_DATE, '%s', '%s', '%s', CURRENT_DATE, '%s', '%s', '%s',
         TRUE, '%s', '%s', ".(isset($data["geometry"]) ? "ST_GeometryFromText('".$data["geometry"]."', 4326)" : NULL).")
    ", array(
      $data["title"],
//    $data["date"], => CURRENT_DATE
      $data["descr"],
      $data["keywords"],
      $data["source_format"],
//    $data["source_date"], => CURRENT_DATE
      $data["url_reference"],
      $data["source_url"],
      $data["import_url"],
//    $data["is_latest"], => TRUE
      $data["reference_data"],
      $data["source_crs"]
    ));

    return $this->SQL->insertId;
  }
}
?>