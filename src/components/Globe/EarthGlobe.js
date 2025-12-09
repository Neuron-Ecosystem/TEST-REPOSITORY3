import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const EarthGlobe = ({ onRegionClick, globalStats, userActivity }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [pulse, setPulse] = useState(0);
  const [colors, setColors] = useState({});
  
  // Define region coordinates (simplified - in production would use real geo data)
  const regions = useMemo(() => {
    const regions = [];
    const segments = 32;
    
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segments; j++) {
        const phi = (i / segments) * Math.PI * 2;
        const theta = (j / segments) * Math.PI;
        
        regions.push({
          id: `region_${i}_${j}`,
          position: [
            Math.sin(theta) * Math.cos(phi) * 5,
            Math.cos(theta) * 5,
            Math.sin(theta) * Math.sin(phi) * 5
          ],
          color: new THREE.Color('#1E90FF')
        });
      }
    }
    
    return regions;
  }, []);

  // Calculate colors based on global stats
  useEffect(() => {
    const activityColors = {
      CREATE: '#FFD700',
      WORK: '#1E90FF',
      COMMUTE: '#32CD32',
      SLEEP: '#191970',
      ANXIOUS: '#808080',
      ACTIVE: '#FF4500'
    };
    
    const total = Object.values(globalStats).reduce((a, b) => a + b, 0);
    const newColors = {};
    
    Object.entries(globalStats).forEach(([activity, count]) => {
      if (total > 0) {
        const percentage = count / total;
        const color = new THREE.Color(activityColors[activity] || '#FFFFFF');
        color.multiplyScalar(0.5 + percentage * 0.5); // Adjust brightness based on activity density
        newColors[activity] = color;
      }
    });
    
    setColors(newColors);
  }, [globalStats]);

  // Handle globe pulse when user selects activity
  useEffect(() => {
    const handleGlobePulse = () => {
      setPulse(1);
    };
    
    window.addEventListener('globePulse', handleGlobePulse);
    
    return () => {
      window.removeEventListener('globePulse', handleGlobePulse);
    };
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle auto-rotation
      meshRef.current.rotation.y += 0.0005;
      
      // Breathing effect - subtle scale pulsing
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.002;
      meshRef.current.scale.setScalar(scale);
      
      // Handle pulse animation
      if (pulse > 0) {
        meshRef.current.material.emissiveIntensity = pulse * 2;
        setPulse(Math.max(0, pulse - 0.02));
      }
    }
  });

  const handleClick = (event) => {
    event.stopPropagation();
    
    // Calculate clicked region based on UV coordinates
    const uv = event.uv;
    if (uv && onRegionClick) {
      const lat = Math.round((uv.y - 0.5) * 180);
      const lon = Math.round((uv.x - 0.5) * 360);
      const regionId = `region_${lat}_${lon}`;
      
      // Simulate region stats
      const mockStats = {
        regionId,
        name: `Region ${Math.abs(lat)}°${lat >= 0 ? 'N' : 'S'} ${Math.abs(lon)}°${lon >= 0 ? 'E' : 'W'}`,
        stats: {
          WORK: Math.floor(Math.random() * 40) + 20,
          CREATE: Math.floor(Math.random() * 30) + 10,
          COMMUTE: Math.floor(Math.random() * 20) + 5,
          SLEEP: Math.floor(Math.random() * 15) + 5,
          ANXIOUS: Math.floor(Math.random() * 10) + 2,
          ACTIVE: Math.floor(Math.random() * 10) + 2
        }
      };
      
      onRegionClick(mockStats);
    }
  };

  const getDominantColor = () => {
    if (Object.keys(colors).length === 0) return '#1E90FF';
    
    const dominantActivity = Object.entries(globalStats).reduce((a, b) => 
      globalStats[a] > globalStats[b] ? a : b
    );
    
    return colors[dominantActivity] || '#1E90FF';
  };

  return (
    <group>
      {/* Main Globe */}
      <Sphere
        ref={meshRef}
        args={[5, 64, 64]}
        position={[0, 0, 0]}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <MeshDistortMaterial
          color={getDominantColor()}
          emissive={userActivity ? new THREE.Color(getActivityColor(userActivity)) : new THREE.Color('#1E90FF')}
          emissiveIntensity={pulse > 0 ? pulse * 0.5 : 0.1}
          roughness={0.8}
          metalness={0.2}
          distort={0.3}
          speed={1}
          transparent
          opacity={0.9}
        />
      </Sphere>
      
      {/* Atmosphere Glow */}
      <Sphere args={[5.2, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#a0c8ff"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Region Points */}
      {regions.slice(0, 100).map((region, index) => (
        <mesh
          key={region.id}
          position={region.position}
          scale={0.05}
        >
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshStandardMaterial
            color={region.color}
            emissive={region.color}
            emissiveIntensity={0.2}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
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

export default EarthGlobe;
