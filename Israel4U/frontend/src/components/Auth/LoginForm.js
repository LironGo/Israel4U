import React from 'react';

function LoginForm({ loginForm, onInputChange, onSubmit, loading, error, success, switchToRegister }) {
  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Welcome to Israel4U</h1>
        <div className="logo">
          <h2>🇮🇱 Israel4U</h2>
        </div>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form className="login-form" onSubmit={onSubmit}>
          <input 
            type="email" 
            placeholder="Email" 
            value={loginForm.email}
            onChange={e => onInputChange('email', e.target.value)}
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={loginForm.password}
            onChange={e => onInputChange('password', e.target.value)}
            required 
          />
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="signup-link">
          Don't have an account? <span onClick={switchToRegister}>Sign up</span>
        </p>
      </div>
    </div>
  );
}

export default LoginForm; 