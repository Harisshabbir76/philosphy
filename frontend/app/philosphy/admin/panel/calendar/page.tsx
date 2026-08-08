"use client";

import { useEffect, useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiCheck, FiX, FiTrash2 } from "react-icons/fi";
import { API_BASE_URL } from "../../../../lib/api";
import "./calendar.css";

type StoredUser = { token?: string };

/** One off-day, in the shape the calendar works with locally. */
type OffDayItem = {
  _id: string | null; // null while it is a new, unsaved selection
  date: string; // "YYYY-MM-DD"
  fullDay: boolean;
  startTime: string; // 24h "HH:MM" ("" when full day)
  endTime: string;
  source: "admin" | "booking"; // 'booking' = auto-created when a booking was confirmed
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DEFAULT_START = "09:00";
const DEFAULT_END = "17:00";

const pad = (n: number) => String(n).padStart(2, "0");
const dateKey = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

const todayKey = (() => {
  const d = new Date();
  return dateKey(d.getFullYear(), d.getMonth(), d.getDate());
})();

const getToken = () => {
  if (typeof window === "undefined") return "";
  try {
    const stored = localStorage.getItem("user");
    const user = stored ? (JSON.parse(stored) as StoredUser) : null;
    return user?.token || "";
  } catch {
    return "";
  }
};

// ── Time conversion between 24h storage and the 12h AM/PM pickers ──────────────
const to12h = (time24: string) => {
  const [hStr, mStr] = (time24 || DEFAULT_START).split(":");
  let hour = parseInt(hStr, 10);
  const minute = parseInt(mStr, 10) || 0;
  const meridiem = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return { hour, minute, meridiem };
};

const to24h = (hour: number, minute: number, meridiem: string) => {
  let h = hour % 12;
  if (meridiem === "PM") h += 12;
  return `${pad(h)}:${pad(minute)}`;
};

const formatDateLabel = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
};

const formatTimeLabel = (time24: string) => {
  const { hour, minute, meridiem } = to12h(time24);
  return `${hour}:${pad(minute)} ${meridiem}`;
};

