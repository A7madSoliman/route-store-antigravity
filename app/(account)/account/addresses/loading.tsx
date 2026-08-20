export default function AddressesLoading() {
  return (
    <div
      aria-label="Loading addresses"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4 animate-pulse"
          >
            <div className="flex justify-between">
              <div className="h-5 w-16 bg-slate-200 rounded-lg" />
              <div className="h-4 w-12 bg-slate-100 rounded" />
            </div>
            <div className="h-4 w-full bg-slate-100 rounded" />
            <div className="h-4 w-2/3 bg-slate-100 rounded" />
            <div className="pt-3 border-t border-slate-100 flex justify-between">
              <div className="h-3 w-24 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading saved addresses</span>
    </div>
  );
}
