import React from 'react';

function NewPostForm({
  newPost,
  setNewPost,
  postType,
  setPostType,
  postLocation,
  setPostLocation,
  selectedImage,
  handleImageSelect,
  setSelectedImage,
  postCategories,
  handlePostCategoryChange,
  handleCreatePost,
  error,
  success,
  groups,
  selectedGroups,
  setSelectedGroups
}) {
  // Helper for toggling group selection
  const handleGroupCheck = (groupId) => {
    if (selectedGroups.includes(groupId)) {
      setSelectedGroups(selectedGroups.filter(id => id !== groupId));
    } else {
      setSelectedGroups([...selectedGroups, groupId]);
    }
  };
  // Helper for 'Everyone' checkbox
  const handleEveryoneCheck = () => {
    setSelectedGroups([]);
  };

  return (
    <div className="new-post">
      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}
      <textarea 
        placeholder="What's happening? Share your thoughts..." 
        value={newPost}
        onChange={e => setNewPost(e.target.value)}
      />
      <div className="post-options">
        <select 
          value={postType} 
          onChange={e => setPostType(e.target.value)}
        >
          <option value="general">General</option>
          <option value="help_request">Help Request</option>
          <option value="support_offer">Support Offer</option>
          <option value="emergency">Emergency</option>
        </select>
        <input 
          type="text" 
          placeholder="Location (optional)" 
          value={postLocation}
          onChange={e => setPostLocation(e.target.value)}
        />
        <div className="post-categories">
          <label>
            <input 
              type="checkbox" 
              checked={postCategories.isEvacuee}
              onChange={() => handlePostCategoryChange('isEvacuee')}
            /> Evacuees
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={postCategories.isInjured}
              onChange={() => handlePostCategoryChange('isInjured')}
            /> Injured
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={postCategories.isReservist}
              onChange={() => handlePostCategoryChange('isReservist')}
            /> Reservists
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={postCategories.isRegularSoldier}
              onChange={() => handlePostCategoryChange('isRegularSoldier')}
            /> Regular Soldiers
          </label>
        </div>
        <div className="post-groups-select" style={{ marginTop: 8, position: 'relative', padding: 12, border: '1px solid #eee', borderRadius: 8, minWidth: 180, maxHeight: 180, overflowY: 'auto' }}>
          <span style={{ position: 'absolute', top: 8, left: 12, fontWeight: 'bold' }}>Groups</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 24 }}>
            <label key="everyone">
              <input
                type="checkbox"
                checked={selectedGroups.length === 0}
                onChange={handleEveryoneCheck}
              />
              Everyone (default)
            </label>
            {groups && groups.map(group => (
              <label key={group._id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input
                  type="checkbox"
                  checked={selectedGroups.includes(group._id)}
                  onChange={() => handleGroupCheck(group._id)}
                  disabled={false}
                />
                {group.name}
              </label>
            ))}
          </div>
        </div>
      </div>
      <button onClick={handleCreatePost}>Post</button>
    </div>
  );
}

export default NewPostForm; 