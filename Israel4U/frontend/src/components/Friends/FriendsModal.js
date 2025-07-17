import React from 'react';

function FriendsModal({
  showFriends,
  setShowFriends,
  friends,
  searchResults,
  searchQuery,
  setSearchQuery,
  searchUsers,
  handleAddFriend,
  handleRemoveFriend,
  error,
  success
}) {
  if (!showFriends) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Friends Management</h3>
          <button onClick={() => setShowFriends(false)}>✕</button>
        </div>
        <div className="modal-content">
          
          {/* Search for new friends */}
          <div className="friend-search">
            <h4>Add New Friends</h4>
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                searchUsers(e.target.value);
              }}
            />
            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map(user => {
                  const isFriend = friends.some(f => f._id === user._id);
                  return (
                    <div key={user._id} className="search-result-item">
                      <div className="user-info">
                        <span className="user-name">{user.fullName}</span>
                        <span className="user-email">{user.email}</span>
                      </div>
                      {isFriend ? (
                        <button
                          onClick={() => handleRemoveFriend(user._id)}
                          className="remove-friend-btn"
                        >
                          Remove Friend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAddFriend(user._id)}
                          className="add-friend-btn"
                        >
                          Add Friend
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Current friends list */}
          <div className="friends-list">
            <h4>Your Friends ({friends.length})</h4>
            {friends.length === 0 ? (
              <p>No friends yet. Search for users to add friends!</p>
            ) : (
              friends.map(friend => (
                <div key={friend._id} className="friend-item">
                  <div className="friend-info">
                    <span className="friend-name">{friend.fullName}</span>
                    <span className="friend-email">{friend.email}</span>
                  </div>
                  <button 
                    onClick={() => handleRemoveFriend(friend._id)}
                    className="remove-friend-btn"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FriendsModal; 