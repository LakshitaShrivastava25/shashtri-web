import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  ArrowLeft,
  Bell,
  Package,
  CheckCircle2,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  MessageCircle,
  Phone,
  FileText,
} from 'lucide-react';
import { getOrderDetail } from '../../api/storeApi';

// ─── Constants ────────────────────────────────────────────────────────────────

const STEPS = [
  { key: 'placed', label: 'Order\nPlaced', Icon: Package },
  { key: 'confirmed', label: 'Confirmed', Icon: CheckCircle2 },
  { key: 'packed', label: 'Packed', Icon: Package },
  { key: 'shipped', label: 'Shipped', Icon: Truck },
  { key: 'delivered', label: 'Delivered', Icon: CheckCircle2 },
];

const STATUS_MAP = {
  placed: 0,
  confirmed: 1,
  packed: 2,
  shipped: 3,
  delivered: 4,
};

const TIMELINE = [
  {
    key: 'placed',
    title: 'Order Placed',
    sub: 'Your order has been placed successfully',
  },
  {
    key: 'confirmed',
    title: 'Order Confirmed',
    sub: 'Seller has confirmed your order',
  },
  {
    key: 'packed',
    title: 'Packed',
    sub: 'Your order is packed and ready to ship',
  },
  {
    key: 'shipped',
    title: 'Out for Shipping',
    sub: 'Your order is on the way',
  },
  {
    key: 'delivery',
    title: 'Out for Delivery',
    sub: 'Your order is arriving today',
  },
  {
    key: 'delivered',
    title: 'Delivered',
    sub: 'Order delivered successfully',
  },
];

const TRUST_BADGES = [
  {
    Icon: Bell,
    label: 'Real-time Updates',
    sub: 'Stay updated on every step',
  },
  {
    Icon: Package,
    label: 'Secure Packaging',
    sub: 'Safe & hygienic packing',
  },
  { Icon: RotateCcw, label: 'Easy Returns', sub: 'Hassle-free returns' },
  {
    Icon: ShieldCheck,
    label: 'Authentic Products',
    sub: '100% genuine items',
  },
];

