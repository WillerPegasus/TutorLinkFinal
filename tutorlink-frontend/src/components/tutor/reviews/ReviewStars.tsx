interface Props {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
}

// Composant étoiles réutilisable
const ReviewStars = ({ rating, size = 'md', showNumber = false }: Props) => {
  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-xl',
  };

  return (
    <span className={`${sizes[size]} flex items-center gap-1`}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          className={star <= rating ? 'text-yellow-400' : 'text-gray-200'}
        >
          ★
        </span>
      ))}
      {showNumber && (
        <span className="text-gray-500 ml-1 font-bold">{rating}</span>
      )}
    </span>
  );
};

export default ReviewStars;