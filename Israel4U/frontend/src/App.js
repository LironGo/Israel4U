import React, { useState, useEffect } from 'react';
import './App.css';

// Custom hooks
import { useAuth } from './hooks/useAuth';
import { usePosts } from './hooks/usePosts';
import { useChat } from './hooks/useChat';
import { useForms } from './hooks/useForms';
import { useModals } from './hooks/useModals';

// Services
import { groupsAPI, usersAPI } from './services/api';

// Components
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import MainContent from './components/Layout/MainContent';
import SearchBox from './components/Search/SearchBox';
import NewPostForm from './components/Posts/NewPostForm';
import PostList from './components/Posts/PostList';
import CreateGroupModal from './components/Groups/CreateGroupModal';
import FriendsModal from './components/Friends/FriendsModal';
import ProfileModal from './components/Profile/ProfileModal';
import ChatOverlay from './components/Chat/ChatOverlay';
import VideoSection from './components/Media/VideoSection';
import CanvasSection from './components/Media/CanvasSection';
import D3Chart from './components/Media/D3Chart';
import GroupsFilters from './components/Groups/GroupsFilters';
import GroupsList from './components/Groups/GroupsList';
import EditGroupModal from './components/Groups/EditGroupModal';

function GroupPostsPage({ group, onBack }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (group) {
      setLoading(true);
      setError('');
      fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api'}/groups/${group._id}/posts`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(data => {
          setPosts(data);
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to load posts');
          setLoading(false);
        });
    }
  }, [group]);

  if (!group) return null;

  return (
    <div className="group-posts-page">
      <button onClick={onBack} style={{ marginBottom: 16 }}>← Back to Groups</button>
      <h2>Posts in {group.name}</h2>
      {loading ? <p>Loading...</p> : error ? <p style={{ color: 'red' }}>{error}</p> : (
        <PostList posts={posts} handleLikePost={() => {}} handleSavePost={() => {}} showComments={{}} toggleComments={() => {}} comments={{}} newComment={{}} setNewComment={() => {}} handleCreateComment={() => {}} handleDeletePost={() => {}} />
      )}
    </div>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [sidebarSection, setSidebarSection] = useState('home'); // 'home', 'notifications', 'groups', 'saved'
  const [groups, setGroups] = useState([]);
  const [groupFilters, setGroupFilters] = useState({
    onlyMember: false,
    onlyOwner: false,
    region: '',
    city: '',
    isEvacuee: false,
    isInjured: false,
    isReservist: false,
    isRegularSoldier: false,
  });
  const [editGroup, setEditGroup] = useState(null); // group being edited or null
  const [showEditGroup, setShowEditGroup] = useState(false);
  const [editGroupError, setEditGroupError] = useState('');
  const [editGroupSuccess, setEditGroupSuccess] = useState('');
  const [joinRequests, setJoinRequests] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Custom hooks
  const auth = useAuth();
  const posts = usePosts(auth.isLoggedIn);
  const chat = useChat(auth.isLoggedIn);
  const forms = useForms();
  const modals = useModals();

  // Load friends list when Friends modal is opened
  useEffect(() => {
    if (modals.showFriends) {
      (async () => {
        const profile = await usersAPI.getProfile();
        forms.setFriends(profile.friends || []);
      })();
    }
  }, [modals.showFriends]);

  // Fetch groups when user logs in or sidebarSection changes to 'groups'
  useEffect(() => {
    if (auth.isLoggedIn) {
      groupsAPI.getAll().then(setGroups).catch(() => setGroups([]));
    }
  }, [auth.isLoggedIn]);
  useEffect(() => {
    if (sidebarSection === 'groups') {
      groupsAPI.getAll().then(setGroups).catch(() => setGroups([]));
    }
  }, [sidebarSection]);

  // Fetch saved posts when sidebarSection changes to 'saved'
  useEffect(() => {
    if (sidebarSection === 'saved' && auth.isLoggedIn) {
      posts.loadSavedPosts();
    }
  }, [sidebarSection, auth.isLoggedIn]);

  // Fetch join requests for managed groups when notifications are shown
  useEffect(() => {
    if (sidebarSection === 'notifications' && auth.userProfile?.isGroupManager) {
      groupsAPI.getManagedJoinRequests().then(setJoinRequests).catch(() => setJoinRequests([]));
    }
  }, [sidebarSection, auth.userProfile]);

  // Clear notifications when switching to login or register page
  useEffect(() => {
    if (!auth.isLoggedIn && (currentPage === 'login' || currentPage === 'register')) {
      auth.clearMessages();
    }
  }, [currentPage, auth.isLoggedIn]);

  // Sidebar section handlers
  const handleShowNotifications = () => setSidebarSection('notifications');
  const handleShowGroups = () => setSidebarSection('groups');
  const handleShowSaved = () => setSidebarSection('saved');
  const handleShowHome = () => setSidebarSection('home');

  // --- Add this handler for opening the profile modal with pre-filled data ---
  const handleShowProfile = () => {
    if (auth.userProfile) {
      // Map userProfile to editProfile structure, using top-level booleans
      forms.setEditProfile({
        fullName: auth.userProfile.fullName || '',
        phone: auth.userProfile.phone || '',
        region: auth.userProfile.region || '',
        city: auth.userProfile.city || '',
        categories: {
          isEvacuee: auth.userProfile.isEvacuee || false,
          isInjured: auth.userProfile.isInjured || false,
          isReservist: auth.userProfile.isReservist || false,
          isRegularSoldier: auth.userProfile.isRegularSoldier || false
        }
      });
    }
    modals.openProfile();
  };

  // Action handlers
  const handleCreatePost = async () => {
    if (!forms.newPost.trim()) return;
    const groupIds = forms.selectedGroups.filter(Boolean);
    const result = await posts.createPost({
      content: forms.newPost,
      postType: forms.postType,
      location: forms.postLocation,
      ...forms.postCategories,
      groupIds
    }, forms.selectedImage);
    if (result.success) {
      forms.resetPostForm();
      forms.setSelectedGroups([]);
      auth.setSuccess('Post created successfully!');
    } else {
      auth.setError(result.error);
    }
  };

  const handleDeletePost = async (postId) => {
    const result = await posts.deletePost(postId);
    if (result.success) {
      auth.setSuccess('Post deleted successfully!');
    } else {
      auth.setError(result.error);
    }
  };

  const handleCreateGroup = async () => {
    if (!forms.newGroup.name.trim() || !forms.newGroup.description.trim()) {
      auth.setError('Please fill in all required fields');
      return;
    }

    try {
      await groupsAPI.create({
        name: forms.newGroup.name,
        description: forms.newGroup.description,
        city: forms.newGroup.city,
        region: forms.newGroup.region,
        isPrivate: forms.newGroup.isPrivate,
        ...forms.newGroup.categories
      });

      forms.resetGroupForm();
      modals.closeCreateGroup();
      auth.setSuccess('Group created successfully!');
    } catch (error) {
      auth.setError('Failed to create group');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      // 1. Update the profile
      await usersAPI.updateProfile({
        fullName: forms.editProfile.fullName,
        phone: forms.editProfile.phone,
        region: forms.editProfile.region,
        city: forms.editProfile.city,
        ...forms.editProfile.categories
      });
      // 2. Fetch the latest profile from the backend
      await auth.loadUserProfile();
      // 3. Map the new profile to the modal form state
      const newProfile = auth.userProfile;
      if (newProfile) {
        forms.setEditProfile({
          fullName: newProfile.fullName || '',
          phone: newProfile.phone || '',
          region: newProfile.region || '',
          city: newProfile.city || '',
          categories: {
            isEvacuee: newProfile.isEvacuee || false,
            isInjured: newProfile.isInjured || false,
            isReservist: newProfile.isReservist || false,
            isRegularSoldier: newProfile.isRegularSoldier || false
          }
        });
      }
      // 4. Show success message
      auth.setSuccess('Profile updated successfully!');
    } catch (error) {
      auth.setError('Failed to update profile');
    }
  };

  const handleAddFriend = async (userId) => {
    try {
      await usersAPI.addFriend(userId);
      auth.setSuccess('Friend added successfully!');
      // Refresh friends list
      const profile = await usersAPI.getProfile();
      forms.setFriends(profile.friends || []);
    } catch (error) {
      auth.setError('Failed to add friend');
    }
  };

  const handleRemoveFriend = async (userId) => {
    try {
      await usersAPI.removeFriend(userId);
      auth.setSuccess('Friend removed successfully!');
      // Refresh friends list
      const profile = await usersAPI.getProfile();
      forms.setFriends(profile.friends || []);
    } catch (error) {
      auth.setError('Failed to remove friend');
    }
  };

  const searchUsers = async (query) => {
    if (query.length < 1) {
      forms.setSearchResults([]);
      return;
    }
    try {
      const data = await usersAPI.search(query);
      forms.setSearchResults(data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleLikePost = async (postId) => {
    await posts.likePost(postId);
  };

  const handleSavePost = async (postId) => {
    const result = await posts.savePost(postId);
    if (result.success) {
      auth.setSuccess(result.message);
    } else {
      auth.setError(result.error);
    }
  };

  const handleCreateComment = async (postId) => {
    const result = await posts.createComment(postId);
    if (!result.success) {
      auth.setError(result.error);
    }
  };

  const handleImageSelect = (event) => {
    const result = forms.handleImageSelect(event);
    if (result?.error) {
      auth.setError(result.error);
    }
  };

  const handleEditGroup = (group) => {
    setEditGroup({
      _id: group._id,
      name: group.name || '',
      description: group.description || '',
      city: group.city || '',
      region: group.region || '',
      categories: {
        isEvacuee: group.isEvacuee || false,
        isInjured: group.isInjured || false,
        isReservist: group.isReservist || false,
        isRegularSoldier: group.isRegularSoldier || false
      }
    });
    setEditGroupError('');
    setEditGroupSuccess('');
    setShowEditGroup(true);
  };

  const handleEditGroupCategoryChange = (cat) => {
    setEditGroup(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [cat]: !prev.categories[cat]
      }
    }));
  };

  const handleUpdateGroup = async () => {
    if (!editGroup.name.trim() || !editGroup.description.trim()) {
      setEditGroupError('Please fill in all required fields');
      return;
    }
    try {
      await groupsAPI.update(editGroup._id, {
        name: editGroup.name,
        description: editGroup.description,
        city: editGroup.city,
        region: editGroup.region,
        isEvacuee: editGroup.categories.isEvacuee,
        isInjured: editGroup.categories.isInjured,
        isReservist: editGroup.categories.isReservist,
        isRegularSoldier: editGroup.categories.isRegularSoldier
      });
      setEditGroupSuccess('Group updated successfully!');
      setEditGroupError('');
      setTimeout(() => {
        setShowEditGroup(false);
        setEditGroup(null);
        setEditGroupSuccess('');
        // Refresh groups list
        groupsAPI.getAll().then(setGroups).catch(() => setGroups([]));
      }, 1000);
    } catch (error) {
      setEditGroupError('Failed to update group');
      setEditGroupSuccess('');
    }
  };

  // Join group handler
  const handleJoinGroup = async (group) => {
    try {
      await groupsAPI.joinGroup(group._id);
      // Refresh groups list
      groupsAPI.getAll().then(setGroups).catch(() => setGroups([]));
      auth.setSuccess('Join request sent!');
    } catch (error) {
      auth.setError('Failed to send join request');
    }
  };

  // Helper: get all unique regions from groups
  const allRegions = Array.from(new Set(groups.map(g => g.region).filter(Boolean)));

  // Filtering logic
  const userId = auth.userProfile?._id;
  let filteredGroups = groups;
  if (groupFilters.onlyMember && userId) {
    filteredGroups = filteredGroups.filter(group =>
      Array.isArray(group.members) && group.members.some(member => {
        if (typeof member === 'string') return member === userId;
        if (typeof member === 'object' && member !== null) return member._id === userId;
        return false;
      })
    );
  }
  if (groupFilters.onlyOwner && userId) {
    filteredGroups = filteredGroups.filter(group => {
      if (typeof group.manager === 'string') return group.manager === userId;
      if (typeof group.manager === 'object' && group.manager !== null) return group.manager._id === userId;
      return false;
    });
  }
  if (groupFilters.region) {
    filteredGroups = filteredGroups.filter(group => group.region === groupFilters.region);
  }
  if (groupFilters.city) {
    filteredGroups = filteredGroups.filter(group => group.city && group.city.toLowerCase().includes(groupFilters.city.toLowerCase()));
  }
  // User type filters
  ['isEvacuee', 'isInjured', 'isReservist', 'isRegularSoldier'].forEach(type => {
    if (groupFilters[type]) {
      filteredGroups = filteredGroups.filter(group => group[type]);
    }
  });

  const handleJoinRequestAction = async (groupId, requestId, status) => {
    // Optimistically remove the request from UI
    setJoinRequests(prev => prev.filter(req => req.requestId !== requestId));
    try {
      await groupsAPI.handleJoinRequest(groupId, requestId, status);
      // Refresh join requests from backend (in case of race conditions)
      groupsAPI.getManagedJoinRequests().then(setJoinRequests).catch(() => setJoinRequests([]));
      auth.setSuccess(`Join request ${status}`);
      // Refresh groups list everywhere
      groupsAPI.getAll().then(setGroups).catch(() => setGroups([]));
    } catch (error) {
      auth.setError('Failed to update join request');
      // Optionally, re-add the request if backend fails
      groupsAPI.getManagedJoinRequests().then(setJoinRequests).catch(() => setJoinRequests([]));
    }
  };

  const handleOpenGroup = (group) => {
    setSelectedGroup(group);
  };
  const handleBackToGroups = () => {
    setSelectedGroup(null);
  };

  const renderFeedContent = () => {
    if (selectedGroup) {
      return <GroupPostsPage group={selectedGroup} onBack={handleBackToGroups} />;
    }
    switch (sidebarSection) {
      case 'notifications':
        return (
          <div className="feed">
            <h2>Notifications</h2>
            {auth.userProfile?.isGroupManager && joinRequests.length > 0 ? (
              <div>
                <h3>Group Join Requests</h3>
                {joinRequests.map(req => (
                  <div key={req.requestId} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, marginBottom: 12 }}>
                    <div><strong>{req.user.fullName}</strong> wants to join <strong>{req.groupName}</strong></div>
                    <div style={{ fontSize: 12, color: '#666' }}>Requested on: {new Date(req.requestDate).toLocaleString()}</div>
                    <button style={{ marginRight: 8 }} onClick={() => handleJoinRequestAction(req.groupId, req.requestId, 'approved')}>Accept</button>
                    <button onClick={() => handleJoinRequestAction(req.groupId, req.requestId, 'rejected')}>Reject</button>
                  </div>
                ))}
              </div>
            ) : (
              <p>(No notifications yet)</p>
            )}
          </div>
        );
      case 'groups':
        return (
          <div className="feed">
            <h2>Groups</h2>
            <GroupsFilters
              filters={groupFilters}
              onChange={setGroupFilters}
              regions={allRegions}
            />
            <GroupsList groups={filteredGroups} userId={userId} onEditGroup={handleEditGroup} onJoinGroup={handleJoinGroup} onOpenGroup={handleOpenGroup} />
          </div>
        );
      case 'saved':
        return (
          <div className="feed">
            <h2>Saved Posts</h2>
            <PostList
              posts={posts.savedPosts}
              handleLikePost={handleLikePost}
              handleSavePost={handleSavePost}
              showComments={posts.showComments}
              toggleComments={posts.toggleComments}
              comments={posts.comments}
              newComment={posts.newComment}
              setNewComment={posts.setNewComment}
              handleCreateComment={handleCreateComment}
              handleDeletePost={handleDeletePost}
            />
          </div>
        );
      default:
        return (
          <div className="feed">
            <SearchBox />
            <NewPostForm
              newPost={forms.newPost}
              setNewPost={forms.setNewPost}
              postType={forms.postType}
              setPostType={forms.setPostType}
              postLocation={forms.postLocation}
              setPostLocation={forms.setPostLocation}
              selectedImage={forms.selectedImage}
              handleImageSelect={handleImageSelect}
              setSelectedImage={forms.setSelectedImage}
              postCategories={forms.postCategories}
              handlePostCategoryChange={forms.handlePostCategoryChange}
              handleCreatePost={handleCreatePost}
              error={auth.error}
              success={auth.success}
              groups={groups.filter(g => Array.isArray(g.members) && g.members.some(m => (typeof m === 'string' ? m === userId : m?._id === userId)))}
              selectedGroups={forms.selectedGroups}
              setSelectedGroups={forms.setSelectedGroups}
            />
            <PostList
              posts={posts.posts}
              handleLikePost={handleLikePost}
              handleSavePost={handleSavePost}
              showComments={posts.showComments}
              toggleComments={posts.toggleComments}
              comments={posts.comments}
              newComment={posts.newComment}
              setNewComment={posts.setNewComment}
              handleCreateComment={handleCreateComment}
              handleDeletePost={handleDeletePost}
            />
          </div>
        );
    }
  };

  const renderHomePage = () => (
    <div className="home-container">
      <Header
        onShowCreateGroup={modals.openCreateGroup}
        onShowFriends={modals.openFriends}
        onShowChat={modals.openChat}
        onShowProfile={handleShowProfile}
        onLogout={auth.logout}
      />
      {/* Notification bar at the top of the home page */}
      {(auth.error || auth.success) && (
        <div className={`notification-bar ${auth.error ? 'error' : 'success'}`}>
          {auth.error || auth.success}
        </div>
      )}
      <MainContent>
        <Sidebar
          userProfile={auth.userProfile}
          onShowChat={modals.openChat}
          onLogout={auth.logout}
          onShowNotifications={handleShowNotifications}
          onShowGroups={handleShowGroups}
          onShowSaved={handleShowSaved}
          onShowHome={handleShowHome}
        />
        {renderFeedContent()}
      </MainContent>
      
      <VideoSection />
      <div className="stats-canvas-row">
        <D3Chart isLoggedIn={auth.isLoggedIn} posts={posts.posts} />
        <CanvasSection isLoggedIn={auth.isLoggedIn} />
      </div>
      
      <ChatOverlay
        showChat={modals.showChat}
        onClose={modals.closeChat}
        conversations={chat.conversations}
        currentConversation={chat.currentConversation}
        setCurrentConversation={chat.setCurrentConversation}
        users={chat.users}
        selectedUser={chat.selectedUser}
        setSelectedUser={chat.setSelectedUser}
        createConversation={chat.createConversation}
        loadMessages={chat.loadMessages}
        messages={chat.messages}
        newMessage={chat.newMessage}
        setNewMessage={chat.setNewMessage}
        sendMessage={chat.sendMessage}
      />
      
      <CreateGroupModal
        showCreateGroup={modals.showCreateGroup}
        onClose={modals.closeCreateGroup}
        newGroup={forms.newGroup}
        setNewGroup={forms.setNewGroup}
        handleCreateGroup={handleCreateGroup}
        handleGroupCategoryChange={forms.handleGroupCategoryChange}
      />
      
      <FriendsModal
        showFriends={modals.showFriends}
        setShowFriends={modals.setShowFriends}
        friends={forms.friends}
        searchResults={forms.searchResults}
        searchQuery={forms.searchQuery}
        setSearchQuery={forms.setSearchQuery}
        searchUsers={searchUsers}
        handleAddFriend={handleAddFriend}
        handleRemoveFriend={handleRemoveFriend}
      />
      
      <ProfileModal
        showProfile={modals.showProfile}
        setShowProfile={modals.setShowProfile}
        editProfile={forms.editProfile}
        handleInputChange={forms.handleInputChange}
        handleProfileCategoryChange={forms.handleProfileCategoryChange}
        handleUpdateProfile={handleUpdateProfile}
        error={auth.error}
        success={auth.success}
        onDeleteAccount={handleDeleteAccount}
      />

      <EditGroupModal
        showEditGroup={showEditGroup}
        onClose={() => setShowEditGroup(false)}
        editGroup={editGroup}
        setEditGroup={setEditGroup}
        handleUpdateGroup={handleUpdateGroup}
        handleGroupCategoryChange={handleEditGroupCategoryChange}
        error={editGroupError}
        success={editGroupSuccess}
      />
    </div>
  );

  // Add this handler for account deletion
  const handleDeleteAccount = async () => {
    try {
      await usersAPI.deleteAccount();
      auth.setSuccess('Account deleted successfully.');
      setTimeout(() => {
        auth.logout();
        setCurrentPage('login');
        modals.setShowProfile(false);
      }, 1500);
    } catch (error) {
      auth.setError('Failed to delete account.');
    }
  };

  return (
    <div className="App">
      {!auth.isLoggedIn && currentPage === 'login' && (
        <LoginForm
          loginForm={forms.loginForm}
          onInputChange={(field, value) => forms.handleInputChange('login', field, value)}
          onSubmit={(e) => { e.preventDefault(); auth.login(forms.loginForm); }}
          loading={auth.loading}
          error={auth.error}
          success={auth.success}
          switchToRegister={() => setCurrentPage('register')}
        />
      )}
      {!auth.isLoggedIn && currentPage === 'register' && (
        <RegisterForm
          registerForm={forms.registerForm}
          onInputChange={(field, value) => forms.handleInputChange('register', field, value)}
          onCategoryChange={forms.handleCategoryChange}
          onSubmit={(e) => { e.preventDefault(); auth.register(forms.registerForm); }}
          loading={auth.loading}
          error={auth.error}
          success={auth.success}
          switchToLogin={() => setCurrentPage('login')}
        />
      )}
      {auth.isLoggedIn && renderHomePage()}
    </div>
  );
}

export default App;
