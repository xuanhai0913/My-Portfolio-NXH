import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll } from '@react-three/drei';
import { Link } from 'react-router-dom';
import profileImage from '../../images/profile.png';
import './Hero3D.css';

// Animated 3D Logo
const AnimatedLogo = () => {
    const meshRef = useRef();
    const scroll = useScroll();

    useFrame((state) => {
        if (!meshRef.current) return;

        const offset = scroll.offset;

        // Rotation
        meshRef.current.rotation.y = offset * Math.PI * 2;
        meshRef.current.rotation.x = Math.sin(offset * Math.PI) * 0.3;

        // Scale
        const scale = offset < 0.5
            ? 1 + offset * 1
            : 1.5 - (offset - 0.5) * 1.4;
        meshRef.current.scale.setScalar(scale);

        // Position
        meshRef.current.position.x = offset * 4;
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    });

    return (
        <mesh ref={meshRef}>
            <torusKnotGeometry args={[1, 0.35, 128, 32]} />
            <meshStandardMaterial
                color="#d4ff00" /* Neon Lime */
                metalness={0.9}
                roughness={0.1}
                emissive="#d4ff00"
                emissiveIntensity={0.2}
            />
        </mesh>
    );
};

// Scene with Lights
const Scene = () => (
    <>
        <AnimatedLogo />
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#d4ff00" />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#ffffff" />
    </>
);

const Hero3D = () => {
    return (
        <div className="hero3d-container">
            <Link to="/" className="close-3d">×</Link>

            <Canvas
                camera={{ position: [0, 0, 6], fov: 50 }}
                gl={{ antialias: true, alpha: true }}
                style={{ background: 'transparent' }}
            >
                <Suspense fallback={null}>
                    <ScrollControls pages={3} damping={0.2}>
                        {/* 3D Content */}
                        <Scroll>
                            <Scene />
                        </Scroll>

                        {/* HTML Overlay */}
                        <Scroll html style={{ width: '100%' }}>
                            {/* Page 1 - Hero */}
                            <div className="scroll-page page-1">
                                <div className="scroll-content">
                                    <h1 className="scroll-title">
                                        FULL-STACK <br />
                                        <span className="scroll-highlight">DEVELOPER</span>
                                    </h1>
                                    <div className="scroll-description">
                                        <p>
                                            Building digital experiences with modern web technologies.
                                        </p>
                                    </div>
                                </div>
                                <div className="scroll-indicator">
                                    <span>SCROLL DOWN</span>
                                    <div className="scroll-arrow"></div>
                                </div>
                            </div>

                            {/* Page 2 - About */}
                            <div className="scroll-page page-2">
                                <div className="scroll-content center">
                                    <h2 className="scroll-subtitle">NGUYỄN XUÂN HẢI</h2>
                                    <div className="scroll-image-box">
                                        <img src={profileImage} alt="Profile" />
                                    </div>
                                    <div className="scroll-tags">
                                        {['React', 'Node.js', 'TypeScript', 'SQL'].map((s) => (
                                            <span key={s} className="scroll-tag">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Page 3 - CTA */}
                            <div className="scroll-page page-3">
                                <div className="scroll-content center">
                                    <h2 className="scroll-subtitle">EXPLORE MY WORK</h2>
                                    <Link to="/" className="scroll-btn-accent">
                                        ENTER PORTFOLIO <i className="fa-solid fa-arrow-down"></i>
                                    </Link>
                                </div>
                            </div>
                        </Scroll>
                    </ScrollControls>
                </Suspense>
            </Canvas>
        </div>
    );
};

export default Hero3D;
