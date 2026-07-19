export default function StarRating({ rating }: { rating: number }) {
  return (
    <div className="text-gold text-sm my-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? '' : 'text-borderpink'}>
          ★
        </span>
      ))}
    </div>
  );
}
