import React from 'react';
import ChatSidebar from './ChatSidebar';
import ChatMessages from './ChatMessages';

function ChatOverlay({
  showChat,
  onClose,
  conversations,
  currentConversation,
  setCurrentConversation,
  users,
  selectedUser,
  setSelectedUser,
  createConversation,
  loadMessages,
  messages,
  newMessage,
  setNewMessage,
  sendMessage
}) {
  if (!showChat) return null;

  return (
    <div className="chat-container">
      <ChatSidebar
        onClose={onClose}
        conversations={conversations}
        currentConversation={currentConversation}
        setCurrentConversation={setCurrentConversation}
        users={users}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        createConversation={createConversation}
        loadMessages={loadMessages}
      />
      <ChatMessages
        currentConversation={currentConversation}
        messages={messages}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        sendMessage={sendMessage}
      />
    </div>
  );
}

export default ChatOverlay; 