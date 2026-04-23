import PageHeader from '../components/PageHeader';
import PostCard from '../components/PostCard';
import { posts } from '../data/mockData';

export default function CommunityPage() {
  return (
    <>
      <PageHeader title="Community" subtitle="Share progress and stay inspired" />

      <section className="card create-post">
        <h3>Create Post</h3>
        <form className="form-grid">
          <label>
            What's on your mind?
            <textarea rows="4" placeholder="Share your win, routine, or tip..." />
          </label>
          <label>
            Upload image
            <input type="file" accept="image/*" />
          </label>
          <button type="button">Publish Post</button>
        </form>
      </section>

      <section className="post-feed">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>

      <button type="button" className="load-more-btn">
        Load More
      </button>
    </>
  );
}
