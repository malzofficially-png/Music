<?php
$base = "https://nanzz-music.netlify.app";

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept, X-Requested-With');
header('X-Content-Type-Options: nosniff');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$endpoint = '';
if (!empty($_GET['endpoint'])) $endpoint = trim($_GET['endpoint'], '/');
elseif (!empty($_GET['action'])) $endpoint = trim($_GET['action'], '/');
elseif (!empty($_GET['file'])) $endpoint = str_replace('.json', '', trim($_GET['file'], '/'));
elseif (!empty($_SERVER['PATH_INFO'])) $endpoint = trim($_SERVER['PATH_INFO'], '/');
else {
    $uri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
    $parts = array_values(array_filter(explode('/', trim($uri, '/'))));
    if (!empty($parts)) $endpoint = end($parts);
    if (in_array($endpoint, ['api.php', 'api', ''], true)) $endpoint = '';
}

$allowed = [
    'search'      => ['method' => 'GET'],
    'suggest'     => ['method' => 'GET'],
    'lyrics'      => ['method' => 'GET'],
    'artist'      => ['method' => 'GET'],
    'album'       => ['method' => 'GET'],
    'ytplay'      => ['method' => 'POST'],
    'proxy-audio' => ['method' => 'GET'],
    'proxy-image' => ['method' => 'GET']
];

if (empty($endpoint) || !isset($allowed[$endpoint])) {
    http_response_code(404);
    echo json_encode([
        "status"  => false,
        "error"   => "Unknown endpoint",
        "hint"    => "Format: /music/api.php?endpoint=<search|suggest|lyrics|artist|album|ytplay|proxy-audio|proxy-image>",
        "detected"=> $endpoint
    ]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

$params = $_GET;
unset($params['endpoint'], $params['action'], $params['file']);
$qs = http_build_query($params);

$url = $base . '/api/' . $endpoint;
if ($qs) $url .= '?' . $qs;

$lyr_cache_dir = __DIR__ . '/cache/lyrics';
if ($endpoint === 'lyrics' && !empty($_GET['id'])) {
    if (!is_dir($lyr_cache_dir)) @mkdir($lyr_cache_dir, 0755, true);
    $lyr_key = preg_replace('/[^A-Za-z0-9_-]/', '', (string)$_GET['id']);
    $lyr_file = $lyr_cache_dir . '/' . $lyr_key . '.json';
    if ($lyr_key !== '' && is_file($lyr_file) && (time() - filemtime($lyr_file)) < 2592000) {
        header('X-Cache: HIT');
        readfile($lyr_file);
        exit;
    }
}

$raw = '';
if ($method === 'POST') {
    $raw = file_get_contents('php://input');
    if ($raw === false) $raw = '';
    if (strlen($raw) > 10485760) {
        http_response_code(413);
        echo json_encode(["status" => false, "error" => "Body terlalu besar"]);
        exit;
    }
}

$ch = curl_init($url);
$opts = [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_MAXREDIRS      => 5,
    CURLOPT_TIMEOUT        => 30,
    CURLOPT_CONNECTTIMEOUT => 10,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_SSL_VERIFYHOST => false,
    CURLOPT_USERAGENT      => "Mozilla/5.0 (Malz-Musify Proxy)",
    CURLOPT_HTTPHEADER     => [
        "Accept: application/json, */*",
        "Accept-Language: id,en;q=0.9"
    ]
];

if ($method === 'POST') {
    $opts[CURLOPT_POST] = true;
    $opts[CURLOPT_POSTFIELDS] = $raw !== '' ? $raw : '{}';
    $opts[CURLOPT_HTTPHEADER][] = 'Content-Type: application/json';
}

curl_setopt_array($ch, $opts);
$body = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err  = curl_error($ch);
$ctype = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
curl_close($ch);

if ($body === false || $body === "") {
    http_response_code(502);
    echo json_encode([
        "status" => false,
        "error"  => $err ?: "Upstream tidak memberikan respons",
        "url"    => $url
    ]);
    exit;
}

if (in_array($endpoint, ['proxy-image', 'proxy-audio'], true) && $ctype) {
    $safe_ct = '';
    if ($endpoint === 'proxy-image' && stripos($ctype, 'image/') === 0) $safe_ct = $ctype;
    elseif ($endpoint === 'proxy-audio' && stripos($ctype, 'audio/') === 0) $safe_ct = $ctype;
    elseif ($endpoint === 'proxy-audio' && stripos($ctype, 'application/octet-stream') === 0) $safe_ct = $ctype;

    if ($safe_ct === '') $safe_ct = ($endpoint === 'proxy-image') ? 'image/jpeg' : 'audio/mpeg';

    header('Content-Type: ' . $safe_ct);
    header('Content-Length: ' . strlen($body));
    header('Cache-Control: public, max-age=3600');
    echo $body;
    exit;
}

if (in_array($endpoint, ['search', 'suggest', 'lyrics', 'artist', 'album', 'ytplay'], true)) {
    $test = json_decode($body, true);
    if ($test === null && json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(502);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            "status"   => false,
            "error"    => "Upstream bukan JSON",
            "endpoint" => $endpoint,
            "http"     => $code,
            "preview"  => substr(strip_tags($body), 0, 300)
        ]);
        exit;
    }
}

http_response_code($code ?: 200);

if ($endpoint === 'lyrics' && $code >= 200 && $code < 300 && strlen($body) > 40) {
    $lyr_dir = __DIR__ . '/cache/lyrics';
    if (!is_dir($lyr_dir)) @mkdir($lyr_dir, 0755, true);
    $lyr_id = preg_replace('/[^A-Za-z0-9_-]/', '', (string)($_GET['id'] ?? ''));
    if ($lyr_id !== '') {
        $lyr_path = $lyr_dir . '/' . $lyr_id . '.json';
        $tmp = $lyr_path . '.' . getmypid() . '.tmp';
        if (@file_put_contents($tmp, $body, LOCK_EX) === strlen($body)) @rename($tmp, $lyr_path);
        else @unlink($tmp);
    }
    header('X-Cache: MISS');
}

echo $body;