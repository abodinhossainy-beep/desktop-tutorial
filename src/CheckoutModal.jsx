import React, { useState } from 'react';

export default function CheckoutModal({ open, item, onClose, onSubmit }) {
  const [form, setForm] = useState({ name: '', phone: '', city: '', address: '', payment: 'cash' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  if (!open) return null;
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event) => {
    event.preventDefault(); setError('');
    const phone = form.phone.replace(/\s|-/g, '');
    if (!form.name.trim() || !/^0?9\d{9}$/.test(phone)) { setError('لطفاً نام و شماره تماس معتبر وارد کنید.'); return; }
    setLoading(true);
    try {
      const response = await fetch('/api/orders/create.php', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({...form, phone, item}) });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'ثبت سفارش انجام نشد.');
      setOrderNumber(result.order?.order_number || '');
      onSubmit({...form, phone, item, orderNumber:result.order?.order_number, createdAt:new Date().toISOString()});
      setSubmitted(true);
    } catch (err) { setError(err.message || 'ارتباط با سرور برقرار نشد.'); }
    finally { setLoading(false); }
  };
  return <div className="checkout-layer" onClick={onClose} dir="rtl"><section className="checkout-modal" onClick={(e) => e.stopPropagation()}>
    <button className="drawer-close checkout-close" onClick={onClose}>×</button>
    {!submitted ? <>
      <span className="eyebrow">CHECKOUT · CUSTOM ORDER</span><h2>ثبت سفارش</h2><p className="checkout-intro">مشخصات خود را وارد کنید تا سفارش سفارشی شما در سیستم ثبت شود.</p>
      <div className="checkout-summary"><strong>سرویس خواب {item?.product}</strong><span>{item?.size} · {item?.woodName} · {item?.fabricName}</span><b>{item?.price.toLocaleString('fa-IR')} تومان</b></div>
      <form onSubmit={submit}>
        <label>نام و نام خانوادگی<input required value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="مثلاً محمد احمدی" /></label>
        <label>شماره تماس<input required inputMode="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="09xxxxxxxxx" /></label>
        <div className="checkout-two"><label>شهر<input value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="تهران" /></label><label>روش پرداخت<select value={form.payment} onChange={(e) => update('payment', e.target.value)}><option value="cash">نقدی</option><option value="installment">پیش‌پرداخت + تسویه</option><option value="check">چک / توافقی</option></select></label></div>
        <label>آدرس / توضیحات تحویل<textarea rows="3" value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="آدرس یا توضیحات سفارش" /></label>
        {error && <div className="form-error">{error}</div>}
        <button className="checkout-btn" type="submit" disabled={loading}>{loading ? 'در حال ثبت سفارش…' : <>ثبت درخواست سفارش <span>←</span></>}</button>
      </form>
    </> : <div className="success-state"><div className="success-icon">✓</div><span className="eyebrow">ORDER RECEIVED</span><h2>سفارش شما ثبت شد</h2><p>کد سفارش شما:</p><strong className="order-number">{orderNumber}</strong><p>کارشناس فروش مشخصات مدل سه‌بعدی شما را بررسی می‌کند و برای هماهنگی با شما تماس می‌گیرد.</p><button className="checkout-btn" onClick={onClose}>بازگشت به فروشگاه</button></div>}
  </section></div>;
}
