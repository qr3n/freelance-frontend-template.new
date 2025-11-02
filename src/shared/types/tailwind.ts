// ===== БАЗОВЫЕ ТИПЫ =====
export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

// Кастомные цвета из вашего конфига
export type CustomColorName = 'emerald' | 'lime' | 'golden' | 'sage' | 'forest' | 'taupe';

// Стандартные Tailwind цвета
export type StandardColorName =
  | 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone'
  | 'red' | 'orange' | 'amber' | 'yellow' | 'lime'
  | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky'
  | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia'
  | 'pink' | 'rose';

// Все цвета
export type ColorName = CustomColorName | StandardColorName;

// ===== ЦВЕТОВЫЕ УТИЛИТЫ =====
export type TailwindBgColor =
  | `bg-${ColorName}-${ColorShade}`
  | 'bg-transparent'
  | 'bg-current'
  | 'bg-inherit'
  | 'bg-white'
  | 'bg-black';

export type TailwindTextColor =
  | `text-${ColorName}-${ColorShade}`
  | 'text-transparent'
  | 'text-current'
  | 'text-inherit'
  | 'text-white'
  | 'text-black';

export type TailwindBorderColor =
  | `border-${ColorName}-${ColorShade}`
  | 'border-transparent'
  | 'border-current'
  | 'border-inherit'
  | 'border-white'
  | 'border-black';

export type TailwindRingColor =
  | `ring-${ColorName}-${ColorShade}`
  | 'ring-transparent'
  | 'ring-current'
  | 'ring-inherit'
  | 'ring-white'
  | 'ring-black';

// ===== РАЗМЕРЫ И SPACING =====
export type SpacingScale =
  | '0' | 'px' | '0.5' | '1' | '1.5' | '2' | '2.5' | '3' | '3.5' | '4' | '5' | '6'
  | '7' | '8' | '9' | '10' | '11' | '12' | '14' | '16' | '20' | '24' | '28' | '32'
  | '36' | '40' | '44' | '48' | '52' | '56' | '60' | '64' | '72' | '80' | '96';

export type TailwindPadding = `p-${SpacingScale}` | `px-${SpacingScale}` | `py-${SpacingScale}` | `pt-${SpacingScale}` | `pr-${SpacingScale}` | `pb-${SpacingScale}` | `pl-${SpacingScale}`;
export type TailwindMargin = `m-${SpacingScale}` | `mx-${SpacingScale}` | `my-${SpacingScale}` | `mt-${SpacingScale}` | `mr-${SpacingScale}` | `mb-${SpacingScale}` | `ml-${SpacingScale}` | 'auto';
export type TailwindGap = `gap-${SpacingScale}` | `gap-x-${SpacingScale}` | `gap-y-${SpacingScale}`;

// ===== РАЗМЕРЫ ЭЛЕМЕНТОВ =====
export type SizeScale = SpacingScale | 'auto' | 'full' | 'screen' | 'min' | 'max' | 'fit';
export type TailwindWidth = `w-${SizeScale}` | 'w-1/2' | 'w-1/3' | 'w-2/3' | 'w-1/4' | 'w-2/4' | 'w-3/4' | 'w-1/5' | 'w-2/5' | 'w-3/5' | 'w-4/5';
export type TailwindHeight = `h-${SizeScale}` | 'h-1/2' | 'h-1/3' | 'h-2/3' | 'h-1/4' | 'h-2/4' | 'h-3/4' | 'h-1/5' | 'h-2/5' | 'h-3/5' | 'h-4/5' | 'h-screen' | 'h-dvh' | 'h-lvh' | 'h-svh';

// ===== ТИПОГРАФИЯ =====
export type FontSize = 'text-xs' | 'text-sm' | 'text-base' | 'text-lg' | 'text-xl' | 'text-2xl' | 'text-3xl' | 'text-4xl' | 'text-5xl' | 'text-6xl' | 'text-7xl' | 'text-8xl' | 'text-9xl';
export type FontWeight = 'font-thin' | 'font-extralight' | 'font-light' | 'font-normal' | 'font-medium' | 'font-semibold' | 'font-bold' | 'font-extrabold' | 'font-black';
export type TextAlign = 'text-left' | 'text-center' | 'text-right' | 'text-justify';
export type LineHeight = 'leading-3' | 'leading-4' | 'leading-5' | 'leading-6' | 'leading-7' | 'leading-8' | 'leading-9' | 'leading-10' | 'leading-none' | 'leading-tight' | 'leading-snug' | 'leading-normal' | 'leading-relaxed' | 'leading-loose';

// ===== FLEXBOX & GRID =====
export type FlexDirection = 'flex-row' | 'flex-row-reverse' | 'flex-col' | 'flex-col-reverse';
export type FlexWrap = 'flex-wrap' | 'flex-wrap-reverse' | 'flex-nowrap';
export type JustifyContent = 'justify-normal' | 'justify-start' | 'justify-end' | 'justify-center' | 'justify-between' | 'justify-around' | 'justify-evenly' | 'justify-stretch';
export type AlignItems = 'items-start' | 'items-end' | 'items-center' | 'items-baseline' | 'items-stretch';
export type FlexGrow = 'flex-1' | 'flex-auto' | 'flex-initial' | 'flex-none';

