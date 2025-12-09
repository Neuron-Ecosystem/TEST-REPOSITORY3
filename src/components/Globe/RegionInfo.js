import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const RegionInfo = ({ region, onClose }) => {
  if (!region) return null;

  const total = Object.values(region.stats).reduce((sum, value) => sum + value, 0);
  
  const getActivityColor = (activity) => {
    const colors = {
      WORK: '#1E90FF',
      CREATE: '#FFD700',
      COMMUTE: '#32CD32',
      SLEEP: '#191970',
      ANXIOUS: '#808080',
      ACTIVE: '#FF4500'
    };
    return colors[activity] || '#FFFFFF';
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="region-info"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="region-header">
          <h3 className="region-title">{region.name}</h3>
          <button onClick={onClose} className="close-button">
            <FaTimes />
          </button>
        </div>
        
        <div className="region-subtitle" style={{
          color: 'var(--text-secondary)',
          marginBottom: '1.5rem',
          fontSize: '0.9rem'
        }}>
          Активности в реальном времени
        </div>
        
        <div className="region-stats">
          {Object.entries(region.stats)
            .sort(([, a], [, b]) => b - a)
            .map(([activity, value]) => (
              <div key={activity} className="stat-bar">
                <span className="stat-bar-label" style={{ color: getActivityColor(activity) }}>
                  {activity}
                </span>
                <div className="stat-bar-track">
                  <motion.div
                    className="stat-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{
                      background: `linear-gradient(90deg, ${getActivityColor(activity)}, ${getActivityColor(activity)}80)`
                    }}
                  />
                </div>
                <span className="stat-value">{value}%</span>
              </div>
            ))}
        </div>
        
        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'var(--text-dim)',
          fontSize: '0.8rem'
        }}>
          Обновлено только что • {total} активных пользователей
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RegionInfo;
