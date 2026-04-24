import { dashboardData } from '../data/mockData';
import StatCard from '../components/StatCard';
import QuickLinkCard from '../components/QuickLinkCard';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function RingProgress({ value, strokeColor, size = 130, label, sublabel }) {
  const r = 48;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - value / 100);

  return (
    <div className="ring-section">
      <div className="ring-wrap" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#222" strokeWidth="7" />
          <circle
            cx="60" cy="60" r={r}
            fill="none"
            stroke={strokeColor}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>
        <div className="ring-center">
          <span className="ring-pct">{value}%</span>
          <span className="ring-label-text">{label}</span>
        </div>
      </div>
      {sublabel && <p className="ring-sublabel">{sublabel}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const now = new Date();
  const dateStr = `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}`;

  return (
    <>
      <div className="dashboard-hero">
        <div>
          <p className="dashboard-date">{dateStr}</p>
          <h1>Good morning, Alex</h1>
          <p className="dashboard-subtitle">
            You&apos;re building something great. Stay consistent.
          </p>
        </div>
        <div className="streak-badge">
          🔥&nbsp;{dashboardData.currentStreak}-day streak
        </div>
      </div>

      <section className="stats-grid">
        <StatCard title="Diet Goal" value={`${dashboardData.dietProgress}%`} hint="of today's target" />
        <StatCard title="Workout" value={`${dashboardData.workoutProgress}%`} hint="session complete" />
        <StatCard title="Today's Score" value={`+${dashboardData.todayScore.diet + dashboardData.todayScore.workout}`} hint="points earned" />
        <StatCard title="Total Check-Ins" value={dashboardData.totalCheckIns} hint="all time" />
        <StatCard title="Current Streak" value={`${dashboardData.currentStreak}d`} hint="keep it going" />
      </section>

      <section className="two-col">
        <article className="card" style={{ textAlign: 'center' }}>
          <p className="section-title" style={{ textAlign: 'left' }}>Diet Progress</p>
          <RingProgress
            value={dashboardData.dietProgress}
            strokeColor="#efefef"
            label="Nutrition"
            sublabel={`${dashboardData.dietProgress}% of daily goal`}
          />
        </article>

        <article className="card" style={{ textAlign: 'center' }}>
          <p className="section-title" style={{ textAlign: 'left' }}>Workout Progress</p>
          <RingProgress
            value={dashboardData.workoutProgress}
            strokeColor="#888"
            label="Training"
            sublabel={`${dashboardData.workoutProgress}% of session done`}
          />
        </article>
      </section>

      <section>
        <p className="section-title">Quick Navigation</p>
        <div className="quick-links-grid">
          <QuickLinkCard title="Diet" description="Log meals and track macros" to="/diet" />
          <QuickLinkCard title="Workout" description="Record sets, reps, and weight" to="/workout" />
          <QuickLinkCard title="Community" description="Share progress and get inspired" to="/community" />
        </div>
      </section>
    </>
  );
}
