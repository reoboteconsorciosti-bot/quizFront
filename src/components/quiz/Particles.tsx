import { useMemo } from "react";

export function Particles({ count = 18 }: { count?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 4 + Math.random() * 10,
        delay: Math.random() * 6,
        duration: 6 + Math.random() * 8,
        opacity: 0.15 + Math.random() * 0.35,
      })),
    [count],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--primary-glow) 80%, transparent), transparent 70%)",
            opacity: p.opacity,
            animation: `float-slow ${p.duration}s ease-in-out ${p.delay}s infinite`,
            filter: "blur(1px)",
          }}
        />
      ))}
    </div>
  );
}
