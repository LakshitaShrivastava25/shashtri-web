import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Heart,
  Share2,
  ShoppingCart,
  ShieldCheck,
  Sparkles,
  Package,
  CheckCircle2,
  Hammer,
  Zap,
  Truck,
} from 'lucide-react';
import { getProductDetail, getProductVendors } from '../../api/storeApi';
import { useCartStore, selectTotalItems } from '../../store';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getVariants = (p) =>
  Array.isArray(p?.variants) ? p.variants : [];

const getPackSize = (v) => v?.pack_size || v?.size || v?.label || '';
const getVariantPrice = (v) =>
  Number(v?.price ?? v?.final_price ?? v?.base_price ?? 0);

const getVendorVariantId = (vendor) =>
  vendor?.variant_id ??
  vendor?.variantId ??
  vendor?.variant?.id ??
  (typeof vendor?.variant === 'number' || typeof vendor?.variant === 'string'
    ? vendor.variant
    : null);

const getVendorPrice = (v) => Number(v?.price ?? v?.final_price ?? 0);
const getVendorDeliveryDays = (v) =>
  v?.delivery_days ?? v?.deliveryDays ?? v?.eta_days ?? null;

// ─── Lotus placeholder SVG ────────────────────────────────────────────────────

function LotusPlaceholder({ className = 'w-40 h-40' }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`${className} opacity-30`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        transform="translate(100,100)"
        fill="none"
        stroke="#F4A623"
        strokeWidth="0.8"
      >
        <circle r="20" />
        <circle r="40" />
        <circle r="60" />
        <circle r="80" />
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <line x1="0" y1="10" x2="0" y2="80" />
            <ellipse cx="0" cy="30" rx="5" ry="10" />
            <ellipse cx="0" cy="60" rx="3" ry="6" />
          </g>
        ))}
      </g>
    </svg>
  );
}

// ─── Reusable feature row ─────────────────────────────────────────────────────

function FeatureGrid({ items }) {
  return (
    <div className="bg-white rounded-xl p-4 mt-4 grid grid-cols-4 gap-2 shadow-sm">
      {items.map(({ Icon, label, sub }) => (
        <div key={label} className="flex flex-col items-center text-center">
          <Icon className="text-[#F4A623] w-5 h-5" />
          <p className="text-xs font-semibold text-[#2D1B00] mt-1.5 leading-tight">
            {label}
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">
            {sub}
          </p>
        </div>
      ))}
    </div>
  );
}

const PRODUCT_FEATURES = [
  { Icon: ShieldCheck, label: 'Authentic', sub: '100% genuine products' },
  { Icon: Hammer, label: 'Handcrafted', sub: 'Made with devotion' },
  { Icon: Sparkles, label: 'Energized', sub: 'Blessed by vedic priests' },
  { Icon: Truck, label: 'Fast Ship', sub: 'Delivered in 3-5 days' },
];

const SHASTRI_FEATURES = [
  { Icon: ShieldCheck, label: '100% Authentic', sub: '& Certified' },
  { Icon: Sparkles, label: 'Energized', sub: 'by Vedic Mantras' },
  { Icon: Package, label: 'Secure', sub: 'Packaging' },
  { Icon: Truck, label: 'Easy Returns', sub: '& Refunds' },
];

// ─── About section with Read More ─────────────────────────────────────────────

function AboutSection({ description }) {
  const [expanded, setExpanded] = useState(false);
  if (!description) return null;
  return (
    <div className="bg-white rounded-xl p-4 mt-4 shadow-sm">
      <h3 className="font-semibold text-base text-[#2D1B00] mb-2">
        About this Product
      </h3>
      <p
        className={`text-sm text-gray-600 ${
          expanded ? '' : 'line-clamp-3'
        }`}
      >
        {description}
      </p>
      <button
        type="button"
        onClick={() => setExpanded((x) => !x)}
        className="text-[#F4A623] text-sm font-semibold mt-2"
      >
        {expanded ? 'Read Less ↑' : 'Read More ↓'}
      </button>
    </div>
  );
}

