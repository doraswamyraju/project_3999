<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'config/db.php';

// Set a default error response
$response = [
    "success" => false,
    "message" => "An unknown error occurred.",
    "data" => null
];

try {
    $database = new Database();
    $db = $database->getConnection();

    $query = "SELECT id, name FROM pages ORDER BY id";
    $stmt = $db->prepare($query);
    
    // Check if execute() was successful
    if ($stmt->execute()) {
        $pages = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Success response
        $response["success"] = true;
        $response["message"] = "Pages fetched successfully.";
        $response["data"] = $pages;

    } else {
        // Error in query execution
        $response["message"] = "Failed to execute query.";
    }

} catch (PDOException $e) {
    // Catch database connection or query preparation errors
    http_response_code(500); // Internal Server Error
    $response["message"] = "Database Error: " . $e->getMessage();
} catch (Exception $e) {
    // Catch other general errors
    http_response_code(500);
    $response["message"] = "Server Error: " . $e->getMessage();
}

echo json_encode($response);
?>