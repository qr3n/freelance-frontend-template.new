import type { StaticImageData } from 'next/image';

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface ColorExtractionOptions {
  quality?: number;
  centerWeight?: number;
  centerRadius?: number;
  excludeNeutral?: boolean;
  minSaturation?: number;
  preferVibrant?: boolean; // Приоритет ярким насыщенным цветам
}

/**
 * Получает самый яркий и насыщенный цвет из изображения
 */
export async function getDominantColor(
  imageSrc: StaticImageData | string,
  options: ColorExtractionOptions = {}
): Promise<RGB> {
  const {
    quality = 5,
    centerWeight = 0.8,
    centerRadius = 0.5,
    excludeNeutral = true,
    minSaturation = 25,
    preferVibrant = true
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = typeof imageSrc === 'string' ? imageSrc : imageSrc.src;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        const scaleFactor = 0.25;
        canvas.width = img.width * scaleFactor;
        canvas.height = img.height * scaleFactor;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
        const radiusThreshold = maxDistance * centerRadius;

        // Собираем цвета с их весами и характеристиками
        interface ColorCandidate {
          r: number;
          g: number;
          b: number;
          saturation: number;
          brightness: number;
          weight: number;
          score: number;
        }

        const colorCandidates: ColorCandidate[] = [];
        const step = Math.floor(10 / quality);

        for (let y = 0; y < canvas.height; y += step) {
          for (let x = 0; x < canvas.width; x += step) {
            const i = (y * canvas.width + x) * 4;

            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];

            // Вычисляем характеристики цвета
            const { saturation, brightness } = getColorMetrics(r, g, b);

            // Пропускаем нейтральные цвета
            if (excludeNeutral && saturation < minSaturation) continue;

            // Вычисляем расстояние от центра
            const dx = x - centerX;
            const dy = y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Вес на основе позиции
            let positionWeight = 1;
            if (distance < radiusThreshold) {
              const normalizedDist = distance / radiusThreshold;
              positionWeight = 1 + (1 - normalizedDist) * centerWeight * 4;
            } else {
              positionWeight = 1 - centerWeight;
            }

            // Общий скор: позиция × насыщенность × яркость
            let score = positionWeight;
            if (preferVibrant) {
              score *= (saturation / 100) * 2; // Насыщенность важнее
              score *= (brightness / 255) * 0.8; // Яркость тоже важна
            }

            colorCandidates.push({
              r, g, b,
              saturation,
              brightness,
              weight: positionWeight,
              score
            });
          }
        }

        if (colorCandidates.length === 0) {
          // Если после фильтрации нет цветов, вернём средний
          resolve({ r: 150, g: 150, b: 150 });
          return;
        }

        if (preferVibrant) {
          // Группируем похожие цвета
          const colorGroups = groupSimilarColors(colorCandidates, 40);

          // Находим группу с максимальным суммарным скором (площадь × яркость)
          const groupScores = colorGroups.map(group => {
            const totalScore = group.reduce((sum, c) => sum + c.score, 0);
            const avgSaturation = group.reduce((sum, c) => sum + c.saturation, 0) / group.length;
            return { group, score: totalScore * (avgSaturation / 100) };
          });

          groupScores.sort((a, b) => b.score - a.score);
          const bestGroup = groupScores[0].group;

          // Берём средний цвет из лучшей группы
          let r = 0, g = 0, b = 0;
          bestGroup.forEach(c => {
            r += c.r;
            g += c.g;
            b += c.b;
          });

          resolve({
            r: Math.round(r / bestGroup.length),
            g: Math.round(g / bestGroup.length),
            b: Math.round(b / bestGroup.length)
          });
        } else {
          // Взвешенное среднее
          let r = 0, g = 0, b = 0, totalWeight = 0;
          colorCandidates.forEach(c => {
            r += c.r * c.weight;
            g += c.g * c.weight;
            b += c.b * c.weight;
            totalWeight += c.weight;
          });

          resolve({
            r: Math.round(r / totalWeight),
            g: Math.round(g / totalWeight),
            b: Math.round(b / totalWeight)
          });
        }
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
  });
}

/**
 * Точный метод с k-means для множественных цветов
 */
