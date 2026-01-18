import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import AnimatedLogo from './AnimatedLogo';
import './ScrollScene.css';

const ScrollScene = ({ children }) => {
    return (
        <div className="scroll-scene-container">
            <Canvas
                className="scroll-canvas"
                camera={{ position: [0, 0, 6], fov: 50 }}
                gl={{ antialias: true, alpha: true }}
            >
                <Suspense fallback={null}>
                    <ScrollControls pages={3} damping={0.2}>
                        {/* 3D Content */}
                        <Scroll>
                            <AnimatedLogo />
                        </Scroll>

                        {/* HTML Overlay Content */}
                        <Scroll html style={{ width: '100%' }}>
                            <div className="scroll-html-content">
                                {children}
                            </div>
                        </Scroll>
                    </ScrollControls>
                </Suspense>
            </Canvas>
        </div>
    );
};

export default ScrollScene;
