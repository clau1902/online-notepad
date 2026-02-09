export function FlowerDecoration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Petals */}
      <ellipse cx="100" cy="60" rx="25" ry="40" fill="#F0CFDA" opacity="0.7" transform="rotate(0 100 100)" />
      <ellipse cx="100" cy="60" rx="25" ry="40" fill="#E8C4D0" opacity="0.6" transform="rotate(60 100 100)" />
      <ellipse cx="100" cy="60" rx="25" ry="40" fill="#F0CFDA" opacity="0.7" transform="rotate(120 100 100)" />
      <ellipse cx="100" cy="60" rx="25" ry="40" fill="#E8C4D0" opacity="0.6" transform="rotate(180 100 100)" />
      <ellipse cx="100" cy="60" rx="25" ry="40" fill="#F0CFDA" opacity="0.7" transform="rotate(240 100 100)" />
      <ellipse cx="100" cy="60" rx="25" ry="40" fill="#E8C4D0" opacity="0.6" transform="rotate(300 100 100)" />
      {/* Center */}
      <circle cx="100" cy="100" r="18" fill="#A78BCC" opacity="0.8" />
      <circle cx="100" cy="100" r="10" fill="#C8A8E0" opacity="0.9" />
    </svg>
  );
}

export function SmallFlower({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="20" cy="12" rx="5" ry="9" fill="#F0CFDA" opacity="0.6" transform="rotate(0 20 20)" />
      <ellipse cx="20" cy="12" rx="5" ry="9" fill="#F0CFDA" opacity="0.6" transform="rotate(72 20 20)" />
      <ellipse cx="20" cy="12" rx="5" ry="9" fill="#F0CFDA" opacity="0.6" transform="rotate(144 20 20)" />
      <ellipse cx="20" cy="12" rx="5" ry="9" fill="#F0CFDA" opacity="0.6" transform="rotate(216 20 20)" />
      <ellipse cx="20" cy="12" rx="5" ry="9" fill="#F0CFDA" opacity="0.6" transform="rotate(288 20 20)" />
      <circle cx="20" cy="20" r="4" fill="#A78BCC" opacity="0.7" />
    </svg>
  );
}

export function LeafDecoration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 30"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 25 Q30 -5 55 25"
        fill="none"
        stroke="#C8E0D0"
        strokeWidth="2"
        opacity="0.6"
      />
      <path
        d="M10 22 Q30 2 50 22"
        fill="#C8E0D0"
        opacity="0.3"
      />
    </svg>
  );
}
