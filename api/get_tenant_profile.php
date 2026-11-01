<?php
// api/get_tenant_profile.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/config/db.php';

$userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : 1;

try {
    $database = new Database();
    $pdo = $database->getConnection();

    // 1. Fetch user/business profile
    $stmt = $pdo->prepare("SELECT id, business_name, tagline, logo_url, brand_color, email, phone_number, whatsapp, address, owner_photo FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $business = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$business) {
        echo json_encode(["success" => false, "message" => "Business profile not found."]);
        exit();
    }

    // 2. Fetch services
    $stmtServices = $pdo->prepare("SELECT id, title, description, price, image_url, icon FROM user_services WHERE user_id = ?");
    $stmtServices->execute([$userId]);
    $services = $stmtServices->fetchAll(PDO::FETCH_ASSOC);

    // 3. Fetch products
    $stmtProducts = $pdo->prepare("SELECT id, name, description, price, image_url FROM user_products WHERE user_id = ?");
    $stmtProducts->execute([$userId]);
    $products = $stmtProducts->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => [
            "business" => [
                "name" => $business['business_name'] ?: 'My Business',
                "tagline" => $business['tagline'] ?: 'Quality Products & Services',
                "logoUrl" => $business['logo_url'] ?: 'http://localhost:3000/logo.png',
                "brandColor" => $business['brand_color'] ?: '#4f46e5',
                "email" => $business['email'] ?: 'contact@manacity.in',
                "phone" => $business['phone_number'] ?: '+91 80085 30606',
                "whatsapp" => $business['whatsapp'] ?: '+918008530606',
                "address" => $business['address'] ?: 'Tirupati, AP',
                "ownerPhoto" => $business['owner_photo'] ?: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'
            ],
            "services" => $services,
            "products" => $products
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server Error: " . $e->getMessage()]);
}
?>
