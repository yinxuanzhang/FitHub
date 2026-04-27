import PageHeader from '../components/PageHeader';
import PostCard from '../components/PostCard';
import { posts } from '../data/mockData';

export default function CommunityPage() {
  return (
    <>
      <PageHeader title="Community" subtitle="Share progress and stay inspired" />

      <article className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          Create Post
        </h3>
        <form className="form-grid">
          <label>
            What&apos;s on your mind?
            <textarea rows="4" placeholder="Share your win, routine, or tip…" />
          </label>
          <label>
            Upload image
            <input type="file" accept="image/*" />
          </label>
          <button type="button">Publish Post</button>
        </form>
      </article>

      <section className="post-feed">
        {posts.map((post, i) => (
          <div key={post.id} style={{ animationDelay: `${i * 0.08}s` }}>
            <PostCard post={post} />
          </div>
        ))}
      </section>

      <button type="button" className="load-more-btn">
        Load more posts
      </button>
    </>
  );
}
