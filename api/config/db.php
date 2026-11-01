<?php
// config/db.php

class Database {
    // Database credentials
    private $host = "127.0.0.1"; // or "localhost"
    private $db_name = "project_3999";
    private $username = "root";
    private $password = ""; // Your MySQL root password, often empty in XAMPP
    public $conn;

    // Get the database connection
    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
?>
