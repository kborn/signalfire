export default function Loading() {
  return (
    <div className="page-section searchPage">
      <div className="searchHeader">
        <div className="skeleton" style={{ height: '0.8rem', width: '4rem' }} />
        <div className="skeleton skeletonTitle" style={{ marginTop: '8px' }} />
      </div>
      <div
        className="skeleton"
        style={{ height: '52px', borderRadius: '12px', marginTop: '8px' }}
      />
      <div className="skeletonList">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="skeletonCard">
            <div className="skeleton skeletonCardTitle" />
            <div className="skeleton skeletonCardBody" />
          </div>
        ))}
      </div>
    </div>
  );
}
