import React from 'react';

function CreateGroupModal({
  showCreateGroup,
  onClose,
  newGroup,
  setNewGroup,
  handleCreateGroup,
  handleGroupCategoryChange,
  error,
  success
}) {
  if (!showCreateGroup) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Create New Group</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="modal-content">
          <form onSubmit={(e) => { e.preventDefault(); handleCreateGroup(); }}>
            <input
              type="text"
              placeholder="Group Name *"
              value={newGroup.name}
              onChange={(e) => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            <textarea
              placeholder="Group Description *"
              value={newGroup.description}
              onChange={(e) => setNewGroup(prev => ({ ...prev, description: e.target.value }))}
              required
            />
            <input
              type="text"
              placeholder="City *"
              value={newGroup.city}
              onChange={(e) => setNewGroup(prev => ({ ...prev, city: e.target.value }))}
              required
            />
            <select
              value={newGroup.region}
              onChange={(e) => setNewGroup(prev => ({ ...prev, region: e.target.value }))}
              required
            >
              <option value="">Select Region *</option>
              <option value="צפון">צפון</option>
              <option value="מרכז">מרכז</option>
              <option value="דרום">דרום</option>
              <option value="שפלה">שפלה</option>
            </select>
            <div className="group-categories">
              <label>
                <input
                  type="checkbox"
                  checked={newGroup.categories.isEvacuee}
                  onChange={() => handleGroupCategoryChange('isEvacuee')}
                /> Evacuees
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={newGroup.categories.isInjured}
                  onChange={() => handleGroupCategoryChange('isInjured')}
                /> Injured
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={newGroup.categories.isReservist}
                  onChange={() => handleGroupCategoryChange('isReservist')}
                /> Reservists
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={newGroup.categories.isRegularSoldier}
                  onChange={() => handleGroupCategoryChange('isRegularSoldier')}
                /> Regular Soldiers
              </label>
            </div>
            <div className="modal-actions">
              <button type="button" onClick={onClose}>Cancel</button>
              <button type="submit">Create Group</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateGroupModal; 