const SkeletonLoader = () => {
  return (
    <div className="rounded-3xl p-6 bg-gray-100 border border-gray-200 overflow-hidden">
      {/* Title */}
      <div className="h-4 w-20 skeleton rounded mb-3" />

      {/* Score */}
      <div className="flex items-end gap-2">
        <div className="h-14 w-24 skeleton rounded" />
        <div className="h-5 w-12 skeleton rounded mb-2" />
      </div>

      {/* Last optimized */}
      <div className="h-4 w-40 skeleton rounded mt-4" />

      {/* Buttons */}
      <div className="flex gap-3 mt-6">
        <div className="h-10 w-28 skeleton rounded-full" />
        <div className="h-10 w-32 skeleton rounded-full" />
      </div>
    </div>
  );
};

export default SkeletonLoader;
