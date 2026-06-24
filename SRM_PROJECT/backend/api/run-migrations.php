<?php
declare(strict_types=1);

// Set content type to plain text so the migration output is easy to read in the browser
header('Content-Type: text/plain; charset=utf-8');
header('Access-Control-Allow-Origin: *');

echo "Pre-migration check: Connecting to database...\n";

require_once __DIR__ . '/../database/migrate_all.php';
