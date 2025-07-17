import React from 'react';

function Sidebar({ userProfile, onShowChat, onLogout, onShowNotifications, onShowGroups, onShowSaved, onShowHome }) {
  return (
    <div className="sidebar">
      <div className="user-profile">
        <div className="profile-pic">👤</div>
        <h3>{userProfile?.fullName || 'User Name'}</h3>
      </div>
      <nav className="sidebar-nav">
        <button onClick={onShowHome}>🏠 Home</button>
        <button onClick={onShowNotifications}>🔔 Notifications</button>
        <button onClick={onShowGroups}>👥 Groups</button>
        <button onClick={onShowChat}>💬 Chats</button>
        <button onClick={onShowSaved}>🔖 Saved</button>
        <button onClick={onLogout}>🚪 Logout</button>
      </nav>
    </div>
  );
}

export default Sidebar; 