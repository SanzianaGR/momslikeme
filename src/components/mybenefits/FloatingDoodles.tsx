export function FloatingDoodles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating hearts */}
      {[...Array(5)].map((_, i) => (
        <svg
          key={`heart-${i}`}
          className="absolute animate-float opacity-20"
          style={{
            left: `${10 + i * 20}%`,
            top: `${15 + Math.sin(i) * 10}%`,
            animationDelay: `${i * 0.8}s`,
            width: 20 + i * 5,
            height: 20 + i * 5,
          }}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 21C12 21 4 13.5 4 8.5C4 5.46 6.46 3 9.5 3C11.06 3 12.5 3.8 13 5C13.5 3.8 14.94 3 16.5 3C19.54 3 22 5.46 22 8.5C22 13.5 12 21 12 21Z"
            className="stroke-primary fill-primary/30"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ))}

      {/* Floating stars */}
      {[...Array(6)].map((_, i) => (
        <svg
          key={`star-${i}`}
          className="absolute animate-twinkle opacity-30"
          style={{
            right: `${5 + i * 15}%`,
            top: `${20 + i * 12}%`,
            animationDelay: `${i * 0.5}s`,
            width: 16 + i * 3,
            height: 16 + i * 3,
          }}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 2L13.5 9L20 12L13.5 15L12 22L10.5 15L4 12L10.5 9L12 2Z"
            className="fill-warning stroke-warning/50"
            strokeWidth="1"
          />
        </svg>
      ))}

      {/* Wavy lines */}
      <svg className="absolute bottom-0 left-0 w-full h-32 opacity-10" viewBox="0 0 400 100" preserveAspectRatio="none">
        <path
          d="M0 50 Q100 20 200 50 T400 50"
          className="stroke-primary fill-none animate-sway"
          strokeWidth="2"
        />
        <path
          d="M0 70 Q100 40 200 70 T400 70"
          className="stroke-secondary fill-none animate-sway"
          strokeWidth="2"
          style={{ animationDelay: '0.5s' }}
        />
      </svg>

      {/* Small flowers scattered */}
      {[...Array(4)].map((_, i) => (
        <svg
          key={`flower-${i}`}
          className="absolute animate-bounce-gentle opacity-25"
          style={{
            left: `${20 + i * 25}%`,
            bottom: `${10 + i * 5}%`,
            animationDelay: `${i * 0.6}s`,
            width: 30,
            height: 30,
          }}
          viewBox="0 0 40 40"
        >
          {/* Petals */}
          {[0, 72, 144, 216, 288].map((angle, j) => (
            <ellipse
              key={j}
              cx="20"
              cy="10"
              rx="6"
              ry="10"
              className="fill-primary/40"
              transform={`rotate(${angle} 20 20)`}
            />
          ))}
          {/* Center */}
          <circle cx="20" cy="20" r="6" className="fill-warning" />
        </svg>
      ))}

      {/* Decorative dots */}
      {[...Array(8)].map((_, i) => (
        <div
          key={`dot-${i}`}
          className="absolute w-2 h-2 rounded-full bg-accent/20 animate-pulse-slow"
          style={{
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}
    </div>
  );
}