export type GridCols = 'grid-cols-1' | 'grid-cols-2' | 'grid-cols-3' | 'grid-cols-4' | 'grid-cols-5' | 'grid-cols-6' | 'grid-cols-7' | 'grid-cols-8' | 'grid-cols-9' | 'grid-cols-10' | 'grid-cols-11' | 'grid-cols-12' | 'grid-cols-none';
export type GridRows = 'grid-rows-1' | 'grid-rows-2' | 'grid-rows-3' | 'grid-rows-4' | 'grid-rows-5' | 'grid-rows-6' | 'grid-rows-none';

// ===== ПОЗИЦИОНИРОВАНИЕ =====
export type Position = 'static' | 'fixed' | 'absolute' | 'relative' | 'sticky';
export type Display = 'block' | 'inline-block' | 'inline' | 'flex' | 'inline-flex' | 'table' | 'inline-table' | 'table-caption' | 'table-cell' | 'table-column' | 'table-column-group' | 'table-footer-group' | 'table-header-group' | 'table-row-group' | 'table-row' | 'flow-root' | 'grid' | 'inline-grid' | 'contents' | 'list-item' | 'hidden';

// ===== ГРАНИЦА И РАДИУС =====
export type BorderWidth = 'border' | 'border-0' | 'border-2' | 'border-4' | 'border-8' | `border-${'t'|'r'|'b'|'l'|'x'|'y'}` | `border-${'t'|'r'|'b'|'l'|'x'|'y'}-${'0'|'2'|'4'|'8'}`;
export type BorderRadius = 'rounded' | 'rounded-none' | 'rounded-sm' | 'rounded-md' | 'rounded-lg' | 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl' | 'rounded-full' | `rounded-${'t'|'r'|'b'|'l'|'tl'|'tr'|'br'|'bl'}-${'none'|'sm'|'md'|'lg'|'xl'|'2xl'|'3xl'|'full'}`;

// ===== ТЕНИ И ЭФФЕКТЫ =====
export type BoxShadow = 'shadow' | 'shadow-sm' | 'shadow-md' | 'shadow-lg' | 'shadow-xl' | 'shadow-2xl' | 'shadow-inner' | 'shadow-none';
export type Opacity = 'opacity-0' | 'opacity-5' | 'opacity-10' | 'opacity-20' | 'opacity-25' | 'opacity-30' | 'opacity-40' | 'opacity-50' | 'opacity-60' | 'opacity-70' | 'opacity-75' | 'opacity-80' | 'opacity-90' | 'opacity-95' | 'opacity-100';

// ===== СОСТАВНЫЕ ТИПЫ =====
export type TailwindClass =
  | TailwindBgColor
  | TailwindTextColor
  | TailwindBorderColor
  | TailwindRingColor
  | TailwindPadding
  | TailwindMargin
  | TailwindGap
  | TailwindWidth
  | TailwindHeight
  | FontSize
  | FontWeight
  | TextAlign
  | LineHeight
  | FlexDirection
  | FlexWrap
  | JustifyContent
  | AlignItems
  | FlexGrow
  | GridCols
  | GridRows
  | Position
  | Display
  | BorderWidth
  | BorderRadius
  | BoxShadow
  | Opacity
  | string; // Для кастомных классов

// ===== УТИЛИТЫ ДЛЯ РАБОТЫ С ТИПАМИ =====

// Хелпер для создания union типов из массивов
export type ArrayToUnion<T extends readonly string[]> = T[number];

// Хелпер для создания цветовых классов
export type CreateColorClass<T extends string, C extends ColorName, S extends ColorShade> = `${T}-${C}-${S}`;

// Константы для быстрого доступа
export const TAILWIND_COLORS = {
  // Ваши кастомные цвета
  custom: {
    emerald: 'emerald',
    lime: 'lime',
    golden: 'golden',
    sage: 'sage',
    forest: 'forest',
    taupe: 'taupe',
  },
  // Стандартные цвета
  standard: {
    slate: 'slate',
    gray: 'gray',
    red: 'red',
    blue: 'blue',
    green: 'green',
    // ... и так далее
  }
} as const;

export const TAILWIND_SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

export const SPACING_SCALE = ['0', 'px', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '5', '6', '7', '8', '9', '10', '11', '12', '14', '16', '20', '24', '28', '32', '36', '40', '44', '48', '52', '56', '60', '64', '72', '80', '96'] as const;

// ===== GENERIC ТИПЫ ДЛЯ КОМПОНЕНТОВ =====

// Базовый тип для компонентов с Tailwind классами
export interface TailwindComponentProps {
  className?: string;
}

// Тип для компонентов с цветовыми пропсами
export interface ColorableComponentProps extends TailwindComponentProps {
  color?: ColorName;
  shade?: ColorShade;
  bgColor?: TailwindBgColor;
  textColor?: TailwindTextColor;
  borderColor?: TailwindBorderColor;
}

// Тип для компонентов с размерами
export interface SizeableComponentProps extends TailwindComponentProps {
  width?: TailwindWidth;
  height?: TailwindHeight;
  padding?: TailwindPadding;
  margin?: TailwindMargin;
}

// Полный тип для универсального компонента
export interface UniversalTailwindProps extends ColorableComponentProps, SizeableComponentProps {
  display?: Display;
  position?: Position;
  shadow?: BoxShadow;
  rounded?: BorderRadius;
  border?: BorderWidth;
}