export async function getDominantColorPrecise(
  imageSrc: StaticImageData | string,
  options: ColorExtractionOptions & { clusters?: number } = {}
): Promise<RGB> {
  const {
    clusters = 5,
    centerWeight = 0.8,
    centerRadius = 0.5,
    excludeNeutral = true,
    minSaturation = 25
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = typeof imageSrc === 'string' ? imageSrc : imageSrc.src;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        const scaleFactor = 0.2;
        canvas.width = img.width * scaleFactor;
        canvas.height = img.height * scaleFactor;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
        const radiusThreshold = maxDistance * centerRadius;

        interface WeightedColor extends RGB {
          weight: number;
        }

        const colors: WeightedColor[] = [];

        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const i = (y * canvas.width + x) * 4;

            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];

            // Пропускаем нейтральные цвета
            if (excludeNeutral) {
              const { saturation } = getColorMetrics(r, g, b);
              if (saturation < minSaturation) continue;
            }

            const dx = x - centerX;
            const dy = y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            let weight = 1;
            if (distance < radiusThreshold) {
              const normalizedDist = distance / radiusThreshold;
              weight = 1 + (1 - normalizedDist) * centerWeight * 4;
            } else {
              weight = 1 - centerWeight;
            }

            colors.push({ r, g, b, weight });
          }
        }

        if (colors.length === 0) {
          resolve({ r: 150, g: 150, b: 150 });
          return;
        }

        // k-means с учетом весов
        const centroids = kMeansWeighted(colors, clusters);

        // Находим самый яркий и насыщенный кластер
        const clusterScores = centroids.map(c => {
          const { saturation, brightness } = getColorMetrics(c.r, c.g, c.b);
          return saturation * brightness;
        });

        const bestIndex = clusterScores.indexOf(Math.max(...clusterScores));
        resolve(centroids[bestIndex]);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
  });
}

function kMeansWeighted(
  colors: Array<RGB & { weight: number }>,
  k: number,
  maxIterations: number = 10
): RGB[] {
  let centroids: RGB[] = [];

  const sortedByWeight = [...colors].sort((a, b) => b.weight - a.weight);
  for (let i = 0; i < k; i++) {
    const index = Math.floor((i / k) * sortedByWeight.length);
    centroids.push({
      r: sortedByWeight[index].r,
      g: sortedByWeight[index].g,
      b: sortedByWeight[index].b
    });
  }

  for (let iter = 0; iter < maxIterations; iter++) {
    const clusters: Array<RGB & { weight: number }>[] = Array.from({ length: k }, () => []);

    colors.forEach(color => {
      const closest = findClosestCentroid(color, centroids);
      clusters[closest].push(color);
    });

    centroids = clusters.map(cluster => {
      if (cluster.length === 0) return centroids[0];

      const totalWeight = cluster.reduce((sum, c) => sum + c.weight, 0);

      const sum = cluster.reduce((acc, c) => ({
        r: acc.r + c.r * c.weight,
        g: acc.g + c.g * c.weight,
        b: acc.b + c.b * c.weight
      }), { r: 0, g: 0, b: 0 });

      return {
        r: Math.round(sum.r / totalWeight),
        g: Math.round(sum.g / totalWeight),
        b: Math.round(sum.b / totalWeight)
      };
    });
  }

  return centroids;
}

function findClosestCentroid(color: RGB, centroids: RGB[]): number {
  let minDist = Infinity;
  let closest = 0;

  centroids.forEach((centroid, i) => {
    const dist = colorDistance(color, centroid);
    if (dist < minDist) {
      minDist = dist;
      closest = i;
    }
  });

  return closest;
}

function colorDistance(c1: RGB, c2: RGB): number {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );
}

/**
 * Группирует похожие цвета вместе
 */
function groupSimilarColors(
  colors: Array<{ r: number; g: number; b: number; score: number; saturation: number }>,
  threshold: number
): Array<Array<{ r: number; g: number; b: number; score: number; saturation: number }>> {
  if (colors.length === 0) return [];

  const groups: Array<Array<typeof colors[0]>> = [];
  const used = new Set<number>();

  colors.forEach((color, i) => {
    if (used.has(i)) return;

    const group = [color];
    used.add(i);

    // Находим все похожие цвета
    for (let j = i + 1; j < colors.length; j++) {
      if (used.has(j)) continue;

      const distance = colorDistance(color, colors[j]);
      if (distance < threshold) {
        group.push(colors[j]);
        used.add(j);
      }
    }

    groups.push(group);
  });

  return groups;
}

/**
 * Вычисляет метрики цвета: насыщенность и яркость
 */
function getColorMetrics(r: number, g: number, b: number): { saturation: number; brightness: number } {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  const saturation = max === 0 ? 0 : (delta / max) * 100;
  const brightness = max;

  return { saturation, brightness };
}

/**
 * Конвертирует RGB в hex строку
 */
export function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

/**
 * Конвертирует RGB в CSS строку
 */
export function rgbToCss(rgb: RGB): string {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

/**
 * Конвертирует RGB в RGBA с прозрачностью
 */
export function rgbToRgba(rgb: RGB, opacity: number): string {
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

/**
 * Конвертирует RGB в hex с прозрачностью
 */
export function rgbToHexAlpha(rgb: RGB, opacity: number): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  const alpha = Math.round(opacity * 255);
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}${toHex(alpha)}`;
}