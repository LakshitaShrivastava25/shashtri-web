import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { calendarApi } from '../api/services';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// dayjs week starts on Sunday by default. Returns the Monday of the
// week containing the given day.
function mondayOfWeek(d) {
  return d.day() === 0 ? d.subtract(6, 'day') : d.startOf('week').add(1, 'day');
}

function buildCalendarDays(currentMonth) {
  const calStart = mondayOfWeek(currentMonth.startOf('month'));
  const days = [];
  for (let i = 0; i < 35; i++) {
    days.push(calStart.add(i, 'day'));
  }
  return days;
}

function dayCellClass(isSelected, isToday, isCurrentMonth) {
  if (isSelected) return 'bg-gold text-white shadow-md shadow-gold/30 font-bold';
  if (isToday) return 'border-2 border-gold text-gold font-bold';
  if (isCurrentMonth === false) return 'text-text-light/40 hover:bg-surface-alt';
  return 'text-text-dark hover:bg-gold-bg';
}

export default function CalendarPanchang({ compact = false }) {
  const [currentMonth, setCurrentMonth] = useState(() => dayjs());
  const [selectedDate, setSelectedDate] = useState(() => dayjs());
  const [panchangData, setPanchangData] = useState(null);
  const [loading, setLoading] = useState(false);

  const dateKey = selectedDate.format('YYYY-MM-DD');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setPanchangData(null);
    calendarApi
      .panchang(dateKey)
      .then((res) => {
        if (!cancelled) setPanchangData(res);
      })
      .catch(() => {
        // silent — fallback message renders below
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [dateKey]);

  const fullMonthDays = useMemo(
    () => buildCalendarDays(currentMonth),
    [currentMonth]
  );

  const compactWeek = useMemo(() => {
    const weekStart = mondayOfWeek(dayjs());
    return Array(7)
      .fill(0)
      .map((_, i) => weekStart.add(i, 'day'));
  }, []);

  const today = dayjs();

  const handleSelectFull = (day) => {
    setSelectedDate(day);
    setCurrentMonth(day);
  };

  const fields = panchangData?.panchang
    ? [
        { label: 'Tithi', value: panchangData.panchang.tithi },
        { label: 'Nakshatra', value: panchangData.panchang.nakshatra },
        { label: 'Yoga', value: panchangData.panchang.yoga },
        { label: 'Karana', value: panchangData.panchang.karana },
        { label: 'Sunrise', value: panchangData.panchang.sunrise },
        { label: 'Sunset', value: panchangData.panchang.sunset },
      ].filter((f) => f.value)
    : [];

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden mb-6">
      {compact ? (
        <div className="bg-gold px-4 py-2 flex items-center justify-center">
          <h3 className="font-heading font-bold text-white text-sm">
            {dayjs().format('MMMM YYYY')}
          </h3>
        </div>
      ) : (
        <div className="bg-gold px-4 py-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentMonth((m) => m.subtract(1, 'month'))}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-all font-bold text-lg"
            aria-label="Previous month"
          >
            ‹
          </button>
          <h3 className="font-heading font-bold text-white text-base">
            {currentMonth.format('MMMM YYYY')}
          </h3>
          <button
            type="button"
            onClick={() => setCurrentMonth((m) => m.add(1, 'month'))}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-all font-bold text-lg"
            aria-label="Next month"
          >
            ›
          </button>
        </div>
      )}

      {compact ? (
        <div className="grid grid-cols-7 px-3 py-2 gap-1">
          {compactWeek.map((day, i) => {
            const isSelected = day.isSame(selectedDate, 'day');
            const isToday = day.isSame(today, 'day');
            return (
              <div key={day.format('YYYY-MM-DD')} className="text-center">
                <p className="text-xs text-gold font-semibold mb-1">
                  {DAY_LABELS[i]}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedDate(day)}
                  className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full text-sm font-medium transition-all ${dayCellClass(
                    isSelected,
                    isToday,
                    true
                  )}`}
                >
                  {day.date()}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-7 bg-gold/10 border-b border-border">
            {DAY_LABELS.map((d) => (
              <div
                key={d}
                className="py-1 text-center text-xs font-semibold text-gold"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 px-3 py-2 gap-y-1">
            {fullMonthDays.map((day) => {
              const isCurrentMonth = day.month() === currentMonth.month();
              const isToday = day.isSame(today, 'day');
              const isSelected = day.isSame(selectedDate, 'day');
              return (
                <button
                  key={day.format('YYYY-MM-DD')}
                  type="button"
                  onClick={() => handleSelectFull(day)}
                  className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full text-sm font-medium transition-all ${dayCellClass(
                    isSelected,
                    isToday,
                    isCurrentMonth
                  )}`}
                >
                  {day.date()}
                </button>
              );
            })}
          </div>
        </>
      )}

      <div className="border-t border-border px-4 py-4">
        <div className="flex items-center gap-2 mb-3">
          <svg
            width="16"
            height="16"
            viewBox="0 0 100 100"
            className="text-gold flex-shrink-0"
          >
            <text
              x="50%"
              y="68%"
              textAnchor="middle"
              fontSize="72"
              fontFamily="serif"
              fill="currentColor"
            >
              ॐ
            </text>
          </svg>
          <h4 className="font-heading font-bold text-sm text-text-dark">
            Panchang — {selectedDate.format('D MMMM YYYY')}
          </h4>
        </div>

        {loading && (
          <div className="grid grid-cols-2 gap-2">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-surface-alt rounded-xl animate-pulse"
                />
              ))}
          </div>
        )}

        {!loading && panchangData && (
          <>
            {panchangData.festival && (
              <div className="bg-gold/10 border border-gold/20 rounded-xl p-3 mb-3 flex items-center gap-3">
                {panchangData.festival.image && (
                  <img
                    src={panchangData.festival.image}
                    alt={panchangData.festival.name}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div>
                  <p className="font-semibold text-sm text-text-dark">
                    {panchangData.festival.name}
                  </p>
                  {panchangData.festival.is_auspicious && (
                    <span className="text-xs bg-gold-bg text-gold px-2 py-0.5 rounded-full border border-gold/30">
                      Auspicious Day ✨
                    </span>
                  )}
                </div>
              </div>
            )}

            {fields.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-3">
                {fields.map((f) => (
                  <div
                    key={f.label}
                    className="bg-gold-bg rounded-xl p-3 border border-gold/20"
                  >
                    <p className="text-xs text-text-light mb-0.5">{f.label}</p>
                    <p className="text-sm font-semibold text-text-dark">
                      {f.value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {panchangData.recommended_rituals?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-text-mid mb-2">
                  Recommended Rituals
                </p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {panchangData.recommended_rituals.map((r) => (
                    <div
                      key={r.id}
                      className="flex-shrink-0 bg-surface border border-border rounded-xl p-2 flex items-center gap-2 min-w-fit"
                    >
                      {r.image && (
                        <img
                          src={r.image}
                          alt={r.name}
                          className="w-8 h-8 rounded-lg object-cover bg-gold-bg"
                        />
                      )}
                      <div>
                        <p className="text-xs font-semibold text-text-dark">
                          {r.name}
                        </p>
                        <p className="text-xs text-gold font-bold">
                          ₹{Number(r.price ?? 0).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!panchangData.festival && fields.length === 0 && (
              <p className="text-sm text-text-light text-center py-2">
                No special events on this date
              </p>
            )}
          </>
        )}

        {!loading && !panchangData && (
          <p className="text-sm text-text-light text-center py-2">
            Unable to load Panchang data
          </p>
        )}
      </div>
    </div>
  );
}
