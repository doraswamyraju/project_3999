<?php
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json');
require_once 'config/db.php';

$site_page_id = isset($_GET['site_page_id']) ? (int)$_GET['site_page_id'] : 0;

if ($site_page_id === 0) {
    echo json_encode(['success' => false, 'message' => 'Site Page ID is required.']);
    exit;
}

// --- TEMPORARY FIX ---
// If the requested page is NOT the Home page (ID = 1), return an empty array.
if ($site_page_id !== 1) {
    echo json_encode(['success' => true, 'data' => [], 'message' => 'Only fetching blocks for Home page during testing.']);
    exit;
}
// --- END TEMPORARY FIX ---


$response = ['success' => false, 'message' => 'An error occurred fetching blocks.'];

try {
    $database = new Database();
    $pdo = $database->getConnection();

    if (!$pdo) {
        throw new Exception("Database connection failed.");
    }

    // This query now effectively only runs for the Home page.
    $sql = "SELECT usb.*, b.name, b.category 
            FROM user_site_blocks usb
            JOIN blocks b ON usb.block_id = b.id
            WHERE usb.site_page_id = ?
            ORDER BY usb.block_order ASC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$site_page_id]);
    
    $blocks = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $response['success'] = true;
    $response['message'] = 'Header blocks fetched successfully.';
    $response['data'] = $blocks;

} catch (Exception $e) {
    http_response_code(500);
    $response['message'] = $e->getMessage();
}

if (ob_get_level() > 0) {
    ob_end_clean();
}

echo json_encode($response);
?>
