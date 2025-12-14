export function FloatingDoodles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Wavy lines - subtle background decoration */}
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

      {/* Subtle coins in corners */}
      <svg
        className="absolute top-8 right-8 opacity-15 animate-float"
        width="40"
        height="40"
        viewBox="0 0 40 40"
      >
        <circle cx="20" cy="20" r="18" className="fill-warning stroke-warning/50" strokeWidth="2" />
        <text x="20" y="26" textAnchor="middle" className="fill-warning/80 text-lg font-bold">€</text>
      </svg>

      <svg
        className="absolute bottom-20 left-8 opacity-10 animate-float"
        style={{ animationDelay: '1s' }}
        width="30"
        height="30"
        viewBox="0 0 40 40"
      >
        <circle cx="20" cy="20" r="18" className="fill-warning stroke-warning/50" strokeWidth="2" />
        <text x="20" y="26" textAnchor="middle" className="fill-warning/80 text-lg font-bold">€</text>
      </svg>
    </div>
  );
}
