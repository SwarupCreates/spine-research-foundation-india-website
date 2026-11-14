import { useEffect, useLayoutEffect, useMemo, useRef, type CSSProperties, type RefObject } from 'react';

import './GradualBlur.css';

export type GradualBlurPosition = 'top' | 'bottom' | 'left' | 'right';
export type GradualBlurCurve = 'linear' | 'bezier' | 'ease-in' | 'ease-out' | 'ease-in-out';

export interface GradualBlurProps {
  position?: GradualBlurPosition;
  target?: 'parent' | 'page';
  height?: string | number;
  width?: string | number;
  strength?: number;
  layers?: number;
  curve?: GradualBlurCurve;
  exponential?: boolean;
  opacity?: number;
  saturation?: number;
  tint?: string;
  autoHide?: boolean;
  container?: Element | string | RefObject<Element | null> | null;
  hoverIntensity?: number;
  duration?: number | string;
  easing?: string;
  zIndex?: number;
  className?: string;
  style?: CSSProperties;
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const CURVES: Record<string, (t: number) => number> = {
  linear: t => t,
  bezier: t => t * t * (3 - 2 * t),
  'ease-in': t => t * t,
  'ease-out': t => 1 - (1 - t) * (1 - t),
  'ease-in-out': t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
};

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);
const toLength = (value: string | number) => (typeof value === 'number' ? `${value}px` : value);
const toTime = (value: string | number) => (typeof value === 'number' ? `${value}s` : value);

const findScroller = (
  container: GradualBlurProps['container'],
  root: HTMLElement,
  target: string,
  vertical: boolean
): Element | Window | null => {
  if (container) {
    if (typeof container === 'string') return document.querySelector(container);
    return 'current' in container ? container.current : container;
  }
  if (target === 'page') return window;
  const parent = root.parentElement;
  if (!parent) return null;
  const scrolls = (node: Element) => {
    const style = getComputedStyle(node);
    return /(auto|scroll|overlay)/.test(vertical ? style.overflowY : style.overflowX);
  };
  const sibling = Array.from(parent.children).find(child => child !== root && scrolls(child));
  return sibling || (scrolls(parent) ? parent : null);
};

