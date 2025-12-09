import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ActivityButtons = ({ onActivityClick }) => {
  const [selected, setSelected] = useState(null);
  const [clicked, setClicked] = useState(false);

  const activities = [
    { id: 'CREATE', label: 'CREATE', color: 'create', icon: '✨' },
    { id: 'WORK', label: 'WORK', color: 'work', icon: '💼' },
    { id: 'COMMUTE', label: 'COMMUTE', color: 'commute', icon: '🚗' },
    { id: 'SLEEP', label: 'SLEEP', color: 'sleep', icon: '😴' },
    { id: 'ANXIOUS', label: 'ANXIOUS', color: 'anxious', icon: '🌀' },
    { id: 'ACTIVE', label: 'ACTIVE', color: 'active', icon: '⚡' }
  ];

  const handleClick = (activityId) => {
    setSelected(activityId);
    setClicked(true);
    onActivityClick(activityId);
    
    // Reset animation
    setTimeout(() => setClicked(false), 1000);
    setTimeout(() => setSelected(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="activity-section"
    >
      <h2 className="question">Что ты делаешь прямо сейчас?</h2>
      
      <div className="buttons-grid">
        {activities.map((activity) => (
          <motion.button
            key={activity.id}
            className={`activity-button ${activity.color} ${selected === activity.id ? 'selected' : ''}`}
            onClick={() => handleClick(activity.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={
              selected === activity.id && clicked
                ? {
                    scale: [1, 1.2, 1],
                    boxShadow: [
                      '0 15px 30px rgba(0,0,0,0.3)',
                      `0 0 40px ${getActivityColor(activity.id)}`,
                      '0 15px 30px rgba(0,0,0,0.3)'
                    ]
                  }
                : {}
            }
            transition={{ duration: 0.3 }}
          >
            <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              {activity.icon}
            </span>
            <br />
            {activity.label}
          </motion.button>
        ))}
      </div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{
          color: 'var(--text-secondary)',
          fontSize: '1rem',
          marginTop: '1rem'
        }}
      >
        Ваш выбор мгновенно обновляет живую мозаику планеты
      </motion.p>
    </motion.div>
  );
};

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

export default ActivityButtons;
