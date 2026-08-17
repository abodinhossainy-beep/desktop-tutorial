<?php
declare(strict_types=1);
require_once __DIR__ . '/../config.php';
if($_SERVER['REQUEST_METHOD']==='GET'){$s=db()->prepare('SELECT * FROM product_sizes WHERE product_id=? ORDER BY width_cm,length_cm');$s->execute([(int)($_GET['product_id']??0)]);json_response(['success'=>true,'sizes'=>$s->fetchAll()]);}
if($_SERVER['REQUEST_METHOD']!=='POST') json_response(['success'=>false,'message'=>'Method Not Allowed'],405);
$i=json_decode(file_get_contents('php://input'),true) ?: $_POST;$pid=(int)($i['product_id']??0);$label=trim((string)($i['label']??''));$w=(int)($i['width_cm']??0);$l=(int)($i['length_cm']??0);$delta=(float)($i['price_delta']??0);
if($pid<1||$label===''||$w<1||$l<1) json_response(['success'=>false,'message'=>'اطلاعات ابعاد نامعتبر است.'],422);
$s=db()->prepare('INSERT INTO product_sizes(product_id,label,width_cm,length_cm,price_delta) VALUES(?,?,?,?,?)');$s->execute([$pid,$label,$w,$l,$delta]);json_response(['success'=>true,'size_id'=>(int)db()->lastInsertId()]);
