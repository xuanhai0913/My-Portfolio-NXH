import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function IceCream({ mousePos }) {
  const { scene } = useGLTF('/3d/CONTACT.glb');
  const meshRef = useRef();
  const targetRotation = useRef({ x: 0, y: 0 });

  // Clone scene to avoid shared state issues
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Mouse tracking rotation (subtle)
    targetRotation.current.y = mousePos.current.x * 0.4;
    targetRotation.current.x = -mousePos.current.y * 0.2;

    // Smooth lerp to target
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      targetRotation.current.y,
      delta * 3
    );
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      targetRotation.current.x,
      delta * 3
    );
  });

  return (
    <group ref={meshRef}>
      <primitive object={clonedScene} scale={2.5} position={[0, -0.5, 0]} />
    </group>
  );
}

function Scene({ mousePos }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.2}
        color="#ffffff"
      />
      <pointLight position={[-3, 3, 2]} intensity={0.8} color="#d4ff00" />
      <pointLight position={[3, -2, -3]} intensity={0.4} color="#4a90e2" />

      {/* Floating Ice Cream */}
      <Float
        speed={2}
        rotationIntensity={0.3}
        floatIntensity={0.8}
        floatingRange={[-0.15, 0.15]}
      >
        <IceCream mousePos={mousePos} />
      </Float>

      {/* Shadow beneath */}
      <ContactShadows
        position={[0, -2.2, 0]}
        opacity={0.4}
        scale={6}
        blur={2.5}
        far={4}
      />
    </>
  );
}

const IceCreamModel = () => {
  const containerRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });

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
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene mousePos={mousePos} />
      </Canvas>

      {/* Neon glow ring behind the model */}
      <div className="icecream-glow" />
    </div>
  );
};

// Preload the model
useGLTF.preload('/3d/CONTACT.glb');

export default IceCreamModel;
