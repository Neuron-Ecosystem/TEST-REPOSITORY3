import { 
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
  query,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore';
import { db } from './config';

export const saveUserActivity = async (userId, activity, region) => {
  try {
    const userRef = doc(db, 'users', userId);
    const regionRef = doc(db, 'regions', region);
    
    // Update user activity
    await updateDoc(userRef, {
      lastActivity: activity,
      lastActivityAt: new Date().toISOString(),
      totalContributions: increment(1),
      region
    });
    
    // Update region activity
    const regionSnap = await getDoc(regionRef);
    if (regionSnap.exists()) {
      await updateDoc(regionRef, {
        [`activities.${activity}`]: increment(1),
        lastUpdated: new Date().toISOString(),
        total: increment(1)
      });
    } else {
      await setDoc(regionRef, {
        [`activities.${activity}`]: 1,
        lastUpdated: new Date().toISOString(),
        total: 1
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error saving activity:', error);
    return { success: false, error: error.message };
  }
};

export const getGlobalStats = async () => {
  try {
    const statsRef = doc(db, 'globalStats', 'activities');
    const statsSnap = await getDoc(statsRef);
    
    if (statsSnap.exists()) {
      return statsSnap.data();
    }
    
    // Default stats
    return {
      CREATE: 25,
      WORK: 35,
      COMMUTE: 15,
      SLEEP: 12,
      ANXIOUS: 8,
      ACTIVE: 5,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting global stats:', error);
    return null;
  }
};

export const subscribeToGlobalStats = (callback) => {
  const statsRef = doc(db, 'globalStats', 'activities');
  
  return onSnapshot(statsRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    }
  });
};

export const getRegionStats = async (regionId) => {
  try {
    const regionRef = doc(db, 'regions', regionId);
    const regionSnap = await getDoc(regionRef);
    
    if (regionSnap.exists()) {
      const data = regionSnap.data();
      const activities = data.activities || {};
      const total = data.total || 0;
      
      // Calculate percentages
      const stats = {};
      Object.keys(activities).forEach(activity => {
        stats[activity] = total > 0 ? Math.round((activities[activity] / total) * 100) : 0;
      });
      
      return {
        regionId,
        stats,
        total,
        lastUpdated: data.lastUpdated
      };
    }
    
    return {
      regionId,
      stats: {},
      total: 0,
      lastUpdated: null
    };
  } catch (error) {
    console.error('Error getting region stats:', error);
    return null;
  }
};
