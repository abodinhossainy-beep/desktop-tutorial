<?php
declare(strict_types=1);
require_once __DIR__ . '/../config.php';
if($_SERVER['REQUEST_METHOD']==='GET'){json_response(['success'=>true,'materials'=>db()->query('SELECT * FROM materials ORDER BY type,id')->fetchAll()]);}
if($_SERVER['REQUEST_METHOD']!=='POST') json_response(['success'=>false,'message'=>'Method Not Allowed'],405);
$input=json_decode(file_get_contents('php://input'),true) ?: $_POST;
$type=(string)($input['type']??'');$name=trim((string)($input['name']??''));$color=trim((string)($input['color_hex']??''));$delta=(float)($input['price_delta']??0);
if(!in_array($type,['wood','fabric','metal'],true)||$name==='') json_response(['success'=>false,'message'=>'نوع و نام متریال معتبر الزامی است.'],422);
$s=db()->prepare('INSERT INTO materials(type,name,color_hex,price_delta) VALUES(?,?,?,?)');$s->execute([$type,$name,$color,$delta]);json_response(['success'=>true,'material_id'=>(int)db()->lastInsertId()]);
