export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.4, ease: "easeOut" }
};

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};
