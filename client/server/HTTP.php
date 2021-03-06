<?php
/*
 * @date 2014-01-13 12:30
 */
class HTTP {

  private $config;
  private $uid;

  private $statusCodes = array(
    100 => "Continue",
    101 => "Switching Protocols",
    102 => "Processing",

    200 => "OK",
    201 => "Created",
    202 => "Accepted",
    203 => "Non-Authoritative Information",
    204 => "No Content",
    205 => "Reset Content",
    206 => "Partial Content",
    207 => "Multi-Status",
    208 => "Already Reported",
    226 => "IM Used",

    300 => "Multiple Choices",
    301 => "Moved Permanently",
    302 => "Found",
    303 => "See Other",
    304 => "Not Modified",
    305 => "Use Proxy",
//  306 => "",
    307 => "Temporary Redirect",
    308 => "Permanent Redirect",

    400 => "Bad Request",
    401 => "Unauthorized",
    402 => "Payment Required",
    403 => "Forbidden",
    404 => "Not Found",
    405 => "Method Not Allowed",
    406 => "Not Acceptable",
    407 => "Proxy Authentication Required",
    408 => "Request Time-out",
    409 => "Conflict",
    410 => "Gone",
    411 => "Length Required",
    412 => "Precondition Failed",
    413 => "Request Entity Too Large",
    414 => "Request-URL Too Long",
    415 => "Unsupported Media Type",
    416 => "Requested range not satisfiable",
    417 => "Expectation Failed",
//  418 => "I'm a teapot",
    420 => "Policy Not Fulfilled",
    421 => "There are too many connections from your internet address",
    422 => "Unprocessable Entity",
    423 => "Locked",
    424 => "Failed Dependency",
    425 => "Unordered Collection",
    426 => "Upgrade Required",
    429 => "Too Many Requests",
    428 => "Precondition Required",
    431=> "Request Header Fields Too Large",
//  444 => "No Response",
//  449 => "The request should be retried after doing the appropriate action",
    451	=> "Unavailable For Legal Reasons",

    500 => "Internal Server Error",
    501 => "Not Implemented",
    502 => "Bad Gateway",
    503 => "Service Unavailable",
    504 => "Gateway Time-out",
    505 => "HTTP Version not supported",
    506 => "Variant Also Negotiates",
    507 => "Insufficient Storage",
    508	=> "Loop Detected",
    509 => "Bandwidth Limit Exceeded",
    510 => "Not Extended"
  );

  public $method;
  public $data;
  public $resource;
  public $params;
  public $filter;

  public function __construct($config) {
    $this->config = $config;

    $this->method = $_SERVER["REQUEST_METHOD"];
    switch ($this->method) {
      case "OPTIONS":
        $this->sendCorsHeaders();
        header("Access-Control-Allow-Methods: HEAD, GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: X-Requested-With, Content-Type");
        exit;

      case "POST":
        if (stripos($_SERVER["HTTP_CONTENT_TYPE"], "application/json") === 0) {
          $this->data = json_decode(file_get_contents("php://input"), TRUE);
        } else {
          $this->data = $_POST;
        }
      break;
    }

    $this->uid = md5($_SERVER["QUERY_STRING"]);
    $this->sendCacheHeaders();

    $queryParts = explode("&", $_SERVER["QUERY_STRING"]);

    $path = preg_replace("/\/$/", "", $queryParts[0]);
    $params = explode("/", $path);
    $this->resource = array_shift($params);
    if (!$this->resource) {
      $this->sendStatus(422);
    }

    $this->params = array();
    for ($i = 0; $i < count($params); $i+=2) {
      $this->params[ $params[$i] ] = $params[$i+1] ? $params[$i+1] : "";
    }

    unset($_REQUEST[$queryParts[0]]);
    $this->filter = $_REQUEST;

    $cached = $this->getFromCache($this->uid);
    if ($cached) {
      $this->sendResponse(json_decode($cached));
    }
  }

  private function createCacheFilename($key) {
    return $this->config["cachePath"]."/".md5($key).".json";
  }

  private function addToCache($key, $value) {
    $fileName = $this->createCacheFilename($key);
    $this->purgeCache();
    return file_put_contents($fileName, $value);
  }

  private function getFromCache($key) {
    if (DEBUG) {
      return;
    }
    $fileName = $this->createCacheFilename($key);
    return file_get_contents($fileName);
  }

  private function purgeCache() {
		$sum = 0;
    $cache = array();
		$fp = opendir($this->config["cachePath"]);
		if ($fp) {
			while ($item = readdir($fp)) {
        $fileName = $this->config["cachePath"]."/$item";
				if (!is_file($fileName)) {
					continue;
				}
				$fileSize = filesize($fileName);
				$sum += $fileSize;
				$cache[ filemtime($fileName) ] = array("name"=>$fileName, "size"=>$fileSize);
			}
			closedir($fp);
		}

    ksort($cache);
    while($sum > $this->config["cacheSize"]) {
      $file = array_shift($cache);
      $sum -= $file["size"];
      unlink($file["name"]);
    }
  }

