<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Ensure the db config path is correct
include_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"));

// Validate incoming data
if (!isset($data->site_page_id) || !isset($data->section_name)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Incomplete data: site_page_id and section_name are required."]);
    exit();
}

$site_page_id = (int)$data->site_page_id;
$section_name = $data->section_name;

// This order must exactly match the SECTION_ORDER array in your EditorContext.jsx
// It maps the section name to the 'block_order' in the database.
$section_order_map = [
    'header' => 1,
    'hero' => 2,
    'aboutUs' => 3,
    'services' => 4,
    'testimonials' => 5,
    'footer' => 6
    // Add other sections here if your order changes
];

if (!array_key_exists($section_name, $section_order_map)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid section name provided: " . $section_name]);
    exit();
}

$block_order = $section_order_map[$section_name];

$database = new Database();
$db = $database->getConnection();

try {
    // Prepare and execute the DELETE statement
    $sql = "DELETE FROM user_site_blocks WHERE site_page_id = ? AND block_order = ?";
    $stmt = $db->prepare($sql);
    
    $stmt->execute([$site_page_id, $block_order]);

    // Check if any rows were actually deleted
    if ($stmt->rowCount() > 0) {
        http_response_code(200);
        echo json_encode(["success" => true, "message" => "Block section deleted successfully."]);
    } else {
        // It's not considered an error if no block was found to delete.
        // The section might have been empty already.
        http_response_code(200);
        echo json_encode(["success" => true, "message" => "No block found in this section to delete."]);
    }

} catch (Exception $e) {
    // Handle potential database errors
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
