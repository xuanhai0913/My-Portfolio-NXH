import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { useEffect, useRef, useState } from "react";

import './Aurora.css';

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ), 
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {              \
  int index = 0;                                            \
  for (int i = 0; i < 2; i++) {                               \
     ColorStop currentColor = colors[i];                    \
     bool isInBetween = currentColor.position <= factor;    \
     index = int(mix(float(index), float(i), float(isInBetween))); \
  }                                                         \
  ColorStop currentColor = colors[index];                   \
  ColorStop nextColor = colors[index + 1];                  \
  float range = nextColor.position - currentColor.position; \
  float lerpFactor = (factor - currentColor.position) / range; \
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  
  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);
  
  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);
  
  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;
  
  // midPoint is fixed; uBlend controls the transition width.
  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);
  
  vec3 auroraColor = intensity * rampColor;
  
  // Premultiplied alpha output.
  fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}
`;

export default function Aurora(props) {
  const {
    colorStops = ["#00d8ff", "#7cff67", "#00d8ff"],
    amplitude = 1.0,
    blend = 0.5,
    speed = 1.0
  } = props;
  
  const propsRef = useRef(props);
  propsRef.current = props;
  const ctnDom = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState(null);

  // Check if running in browser
  useEffect(() => {
    setIsClient(typeof window !== 'undefined');
  }, []);

  useEffect(() => {
    // Skip rendering on server or if there's an error
    if (!isClient || error) return;
    
    // Guard against missing container
    const ctn = ctnDom.current;
    if (!ctn) return;

    let renderer, gl, program, mesh, animateId;
    let resizeHandler; // Declare resizeHandler at this scope level

    try {
      // Initialize renderer with error handling
      renderer = new Renderer({
        alpha: true,
        premultipliedAlpha: true,
        antialias: true,
        powerPreference: 'default'
      });
      
      gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.canvas.style.backgroundColor = 'transparent';

      // Handle resize
      resizeHandler = () => { // Assign to the declared variable
        try {
          if (!ctn) return;
          const width = ctn.offsetWidth;
          const height = ctn.offsetHeight;
          renderer.setSize(width, height);
          if (program) {
            program.uniforms.uResolution.value = [width, height];
          }
        } catch (err) {
          console.error("Aurora resize error:", err);
          // Continue execution despite error
        }
      };
      
      window.addEventListener("resize", resizeHandler);

      // Create geometry
      const geometry = new Triangle(gl);
      if (geometry.attributes.uv) {
        delete geometry.attributes.uv;
      }

      // Parse color stops
      const colorStopsArray = colorStops.map((hex) => {
        try {
          const c = new Color(hex);
          return [c.r, c.g, c.b];
        } catch (err) {
          console.error("Color parsing error:", err);
          return [0.0, 0.5, 1.0]; // Fallback color
        }
      });

      // Create shader program
      program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        uniforms: {
          uTime: { value: 0 },
          uAmplitude: { value: amplitude },
          uColorStops: { value: colorStopsArray },
          uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
          uBlend: { value: blend }
        }
      });

      // Create mesh and add to container
      mesh = new Mesh(gl, { geometry, program });
      ctn.appendChild(gl.canvas);

      // Animation loop
      const update = (t) => {
        try {
          animateId = requestAnimationFrame(update);
          const currentSpeed = propsRef.current.speed ?? speed;
          program.uniforms.uTime.value = t * 0.001 * currentSpeed;
          program.uniforms.uAmplitude.value = propsRef.current.amplitude ?? amplitude;
          program.uniforms.uBlend.value = propsRef.current.blend ?? blend;
          
          const stops = propsRef.current.colorStops ?? colorStops;
          program.uniforms.uColorStops.value = stops.map((hex) => {
            try {
              const c = new Color(hex);
              return [c.r, c.g, c.b];
            } catch (err) {
              return [0.0, 0.5, 1.0]; // Fallback color
            }
          });
          
          renderer.render({ scene: mesh });
        } catch (err) {
          console.error("Aurora animation error:", err);
          // Continue rendering despite errors
        }
      };
      
      animateId = requestAnimationFrame(update);
      resizeHandler(); // Call resize handler initially
    } catch (err) {
      console.error("Aurora initialization error:", err);
      setError(err);
      return;
    }

    // Cleanup
    return () => {
      try {
        if (animateId) {
          cancelAnimationFrame(animateId);
        }
        
        window.removeEventListener("resize", resizeHandler); // Use the resizeHandler variable
        
        if (ctn && gl?.canvas && gl.canvas.parentNode === ctn) {
          ctn.removeChild(gl.canvas);
        }
        
        // Safe context loss
        if (gl) {
          const ext = gl.getExtension("WEBGL_lose_context");
          if (ext) ext.loseContext();
        }
      } catch (err) {
        console.error("Aurora cleanup error:", err);
      }
    };
  }, [isClient, error, amplitude, blend, colorStops, speed]);

  // Show fallback if not client-side or if error occurred
  if (!isClient || error) {
    return <div className="aurora-fallback" style={{ 
      background: `linear-gradient(45deg, ${colorStops[0]}, ${colorStops[1]}, ${colorStops[2]})`,
      opacity: 0.5
    }} />;
  }

  return <div ref={ctnDom} className="aurora-container" />;
}
