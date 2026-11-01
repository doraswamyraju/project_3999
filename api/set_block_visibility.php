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

// Use the correct path for the config file
include_once 'config/db.php';

// Get the request body
$data = json_decode(file_get_contents("php://input"));

// Validate that the block ID and visibility status are provided
if (!isset($data->id) || !isset($data->is_visible)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Block ID and visibility status are required."]);
    exit();
}

$block_id = (int)$data->id;
$is_visible = (int)$data->is_visible;

// Ensure is_visible is either 0 or 1
if ($is_visible !== 0 && $is_visible !== 1) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid visibility status. Must be 0 or 1."]);
    exit();
}

$database = new Database();
$db = $database->getConnection();

try {
    // Prepare and execute the UPDATE statement for the 'blocks' table
    $sql = "UPDATE blocks SET is_visible = ? WHERE id = ?";
    $stmt = $db->prepare($sql);
    
    $stmt->execute([$is_visible, $block_id]);

    // Check if a row was actually updated
    if ($stmt->rowCount() > 0) {
        http_response_code(200);
        echo json_encode(["success" => true, "message" => "Block visibility updated successfully."]);
    } else {
        // If no rows were affected, the block ID might not have been found
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "No block found with the given ID, or visibility was already set to this value."]);
    }

} catch (Exception $e) {
    // Handle any database errors
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
