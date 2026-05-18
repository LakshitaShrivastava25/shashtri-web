import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  MapPin,
  Receipt,
  Wallet,
  Truck,
  Bike,
  Zap,
  Lock,
  Shield,
} from 'lucide-react';
import { placeOrder } from '../../api/storeApi';
import { useCartStore, selectSubtotal } from '../../store';

const PACKAGING_CHARGE = 15;

const SHIPPING_COST = {
  standard: 0,
  express: 99,
  sameday: 199,
};

const DELIVERY_OPTIONS = [
  {
    key: 'standard',
    Icon: Truck,
    label: 'Standard\nDelivery',
    eta: '3-5 Days',
    priceLabel: 'FREE',
  },
  {
    key: 'express',
    Icon: Bike,
    label: 'Express\nDelivery',
    eta: '1-2 Days',
    priceLabel: '₹99',
  },
  {
    key: 'sameday',
    Icon: Zap,
    label: 'Same Day',
    eta: 'Within 6h',
    priceLabel: '₹199',
  },
];

// Tiny gold lotus mark for cart-line image fallback (44×44 cell)
function LotusMark() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="w-7 h-7 opacity-50"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        transform="translate(100,100)"
        fill="none"
        stroke="#F4A623"
        strokeWidth="2"
      >
        <circle r="30" />
        <circle r="60" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <ellipse cx="0" cy="40" rx="8" ry="20" />
          </g>
        ))}
      </g>
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="4"
      />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Checkout() {
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [isPlacing, setIsPlacing] = useState(false);

  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const subtotal = useCartStore(selectSubtotal);

  const shippingCost = SHIPPING_COST[deliveryOption] ?? 0;
  const grandTotal = useMemo(
    () => subtotal + PACKAGING_CHARGE + shippingCost,
    [subtotal, shippingCost]
  );

  const fmt = (n) => Number(n || 0).toLocaleString('en-IN');

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      toast.error('Please enter a delivery address');
      return;
    }
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    setIsPlacing(true);
    try {
      const res = await placeOrder({
        items: items.map((i) => ({
          product_id: i.productId,
          variant_id: i.variantId,
          vendor_id: i.vendorId,
          qty: i.qty,
        })),
        delivery_address: address.trim(),
        delivery_option: deliveryOption,
        grand_total: grandTotal,
      });
      clearCart();
      navigate('/store/order/' + (res?.order_id ?? res?.id), {
        replace: true,
      });
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.detail ||
          'Failed to place order. Please try again.'
      );
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div className="bg-[#F8EFE3] min-h-screen pb-32">
      {/* TOP BAR */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3">
        <div className="relative flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="p-2 rounded-xl hover:bg-gray-50 text-[#2D1B00]"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="absolute left-1/2 -translate-x-1/2 font-semibold text-[#2D1B00] text-base">
            Checkout
          </h1>

          <div className="bg-[#FFF8ED] border border-[#F4A623] text-[#F4A623] rounded-full px-3 py-1.5 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">100% Secure</span>
          </div>
        </div>
      </header>

      {/* CARD 1 — DELIVERY ADDRESS */}
      <section className="bg-white rounded-2xl mx-4 mt-4 p-4 shadow-sm">
        <div className="flex items-center mb-3">
          <MapPin className="text-[#F4A623] w-5 h-5 mr-2" />
          <h2 className="font-semibold text-[#2D1B00] text-sm">
            Delivery Address
          </h2>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('checkout-address');
              if (el) el.focus();
            }}
            className="text-[#F4A623] text-xs ml-auto cursor-pointer"
          >
            Change
          </button>
        </div>
        <textarea
          id="checkout-address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="House no., street, area, city, pincode..."
          className="w-full bg-[#FFF8ED] rounded-xl p-3 text-sm text-[#2D1B00] border border-[#F4A623]/30 outline-none resize-none h-24 placeholder-gray-400 focus:border-[#F4A623]"
        />
        <div className="mt-2">
          <button
            type="button"
            onClick={() =>
              setAddress(
                '123, Main Street, Sector 4, Bhopal, MP - 462001'
              )
            }
            className="bg-[#FFF8ED] border border-[#F4A623] text-[#C17D0A] text-xs px-3 py-1 rounded-full"
          >
            ★ Default Address
          </button>
        </div>
      </section>

      {/* CARD 2 — ORDER SUMMARY */}
      <section className="bg-white rounded-2xl mx-4 mt-3 p-4 shadow-sm">
        <div className="flex items-center mb-3">
          <Receipt className="text-[#F4A623] w-5 h-5 mr-2" />
          <h2 className="font-semibold text-[#2D1B00] text-sm">
            Order Summary ({items.length} items)
          </h2>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-[#F4A623] text-xs ml-auto"
          >
            Edit
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-3">
            Your cart is empty.
          </p>
        ) : (
          items.map((item, idx) => (
            <div
              key={`${item.variantId}::${item.vendorId}::${idx}`}
              className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0"
            >
              <div className="w-11 h-11 rounded-xl bg-[#FFF8ED] flex items-center justify-center overflow-hidden flex-shrink-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextSibling)
                        e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : null}
                <div style={{ display: item.image ? 'none' : 'block' }}>
                  <LotusMark />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#2D1B00] truncate">
                  {item.name}
                </p>
                {item.packSize && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {item.packSize}
                  </p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-[#2D1B00]">
                  ₹{fmt((Number(item.price) || 0) * (Number(item.qty) || 0))}
                </p>
                <p className="text-xs text-gray-400">×{item.qty}</p>
              </div>
            </div>
          ))
        )}
      </section>

      {/* CARD 3 — PRICE DETAILS */}
      <section className="bg-white rounded-2xl mx-4 mt-3 p-4 shadow-sm">
        <div className="flex items-center mb-3">
          <Wallet className="text-[#F4A623] w-5 h-5 mr-2" />
          <h2 className="font-semibold text-[#2D1B00] text-sm">
            Price Details
          </h2>
        </div>

        <div className="flex justify-between items-center py-1.5 text-sm">
          <span className="text-[#2D1B00]/80">Subtotal</span>
          <span className="text-[#2D1B00]">₹{fmt(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center py-1.5 text-sm">
          <span className="text-[#2D1B00]/80">Shipping Charges</span>
          {shippingCost === 0 ? (
            <span className="text-green-600 font-semibold">FREE</span>
          ) : (
            <span className="text-[#2D1B00]">₹{fmt(shippingCost)}</span>
          )}
        </div>
        <div className="flex justify-between items-center py-1.5 text-sm">
          <span className="text-[#2D1B00]/80">Packaging Charges</span>
          <span className="text-[#2D1B00]">₹{fmt(PACKAGING_CHARGE)}</span>
        </div>

        <hr className="my-2 border-gray-100" />

        <div className="flex justify-between items-center">
          <span className="font-bold text-[#2D1B00] text-sm">
            Grand Total
          </span>
          <span className="font-bold text-[#F4A623] text-base">
            ₹{fmt(grandTotal)}
          </span>
        </div>
      </section>

      {/* CARD 4 — DELIVERY OPTIONS */}
      <section className="bg-white rounded-2xl mx-4 mt-3 p-4 shadow-sm">
        <div className="flex items-center mb-3">
          <Truck className="text-[#F4A623] w-5 h-5 mr-2" />
          <h2 className="font-semibold text-[#2D1B00] text-sm">
            Delivery Options
          </h2>
        </div>

        <div className="flex gap-2">
          {DELIVERY_OPTIONS.map(({ key, Icon, label, eta, priceLabel }) => {
            const isSel = deliveryOption === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setDeliveryOption(key)}
                className={`flex-1 rounded-xl border-2 p-3 flex flex-col items-center text-center cursor-pointer transition-all ${
                  isSel
                    ? 'border-[#F4A623] bg-[#FFF8ED]'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <Icon className="w-5 h-5 text-[#F4A623]" />
                <span className="text-[10px] font-bold text-[#2D1B00] mt-1.5 whitespace-pre-line leading-tight">
                  {label}
                </span>
                <span className="text-[9px] text-gray-400 mt-0.5">{eta}</span>
                <span className="text-[10px] text-[#F4A623] font-bold mt-1">
                  {priceLabel}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* STICKY BOTTOM BAR */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 pt-3 pb-6 z-50">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xl font-bold text-[#F4A623] leading-none">
              ₹{fmt(grandTotal)}
            </p>
            <span className="text-[10px] text-gray-400 block mt-0.5">
              View Details ↑
            </span>
          </div>
          <div className="flex-1">
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={isPlacing}
              className={`w-full bg-[#F4A623] text-white rounded-2xl py-3.5 font-semibold text-base flex items-center justify-center gap-2 ${
                isPlacing ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isPlacing ? (
                <Spinner />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              {isPlacing ? 'Placing…' : 'Place Order'}
            </button>
          </div>
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-2">
          🔒 Safe &amp; Secure Payment
        </p>
      </footer>
    </div>
  );
}
