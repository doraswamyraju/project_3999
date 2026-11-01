<?php
header('Content-Type: application/json');
// Allow from any origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

// Database connection details (replace with your actual credentials)
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "project_3999";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

// Get the POST data
$data = json_decode(file_get_contents('php://input'), true);

$id = isset($data['id']) ? intval($data['id']) : 0;
$content = isset($data['content']) ? $data['content'] : null;

if ($id === 0 || $content === null) {
    echo json_encode(["success" => false, "message" => "Invalid input: Block ID and content are required."]);
    $conn->close();
    exit();
}

// Validate content is a valid JSON string
if (json_decode($content) === null && json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(["success" => false, "message" => "Invalid JSON content provided."]);
    $conn->close();
    exit();
}

// Prepare and execute the update statement
$stmt = $conn->prepare("UPDATE user_site_blocks SET content = ? WHERE id = ?");
$stmt->bind_param("si", $content, $id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Block updated successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "No block found with the given ID or no changes made."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Error updating block: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