export const GradualBlur = ({
  position = 'top',
  target = 'page',
  height = '8.5rem',
  width,
  strength = 3.5,
  layers = 16,
  curve = 'bezier',
  exponential = false,
  opacity = 1,
  saturation = 1,
  tint = 'transparent',
  autoHide = true,
  container,
  hoverIntensity = 1,
  duration = 0.3,
  easing = 'ease-out',
  zIndex = 30,
  className = '',
  style
}: GradualBlurProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const vertical = position === 'top' || position === 'bottom';

  // Construct stepped cross-browser blur slices
  // Bypasses the Chromium Blink compositor bug where mask-image on backdrop-filter is dropped
  const bands = useMemo(() => {
    const count = Math.min(Math.max(Math.round(layers) || 1, 4), 24);
    const shape = CURVES[curve] || CURVES.bezier;
    const maxBlur = Math.max(strength, 0) * 12; // with 3.5 -> ~42px blur at edge
    const items: { style: CSSProperties }[] = [];

    const stepPct = 100 / count;

    for (let i = 0; i < count; i++) {
      // i = 0 is closest to the outer edge (strongest blur)
      // i = count - 1 is furthest from edge (weakest blur)
      const u = (count - i) / count;
      const t = shape(clamp01(u));
      const blurRadius = exponential
        ? maxBlur * (Math.pow(2, 4 * t) - 1) / 15
        : maxBlur * t;

      if (blurRadius <= 0.1) continue;

      const bandStyle: CSSProperties = {
        position: 'absolute',
        pointerEvents: 'none',
        backdropFilter: `blur(${blurRadius.toFixed(1)}px)${saturation !== 1 ? ` saturate(${saturation})` : ''}`,
        WebkitBackdropFilter: `blur(${blurRadius.toFixed(1)}px)${saturation !== 1 ? ` saturate(${saturation})` : ''}`,
      };

      if (position === 'top') {
        bandStyle.top = `${(i * stepPct).toFixed(2)}%`;
        bandStyle.height = `${(stepPct + 0.15).toFixed(2)}%`; // slight overlap prevents subpixel gaps
        bandStyle.left = 0;
        bandStyle.right = 0;
      } else if (position === 'bottom') {
        bandStyle.bottom = `${(i * stepPct).toFixed(2)}%`;
        bandStyle.height = `${(stepPct + 0.15).toFixed(2)}%`;
        bandStyle.left = 0;
        bandStyle.right = 0;
      } else if (position === 'left') {
        bandStyle.left = `${(i * stepPct).toFixed(2)}%`;
        bandStyle.width = `${(stepPct + 0.15).toFixed(2)}%`;
        bandStyle.top = 0;
        bandStyle.bottom = 0;
      } else if (position === 'right') {
        bandStyle.right = `${(i * stepPct).toFixed(2)}%`;
        bandStyle.width = `${(stepPct + 0.15).toFixed(2)}%`;
        bandStyle.top = 0;
        bandStyle.bottom = 0;
      }

      items.push({ style: bandStyle });
    }

    return items;
  }, [layers, curve, strength, exponential, saturation, position]);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    if (!autoHide) {
      root.style.opacity = String(opacity);
      return undefined;
    }

    const scroller = findScroller(container, root, target, vertical);
    if (!scroller) return undefined;
    const element = scroller instanceof Element ? scroller : null;
    const start = position === 'top' || position === 'left';

    const update = () => {
      const page = document.documentElement;
      const offset = element
        ? vertical
          ? element.scrollTop
          : element.scrollLeft
        : vertical
          ? window.scrollY
          : window.scrollX;
      const limit = element
        ? vertical
          ? element.scrollHeight - element.clientHeight
          : element.scrollWidth - element.clientWidth
        : vertical
          ? page.scrollHeight - window.innerHeight
          : page.scrollWidth - window.innerWidth;
      const box = root.getBoundingClientRect();
      const reach = Math.max(vertical ? box.height : box.width, 1);
      const room = start ? offset : limit - offset;
      
      // Softly diminishes when at top or bottom edge of scroll
      const reveal = clamp01(room / (reach * 0.6));
      root.style.opacity = (reveal * opacity).toFixed(3);
    };

    update();
    const source = element ?? window;
    source.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      source.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [autoHide, container, target, position, vertical, opacity]);

  const depth = toLength(vertical ? height : (width ?? height));
  const span = vertical && width != null ? toLength(width) : null;

  const rootStyle: CSSProperties = {
    position: target === 'page' ? 'fixed' : 'absolute',
    zIndex,
    pointerEvents: 'none',
    top: position === 'bottom' ? undefined : 0,
    bottom: position === 'top' ? undefined : 0,
    left: position === 'right' ? undefined : 0,
    right: position === 'left' ? undefined : 0,
    height: vertical ? depth : undefined,
    width: vertical ? (span ?? undefined) : depth,
    marginInline: span ? 'auto' : undefined,
    opacity: autoHide ? 0 : opacity,
    transition: `opacity ${toTime(duration)} ${easing}`,
    ...style
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root || hoverIntensity === 1) return undefined;
    const onEnter = () => {
      root.style.filter = `brightness(${hoverIntensity})`;
    };
    const onLeave = () => {
      root.style.filter = 'none';
    };
    root.addEventListener('pointerenter', onEnter);
    root.addEventListener('pointerleave', onLeave);
    return () => {
      root.removeEventListener('pointerenter', onEnter);
      root.removeEventListener('pointerleave', onLeave);
    };
  }, [hoverIntensity]);

  return (
    <div ref={rootRef} className={`gradual-blur ${className}`.trim()} style={rootStyle} aria-hidden="true">
      {bands.map((band, idx) => (
        <div key={idx} style={band.style} />
      ))}
      {tint && tint !== 'transparent' && (
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: position === 'top'
              ? `linear-gradient(to bottom, ${tint} 0%, transparent 100%)`
              : `linear-gradient(to top, ${tint} 0%, transparent 100%)`
          }}
        />
      )}
    </div>
  );
};

export default GradualBlur;
