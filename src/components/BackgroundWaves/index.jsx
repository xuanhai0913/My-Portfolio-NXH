import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import './styles.css';

const WavePlane = () => {
  const materialRef = useRef();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#d4ff00') }, // Neon lime
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  // A fragment shader rendering a moving grid/wave pattern
  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;

    // Simplex noise (simplified)
    float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }
    float noise(vec2 x) {
      vec2 i = floor(x);
      vec2 f = fract(x);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
      // Create a grid layout, displaced by noise
      vec2 uv = vUv * 15.0; // scale up
      
      // Animate UV based on time
      float n = noise(uv * 0.5 + uTime * 0.2);
      
      // Calculate lines
      vec2 grid = fract(uv + vec2(n, n) * 2.0);
      
      // Render thin neon lines
      float lines = smoothstep(0.0, 0.05, grid.x) * smoothstep(0.0, 0.05, grid.y);
      lines = 1.0 - lines; // invert
      
      // Add glow and fade at the edges
      float fade = smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
      float alpha = lines * fade * 0.15; // extremely subtle
      
      gl_FragColor = vec4(uColor, alpha);
    }
  `;

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
};

const BackgroundWaves = () => {
  return (
    <div className="bg-waves-container">
      {/* We use an orthographic camera spreading exactly the screen space */}
      <Canvas orthographic camera={{ position: [0, 0, 1], zoom: 1 }}>
        <WavePlane />
      </Canvas>
    </div>
  );
};

export default BackgroundWaves;
