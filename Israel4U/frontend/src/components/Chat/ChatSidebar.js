import React from 'react';

function ChatSidebar({
  onClose,
  conversations,
  currentConversation,
  setCurrentConversation,
  users,
  selectedUser,
  setSelectedUser,
  createConversation,
  loadMessages
}) {
  return (
    <div className="chat-sidebar">
      <div className="chat-header">
        <h3>💬 Messages</h3>
        <button onClick={onClose}>✕</button>
      </div>
      
      {/* New Conversation */}
      <div className="new-conversation">
        <h4>Start New Chat</h4>
        <select 
          value={selectedUser || ''} 
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">Select a user...</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>
              {user.fullName}
            </option>
          ))}
        </select>
        {selectedUser && (
          <button onClick={() => createConversation(selectedUser)}>
            Start Chat
          </button>
        )}
      </div>

      {/* Conversations List */}
      <div className="conversations-list">
        <h4>Recent Conversations</h4>
        {conversations.map(conversation => {
          const otherUser = conversation.participants.find(
            p => p._id !== localStorage.getItem('userId')
          );
          return (
            <div 
              key={conversation._id}
              className={`conversation-item ${currentConversation?._id === conversation._id ? 'active' : ''}`}
              onClick={() => {
                setCurrentConversation(conversation);
                loadMessages(conversation._id);
              }}
            >
              <div className="conversation-avatar">👤</div>
              <div className="conversation-info">
                <div className="conversation-name">{otherUser?.fullName || 'Unknown User'}</div>
                <div className="conversation-preview">
                  {conversation.lastMessage?.content || 'No messages yet'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChatSidebar; 