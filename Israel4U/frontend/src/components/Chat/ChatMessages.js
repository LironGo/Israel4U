import React from 'react';

function ChatMessages({
  currentConversation,
  messages,
  newMessage,
  setNewMessage,
  sendMessage
}) {
  return (
    <div className="chat-messages">
      {currentConversation ? (
        <>
          <div className="messages-header">
            <h3>
              {currentConversation.participants.find(
                p => p._id !== localStorage.getItem('userId')
              )?.fullName || 'Chat'}
            </h3>
          </div>
          
          <div className="messages-container">
            {messages.map(message => (
              <div 
                key={message._id}
                className={`message ${message.sender._id === localStorage.getItem('userId') ? 'sent' : 'received'}`}
              >
                <div className="message-content">{message.content}</div>
                <div className="message-time">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>

          <div className="message-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </>
      ) : (
        <div className="no-conversation">
          <h3>Select a conversation to start chatting</h3>
        </div>
      )}
    </div>
  );
}

export default ChatMessages; 