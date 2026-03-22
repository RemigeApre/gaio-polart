/**
 * Blasons simplifiés des villes, en SVG inline monochrome.
 * Couleur contrôlée via `color` (currentColor).
 */

interface BlasonProps {
  className?: string;
  style?: React.CSSProperties;
}

/** Chelles : une échelle (symbole principal du blason) */
function BlasonChelles({ className, style }: BlasonProps) {
  return (
    <svg viewBox="0 0 60 80" fill="none" className={className} style={style} aria-hidden="true">
      {/* Montants */}
      <rect x="14" y="4" width="5" height="72" rx="2" fill="currentColor" />
      <rect x="41" y="4" width="5" height="72" rx="2" fill="currentColor" />
      {/* Barreaux */}
      <rect x="14" y="12" width="32" height="4" rx="1" fill="currentColor" />
      <rect x="14" y="25" width="32" height="4" rx="1" fill="currentColor" />
      <rect x="14" y="38" width="32" height="4" rx="1" fill="currentColor" />
      <rect x="14" y="51" width="32" height="4" rx="1" fill="currentColor" />
      <rect x="14" y="64" width="32" height="4" rx="1" fill="currentColor" />
    </svg>
  );
}

/** Gagny : trois gerbes de blé stylisées */
function BlasonGagny({ className, style }: BlasonProps) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className={className} style={style} aria-hidden="true">
      {/* Gerbe gauche */}
      <path d="M20 70 L20 35 Q20 25 25 20 Q20 25 15 20 Q20 25 20 35" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <ellipse cx="20" cy="18" rx="5" ry="8" fill="currentColor" />
      <ellipse cx="13" cy="22" rx="4" ry="7" fill="currentColor" transform="rotate(-20 13 22)" />
      <ellipse cx="27" cy="22" rx="4" ry="7" fill="currentColor" transform="rotate(20 27 22)" />
      {/* Gerbe centre */}
      <path d="M40 70 L40 30 Q40 20 45 15 Q40 20 35 15 Q40 20 40 30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <ellipse cx="40" cy="13" rx="5" ry="8" fill="currentColor" />
      <ellipse cx="33" cy="17" rx="4" ry="7" fill="currentColor" transform="rotate(-20 33 17)" />
      <ellipse cx="47" cy="17" rx="4" ry="7" fill="currentColor" transform="rotate(20 47 17)" />
      {/* Gerbe droite */}
      <path d="M60 70 L60 35 Q60 25 65 20 Q60 25 55 20 Q60 25 60 35" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <ellipse cx="60" cy="18" rx="5" ry="8" fill="currentColor" />
      <ellipse cx="53" cy="22" rx="4" ry="7" fill="currentColor" transform="rotate(-20 53 22)" />
      <ellipse cx="67" cy="22" rx="4" ry="7" fill="currentColor" transform="rotate(20 67 22)" />
    </svg>
  );
}

/** Meaux : étoiles (blason historique) */
function BlasonMeaux({ className, style }: BlasonProps) {
  const star = (cx: number, cy: number, r: number) => {
    const points: string[] = [];
    for (let i = 0; i < 10; i++) {
      const radius = i % 2 === 0 ? r : r * 0.4;
      const angle = (Math.PI / 5) * i - Math.PI / 2;
      points.push(`${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`);
    }
    return points.join(" ");
  };

  return (
    <svg viewBox="0 0 80 80" fill="none" className={className} style={style} aria-hidden="true">
      <polygon points={star(40, 18, 14)} fill="currentColor" />
      <polygon points={star(20, 50, 12)} fill="currentColor" />
      <polygon points={star(60, 50, 12)} fill="currentColor" />
    </svg>
  );
}

/** Villeparisis : V stylisé */
function BlasonVilleparisis({ className, style }: BlasonProps) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className={className} style={style} aria-hidden="true">
      <path
        d="M12 10 L40 70 L68 10"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/** Renvoie le composant blason pour une ville donnée */
export function CityBlason({ city, className, style }: BlasonProps & { city: string }) {
  switch (city) {
    case "Chelles": return <BlasonChelles className={className} style={style} />;
    case "Gagny": return <BlasonGagny className={className} style={style} />;
    case "Meaux": return <BlasonMeaux className={className} style={style} />;
    case "Villeparisis": return <BlasonVilleparisis className={className} style={style} />;
    default: return (
      <svg viewBox="0 0 60 80" className={className} style={style} aria-hidden="true">
        <text x="30" y="55" textAnchor="middle" fontSize="50" fontWeight="bold" fontFamily="Georgia, serif" fill="currentColor">
          {city.charAt(0)}
        </text>
      </svg>
    );
  }
}
