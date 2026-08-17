<?php
declare(strict_types=1);
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') json_response(['success'=>false,'message'=>'Method Not Allowed'],405);

try {
    $pdo = db();
    $status = trim((string)($_GET['status'] ?? ''));
    $allowed = ['pending','confirmed','production','ready','shipped','completed','cancelled'];
    $sql = 'SELECT o.id,o.order_number,o.status,o.payment_method,o.total_amount,o.deposit_amount,o.created_at,c.full_name,c.phone,c.city FROM orders o INNER JOIN customers c ON c.id=o.customer_id';
    $params = [];
    if ($status !== '' && in_array($status, $allowed, true)) { $sql .= ' WHERE o.status = ?'; $params[] = $status; }
    $sql .= ' ORDER BY o.created_at DESC LIMIT 100';
    $stmt = $pdo->prepare($sql); $stmt->execute($params);
    json_response(['success'=>true,'orders'=>$stmt->fetchAll()]);
} catch (Throwable $e) { json_response(['success'=>false,'message'=>'خطا در دریافت سفارش‌ها.'],500); }
