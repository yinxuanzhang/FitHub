import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import { profile } from '../data/mockData';

export default function ProfilePage() {
  return (
    <>
      <PageHeader title="Profile" subtitle="Your fitness identity and stats" />

      <section className="card profile-card">
        <img src={profile.avatar} alt={profile.name} />
        <div>
          <h3>{profile.name}</h3>
          <p>{profile.username}</p>
          <p>{profile.bio}</p>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard title="Total Points" value={profile.totalPoints} />
        <StatCard title="Diet Check-Ins" value={profile.dietCheckIns} />
        <StatCard title="Workout Check-Ins" value={profile.workoutCheckIns} />
        <StatCard title="Current Streak" value={`${profile.currentStreak} days`} />
      </section>

      <section className="card">
        <h3>My Posts</h3>
        <ul className="my-posts">
          {profile.myPosts.map((post, idx) => (
            <li key={post}>
              <span>Post #{idx + 1}</span>
              <p>{post}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
