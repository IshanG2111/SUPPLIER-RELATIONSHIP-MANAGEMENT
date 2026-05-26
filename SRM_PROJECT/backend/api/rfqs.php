<?php

declare(strict_types=1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../config/db.php';

$connection = db_connection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $result = $connection->query('SELECT * FROM rfqs ORDER BY created_at DESC');
    $rfqs = [];
    while ($row = $result->fetch_assoc()) {
        $row['value'] = (float)$row['value'];
        $row['bids'] = (int)$row['bids'];
        $rfqs[] = $row;
    }
    echo json_encode([
        'success' => true,
        'rfqs' => $rfqs
    ]);
    exit;
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $input = is_array($input) ? $input : [];

    $id = isset($input['id']) ? trim((string)$input['id']) : '';
    $title = isset($input['title']) ? trim((string)$input['title']) : '';
    $category = isset($input['category']) ? trim((string)$input['category']) : '';
    $deadline = isset($input['deadline']) ? trim((string)$input['deadline']) : '';
    $value = isset($input['value']) ? (float)$input['value'] : 0.0;
    $status = isset($input['status']) ? trim((string)$input['status']) : 'Draft';

    if ($id === '' || $title === '') {
        http_response_code(422);
        echo json_encode([
            'success' => false,
            'message' => 'RFQ ID and Title are required.'
        ]);
        exit;
    }

    $stmt = $connection->prepare('INSERT INTO rfqs (id, title, category, deadline, value, status) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE title=?, category=?, deadline=?, value=?, status=?');
    $stmt->bind_param('ssssdssssds', $id, $title, $category, $deadline, $value, $status, $title, $category, $deadline, $value, $status);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'RFQ saved successfully.'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to save RFQ: ' . $stmt->error
        ]);
    }
    $stmt->close();
    exit;
}

if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? trim((string)$_GET['id']) : '';

    if ($id === '') {
        http_response_code(422);
        echo json_encode([
            'success' => false,
            'message' => 'RFQ ID is required.'
        ]);
        exit;
    }

    $stmt = $connection->prepare('DELETE FROM rfqs WHERE id = ?');
    $stmt->bind_param('s', $id);

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'RFQ deleted successfully.'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to delete RFQ.'
        ]);
    }
    $stmt->close();
    exit;
}

http_response_code(405);
echo json_encode([
    'success' => false,
    'message' => 'Method not allowed.'
]);
