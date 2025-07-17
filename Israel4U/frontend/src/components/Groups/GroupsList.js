import React from 'react';

function GroupsList({ groups, userId, onEditGroup, onJoinGroup, onOpenGroup }) {
  if (!groups || groups.length === 0) {
    return <p>No groups found.</p>;
  }
  return (
    <ul className="groups-list" style={{ padding: 0, margin: 0, listStyle: 'none' }}>
      {groups.map(group => {
        const isOwner = (typeof group.manager === 'string' && group.manager === userId) ||
                        (typeof group.manager === 'object' && group.manager && group.manager._id === userId);
        const isMember = Array.isArray(group.members) && group.members.some(member => {
          if (typeof member === 'string') return member === userId;
          if (typeof member === 'object' && member !== null) return member._id === userId;
          return false;
        });
        return (
          <li
            key={group._id}
            className="group-item"
            style={{ marginBottom: 32, padding: 16, borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', background: '#fff' }}
          >
            <h3 style={{ margin: '0 0 8px 0', cursor: 'pointer', color: '#1976d2', textDecoration: 'underline' }} onClick={() => onOpenGroup(group)}>{group.name}</h3>
            <p style={{ margin: '0 0 4px 0' }}>{group.description}</p>
            <p style={{ margin: 0 }}><strong>City:</strong> {group.city} | <strong>Region:</strong> {group.region}</p>
            <div style={{ marginTop: 8 }}>
              {isOwner && (
                <button onClick={() => onEditGroup(group)}>
                  ✏️ Edit
                </button>
              )}
              {!isOwner && !isMember && (
                <button style={{ marginLeft: 8 }} onClick={() => onJoinGroup(group)}>
                  ➕ Join
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default GroupsList; 