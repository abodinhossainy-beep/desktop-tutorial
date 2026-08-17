CREATE DATABASE IF NOT EXISTS kardan_choob CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kardan_choob;

CREATE TABLE products (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  description TEXT NULL,
  base_price DECIMAL(15,2) NOT NULL DEFAULT 0,
  model_3d_url VARCHAR(500) NULL,
  thumbnail_url VARCHAR(500) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE materials (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  type ENUM('wood','fabric','metal') NOT NULL,
  name VARCHAR(120) NOT NULL,
  color_hex VARCHAR(20) NULL,
  price_delta DECIMAL(15,2) NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_material_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE product_sizes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id BIGINT UNSIGNED NOT NULL,
  label VARCHAR(50) NOT NULL,
  width_cm SMALLINT UNSIGNED NOT NULL,
  length_cm SMALLINT UNSIGNED NOT NULL,
  price_delta DECIMAL(15,2) NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  CONSTRAINT fk_product_sizes_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY uq_product_size (product_id,label)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE customers (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(160) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  city VARCHAR(100) NULL,
  address TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_customer_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE orders (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(40) NOT NULL UNIQUE,
  customer_id BIGINT UNSIGNED NOT NULL,
  status ENUM('pending','confirmed','production','ready','shipped','completed','cancelled') NOT NULL DEFAULT 'pending',
  payment_method ENUM('cash','installment','check') NOT NULL DEFAULT 'cash',
  total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  deposit_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
  INDEX idx_orders_status (status),
  INDEX idx_orders_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE order_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NULL,
  product_name VARCHAR(150) NOT NULL,
  quantity SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  unit_price DECIMAL(15,2) NOT NULL,
  total_price DECIMAL(15,2) NOT NULL,
  size_label VARCHAR(50) NULL,
  wood_material_id BIGINT UNSIGNED NULL,
  fabric_material_id BIGINT UNSIGNED NULL,
  custom_config JSON NULL,
  model_3d_snapshot VARCHAR(500) NULL,
  CONSTRAINT fk_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
  CONSTRAINT fk_items_wood FOREIGN KEY (wood_material_id) REFERENCES materials(id) ON DELETE SET NULL,
  CONSTRAINT fk_items_fabric FOREIGN KEY (fabric_material_id) REFERENCES materials(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE order_status_history (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  old_status VARCHAR(30) NULL,
  new_status VARCHAR(30) NOT NULL,
  note VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_status_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_status_order (order_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO products (name, slug, description, base_price, thumbnail_url) VALUES
('آریا','arya','سرویس خواب آریا با طراحی مدرن و تولید سفارشی',48900000,NULL),
('رُما','roma','سرویس خواب رُما با ترکیب چوب طبیعی و پارچه',56500000,NULL),
('وین','vin','سرویس خواب وین با طراحی مینیمال و لوکس',62900000,NULL);

INSERT INTO materials (type,name,color_hex,price_delta) VALUES
('wood','گردویی','#5b3b25',0),('wood','بلوط روشن','#a87343',2500000),('wood','مشکی','#191715',1800000),('wood','سفید گرم','#e7dfd2',1200000),
('fabric','کرم','#d6c7b5',0),('fabric','طوسی','#9c9892',900000),('fabric','سبز زیتونی','#7b8065',1200000);

INSERT INTO product_sizes (product_id,label,width_cm,length_cm,price_delta)
SELECT id,'140×200',140,200,0 FROM products WHERE slug='arya';
INSERT INTO product_sizes (product_id,label,width_cm,length_cm,price_delta)
SELECT id,'160×200',160,200,3500000 FROM products WHERE slug='arya';
INSERT INTO product_sizes (product_id,label,width_cm,length_cm,price_delta)
SELECT id,'180×200',180,200,7000000 FROM products WHERE slug='arya';
