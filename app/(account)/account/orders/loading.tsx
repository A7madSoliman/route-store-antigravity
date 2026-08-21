export default function OrdersLoading() {
  return (
    <div
      aria-label="Loading orders"
      role="status"
      className="space-y-6"
    >
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-36 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-48 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="h-9 w-32 bg-slate-200 rounded-xl animate-pulse" />
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4 animate-pulse"
          >
            <div className="flex flex-col sm:flex-row justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="space-y-2">
                <div className="h-5 w-40 bg-slate-200 rounded" />
                <div className="h-4 w-56 bg-slate-100 rounded" />
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-slate-100 rounded-lg" />
                <div className="h-6 w-16 bg-slate-100 rounded-lg" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="h-16 bg-slate-50 rounded-xl border border-slate-100" />
              <div className="h-16 bg-slate-50 rounded-xl border border-slate-100" />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between">
              <div className="h-4 w-28 bg-slate-100 rounded" />
              <div className="h-5 w-32 bg-slate-200 rounded" />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading order history</span>
    </div>
  );
}
