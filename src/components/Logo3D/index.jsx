import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import './Logo3D.css';

/**
 * Logo3D Component
 * Interactive 3D logo with mouse parallax effect
 * Uses Three.js directly (already in dependencies)
 */
const Logo3D = () => {
    const containerRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const meshRef = useRef(null);
    const frameIdRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Scene setup
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Camera setup
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 5;
        cameraRef.current = camera;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Create main geometry - TorusKnot for professional look
        const geometry = new THREE.TorusKnotGeometry(1.2, 0.4, 128, 32, 2, 3);

        // Create gradient material with glow effect
        const material = new THREE.MeshStandardMaterial({
            color: 0x4a90e2,
            metalness: 0.7,
            roughness: 0.2,
            emissive: 0x1a4070,
            emissiveIntensity: 0.3,
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        meshRef.current = mesh;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0x4a90e2, 2, 100);
        pointLight1.position.set(5, 5, 5);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xff94b4, 1.5, 100);
        pointLight2.position.set(-5, -5, 5);
        scene.add(pointLight2);

        const pointLight3 = new THREE.PointLight(0x3a29ff, 1, 100);
        pointLight3.position.set(0, 5, -5);
        scene.add(pointLight3);

        // Particles around the logo
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 200;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 10;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            color: 0x4a90e2,
            transparent: true,
            opacity: 0.6,
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // Animation loop
        let time = 0;
        const animate = () => {
            time += 0.01;
            frameIdRef.current = requestAnimationFrame(animate);

            // Smooth mouse follow
            mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
            mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

            // Rotate mesh based on mouse + auto rotation
            if (meshRef.current) {
                meshRef.current.rotation.x = mouseRef.current.y * 0.3 + time * 0.2;
                meshRef.current.rotation.y = mouseRef.current.x * 0.3 + time * 0.3;
            }

            // Rotate particles slowly
            particlesMesh.rotation.y = time * 0.05;
            particlesMesh.rotation.x = time * 0.03;

            renderer.render(scene, camera);
        };

        animate();
        setIsLoaded(true);

        // Mouse move handler
        const handleMouseMove = (e) => {
            const rect = container.getBoundingClientRect();
            mouseRef.current.targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            mouseRef.current.targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        };

        // Resize handler
        const handleResize = () => {
            const newWidth = container.clientWidth;
            const newHeight = container.clientHeight;

            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        };

        container.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            cancelAnimationFrame(frameIdRef.current);
            container.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);

            if (rendererRef.current && container.contains(rendererRef.current.domElement)) {
                container.removeChild(rendererRef.current.domElement);
            }

            geometry.dispose();
            material.dispose();
            particlesGeometry.dispose();
            particlesMaterial.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={`logo-3d-container ${isLoaded ? 'loaded' : ''}`}
            aria-label="Interactive 3D Logo"
            role="img"
        >
            {!isLoaded && (
                <div className="logo-3d-loader">
                    <div className="loader-spinner"></div>
                </div>
            )}
        </div>
    );
};

export default Logo3D;
