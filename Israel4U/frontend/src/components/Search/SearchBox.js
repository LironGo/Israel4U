import React from 'react';
import $ from 'jquery';

function SearchBox({ onSearchInput }) {
  const handleSearchInput = (e) => {
    const searchTerm = e.target.value;
    if (searchTerm.length > 2) {
      // Debounce search to avoid too many requests
      clearTimeout(window.searchTimeout);
      window.searchTimeout = setTimeout(() => {
        handleMultiSearch(searchTerm);
      }, 500);
    } else {
      $('#search-results').html('');
    }
  };

  const handleMultiSearch = (searchTerm) => {
    const token = localStorage.getItem('token');
    // Run all three searches in parallel
    const postsReq = $.ajax({
      url: 'http://localhost:5001/api/posts/search',
      method: 'GET',
      data: { q: searchTerm },
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const usersReq = $.ajax({
      url: 'http://localhost:5001/api/users/search',
      method: 'GET',
      data: { q: searchTerm },
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const groupsReq = $.ajax({
      url: 'http://localhost:5001/api/groups',
      method: 'GET',
      data: { q: searchTerm },
      headers: { 'Authorization': `Bearer ${token}` }
    });

    Promise.all([postsReq, usersReq, groupsReq])
      .then(([posts, users, groups]) => {
        let html = '';
        if (users.length > 0) {
          html += '<div class="search-section"><h3>Users</h3>';
          users.forEach(user => {
            html += `<div class="search-result-item"><strong>${user.fullName || user.email}</strong></div>`;
          });
          html += '</div>';
        }
        if (groups.length > 0) {
          html += '<div class="search-section"><h3>Groups</h3>';
          groups.forEach(group => {
            html += `<div class="search-result-item"><strong>${group.name}</strong> <span>${group.city || ''}</span></div>`;
          });
          html += '</div>';
        }
        if (posts.length > 0) {
          html += '<div class="search-section"><h3>Posts</h3>';
          posts.forEach(post => {
            html += `<div class="search-result-item"><h4>${post.title || ''}</h4><p>${post.content}</p></div>`;
          });
          html += '</div>';
        }
        if (!html) {
          html = '<div class="search-section">No results found.</div>';
        }
        $('#search-results').html(html);
      })
      .catch((err) => {
        console.error('Search error:', err);
        $('#search-results').html('<div class="search-section">Error fetching search results.</div>');
      });
  };

  return (
    <div className="search-box">
      <input 
        type="text" 
        placeholder="Search users, groups, posts..." 
        onChange={handleSearchInput}
      />
      {/* jQuery will populate this div with search results */}
      <div id="search-results" className="search-results" style={{ maxHeight: '300px', overflowY: 'auto', overflowX: 'hidden' }}></div>
    </div>
  );
}

export default SearchBox; 