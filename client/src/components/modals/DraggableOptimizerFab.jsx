import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setGlobalLoaderForStatus } from "../../redux/slice/resumeSlice";

export default function DraggableOptimizerFab() {
  const dispatch = useDispatch();
  const resumeSlice = useSelector((state) => state.resume);

  if (
    resumeSlice.globalLoaderForStatus ||
    !resumeSlice.statusHelper.loading
  ) {
    return null;
  }

  return (
    <motion.div
      drag
      dragMomentum
      dragElastic={0.15}
      whileTap={{ scale: 0.95 }}
      onTap={() => dispatch(setGlobalLoaderForStatus(true))}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="
        fixed z-[1000000]
        w-14 h-14 md:w-16 md:h-16
        rounded-full
        bg-[#3662e3]
        shadow-xl
        flex items-center justify-center
        text-white
        cursor-pointer
      "
      style={{
        bottom: 120,
        right: 16,
      }}
    >
      <span className="absolute inset-0 rounded-full animate-ping bg-white/30" />

      <svg
        className="absolute inset-0 animate-spin pointer-events-none"
        viewBox="0 0 100 100"
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeDasharray="220"
          strokeDashoffset="60"
          strokeLinecap="round"
        />
      </svg>

      <span className="relative z-10 text-xs md:text-sm font-medium">
        <span className="hidden md:inline">Working</span>
        <span className="md:hidden">•••</span>
      </span>
    </motion.div>
  );
}
