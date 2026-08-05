<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

echo json_encode([
    'status' => 'ok',
    'service' => 'SRM Portal Backend API',
    'endpoints' => '/api'
]);
