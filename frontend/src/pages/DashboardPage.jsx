import { Link } from 'react-router-dom';
import MonthCalendar from '../components/MonthCalendar';
import { useAppData } from '../context/AppDataContext';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const FULL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MUSCLE_LABEL = {
  chest: 'Chest',
  shoulders: 'Shoulders',
  back: 'Back',
  arms: 'Arms',
  legsglutes: 'Legs & Glutes',
  cardio: 'Cardio',
  rest: 'Rest',
};

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

function recentDates(dates, limit = 3) {
  return [...dates].sort((a, b) => b.localeCompare(a)).slice(0, limit);
}

export default function DashboardPage() {
  const { workoutPlan, workoutDailyFocus, workoutCheckIns, dietPlan, dietCheckIns } = useAppData();

  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const todayDow = now.getDay();
  const dateStr = `${FULL_DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}`;
  const weekDays = getThisWeek();
  const todayWorkoutFocus = workoutDailyFocus?.[today] || workoutPlan[todayDow]?.muscleGroups || [];
  const todayWorkoutIsRest = todayWorkoutFocus.length === 0 || todayWorkoutFocus.includes('rest');
  const todayWorkoutLabels = todayWorkoutIsRest
    ? ['Rest']
    : todayWorkoutFocus.map(g => MUSCLE_LABEL[g] || g);
  const isDietControlDay = dietPlan.controlDays.includes(todayDow);
  const workoutDoneToday = workoutCheckIns.includes(today);
  const dietDoneToday = dietCheckIns.includes(today);

  // Workout: planned days = days where the user selected a focus for that date.
  const workoutPlannedSet = new Set(
    weekDays
      .filter(d => {
        const groups = workoutDailyFocus?.[d.date] || workoutPlan[d.dow]?.muscleGroups || [];
        return groups.length > 0 && !groups.includes('rest');
      })
      .map(d => d.dow)
  );
  const workoutDoneSet = new Set(workoutCheckIns);

  // Diet: planned days = control days
  const dietPlannedSet = new Set(dietPlan.controlDays);
  const dietDoneSet = new Set(dietCheckIns);
  const recentWorkout = recentDates(workoutCheckIns);
  const recentDiet = recentDates(dietCheckIns);

  return (
    <>
      <div className="dashboard-hero">
        <div>
          <p className="dashboard-date">{dateStr}</p>
          <h1>Good morning 👋</h1>
          <p className="dashboard-subtitle">Stay consistent, keep improving.</p>
        </div>
      </div>

      <article className="card dashboard-today-card">
        <div className="dashboard-today-head">
          <div>
            <p className="section-title">Today</p>
            <h3>{dateStr}</h3>
          </div>
          <div className="dashboard-today-actions">
            <Link to="/workout">Workout</Link>
            <Link to="/diet">Diet</Link>
          </div>
        </div>

        <div className="dashboard-today-grid">
          <div className="dashboard-today-panel">
            <div className="dashboard-today-panel-head">
              <span>Workout</span>
              <strong className={workoutDoneToday ? 'status-done' : ''}>
                {workoutDoneToday ? 'Logged' : 'Pending'}
              </strong>
            </div>
            <p>{todayWorkoutLabels.join(', ')}</p>
          </div>

          <div className="dashboard-today-panel">
            <div className="dashboard-today-panel-head">
              <span>Diet</span>
              <strong className={dietDoneToday ? 'status-done' : ''}>
                {dietDoneToday ? 'Logged' : isDietControlDay ? 'Pending' : 'Free day'}
              </strong>
            </div>
            <p>{isDietControlDay ? 'Control day' : 'No tracking needed'}</p>
          </div>
        </div>
      </article>

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

      <div className="dashboard-bottom-grid">
        <article className="card">
          <p className="section-title" style={{ marginBottom: '1rem' }}>Activity Calendar</p>
          <MonthCalendar
            compact
            workoutCheckIns={workoutCheckIns}
            dietCheckIns={dietCheckIns}
          />
        </article>

        <article className="card recent-log-card">
          <p className="section-title">Recent Logs</p>
          <div className="recent-log-section">
            <h4>Workout</h4>
            {recentWorkout.length > 0
              ? recentWorkout.map(d => <span key={d}>{d}</span>)
              : <p>No workout logs yet.</p>
            }
          </div>
          <div className="recent-log-section">
            <h4>Diet</h4>
            {recentDiet.length > 0
              ? recentDiet.map(d => <span key={d}>{d}</span>)
              : <p>No diet logs yet.</p>
            }
          </div>
        </article>
      </div>
    </>
  );
}
