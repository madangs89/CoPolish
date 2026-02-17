import BlackLoader from "../Loaders/BlackLoader";

const StatusBadge = ({ status, sections = [] }) => {
  const runningSection = sections.find((s) => s.status === "running");
  const failedSection = sections.find((s) => s.status === "failed");
  const pendingSection = sections.find((s) => s.status === "pending");
  const allSuccess =
    sections.length > 0 &&
    sections.every((s) => s.status === "success");

  const base =
    "px-3 py-1 text-xs font-medium rounded-md border flex items-center gap-2";

  const formatName = (name) =>
    name?.charAt(0).toUpperCase() + name?.slice(1);

  if (status === "running") {
    return (
      <div className={`${base} bg-yellow-50 text-yellow-700 border-yellow-200`}>
        <BlackLoader size={14} />

        {runningSection && (
          <span>
            Optimizing {formatName(runningSection.name)}...
          </span>
        )}

        {!runningSection && pendingSection && (
          <span>Preparing next section...</span>
        )}

        {!runningSection && !pendingSection && allSuccess && (
          <span>Finalizing results...</span>
        )}
      </div>
    );
  }

  if (status === "completed") {
    return (
      <div className={`${base} bg-green-50 text-green-700 border-green-200`}>
        ✔ Profile Updated
      </div>
    );
  }

  if (status === "partial") {
    return (
      <div className={`${base} bg-orange-50 text-orange-700 border-orange-200`}>
        ⚠ Issue in {formatName(failedSection?.name) || "some sections"}
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className={`${base} bg-red-50 text-red-700 border-red-200`}>
        ✖ Failed in {formatName(failedSection?.name) || "optimization"}
      </div>
    );
  }

  return null;
};

export default StatusBadge;
