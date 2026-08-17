<?php
declare(strict_types=1);
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_response(['success'=>false,'message'=>'Method Not Allowed'],405);

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) $input = $_POST;

$name = trim((string)($input['name'] ?? ''));
$phone = preg_replace('/\s+|-/', '', (string)($input['phone'] ?? ''));
$city = trim((string)($input['city'] ?? ''));
$address = trim((string)($input['address'] ?? ''));
$payment = (string)($input['payment'] ?? 'cash');
$item = $input['item'] ?? [];

if ($name === '' || !preg_match('/^0?9\d{9}$/', $phone)) {
    json_response(['success'=>false,'message'=>'نام و شماره تماس معتبر الزامی است.'],422);
}
if (!in_array($payment, ['cash','installment','check'], true)) {
    json_response(['success'=>false,'message'=>'روش پرداخت نامعتبر است.'],422);
}
if (!is_array($item) || empty($item['product']) || empty($item['price'])) {
    json_response(['success'=>false,'message'=>'اطلاعات محصول سفارش ناقص است.'],422);
}

$pdo = db();
try {
    $pdo->beginTransaction();

    $customer = $pdo->prepare('SELECT id FROM customers WHERE phone = ? LIMIT 1');
    $customer->execute([$phone]);
    $customerId = $customer->fetchColumn();

    if (!$customerId) {
        $stmt = $pdo->prepare('INSERT INTO customers (full_name, phone, city, address) VALUES (?, ?, ?, ?)');
        $stmt->execute([$name, $phone, $city, $address]);
        $customerId = (int)$pdo->lastInsertId();
    } else {
        $stmt = $pdo->prepare('UPDATE customers SET full_name=?, city=?, address=? WHERE id=?');
        $stmt->execute([$name, $city, $address, $customerId]);
    }

    $orderNumber = 'KC-' . date('ymd') . '-' . strtoupper(bin2hex(random_bytes(3)));
    $total = (float)$item['price'];
    $stmt = $pdo->prepare('INSERT INTO orders (order_number, customer_id, status, payment_method, total_amount, notes) VALUES (?, ?, "pending", ?, ?, ?)');
    $stmt->execute([$orderNumber, $customerId, $payment, $total, $address]);
    $orderId = (int)$pdo->lastInsertId();

    $stmt = $pdo->prepare('INSERT INTO order_items (order_id, product_name, quantity, unit_price, total_price, size_label, custom_config, model_3d_snapshot) VALUES (?, ?, 1, ?, ?, ?, ?, ?)');
    $config = json_encode([
        'wood' => $item['woodName'] ?? null,
        'fabric' => $item['fabricName'] ?? null,
        'wood_color' => $item['wood'] ?? null,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $stmt->execute([$orderId, (string)$item['product'], $total, $total, $item['size'] ?? null, $config, $item['model3d'] ?? null]);

    $stmt = $pdo->prepare('INSERT INTO order_status_history (order_id, old_status, new_status, note) VALUES (?, NULL, "pending", "ثبت سفارش از فروشگاه سه‌بعدی")');
    $stmt->execute([$orderId]);

    $pdo->commit();
    json_response(['success'=>true,'message'=>'سفارش با موفقیت ثبت شد.','order'=>['id'=>$orderId,'order_number'=>$orderNumber,'status'=>'pending','total'=>$total]]);
} catch (Throwable $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    json_response(['success'=>false,'message'=>'ثبت سفارش انجام نشد.','error'=>$e->getMessage()],500);
}
