import { useRef, useEffect, useState } from 'react';

interface Box {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  gradient: string;
  icon: number;
  rotation: number;
}

export default function AIChat3DBackground({ burst = false, chatScroll = 0 }: { burst?: boolean; chatScroll?: number }) {
  const [burstActive, setBurstActive] = useState(false);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const scrollY = useRef(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (burst) {
      setBurstActive(true);
      setTimeout(() => setBurstActive(false), 1000);
    }
  }, [burst]);

  // Reset scroll tracking when switching between chat scroll and window scroll
  useEffect(() => {
    lastScrollY.current = chatScroll || window.scrollY;
  }, [chatScroll]);

  const icons = [
    // Code icon
    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>,
    // Sparkles icon
    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>,
    // Lightning icon
    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>,
    // Chip icon
    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>,
    // Terminal icon
    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>,
    // Cube icon
    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>,
    // Zap icon
    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>,
    // Star icon
    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ];

  const gradients = [
    'from-cyan-400 to-blue-500',
    'from-cyan-500 to-blue-600',
    'from-sky-400 to-indigo-500',
    'from-blue-400 to-indigo-600',
    'from-cyan-300 to-blue-400',
  ];

  // Initialize boxes
  useEffect(() => {
    const initialBoxes: Box[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10, // 10% to 90%
      y: Math.random() * 80 + 10,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 20 + 50, // 50px to 70px
      gradient: gradients[i % gradients.length],
      icon: i,
      rotation: Math.random() * 360
    }));
    setBoxes(initialBoxes);
  }, []);

  // Scroll tracking - only track window scroll if chatScroll prop is not provided
  useEffect(() => {
    // If chatScroll is being provided (chat is open), we don't need window scroll
    if (chatScroll > 0) return;
    
    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [chatScroll]);

  // Animation loop with collision detection
  useEffect(() => {
    if (!containerRef.current || boxes.length === 0) return;

    const animate = () => {
      setBoxes(prevBoxes => {
        const newBoxes = [...prevBoxes];
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (!containerRect) return prevBoxes;

        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;

        // Apply scroll drag effect (use chatScroll if provided, else window scroll)
        const currentScroll = chatScroll || window.scrollY;
        const scrollDelta = currentScroll - lastScrollY.current;
        lastScrollY.current = currentScroll;

        newBoxes.forEach((box, i) => {
          // Apply scroll drag (parallax effect)
          box.y += scrollDelta * 0.05;

          // Apply velocity
          box.x += box.vx;
          box.y += box.vy;

          // Bounce off walls
          const boxSizePercent = (box.size / containerWidth) * 100;
          if (box.x <= 0 || box.x >= 100 - boxSizePercent) {
            box.vx *= -1;
            box.x = Math.max(0, Math.min(100 - boxSizePercent, box.x));
          }
          if (box.y <= 0 || box.y >= 100 - boxSizePercent) {
            box.vy *= -1;
            box.y = Math.max(0, Math.min(100 - boxSizePercent, box.y));
          }

          // Collision detection with other boxes
          for (let j = i + 1; j < newBoxes.length; j++) {
            const other = newBoxes[j];
            
            const dx = (other.x - box.x) * containerWidth / 100;
            const dy = (other.y - box.y) * containerHeight / 100;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = (box.size + other.size) / 2;

            if (distance < minDistance) {
              // Collision detected - calculate bounce
              const angle = Math.atan2(dy, dx);
              const targetX = box.x + Math.cos(angle) * minDistance * 100 / containerWidth;
              const targetY = box.y + Math.sin(angle) * minDistance * 100 / containerHeight;
              
              const ax = (targetX - other.x) * 0.05;
              const ay = (targetY - other.y) * 0.05;
              
              // Apply forces
              box.vx -= ax;
              box.vy -= ay;
              other.vx += ax;
              other.vy += ay;

              // Add some damping
              box.vx *= 0.98;
              box.vy *= 0.98;
              other.vx *= 0.98;
              other.vy *= 0.98;
            }
          }

          // Normalize rotation to prevent infinite growth
          box.rotation = box.rotation % 360;

          // Apply drag
          box.vx *= 0.995;
          box.vy *= 0.995;
        });

        return newBoxes;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [boxes.length, chatScroll]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      <style>
        {`
          @keyframes gentleRotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      {boxes.map((box) => (
        <div
          key={box.id}
          className={`absolute bg-gradient-to-br ${box.gradient} rounded-2xl flex items-center justify-center shadow-lg ${
            burstActive ? 'animate-ping' : ''
          }`}
          style={{
            left: `${box.x}%`,
            top: `${box.y}%`,
            width: `${box.size}px`,
            height: `${box.size}px`,
            opacity: 0.9,
            boxShadow: '0 0 30px rgba(6, 182, 212, 0.3)',
            animation: burstActive ? undefined : 'gentleRotate 20s linear infinite',
            willChange: 'transform',
          }}
        >
          {icons[box.icon]}
        </div>
      ))}
    </div>
  );
}
