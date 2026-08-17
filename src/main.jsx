import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import './style.css';

const finishes = [
  { name: 'گردویی', value: '#5b3b25' },
  { name: 'بلوط روشن', value: '#a87343' },
  { name: 'مشکی', value: '#191715' },
  { name: 'سفید گرم', value: '#e7dfd2' },
];

function BedroomSet({ color }) {
  const material = useMemo(() => ({ color, roughness: 0.38, metalness: 0.02 }), [color]);
  return (
    <group position={[0, -0.15, 0]}>
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[3.9, 0.35, 4.3]} />
        <meshStandardMaterial {...material} />
      </mesh>
      <mesh position={[0, 1.65, -1.82]} castShadow>
        <boxGeometry args={[4.15, 2.55, 0.3]} />
        <meshStandardMaterial {...material} />
      </mesh>
      <mesh position={[0, 0.88, 0.1]} castShadow>
        <boxGeometry args={[3.45, 0.48, 3.8]} />
        <meshStandardMaterial color="#d6c7b5" roughness={0.75} />
      </mesh>
      {[-2.55, 2.55].map((x) => (
        <group key={x} position={[x, 0.75, -0.15]}>
          <mesh castShadow><boxGeometry args={[0.85, 1.25, 1.15]} /><meshStandardMaterial {...material} /></mesh>
          <mesh position={[0, 0.15, 0.58]}><boxGeometry args={[0.68, 0.42, 0.06]} /><meshStandardMaterial color="#d7c2a7" /></mesh>
        </group>
      ))}
      <mesh position={[0, 0.15, 1.35]} castShadow>
        <boxGeometry args={[2.8, 0.5, 0.65]} />
        <meshStandardMaterial {...material} />
      </mesh>
    </group>
  );
}

function App() {
  const [finish, setFinish] = useState(finishes[0]);
  const [size, setSize] = useState('160×200');
  const [liked, setLiked] = useState(false);

  return (
    <main className="app">
      <header className="header">
        <div className="brand"><span className="brand-mark">ک</span><div><strong>کاردان چوب</strong><small>CRAFTED FOR YOUR ROOM</small></div></div>
        <nav><a href="#products">محصولات</a><a href="#custom">سفارشی‌سازی</a><a href="#about">درباره ما</a></nav>
        <button className="cart">سبد خرید <span>۰</span></button>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">COLLECTION 2026 · 3D EXPERIENCE</p>
          <h1>اتاق خوابتان را<br /><em>خودتان طراحی کنید.</em></h1>
          <p className="lead">سرویس خواب را در فضای سه‌بعدی ببینید، رنگ و ابعاد را تغییر دهید و قبل از سفارش، نتیجه نهایی را تجربه کنید.</p>
          <div className="hero-actions"><button className="primary">مشاهده مجموعه <span>←</span></button><button className="ghost">چطور کار می‌کند؟</button></div>
          <div className="trust"><span>✓</span> تولید مستقیم در کارگاه <span>·</span> ضمانت کیفیت چوب</div>
        </div>
        <div className="scene-card">
          <div className="scene-badge">مدل سه‌بعدی تعاملی</div>
          <button className="heart" onClick={() => setLiked(!liked)}>{liked ? '♥' : '♡'}</button>
          <Canvas shadows camera={{ position: [6.8, 4.7, 7.4], fov: 42 }}>
            <ambientLight intensity={1.2} />
            <directionalLight position={[5, 8, 5]} intensity={3.2} castShadow />
            <Environment preset="apartment" />
            <BedroomSet color={finish.value} />
            <ContactShadows position={[0, -0.05, 0]} opacity={0.35} scale={12} blur={2.5} />
            <OrbitControls enablePan={false} minDistance={5} maxDistance={12} minPolarAngle={0.65} maxPolarAngle={1.35} />
          </Canvas>
          <div className="scene-tip">برای چرخش، مدل را بکشید · برای زوم اسکرول کنید</div>
        </div>
      </section>

      <section className="configurator" id="custom">
        <div><p className="eyebrow">CONFIGURATOR</p><h2>مدل خودتان را بسازید</h2><p>انتخاب شما مستقیماً روی مدل سه‌بعدی اعمال می‌شود.</p></div>
        <div className="config-row"><div><label>رنگ چوب</label><div className="swatches">{finishes.map((f) => <button key={f.name} className={finish.name === f.name ? 'swatch active' : 'swatch'} style={{ background: f.value }} title={f.name} onClick={() => setFinish(f)} />)}</div><small>{finish.name}</small></div><div><label>ابعاد تخت</label><div className="sizes">{['140×200', '160×200', '180×200'].map((s) => <button className={size === s ? 'selected' : ''} key={s} onClick={() => setSize(s)}>{s}</button>)}</div></div><div className="price"><small>قیمت شروع</small><strong>۴۸,۹۰۰,۰۰۰ <b>تومان</b></strong><button>سفارش این مدل</button></div></div>
      </section>

      <section className="products" id="products"><div className="section-heading"><div><p className="eyebrow">OUR COLLECTION</p><h2>انتخابی برای هر سلیقه</h2></div><button className="view-all">مشاهده همه ←</button></div><div className="product-grid">{['آریا', 'رُما', 'وین'].map((name, i) => <article className="product" key={name}><div className={'product-art art-' + i}><div className="mini-bed" /></div><div className="product-meta"><div><h3>سرویس خواب {name}</h3><p>تولید سفارشی · چوب طبیعی</p></div><strong>{[489, 565, 629][i].toLocaleString('fa-IR')}٬۰۰۰٬۰۰۰</strong></div></article>)}</div></section>

      <footer id="about"><div><strong>کاردان چوب</strong><p>طراحی و ساخت سرویس خواب با تجربه‌ای متفاوت.</p></div><div>تولید سفارشی · ارسال · پشتیبانی</div><div>© 2026 Kardan Choob</div></footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
