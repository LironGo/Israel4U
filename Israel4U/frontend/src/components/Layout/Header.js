import React from 'react';

function Header({ onShowCreateGroup, onShowFriends, onShowChat, onShowProfile, onLogout }) {
  return (
    <header className="header">
      <h1>Israel4U</h1>
      <nav>
        <button>Home</button>
        <button onClick={onShowCreateGroup}>Create Group</button>
        <button onClick={onShowFriends}>Friends</button>
        <button onClick={onShowChat}>Chat</button>
        <button onClick={onShowProfile}>Profile</button>
        <button onClick={onLogout}>Logout</button>
      </nav>
    </header>
  );
}

export default Header; 