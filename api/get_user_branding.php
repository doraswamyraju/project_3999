<?php
// --- DEBUGGING: Temporarily enable full error reporting ---
// This will show any errors, including problems with file paths.
error_reporting(E_ALL);
ini_set('display_errors', 1);

// --- FIX: ADDED CORS HEADERS ---
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/config/db.php';

// Hardcode user_id=1 for now.
$userId = 1; 

$response = ['success' => false, 'message' => 'An error occurred.', 'data' => null];

try {
    $database = new Database();
    $pdo = $database->getConnection();

    if (!$pdo) {
        throw new Exception("Failed to get a database connection. Check your credentials in config/db.php.");
    }
    
    $stmt = $pdo->prepare("SELECT business_name, logo_url, brand_color FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        $response['success'] = true;
        $response['message'] = 'User data fetched successfully.';
        $response['data'] = $user;
    } else {
        $response['message'] = 'User with ID ' . $userId . ' not found in the database.';
        $response['success'] = false;
    }

} catch (PDOException $e) {
    http_response_code(500);
    $response['message'] = 'Database error: ' . $e->getMessage();
} catch (Exception $e) {
    http_response_code(500);
    $response['message'] = 'General error: ' . $e->getMessage();
}

if (ob_get_level() > 0) {
    ob_end_clean();
}

echo json_encode($response);
?>