// ─── Loading & error skeletons ────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#FFF8ED] animate-pulse">
      <div className="h-14" />
      <div className="bg-[#F8EFE3] h-[260px]" />
      <div className="bg-white rounded-t-3xl -mt-6 relative px-5 pt-6 pb-4 space-y-3">
        <div className="h-7 w-2/3 bg-gray-200 rounded" />
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
        <div className="h-9 w-1/3 bg-gray-200 rounded mt-2" />
        <div className="h-16 bg-gray-100 rounded-xl mt-3" />
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="h-20 bg-gray-100 rounded-xl" />
          <div className="h-20 bg-gray-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function ErrorView({ message, onRetry }) {
  return (
    <div className="min-h-screen bg-[#FFF8ED] flex flex-col items-center justify-center px-6 text-center">
      <div className="text-5xl text-[#F4A623]/40 mb-3">✦</div>
      <h2 className="font-bold text-lg text-[#2D1B00]">
        Could not load product
      </h2>
      <p className="text-sm text-gray-500 mt-1">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 bg-[#F4A623] text-white font-semibold px-5 py-2 rounded-xl"
      >
        Try Again
      </button>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCartBanner, setShowCartBanner] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const addToCart = useCartStore((s) => s.addToCart);
  const totalItems = useCartStore(selectTotalItems);

  // Fetch product + vendors in parallel
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([
      getProductDetail(productId),
      getProductVendors(productId).catch(() => null),
    ])
      .then(([p, vRes]) => {
        if (cancelled) return;
        setProduct(p);
        const vList = Array.isArray(vRes) ? vRes : vRes?.results ?? [];
        setVendors(Array.isArray(vList) ? vList : []);
        const variants = getVariants(p);
        setSelectedVariant(variants[0] || null);
      })
      .catch((err) => {
        if (!cancelled)
          setError(err?.response?.data?.detail || err?.message || 'Failed');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [productId, reloadKey]);

  // Vendors filtered to the currently selected variant
  const variantVendors = useMemo(() => {
    if (!selectedVariant) return [];
    return vendors.filter(
      (v) => String(getVendorVariantId(v)) === String(selectedVariant.id)
    );
  }, [vendors, selectedVariant]);

  // Reset selected vendor whenever the variant (or its vendor list) changes
  useEffect(() => {
    setSelectedVendor(variantVendors[0] || null);
  }, [variantVendors]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) {
      toast.error('Please select a size');
      return false;
    }
    if (!selectedVendor) {
      toast.error('Please select a vendor');
      return false;
    }
    addToCart({
      productId: product.id,
      variantId: selectedVariant.id,
      vendorId: selectedVendor.id,
      name: product.name,
      image: product.image,
      price: getVendorPrice(selectedVendor),
      packSize: getPackSize(selectedVariant),
      qty: 1,
    });
    return true;
  };

  const onClickAddToCart = () => {
    if (!handleAddToCart()) return;
    setShowCartBanner(true);
    setTimeout(() => setShowCartBanner(false), 5000);
  };

  const onClickBuyNow = () => {
    if (!handleAddToCart()) return;
    navigate('/store/checkout');
  };

  if (loading) return <LoadingSkeleton />;
  if (error || !product)
    return (
      <ErrorView
        message={error || 'Product not found'}
        onRetry={() => setReloadKey((k) => k + 1)}
      />
    );

  const variants = getVariants(product);
  const stickyPrice = selectedVariant
    ? getVariantPrice(selectedVariant)
    : Number(product.price ?? 0);

  return (
    <div className="min-h-screen bg-[#FFF8ED] pb-28">
      {/* SECTION 1 — Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="bg-white rounded-xl shadow-sm p-2.5 text-[#2D1B00]"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Wishlist"
              className="bg-white rounded-xl shadow-sm p-2.5 text-[#2D1B00]"
            >
              <Heart className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="Share"
              className="bg-white rounded-xl shadow-sm p-2.5 text-[#2D1B00]"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/store/cart')}
              aria-label="Cart"
              className="bg-white rounded-xl shadow-sm p-2.5 text-[#2D1B00] relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* push content below the fixed top bar */}
      <div className="h-14" />

      {/* SECTION 2 — Hero image */}
      <section className="relative w-full bg-[#F8EFE3] min-h-[260px] flex items-center justify-center">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="max-h-[200px] object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
              if (e.target.nextSibling)
                e.target.nextSibling.style.display = 'block';
            }}
          />
        ) : null}
        <div style={{ display: product.image ? 'none' : 'block' }}>
          <LotusPlaceholder className="w-48 h-48" />
        </div>
        {product.is_bestseller && (
          <span className="absolute top-14 left-4 bg-[#F4A623] text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
            ★ Bestseller
          </span>
        )}
      </section>

      {/* SECTION 3 — Product info card */}
      <section className="bg-white rounded-t-3xl -mt-6 relative px-5 pt-6 pb-4 shadow-sm">
        <h1
          className="font-bold text-2xl text-[#2D1B00]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {product.name}
        </h1>
        {product.description && (
          <p className="italic text-sm text-gray-500 mt-1 line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="flex items-end gap-2 mt-3">
          <p className="text-3xl font-bold text-[#F4A623]">
            ₹{Number(product.price ?? 0).toLocaleString('en-IN')}
          </p>
          <span className="text-xs text-gray-400 mb-1">
            Inclusive of all taxes
          </span>
        </div>

        {/* Trust strip */}
        <div className="bg-[#FFF8ED] rounded-xl p-3 mt-3 grid grid-cols-3 gap-2">
          {[
            { Icon: ShieldCheck, line1: 'Authentic', line2: 'Verified' },
            { Icon: Sparkles, line1: 'Energized', line2: 'by Pandits' },
            { Icon: Package, line1: 'Secure', line2: 'Packaging' },
          ].map(({ Icon, line1, line2 }) => (
            <div key={line1} className="flex flex-col items-center text-center">
              <Icon className="text-[#F4A623] w-5 h-5" />
              <p className="text-[11px] font-semibold text-[#2D1B00] mt-1 leading-tight">
                {line1}
              </p>
              <p className="text-[10px] text-gray-500 leading-tight">
                {line2}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Body content */}
      <div className="px-5">
        {/* SECTION 4 — Variant selector */}
        {variants.length > 0 && (
          <section>
            <h2 className="font-semibold text-base text-[#2D1B00] mt-5 mb-3">
              Select Size / Length
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {variants.map((v) => {
                const isSel = selectedVariant?.id === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`relative rounded-xl border-2 p-3 text-left transition-all ${
                      isSel
                        ? 'border-[#F4A623] bg-[#FFF8ED]'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    {isSel && (
                      <CheckCircle2 className="absolute top-2 right-2 text-[#F4A623] w-4 h-4" />
                    )}
                    <p className="text-sm font-semibold text-[#2D1B00]">
                      {getPackSize(v) || `Variant ${v.id}`}
                    </p>
                    <p className="text-sm text-[#F4A623] font-bold mt-1">
                      ₹{getVariantPrice(v).toLocaleString('en-IN')}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* SECTION 8 — Added-to-cart banner (sits below variants) */}
        {showCartBanner && (
          <div className="bg-green-600 rounded-xl px-4 py-3 flex items-center mt-4 shadow-sm">
            <CheckCircle2 className="text-white w-5 h-5 flex-shrink-0" />
            <p className="text-white text-sm font-medium ml-3 flex-1 truncate">
              {product.name} added to cart
            </p>
            <button
              type="button"
              onClick={() => navigate('/store/cart')}
              className="text-white underline text-sm flex-shrink-0"
            >
              View Cart
            </button>
          </div>
        )}

        {/* SECTION 5 — Features row */}
        <FeatureGrid items={PRODUCT_FEATURES} />

        {/* SECTION 6 — Vendor selector */}
        <section>
          <h2 className="font-semibold text-base text-[#2D1B00] mt-5 mb-3">
            Choose Vendor
          </h2>
          {variantVendors.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-sm text-gray-500 text-center">
              No vendors available for this option yet.
            </div>
          ) : (
            <div>
              {variantVendors.map((vendor) => {
                const isSel = selectedVendor?.id === vendor.id;
                const days = getVendorDeliveryDays(vendor);
                return (
                  <button
                    key={vendor.id}
                    type="button"
                    onClick={() => setSelectedVendor(vendor)}
                    className={`w-full text-left rounded-xl border p-4 mb-2 flex items-center gap-3 transition-all ${
                      isSel
                        ? 'border-[#F4A623] bg-[#FFF8ED]'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                        isSel
                          ? 'border-[#F4A623]'
                          : 'border-gray-300'
                      }`}
                    >
                      {isSel && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#F4A623]" />
                      )}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-[#2D1B00] truncate">
                        {vendor.name || `Vendor ${vendor.id}`}
                      </p>
                      {days != null && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          ✓ Ships in {days} days
                        </p>
                      )}
                    </div>
                    <p className="text-[#F4A623] font-bold flex-shrink-0">
                      ₹{getVendorPrice(vendor).toLocaleString('en-IN')}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* SECTION 7 — About + Why Shastri Ji */}
        <AboutSection description={product.description} />

        <h3 className="font-semibold text-base text-[#2D1B00] mt-5 mb-1">
          Why Shastri Ji
        </h3>
        <FeatureGrid items={SHASTRI_FEATURES} />
      </div>

      {/* SECTION 9 — Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 pb-4 z-40">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-[#F4A623]">
              ₹{stickyPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-gray-400 leading-tight">
              Inclusive of all taxes
            </span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClickAddToCart}
              className="border-2 border-[#F4A623] bg-white text-[#F4A623] rounded-xl px-4 py-2.5 text-sm font-semibold flex items-center gap-1.5"
            >
              <ShoppingCart className="w-4 h-4" />
              ADD TO CART
            </button>
            <button
              type="button"
              onClick={onClickBuyNow}
              className="bg-[#F4A623] text-white rounded-xl px-4 py-2.5 text-sm font-semibold flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4" />
              BUY NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
