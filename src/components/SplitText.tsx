import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string | ((t: number) => number);
  splitType?: 'chars' | 'words' | 'lines';
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  textAlign?: React.CSSProperties['textAlign'];
  onLetterAnimationComplete?: () => void;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 100,
  duration = 0.6,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  tag = 'p',
  textAlign = 'center',
  onLetterAnimationComplete
}) => {
  const ref = useRef<HTMLElement>(null);
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (document.fonts.status === 'loaded') {
      setFontsLoaded(true);
    } else {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    }
  }, []);

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded) return;
      const el = ref.current;

      // Split text manually into characters or words
      const splitTextContent = () => {
        const textContent = text;
        let elements: HTMLElement[] = [];

        if (splitType === 'chars') {
          elements = textContent.split('').map((char) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.className = 'split-char inline-block';
            return span;
          });
        } else if (splitType === 'words') {
          elements = textContent.split(' ').map((word) => {
            const span = document.createElement('span');
            span.textContent = word;
            span.className = 'split-word inline-block';
            return span;
          });
        }

        el.innerHTML = '';
        elements.forEach((elem) => el.appendChild(elem));
        return elements;
      };

      const targets = splitTextContent();

      const startPct = (1 - threshold) * 100;
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch ? marginMatch[2] || 'px' : 'px';
      const sign =
        marginValue === 0
          ? ''
          : marginValue < 0
            ? `-=${Math.abs(marginValue)}${marginUnit}`
            : `+=${marginValue}${marginUnit}`;
      const start = `top ${startPct}%${sign}`;

      gsap.fromTo(
        targets,
        { ...from },
        {
          ...to,
          duration,
          ease,
          stagger: delay / 1000,
          scrollTrigger: {
            trigger: el,
            start,
            once: true,
            fastScrollEnd: true,
          },
          onComplete: () => {
            onLetterAnimationComplete?.();
          },
          willChange: 'transform, opacity',
          force3D: true
        }
      );

      return () => {
        ScrollTrigger.getAll().forEach(st => {
          if (st.trigger === el) st.kill();
        });
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
        fontsLoaded,
        onLetterAnimationComplete
      ],
      scope: ref
    }
  );

  const style: React.CSSProperties = {
    textAlign,
    wordWrap: 'break-word',
    willChange: 'transform, opacity'
  };
  const classes = `split-parent overflow-hidden inline-block whitespace-normal ${className}`;

  const renderTag = () => {
    const props = {
      ref: ref as any,
      style,
      className: classes,
      children: text
    };

    switch (tag) {
      case 'h1':
        return <h1 {...props} />;
      case 'h2':
        return <h2 {...props} />;
      case 'h3':
        return <h3 {...props} />;
      case 'h4':
        return <h4 {...props} />;
      case 'h5':
        return <h5 {...props} />;
      case 'h6':
        return <h6 {...props} />;
      case 'span':
        return <span {...props} />;
      default:
        return <p {...props} />;
    }
  };

  return renderTag();
};

export default SplitText;
