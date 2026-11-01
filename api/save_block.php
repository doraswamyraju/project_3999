<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once 'config/db.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->site_page_id, $data->block_id, $data->block_order, $data->content)) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

$query = "INSERT INTO user_site_blocks (site_page_id, block_id, content, block_order)
          VALUES (:site_page_id, :block_id, :content, :block_order)";
$stmt = $db->prepare($query);

try {
    $stmt->execute([
        ":site_page_id" => $data->site_page_id,
        ":block_id" => $data->block_id,
        ":content" => json_encode($data->content),
        ":block_order" => $data->block_order
    ]);
    echo json_encode(["success" => true, "message" => "Block saved successfully"]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
