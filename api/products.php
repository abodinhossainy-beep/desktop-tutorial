<?php
declare(strict_types=1);
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') json_response(['success'=>false,'message'=>'Method Not Allowed'],405);

$products = db()->query('SELECT id,name,slug,description,base_price,model_3d_url,thumbnail_url FROM products WHERE is_active=1 ORDER BY id DESC')->fetchAll();
$sizeStmt = db()->prepare('SELECT id,label,width_cm,length_cm,price_delta FROM product_sizes WHERE product_id=? AND is_active=1 ORDER BY width_cm,length_cm');
foreach ($products as &$product) { $sizeStmt->execute([(int)$product['id']]); $product['sizes']=$sizeStmt->fetchAll(); }
unset($product);
json_response(['success'=>true,'products'=>$products]);
