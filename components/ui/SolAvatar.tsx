export function SolAvatar({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Sol AI"
    >
      {/* Rayos del sol */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
        <line
          key={i}
          x1="20"
          y1="4"
          x2="20"
          y2="7"
          stroke="#F97316"
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${deg} 20 20)`}
        />
      ))}
      {/* Círculo del sol */}
      <circle cx="20" cy="20" r="10" fill="#FCD34D" />
      {/* Cara: ojos con lentes */}
      {/* Lente izquierdo */}
      <rect x="13" y="17" width="5" height="4" rx="2" fill="white" />
      <circle cx="15.5" cy="19" r="1.5" fill="#1E1B4B" />
      {/* Puente de lentes */}
      <line x1="18" y1="19" x2="22" y2="19" stroke="#92400E" strokeWidth="1" />
      {/* Lente derecho */}
      <rect x="22" y="17" width="5" height="4" rx="2" fill="white" />
      <circle cx="24.5" cy="19" r="1.5" fill="#1E1B4B" />
      {/* Sonrisa */}
      <path d="M16 23.5 Q20 26.5 24 23.5" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  )
}
