import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * ParticleField — Floating particles that react to scroll position.
 * Inspired by Active Theory's ambient particle systems.
 * Uses GPU-instanced points for performance.
 */
const Particles = ({ count = 300, scrollRef }) => {
  const meshRef = useRef();
  const { viewport } = useThree();

  const [positions, sizes, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const spd = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Spread particles across viewport with depth
      pos[i * 3] = (Math.random() - 0.5) * 16;     // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;  // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;  // z

      sz[i] = Math.random() * 0.04 + 0.01;
      spd[i] = Math.random() * 0.4 + 0.1;
    }

    return [pos, sz, spd];
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const geo = meshRef.current.geometry;
    const posArr = geo.attributes.position.array;
    const time = state.clock.elapsedTime;

    // Subtle scroll-driven depth shift
    const scrollY = scrollRef?.current || 0;
    const scrollFactor = scrollY * 0.0005;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const speed = speeds[i];

      // Gentle floating motion
      posArr[i3 + 1] += Math.sin(time * speed + i) * 0.002;

      // Very slow drift upward
      posArr[i3 + 1] += 0.001 * speed;

      // Scroll pushes particles in Z (parallax depth)
      posArr[i3 + 2] = positions[i3 + 2] - scrollFactor * speed * 3;

      // Recycle particles that drift off screen
      if (posArr[i3 + 1] > 7) posArr[i3 + 1] = -7;
    }

    geo.attributes.position.needsUpdate = true;

    // Gentle global rotation
    meshRef.current.rotation.y = time * 0.02;
    meshRef.current.rotation.x = Math.sin(time * 0.1) * 0.05;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#d4ff00"
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

/**
 * FloatingGeometry — Subtle wireframe geometric shapes
 * drifting in the background, adding depth.
 */
const FloatingShape = ({ position, rotationSpeed, shape = 'torus' }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x = t * rotationSpeed.x;
    meshRef.current.rotation.y = t * rotationSpeed.y;
    meshRef.current.rotation.z = t * rotationSpeed.z;

    // Gentle bob
    meshRef.current.position.y =
      position[1] + Math.sin(t * 0.5 + position[0]) * 0.3;
  });

  const geometry = useMemo(() => {
    switch (shape) {
      case 'icosa':
        return <icosahedronGeometry args={[0.6, 0]} />;
      case 'octa':
        return <octahedronGeometry args={[0.5, 0]} />;
      case 'dodeca':
        return <dodecahedronGeometry args={[0.5, 0]} />;
      default:
        return <torusGeometry args={[0.5, 0.15, 8, 16]} />;
    }
  }, [shape]);

  return (
    <mesh ref={meshRef} position={position}>
      {geometry}
      <meshBasicMaterial
        color="#d4ff00"
        wireframe
        transparent
        opacity={0.08}
      />
    </mesh>
  );
};

/**
 * HeroParticles — Full canvas component for Profile section background.
 * Renders behind HTML content with pointer-events: none.
 */
const HeroParticles = () => {
  const scrollRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Skip on reduced motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) return null;

  return (
    <div className="hero-particles-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'low-power',
        }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <Particles count={250} scrollRef={scrollRef} />

        {/* Floating wireframe shapes at varying depths */}
        <FloatingShape
          position={[-5, 2, -4]}
          rotationSpeed={{ x: 0.1, y: 0.15, z: 0.05 }}
          shape="icosa"
        />
        <FloatingShape
          position={[5, -1, -6]}
          rotationSpeed={{ x: 0.08, y: 0.12, z: 0.06 }}
          shape="octa"
        />
        <FloatingShape
          position={[0, 3, -8]}
          rotationSpeed={{ x: 0.06, y: 0.1, z: 0.08 }}
          shape="dodeca"
        />
        <FloatingShape
          position={[-3, -3, -5]}
          rotationSpeed={{ x: 0.12, y: 0.08, z: 0.04 }}
          shape="torus"
        />
      </Canvas>
    </div>
  );
};

export default HeroParticles;
