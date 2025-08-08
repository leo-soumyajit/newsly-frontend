// NewsFeedSkeleton.tsx
export const NewsFeedSkeleton = () => (
  <div className="animate-pulse min-h-screen bg-background">
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Hero card skeleton */}
          <div className="mb-8">
            <div className="rounded-2xl bg-card shadow-md p-8 flex items-center gap-5">
              <div className="w-32 h-32 bg-muted rounded-lg" />
              <div className="flex-1 space-y-5">
                <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-1/3" />
              </div>
            </div>
          </div>
          {/* Trending skeletons */}
          <section className="mb-8">
            <div className="mb-6">
              <div className="h-8 w-48 bg-muted rounded"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="rounded-xl bg-card p-6 flex gap-3 shadow">
                  <div className="w-24 h-16 bg-muted rounded-lg" />
                  <div className="flex-1 space-y-4 py-2">
                    <div className="h-4 bg-muted rounded w-2/3" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </section>
          {/* Featured/news grid skeletons */}
          <section>
            <div className="h-8 w-44 bg-muted rounded mb-8"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-xl bg-card p-8 space-y-5 shadow">
                  <div className="w-full h-36 bg-muted rounded-lg mb-2" />
                  <div className="h-5 bg-muted rounded w-2/3 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/3" />
                </div>
              ))}
            </div>
          </section>
        </div>
        {/* Sidebar skeletons */}
        <div className="lg:col-span-1 space-y-6">
          <div className="sticky top-24 space-y-6">
            {/* LiveMatches skeleton */}
            <div className="bg-card p-4 rounded-lg shadow-sm flex flex-col gap-3">
              <div className="h-7 bg-muted rounded w-28 mb-3" />
              {[...Array(2)].map((_,i) => (
                <div key={i} className="flex gap-2 items-center">
                  <div className="h-8 w-8 bg-muted rounded-full" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
            {/* Top Story skeleton */}
            <div className="bg-card rounded-lg p-4 shadow-sm">
              <div className="font-semibold mb-4 h-5 w-24 bg-muted rounded" />
              <div className="flex items-center gap-3 px-4 py-4 rounded-xl shadow">
                <div className="h-14 w-14 bg-muted rounded" />
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-muted rounded w-2/3 mb-2" />
                </div>
              </div>
            </div>
            {/* Recent News skeleton */}
            <div className="bg-card rounded-lg p-4 shadow-sm">
              <div className="font-semibold mb-4 h-5 w-24 bg-muted rounded" />
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="flex items-center gap-3 px-4 py-4 rounded-xl shadow">
                    <div className="h-14 w-14 bg-muted rounded" />
                    <div className="flex-1 min-w-0">
                      <div className="h-4 bg-muted rounded w-2/3 mb-2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
