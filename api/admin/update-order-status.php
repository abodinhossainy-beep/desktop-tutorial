<?php
declare(strict_types=1);
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_response(['success'=>false,'message'=>'Method Not Allowed'],405);
$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
$orderId = (int)($input['order_id'] ?? 0);
$newStatus = (string)($input['status'] ?? '');
$note = trim((string)($input['note'] ?? ''));
$allowed = ['pending','confirmed','production','ready','shipped','completed','cancelled'];
if ($orderId < 1 || !in_array($newStatus, $allowed, true)) json_response(['success'=>false,'message'=>'اطلاعات نامعتبر است.'],422);
try {
  $pdo=db(); $pdo->beginTransaction();
  $stmt=$pdo->prepare('SELECT status FROM orders WHERE id=? FOR UPDATE'); $stmt->execute([$orderId]); $old=$stmt->fetchColumn();
  if ($old === false) { $pdo->rollBack(); json_response(['success'=>false,'message'=>'سفارش پیدا نشد.'],404); }
  if ($old !== $newStatus) {
    $pdo->prepare('UPDATE orders SET status=? WHERE id=?')->execute([$newStatus,$orderId]);
    $pdo->prepare('INSERT INTO order_status_history(order_id,old_status,new_status,note) VALUES(?,?,?,?)')->execute([$orderId,$old,$newStatus,$note]);
  }
  $pdo->commit(); json_response(['success'=>true,'order_id'=>$orderId,'status'=>$newStatus]);
} catch(Throwable $e){if($pdo->inTransaction())$pdo->rollBack();json_response(['success'=>false,'message'=>'تغییر وضعیت انجام نشد.'],500);}
