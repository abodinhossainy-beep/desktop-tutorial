import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import { RealBedroomModel, hasRealBedroomModel } from './Model3D';
import './style.css';

const finishes = [
  { name: 'گردویی', value: '#5b3b25', extra: 0 },
  { name: 'بلوط روشن', value: '#a87343', extra: 2500000 },
  { name: 'مشکی', value: '#191715', extra: 1800000 },
  { name: 'سفید گرم', value: '#e7dfd2', extra: 1200000 },
];
const fabrics = [
  { name: 'کرم', value: '#d6c7b5', extra: 0 },
  { name: 'طوسی', value: '#9c9892', extra: 900000 },
  { name: 'سبز زیتونی', value: '#7b8065', extra: 1200000 },
];
const sizes = [
  { label: '140×200', extra: 0 },
  { label: '160×200', extra: 3500000 },
  { label: '180×200', extra: 7000000 },
];
const products = [
  { name: 'آریا', price: 48900000, color: '#5b3b25' },
  { name: 'رُما', price: 56500000, color: '#b67d4b' },
  { name: 'وین', price: 62900000, color: '#28231f' },
];

function DemoBedroom({ woodColor, fabricColor }) {
  const material = useMemo(() => ({ color: woodColor, roughness: 0.34, metalness: 0.02 }), [woodColor]);
  return <group position={[0, -0.15, 0]}>
    <mesh position={[0, 0.65, 0]} castShadow><boxGeometry args={[3.9, 0.35, 4.3]} /><meshStandardMaterial {...material} /></mesh>
    <mesh position={[0, 1.65, -1.82]} castShadow><boxGeometry args={[4.15, 2.55, 0.3]} /><meshStandardMaterial {...material} /></mesh>
    <mesh position={[0, 0.88, 0.1]} castShadow><boxGeometry args={[3.45, 0.48, 3.8]} /><meshStandardMaterial color={fabricColor} roughness={0.78} /></mesh>
    {[-2.55, 2.55].map((x) => <group key={x} position={[x, 0.75, -0.15]}><mesh castShadow><boxGeometry args={[0.85, 1.25, 1.15]} /><meshStandardMaterial {...material} /></mesh></group>)}
    <mesh position={[0, 0.15, 1.35]} castShadow><boxGeometry args={[2.8, 0.5, 0.65]} /><meshStandardMaterial {...material} /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]} receiveShadow><planeGeometry args={[12, 12]} /><meshStandardMaterial color="#d7cbbb" roughness={0.9} /></mesh>
  </group>;
}

function BedroomModel({ woodColor, fabricColor }) {
  if (hasRealBedroomModel()) return <RealBedroomModel woodColor={woodColor} fabricColor={fabricColor} scale={1} />;
  return <DemoBedroom woodColor={woodColor} fabricColor={fabricColor} />;
}

function CameraPreset({ mode }) {
  const { camera } = useThree();
  useMemo(() => {
    const positions = { front: [6.8, 4.7, 7.4], side: [8.7, 3.6, 1.4], top: [4.5, 8.5, 4.5] };
    const p = positions[mode] || positions.front;
    camera.position.set(...p);
    camera.lookAt(0, 0.8, 0);
  }, [camera, mode]);
  return null;
}

