import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ============================================================
   ABSTRACT SCULPTURE — Active Theory-inspired centerpiece
   A large, morphing metallic shape with environment reflections,
   particle aura, and mouse-reactive rotation.
   ============================================================ */

/**
 * Custom vertex shader that displaces vertices with layered noise,
 * creating an organic, morphing blob effect.
 */
const sculptureVertexShader = `
  uniform float uTime;
  uniform float uMorph;
  uniform vec2 uMouse;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;

  // Simplex-ish noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vNormal = normal;
    vPosition = position;

    // Layered noise displacement
    float noise1 = snoise(position * 1.5 + uTime * 0.3) * 0.2;
    float noise2 = snoise(position * 3.0 - uTime * 0.5) * 0.1;
    float noise3 = snoise(position * 6.0 + uTime * 0.2) * 0.04;

    float displacement = (noise1 + noise2 + noise3) * uMorph;
    vDisplacement = displacement;

    // Mouse influence — subtle attraction
    vec3 mouseDir = vec3(uMouse.x * 0.3, uMouse.y * 0.3, 0.0);
    vec3 displaced = position + normal * displacement + mouseDir * 0.05;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const sculptureFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;

  void main() {
    // Fresnel-like rim lighting
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 3.0);

    // Color gradient based on displacement + position
    float t = vDisplacement * 2.0 + 0.5;
    vec3 color = mix(uColor1, uColor2, smoothstep(-0.3, 0.3, t));
    color = mix(color, uColor3, fresnel * 0.8);

    // Metallic sheen
    float specular = pow(max(dot(reflect(-viewDir, vNormal), vec3(0.5, 1.0, 0.5)), 0.0), 32.0);
    color += vec3(specular * 0.4);

    // Edge glow
    color += uColor3 * fresnel * 0.6;

    // Pulsing alpha
    float alpha = 0.85 + fresnel * 0.15;

    gl_FragColor = vec4(color, alpha);
  }
`;

/**
 * AbstractSculpture — The main 3D centerpiece.
 * A morphing icosphere with custom shaders.
 */
const AbstractSculpture = ({ mouseRef, scrollRef }) => {
  const meshRef = useRef();
  const materialRef = useRef();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMorph: { value: 1.0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColor1: { value: new THREE.Color('#0a0a0a') },     // Deep black
      uColor2: { value: new THREE.Color('#d4ff00') },      // Neon lime
      uColor3: { value: new THREE.Color('#ffffff') },      // White rim
    }),
    []
  );

  useFrame((state) => {
    if (!materialRef.current || !meshRef.current) return;
    const t = state.clock.elapsedTime;

    // Update shader time
    materialRef.current.uniforms.uTime.value = t;

    // Mouse reactivity
    const mx = mouseRef?.current?.x || 0;
    const my = mouseRef?.current?.y || 0;
    materialRef.current.uniforms.uMouse.value.set(mx, my);

    // Slow rotation
    meshRef.current.rotation.y = t * 0.15;
    meshRef.current.rotation.x = Math.sin(t * 0.1) * 0.2;
    meshRef.current.rotation.z = Math.cos(t * 0.08) * 0.1;

    // Gentle floating
    meshRef.current.position.y = Math.sin(t * 0.4) * 0.15;

    // Scroll-driven scale pulse
    const scrollY = scrollRef?.current || 0;
    const scrollScale = Math.max(0.6, 1.0 - scrollY * 0.0003);
    meshRef.current.scale.setScalar(scrollScale);
  });

  return (
    <mesh ref={meshRef} position={[3.0, 0, 0]}>
      <icosahedronGeometry args={[1.4, 28]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={sculptureVertexShader}
        fragmentShader={sculptureFragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

/**
 * OrbitalRing — Glowing ring orbiting the sculpture
 */
const OrbitalRing = ({ radius = 3, speed = 0.3, tilt = 0 }) => {
  const ringRef = useRef();

  useFrame((state) => {
    if (!ringRef.current) return;
    const t = state.clock.elapsedTime;
    ringRef.current.rotation.z = tilt;
    ringRef.current.rotation.y = t * speed;
    ringRef.current.rotation.x = t * speed * 0.5;
  });

  return (
    <mesh ref={ringRef} position={[3.0, 0, 0]}>
      <torusGeometry args={[radius, 0.008, 16, 100]} />
      <meshBasicMaterial
        color="#d4ff00"
        transparent
        opacity={0.25}
      />
    </mesh>
  );
};

/**
 * Particles — Ambient floating dots around the sculpture
 */
const AuraParticles = ({ count = 200, scrollRef }) => {
  const pointsRef = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 5;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta) + 3.0;
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    pointsRef.current.rotation.y = t * 0.03;
    pointsRef.current.rotation.x = Math.sin(t * 0.05) * 0.1;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#d4ff00"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

/**
 * HeroParticles — Main canvas component.
 * Renders the abstract sculpture + orbital rings + particle aura.
 */
const HeroParticles = () => {
  const scrollRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => {
      scrollRef.current = window.scrollY;
    };
    const onMouse = (e) => {
      // Normalize to -1 to 1
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouse, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouse);
    };
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
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.15} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#d4ff00" />
        <pointLight position={[-5, -3, -5]} intensity={0.4} color="#ffffff" />
        <pointLight position={[0, -5, 3]} intensity={0.3} color="#4488ff" />

        {/* Main sculpture */}
        <AbstractSculpture mouseRef={mouseRef} scrollRef={scrollRef} />

        {/* Orbital rings */}
        <OrbitalRing radius={2.2} speed={0.2} tilt={0.3} />
        <OrbitalRing radius={2.5} speed={-0.15} tilt={-0.5} />
        <OrbitalRing radius={2.0} speed={0.25} tilt={1.2} />

        {/* Particle aura */}
        <AuraParticles count={150} scrollRef={scrollRef} />
      </Canvas>
    </div>
  );
};

export default HeroParticles;
