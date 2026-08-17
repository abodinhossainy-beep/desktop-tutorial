<?php
declare(strict_types=1);
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $rows = db()->query('SELECT id,name,slug,base_price,model_3d_url,thumbnail_url,is_active,created_at FROM products ORDER BY id DESC')->fetchAll();
    json_response(['success'=>true,'products'=>$rows]);
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_response(['success'=>false,'message'=>'Method Not Allowed'],405);

$input=json_decode(file_get_contents('php://input'),true) ?: $_POST;
$name=trim((string)($input['name']??''));
$slug=trim((string)($input['slug']??''));
$price=(float)($input['base_price']??0);
$model=trim((string)($input['model_3d_url']??''));
$thumb=trim((string)($input['thumbnail_url']??''));
$description=trim((string)($input['description']??''));
if($name===''||$slug===''||$price<0) json_response(['success'=>false,'message'=>'نام، slug و قیمت معتبر الزامی است.'],422);
$stmt=db()->prepare('INSERT INTO products(name,slug,description,base_price,model_3d_url,thumbnail_url) VALUES(?,?,?,?,?,?)');
try{$stmt->execute([$name,$slug,$description,$price,$model,$thumb]);json_response(['success'=>true,'product_id'=>(int)db()->lastInsertId()]);}catch(PDOException $e){json_response(['success'=>false,'message'=>'ذخیره محصول انجام نشد.','error'=>$e->getCode()==='23000'?'slug تکراری است.':$e->getMessage()],409);}
