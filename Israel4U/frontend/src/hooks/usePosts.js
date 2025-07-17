import { useState, useEffect } from 'react';
import { postsAPI, commentsAPI, likesAPI, uploadAPI } from '../services/api';

export const usePosts = (isLoggedIn) => {
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [showComments, setShowComments] = useState({});
  const [newComment, setNewComment] = useState({});

  // Load posts when user logs in
  useEffect(() => {
    if (isLoggedIn) {
      loadPosts();
    }
  }, [isLoggedIn]);

  const loadPosts = async () => {
    try {
      const data = await postsAPI.getAll();
      setPosts(data);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const createPost = async (postData, selectedImage) => {
    try {
      // Upload image if selected
      let imageUrl = null;
      if (selectedImage) {
        const uploadResult = await uploadAPI.uploadImage(selectedImage);
        imageUrl = uploadResult.imageUrl;
      }

      await postsAPI.create({
        ...postData,
        images: imageUrl ? [imageUrl] : []
      });

      await loadPosts(); // Refresh posts from backend after creating a post
      return { success: true };
    } catch (error) {
      console.error('Error creating post:', error);
      return { success: false, error: 'Failed to create post' };
    }
  };

  const likePost = async (postId) => {
    try {
      const result = await likesAPI.toggle(postId);
      setPosts(prev => prev.map(post => 
        post._id === postId 
          ? { ...post, likeCount: result.likeCount }
          : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const savePost = async (postId) => {
    try {
      const result = await postsAPI.save(postId);
      await loadPosts(); // Refresh posts after saving/unsaving
      return { success: true, message: result.message };
    } catch (error) {
      console.error('Error saving post:', error);
      return { success: false, error: 'Failed to save post' };
    }
  };

  const loadComments = async (postId) => {
    try {
      const data = await commentsAPI.getByPost(postId);
      setComments(prev => ({
        ...prev,
        [postId]: data
      }));
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const createComment = async (postId) => {
    const commentText = newComment[postId];
    if (!commentText || !commentText.trim()) return;

    try {
      const comment = await commentsAPI.create({
        postId: postId,
        content: commentText
      });

      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), comment]
      }));

      setNewComment(prev => ({
        ...prev,
        [postId]: ''
      }));

      // Update post comment count
      setPosts(prev => prev.map(post => 
        post._id === postId 
          ? { ...post, commentCount: (post.commentCount || 0) + 1 }
          : post
      ));

      return { success: true };
    } catch (error) {
      console.error('Error creating comment:', error);
      return { success: false, error: 'Failed to create comment' };
    }
  };

  const toggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
    
    // Load comments if not already loaded
    if (!comments[postId]) {
      loadComments(postId);
    }
  };

  const loadSavedPosts = async () => {
    try {
      const data = await postsAPI.getSaved();
      setSavedPosts(data);
    } catch (error) {
      console.error('Error loading saved posts:', error);
    }
  };

  const deletePost = async (postId) => {
    try {
      await postsAPI.delete(postId);
      setPosts(prev => prev.filter(post => post._id !== postId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting post:', error);
      return { success: false, error: 'Failed to delete post' };
    }
  };

  return {
    posts,
    savedPosts,
    comments,
    showComments,
    newComment,
    setNewComment,
    createPost,
    likePost,
    savePost,
    createComment,
    toggleComments,
    loadPosts,
    loadSavedPosts,
    deletePost
  };
}; 