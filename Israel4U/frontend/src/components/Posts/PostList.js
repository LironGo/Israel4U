import React from 'react';
import PostItem from './PostItem';

function PostList({
  posts,
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
  if (!posts.length) {
    return (
      <div className="no-posts">
        <h3>No posts yet</h3>
        <p>Be the first to share something with the community!</p>
      </div>
    );
  }
  return (
    <div className="posts-feed grid-posts-feed">
      {posts.map(post => (
        <PostItem
          key={post._id}
          post={post}
          handleLikePost={handleLikePost}
          handleSavePost={handleSavePost}
          showComments={showComments[post._id]}
          toggleComments={() => toggleComments(post._id)}
          comments={comments[post._id]}
          newComment={newComment[post._id]}
          setNewComment={text => setNewComment(prev => ({ ...prev, [post._id]: text }))}
          handleCreateComment={() => handleCreateComment(post._id)}
          handleDeletePost={handleDeletePost}
        />
      ))}
    </div>
  );
}

export default PostList; 