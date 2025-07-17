import React from 'react';

function EditGroupModal({
  showEditGroup,
  onClose,
  editGroup,
  setEditGroup,
  handleUpdateGroup,
  handleGroupCategoryChange,
  error,
  success
}) {
  if (!showEditGroup || !editGroup) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Edit Group</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="modal-content">
          <form onSubmit={(e) => { e.preventDefault(); handleUpdateGroup(); }}>
            <input
              type="text"
              placeholder="Group Name *"
              value={editGroup.name}
              onChange={(e) => setEditGroup(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            <textarea
              placeholder="Group Description *"
              value={editGroup.description}
              onChange={(e) => setEditGroup(prev => ({ ...prev, description: e.target.value }))}
              required
            />
            <input
              type="text"
              placeholder="City *"
              value={editGroup.city}
              onChange={(e) => setEditGroup(prev => ({ ...prev, city: e.target.value }))}
              required
            />
            <select
              value={editGroup.region}
              onChange={(e) => setEditGroup(prev => ({ ...prev, region: e.target.value }))}
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
                  checked={editGroup.categories.isEvacuee}
                  onChange={() => handleGroupCategoryChange('isEvacuee')}
                /> Evacuees
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={editGroup.categories.isInjured}
                  onChange={() => handleGroupCategoryChange('isInjured')}
                /> Injured
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={editGroup.categories.isReservist}
                  onChange={() => handleGroupCategoryChange('isReservist')}
                /> Reservists
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={editGroup.categories.isRegularSoldier}
                  onChange={() => handleGroupCategoryChange('isRegularSoldier')}
                /> Regular Soldiers
              </label>
            </div>
            {error && <div className="modal-error" style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
            {success && <div className="modal-success" style={{ color: 'green', marginBottom: 8 }}>{success}</div>}
            <div className="modal-actions">
              <button type="button" onClick={onClose}>Cancel</button>
              <button type="submit">Update Group</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditGroupModal; 