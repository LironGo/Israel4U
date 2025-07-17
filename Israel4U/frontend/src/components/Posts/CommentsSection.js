import React from 'react';

function CommentsSection({ comments, newComment, setNewComment, handleCreateComment }) {
  return (
    <div className="comments-section">
      <h4>Comments</h4>
      {comments?.map(comment => (
        <div key={comment._id} className="comment">
          <p>{comment.content}</p>
          <div className="comment-author">
            {comment.author?.fullName || 'Anonymous'}
          </div>
          <div className="comment-time">
            {new Date(comment.createdAt).toLocaleString()}
          </div>
        </div>
      ))}
      <div className="new-comment-form">
        <textarea
          placeholder="Add a comment..."
          value={newComment || ''}
          onChange={e => setNewComment(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleCreateComment()}
        />
        <button onClick={handleCreateComment}>Post</button>
      </div>
    </div>
  );
}

export default CommentsSection; 