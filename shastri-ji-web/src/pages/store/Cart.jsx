import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Tag,
  ChevronRight,
} from 'lucide-react';
import {
  useCartStore,
  selectTotalItems,
  selectSubtotal,
} from '../../store';

const PACKAGING_CHARGE = 15;
const COUPON_CODE = 'SHASTRI10';
const COUPON_DISCOUNT = 10;

// ─── Lotus placeholder ────────────────────────────────────────────────────────

function LotusMark({ className = 'w-10 h-10' }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`${className} opacity-50`}
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

// ─── Cart line ────────────────────────────────────────────────────────────────

function CartItemRow({ item, onUpdateQty, onRemove }) {
  const lineTotal =
    (Number(item.price) || 0) * (Number(item.qty) || 0);
  const minDisabled = item.qty <= 1;

  return (
    <div className="flex items-start gap-3 p-4 border-b border-gray-50 last:border-0">
      <div className="w-20 h-20 rounded-xl bg-[#FFF8ED] flex items-center justify-center flex-shrink-0 overflow-hidden">
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
          <LotusMark className="w-10 h-10" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#2D1B00] line-clamp-2">
          {item.name}
        </p>
        {item.packSize && (
          <p className="text-xs text-gray-400 mt-0.5">{item.packSize}</p>
        )}
        <p className="text-xs text-gray-400 mt-0.5">
          ₹{Number(item.price ?? 0).toLocaleString('en-IN')} each
        </p>

        <div className="flex items-center gap-2 mt-2">
          <button
            type="button"
            onClick={() =>
              onUpdateQty(item.variantId, item.vendorId, item.qty - 1)
            }
            disabled={minDisabled}
            className={`w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center ${
              minDisabled ? 'opacity-40 cursor-not-allowed' : ''
            }`}
            aria-label="Decrease quantity"
          >
            <Minus className="w-3 h-3 text-[#2D1B00]" />
          </button>
          <span className="text-sm font-semibold text-[#2D1B00] w-6 text-center">
            {item.qty}
          </span>
          <button
            type="button"
            onClick={() =>
              onUpdateQty(item.variantId, item.vendorId, item.qty + 1)
            }
            className="w-7 h-7 rounded-lg bg-[#F4A623] flex items-center justify-center"
            aria-label="Increase quantity"
          >
            <Plus className="w-3 h-3 text-white" />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between self-stretch">
        <button
          type="button"
          onClick={() => onRemove(item.variantId, item.vendorId)}
          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <p className="text-base font-bold text-[#F4A623] mt-auto">
          ₹{lineTotal.toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Cart() {
  const navigate = useNavigate();

  const items = useCartStore((s) => s.items);
  const totalItems = useCartStore(selectTotalItems);
  const subtotal = useCartStore(selectSubtotal);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const updateQty = useCartStore((s) => s.updateQty);
  const clearCart = useCartStore((s) => s.clearCart);

  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const grandTotal = useMemo(
    () =>
      subtotal + PACKAGING_CHARGE - (couponApplied ? COUPON_DISCOUNT : 0),
    [subtotal, couponApplied]
  );
  const fmt = (n) => Number(n || 0).toLocaleString('en-IN');

  const handleRemove = useCallback(
    (variantId, vendorId) => {
      removeFromCart(variantId, vendorId);
    },
    [removeFromCart]
  );

  const handleUpdateQty = useCallback(
    (variantId, vendorId, qty) => {
      updateQty(variantId, vendorId, qty);
    },
    [updateQty]
  );

  const handleClear = () => {
    if (window.confirm('Remove all items from your cart?')) {
      clearCart();
      toast.success('Cart cleared');
    }
  };

  const handleApplyCoupon = () => {
    if (couponApplied) return;
    if (coupon.trim().toUpperCase() === COUPON_CODE) {
      setCouponApplied(true);
      toast.success(`Coupon applied! ₹${COUPON_DISCOUNT} off`);
    } else {
      toast.error('Invalid coupon code');
    }
  };

  // Empty state
  if (items.length === 0) {
    return (
      <div className="bg-[#F8EFE3] min-h-screen">
        {/* Top bar (no Clear button when empty) */}
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="p-2 rounded-xl hover:bg-gray-50 text-[#2D1B00]"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="flex-1 text-center font-semibold text-[#2D1B00] text-base">
            My Cart
          </span>
          <span className="w-9" />
        </header>

        <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
          <ShoppingCart className="w-20 h-20 text-[#F4A623]/30 mb-6" />
          <h2
            className="font-semibold text-xl text-[#2D1B00]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Your cart is empty
          </h2>
          <p className="text-sm text-gray-400 mt-2 mb-8">
            Add items from our sacred store to begin
          </p>
          <button
            type="button"
            onClick={() => navigate('/store')}
            className="bg-[#F4A623] text-white rounded-2xl px-8 py-3.5 font-semibold flex items-center gap-2 mx-auto"
          >
            <ShoppingBag className="w-5 h-5" />
            Browse Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8EFE3] min-h-screen pb-32">
      {/* TOP BAR */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="p-2 rounded-xl hover:bg-gray-50 text-[#2D1B00]"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="flex-1 text-center font-semibold text-[#2D1B00] text-base">
          My Cart
        </span>
        <button
          type="button"
          onClick={handleClear}
          className="text-sm text-red-400 font-medium"
        >
          Clear
        </button>
      </header>

      {/* CART ITEMS CARD */}
      <section className="bg-white rounded-2xl mx-4 mt-4 overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
          <ShoppingCart className="text-[#F4A623] w-4 h-4" />
          <h2 className="text-sm font-semibold text-[#2D1B00]">
            {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
          </h2>
        </div>
        {items.map((item, idx) => (
          <CartItemRow
            key={`${item.variantId}::${item.vendorId}::${idx}`}
            item={item}
            onUpdateQty={handleUpdateQty}
            onRemove={handleRemove}
          />
        ))}
      </section>

      {/* COUPON CARD */}
      <section className="bg-white rounded-2xl mx-4 mt-3 p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Tag className="text-[#F4A623] w-4 h-4" />
          <h2 className="font-semibold text-[#2D1B00] text-sm">
            Apply Coupon
          </h2>
        </div>
        <div className="flex gap-2 mt-3">
          <input
            value={coupon}
            onChange={(e) => setCoupon(e.target.value.toUpperCase())}
            disabled={couponApplied}
            placeholder="Enter coupon code"
            className="flex-1 bg-[#FFF8ED] border border-[#F4A623]/30 rounded-xl px-3 py-2.5 text-sm uppercase outline-none placeholder-gray-400 focus:border-[#F4A623] disabled:opacity-60"
          />
          <button
            type="button"
            onClick={handleApplyCoupon}
            disabled={couponApplied}
            className="bg-[#F4A623] text-white rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-70"
          >
            {couponApplied ? '✓ Applied' : 'Apply'}
          </button>
        </div>
      </section>

      {/* PRICE SUMMARY */}
      <section className="bg-white rounded-2xl mx-4 mt-3 p-4 shadow-sm">
        <h2 className="font-semibold text-[#2D1B00] text-sm mb-3">
          Price Summary
        </h2>
        <div className="flex justify-between text-sm py-1.5">
          <span className="text-[#2D1B00]/80">
            Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''})
          </span>
          <span className="text-[#2D1B00]">₹{fmt(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm py-1.5">
          <span className="text-[#2D1B00]/80">Shipping</span>
          <span className="text-xs text-gray-400 italic">
            Calculated at checkout
          </span>
        </div>
        <div className="flex justify-between text-sm py-1.5">
          <span className="text-[#2D1B00]/80">Packaging Charges</span>
          <span className="text-[#2D1B00]">₹{fmt(PACKAGING_CHARGE)}</span>
        </div>
        {couponApplied && (
          <div className="flex justify-between text-sm py-1.5">
            <span className="text-[#2D1B00]/80">Coupon ({COUPON_CODE})</span>
            <span className="text-green-600 font-semibold">
              - ₹{COUPON_DISCOUNT}
            </span>
          </div>
        )}

        <hr className="my-2 border-gray-100" />

        <div className="flex justify-between items-center">
          <span className="font-semibold text-[#2D1B00] text-sm">
            Total (excl. shipping)
          </span>
          <span className="font-bold text-[#F4A623] text-base">
            ₹{fmt(grandTotal)}
          </span>
        </div>
        <p className="text-[10px] text-gray-400 mt-1 text-right">
          Shipping charges will be added at checkout
        </p>
      </section>

      {/* YOU MIGHT ALSO LIKE */}
      <section className="bg-white rounded-2xl mx-4 mt-3 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[#2D1B00] text-sm">
            You Might Also Like
          </h2>
          <button
            type="button"
            onClick={() => navigate('/store')}
            className="text-[#F4A623] text-xs"
          >
            View All
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 mt-3 -mx-1 px-1">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => navigate('/store')}
              className="flex-shrink-0 w-28 bg-[#FFF8ED] rounded-xl p-3 flex flex-col items-center text-center cursor-pointer"
            >
              <LotusMark className="w-10 h-10 mb-2" />
              <p className="text-xs font-semibold text-[#2D1B00] line-clamp-1">
                Sacred Item
              </p>
              <p className="text-xs text-[#F4A623] font-bold mt-0.5">₹99</p>
            </button>
          ))}
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
              excl. shipping
            </span>
          </div>
          <div className="flex-1">
            <button
              type="button"
              onClick={() => navigate('/store/checkout')}
              className="w-full bg-[#F4A623] text-white rounded-2xl py-3.5 font-semibold text-base flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Proceed to Checkout
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
