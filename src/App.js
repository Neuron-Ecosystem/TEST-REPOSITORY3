import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import { auth, db } from './firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';
import EarthGlobe from './components/Globe/EarthGlobe';
import ActivityButtons from './components/UI/ActivityButtons';
import RegionInfo from './components/Globe/RegionInfo';
import StatsPanel from './components/UI/StatsPanel';
import LoadingScreen from './components/UI/LoadingScreen';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [globalStats, setGlobalStats] = useState({
    CREATE: 25,
    WORK: 35,
    COMMUTE: 15,
    SLEEP: 12,
    ANXIOUS: 8,
    ACTIVE: 5
  });
  const [userActivity, setUserActivity] = useState(null);
  const [lastClickTime, setLastClickTime] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0]
        });
        
        // Create or update user profile
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            email: user.email,
            createdAt: new Date().toISOString(),
            lastActivity: null,
            totalContributions: 0,
            region: 'unknown'
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleActivityClick = async (activity) => {
    const now = Date.now();
    if (now - lastClickTime < 5000) {
      alert('Please wait 5 seconds between updates');
      return;
    }

    setLastClickTime(now);
    setUserActivity(activity);

    // Update global stats
    setGlobalStats(prev => ({
      ...prev,
      [activity]: prev[activity] + 1
    }));

    if (user) {
      // Update user activity
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        lastActivity: activity,
        lastActivityAt: new Date().toISOString(),
        totalContributions: increment(1)
      });

      // Update global activity count
      const activityRef = doc(db, 'globalStats', 'activities');
      const activitySnap = await getDoc(activityRef);
      
      if (activitySnap.exists()) {
        await updateDoc(activityRef, {
          [activity]: increment(1),
          lastUpdated: new Date().toISOString()
        });
      } else {
        await setDoc(activityRef, {
          ...globalStats,
          [activity]: globalStats[activity] + 1,
          lastUpdated: new Date().toISOString()
        });
      }
    }

    // Trigger globe pulse effect
    const event = new CustomEvent('globePulse', { 
      detail: { activity, color: getActivityColor(activity) }
    });
    window.dispatchEvent(event);
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="app-container">
      <div className="stars-background">
        <div className="glow-effect" />
      </div>

      <AnimatePresence>
        {!user ? (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="auth-container"
          >
            {showRegister ? (
              <Register onSwitch={() => setShowRegister(false)} />
            ) : (
              <Login onSwitch={() => setShowRegister(true)} />
            )}
          </motion.div>
        ) : (
          <>
            <Canvas
              style={{ position: 'absolute', top: 0, left: 0 }}
              camera={{ position: [0, 0, 15], fov: 50 }}
            >
              <PerspectiveCamera makeDefault position={[0, 0, 15]} />
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} color="#a0c8ff" />
              <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ffa0c8" />
              
              <EarthGlobe 
                onRegionClick={setSelectedRegion}
                globalStats={globalStats}
                userActivity={userActivity}
              />
              
              <Stars
                radius={100}
                depth={50}
                count={5000}
                factor={4}
                saturation={0}
                fade
                speed={0.5}
              />
              
              <OrbitControls
                enableZoom={true}
                enablePan={true}
                enableRotate={true}
                zoomSpeed={0.6}
                panSpeed={0.5}
                rotateSpeed={0.5}
                minDistance={5}
                maxDistance={20}
                autoRotate={true}
                autoRotateSpeed={0.3}
              />
            </Canvas>

            <div className="main-interface">
              <header className="header">
                <div className="logo">MOMENTUM MOSAIC</div>
                <div className="user-info">
                  <span className="user-email">{user.email}</span>
                  <div 
                    className="user-avatar"
                    onClick={handleLogout}
                    title="Logout"
                  >
                    {user.displayName?.[0]?.toUpperCase() || 'U'}
                  </div>
                </div>
              </header>

              <ActivityButtons onActivityClick={handleActivityClick} />

              <StatsPanel stats={globalStats} />
            </div>

            {selectedRegion && (
              <RegionInfo
                region={selectedRegion}
                onClose={() => setSelectedRegion(null)}
              />
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
