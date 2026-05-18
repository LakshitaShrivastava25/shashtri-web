import clsx from 'clsx';
import { Loader2, Star } from 'lucide-react';

export function OmIcon({ size = 24, className }) {
  return (
    <span
      className={clsx('inline-block leading-none select-none', className)}
      style={{ fontSize: size, lineHeight: 1 }}
      aria-label="Om"
    >
      ॐ
    </span>
  );
}

export function ShimmerBox({ className }) {
  return (
    <div
      className={clsx('animate-pulse bg-surface-alt rounded', className)}
    />
  );
}

export function ShimmerCard() {
  return (
    <div className="bg-surface border border-border-light rounded-xl p-4">
      <ShimmerBox className="h-32 w-full mb-3" />
      <ShimmerBox className="h-4 w-3/4 mb-2" />
      <ShimmerBox className="h-4 w-1/2 mb-2" />
      <ShimmerBox className="h-4 w-2/3" />
    </div>
  );
}

export function GoldButton({ children, loading, className, disabled, ...props }) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 bg-gold text-white font-semibold rounded-lg px-6 py-3 transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    >
      {loading && <Loader2 size={18} className="animate-spin" />}
      {children}
    </button>
  );
}

export function OutlineButton({ children, className, ...props }) {
  return (
    <button
      type="button"
      className={clsx(
        'inline-flex items-center justify-center gap-2 border-2 border-gold text-gold font-semibold rounded-lg px-6 py-3 transition hover:bg-gold-bg disabled:opacity-60 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

const STATUS_STYLES = {
  PENDING: 'bg-amber-100 text-amber-800',
  COUNTER_OFFERED: 'bg-amber-100 text-amber-800',
  ACCEPTED: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-red-100 text-red-800',
  EXPIRED: 'bg-red-100 text-red-800',
};

export function StatusBadge({ status }) {
  const key = (status || '').toUpperCase();
  const styles = STATUS_STYLES[key] || 'bg-surface-alt text-text-mid';
  const label = key
    ? key
        .toLowerCase()
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : '—';
  return (
    <span
      className={clsx(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
        styles
      )}
    >
      {label}
    </span>
  );
}

function getInitials(name) {
  if (!name) return '?';
  const parts = String(name).trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

export function Avatar({ src, name, size = 40, className }) {
  const dim = { width: size, height: size };
  if (src) {
    return (
      <img
        src={src}
        alt={name || 'avatar'}
        style={dim}
        className={clsx('rounded-full object-cover', className)}
      />
    );
  }
  return (
    <div
      style={{ ...dim, fontSize: Math.max(12, size * 0.4) }}
      className={clsx(
        'rounded-full flex items-center justify-center bg-gold-bg text-gold border-2 border-gold/30 font-semibold',
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}

export function StarRating({ rating = 0, max = 5, showNumber = true }) {
  const r = Number(rating) || 0;
  return (
    <span className="inline-flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.round(r);
        return (
          <Star
            key={i}
            size={14}
            className={clsx(
              filled ? 'fill-gold text-gold' : 'text-border'
            )}
          />
        );
      })}
      {showNumber && (
        <span className="text-sm text-text-mid ml-1">{r.toFixed(1)}</span>
      )}
    </span>
  );
}

export function SectionHeader({ title, onSeeAll }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-serif text-xl md:text-2xl text-text-dark">{title}</h2>
      {onSeeAll && (
        <button
          type="button"
          onClick={onSeeAll}
          className="text-gold font-semibold text-sm hover:underline"
        >
          See All
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4">
      <OmIcon size={56} className="text-gold mb-4" />
      <h3 className="font-serif text-xl text-text-dark mb-1">{title}</h3>
      {subtitle && <p className="text-text-mid text-sm">{subtitle}</p>}
    </div>
  );
}

function formatINR(value) {
  if (value === null || value === undefined || value === '') return '';
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return `₹${n.toLocaleString('en-IN')}`;
}

export function PriceTag({ finalPrice, price, className }) {
  const display = finalPrice ?? price;
  return (
    <span className={clsx('text-gold font-bold', className)}>
      {formatINR(display)}
    </span>
  );
}

export function Input({ label, error, className, id, ...props }) {
  const inputId = id || props.name;
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-text-dark"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={clsx(
          'w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-text-dark placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition',
          error && 'border-red-400 focus:ring-red-200 focus:border-red-400',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
