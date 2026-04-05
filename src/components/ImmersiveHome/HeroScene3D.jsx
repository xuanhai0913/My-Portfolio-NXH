import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

const GlassOrb = () => {
  const groupRef = useRef(null);
  const shellRef = useRef(null);
  const wiresRef = useRef(null);
  const starsRef = useRef(null);

  const starPositions = useMemo(() => {
    const count = 1100;
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
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const elapsed = state.clock.getElapsedTime();

    groupRef.current.rotation.y += delta * 0.2;
    groupRef.current.rotation.x = Math.sin(elapsed * 0.35) * 0.08;

    if (shellRef.current) {
      shellRef.current.rotation.y -= delta * 0.18;
      shellRef.current.scale.x = 1 + Math.sin(elapsed * 0.8) * 0.03;
      shellRef.current.scale.y = 1 + Math.cos(elapsed * 0.65) * 0.035;
    }

    if (wiresRef.current) {
      wiresRef.current.rotation.z += delta * 0.12;
      wiresRef.current.rotation.x += delta * 0.07;
    }

    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.015;
      starsRef.current.rotation.x -= delta * 0.01;
    }
  });

  return (
    <>
      <color attach="background" args={['#02040a']} />
      <fog attach="fog" args={['#02040a', 6, 24]} />

      <ambientLight intensity={0.38} color="#6fd6ff" />
      <directionalLight position={[2.5, 2.8, 2.2]} intensity={1.15} color="#ffdb9d" />
      <pointLight position={[-2.5, -1.2, 2]} intensity={0.65} color="#5cf4ff" />

      <group ref={groupRef}>
        <mesh ref={shellRef}>
          <icosahedronGeometry args={[1.7, 6]} />
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
          <torusKnotGeometry args={[1.25, 0.14, 240, 24]} />
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
  return (
    <Canvas
      className="hero-canvas"
      camera={{ position: [0, 0, 6], fov: 44 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <GlassOrb />
    </Canvas>
  );
};

export default HeroScene3D;
