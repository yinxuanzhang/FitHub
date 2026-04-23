import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <article className="card post-card">
      <div className="post-top">
        <div>
          <h4>{post.user}</h4>
          <span>{post.createdAt}</span>
        </div>
      </div>
      <p>{post.text}</p>
      <img src={post.image} alt={`${post.user} post`} />
      <div className="post-actions">
        <button type="button" className="ghost-btn">
          ❤️ {post.likes}
        </button>
        <Link to={`/community/${post.id}`}>💬 {post.comments} comments</Link>
      </div>
    </article>
  );
}
