export default function CardsLoading() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="h-9 w-40 animate-pulse rounded bg-muted" />
        <div className="h-5 w-full max-w-2xl animate-pulse rounded bg-muted" />
      </div>
      <div className="h-16 animate-pulse rounded-md border bg-card" />
      <div className="grid gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="grid overflow-hidden rounded-md border bg-card sm:grid-cols-[164px_1fr]"
          >
            <div className="h-60 animate-pulse bg-muted sm:h-auto" />
            <div className="space-y-3 p-4">
              <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
              <div className="grid gap-2 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((__, itemIndex) => (
                  <div key={itemIndex} className="h-10 animate-pulse rounded bg-muted" />
                ))}
              </div>
              <div className="h-16 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
