<?php
// --- DEBUGGING SCRIPT ---
// This file will help us find the exact path to your database configuration.

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Database Connection Test</h1>";

$path_to_db = __DIR__ . '/config/db.php';

echo "<p>Attempting to include file from: <strong>" . $path_to_db . "</strong></p>";

require_once $path_to_db;

echo "<p>File included successfully!</p>";

try {
    $database = new Database();
    $pdo = $database->getConnection();

    if ($pdo) {
        echo "<p style='color:green; font-weight:bold;'>Connection to the database was successful!</p>";
    } else {
        echo "<p style='color:red; font-weight:bold;'>File was included, but getConnection() did not return a valid object.</p>";
    }

} catch (Exception $e) {
    echo "<p style='color:red; font-weight:bold;'>An error occurred: " . $e->getMessage() . "</p>";
}

?>
