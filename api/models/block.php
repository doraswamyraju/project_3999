<?php
class Block {
    private $conn;
    private $table_name = "blocks";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getAllBlocks() {
        $query = "SELECT id, name, category, default_preview_img FROM " . $this->table_name . " ORDER BY category, name";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
}
?>