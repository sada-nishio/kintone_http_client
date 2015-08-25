<?php
    
// HTTP Request2
set_include_path(".;C:\php\pear;D:\home\site\wwwroot\api\HTTP");

require_once('Request2.php');

//header("Content-Type: application/json; charset=utf-8");
header("Content-Type: text; charset=utf-8");

$json_string = file_get_contents('php://input');
$obj = json_decode($json_string, false);

//get Params
$url = $obj->url;
$method = $obj->method;
$header = (array)$obj->headers;
$body = $obj->body;

try {
    // リクエスト作成
    $request = new HTTP_Request2();
    $request->setHeader($header);
    
    $request->setUrl($url);
    
    if ($method == 'GET') {
        $request->setMethod(HTTP_Request2::METHOD_GET);
    } elseif ($method == 'POST') {
        $request->setMethod(HTTP_Request2::METHOD_POST);
    } elseif ($method == 'PUT') {
        $request->setMethod(HTTP_Request2::METHOD_PUT);
    } elseif ($method == 'DELETE') {
        $request->setMethod(HTTP_Request2::METHOD_DELETE);
    } else {
        die;
    }
    
    $request->setBody(trim($body));
    $request->setConfig(array(
      'ssl_verify_host' => false,
      'ssl_verify_peer' => false
    ));

    // レスポンス取得
    $response = $request->send();

// HTTP_Request2のエラーを表示
} catch (HTTP_Request2_Exception $e) {
    die($e->getMessage());
// それ以外のエラーを表示
} catch (Exception $e) {
    die($e->getMessage());
}

// エラー時
if ($response->getStatus() != "200") {
    echo "{";
    echo sprintf("\"httpStatus\":\"%s\"", $response->getStatus());
    echo ",";
    echo sprintf("\"responseHeader\":%s", json_encode($response->getHeader()));
    echo ",";
    $response_body_str = $response->getBody();
    $escape_body = str_replace('"', '\"', $response_body_str);
    $response_body = '"' . $escape_body . '"';
    echo sprintf("\"responseBody\":%s", $response_body);
    echo "}";
} else {
    echo "{";
    echo sprintf("\"httpStatus\":\"%s\"", $response->getStatus());
    echo ",";
    echo sprintf("\"responseHeader\":%s", json_encode($response->getHeader()));
    echo ",";
    $response_body_str = $response->getBody();
    $escape_body = str_replace('"', '\"', $response_body_str);
    $response_body = '"' . $escape_body . '"';
    echo sprintf("\"responseBody\":%s", $response_body);
    //echo sprintf("\"responseBody\":%s", "\"" . $bodyaaa . "\"");
    echo "}";
}
?>
