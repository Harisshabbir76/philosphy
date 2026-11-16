"use client";

import { useEffect, useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiCheck, FiX, FiTrash2 } from "react-icons/fi";
import { API_BASE_URL } from "../../../../lib/api";
import "./calendar.css";

type StoredUser = { token?: string };

type EntryMode = "fullDay" | "timeSlotAll" | "timeSlotSpecific" | "servicesAllDay";

type DateEntry = {
  key: string;
  date: string;
  source: "admin" | "booking";
  mode: EntryMode;
  startTime: string;
  endTime: string;
  services: string[];
  offdayId: string | null;
  svcblockId: string | null;
  isNew: boolean;
  // saved copies for dirty / discard
  savedMode: EntryMode;
  savedStartTime: string;
  savedEndTime: string;
  savedServices: string[];
};

const SERVICES_LIST = [
  "Color Analysis",
  "Body and Face Analysis",
  "Personal Image Analysis (Combined Services)",
  "Closet Edit Abu Dhabi",
  "Closet Edit UAE & Other Cities",
  "Coordinating Outfits and Looks from Your Wardrobe Abu Dhabi",
  "Coordinating Outfits and Looks from Your Wardrobe UAE & Other Cities",
  "Personal Shopping (In-Person) Abu Dhabi / Al Ain",
  "Personal Shopping (In-Person) Dubai / Sharjah",
  "Style & Shop Experience (Basic Package)",
  "Style & Shop Experience (4 Sessions)",
  "Style & Shop Experience (6 Sessions)",
  "I Shop 4 U – Remote Personal Shopping 1–2 Looks",
  "I Shop 4 U – Remote Personal Shopping 3–5 Looks",
  "I Shop 4 U – Remote Personal Shopping 6–10 Looks",
  "Bridal Styling Education Experience",
  "The Complete Bridal Wedding Look",
  "Bridal Dowry Styling Experience – Zhab",
];

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
  } catch { return ""; }
};

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

function to24hMinutes(time24: string) {
  const [h, m] = (time24 || "0:0").split(":").map(Number);
  return h * 60 + (m || 0);
}

function offDayToEntry(d: { _id: string; date: string; fullDay: boolean; startTime: string; endTime: string; source: string }): DateEntry {
  const mode: EntryMode = d.fullDay ? "fullDay" : "timeSlotAll";
  const st = d.startTime || DEFAULT_START;
  const et = d.endTime || DEFAULT_END;
  return {
    key: `${d.date}-offday`,
    date: d.date,
    source: d.source === "booking" ? "booking" : "admin",
    mode,
    startTime: st,
    endTime: et,
    services: [],
    offdayId: d._id,
    svcblockId: null,
    isNew: false,
    savedMode: mode,
    savedStartTime: st,
    savedEndTime: et,
    savedServices: [],
  };
}

function svcBlockToEntry(b: { _id: string; date: string; services: string[]; fullDay: boolean; startTime: string; endTime: string }): DateEntry {
  const mode: EntryMode = b.fullDay ? "servicesAllDay" : "timeSlotSpecific";
  const st = b.startTime || DEFAULT_START;
  const et = b.endTime || DEFAULT_END;
  return {
    key: `${b.date}-svcblock`,
    date: b.date,
    source: "admin",
    mode,
    startTime: st,
    endTime: et,
    services: b.services,
    offdayId: null,
    svcblockId: b._id,
    isNew: false,
    savedMode: mode,
    savedStartTime: st,
    savedEndTime: et,
    savedServices: [...b.services],
  };
}

