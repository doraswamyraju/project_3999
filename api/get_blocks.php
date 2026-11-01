<?php
/*
File: /api/get_blocks.php
Description: Corrected to only fetch blocks from the database and remove hard-coded entries.
*/
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once 'config/db.php';

$database = new Database();
$db = $database->getConnection();

// Query to fetch all existing blocks from the database.
// This is the single source of truth for all blocks.
$query = "SELECT id, name, category, default_preview_img, is_visible FROM blocks";
$stmt = $db->prepare($query);
$stmt->execute();

$blocks = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    // Ensure 'is_visible' is treated as a boolean/integer
    $row['is_visible'] = (int)$row['is_visible'];
    $blocks[] = $row;
}

// The hard-coded new_blocks array has been removed to prevent duplicates.
// The frontend will now only receive blocks that are present in the 'blocks' table.

echo json_encode([
    "success" => true,
    "data" => $blocks
]);
?>
