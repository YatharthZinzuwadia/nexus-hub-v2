import { motion, AnimatePresence } from "motion/react";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  transitionKey: string;
}

const PageTransition = ({ children, transitionKey }: PageTransitionProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionKey}
        className="relative w-full h-full"
        initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 1.03, filter: "blur(8px)" }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
      >
        {/* Red line sweep transition effect */}
        <motion.div
          className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-[#DC2626] to-transparent z-50 pointer-events-none"
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: "100vw", opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 0.6,
            ease: [0.4, 0.0, 0.2, 1],
            times: [0, 0.1, 0.9, 1],
          }}
          style={{
            boxShadow:
              "0 0 20px rgba(220, 38, 38, 0.8), 0 0 40px rgba(220, 38, 38, 0.4)",
          }}
        />

        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
