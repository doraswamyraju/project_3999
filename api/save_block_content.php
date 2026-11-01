<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../config/db.php';

// Get the posted data
$data = json_decode(file_get_contents("php://input"));

// Basic validation
if (
    !isset($data->site_page_id) ||
    !isset($data->block_id) ||
    !isset($data->content) ||
    !isset($data->block_order)
) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Incomplete data provided."]);
    exit();
}

$site_page_id = (int)$data->site_page_id;
$block_id = (int)$data->block_id;
$content_json = json_encode($data->content);
$block_order = (int)$data->block_order;

$database = new Database();
$db = $database->getConnection();

try {
    // Check if a block already exists for this page and order
    $check_sql = "SELECT id FROM user_site_blocks WHERE site_page_id = ? AND block_order = ?";
    $check_stmt = $db->prepare($check_sql);
    $check_stmt->execute([$site_page_id, $block_order]);
    $existing_block = $check_stmt->fetch(PDO::FETCH_ASSOC);

    if ($existing_block) {
        // --- UPDATE existing block ---
        // It's better to update the existing entry to avoid orphaned blocks
        // if the user changes their mind (e.g., from Header1 to Header2)
        $sql = "UPDATE user_site_blocks SET block_id = ?, content = ? WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$block_id, $content_json, $existing_block['id']]);
        $message = "Block updated successfully.";
    } else {
        // --- INSERT new block ---
        $sql = "INSERT INTO user_site_blocks (site_page_id, block_id, content, block_order) VALUES (?, ?, ?, ?)";
        $stmt = $db->prepare($sql);
        $stmt->execute([$site_page_id, $block_id, $content_json, $block_order]);
        $message = "Block saved successfully.";
    }

    http_response_code(200);
    echo json_encode(["success" => true, "message" => $message]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