function App() {
  const [finish, setFinish] = useState(finishes[0]);
  const [fabric, setFabric] = useState(fabrics[0]);
  const [size, setSize] = useState(sizes[1]);
  const [liked, setLiked] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cameraMode, setCameraMode] = useState('front');
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const price = selectedProduct.price + finish.extra + fabric.extra + size.extra;

  const selectProduct = (product) => {
    setSelectedProduct(product);
    const match = finishes.find((f) => f.value === product.color);
    if (match) setFinish(match);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return <main className="app">
    <header className="header"><div className="brand"><span className="brand-mark">ک</span><div><strong>کاردان چوب</strong><small>CRAFTED FOR YOUR ROOM</small></div></div><nav><a href="#products">محصولات</a><a href="#custom">سفارشی‌سازی</a><a href="#about">درباره ما</a></nav><button className="cart">سبد خرید <span>{cartCount.toLocaleString('fa-IR')}</span></button></header>
    <section className="hero"><div className="hero-copy"><p className="eyebrow">COLLECTION 2026 · 3D EXPERIENCE</p><h1>اتاق خوابتان را<br /><em>خودتان طراحی کنید.</em></h1><p className="lead">سرویس خواب را در فضای سه‌بعدی ببینید، رنگ، پارچه و ابعاد را تغییر دهید و قبل از سفارش نتیجه نهایی را تجربه کنید.</p><div className="hero-actions"><button className="primary" onClick={() => document.getElementById('custom')?.scrollIntoView({ behavior: 'smooth' })}>شروع سفارشی‌سازی <span>←</span></button><button className="ghost" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>مشاهده مجموعه</button></div><div className="trust"><span>✓</span> تولید مستقیم در کارگاه <span>·</span> ضمانت کیفیت چوب</div></div>
      <div className="scene-card"><div className="scene-badge">{selectedProduct.name} · مدل سه‌بعدی</div><button className="heart" onClick={() => setLiked(!liked)}>{liked ? '♥' : '♡'}</button><Canvas shadows camera={{ position: [6.8, 4.7, 7.4], fov: 42 }}><CameraPreset mode={cameraMode} /><ambientLight intensity={1.1} /><directionalLight position={[5, 8, 5]} intensity={3.2} castShadow /><Environment preset="apartment" /><BedroomModel woodColor={finish.value} fabricColor={fabric.value} /><ContactShadows position={[0, -0.05, 0]} opacity={0.35} scale={12} blur={2.5} /><OrbitControls enablePan={false} minDistance={5} maxDistance={12} minPolarAngle={0.55} maxPolarAngle={1.45} /></Canvas><div className="camera-tools"><button className={cameraMode === 'front' ? 'active' : ''} onClick={() => setCameraMode('front')}>جلو</button><button className={cameraMode === 'side' ? 'active' : ''} onClick={() => setCameraMode('side')}>کنار</button><button className={cameraMode === 'top' ? 'active' : ''} onClick={() => setCameraMode('top')}>بالا</button></div><div className="scene-tip">برای چرخش، مدل را بکشید · برای زوم اسکرول کنید</div></div></section>
    <section className="configurator" id="custom"><div><p className="eyebrow">CONFIGURATOR</p><h2>مدل خودتان را بسازید</h2><p>تغییرات شما مستقیماً روی مدل سه‌بعدی اعمال می‌شود.</p></div><div className="config-row"><div><label>رنگ چوب</label><div className="swatches">{finishes.map((f) => <button key={f.name} className={finish.name === f.name ? 'swatch active' : 'swatch'} style={{ background: f.value }} title={f.name} onClick={() => setFinish(f)} />)}</div><small>{finish.name}</small></div><div><label>پارچه</label><div className="swatches">{fabrics.map((f) => <button key={f.name} className={fabric.name === f.name ? 'swatch active' : 'swatch'} style={{ background: f.value }} title={f.name} onClick={() => setFabric(f)} />)}</div><small>{fabric.name}</small></div><div><label>ابعاد تخت</label><div className="sizes">{sizes.map((s) => <button className={size.label === s.label ? 'selected' : ''} key={s.label} onClick={() => setSize(s)}>{s.label}</button>)}</div></div><div className="price"><small>قیمت نهایی مدل</small><strong>{price.toLocaleString('fa-IR')} <b>تومان</b></strong><button onClick={() => setCartCount((c) => c + 1)}>افزودن به سبد خرید</button></div></div></section>
    <section className="products" id="products"><div className="section-heading"><div><p className="eyebrow">OUR COLLECTION</p><h2>انتخابی برای هر سلیقه</h2></div><button className="view-all">مشاهده همه ←</button></div><div className="product-grid">{products.map((product, i) => <article className={'product ' + (selectedProduct.name === product.name ? 'product-active' : '')} key={product.name} onClick={() => selectProduct(product)}><div className={'product-art art-' + i}><div className="mini-bed" style={{ background: product.color }} /></div><div className="product-meta"><div><h3>سرویس خواب {product.name}</h3><p>تولید سفارشی · چوب طبیعی</p></div><strong>{product.price.toLocaleString('fa-IR')} تومان</strong></div></article>)}</div></section>
    <section className="process"><p className="eyebrow">HOW IT WORKS</p><h2>از انتخاب تا تحویل</h2><div className="process-grid"><div><b>۰۱</b><h3>انتخاب مدل</h3><p>مدل سه‌بعدی مورد علاقه خود را انتخاب کنید.</p></div><div><b>۰۲</b><h3>شخصی‌سازی</h3><p>رنگ، پارچه و ابعاد را متناسب با اتاق خود تغییر دهید.</p></div><div><b>۰۳</b><h3>ثبت سفارش</h3><p>قیمت نهایی را ببینید و سفارش را ثبت کنید.</p></div><div><b>۰۴</b><h3>ساخت و ارسال</h3><p>در کارگاه ساخته شده و با بسته‌بندی امن ارسال می‌شود.</p></div></div></section>
    <footer id="about"><div><strong>کاردان چوب</strong><p>طراحی و ساخت سرویس خواب با تجربه‌ای متفاوت.</p></div><div>تولید سفارشی · ارسال · پشتیبانی</div><div>© 2026 Kardan Choob</div></footer>
  </main>;
}
createRoot(document.getElementById('root')).render(<App />);
