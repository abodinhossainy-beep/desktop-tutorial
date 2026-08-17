<?php
declare(strict_types=1);
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_response(['success'=>false,'message'=>'Method Not Allowed'],405);
if (!isset($_FILES['model'])) json_response(['success'=>false,'message'=>'فایل مدل ارسال نشده است.'],422);
$file=$_FILES['model'];
if ($file['error']!==UPLOAD_ERR_OK) json_response(['success'=>false,'message'=>'خطا در آپلود فایل.'],422);
if ($file['size']>50*1024*1024) json_response(['success'=>false,'message'=>'حداکثر حجم مدل 50MB است.'],422);
$ext=strtolower(pathinfo($file['name'],PATHINFO_EXTENSION));
if(!in_array($ext,['glb','gltf'],true)) json_response(['success'=>false,'message'=>'فقط GLB یا GLTF مجاز است.'],422);
$dir=dirname(__DIR__,2).'/public/models';
if(!is_dir($dir) && !mkdir($dir,0755,true)) json_response(['success'=>false,'message'=>'پوشه مدل ایجاد نشد.'],500);
$name=bin2hex(random_bytes(12)).'.'.$ext;
if(!move_uploaded_file($file['tmp_name'],$dir.'/'.$name)) json_response(['success'=>false,'message'=>'ذخیره فایل انجام نشد.'],500);
json_response(['success'=>true,'url'=>'/models/'.$name,'filename'=>$name]);
