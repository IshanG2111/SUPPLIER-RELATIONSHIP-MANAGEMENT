<?php

declare(strict_types=1);

function load_env_file(): void
{
    static $loaded = false;
    if ($loaded) {
        return;
    }
    $loaded = true;

    $envPath = __DIR__ . '/../.env';
    if (!file_exists($envPath)) {
        return;
    }
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        return;
    }

    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }
        if (str_contains($line, '=')) {
            [$key, $val] = explode('=', $line, 2);
            $key = trim($key);
            $val = trim($val, " \t\n\r\0\x0B\"'");
            if (getenv($key) === false) {
                putenv("{$key}={$val}");
                $_ENV[$key] = $val;
                $_SERVER[$key] = $val;
            }
        }
    }
}

function db_config(): array
{
    load_env_file();

    $sslEnv = getenv('DB_SSL');
    $useSsl = ($sslEnv === 'true' || $sslEnv === '1' || strtolower((string)$sslEnv) === 'required');

    return [
        'host' => getenv('DB_HOST') ?: '127.0.0.1',
        'user' => getenv('DB_USER') ?: 'root',
        'pass' => getenv('DB_PASS') ?: '',
        'name' => getenv('DB_NAME') ?: 'srm_portal',
        'port' => getenv('DB_PORT') ? (int)getenv('DB_PORT') : 3306,
        'ssl'  => $useSsl,
    ];
}

function db_connection(): mysqli
{
    $config = db_config();
    $connection = mysqli_init();

    if ($connection === false) {
        http_response_code(500);
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        echo json_encode([
            'success' => false,
            'message' => 'Database initialization failed.',
        ]);
        exit;
    }

    if ($config['ssl']) {
        $connection->ssl_set(NULL, NULL, NULL, NULL, NULL);
        $connected = @$connection->real_connect(
            $config['host'],
            $config['user'],
            $config['pass'],
            $config['name'],
            $config['port'],
            NULL,
            MYSQLI_CLIENT_SSL
        );
    } else {
        $connected = @$connection->real_connect(
            $config['host'],
            $config['user'],
            $config['pass'],
            $config['name'],
            $config['port']
        );
    }

    if (!$connected || $connection->connect_error) {
        http_response_code(500);
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        echo json_encode([
            'success' => false,
            'message' => 'Database connection failed: ' . ($connection->connect_error ?? 'Unable to connect'),
        ]);
        exit;
    }

    $connection->set_charset('utf8mb4');
    return $connection;
}

function db_try_connection(): ?mysqli
{
    try {
        $config = db_config();
        mysqli_report(MYSQLI_REPORT_OFF);
        $connection = mysqli_init();

        if ($connection === false) {
            return null;
        }

        if ($config['ssl']) {
            $connection->ssl_set(NULL, NULL, NULL, NULL, NULL);
            $connected = @$connection->real_connect(
                $config['host'],
                $config['user'],
                $config['pass'],
                $config['name'],
                $config['port'],
                NULL,
                MYSQLI_CLIENT_SSL
            );
        } else {
            $connected = @$connection->real_connect(
                $config['host'],
                $config['user'],
                $config['pass'],
                $config['name'],
                $config['port']
            );
        }

        if (!$connected || $connection->connect_error) {
            return null;
        }
        $connection->set_charset('utf8mb4');
        return $connection;
    } catch (Throwable $e) {
        return null;
    }
}



