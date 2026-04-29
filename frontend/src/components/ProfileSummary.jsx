import { Link } from "react-router-dom";
import { calculateProgramVersionVolume, countProgramExercises, formatDate, formatNumber } from "../utils/fitness.js";

export default function ProfileSummary({ user, program, latestBodyRecord, posts, isOwnProfile = false }) {
  const currentVersion = program?.versions?.[0];

  return (
    <div className="page-stack">
      <section className="profile-hero">
        <ProfileAvatar user={user} />
        <div>
          <span className="eyebrow">Member since {formatDate(user.createdAt)}</span>
          <h1>{user.name}</h1>
          <p>{user.bio || "No bio yet."}</p>
        </div>
        {isOwnProfile && <Link className="button primary" to="/profile/edit">Edit profile</Link>}
      </section>

      <div className="two-column align-start">
        <section className="profile-panel">
          <h2>Current program</h2>
          {currentVersion ? (
            <>
              <strong>{program.name}</strong>
              <p>{program.goal}</p>
              <div className="profile-stats">
                <span>v{currentVersion.versionNumber}</span>
                <span>{countProgramExercises(currentVersion)} exercises</span>
                <span>{formatNumber(calculateProgramVersionVolume(currentVersion))} lb</span>
              </div>
            </>
          ) : (
            <p>No public program summary available.</p>
          )}
        </section>

        <section className="profile-panel">
          <h2>Latest body record</h2>
          {latestBodyRecord ? (
            <>
              <strong>{latestBodyRecord.weight} lb</strong>
              <p>{latestBodyRecord.bodyFat}% body fat{latestBodyRecord.height ? ` · ${latestBodyRecord.height}"` : ""} · {formatDate(latestBodyRecord.date)}</p>
              {(latestBodyRecord.waist || latestBodyRecord.chest) && (
                <div className="record-measurements">
                  {latestBodyRecord.waist && <span>Waist {latestBodyRecord.waist}"</span>}
                  {latestBodyRecord.chest && <span>Chest {latestBodyRecord.chest}"</span>}
                </div>
              )}
            </>
          ) : (
            <p>Body records are private.</p>
          )}
        </section>
      </div>

      <section className="post-list">
        <h2>Public posts</h2>
        {posts.length === 0 && <p className="muted-copy">No public posts yet.</p>}
        {posts.map((post) => {
          const hasImage = Boolean(post.imageUrl);
          return (
            <article className={`post-card ${hasImage ? "has-image" : "text-only"}`} key={post.id}>
              <div className="post-content">
                <div className="post-meta">
                  <ProfileAvatar user={user} className="feed-avatar" />
                  <div className="post-author">
                    <strong>{user.name}</strong>
                    <span>{new Date(post.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                </div>
                {hasImage && <img className="post-feed-image" src={post.imageUrl} alt="" />}
                <p className="post-caption">{post.caption}</p>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

function ProfileAvatar({ user, className }) {
  const cls = className || "profile-avatar";
  if (user.avatarUrl) {
    return <img className={cls} src={user.avatarUrl} alt="" />;
  }
  return <div className={`${cls} fallback`}>{user.name?.charAt(0) || "U"}</div>;
}
