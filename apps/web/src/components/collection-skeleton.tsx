export function CollectionSkeleton({ cards = 4 }: { cards?: number }) {
  return (
    <div className="skeletonPage">
      <div>
        <div className="skeleton skeletonTitle" />
        <div className="skeleton skeletonSubtitle" style={{ marginTop: '12px' }} />
      </div>
      <div className="skeletonList">
        {Array.from({ length: cards }, (_, i) => (
          <div key={i} className="skeletonCard">
            <div className="skeleton skeletonCardTitle" />
            <div className="skeleton skeletonCardBody" />
            <div className="skeleton skeletonCardBodyShort" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="skeletonPage">
      <div className="skeletonDetailHero">
        <div className="skeleton skeletonDetailTitle" />
        <div className="skeleton skeletonDetailLead" />
        <div className="skeleton skeletonDetailLead" style={{ width: '70%' }} />
      </div>
      <div className="skeletonParagraph">
        <div className="skeleton skeletonCardBody" />
        <div className="skeleton skeletonCardBody" />
        <div className="skeleton skeletonCardBodyShort" />
      </div>
    </div>
  );
}
