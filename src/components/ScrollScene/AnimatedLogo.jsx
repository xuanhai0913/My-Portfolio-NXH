import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedLogo = () => {
    const meshRef = useRef();
    const scroll = useScroll();
    const particlesRef = useRef();

    // Create particles
    const particles = useMemo(() => {
        const count = 50;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 8;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
        }
        return positions;
    }, []);

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        const offset = scroll.offset; // 0 to 1

        // Rotation: 0° → 180° → 360°
        meshRef.current.rotation.y = offset * Math.PI * 2;
        meshRef.current.rotation.x = Math.sin(offset * Math.PI) * 0.3;

        // Scale: 1 → 1.5 → 0.8
        const scale = offset < 0.5
            ? 1 + offset * 1 // 1 → 1.5
            : 1.5 - (offset - 0.5) * 1.4; // 1.5 → 0.8
        meshRef.current.scale.setScalar(scale);

        // Position: center → right side
        meshRef.current.position.x = offset * 4;
        meshRef.current.position.y = Math.sin(offset * Math.PI) * 0.5;

        // Floating animation
        meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.5) * 0.05;

        // Particles rotation
        if (particlesRef.current) {
            particlesRef.current.rotation.y += delta * 0.1;
            particlesRef.current.rotation.x = offset * 0.5;
        }
    });

    return (
        <group>
            {/* Main TorusKnot Logo */}
            <mesh ref={meshRef}>
                <torusKnotGeometry args={[1, 0.35, 128, 32]} />
                <meshStandardMaterial
                    color="#CCFF00"
                    metalness={0.9}
                    roughness={0.1}
                    emissive="#CCFF00"
                    emissiveIntensity={0.2}
                />
            </mesh>

            {/* Particles */}
            <points ref={particlesRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={particles.length / 3}
                        array={particles}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.05}
                    color="#CCFF00"
                    transparent
                    opacity={0.6}
                    sizeAttenuation
                />
            </points>

            {/* Lighting */}
            <ambientLight intensity={0.2} />
            <pointLight position={[5, 5, 5]} intensity={1} color="#CCFF00" />
            <pointLight position={[-5, -5, -5]} intensity={0.5} color="#ffffff" />
            <spotLight
                position={[0, 10, 0]}
                angle={0.3}
                penumbra={1}
                intensity={0.5}
                color="#CCFF00"
            />
        </group>
    );
};

export default AnimatedLogo;
