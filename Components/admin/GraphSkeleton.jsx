export default function GraphSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-black/5 animate-pulse">
      <div className="flex justify-between mb-8">
        <div className="h-8 bg-black/5 rounded w-48"></div>
        <div className="h-8 bg-black/5 rounded w-32"></div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-black/5 rounded-xl"></div>
        ))}
      </div>

      <div className="h-[400px] bg-black/5 rounded-xl"></div>
    </div>
  );
}