// ─── Lotus placeholder for missing item images ────────────────────────────────

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

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="bg-[#F8EFE3] min-h-screen pb-8">
      <div className="h-14 bg-white border-b border-gray-100" />
      <div className="mx-4 mt-4 bg-white rounded-2xl h-20 animate-pulse" />
      <div className="mx-4 mt-3 bg-white rounded-2xl h-36 animate-pulse" />
      <div className="mx-4 mt-3 bg-white rounded-2xl h-16 animate-pulse" />
      <div className="mx-4 mt-3 bg-white rounded-2xl h-52 animate-pulse" />
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getOrderDetail(orderId)
      .then((data) => {
        if (!cancelled) setOrder(data);
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            err?.response?.data?.detail ||
              err?.message ||
              'Failed to load order'
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const currentStep = STATUS_MAP[order?.status] ?? 0;

  if (loading) return <LoadingState />;

  if (error || !order) {
    return (
      <div className="bg-[#F8EFE3] min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <Package className="text-gray-200 w-16 h-16 mb-4" />
        <p className="text-lg font-semibold text-gray-500">
          Order not found
        </p>
        <p className="text-sm text-gray-400 mt-1">
          We couldn't load this order.
        </p>
        <button
          type="button"
          onClick={() => navigate('/home')}
          className="mt-6 bg-[#F4A623] text-white rounded-2xl px-6 py-3 font-semibold"
        >
          ← Back to Home
        </button>
      </div>
    );
  }

  const firstItem = order.items?.[0];

  return (
    <div className="bg-[#F8EFE3] min-h-screen pb-8">
      {/* TOP BAR */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="p-2 rounded-xl hover:bg-gray-50 text-[#2D1B00]"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="flex-1 text-center font-semibold text-[#2D1B00] text-base">
          Order Tracking
        </span>
        <div className="bg-[#FFF8ED] border border-[#F4A623] text-[#F4A623] text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
          <Headphones className="w-3 h-3" />
          <span>Support</span>
        </div>
        <Bell className="w-5 h-5 text-[#2D1B00] ml-1" />
      </header>

      {/* ORDER INFO CARD */}
      <section className="bg-[#FFF8ED] rounded-2xl mx-4 mt-4 p-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-[#F4A623]/20 flex items-center justify-center flex-shrink-0">
          <Package className="text-[#F4A623] w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[#2D1B00] text-sm">
            Order #{order.order_number}
          </p>
          {order.created_at && (
            <p className="text-xs text-gray-500 mt-0.5">
              {dayjs(order.created_at).format('D MMM YYYY, h:mm A')}
            </p>
          )}
          <p className="text-sm font-semibold text-[#2D1B00] mt-0.5">
            Total Amount: ₹
            {Number(order.grand_total ?? 0).toLocaleString('en-IN')}
          </p>
        </div>
        <button
          type="button"
          className="border border-[#F4A623] rounded-xl p-2 flex flex-col items-center gap-0.5 cursor-pointer flex-shrink-0"
        >
          <FileText className="text-[#F4A623] w-4 h-4" />
          <span className="text-[9px] text-[#F4A623] leading-tight text-center whitespace-pre-line">
            View{'\n'}Invoice
          </span>
        </button>
      </section>

      {/* PROGRESS STEPPER CARD */}
      <section className="bg-white rounded-2xl mx-4 mt-3 p-4">
        <div className="flex items-start overflow-x-auto">
          {STEPS.map((step, i) => {
            const StepIcon = step.Icon;
            const reached = i <= currentStep;

            // Date line per step (text + colour vary by relative position)
            let dateNode;
            if (i < currentStep) {
              dateNode = (
                <span className="text-[8px] text-center mt-0.5 leading-tight text-gray-400">
                  {order.created_at
                    ? dayjs(order.created_at).format('D MMM')
                    : ''}
                </span>
              );
            } else if (i === currentStep) {
              const ts = order.status_updated_at || order.created_at;
              dateNode = (
                <span className="text-[8px] text-center mt-0.5 leading-tight text-[#2D1B00] font-medium">
                  {ts ? dayjs(ts).format('D MMM, h:mm A') : ''}
                </span>
              );
            } else {
              const expected =
                order.expected_dates?.[step.key] ||
                dayjs().add(i - currentStep, 'day').format('D MMM');
              dateNode = (
                <span className="text-[8px] text-center mt-0.5 leading-tight text-gray-300 whitespace-pre-line">
                  Expected{'\n'}
                  {expected}
                </span>
              );
            }

            return (
              <div key={step.key} className="flex items-start flex-shrink-0">
                {/* STEP NODE */}
                <div className="flex flex-col items-center w-14 flex-shrink-0">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center ${
                      reached
                        ? 'bg-[#F4A623]'
                        : 'bg-white border-2 border-gray-200'
                    }`}
                  >
                    <StepIcon
                      className={`w-4 h-4 ${
                        reached ? 'text-white' : 'text-gray-300'
                      }`}
                    />
                  </div>
                  <span
                    className={`text-[9px] font-semibold text-center mt-1 whitespace-pre-line leading-tight ${
                      reached ? 'text-[#2D1B00]' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>
                  {dateNode}
                </div>

                {/* CONNECTOR (skip after last) */}
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 min-w-[24px] h-0.5 mt-[18px] mx-0.5 border-t-2 border-dashed flex-shrink-0 ${
                      i < currentStep
                        ? 'border-[#F4A623]'
                        : 'border-gray-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ESTIMATED DELIVERY CARD */}
      <section className="bg-white rounded-2xl mx-4 mt-3 p-4 flex items-center gap-3">
        <Truck className="text-[#F4A623] w-6 h-6 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400">Estimated Delivery</p>
          <p className="text-sm font-bold text-[#F4A623] mt-0.5">
            {order.estimated_delivery ?? 'Will be confirmed shortly'}
          </p>
        </div>
        <span
          className={`flex-shrink-0 text-xs font-semibold px-3 py-1 rounded-full ${
            order.is_delayed
              ? 'bg-red-50 border border-red-200 text-red-500'
              : 'bg-green-50 border border-green-200 text-green-600'
          }`}
        >
          {order.is_delayed ? '● Delayed' : '● On Time'}
        </span>
      </section>

      {/* LIVE TRACKING CARD */}
      <section className="bg-white rounded-2xl mx-4 mt-3 p-4">
        <h2 className="font-semibold text-base text-[#2D1B00] mb-4">
          Live Tracking
        </h2>
        <div>
          {TIMELINE.map((entry, idx) => {
            const reached = idx <= currentStep;
            const isLast = idx === TIMELINE.length - 1;
            const ts = order.timeline?.[entry.key];

            return (
              <div key={entry.key} className="flex items-start gap-3">
                {/* LEFT RAIL */}
                <div className="flex flex-col items-center flex-shrink-0 w-5">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      reached
                        ? 'bg-[#F4A623]'
                        : 'border-2 border-gray-200 bg-white'
                    }`}
                  >
                    {reached && (
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    )}
                  </div>
                  {!isLast && (
                    <div
                      className={`w-0.5 flex-1 min-h-[32px] mt-0.5 ${
                        idx < currentStep ? 'bg-[#F4A623]' : 'bg-gray-100'
                      }`}
                    />
                  )}
                </div>

                {/* RIGHT CONTENT */}
                <div className="flex-1 pb-5 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p
                      className={`text-sm font-semibold ${
                        reached ? 'text-[#2D1B00]' : 'text-gray-400'
                      }`}
                    >
                      {entry.title}
                    </p>
                    <p
                      className={`text-xs mt-0.5 ${
                        reached ? 'text-gray-500' : 'text-gray-300'
                      }`}
                    >
                      {entry.sub}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] mt-0.5 flex-shrink-0 ${
                      reached && ts ? 'text-gray-400' : 'text-gray-300'
                    }`}
                  >
                    {reached && ts
                      ? dayjs(ts).format('D MMM, h:mm A')
                      : '—'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* TRUST BADGES */}
      <div className="grid grid-cols-4 gap-2 mx-4 mt-3">
        {TRUST_BADGES.map(({ Icon, label, sub }) => (
          <div
            key={label}
            className="bg-[#FFF8ED] rounded-xl p-2.5 flex flex-col items-center text-center"
          >
            <Icon className="text-[#F4A623] w-5 h-5 mb-1" />
            <p className="text-[9px] font-semibold text-[#2D1B00] leading-tight">
              {label}
            </p>
            <p className="text-[8px] text-gray-400 mt-0.5 leading-tight">
              {sub}
            </p>
          </div>
        ))}
      </div>

      {/* ORDER ITEMS CARD */}
      <section className="bg-white rounded-2xl mx-4 mt-3 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-[#2D1B00] text-sm">
            Order Items ({order.items?.length ?? 0})
          </h2>
          <button
            type="button"
            className="text-[#F4A623] text-xs cursor-pointer"
          >
            View All Items ›
          </button>
        </div>

        {firstItem ? (
          <div className="flex gap-3 items-center">
            <div className="w-20 h-20 rounded-xl bg-[#FFF8ED] flex items-center justify-center flex-shrink-0 overflow-hidden">
              {firstItem.image ? (
                <img
                  src={firstItem.image}
                  alt={firstItem.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextSibling)
                      e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : null}
              <div style={{ display: firstItem.image ? 'none' : 'block' }}>
                <LotusMark className="w-12 h-12" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#2D1B00] line-clamp-2">
                {firstItem.name}
              </p>
              {(firstItem.pack_size || firstItem.packSize) && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {firstItem.pack_size ?? firstItem.packSize}
                </p>
              )}
              <p className="text-[#F4A623] font-bold text-sm mt-1">
                ₹{Number(firstItem.price ?? 0).toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Qty: {firstItem.qty}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-3">
            No items in this order.
          </p>
        )}
      </section>

      {/* NEED HELP CARD */}
      <section className="bg-white rounded-2xl mx-4 mt-3 mb-8 p-4">
        <h2 className="font-semibold text-base text-[#2D1B00]">
          Need Help?
        </h2>
        <p className="text-sm text-gray-400 mt-1 mb-4">
          Our support team is here to help you
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            className="flex-1 border border-[#F4A623] text-[#F4A623] bg-white rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-semibold hover:bg-[#FFF8ED] transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Chat with Us
          </button>
          <button
            type="button"
            className="flex-1 border border-[#F4A623] text-[#F4A623] bg-white rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-semibold hover:bg-[#FFF8ED] transition-colors"
          >
            <Phone className="w-4 h-4" />
            Call Support
          </button>
        </div>
      </section>
    </div>
  );
}
