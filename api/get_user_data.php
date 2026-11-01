<?php
// api/get_user_data.php

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");

// Ensure this path is correct for your file structure
require_once __DIR__ . '/config/db.php';

$userId = 1; 
$response = ['success' => false, 'message' => 'An error occurred.', 'data' => null];

try {
    $database = new Database();
    // --- THIS LINE IS NOW CORRECTED ---
    $pdo = $database->getConnection();

    if (!$pdo) {
        throw new Exception("Failed to connect to the database. Check your db.php configuration.");
    }
    
    $stmt = $pdo->prepare("SELECT business_name, logo_url, brand_color, email, phone_number FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        $response['success'] = true;
        $response['message'] = 'User data fetched successfully.';
        $response['data'] = $user;
    } else {
        $response['message'] = 'User with ID ' . $userId . ' not found.';
        $response['success'] = false;
    }

} catch (Exception $e) {
    http_response_code(500);
    $response['message'] = 'Server Error: ' . $e->getMessage();
}

// Clean the output buffer to prevent any stray characters from breaking JSON
if (ob_get_level() > 0) {
    ob_end_clean();
}

echo json_encode($response);
?>