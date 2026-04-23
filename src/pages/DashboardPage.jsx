import { dashboardData } from '../data/mockData';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import QuickLinkCard from '../components/QuickLinkCard';

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" subtitle="Your progress snapshot for today" />

      <section className="stats-grid">
        <StatCard title="Diet Goal Progress" value={`${dashboardData.dietProgress}%`} />
        <StatCard title="Workout Progress" value={`${dashboardData.workoutProgress}%`} />
        <StatCard
          title="Today's Score"
          value={`Diet +${dashboardData.todayScore.diet} • Workout +${dashboardData.todayScore.workout}`}
        />
        <StatCard title="Total Check-In Days" value={dashboardData.totalCheckIns} />
        <StatCard title="Current Streak" value={`${dashboardData.currentStreak} days`} />
      </section>

      <section>
        <h3 className="section-title">Quick Links</h3>
        <div className="quick-links-grid">
          <QuickLinkCard title="Diet" description="Log meals and macros" to="/diet" />
          <QuickLinkCard title="Workout" description="Track lifts and sessions" to="/workout" />
          <QuickLinkCard title="Community" description="Share and stay motivated" to="/community" />
        </div>
      </section>
    </>
  );
}
