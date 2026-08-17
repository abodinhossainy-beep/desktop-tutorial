import React from 'react';

export default function CartDrawer({ open, onClose, item, onCheckout }) {
  if (!open) return null;
  return <div className="cart-layer" onClick={onClose}>
    <aside className="cart-drawer" onClick={(e) => e.stopPropagation()} dir="rtl">
      <div className="cart-head"><div><span className="eyebrow">YOUR ORDER</span><h3>سبد خرید</h3></div><button onClick={onClose} className="drawer-close">×</button></div>
      {item ? <>
        <div className="cart-item"><div className="cart-preview" style={{ background: item.wood }}><span>3D</span></div><div className="cart-item-info"><strong>سرویس خواب {item.product}</strong><small>ابعاد: {item.size}</small><small>چوب: {item.woodName} · پارچه: {item.fabricName}</small><b>{item.price.toLocaleString('fa-IR')} تومان</b></div></div>
        <div className="cart-specs"><div><span>تعداد</span><b>۱</b></div><div><span>ساخت</span><b>سفارشی</b></div><div><span>وضعیت</span><b>آماده ثبت سفارش</b></div></div>
        <button className="checkout-btn" onClick={onCheckout}>ادامه و ثبت سفارش <span>←</span></button>
      </> : <div className="empty-cart">سبد خرید شما خالی است.<br /><small>یک مدل سه‌بعدی را سفارشی کنید.</small></div>}
    </aside>
  </div>;
}
