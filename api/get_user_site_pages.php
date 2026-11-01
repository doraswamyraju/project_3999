<?php
// get_user_site_pages.php

// Required headers for API
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Include database configuration
include_once 'config/db.php';

// Get site_id from the request URL, default to 1 if not provided
$site_id = isset($_GET['site_id']) ? $_GET['site_id'] : 1;

// Instantiate database and get connection
$database = new Database();
$db = $database->getConnection();

$data = [];
$response = [
    "success" => false,
    "data" => [],
    "message" => ""
];

if ($db) {
    try {
        // Prepare SQL query to get pages for a specific site
        // This joins the user_site_pages table with the pages table
        $query = "SELECT usp.id, usp.page_id, p.name 
                  FROM user_site_pages usp
                  JOIN pages p ON usp.page_id = p.id
                  WHERE usp.site_id = :site_id 
                  ORDER BY usp.page_order";

        $stmt = $db->prepare($query);

        // Sanitize and bind the site_id parameter
        $stmt->bindParam(":site_id", $site_id);

        $stmt->execute();

        $num = $stmt->rowCount();

        // Check if more than 0 record found
        if ($num > 0) {
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                // Extract row
                extract($row);
                $data[] = $row;
            }
            $response["success"] = true;
            $response["data"] = $data;
        } else {
            $response["message"] = "No pages found for this site.";
        }
    } catch (Exception $e) {
        // Handle potential exceptions
        $response["message"] = "Error: " . $e->getMessage();
    }
} else {
    $response["message"] = "Unable to connect to the database.";
}

// Return the response in JSON format
echo json_encode($response);
?>