  private function sendCorsHeaders() {
    header("Access-Control-Allow-Origin: ".$this->config["authOrigin"]);
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Max-Age: ".$this->config["authMaxAge"]);
  }

  private function sendCacheHeaders() {
    header("Pragma: cache");
    header("Cache-Control: max-age=".$this->config["authMaxAge"]);
    header("Expires: ".gmdate("D, d M Y H:i:s", time()+$this->config["authMaxAge"])." GMT");

    $lastModified = time()-$this->config["authMaxAge"];
    header("Last-Modified: ".gmdate("D, d M Y H:i:s", $lastModified)." GMT");

    if (@strtotime($_SERVER["IF_MODIFIED_SINCE"]) == $lastModified) {
      $this->sendStatus(304);
    }

    if (@$_SERVER["IF_NONE_MATCH"] == $this->uid) {
      $this->sendStatus(304);
    }

    header("Etag: ".$this->uid);
  }

  public function sendResponse($res = NULL) {
    $res = $this->cleanupJson($res);

    $this->sendCorsHeaders();

    if (!$res) {
      $this->sendStatus(204);
    }

    $json = json_encode($res);
    $this->addToCache($this->uid, $json);

    header("Content-Type: application/json; charset=utf-8");
    $this->compressResponse($json);
  }

  public function sendStatus($code = 500, $message = NULL) {
    $code = $this->statusCodes[$code] ? $code : 500;
    header("HTTP/1.1 $code ".$this->statusCodes[$code]);
    echo $message ? $message : $this->statusCodes[$code];
    exit;
  }

  /**
   * remove empty properties from a data object
   * purpose is to keep JSON data as small as possible
   * note: removing an empty associative property is different from removing a numeric one

      array("A", "B", "C")                --> ["A","B","C"]
      array(0=>"A", 1=>"B", 2=>"C")       --> ["A","B","C"]
      array("0"=>"A", "1"=>"B", "2"=>"C") --> ["A","B","C"]
      array("A", "", "C")                 --> {"0":"A","2":"C"}
      array(0=>"A", 1=>"", 2=>"C")        --> {"0":"A","2":"C"}
      array("0"=>"A", "1"=>"", "2"=>"C")  --> {"0":"A","2":"C"}
      array("a"=>"A", "b"=>"B", "c"=>"C") --> {"a":"A","b":"B","c":"C"}
      array("a"=>"A", "b"=>"", "c"=>"C")  --> {"a":"A","c":"C"}

   * @param array obj the data structure to clean up
   * @return array the cleaned data structure
   */
  public function cleanupJson($obj) {
    if (!is_array($obj) && !is_object($obj)) return $obj; // investigates arrays and objects only, returns everything else
    if (!$obj) return NULL; // applies to arrays and objects only

    // associative array
    if (is_object($obj) || array_diff_key($obj, array_keys(array_keys($obj)))) {
      $res = array();
      foreach ($obj as $k=>$v) {
        $v = $this->cleanupJson($v);
//      if ($v !== "" && $v !== NULL && $v !== FALSE) {
        if ($v !== "" && $v !== NULL) {
          $res[$k] = $v;
        }
      }
      return $res;
    }

    $res = array();
    for ($i = 0; $i < count($obj); $i++) {
      $res[$i] = $this->cleanupJson($obj[$i]);
    }

    return $res;
  }

  private function compressResponse($str) {
		preg_match("~(x-)?gzip~i", $_SERVER["HTTP_ACCEPT_ENCODING"], $match);
		$acceptedCompression = $match[0];

		if (!$acceptedCompression || !function_exists("gzcompress") || $_SERVER["HTTP_X_FORWARDED_FOR"]) {
			echo $str;
			exit;
		}

		header("Content-Encoding: $acceptedCompression");
		$size = strlen($str);
		$crc  = crc32($str);
		$compressedStr = gzcompress($str, 3);
		$compressedStr = substr($compressedStr, 0, strlen($compressedStr)-4);
		echo "\x1f\x8b\x08\x00\x00\x00\x00\x00".$compressedStr.pack("V", $crc).pack("V", $size);
		exit;
	}

  public function sendRequest($url) {
    if (!function_exists("curl_init")) {
      die("CURL is not available");
    }

    $c = curl_init();
    curl_setopt($c, CURLOPT_URL, $url);
    curl_setopt($c, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($c, CURLOPT_FOLLOWLOCATION, TRUE);
    curl_setopt($c, CURLOPT_HEADER, FALSE);
    curl_setopt($c, CURLOPT_ENCODING, "");

    $contents = curl_exec($c);

    curl_close($c);

    return $contents;
  }
}
?>