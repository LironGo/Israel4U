import { useState } from 'react';

export const useForms = () => {
  // Login form
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  
  // Register form
  const [registerForm, setRegisterForm] = useState({
    email: '', password: '', fullName: '', phone: '', region: '', city: '',
    categories: { displaced: false, wounded: false, reservists: false, regularSoldiers: false }
  });

  // Post form
  const [newPost, setNewPost] = useState('');
  const [postType, setPostType] = useState('general');
  const [postLocation, setPostLocation] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [postCategories, setPostCategories] = useState({
    isEvacuee: false, isInjured: false, isReservist: false, isRegularSoldier: false
  });
  const [selectedGroups, setSelectedGroups] = useState([]);

  // Group form
  const [newGroup, setNewGroup] = useState({
    name: '', description: '', city: '', region: '', isPrivate: false,
    categories: { isEvacuee: false, isInjured: false, isReservist: false, isRegularSoldier: false }
  });

  // Profile form
  const [editProfile, setEditProfile] = useState({
    fullName: '', phone: '', region: '', city: '',
    categories: { isEvacuee: false, isInjured: false, isReservist: false, isRegularSoldier: false }
  });

  // Friends states
  const [friends, setFriends] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Form handlers
  const handleInputChange = (formType, field, value) => {
    if (formType === 'login') {
      setLoginForm(prev => ({ ...prev, [field]: value }));
    } else if (formType === 'register') {
      setRegisterForm(prev => ({ ...prev, [field]: value }));
    } else if (formType === 'profile') {
      setEditProfile(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleCategoryChange = (category) => {
    setRegisterForm(prev => ({
      ...prev,
      categories: { ...prev.categories, [category]: !prev.categories[category] }
    }));
  };

  const handlePostCategoryChange = (category) => {
    setPostCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const handleGroupCategoryChange = (category) => {
    setNewGroup(prev => ({
      ...prev,
      categories: { ...prev.categories, [category]: !prev.categories[category] }
    }));
  };

  const handleProfileCategoryChange = (category) => {
    setEditProfile(prev => ({
      ...prev,
      categories: { ...prev.categories, [category]: !prev.categories[category] }
    }));
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        return { error: 'Please select an image file' };
      }
      if (file.size > 5 * 1024 * 1024) {
        return { error: 'Image size must be less than 5MB' };
      }
      setSelectedImage(file);
      return { success: true };
    }
  };

  const resetPostForm = () => {
    setNewPost('');
    setPostType('general');
    setPostLocation('');
    setSelectedImage(null);
    setPostCategories({
      isEvacuee: false, isInjured: false, isReservist: false, isRegularSoldier: false
    });
  };

  const resetGroupForm = () => {
    setNewGroup({
      name: '', description: '', city: '', region: '', isPrivate: false,
      categories: { isEvacuee: false, isInjured: false, isReservist: false, isRegularSoldier: false }
    });
  };

  return {
    // Form states
    loginForm,
    registerForm,
    newPost,
    postType,
    postLocation,
    selectedImage,
    postCategories,
    selectedGroups,
    newGroup,
    editProfile,
    friends,
    searchResults,
    searchQuery,
    
    // Setters
    setLoginForm,
    setRegisterForm,
    setNewPost,
    setPostType,
    setPostLocation,
    setSelectedImage,
    setPostCategories,
    setNewGroup,
    setEditProfile,
    setFriends,
    setSearchResults,
    setSearchQuery,
    setSelectedGroups,
    
    // Handlers
    handleInputChange,
    handleCategoryChange,
    handlePostCategoryChange,
    handleGroupCategoryChange,
    handleProfileCategoryChange,
    handleImageSelect,
    resetPostForm,
    resetGroupForm
  };
}; 