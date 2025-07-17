import { useState, useEffect } from 'react';
import { chatAPI, usersAPI } from '../services/api';
import io from 'socket.io-client';

export const useChat = (isLoggedIn) => {
  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Initialize Socket.IO connection when user logs in
  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem('token');
      if (token) {
        // Connect to Socket.IO server with authentication
        const socketInstance = io('http://localhost:5001', {
          auth: { token }
        });

        // Socket event handlers
        socketInstance.on('connect', () => {
          console.log('Connected to Socket.IO server');
        });

        socketInstance.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
        });

        socketInstance.on('message_received', (data) => {
          console.log('New message received:', data);
          // Add new message to current conversation
          if (currentConversation && data.message.conversationId === currentConversation._id) {
            setMessages(prev => [...prev, data.message]);
          }
        });

        setSocket(socketInstance);

        // Load conversations and users
        loadConversations();
        loadUsers();
      }
    } else {
      // Disconnect socket when user logs out
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [isLoggedIn]);

  const loadConversations = async () => {
    try {
      const data = await chatAPI.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await usersAPI.search('');
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    }
  };

  const createConversation = async (userId) => {
    try {
      const conversation = await chatAPI.createConversation(userId);
      setConversations(prev => [conversation, ...prev]);
      setCurrentConversation(conversation);
      setSelectedUser(null);
      loadMessages(conversation._id);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const data = await chatAPI.getMessages(conversationId);
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentConversation) return;

    try {
      const message = await chatAPI.sendMessage(currentConversation._id, newMessage);
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return {
    socket,
    conversations,
    currentConversation,
    setCurrentConversation,
    messages,
    newMessage,
    setNewMessage,
    users,
    selectedUser,
    setSelectedUser,
    createConversation,
    loadMessages,
    sendMessage,
    loadConversations,
    loadUsers
  };
}; 