import { MotionConfig, motion, useReducedMotion, type Variants } from "framer-motion";

/** Animated hero for the name "آریانا مهاجر" */
export default function Loading() {
  const prefersReduced = useReducedMotion();
  const NAME = "آریانا مهاجر";

  // Split into characters to animate each glyph
  const letters = Array.from(NAME);

  // Container controls the child staggering
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: 0.15,
        staggerChildren: 0.05,
      },
    },
  };

  // Each character springs upward into place
  const char = {
    hidden: { y: 24, opacity: 0, rotateX: 60 },
    show: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: { type: "spring", damping: 16, stiffness: 220 },
    },
  };

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-white">
        {/* Aurora blobs (purely decorative) */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-24 -left-16 h-80 w-80 rounded-full bg-violet-400/30 blur-3xl"
          animate={
            prefersReduced
              ? {}
              : { scale: [1, 1.1, 1], x: [0, 8, 0], y: [0, -6, 0] }
          }
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -right-16 h-96 w-96 rounded-full bg-cyan-400/25 blur-3xl"
          animate={
            prefersReduced ? {} : { scale: [1, 0.95, 1], x: [0, -10, 0] }
          }
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Main wordmark */}
        <motion.div
          dir="rtl"
          variants={container}
          initial="hidden"
          animate="show"
          whileHover={prefersReduced ? {} : { scale: 1.02 }}
          className="relative select-none"
        >
          {/* Shimmer sweep overlay */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 -skew-x-12"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
              mixBlendMode: "overlay",
            }}
            animate={prefersReduced ? {} : { x: ["-120%", "120%"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />

          <h1 className="text-center font-extrabold leading-[1.1] tracking-tight">
            <span className="block bg-gradient-to-tr from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-transparent">
              {letters.map((ch, i) => (
                <motion.span
                  key={`${ch}-${i}`}
                  variants={char as Variants}
                  className="inline-block will-change-transform"
                >
                  {ch === " " ? "\u00A0" : ch}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* Soft underline pulse */}
          <motion.div
            aria-hidden
            className="mx-auto mt-6 h-[3px] w-40 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 shadow-sm"
            animate={prefersReduced ? {} : { scaleX: [0.6, 1, 0.6] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>
    </MotionConfig>
  );
}
