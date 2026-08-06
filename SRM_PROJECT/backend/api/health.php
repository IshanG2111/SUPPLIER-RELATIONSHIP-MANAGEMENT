<?php
declare(strict_types=1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../config/db.php';

$config = db_config();
$host = $config['host'];
$user = $config['user'];
$name = $config['name'];
$port = $config['port'];
$ssl  = $config['ssl'];

$envDetected = [
    'DB_HOST' => getenv('DB_HOST') !== false ? getenv('DB_HOST') : 'NOT_SET (using default)',
    'DB_PORT' => getenv('DB_PORT') !== false ? getenv('DB_PORT') : 'NOT_SET (using default)',
    'DB_USER' => getenv('DB_USER') !== false ? getenv('DB_USER') : 'NOT_SET (using default)',
    'DB_NAME' => getenv('DB_NAME') !== false ? getenv('DB_NAME') : 'NOT_SET (using default)',
    'DB_SSL'  => getenv('DB_SSL')  !== false ? getenv('DB_SSL')  : 'NOT_SET (using default)',
    'DB_PASS' => getenv('DB_PASS') !== false ? 'SET (hidden)' : 'NOT_SET',
];

$dbTest = [
    'connected' => false,
    'error' => null,
];

try {
    $conn = db_try_connection();
    if ($conn) {
        $dbTest['connected'] = true;
        $res = $conn->query("SELECT 1 AS alive");
        if ($res) {
            $row = $res->fetch_assoc();
            $dbTest['query_test'] = $row['alive'] == 1 ? 'PASSED' : 'FAILED';
        }
        $conn->close();
    } else {
        $testConn = mysqli_init();
        if ($ssl) {
            $testConn->ssl_set(NULL, NULL, NULL, NULL, NULL);
            @$testConn->real_connect($host, $user, $config['pass'], $name, $port, NULL, MYSQLI_CLIENT_SSL);
        } else {
            @$testConn->real_connect($host, $user, $config['pass'], $name, $port);
        }
        $dbTest['error'] = $testConn->connect_error ?: 'Unknown connection failure';
    }
} catch (Throwable $e) {
    $dbTest['error'] = $e->getMessage();
}

echo json_encode([
    'status' => 'ok',
    'timestamp' => date('Y-m-d H:i:s'),
    'environment_variables' => $envDetected,
    'database_config_resolved' => [
        'host' => $host,
        'user' => $user,
        'name' => $name,
        'port' => $port,
        'ssl'  => $ssl,
    ],
    'database_test' => $dbTest,
], JSON_PRETTY_PRINT);
