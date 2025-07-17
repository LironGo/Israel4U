import React from 'react';

function ProfileModal({
  showProfile,
  setShowProfile,
  editProfile,
  handleInputChange,
  handleProfileCategoryChange,
  handleUpdateProfile,
  error,
  success,
  onDeleteAccount // <-- new prop
}) {
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [deleted, setDeleted] = React.useState(false);

  if (!showProfile) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Manage Profile</h3>
          <button onClick={() => setShowProfile(false)}>✕</button>
        </div>
        <div className="modal-content">
          {deleted ? (
            <div style={{ textAlign: 'center', color: 'green', margin: '24px 0' }}>
              Account deleted successfully.<br />
              Logging out...
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateProfile(); }}>
              <input
                type="text"
                placeholder="Full Name"
                value={editProfile.fullName}
                onChange={(e) => handleInputChange('profile', 'fullName', e.target.value)}
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                value={editProfile.phone}
                onChange={(e) => handleInputChange('profile', 'phone', e.target.value)}
                required
              />
              <select
                value={editProfile.region}
                onChange={(e) => handleInputChange('profile', 'region', e.target.value)}
                required
              >
                <option value="">Select Region</option>
                <option value="צפון">צפון</option>
                <option value="מרכז">מרכז</option>
                <option value="דרום">דרום</option>
                <option value="שפלה">שפלה</option>
              </select>
              <input
                type="text"
                placeholder="City"
                value={editProfile.city}
                onChange={(e) => handleInputChange('profile', 'city', e.target.value)}
                required
              />
              <div className="categories">
                <label>
                  <input 
                    type="checkbox" 
                    checked={editProfile.categories.isEvacuee}
                    onChange={() => handleProfileCategoryChange('isEvacuee')}
                  /> Evacuees
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    checked={editProfile.categories.isInjured}
                    onChange={() => handleProfileCategoryChange('isInjured')}
                  /> Injured
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    checked={editProfile.categories.isReservist}
                    onChange={() => handleProfileCategoryChange('isReservist')}
                  /> Reservists
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    checked={editProfile.categories.isRegularSoldier}
                    onChange={() => handleProfileCategoryChange('isRegularSoldier')}
                  /> Regular Soldiers
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowProfile(false)}>Cancel</button>
                <button type="submit">Update Profile</button>
                <button
                  type="button"
                  style={{ color: 'red', marginLeft: 'auto' }}
                  onClick={() => setShowConfirm(true)}
                >
                  Delete Account
                </button>
              </div>
              {showConfirm && (
                <div className="modal-confirm" style={{ marginTop: 16, textAlign: 'center' }}>
                  <div>Are you sure you want to delete your account?</div>
                  <button
                    style={{ color: 'red', margin: '8px' }}
                    type="button"
                    onClick={async () => {
                      setShowConfirm(false);
                      setDeleted(true);
                      await onDeleteAccount();
                    }}
                  >Yes</button>
                  <button type="button" onClick={() => setShowConfirm(false)} style={{ margin: '8px' }}>No</button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileModal; 