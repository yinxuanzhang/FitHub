import { Link } from 'react-router-dom';

const AVATAR_COLORS = ['#3a3a3a', '#2e2e2e', '#333', '#2a2a2a'];

function avatarColor(name) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

function initials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function PostCard({ post }) {
  return (
    <article className="card post-card">
      <div className="post-top">
        <div
          className="post-avatar"
          style={{ background: avatarColor(post.user), color: '#aaa' }}
        >
          {initials(post.user)}
        </div>
        <div className="post-meta">
          <h4>{post.user}</h4>
          <span>{post.createdAt}</span>
        </div>
      </div>

      <p className="post-text">{post.text}</p>

      {post.image && <img src={post.image} alt={`${post.user} post`} />}

      <div className="post-actions">
        <button type="button" className="post-action-btn">
          ♡ &nbsp;{post.likes}
        </button>
        <Link to={`/community/${post.id}`}>
          <button type="button" className="post-action-btn">
            ◎ &nbsp;{post.comments} comments
          </button>
        </Link>
      </div>
    </article>
  );
}
