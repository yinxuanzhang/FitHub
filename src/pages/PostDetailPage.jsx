import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { commentsByPostId, posts } from '../data/mockData';

export default function PostDetailPage() {
  const { postId } = useParams();

  const post = useMemo(() => posts.find((entry) => entry.id === postId) ?? posts[0], [postId]);
  const comments = commentsByPostId[post.id] ?? [];

  return (
    <>
      <PageHeader title="Post Detail" subtitle="Discuss and support each other" />

      <article className="card post-card post-detail">
        <div className="post-top">
          <div>
            <h4>{post.user}</h4>
            <span>{post.createdAt}</span>
          </div>
        </div>
        <p>{post.text}</p>
        <img src={post.image} alt={`${post.user} full post`} />
        <button type="button" className="ghost-btn">
          ❤️ Like ({post.likes})
        </button>
      </article>

      <section className="card">
        <h3>Comments ({comments.length})</h3>
        <ul className="comment-list">
          {comments.map((comment) => (
            <li key={comment.id}>
              <p>
                <strong>{comment.user}</strong> · <span>{comment.time}</span>
              </p>
              <p>{comment.text}</p>
            </li>
          ))}
        </ul>

        <form className="form-grid">
          <label>
            Add comment
            <textarea rows="3" placeholder="Encourage, suggest, or celebrate..." />
          </label>
          <button type="button">Post Comment</button>
        </form>
      </section>
    </>
  );
}