export default function AdminCalendarPage() {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const [entries, setEntries] = useState<DateEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [offRes, svcRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/off-days`, { headers: { Authorization: `Bearer ${getToken()}` } }),
          fetch(`${API_BASE_URL}/api/service-blocks`, { headers: { Authorization: `Bearer ${getToken()}` } }),
        ]);
        const offData = await offRes.json();
        if (!offRes.ok) throw new Error(offData.error || "Unable to load calendar data");
        const loaded: DateEntry[] = offData.map(offDayToEntry);
        if (svcRes.ok) {
          const svcData = await svcRes.json();
          if (Array.isArray(svcData)) loaded.push(...svcData.map(svcBlockToEntry));
        }
        setEntries(loaded);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load calendar data");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const grid = useMemo(() => {
    const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [viewYear, viewMonth]);

  const monthPrefix = `${viewYear}-${pad(viewMonth + 1)}`;

  const monthEntries = useMemo(() => {
    const inMonth = entries.filter((e) => e.date.startsWith(monthPrefix));
    const saved = inMonth.filter((e) => !e.isNew).sort((a, b) => a.date.localeCompare(b.date));
    const drafts = inMonth.filter((e) => e.isNew);
    return [...saved, ...drafts];
  }, [entries, monthPrefix]);

  const selectedDates = useMemo(() => new Set(entries.map((e) => e.date)), [entries]);
  const savedOffdayDates = useMemo(() => new Set(entries.filter((e) => e.offdayId !== null).map((e) => e.date)), [entries]);
  const bookingDates = useMemo(() => new Set(entries.filter((e) => e.source === "booking").map((e) => e.date)), [entries]);
  const svcblockDates = useMemo(() => new Set(entries.filter((e) => e.svcblockId !== null).map((e) => e.date)), [entries]);

  const goPrevMonth = () => {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  };
  const goNextMonth = () => {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  };

  const toggleDate = (day: number) => {
    const key = dateKey(viewYear, viewMonth, day);
    const draft = entries.find((e) => e.date === key && e.isNew);
    if (draft) {
      setEntries((prev) => prev.filter((e) => !(e.date === key && e.isNew)));
      return;
    }
    const hasSaved = entries.some((e) => e.date === key && !e.isNew);
    if (hasSaved) return;
    setEntries((prev) => [
      ...prev,
      {
        key: `${key}-draft`,
        date: key,
        source: "admin",
        mode: "fullDay",
        startTime: DEFAULT_START,
        endTime: DEFAULT_END,
        services: [],
        offdayId: null,
        svcblockId: null,
        isNew: true,
        savedMode: "fullDay",
        savedStartTime: DEFAULT_START,
        savedEndTime: DEFAULT_END,
        savedServices: [],
      },
    ]);
  };

  const updateEntry = (key: string, patch: Partial<DateEntry>) => {
    setEntries((prev) => prev.map((e) => (e.key === key ? { ...e, ...patch } : e)));
  };

  const isDirty = (entry: DateEntry): boolean => {
    if (entry.isNew) return true;
    if (entry.mode !== entry.savedMode) return true;
    if (entry.mode === "timeSlotAll" || entry.mode === "timeSlotSpecific") {
      if (entry.startTime !== entry.savedStartTime || entry.endTime !== entry.savedEndTime) return true;
    }
    if (entry.mode === "timeSlotSpecific" || entry.mode === "servicesAllDay") {
      if ([...entry.services].sort().join(",") !== [...entry.savedServices].sort().join(",")) return true;
    }
    return false;
  };

  const handleSave = async (entry: DateEntry) => {
    const needsServices = entry.mode === "timeSlotSpecific" || entry.mode === "servicesAllDay";
    if (needsServices && entry.services.length === 0) {
      window.alert("Select at least one service to block.");
      return;
    }
    const needsTime = entry.mode === "timeSlotAll" || entry.mode === "timeSlotSpecific";
    if (needsTime && to24hMinutes(entry.startTime) >= to24hMinutes(entry.endTime)) {
      window.alert("End time must be after start time.");
      return;
    }

    setSavingKey(entry.key);
    try {
      // Delete old backend entry before creating the new one
      if (entry.offdayId) {
        await fetch(`${API_BASE_URL}/api/off-days/${entry.offdayId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getToken()}` },
        });
      }
      if (entry.svcblockId) {
        await fetch(`${API_BASE_URL}/api/service-blocks/${entry.svcblockId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getToken()}` },
        });
      }

      const isOffDay = entry.mode === "fullDay" || entry.mode === "timeSlotAll";
      let savedEntry: DateEntry;

      if (isOffDay) {
        const res = await fetch(`${API_BASE_URL}/api/off-days`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
          body: JSON.stringify({
            date: entry.date,
            fullDay: entry.mode === "fullDay",
            startTime: entry.mode === "timeSlotAll" ? entry.startTime : "",
            endTime: entry.mode === "timeSlotAll" ? entry.endTime : "",
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Unable to save");
        savedEntry = {
          ...entry,
          key: `${entry.date}-offday`,
          offdayId: data._id,
          svcblockId: null,
          isNew: false,
          savedMode: entry.mode,
          savedStartTime: entry.startTime,
          savedEndTime: entry.endTime,
          savedServices: [],
        };
      } else {
        const res = await fetch(`${API_BASE_URL}/api/service-blocks`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
          body: JSON.stringify({
            date: entry.date,
            services: entry.services,
            fullDay: entry.mode === "servicesAllDay",
            startTime: entry.mode === "timeSlotSpecific" ? entry.startTime : "",
            endTime: entry.mode === "timeSlotSpecific" ? entry.endTime : "",
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Unable to save");
        savedEntry = {
          ...entry,
          key: `${entry.date}-svcblock`,
          offdayId: null,
          svcblockId: data._id,
          isNew: false,
          savedMode: entry.mode,
          savedStartTime: entry.startTime,
          savedEndTime: entry.endTime,
          savedServices: [...entry.services],
        };
      }

      setEntries((prev) => [...prev.filter((e) => e.key !== entry.key), savedEntry]);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Unable to save");
    } finally {
      setSavingKey(null);
    }
  };

  const handleDiscard = (entry: DateEntry) => {
    if (entry.isNew) {
      setEntries((prev) => prev.filter((e) => e.key !== entry.key));
      return;
    }
    setEntries((prev) =>
      prev.map((e) =>
        e.key === entry.key
          ? { ...e, mode: e.savedMode, startTime: e.savedStartTime, endTime: e.savedEndTime, services: [...e.savedServices] }
          : e
      )
    );
  };

  const handleDelete = async (entry: DateEntry) => {
    setDeletingKey(entry.key);
    try {
      if (entry.offdayId) {
        const res = await fetch(`${API_BASE_URL}/api/off-days/${entry.offdayId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) throw new Error("Unable to delete");
      }
      if (entry.svcblockId) {
        const res = await fetch(`${API_BASE_URL}/api/service-blocks/${entry.svcblockId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) throw new Error("Unable to delete");
      }
      setEntries((prev) => prev.filter((e) => e.key !== entry.key));
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Unable to delete");
    } finally {
      setDeletingKey(null);
    }
  };

  return (
    <main className="cal-page">
      <header className="cal-page__header">
        <p className="cal-page__eyebrow">Philosophy Admin</p>
        <h1 className="cal-page__title">Calendar</h1>
        <p className="cal-page__subtitle">
          Click a date to configure it. Mark full off days, close specific time slots, or restrict specific services.
        </p>
      </header>

      {isLoading && <p className="cal-status">Loading calendar…</p>}
      {error && <p className="cal-status cal-status--error">{error}</p>}

      {!isLoading && !error && (
        <div className="cal-layout">
          {/* Left: month calendar */}
          <section className="cal-calendar" aria-label="Calendar">
            <div className="cal-calendar__nav">
              <button type="button" onClick={goPrevMonth} aria-label="Previous month"><FiChevronLeft size={20} /></button>
              <span className="cal-calendar__month">{MONTHS[viewMonth]} {viewYear}</span>
              <button type="button" onClick={goNextMonth} aria-label="Next month"><FiChevronRight size={20} /></button>
            </div>
            <div className="cal-calendar__weekdays">
              {WEEKDAYS.map((w) => <span key={w}>{w}</span>)}
            </div>
            <div className="cal-calendar__grid">
              {grid.map((day, idx) => {
                if (day === null) return <span key={`empty-${idx}`} className="cal-cell cal-cell--empty" />;
                const key = dateKey(viewYear, viewMonth, day);
                const isSelected = selectedDates.has(key);
                const isSavedOffday = savedOffdayDates.has(key);
                const isBooking = bookingDates.has(key);
                const hasSvcBlock = svcblockDates.has(key);
                const isToday = key === todayKey;
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => toggleDate(day)}
                    className={[
                      "cal-cell",
                      isSelected && !isBooking && !isSavedOffday ? "cal-cell--selected" : "",
                      isSavedOffday && !isBooking ? "cal-cell--saved" : "",
                      isBooking ? "cal-cell--booking" : "",
                      hasSvcBlock ? "cal-cell--has-svcblock" : "",
                      isToday ? "cal-cell--today" : "",
                    ].join(" ").trim()}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
            <div className="cal-legend">
              <span><i className="cal-dot cal-dot--saved" /> Off day (closed)</span>
              <span><i className="cal-dot cal-dot--booking" /> Booked</span>
              <span><i className="cal-dot cal-dot--draft" /> Unsaved</span>
              <span><i className="cal-dot cal-dot--svcblock" /> Service block</span>
            </div>
          </section>

          {/* Right: Off Days */}
          <section className="cal-offdays" aria-label="Off days">
            <h2 className="cal-offdays__heading">Off Days</h2>
            <p className="cal-offdays__month">{MONTHS[viewMonth]} {viewYear}</p>

            {monthEntries.length === 0 ? (
              <div className="cal-offdays__empty">
                No off days for this month. Click a date on the calendar to configure it.
              </div>
            ) : (
              <ul className="cal-offdays__list">
                {monthEntries.map((entry) => {
                  const saving = savingKey === entry.key;
                  const deleting = deletingKey === entry.key;
                  const dirty = isDirty(entry);

                  // Booking-sourced: read-only
                  if (entry.source === "booking") {
                    return (
                      <li key={entry.key} className="cal-offday cal-offday--booking">
                        <div className="cal-offday__top">
                          <span className="cal-offday__date">{formatDateLabel(entry.date)}</span>
                          <span className="cal-offday__badge cal-offday__badge--booking">Booked</span>
                        </div>
                        <p className="cal-offday__summary">Fully booked — no further appointments</p>
                        <div className="cal-offday__actions">
                          {entry.offdayId && (
                            <button type="button" className="cal-action cal-action--delete"
                              title="Remove booking block" disabled={deleting} onClick={() => handleDelete(entry)}>
                              <FiTrash2 size={17} />
                            </button>
                          )}
                        </div>
                      </li>
                    );
                  }

                  const isTimeSlot = entry.mode === "timeSlotAll" || entry.mode === "timeSlotSpecific";
                  const start = to12h(entry.startTime || DEFAULT_START);
                  const end = to12h(entry.endTime || DEFAULT_END);

                  return (
                    <li
                      key={entry.key}
                      className={[
                        "cal-offday",
                        entry.isNew ? "cal-offday--draft" : "",
                        entry.svcblockId ? "cal-offday--svcblock" : "",
                      ].join(" ").trim()}
                    >
                      <div className="cal-offday__top">
                        <span className="cal-offday__date">{formatDateLabel(entry.date)}</span>
                        {entry.isNew && <span className="cal-offday__badge">New</span>}
                        {!entry.isNew && entry.svcblockId && (
                          <span className="cal-offday__badge cal-offday__badge--svcblock">Service Block</span>
                        )}
                      </div>

                      {/* ── Mode selector ── */}
                      <div className="cal-offday__modes">

                        {/* Option 1: Full day off */}
                        <div className="cal-offday__mode-option">
                          <label className="cal-offday__mode-label">
                            <input
                              type="radio"
                              name={`mode-${entry.key}`}
                              checked={entry.mode === "fullDay"}
                              onChange={() => updateEntry(entry.key, { mode: "fullDay" })}
                            />
                            <div>
                              <span className="cal-offday__mode-name">Full day off</span>
                              <span className="cal-offday__mode-hint"> — no bookings accepted at all</span>
                            </div>
                          </label>
                        </div>

                        {/* Option 2: Time slot */}
                        <div className="cal-offday__mode-option">
                          <label className="cal-offday__mode-label">
                            <input
                              type="radio"
                              name={`mode-${entry.key}`}
                              checked={isTimeSlot}
                              onChange={() => {
                                if (!isTimeSlot) updateEntry(entry.key, { mode: "timeSlotAll" });
                              }}
                            />
                            <span className="cal-offday__mode-name">Specific time slot unavailable</span>
                          </label>

                          {isTimeSlot && (
                            <div className="cal-offday__mode-body">
                              <div className="cal-offday__times">
                                <TimePicker label="From" hour={start.hour} minute={start.minute} meridiem={start.meridiem}
                                  onChange={(h, m, mer) => updateEntry(entry.key, { startTime: to24h(h, m, mer) })} />
                                <TimePicker label="To" hour={end.hour} minute={end.minute} meridiem={end.meridiem}
                                  onChange={(h, m, mer) => updateEntry(entry.key, { endTime: to24h(h, m, mer) })} />
                              </div>

                              <div className="cal-offday__suboptions">
                                <label className="cal-offday__sub-label">
                                  <input type="radio" name={`sub-${entry.key}`}
                                    checked={entry.mode === "timeSlotAll"}
                                    onChange={() => updateEntry(entry.key, { mode: "timeSlotAll" })}
                                  />
                                  Block all services during this time
                                </label>
                                <label className="cal-offday__sub-label">
                                  <input type="radio" name={`sub-${entry.key}`}
                                    checked={entry.mode === "timeSlotSpecific"}
                                    onChange={() => updateEntry(entry.key, { mode: "timeSlotSpecific" })}
                                  />
                                  Block specific services only
                                </label>

                                {entry.mode === "timeSlotSpecific" && (
                                  <ServicesCheckboxes
                                    selected={entry.services}
                                    onChange={(services) => updateEntry(entry.key, { services })}
                                  />
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Option 3: Specific services all day */}
                        <div className="cal-offday__mode-option">
                          <label className="cal-offday__mode-label">
                            <input
                              type="radio"
                              name={`mode-${entry.key}`}
                              checked={entry.mode === "servicesAllDay"}
                              onChange={() => updateEntry(entry.key, { mode: "servicesAllDay" })}
                            />
                            <span className="cal-offday__mode-name">Specific services unavailable all day</span>
                          </label>

                          {entry.mode === "servicesAllDay" && (
                            <div className="cal-offday__mode-body">
                              <ServicesCheckboxes
                                selected={entry.services}
                                onChange={(services) => updateEntry(entry.key, { services })}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Summary when saved and clean */}
                      {!entry.isNew && !dirty && (
                        <p className="cal-offday__summary">
                          {entry.mode === "fullDay" && "Closed all day"}
                          {entry.mode === "timeSlotAll" && `Closed ${formatTimeLabel(entry.startTime)} – ${formatTimeLabel(entry.endTime)}`}
                          {entry.mode === "timeSlotSpecific" && `${entry.services.length} service(s) unavailable ${formatTimeLabel(entry.startTime)} – ${formatTimeLabel(entry.endTime)}`}
                          {entry.mode === "servicesAllDay" && `${entry.services.length} service(s) unavailable all day`}
                        </p>
                      )}

                      <div className="cal-offday__actions">
                        {(entry.isNew || dirty) && (
                          <>
                            <button type="button" className="cal-action cal-action--save" title="Save"
                              disabled={saving} onClick={() => handleSave(entry)}>
                              <FiCheck size={18} />
                            </button>
                            <button type="button" className="cal-action cal-action--discard" title="Discard"
                              disabled={saving} onClick={() => handleDiscard(entry)}>
                              <FiX size={18} />
                            </button>
                          </>
                        )}
                        {!entry.isNew && (
                          <button type="button" className="cal-action cal-action--delete" title="Delete"
                            disabled={deleting} onClick={() => handleDelete(entry)}>
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

// ── Helper components ───────────────────────────────────────────────────────

function ServicesCheckboxes({ selected, onChange }: { selected: string[]; onChange: (s: string[]) => void }) {
  return (
    <div className="cal-offday__services-wrap">
      <div className="cal-offday__services-actions">
        <button type="button" onClick={() => onChange([...SERVICES_LIST])}>All</button>
        <button type="button" onClick={() => onChange([])}>None</button>
      </div>
      <div className="cal-offday__services-grid">
        {SERVICES_LIST.map((srv) => (
          <label key={srv} className="cal-offday__service-item">
            <input
              type="checkbox"
              checked={selected.includes(srv)}
              onChange={(e) => {
                if (e.target.checked) onChange([...selected, srv]);
                else onChange(selected.filter((s) => s !== srv));
              }}
            />
            <span>{srv}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

type TimePickerProps = {
  label: string; hour: number; minute: number; meridiem: string;
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
          {hours.map((h) => <option key={h} value={h}>{pad(h)}</option>)}
        </select>
        <span className="cal-time__colon">:</span>
        <select value={minute} onChange={(e) => onChange(hour, Number(e.target.value), meridiem)}>
          {minutes.map((m) => <option key={m} value={m}>{pad(m)}</option>)}
        </select>
        <select value={meridiem} onChange={(e) => onChange(hour, minute, e.target.value)}>
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
}
