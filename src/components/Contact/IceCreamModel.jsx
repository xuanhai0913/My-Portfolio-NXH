import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const CELEBRATE_DURATION = 3; // seconds

function IceCream({ mousePos, celebrate, qualityTier }) {
  const { scene } = useGLTF('/3d/CONTACT.glb');
  const meshRef = useRef();
  const targetRotation = useRef({ x: 0, y: 0 });
  const celebrateTimer = useRef(0);
  const prevCelebrate = useRef(false);
  const baseScale = qualityTier === 'low' ? 2.35 : 2.5;

  // Clone scene to avoid shared state issues
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const motionFactor = qualityTier === 'low' ? 0.65 : 1;

    // Detect rising edge of celebrate prop
    if (celebrate && !prevCelebrate.current) {
      celebrateTimer.current = CELEBRATE_DURATION;
    }
    prevCelebrate.current = celebrate;

    if (celebrateTimer.current > 0) {
      // Celebration mode
      celebrateTimer.current -= delta;
      const t = 1 - celebrateTimer.current / CELEBRATE_DURATION; // 0 -> 1

      // 2 full Y-axis rotations with ease-out
      const easeOut = 1 - Math.pow(1 - t, 3);
      meshRef.current.rotation.y = easeOut * Math.PI * 4;
      meshRef.current.rotation.x = 0;

      // Scale bounce: 1.0 -> 1.3 -> 1.0 via sin curve
      const scaleFactor = 1 + 0.3 * Math.sin(t * Math.PI);
      const s = baseScale * scaleFactor;
      const child = meshRef.current.children[0];
      if (child) {
        child.scale.set(s, s, s);
      }
    } else {
      // Normal mouse tracking
      targetRotation.current.y = mousePos.current.x * 0.4;
      targetRotation.current.x = -mousePos.current.y * 0.2;

      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRotation.current.y,
        delta * 3 * motionFactor
      );
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        targetRotation.current.x,
        delta * 3 * motionFactor
      );

      // Reset scale smoothly
      const child = meshRef.current.children[0];
      if (child) {
        child.scale.x = THREE.MathUtils.lerp(child.scale.x, baseScale, delta * 4);
        child.scale.y = THREE.MathUtils.lerp(child.scale.y, baseScale, delta * 4);
        child.scale.z = THREE.MathUtils.lerp(child.scale.z, baseScale, delta * 4);
      }
    }
  });

  return (
    <group ref={meshRef}>
      <primitive object={clonedScene} scale={baseScale} position={[0, -0.5, 0]} />
    </group>
  );
}

function Scene({ mousePos, celebrate, qualityTier }) {
  const showFloatWrapper = qualityTier !== 'low';

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={qualityTier === 'high' ? 0.6 : 0.5} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={qualityTier === 'low' ? 0.9 : 1.2}
        color="#ffffff"
      />
      <pointLight
        position={[-3, 3, 2]}
        intensity={qualityTier === 'low' ? 0.55 : 0.8}
        color="#d4ff00"
      />
      <pointLight
        position={[3, -2, -3]}
        intensity={qualityTier === 'low' ? 0.3 : 0.4}
        color="#4a90e2"
      />

      {/* Floating Ice Cream */}
      {showFloatWrapper ? (
        <Float
          speed={qualityTier === 'high' ? 2.1 : 1.8}
          rotationIntensity={qualityTier === 'high' ? 0.34 : 0.26}
          floatIntensity={qualityTier === 'high' ? 0.85 : 0.7}
          floatingRange={[-0.15, 0.15]}
        >
          <IceCream mousePos={mousePos} celebrate={celebrate} qualityTier={qualityTier} />
        </Float>
      ) : (
        <IceCream mousePos={mousePos} celebrate={celebrate} qualityTier={qualityTier} />
      )}

      {/* Shadow beneath */}
      {qualityTier !== 'low' && (
        <ContactShadows
          position={[0, -2.2, 0]}
          opacity={0.4}
          scale={6}
          blur={qualityTier === 'high' ? 2.8 : 2.2}
          far={4}
        />
      )}
    </>
  );
}

const IceCreamModel = ({ celebrate = false }) => {
  const containerRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const [showThankYou, setShowThankYou] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [isDocumentVisible, setIsDocumentVisible] = useState(true);
  const [qualityTier, setQualityTier] = useState('medium');

  // Show "Thank you!" overlay during celebration
  useEffect(() => {
    if (celebrate) {
      setShowThankYou(true);
      const timer = setTimeout(() => setShowThankYou(false), CELEBRATE_DURATION * 1000);
      return () => clearTimeout(timer);
    }
  }, [celebrate]);

  useEffect(() => {
    const target = containerRef.current;
    if (!target || typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '140px 0px',
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const reducedMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateTier = () => {
      const reducedMotion = reducedMotionMedia.matches;
      const width = window.innerWidth;
      const cpuCores = typeof navigator !== 'undefined' && navigator.hardwareConcurrency
        ? navigator.hardwareConcurrency
        : 4;
      const deviceMemory = typeof navigator !== 'undefined' && navigator.deviceMemory
        ? navigator.deviceMemory
        : 4;

      if (reducedMotion) {
        setQualityTier('low');
        return;
      }

      const isDesktop = width >= 1024;

      if (isDesktop && cpuCores >= 8 && deviceMemory >= 8) {
        setQualityTier('high');
        return;
      }

      if (!isDesktop && (cpuCores <= 6 || deviceMemory <= 6)) {
        setQualityTier('low');
        return;
      }

      setQualityTier('medium');
    };

    updateTier();
    window.addEventListener('resize', updateTier, { passive: true });
    reducedMotionMedia.addEventListener('change', updateTier);

    return () => {
      window.removeEventListener('resize', updateTier);
      reducedMotionMedia.removeEventListener('change', updateTier);
    };
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

  const canvasDpr = qualityTier === 'high' ? [1, 1.6] : qualityTier === 'medium' ? [1, 1.35] : [1, 1];
  const glConfig = useMemo(
    () => ({
      antialias: qualityTier !== 'low',
      alpha: true,
      powerPreference: qualityTier === 'high' ? 'high-performance' : 'default',
    }),
    [qualityTier]
  );

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    // Normalize to -1 to 1
    mousePos.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mousePos.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
  };

  return (
    <div
      ref={containerRef}
      className="icecream-3d-container"
      onMouseMove={handleMouseMove}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 40 }}
        dpr={canvasDpr}
        frameloop={isInView && isDocumentVisible ? 'always' : 'never'}
        gl={glConfig}
        style={{ background: 'transparent' }}
      >
        <Scene mousePos={mousePos} celebrate={celebrate} qualityTier={qualityTier} />
      </Canvas>

      {/* Neon glow ring behind the model */}
      <div className={`icecream-glow ${celebrate ? 'celebrating' : ''}`} />

      {/* Thank you overlay */}
      {showThankYou && (
        <div className="icecream-thankyou">Thank you!</div>
      )}
    </div>
  );
};

// Preload the model
useGLTF.preload('/3d/CONTACT.glb');

export default IceCreamModel;
