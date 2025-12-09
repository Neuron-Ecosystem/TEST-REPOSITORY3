import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { loginWithEmail, loginWithGoogle } from '../../firebase/auth';
import { FaGoogle, FaEnvelope, FaLock } from 'react-icons/fa';

const Login = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await loginWithEmail(email, password);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    const result = await loginWithGoogle();
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="auth-card"
    >
      <h1 className="auth-title">MOMENTUM MOSAIC</h1>
      <p className="auth-subtitle">Войдите в коллективное сознание человечества</p>
      
      {error && (
        <div className="error-message" style={{
          background: 'rgba(255, 50, 50, 0.1)',
          border: '1px solid rgba(255, 50, 50, 0.3)',
          color: '#ff6b6b',
          padding: '1rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          fontSize: '0.9rem'
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleEmailLogin} className="auth-form">
        <div className="form-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="form-input"
            required
          />
        </div>
        
        <div className="form-group">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            className="form-input"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="auth-button"
        >
          {loading ? (
            <span>Вход...</span>
          ) : (
            <>
              <FaEnvelope /> Войти с Email
            </>
          )}
        </button>
      </form>
      
      <div className="divider">
        <span>или</span>
      </div>
      
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="auth-button google-button"
      >
        <FaGoogle /> Войти с Google
      </button>
      
      <div style={{
        textAlign: 'center',
        marginTop: '2rem',
        color: 'var(--text-dim)'
      }}>
        Нет аккаунта?{' '}
        <button
          onClick={onSwitch}
          className="auth-link"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 'inherit'
          }}
        >
          Зарегистрироваться
        </button>
      </div>
    </motion.div>
  );
};

export default Login;
