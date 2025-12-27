import { forwardRef, useMemo, useRef, useEffect, useState, MutableRefObject, CSSProperties, HTMLAttributes } from 'react';
import { motion } from 'framer-motion';

function useAnimationFrame(callback: () => void) {
    useEffect(() => {
        let frameId: number;
        const loop = () => {
            callback();
            frameId = requestAnimationFrame(loop);
        };
        frameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frameId);
    }, [callback]);
}

function useMousePositionRef(containerRef: MutableRefObject<HTMLElement | null>) {
    const positionRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const updatePosition = (x: number, y: number) => {
            if (containerRef?.current) {
                const rect = containerRef.current.getBoundingClientRect();
                positionRef.current = { x: x - rect.left, y: y - rect.top };
            } else {
                positionRef.current = { x, y };
            }
        };

        const handleMouseMove = (ev: MouseEvent) => updatePosition(ev.clientX, ev.clientY);
        const handleTouchMove = (ev: TouchEvent) => {
            const touch = ev.touches[0];
            updatePosition(touch.clientX, touch.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, [containerRef]);

    return positionRef;
}

interface VariableProximityProps extends HTMLAttributes<HTMLSpanElement> {
    label: string;
    fromFontVariationSettings: string;
    toFontVariationSettings: string;
    containerRef: MutableRefObject<HTMLElement | null>;
    radius?: number;
    falloff?: 'linear' | 'exponential' | 'gaussian';
    className?: string;
    onClick?: () => void;
    style?: CSSProperties;
}

const VariableProximity = forwardRef<HTMLSpanElement, VariableProximityProps>((props, ref) => {
    const {
        label,
        fromFontVariationSettings,
        toFontVariationSettings,
        containerRef,
        radius = 50,
        falloff = 'linear',
        className = '',
        onClick,
        style,
        ...restProps
    } = props;

    const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const interpolatedSettingsRef = useRef<string[]>([]);
    const mousePositionRef = useMousePositionRef(containerRef);
    const lastPositionRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

    const parsedSettings = useMemo(() => {
        const parseSettings = (settingsStr: string) =>
            new Map(
                settingsStr
                    .split(',')
                    .map(s => s.trim())
                    .map(s => {
                        const [name, value] = s.split(' ');
                        return [name.replace(/['"]/g, ''), parseFloat(value)];
                    })
            );

        const fromSettings = parseSettings(fromFontVariationSettings);
        const toSettings = parseSettings(toFontVariationSettings);

        return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
            axis,
            fromValue,
            toValue: toSettings.get(axis) ?? fromValue
        }));
    }, [fromFontVariationSettings, toFontVariationSettings]);

    const calculateDistance = (x1: number, y1: number, x2: number, y2: number) =>
        Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

    const calculateFalloff = (distance: number) => {
        const norm = Math.min(Math.max(1 - distance / radius, 0), 1);
        switch (falloff) {
            case 'exponential':
                return norm ** 2;
            case 'gaussian':
                return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
            case 'linear':
            default:
                return norm;
        }
    };

    const letterPositions = useRef<{ x: number; y: number }[]>([]);

    useEffect(() => {
        const updatePositions = () => {
            if (!containerRef?.current) return;
            const containerRect = containerRef.current.getBoundingClientRect();
            letterPositions.current = letterRefs.current.map(letterRef => {
                if (!letterRef) return { x: 0, y: 0 };
                const rect = letterRef.getBoundingClientRect();
                return {
                    x: rect.left + rect.width / 2 - containerRect.left,
                    y: rect.top + rect.height / 2 - containerRect.top
                };
            });
        };

        updatePositions();

        const observer = new ResizeObserver(updatePositions);
        if (containerRef?.current) {
            observer.observe(containerRef.current);
        }
        window.addEventListener('resize', updatePositions);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', updatePositions);
        };
    }, [containerRef, label]);

    const [isInView, setIsInView] = useState(true);

    useEffect(() => {
        if (!containerRef?.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => setIsInView(entry.isIntersecting),
            { threshold: 0 }
        );
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [containerRef]);

    useAnimationFrame(() => {
        if (!containerRef?.current || !isInView || letterPositions.current.length === 0) return;
        const { x, y } = mousePositionRef.current;
        if (lastPositionRef.current.x === x && lastPositionRef.current.y === y) {
            return;
        }
        lastPositionRef.current = { x, y };

        letterRefs.current.forEach((letterRef, index) => {
            if (!letterRef || !letterPositions.current[index]) return;

            const { x: letterCenterX, y: letterCenterY } = letterPositions.current[index];

            const distance = calculateDistance(
                x,
                y,
                letterCenterX,
                letterCenterY
            );

            if (distance >= radius) {
                if (letterRef.style.fontVariationSettings !== fromFontVariationSettings) {
                    letterRef.style.fontVariationSettings = fromFontVariationSettings;
                }
                return;
            }

            const falloffValue = calculateFalloff(distance);
            const newSettings = parsedSettings
                .map(({ axis, fromValue, toValue }) => {
                    const interpolatedValue = fromValue + (toValue - fromValue) * falloffValue;
                    return `'${axis}' ${interpolatedValue}`;
                })
                .join(', ');

            if (interpolatedSettingsRef.current[index] !== newSettings) {
                interpolatedSettingsRef.current[index] = newSettings;
                letterRef.style.fontVariationSettings = newSettings;
            }
        });
    });

    const words = label.split(' ');
    let letterIndex = 0;

    return (
        <span
            ref={ref}
            onClick={onClick}
            style={{
                display: 'inline',
                fontFamily: 'Nohemi, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
                ...style
            }}
            className={className}
            {...restProps}
        >
            {words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block whitespace-nowrap">
                    {word.split('').map(letter => {
                        const currentLetterIndex = letterIndex++;
                        return (
                            <motion.span
                                key={currentLetterIndex}
                                ref={el => {
                                    letterRefs.current[currentLetterIndex] = el;
                                }}
                                style={{
                                    display: 'inline-block',
                                    fontVariationSettings: interpolatedSettingsRef.current[currentLetterIndex]
                                }}
                                aria-hidden="true"
                            >
                                {letter}
                            </motion.span>
                        );
                    })}
                    {wordIndex < words.length - 1 && <span className="inline-block">&nbsp;</span>}
                </span>
            ))}
            <span className="sr-only">{label}</span>
        </span>
    );
});

VariableProximity.displayName = 'VariableProximity';
export default VariableProximity;
