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

    $doc = new DOMDocument();
    $doc->preserveWhiteSpace = FALSE;
    $doc->loadXML($HTTP->sendRequest($filter["url"]));

    $xpath = new DOMXPath($doc);
    $xpath->registerNamespace("ows", "http://www.opengis.net/ows");
    $xpath->registerNamespace("wfs", "http://www.opengis.net/wfs");
    $xpath->registerNamespace("gml", "http://www.opengis.net/gml");
    $xpath->registerNamespace("ogc", "http://www.opengis.net/ogc");

    $res = array();

    $nodes = $xpath->query("//ows:Title");
    $res["title"] = $nodes->item(0)->nodeValue;

    $nodes = $xpath->query("//ows:Abstract");
    $res["descr"] = $nodes->item(0)->nodeValue;

    $nodes = $xpath->query("ows:ServiceIdentification/ows:Keywords/ows:Keyword");
    $res["keywords"] = array();
    foreach ($nodes AS $item) {
      $res["keywords"][] = $item->nodeValue;
    }

    $res["features"] = array();

    $layerList = $xpath->query("//wfs:FeatureTypeList/wfs:FeatureType");
    foreach ($layerList as $layer) {
      $resLayer = array();

      $nodes = $xpath->query("wfs:Name", $layer);
      $resLayer["featureTypeName"] = $nodes->item(0)->nodeValue;

      $nodes = $xpath->query("wfs:Title", $layer);
      $resLayer["featureTypeTitle"] = $nodes->item(0)->nodeValue;

      $nodes = $xpath->query("wfs:Abstract", $layer);
      $resLayer["featuerTypeAbstract"] = $nodes->item(0)->nodeValue;

      $nodes = $xpath->query("ows:Keywords/ows:Keyword", $layer);
      foreach ($nodes AS $item) {
        $resLayer["featureTypeKeywords"][] = $item->nodeValue;
      }

      $nodes = $xpath->query("wfs:DefaultSRS", $layer);
      foreach ($nodes AS $item) {
        $resLayer["featureTypeCRS"][] = $item->nodeValue;
      }

      $nodes = $xpath->query("wfs:DefaultCRS", $layer);
      foreach ($nodes AS $item) {
        $resLayer["featureTypeCRS"][] = $item->nodeValue;
      }

      $nodes = $xpath->query("ows:WGS84BoundingBox/ows:LowerCorner", $layer);
      $resLayer["featureTypeBBLowerCorner"] = $nodes->item(0)->nodeValue;

      $nodes = $xpath->query("ows:WGS84BoundingBox/ows:UpperCorner", $layer);
      $resLayer["featureTypeBBUpperCorner"] = $nodes->item(0)->nodeValue;

      $res["features"][] = $resLayer;
    }
    // Examples:
    //
    // http://sedac.ciesin.columbia.edu/geoserver/wfs?SERVICE=WFS&REQUEST=GetCapabilities
    // JAN => http://localhost:8000/osm/Portal/html_jquery/server/index.php?import&url=http%3A//sedac.ciesin.columbia.edu/geoserver/wfs%3FSERVICE%3DWFS%26REQUEST%3DGetCapabilities
    // Sören => http://localhost:80/OSMBuildings/Portal/html_jquery/server/index.php?import&url=http%3A//sedac.ciesin.columbia.edu/geoserver/wfs%3FSERVICE%3DWFS%26REQUEST%3DGetCapabilities

    // http://maps.gns.cri.nz/geoserver/wfs?request=GetCapabilities&SERVICE=WFS&REQUEST=GetCapabilities
    // JAN => http://localhost:8000/osm/Portal/html_jquery/server/index.php?import&url=http%3A//maps.gns.cri.nz/geoserver/wfs%3Frequest%3DGetCapabilities%26SERVICE%3DWFS%26REQUEST%3DGetCapabilities
    // Sören => http://localhost:80/OSMBuildings/Portal/html_jquery/server/index.php?import&url=http%3A//maps.gns.cri.nz/geoserver/wfs%3Frequest%3DGetCapabilities%26SERVICE%3DWFS%26REQUEST%3DGetCapabilities


    return $res;
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
