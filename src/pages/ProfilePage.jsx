import StatCard from '../components/StatCard';
import { profile } from '../data/mockData';

export default function ProfilePage() {
  return (
    <>
      <div className="profile-hero">
        <div className="profile-avatar-wrap">
          <img src={profile.avatar} alt={profile.name} />
        </div>
        <div className="profile-info">
          <h3>{profile.name}</h3>
          <p className="profile-username">{profile.username}</p>
          <p className="profile-bio">{profile.bio}</p>
        </div>
      </div>

      <section className="stats-grid">
        <StatCard title="Total Points" value={profile.totalPoints} hint="lifetime score" />
        <StatCard title="Diet Check-Ins" value={profile.dietCheckIns} hint="days logged" />
        <StatCard title="Workout Check-Ins" value={profile.workoutCheckIns} hint="sessions logged" />
        <StatCard title="Current Streak" value={`${profile.currentStreak}d`} hint="consecutive days" />
      </section>

      <article className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          My Posts
        </h3>
        <ul className="my-posts">
          {profile.myPosts.map((post, idx) => (
            <li key={post}>
              <span className="post-num">Post #{idx + 1}</span>
              <p>{post}</p>
            </li>
          ))}
        </ul>
      </article>
    </>
  );
}
