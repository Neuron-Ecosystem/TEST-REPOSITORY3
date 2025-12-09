import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="loading-screen"
    >
      <div className="stars-background">
        <div className="glow-effect" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          textAlign: 'center',
          zIndex: 100
        }}
      >
        <h1 className="loading-text">MOMENTUM MOSAIC</h1>
        <div className="loading-spinner" />
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            marginTop: '2rem',
            color: 'var(--text-secondary)',
            fontSize: '1.1rem'
          }}
        >
          Подключение к коллективному сознанию...
        </motion.p>
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '200px' }}
          transition={{ delay: 0.8, duration: 2 }}
          style={{
            marginTop: '2rem',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #1E90FF, transparent)',
            borderRadius: '1px'
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;
