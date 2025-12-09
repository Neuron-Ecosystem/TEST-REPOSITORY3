import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { registerWithEmail, loginWithGoogle } from '../../firebase/auth';
import { FaGoogle, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const Register = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await registerWithEmail(email, password, displayName);
    
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
      <h1 className="auth-title">СОЗДАЙТЕ АККАУНТ</h1>
      <p className="auth-subtitle">Присоединитесь к мозаике человеческих моментов</p>
      
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
      
      <form onSubmit={handleRegister} className="auth-form">
        <div className="form-group">
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Имя (анонимно)"
            className="form-input"
            required
          />
        </div>
        
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
            placeholder="Пароль (минимум 6 символов)"
            className="form-input"
            required
            minLength={6}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="auth-button"
        >
          {loading ? (
            <span>Регистрация...</span>
          ) : (
            <>
              <FaUser /> Создать аккаунт
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
        <FaGoogle /> Зарегистрироваться с Google
      </button>
      
      <div style={{
        textAlign: 'center',
        marginTop: '2rem',
        color: 'var(--text-dim)'
      }}>
        Уже есть аккаунт?{' '}
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
          Войти
        </button>
      </div>
    </motion.div>
  );
};

export default Register;
