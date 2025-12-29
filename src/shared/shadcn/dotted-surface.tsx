'use client';
import { cn } from '@/shared/shadcn/lib/utils';
import { useTheme } from 'next-themes';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'>;

export function DottedSurface({ className, ...props }: DottedSurfaceProps) {
  const { theme } = useTheme();

  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    particles: THREE.Points[];
    animationId: number;
    count: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const SEPARATION = 150;
    const AMOUNTX = 40;
    const AMOUNTY = 60;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 2000, 10000);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      10000,
    );
    camera.position.set(0, 355, 1220);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(scene.fog.color, 0);

    containerRef.current.appendChild(renderer.domElement);

    // Создаем кастомный шейдерный материал для точек с затуханием по расстоянию
    const vertexShader = `
      attribute float alpha;
      varying float vAlpha;
      
      void main() {
        vAlpha = alpha;
        
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = 36.0 * (300.0 / -mvPosition.z); // Размер зависит от расстояния
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      uniform vec3 color;
      varying float vAlpha;
      
      void main() {
        // Создаем круглые точки вместо квадратных
        vec2 uv = gl_PointCoord - vec2(0.5);
        float dist = length(uv);
        
        if (dist > 0.5) {
          discard;
        }
        
        // Плавное затухание краев
        float alpha = vAlpha * (1.0 - smoothstep(0.4, 0.5, dist));
        gl_FragColor = vec4(color, alpha);
      }
    `;

    // Создаем геометрию для частиц
    const geometry = new THREE.BufferGeometry();

    const positions: number[] = [];
    const alphas: number[] = []; // Массив значений прозрачности
    const colors: number[] = [];

    // Вычисляем максимальное расстояние для нормализации
    const maxDistance = Math.sqrt(
      Math.pow((AMOUNTX * SEPARATION) / 2, 2) +
      Math.pow((AMOUNTY * SEPARATION) / 2, 2)
    );

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
        const y = 0;
        const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;

        positions.push(x, y, z);

        // Вычисляем расстояние от центра сцены (или камеры)
        const distanceFromCenter = Math.sqrt(x * x + z * z);

        // Прозрачность от 1 (близко) до 0 (далеко)
        // Используем smoothstep для более плавного перехода
        let alpha = 1.0;

        // Вариант 1: Линейное затухание от центра
        // alpha = 1.0 - (distanceFromCenter / maxDistance);

        // Вариант 2: Затухание по расстоянию до камеры (более реалистично)
        const distanceToCamera = Math.sqrt(x * x + (y - camera.position.y) ** 2 + (z - camera.position.z) ** 2);
        const fadeStart = 1000; // Расстояние, с которого начинается затухание
        const fadeEnd = 4000;   // Расстояние, на котором точки становятся полностью прозрачными

        alpha = THREE.MathUtils.clamp(
          1.0 - (distanceToCamera - fadeStart) / (fadeEnd - fadeStart),
          0.0,
          1.0
        );

        alphas.push(alpha);
        colors.push(255, 255, 255);
      }
    }

    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3),
    );
    geometry.setAttribute(
      'alpha',
      new THREE.Float32BufferAttribute(alphas, 1),
    );
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    // Создаем шейдерный материал
    const material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0xffffff) },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      depthWrite: false,
    });

    // Создаем точки
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let count = 0;
    let animationId: number;

    // Функция анимации
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const positionAttribute = geometry.attributes.position;
      const alphaAttribute = geometry.attributes.alpha;
      const positions = positionAttribute.array as Float32Array;
      const alphas = alphaAttribute.array as Float32Array;

      let i = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const index = i * 3;
          const alphaIndex = i;

          // Анимируем Y позицию
          positions[index + 1] =
            Math.sin((ix + count) * 0.3) * 50 +
            Math.sin((iy + count) * 0.5) * 50;

          // Обновляем прозрачность в зависимости от нового положения
          const x = positions[index];
          const y = positions[index + 1];
          const z = positions[index + 2];

          // Пересчитываем расстояние до камеры с учетом новой Y позиции
          const distanceToCamera = Math.sqrt(
            x * x +
            (y - camera.position.y) ** 2 +
            (z - camera.position.z) ** 2
          );

          const fadeStart = 1000;
          const fadeEnd = 4000;

          alphas[alphaIndex] = THREE.MathUtils.clamp(
            1.0 - (distanceToCamera - fadeStart) / (fadeEnd - fadeStart),
            0.0,
            1.0
          );

          i++;
        }
      }

      positionAttribute.needsUpdate = true;
      alphaAttribute.needsUpdate = true;

      renderer.render(scene, camera);
      count += 0.1;
    };

    // Обработчик изменения размера окна
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Запускаем анимацию
    animate();

    // Сохраняем ссылки
    sceneRef.current = {
      scene,
      camera,
      renderer,
      particles: [points],
      animationId,
      count,
    };

    // Функция очистки
    return () => {
      window.removeEventListener('resize', handleResize);

      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);

        // Очищаем Three.js объекты
        sceneRef.current.scene.traverse((object) => {
          if (object instanceof THREE.Points) {
            object.geometry.dispose();
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });

        sceneRef.current.renderer.dispose();

        if (containerRef.current && sceneRef.current.renderer.domElement) {
          containerRef.current.removeChild(
            sceneRef.current.renderer.domElement,
          );
        }
      }
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className={cn('pointer-events-none inset-0 -z-1', className)}
      {...props}
    />
  );
}