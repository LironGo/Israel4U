import React from 'react';

const userTypes = [
  { key: 'isEvacuee', label: 'Evacuee' },
  { key: 'isInjured', label: 'Injured' },
  { key: 'isReservist', label: 'Reservist' },
  { key: 'isRegularSoldier', label: 'Regular Soldier' },
];

function GroupsFilters({
  filters,
  onChange,
  regions,
}) {
  return (
    <div
      className="groups-filters"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        marginBottom: 24,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', gap: 24 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            checked={filters.onlyMember}
            onChange={e => onChange({ ...filters, onlyMember: e.target.checked })}
          />
          Show only groups I’m a member of
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            checked={filters.onlyOwner}
            onChange={e => onChange({ ...filters, onlyOwner: e.target.checked })}
          />
          Show only groups I own
        </label>
      </div>
      <div style={{ display: 'flex', gap: 24 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          Region:
          <select
            value={filters.region}
            onChange={e => onChange({ ...filters, region: e.target.value })}
            style={{ marginLeft: 4 }}
          >
            <option value="">All</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          City:
          <input
            type="text"
            value={filters.city}
            onChange={e => onChange({ ...filters, city: e.target.value })}
            placeholder="Enter city"
            style={{ marginLeft: 4 }}
          />
        </label>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span>User Type:</span>
        {userTypes.map(type => (
          <label key={type.key} style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 8 }}>
            <input
              type="checkbox"
              checked={filters[type.key]}
              onChange={e => onChange({ ...filters, [type.key]: e.target.checked })}
            />
            {type.label}
          </label>
        ))}
      </div>
    </div>
  );
}

export default GroupsFilters; 