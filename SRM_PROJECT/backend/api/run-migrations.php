<?php
declare(strict_types=1);

// Set content type to plain text so the migration output is easy to read in the browser
header('Content-Type: text/plain; charset=utf-8');
header('Access-Control-Allow-Origin: *');

echo "Pre-migration check: Connecting to database...\n";

require_once __DIR__ . '/../config/db.php';
$connection = db_connection();

echo "Connection successful. Preparing to load base schema...\n";

$schemaPath = __DIR__ . '/../database/schema.sql';
if (file_exists($schemaPath)) {
    echo "Loading schema.sql...\n";
    $sql = file_get_contents($schemaPath);
    
    // Remove comments
    $sql = preg_replace('/--.*$/m', '', $sql);
    $sql = preg_replace('!/\*.*?\*/!s', '', $sql);
    
    // Split by semicolons
    $queries = explode(';', $sql);
    
    $successCount = 0;
    $failCount = 0;
    
    foreach ($queries as $query) {
        $query = trim($query);
        if ($query === '') continue;
        
        // Skip database creation / selection statements to avoid changing current database context on managed hosts
        if (stripos($query, 'CREATE DATABASE') === 0 || stripos($query, 'USE ') === 0) {
            continue;
        }
        
        if ($connection->query($query)) {
            $successCount++;
        } else {
            // Ignore already exists (1050) and duplicate key (1062) errors for repeat runs
            if ($connection->errno !== 1050 && $connection->errno !== 1062) {
                echo "Failed query: " . substr($query, 0, 100) . "...\n";
                echo "Error: " . $connection->error . "\n\n";
                $failCount++;
            } else {
                $successCount++;
            }
        }
    }
    echo "Base schema loaded. Successful queries: $successCount, Failed: $failCount\n\n";
} else {
    echo "schema.sql not found at $schemaPath!\n";
}

echo "Running incremental migrations...\n";
require_once __DIR__ . '/../database/migrate_all.php';
