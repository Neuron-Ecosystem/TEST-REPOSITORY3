import React from 'react';
import { motion } from 'framer-motion';

const StatsPanel = ({ stats }) => {
  const total = Object.values(stats).reduce((sum, value) => sum + value, 0);
  
  const getActivityColor = (activity) => {
    const colors = {
      CREATE: '#FFD700',
      WORK: '#1E90FF',
      COMMUTE: '#32CD32',
      SLEEP: '#191970',
      ANXIOUS: '#808080',
      ACTIVE: '#FF4500'
    };
    return colors[activity] || '#FFFFFF';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.7 }}
      className="stats-panel"
    >
      <h3 className="stats-title">Глобальная статистика</h3>
      
      <div className="stats-grid">
        {Object.entries(stats).map(([activity, value]) => {
          const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
          
          return (
            <div key={activity} className="stat-item">
              <div 
                className="stat-color"
                style={{ background: getActivityColor(activity) }}
              />
              <span className="stat-label">{activity}</span>
              <span className="stat-value">{percentage}%</span>
            </div>
          );
        })}
      </div>
      
      <div style={{
        marginTop: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        color: 'var(--text-dim)',
        fontSize: '0.8rem'
      }}>
        {total.toLocaleString()} моментов сегодня
      </div>
    </motion.div>
  );
};

export default StatsPanel;
