import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, Environment, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const CardMesh = ({ image, isActive }) => {
  const meshRef = useRef();
  
  // Custom texture loader that skips if no image is passed
  // Note: we actually shouldn't hit this component without a valid image in this design.
  const texture = useTexture(image);
  
  // Target rotation for spring damping
  const targetRotation = useRef({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  // Disable interacting/animating if not visually active to save perf
  const activeLerp = useRef(isActive ? 1 : 0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Smooth animate isActive transition
    activeLerp.current += ((isActive ? 1 : 0) - activeLerp.current) * 10 * delta;

    // Smooth lerp for tilt (mouse interaction)
    meshRef.current.rotation.x += (targetRotation.current.x - meshRef.current.rotation.x) * 8 * delta;
    meshRef.current.rotation.y += (targetRotation.current.y - meshRef.current.rotation.y) * 8 * delta;

    // Idle floating animation
    if (!hovered && isActive) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.03 * activeLerp.current;
    } else {
      meshRef.current.position.y += (0 - meshRef.current.position.y) * 10 * delta;
    }

    // Scale effect when active vs inactive
    const baseScale = 1.0;
    const activeScale = 1.0 + (activeLerp.current * 0.05);
    const hoverScale = hovered ? 1.02 : 1.0;
    const finalScale = baseScale * activeScale * hoverScale;
    
    meshRef.current.scale.setScalar(finalScale);
  });

  const handlePointerMove = (e) => {
    if (!isActive) return;
    if (e.uv) {
      // Map UV (0...1) to (-1...1)
      const x = (e.uv.x - 0.5) * 2;
      const y = (e.uv.y - 0.5) * 2;
      
      // Tilt max angle ~ 15 degrees (0.25 rad)
      targetRotation.current.y = x * 0.25;
      targetRotation.current.x = -y * 0.25;
    }
  };

  const handlePointerOut = () => {
    setHovered(false);
    targetRotation.current.x = 0;
    targetRotation.current.y = 0;
  };

  const handlePointerOver = () => {
    if (!isActive) return;
    setHovered(true);
  };

  return (
    <RoundedBox 
      ref={meshRef}
      args={[4, 2.8, 0.1]} // Aspect ratio approx matches the showcase image (16:11-ish)
      radius={0.1} 
      smoothness={4}
      onPointerOver={handlePointerOver}
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}
      castShadow
      receiveShadow
    >
      <meshPhysicalMaterial 
        map={texture}
        roughness={0.15}
        metalness={0.2}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
        iridescence={0.3} // Subtle premium iridescence
        iridescenceIOR={1.3}
      />
    </RoundedBox>
  );
};

const ProjectCard3D = ({ image, isActive }) => {
  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Render a standard img tag on mobile for performance, 
  // or if reduced motion is enabled to avoid expensive canvas context
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 900;
  
  if (isMobile || prefersReducedMotion) {
    return (
      <img
        src={image}
        alt="Project screenshot"
        className="showcase-image"
        loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    );
  }

  return (
    <div className="project-card-3d-container" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      {/* We use frameloop="demand" conditionally but here "always" is needed for idle floating and dumping */}
      <Canvas 
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#d4ff00" />
        
        {/* Environment gives the glass reflections */}
        <Environment preset="city" />

        <React.Suspense fallback={null}>
          <CardMesh image={image} isActive={isActive} />
        </React.Suspense>
      </Canvas>
    </div>
  );
};

export default ProjectCard3D;
