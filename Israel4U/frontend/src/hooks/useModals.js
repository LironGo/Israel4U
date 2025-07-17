import { useState } from 'react';

export const useModals = () => {
  const [showChat, setShowChat] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const openChat = () => setShowChat(true);
  const closeChat = () => setShowChat(false);
  
  const openCreateGroup = () => setShowCreateGroup(true);
  const closeCreateGroup = () => setShowCreateGroup(false);
  
  const openFriends = () => setShowFriends(true);
  const closeFriends = () => setShowFriends(false);
  
  const openProfile = () => setShowProfile(true);
  const closeProfile = () => setShowProfile(false);

  return {
    showChat,
    showCreateGroup,
    showFriends,
    showProfile,
    openChat,
    closeChat,
    openCreateGroup,
    closeCreateGroup,
    openFriends,
    closeFriends,
    openProfile,
    closeProfile,
    setShowProfile,
    setShowFriends, // <-- Added to fix runtime error
    setShowChat, // <-- Added for consistency
    setShowCreateGroup // <-- Added for consistency
  };
}; 