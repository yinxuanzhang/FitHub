import MonthCalendar from '../components/MonthCalendar';
import { useAppData } from '../context/AppDataContext';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const FULL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getThisWeek() {
  const today = new Date();
  const dow = today.getDay();
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      date: d.toISOString().slice(0, 10),
      dow: d.getDay(),
      label: DAY_LABELS[d.getDay()],
    };
  });
}

function WeekProgressRow({ label, weekDays, plannedSet, doneSet }) {
  const planned = weekDays.filter(d => plannedSet.has(d.dow));
  const done = planned.filter(d => doneSet.has(d.date));
  const pct = planned.length > 0 ? Math.round((done.length / planned.length) * 100) : 0;

  return (
    <div className="week-progress-block">
      <div className="week-progress-head">
        <span className="week-progress-label">{label}</span>
        <span className="week-progress-count">{done.length} / {planned.length} days</span>
      </div>
      <div className="progress-track" style={{ marginBottom: '0.75rem' }}>
        <div className="progress-fill" style={{ width: `${pct}%`, background: 'var(--accent)' }} />
      </div>
      <div className="week-day-row">
        {weekDays.map(d => {
          const isPlanned = plannedSet.has(d.dow);
          const isDone = doneSet.has(d.date);
          return (
            <div
              key={d.date}
              className={`week-day-pip${!isPlanned ? ' week-day-pip--free' : isDone ? ' week-day-pip--done' : ' week-day-pip--pending'}`}
            >
              <span className="week-day-pip-label">{d.label}</span>
              <span className="week-day-pip-icon">{isDone ? '✓' : isPlanned ? '·' : '—'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { workoutPlan, workoutCheckIns, dietPlan, dietCheckIns } = useAppData();

  const now = new Date();
  const dateStr = `${FULL_DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}`;
  const weekDays = getThisWeek();

  // Workout: planned days = days that have at least one exercise in the plan
  const workoutPlannedSet = new Set(
    Object.entries(workoutPlan)
      .filter(([, v]) => (v.exercises || []).length > 0)
      .map(([dow]) => Number(dow))
  );
  const workoutDoneSet = new Set(workoutCheckIns);

  // Diet: planned days = control days
  const dietPlannedSet = new Set(dietPlan.controlDays);
  const dietDoneSet = new Set(dietCheckIns);

  return (
    <>
      <div className="dashboard-hero">
        <div>
          <p className="dashboard-date">{dateStr}</p>
          <h1>Good morning 👋</h1>
          <p className="dashboard-subtitle">Stay consistent, keep improving.</p>
        </div>
      </div>

      {/* Weekly progress */}
      <article className="card">
        <h3 className="card-section-title" style={{ marginBottom: '1.25rem' }}>This Week</h3>
        <WeekProgressRow
          label="🏋️ Workout"
          weekDays={weekDays}
          plannedSet={workoutPlannedSet}
          doneSet={workoutDoneSet}
        />
        <div style={{ height: '1.25rem' }} />
        <WeekProgressRow
          label="🥗 Diet"
          weekDays={weekDays}
          plannedSet={dietPlannedSet}
          doneSet={dietDoneSet}
        />
      </article>

      {/* Compact calendar */}
      <article className="card">
        <p className="section-title" style={{ marginBottom: '1rem' }}>Activity Calendar</p>
        <MonthCalendar
          compact
          workoutCheckIns={workoutCheckIns}
          dietCheckIns={dietCheckIns}
        />
      </article>
    </>
  );
}
