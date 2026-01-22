import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import { setGlobalLoaderForStatus } from "../../redux/slice/resumeSlice";

export default function DraggableOptimizerFab({
  dragDetails,
  setDragDetails,
}) {
  const dispatch = useDispatch();
  const resumeSlice = useSelector((state) => state.resume);

  const isDraggingRef = useRef(false);

  if (resumeSlice.globalLoaderForStatus || !resumeSlice.statusHelper.loading) {
    return null;
  }

  return (
    <motion.div
      drag
      dragMomentum
      dragElastic={0.15}
      whileTap={{ scale: 0.95 }}

      // ✅ Start drag
      onDragStart={() => {
        isDraggingRef.current = true;
      }}

      // ✅ Save final position
      onDragEnd={(event, info) => {
        setDragDetails((prev) => ({
          x: prev.x + info.offset.x,
          y: prev.y + info.offset.y,
        }));

        // Delay to avoid ghost click
        setTimeout(() => {
          isDraggingRef.current = false;
        }, 50);
      }}

      // ✅ Click only if NOT dragged
      onTap={() => {
        if (isDraggingRef.current) return;
        dispatch(setGlobalLoaderForStatus(true));
      }}

      // ✅ Framer Motion controls position
      animate={{
        x: dragDetails.x,
        y: dragDetails.y,
        opacity: 1,
        scale: 1,
      }}
      initial={{ opacity: 0, scale: 0.9 }}

      transition={{ type: "spring", stiffness: 300, damping: 25 }}

      className="
        fixed z-[1000000]
        w-14 h-14 md:w-14 md:h-14
        rounded-full
        bg-[#3662e3]
        shadow-xl
        flex items-center justify-center
        text-white
        cursor-pointer
        touch-none
        select-none
      "
      style={{
        bottom: 96,
        right: 16,
      }}
    >

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
        <span className="hidden text-[10px] md:inline">Working</span>
        <span className="md:hidden">•••</span>
      </span>
    </motion.div>
  );
}
