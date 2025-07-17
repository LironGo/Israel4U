const API_BASE_URL = 'http://localhost:5001/api';

// Helper function to get auth headers
const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

// Auth API calls
export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return response.json();
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    return response.json();
  }
};

// Posts API calls
export const postsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  create: async (postData) => {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(postData)
    });
    return response.json();
  },

  search: async (query) => {
    const response = await fetch(`${API_BASE_URL}/posts/search?q=${query}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  save: async (postId) => {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/save`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return response.json();
  },
  getSaved: async () => {
    const response = await fetch(`${API_BASE_URL}/posts/saved`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  delete: async (postId) => {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return response.json();
  }
};

// Comments API calls
export const commentsAPI = {
  getByPost: async (postId) => {
    const response = await fetch(`${API_BASE_URL}/comments/${postId}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  create: async (commentData) => {
    const response = await fetch(`${API_BASE_URL}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(commentData)
    });
    return response.json();
  }
};

// Likes API calls
export const likesAPI = {
  toggle: async (postId) => {
    const response = await fetch(`${API_BASE_URL}/likes/${postId}`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return response.json();
  }
};

// Groups API calls
export const groupsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/groups`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  create: async (groupData) => {
    const response = await fetch(`${API_BASE_URL}/groups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(groupData)
    });
    return response.json();
  },

  update: async (groupId, groupData) => {
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(groupData)
    });
    return response.json();
  },

  joinGroup: async (groupId) => {
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}/join`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return response.json();
  },

  getManagedJoinRequests: async () => {
    const response = await fetch(`${API_BASE_URL}/groups/managed/join-requests`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  handleJoinRequest: async (groupId, requestId, status) => {
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}/requests/${requestId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ status })
    });
    return response.json();
  }
};

// Users API calls
export const usersAPI = {
  search: async (query) => {
    const response = await fetch(`${API_BASE_URL}/users/search?q=${query}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  updateProfile: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(profileData)
    });
    return response.json();
  },

  addFriend: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/friends/${userId}`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return response.json();
  },

  removeFriend: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/friends/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return response.json();
  },

  deleteAccount: async () => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return response.json();
  }
};

// Chat API calls
export const chatAPI = {
  getConversations: async () => {
    const response = await fetch(`${API_BASE_URL}/chats`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  getMessages: async (conversationId) => {
    const response = await fetch(`${API_BASE_URL}/chats/${conversationId}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  createConversation: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/chats/user/${userId}`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return response.json();
  },

  sendMessage: async (conversationId, content) => {
    const response = await fetch(`${API_BASE_URL}/chats/${conversationId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ content })
    });
    return response.json();
  }
};

// Upload API calls
export const uploadAPI = {
  uploadImage: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    });
    return response.json();
  }
};

// Stats API calls
export const statsAPI = {
  getPostsPerMonth: async () => {
    const response = await fetch(`${API_BASE_URL}/stats/posts-per-month`, {
      headers: getAuthHeaders()
    });
    return response.json();
  }
}; 