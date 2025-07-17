import React from 'react';
import CommentsSection from './CommentsSection';

function PostItem({
  post,
  handleLikePost,
  handleSavePost,
  showComments,
  toggleComments,
  comments,
  newComment,
  setNewComment,
  handleCreateComment,
  handleDeletePost
}) {
  // Get current user ID from localStorage
  const userId = localStorage.getItem('userId');
  const isSavedByUser = post.isSaved && userId && post.isSaved.includes(userId);
  const isAuthor = post.author && (post.author._id === userId || post.author === userId);

  return (
    <div className="post">
      <div className="post-header">
        <img src="https://via.placeholder.com/40" alt="" />
        <div>
          <h4>{post.author?.fullName || 'Unknown User'}</h4>
          <span>{new Date(post.createdAt).toLocaleString()}</span>
          {post.postType !== 'general' && (
            <span className="post-type">{post.postType.replace('_', ' ')}</span>
          )}
        </div>
      </div>
      <p>{post.content}</p>
      {post.location && (
        <p className="post-location">📍 {post.location}</p>
      )}
      {post.images && post.images.length > 0 && (
        <div className="post-images">
          {post.images.map((image, index) => (
            <img 
              key={index} 
              src={image} 
              alt={`Post image ${index + 1}`}
              className="post-image"
            />
          ))}
        </div>
      )}
      <div className="post-categories-display">
        {post.isEvacuee && <span className="category-tag">Evacuees</span>}
        {post.isInjured && <span className="category-tag">Injured</span>}
        {post.isReservist && <span className="category-tag">Reservists</span>}
        {post.isRegularSoldier && <span className="category-tag">Regular Soldiers</span>}
      </div>
      <div className="post-actions">
        <button onClick={() => handleLikePost(post._id)}>👍 Like ({post.likeCount || 0})</button>
        <button onClick={toggleComments}>💬 Comment ({post.commentCount || 0})</button>
        <button onClick={() => handleSavePost(post._id)}>
          🔖 {isSavedByUser ? 'Unsave' : 'Save'}
        </button>
        {isAuthor && (
          <button onClick={() => handleDeletePost(post._id)} style={{ color: 'red', marginLeft: '8px' }}>
            🗑️ Delete Post
          </button>
        )}
      </div>
      {showComments && (
        <CommentsSection
          comments={comments}
          newComment={newComment}
          setNewComment={setNewComment}
          handleCreateComment={handleCreateComment}
        />
      )}
    </div>
  );
}

export default PostItem; 