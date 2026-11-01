<?php
// Enable CORS and set content type to JSON
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight CORS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database configuration
include_once '../config/db.php';

// Get the request body
$data = json_decode(file_get_contents("php://input"));

// Validate that the block ID is provided
if (!isset($data->id)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Block ID is required."]);
    exit();
}

$block_id = (int)$data->id;

$database = new Database();
$db = $database->getConnection();

try {
    // IMPORTANT: In a real application, you should consider what happens to user sites
    // that are currently using this block. You might want to prevent deletion if the
    // block is in use, or replace it with a placeholder. For now, this directly deletes it.
    
    // Prepare and execute the DELETE statement for the 'blocks' table
    $sql = "DELETE FROM blocks WHERE id = ?";
    $stmt = $db->prepare($sql);
    
    $stmt->execute([$block_id]);

    // Check if a row was actually deleted
    if ($stmt->rowCount() > 0) {
        http_response_code(200);
        echo json_encode(["success" => true, "message" => "Block definition deleted successfully."]);
    } else {
        // If no rows were affected, the block ID was not found
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "No block definition found with the given ID."]);
    }

} catch (Exception $e) {
    // Handle any database errors
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
