<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

echo json_encode([
    'status' => 'ok',
    'service' => 'SRM Portal Backend API',
    'message' => 'API endpoint active',
    'endpoints' => [
        '/api/login.php',
        '/api/register.php',
        '/api/me.php',
        '/api/rfqs.php',
        '/api/bids.php',
        '/api/purchase_orders.php',
        '/api/invoices.php',
        '/api/suppliers.php'
    ]
]);
