import { useState } from 'react';

interface Props {
  value: number;                  // note actuelle
  onChange: (rating: number) => void; // callback changement
  size?: 'sm' | 'md' | 'lg';
}

// Composant sélection de note interactive avec survol
const StarRatingInput = ({ value, onChange, size = 'md' }: Props) => {
  // Étoile survolée pour l'aperçu
  const [hovered, setHovered] = useState<number | null>(null);

  const sizes = { sm: 'text-lg', md: 'text-2xl', lg: 'text-3xl' };
  const displayed = hovered ?? value;

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          className={`${sizes[size]} cursor-pointer transition-transform
                      hover:scale-110
                      ${star <= displayed
                        ? 'text-yellow-400'
                        : 'text-gray-200'
                      }`}
        >
          ★
        </button>
      ))}
      {/* Affiche la note en chiffre */}
      <span className="text-sm text-gray-500 ml-2 self-center font-medium">
        {displayed}/5
      </span>
    </div>
  );
};

export default StarRatingInput;