export default function AdminCalendarPage() {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth()); // 0-11

  // Server-known off days (source of truth, used to revert edits).
  const [serverItems, setServerItems] = useState<OffDayItem[]>([]);
  // Working copy the UI edits. New selections are appended here with _id = null.
  const [items, setItems] = useState<OffDayItem[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingDate, setSavingDate] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/off-days`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load off days");

        const mapped: OffDayItem[] = data.map((d: OffDayItem) => ({
          _id: d._id,
          date: d.date,
          fullDay: d.fullDay,
          startTime: d.startTime || "",
          endTime: d.endTime || "",
          source: d.source || "admin",
        }));
        setServerItems(mapped);
        setItems(mapped);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load off days");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // ── Calendar grid for the viewed month ──────────────────────────────────────
  const grid = useMemo(() => {
    const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstWeekday; i += 1) cells.push(null);
    for (let d = 1; d <= daysInMonth; d += 1) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [viewYear, viewMonth]);

  const monthPrefix = `${viewYear}-${pad(viewMonth + 1)}`;

  // Off days shown on the right: only those that fall in the viewed month.
  // Saved entries first (by date), then new unsaved selections at the bottom.
  const monthItems = useMemo(() => {
    const inMonth = items.filter((it) => it.date.startsWith(monthPrefix));
    const saved = inMonth.filter((it) => it._id).sort((a, b) => a.date.localeCompare(b.date));
    const drafts = inMonth.filter((it) => !it._id);
    return [...saved, ...drafts];
  }, [items, monthPrefix]);

  const selectedDates = useMemo(() => new Set(items.map((it) => it.date)), [items]);
  const savedDates = useMemo(
    () => new Set(items.filter((it) => it._id).map((it) => it.date)),
    [items]
  );
  const bookingDates = useMemo(
    () => new Set(items.filter((it) => it.source === "booking").map((it) => it.date)),
    [items]
  );

  const goPrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };
  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Clicking a day: add a draft if none, remove the draft if it is unsaved
  // (lets the admin deselect a date they just picked). Saved dates are left
  // alone — those are removed with the delete icon.
  const toggleDate = (day: number) => {
    const key = dateKey(viewYear, viewMonth, day);
    const existing = items.find((it) => it.date === key);
    if (existing) {
      if (!existing._id) {
        setItems((prev) => prev.filter((it) => it.date !== key));
      }
      return;
    }
    setItems((prev) => [
      ...prev,
      { _id: null, date: key, fullDay: true, startTime: DEFAULT_START, endTime: DEFAULT_END, source: "admin" },
    ]);
  };

  const updateItem = (date: string, patch: Partial<OffDayItem>) => {
    setItems((prev) => prev.map((it) => (it.date === date ? { ...it, ...patch } : it)));
  };

  const isDirty = (item: OffDayItem) => {
    const original = serverItems.find((it) => it.date === item.date);
    if (!original) return true; // brand new selection
    return (
      original.fullDay !== item.fullDay ||
      original.startTime !== item.startTime ||
      original.endTime !== item.endTime
    );
  };

  const handleSave = async (item: OffDayItem) => {
    if (!item.fullDay) {
      if (to24hMinutes(item.startTime) >= to24hMinutes(item.endTime)) {
        window.alert("End time must be after start time.");
        return;
      }
    }
    setSavingDate(item.date);
    try {
      const response = await fetch(`${API_BASE_URL}/api/off-days`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          date: item.date,
          fullDay: item.fullDay,
          startTime: item.fullDay ? "" : item.startTime,
          endTime: item.fullDay ? "" : item.endTime,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save off day");

      const saved: OffDayItem = {
        _id: data._id,
        date: data.date,
        fullDay: data.fullDay,
        startTime: data.startTime || "",
        endTime: data.endTime || "",
      };
      setItems((prev) => prev.map((it) => (it.date === saved.date ? saved : it)));
      setServerItems((prev) => {
        const without = prev.filter((it) => it.date !== saved.date);
        return [...without, saved];
      });
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Unable to save off day");
    } finally {
      setSavingDate(null);
    }
  };

  // Cross: discard changes. New selection -> removed. Edited saved entry ->
  // reverted to the stored values.
  const handleDiscard = (item: OffDayItem) => {
    const original = serverItems.find((it) => it.date === item.date);
    if (!original) {
      setItems((prev) => prev.filter((it) => it.date !== item.date));
      return;
    }
    setItems((prev) => prev.map((it) => (it.date === item.date ? original : it)));
  };

  const handleDelete = async (item: OffDayItem) => {
    if (!item._id) return;
    setDeletingId(item._id);
    try {
      const response = await fetch(`${API_BASE_URL}/api/off-days/${item._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Unable to delete off day");
      }
      setItems((prev) => prev.filter((it) => it.date !== item.date));
      setServerItems((prev) => prev.filter((it) => it.date !== item.date));
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Unable to delete off day");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="cal-page">
      <header className="cal-page__header">
        <p className="cal-page__eyebrow">Philosophy Admin</p>
        <h1 className="cal-page__title">Calendar</h1>
        <p className="cal-page__subtitle">
          Select dates to mark them as off days. Set a full day off or a specific time window.
        </p>
      </header>

      {isLoading && <p className="cal-status">Loading calendar…</p>}
      {error && <p className="cal-status cal-status--error">{error}</p>}

      {!isLoading && !error && (
        <div className="cal-layout">
          {/* Left: month calendar */}
          <section className="cal-calendar" aria-label="Calendar">
            <div className="cal-calendar__nav">
              <button type="button" onClick={goPrevMonth} aria-label="Previous month">
                <FiChevronLeft size={20} />
              </button>
              <span className="cal-calendar__month">
                {MONTHS[viewMonth]} {viewYear}
              </span>
              <button type="button" onClick={goNextMonth} aria-label="Next month">
                <FiChevronRight size={20} />
              </button>
            </div>

            <div className="cal-calendar__weekdays">
              {WEEKDAYS.map((w) => (
                <span key={w}>{w}</span>
              ))}
            </div>

            <div className="cal-calendar__grid">
              {grid.map((day, idx) => {
                if (day === null) return <span key={`empty-${idx}`} className="cal-cell cal-cell--empty" />;
                const key = dateKey(viewYear, viewMonth, day);
                const isSelected = selectedDates.has(key);
                const isSaved = savedDates.has(key);
                const isBooking = bookingDates.has(key);
                const isToday = key === todayKey;
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => toggleDate(day)}
                    className={[
                      "cal-cell",
                      isSelected && !isBooking ? "cal-cell--selected" : "",
                      isSaved && !isBooking ? "cal-cell--saved" : "",
                      isBooking ? "cal-cell--booking" : "",
                      isToday ? "cal-cell--today" : "",
                    ].join(" ").trim()}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <div className="cal-legend">
              <span><i className="cal-dot cal-dot--saved" /> Off day (admin)</span>
              <span><i className="cal-dot cal-dot--booking" /> Booked</span>
              <span><i className="cal-dot cal-dot--draft" /> Unsaved selection</span>
            </div>
          </section>

          {/* Right: off days for the viewed month */}
          <section className="cal-offdays" aria-label="Off days">
            <h2 className="cal-offdays__heading">Off Days</h2>
            <p className="cal-offdays__month">{MONTHS[viewMonth]} {viewYear}</p>

            {monthItems.length === 0 ? (
              <div className="cal-offdays__empty">
                No off days for this month. Pick a date on the calendar to add one.
              </div>
            ) : (
              <ul className="cal-offdays__list">
                {monthItems.map((item) => {
                  const start = to12h(item.startTime || DEFAULT_START);
                  const end = to12h(item.endTime || DEFAULT_END);
                  const dirty = isDirty(item);
                  const saving = savingDate === item.date;
                  const deleting = item._id !== null && deletingId === item._id;

                  const isBookingSource = item.source === "booking";

                  // Booking-sourced off days: read-only card, just show info + delete.
                  if (isBookingSource) {
                    return (
                      <li key={item.date} className="cal-offday cal-offday--booking">
                        <div className="cal-offday__top">
                          <span className="cal-offday__date">{formatDateLabel(item.date)}</span>
                          <span className="cal-offday__badge cal-offday__badge--booking">Booked</span>
                        </div>
                        <p className="cal-offday__summary">Fully booked — no further appointments</p>
                        <div className="cal-offday__actions">
                          {item._id && (
                            <button
                              type="button"
                              className="cal-action cal-action--delete"
                              title="Remove booking block"
                              disabled={deleting}
                              onClick={() => handleDelete(item)}
                            >
                              <FiTrash2 size={17} />
                            </button>
                          )}
                        </div>
                      </li>
                    );
                  }

                  return (
                    <li
                      key={item.date}
                      className={`cal-offday ${item._id ? "" : "cal-offday--draft"}`}
                    >
                      <div className="cal-offday__top">
                        <span className="cal-offday__date">{formatDateLabel(item.date)}</span>
                        {!item._id && <span className="cal-offday__badge">New</span>}
                      </div>

                      <label className="cal-offday__fullday">
                        <input
                          type="checkbox"
                          checked={item.fullDay}
                          onChange={(e) => updateItem(item.date, { fullDay: e.target.checked })}
                        />
                        Full day off
                      </label>

                      {!item.fullDay && (
                        <div className="cal-offday__times">
                          <TimePicker
                            label="From"
                            hour={start.hour}
                            minute={start.minute}
                            meridiem={start.meridiem}
                            onChange={(h, m, mer) =>
                              updateItem(item.date, { startTime: to24h(h, m, mer) })
                            }
                          />
                          <TimePicker
                            label="To"
                            hour={end.hour}
                            minute={end.minute}
                            meridiem={end.meridiem}
                            onChange={(h, m, mer) =>
                              updateItem(item.date, { endTime: to24h(h, m, mer) })
                            }
                          />
                        </div>
                      )}

                      {item._id && !dirty && (
                        <p className="cal-offday__summary">
                          {item.fullDay
                            ? "Closed all day"
                            : `Closed ${formatTimeLabel(item.startTime)} – ${formatTimeLabel(item.endTime)}`}
                        </p>
                      )}

                      <div className="cal-offday__actions">
                        {(dirty || !item._id) && (
                          <>
                            <button
                              type="button"
                              className="cal-action cal-action--save"
                              title="Save"
                              disabled={saving}
                              onClick={() => handleSave(item)}
                            >
                              <FiCheck size={18} />
                            </button>
                            <button
                              type="button"
                              className="cal-action cal-action--discard"
                              title="Discard"
                              disabled={saving}
                              onClick={() => handleDiscard(item)}
                            >
                              <FiX size={18} />
                            </button>
                          </>
                        )}
                        {item._id && (
                          <button
                            type="button"
                            className="cal-action cal-action--delete"
                            title="Delete"
                            disabled={deleting}
                            onClick={() => handleDelete(item)}
                          >
                            <FiTrash2 size={17} />
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

function to24hMinutes(time24: string) {
  const [h, m] = (time24 || "0:0").split(":").map(Number);
  return h * 60 + (m || 0);
}

type TimePickerProps = {
  label: string;
  hour: number;
  minute: number;
  meridiem: string;
  onChange: (hour: number, minute: number, meridiem: string) => void;
};

function TimePicker({ label, hour, minute, meridiem, onChange }: TimePickerProps) {
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className="cal-time">
      <span className="cal-time__label">{label}</span>
      <div className="cal-time__selects">
        <select value={hour} onChange={(e) => onChange(Number(e.target.value), minute, meridiem)}>
          {hours.map((h) => (
            <option key={h} value={h}>{pad(h)}</option>
          ))}
        </select>
        <span className="cal-time__colon">:</span>
        <select value={minute} onChange={(e) => onChange(hour, Number(e.target.value), meridiem)}>
          {minutes.map((m) => (
            <option key={m} value={m}>{pad(m)}</option>
          ))}
        </select>
        <select value={meridiem} onChange={(e) => onChange(hour, minute, e.target.value)}>
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
}
