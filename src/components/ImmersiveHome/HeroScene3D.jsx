import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

const GlassOrb = ({ qualityTier }) => {
  const groupRef = useRef(null);
  const shellRef = useRef(null);
  const wiresRef = useRef(null);
  const starsRef = useRef(null);

  const starPositions = useMemo(() => {
    const count = qualityTier === 'high' ? 1200 : qualityTier === 'medium' ? 900 : 540;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const radius = 8 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi) * 0.6;
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }

    return positions;
  }, [qualityTier]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const elapsed = state.clock.getElapsedTime();
    const motionFactor = qualityTier === 'low' ? 0.58 : qualityTier === 'medium' ? 0.82 : 1;

    groupRef.current.rotation.y += delta * 0.2 * motionFactor;
    groupRef.current.rotation.x = Math.sin(elapsed * 0.35) * 0.08 * motionFactor;

    if (shellRef.current) {
      shellRef.current.rotation.y -= delta * 0.18 * motionFactor;
      shellRef.current.scale.x = 1 + Math.sin(elapsed * 0.8) * 0.03;
      shellRef.current.scale.y = 1 + Math.cos(elapsed * 0.65) * 0.035;
    }

    if (wiresRef.current) {
      wiresRef.current.rotation.z += delta * 0.12 * motionFactor;
      wiresRef.current.rotation.x += delta * 0.07 * motionFactor;
    }

    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.015 * motionFactor;
      starsRef.current.rotation.x -= delta * 0.01 * motionFactor;
    }
  });

  return (
    <>
      <color attach="background" args={['#02040a']} />
      <fog attach="fog" args={['#02040a', 6, 24]} />

      <ambientLight intensity={qualityTier === 'high' ? 0.4 : 0.34} color="#6fd6ff" />
      <directionalLight position={[2.5, 2.8, 2.2]} intensity={qualityTier === 'low' ? 0.9 : 1.15} color="#ffdb9d" />
      <pointLight position={[-2.5, -1.2, 2]} intensity={qualityTier === 'low' ? 0.48 : 0.65} color="#5cf4ff" />

      <group ref={groupRef}>
        <mesh ref={shellRef}>
          <icosahedronGeometry args={[1.7, qualityTier === 'high' ? 6 : qualityTier === 'medium' ? 5 : 4]} />
          <meshPhysicalMaterial
            color="#7cd9ff"
            roughness={0.14}
            metalness={0.24}
            clearcoat={0.95}
            clearcoatRoughness={0.25}
            transmission={0.88}
            thickness={0.85}
            ior={1.45}
            opacity={0.9}
            transparent
          />
        </mesh>

        <mesh ref={wiresRef} scale={1.2}>
          <torusKnotGeometry
            args={[
              1.25,
              0.14,
              qualityTier === 'high' ? 240 : qualityTier === 'medium' ? 180 : 120,
              qualityTier === 'high' ? 24 : qualityTier === 'medium' ? 18 : 12,
            ]}
          />
          <meshStandardMaterial
            color="#ffd093"
            emissive="#ffbc66"
            emissiveIntensity={0.35}
            roughness={0.2}
            metalness={0.82}
            wireframe
          />
        </mesh>
      </group>

      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={starPositions.length / 3} array={starPositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#9de8ff" size={0.038} sizeAttenuation transparent opacity={0.8} />
      </points>
    </>
  );
};

const HeroScene3D = () => {
  const wrapperRef = useRef(null);
  const [qualityTier, setQualityTier] = useState('medium');
  const [isInView, setIsInView] = useState(true);
  const [isDocumentVisible, setIsDocumentVisible] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const updateTier = () => {
      const width = window.innerWidth;
      const cpu = typeof navigator !== 'undefined' && navigator.hardwareConcurrency
        ? navigator.hardwareConcurrency
        : 4;
      const memory = typeof navigator !== 'undefined' && navigator.deviceMemory
        ? navigator.deviceMemory
        : 4;

      if (width >= 1440 && cpu >= 8 && memory >= 8) {
        setQualityTier('high');
        return;
      }

      if (width <= 900 || cpu <= 4 || memory <= 4) {
        setQualityTier('low');
        return;
      }

      setQualityTier('medium');
    };

    updateTier();
    window.addEventListener('resize', updateTier, { passive: true });
    return () => window.removeEventListener('resize', updateTier);
  }, []);

  useEffect(() => {
    const target = wrapperRef.current;
    if (!target || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.12,
        rootMargin: '180px 0px',
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    const onVisibilityChange = () => {
      setIsDocumentVisible(!document.hidden);
    };

    onVisibilityChange();
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  const dpr = qualityTier === 'high' ? [1, 1.6] : qualityTier === 'medium' ? [1, 1.35] : [1, 1];
  const frameloopMode = isInView && isDocumentVisible ? 'always' : 'never';

  return (
    <div ref={wrapperRef} className="hero-canvas-shell">
      <Canvas
        className="hero-canvas"
        camera={{ position: [0, 0, 6], fov: 44 }}
        dpr={dpr}
        frameloop={frameloopMode}
        gl={{
          antialias: qualityTier !== 'low',
          alpha: true,
          powerPreference: qualityTier === 'high' ? 'high-performance' : 'default',
        }}
      >
        <GlassOrb qualityTier={qualityTier} />
      </Canvas>
    </div>
  );
};

export default HeroScene3D;
