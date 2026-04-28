import { useState } from 'react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function pad2(n) { return String(n).padStart(2, '0'); }

export default function MonthCalendar({ workoutCheckIns = [], dietCheckIns = [], onDayClick, compact = false }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const todayStr = now.toISOString().slice(0, 10);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay();

  const workoutSet = new Set(workoutCheckIns);
  const dietSet = new Set(dietCheckIns);

  function dk(d) { return `${year}-${pad2(month + 1)}-${pad2(d)}`; }

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  }

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className={`month-calendar${compact ? ' month-calendar--compact' : ''}`}>
      <div className="cal-nav">
        <button type="button" className="ghost-btn cal-nav-btn" onClick={prevMonth}>‹</button>
        <span className="cal-month-label">{MONTH_NAMES[month]} {year}</span>
        <button type="button" className="ghost-btn cal-nav-btn" onClick={nextMonth}>›</button>
      </div>

      <div className="cal-dow-row">
        {DOW.map(d => <div key={d} className="cal-dow">{d}</div>)}
      </div>

      <div className="cal-grid">
        {cells.map((d, i) => {
          if (!d) return <div key={`e${i}`} className="cal-cell cal-cell--empty" />;
          const key = dk(d);
          const isToday = key === todayStr;
          const hasW = workoutSet.has(key);
          const hasD = dietSet.has(key);
          return (
            <div
              key={key}
              className={`cal-cell${isToday ? ' cal-cell--today' : ''}${onDayClick ? ' cal-cell--clickable' : ''}`}
              onClick={() => onDayClick?.(key)}
            >
              <span className="cal-day-num">{d}</span>
              {(hasW || hasD) && (
                <div className="cal-dots">
                  {hasW && <span className="cal-dot cal-dot--workout" title="Workout logged" />}
                  {hasD && <span className="cal-dot cal-dot--diet" title="Diet logged" />}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="cal-legend">
        <span className="cal-legend-item">
          <span className="cal-dot cal-dot--workout" />Workout
        </span>
        <span className="cal-legend-item">
          <span className="cal-dot cal-dot--diet" />Diet
        </span>
      </div>
    </div>
  );
}
