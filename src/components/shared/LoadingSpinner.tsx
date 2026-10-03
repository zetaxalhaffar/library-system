export function LoadingSpinner() {
  return (
    <div className="overlay">
      <div className="spinner center">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="spinner-blade"></div>
        ))}
      </div>
    </div>
  );
}
