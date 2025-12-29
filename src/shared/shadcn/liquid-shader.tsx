import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export interface InteractiveNebulaShaderProps {
  hasActiveReminders?: boolean;
  hasUpcomingReminders?: boolean;
  disableCenterDimming?: boolean;
  className?: string;
}

export function InteractiveNebulaShader({
                                          hasActiveReminders = false,
                                          hasUpcomingReminders = false,
                                          disableCenterDimming = false,
                                          className = "",
                                        }: InteractiveNebulaShaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const materialRef = useRef<THREE.ShaderMaterial>();

  useEffect(() => {
    const mat = materialRef.current;
    if (mat) {
      mat.uniforms.hasActiveReminders.value = hasActiveReminders;
      mat.uniforms.hasUpcomingReminders.value = hasUpcomingReminders;
      mat.uniforms.disableCenterDimming.value = disableCenterDimming;
    }
  }, [hasActiveReminders, hasUpcomingReminders, disableCenterDimming]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    });

    // Используем нормальное разрешение
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const clock = new THREE.Clock();

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    // Оптимизированный шейдер
    const fragmentShader = `
      precision mediump float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform bool hasActiveReminders;
      uniform bool hasUpcomingReminders;
      uniform bool disableCenterDimming;
      varying vec2 vUv;

      #define t iTime
      
      // Быстрая версия mat2
      mat2 m(float a) { 
        float c = cos(a), s = sin(a); 
        return mat2(c, -s, s, c); 
      }
      
      // Упрощенная функция map
      float map(vec3 p) {
        p.xz *= m(t * 0.4);
        p.xy *= m(t * 0.3);
        vec3 q = p * 2.0 + t;
        return length(p + vec3(sin(t * 0.7))) * log(length(p) + 1.0)
             + sin(q.x + sin(q.z + sin(q.y))) * 0.5 - 1.0;
      }

      void mainImage(out vec4 O, in vec2 fragCoord) {
        vec2 uv = fragCoord / min(iResolution.x, iResolution.y) - vec2(0.9, 0.5);
        uv.x += 0.4;
        vec3 col = vec3(0.0);
        float d = 2.5;

        // Балансируем между качеством и производительностью
        for (int i = 0; i < 8; i++) {
          vec3 p = vec3(0.0, 0.0, 5.0) + normalize(vec3(uv, -1.0)) * d;
          float rz = map(p);
          float f = clamp((rz - map(p + 0.1)) * 0.5, -0.1, 1.0);

          // Предварительно вычисляем цвета
          vec3 base;
          if (hasActiveReminders) {
            base = vec3(0.05, 0.2, 0.5) + vec3(4.0, 2.0, 5.0) * f;
          } else if (hasUpcomingReminders) {
            base = vec3(0.05, 0.3, 0.1) + vec3(2.0, 5.0, 1.0) * f;
          } else {
            base = vec3(0.1, 0.3, 0.4) + vec3(5.0, 2.5, 3.0) * f;
          }

          col = col * base + smoothstep(2.5, 0.0, rz) * 0.7 * base;
          d += min(rz, 1.0);
        }

        // Упрощенное затемнение центра
        if (!disableCenterDimming) {
          float dist = distance(fragCoord, iResolution * 0.5);
          float radius = min(iResolution.x, iResolution.y) * 0.5;
          float dim = smoothstep(radius * 0.3, radius * 0.5, dist);
          col = mix(col * 0.3, col, dim);
        }

        O = vec4(col, 1.0);
      }

      void main() {
        mainImage(gl_FragColor, vUv * iResolution);
      }
    `;

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2() },
      hasActiveReminders: { value: hasActiveReminders },
      hasUpcomingReminders: { value: hasUpcomingReminders },
      disableCenterDimming: { value: disableCenterDimming },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      depthTest: false,
      depthWrite: false
    });
    materialRef.current = material;

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.iResolution.value.set(w, h);
    };

    window.addEventListener("resize", onResize);
    onResize();

    // Ограничиваем FPS до 45 для баланса плавности и производительности
    let lastTime = 0;
    const targetFPS = 45;
    const frameDelay = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;

      if (deltaTime >= frameDelay) {
        uniforms.iTime.value = clock.getElapsedTime();
        renderer.render(scene, camera);
        lastTime = currentTime - (deltaTime % frameDelay);
      }

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", onResize);
      container.removeChild(renderer.domElement);
      material.dispose();
      mesh.geometry.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 transform-gpu ${className}`}
      aria-label="Interactive nebula background"
      style={{ willChange: "transform" }} // Подсказка браузеру для GPU композитинга
    />
  );
}