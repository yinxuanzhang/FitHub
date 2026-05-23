import { useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useFitnessData } from "../context/FitnessDataContext.jsx";
import axios from "axios";
const SAMPLE_POST_IMAGE = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80";

export default function SocialPage() {
  const { currentUser } = useAuth();
  const { allPosts, addPost,setPosts } = useFitnessData();
  const [caption, setCaption] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [imageUrl, setImageUrl] = useState("");
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  async function getImageUrl(file) {
    if (!file) return null;

    try {
      const response = await axios.post("http://localhost:3000/api/uploads/post-image-url",
        {
          fileName: file.name,
          fileType: file.type
        },
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
      const { uploadUrl, imageUrl } = response.data;
      const uploadResponse = await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type
        }
      });
      if (uploadResponse.status >= 400) throw new Error("Failed to upload post image");
      return imageUrl;
    } catch (error) {
      console.error("Failed to upload post image:", error);
      return null;
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!caption.trim()) return;
    const finalImageUrl = await getImageUrl(imageUrl);
    if (imageUrl && !finalImageUrl) return;
    addPost({ createdAt: new Date().toISOString(), visibility, caption, imageUrl: finalImageUrl });
    await axios.post('http://localhost:3000/api/posts', {
      caption,
      visibility,
      imageUrl: finalImageUrl
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    }).catch((error) => {
      console.error('Failed to create post:', error);
    });
    
    
    await axios.get('http://localhost:3000/api/posts', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    }).then((response) => {
      if (response.status === 200) {
        const { Posts } = response.data;
        
        setPosts(Posts);
      }
    });
    setCaption("");
    setVisibility("public");
    setImageUrl("");
    setIsComposerOpen(false);
    
  }

  function closeComposer() {
    setIsComposerOpen(false);
    setCaption("");
    setVisibility("public");
    setImageUrl("");
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Social"
        title="Posts"
        description="Share simple fitness updates without comments, ranking, or recommendation complexity."
        actions={<button className="button primary create-post-btn" type="button" onClick={() => setIsComposerOpen(true)}>Create Post</button>}
      />

      <section className="post-list">
        {[...allPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((post) => {
          const hasImage = Boolean(post.photos);
          return (
          <article className={`post-card ${hasImage ? "has-image" : "text-only"}`} key={post.id}>
            <div className="post-content">
              <div className="post-meta">
                <Avatar user={post.user} className="feed-avatar" />
                <div className="post-author">
                  <strong>{post.user?.name}</strong>
                  <span>{formatPostDate(post.createdAt)}</span>
                </div>
                <span className={`visibility-pill ${post.visibility === "public" ? "public" : "private"}`}>
                  {post.visibility === "public" ? "Public" : "Private"}
                </span>
              </div>
              {hasImage && (
                <img className="post-feed-image"  src={post.photos} alt={post.photos  || ""} />
              )}
              <p className="post-caption">{post.caption}</p>
              <div className="post-actions">
                <button className="like-count" type="button" aria-label={`${getLikeCount(post)} likes`}>
                  <span aria-hidden="true">♥</span>
                  {getLikeCount(post)}
                </button>
              </div>
            </div>
          </article>
          );
        })}
      </section>

      {isComposerOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={closeComposer}>
          <section className="post-modal" role="dialog" aria-modal="true" aria-labelledby="create-post-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="post-modal-header">
              <div>
                <p className="eyebrow">New post</p>
                <h2 id="create-post-title">Create Post</h2>
              </div>
              <button className="modal-close-btn" type="button" onClick={closeComposer} aria-label="Close create post modal">×</button>
            </div>

            <form className="post-composer post-composer-modal" onSubmit={handleSubmit}>
              <Avatar user={currentUser} className="feed-avatar composer-avatar" />
              <div className="composer-body">
                <textarea
                  className="feed-caption-input"
                  value={caption}
                  onChange={(event) => setCaption(event.target.value)}
                  placeholder="Write a short training or progress update"
                  aria-label="Caption"
                  autoFocus
                />
                <div className="composer-footer">
                  <label
                    className={`add-image-btn ${imageUrl ? "active" : ""}`}
                  >
                    {imageUrl ? "Image added" : "Add image"}
                    <input type="file" accept="image/*" onChange={
                      (event)=>{const file=event.target.files[0];
                        setImageUrl(file);
                      }
                    } />  
                  </label>
                  <label className="visibility-control">
                    <span>Visibility</span>
                    <select value={visibility} onChange={(event) => setVisibility(event.target.value)}>
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </label>
                  <button className="button primary post-submit-btn" type="submit">Post</button>
                </div>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

function Avatar({ user, className }) {
  if (user?.avatar) {
    return <img className={className} src={user.avatar} alt="" />;
  }
  return <span className={`${className} fallback`}>{user?.name?.charAt(0) || "U"}</span>;
}

function formatPostDate(date) {
  return new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function getLikeCount(post) {
  if (typeof post.likeCount === "number") return post.likeCount;
  return post.id.split("").reduce((total, char) => total + char.charCodeAt(0), 0) % 24;
}
