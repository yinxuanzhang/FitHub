import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { commentsByPostId, posts } from '../data/mockData';

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

export default function PostDetailPage() {
  const { postId } = useParams();
  const post = useMemo(() => posts.find((e) => e.id === postId) ?? posts[0], [postId]);
  const comments = commentsByPostId[post.id] ?? [];

  return (
    <>
      <PageHeader title="Post" subtitle="Discuss and support each other" />

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

        <p className="post-text" style={{ fontSize: '0.9375rem', lineHeight: 1.7 }}>
          {post.text}
        </p>

        {post.image && <img src={post.image} alt={`${post.user} full post`} />}

        <div className="post-actions">
          <button type="button" className="post-action-btn">
            ♡ &nbsp;{post.likes} likes
          </button>
        </div>
      </article>

      <article className="card">
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          Comments ({comments.length})
        </h3>

        {comments.length > 0 && (
          <ul className="comment-list">
            {comments.map((c) => (
              <li key={c.id}>
                <p className="comment-user-line">
                  <strong>{c.user}</strong>&nbsp;·&nbsp;{c.time}
                </p>
                <p className="comment-text">{c.text}</p>
              </li>
            ))}
          </ul>
        )}

        <form className="form-grid">
          <label>
            Add a comment
            <textarea rows="3" placeholder="Encourage, suggest, or celebrate…" />
          </label>
          <button type="button">Post Comment</button>
        </form>
      </article>
    </>
  );
}
