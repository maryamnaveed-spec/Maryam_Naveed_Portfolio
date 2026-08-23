'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { formatPKR } from '@/lib/currency';
import { useCart } from './CartProvider';
import ModalPortal from './ModalPortal';

export default function CheckoutModal({ onClose }: { onClose: () => void }) {
  const { lines, totalPrice, clearCart } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function validate() {
    const e: typeof errors = {};
    if (name.trim().length < 2) e.name = 'Please enter your name.';
    if (phone.trim().length < 7) e.phone = 'Please enter a valid phone number.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus('sending');
    const { error } = await supabase.from('orders').insert({
      customer_name: name.trim(),
      phone: phone.trim(),
      address: address.trim() || null,
      items: lines.map((l) => ({ product_id: l.id, name: l.name, price: l.price, qty: l.qty })),
      total: totalPrice
    });

    if (error) {
      setStatus('error');
      setErrorMsg(error.message);
      return;
    }

    clearCart();
    setStatus('done');
  }

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 bg-ink/55 flex items-center justify-center z-[200] p-5 animate-[fadeIn_0.2s_ease-out]"
        onClick={onClose}
      >
        <div
          className="bg-surface w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-[zoomIn_0.25s_ease-out] max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-borderpink flex-shrink-0">
            <h4 className="text-lg flex items-center gap-2">
              <span aria-hidden="true">🛍️</span>{' '}
              {status === 'done' ? 'Order placed!' : 'Checkout'}
            </h4>
            <button
              onClick={onClose}
              className="text-inksoft text-xl leading-none hover:text-pink-600"
              aria-label="Close"
            >
              &times;
            </button>
          </div>

          <div className="p-6 overflow-y-auto">
            {status === 'done' ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-3">🎉</div>
                <p className="text-sm text-inksoft mb-1">
                  Thanks, {name}! Your order request has been sent.
                </p>
                <p className="text-xs text-inksoft/70">
                  Maryam will reach out on {phone} to confirm payment &amp; delivery.
                </p>
                <button
                  onClick={onClose}
                  className="mt-5 text-sm font-semibold px-5 py-2 rounded-full text-white bg-gradient-to-br from-pink-400 to-pink-600"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="border border-borderpink rounded-xl p-3 mb-4 max-h-40 overflow-y-auto">
                  {lines.map((l) => (
                    <div key={l.id} className="flex justify-between text-xs py-1">
                      <span className="truncate pr-2">
                        {l.name} <span className="text-inksoft/60">×{l.qty}</span>
                      </span>
                      <span className="flex-shrink-0 font-medium">
                        {formatPKR(l.price * l.qty)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-semibold pt-2 mt-2 border-t border-borderpink">
                    <span>Total</span>
                    <span>
                      {formatPKR(totalPrice)}
                    </span>
                  </div>
                </div>

                <form onSubmit={placeOrder} noValidate>
                  <label className="block text-xs font-semibold mb-1.5">Your name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 text-sm mb-1 ${
                      errors.name ? 'border-red-400' : 'border-borderpink'
                    }`}
                  />
                  {errors.name && <p className="text-xs text-red-500 mb-2">{errors.name}</p>}

                  <label className="block text-xs font-semibold mb-1.5 mt-2">Phone number</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="03xx-xxxxxxx"
                    className={`w-full border rounded-lg px-3 py-2 text-sm mb-1 ${
                      errors.phone ? 'border-red-400' : 'border-borderpink'
                    }`}
                  />
                  {errors.phone && <p className="text-xs text-red-500 mb-2">{errors.phone}</p>}

                  <label className="block text-xs font-semibold mb-1.5 mt-2">
                    Delivery address (optional)
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={2}
                    className="w-full border border-borderpink rounded-lg px-3 py-2 text-sm mb-3"
                  />

                  <p className="text-[11px] text-inksoft/70 mb-4">
                    This sends your order request straight to Maryam — payment
                    &amp; delivery get arranged directly with her afterwards.
                  </p>

                  {status === 'error' && <p className="text-xs text-red-500 mb-3">{errorMsg}</p>}

                  <button
                    disabled={status === 'sending'}
                    className="w-full py-2.5 rounded-full text-white text-sm font-semibold bg-gradient-to-br from-pink-400 to-pink-600 disabled:opacity-60"
                  >
                    {status === 'sending' ? 'Placing order...' : 'Place order'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        <style jsx global>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes zoomIn { from { opacity: 0; transform: scale(0.94); } to { opacity: 1; transform: scale(1); } }
        `}</style>
      </div>
    </ModalPortal>
  );
}
