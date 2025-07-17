import React from 'react';

function RegisterForm({ registerForm, onInputChange, onCategoryChange, onSubmit, loading, error, success, switchToLogin }) {
  return (
    <div className="register-container">
      <div className="register-box">
        <h1>Join Israel4U</h1>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form className="register-form" onSubmit={onSubmit}>
          <input 
            type="email" 
            placeholder="Email" 
            value={registerForm.email}
            onChange={e => onInputChange('email', e.target.value)}
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={registerForm.password}
            onChange={e => onInputChange('password', e.target.value)}
            required 
          />
          <input 
            type="text" 
            placeholder="Full Name" 
            value={registerForm.fullName}
            onChange={e => onInputChange('fullName', e.target.value)}
            required 
          />
          <input 
            type="tel" 
            placeholder="Phone" 
            value={registerForm.phone}
            onChange={e => onInputChange('phone', e.target.value)}
            required 
          />
          <select 
            value={registerForm.region}
            onChange={e => onInputChange('region', e.target.value)}
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
            value={registerForm.city}
            onChange={e => onInputChange('city', e.target.value)}
            required 
          />
          <div className="categories">
            <label>
              <input 
                type="checkbox" 
                checked={registerForm.categories.displaced}
                onChange={() => onCategoryChange('displaced')}
              /> מפונים
            </label>
            <label>
              <input 
                type="checkbox" 
                checked={registerForm.categories.wounded}
                onChange={() => onCategoryChange('wounded')}
              /> פצועים
            </label>
            <label>
              <input 
                type="checkbox" 
                checked={registerForm.categories.reservists}
                onChange={() => onCategoryChange('reservists')}
              /> מילואימניקים
            </label>
            <label>
              <input 
                type="checkbox" 
                checked={registerForm.categories.regularSoldiers}
                onChange={() => onCategoryChange('regularSoldiers')}
              /> חיילים סדירים
            </label>
          </div>
          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p className="login-link">
          Already have an account? <span onClick={switchToLogin}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm; 