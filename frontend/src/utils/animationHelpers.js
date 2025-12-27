/**
 * Common Framer Motion animation variants
 */

// Form animations (Login, SignUp)
export const formAnimation = {
  initial: { y: "-8vh" },
  animate: { y: 10 },
  transition: {
    delay: 0.4,
    type: "spring",
    stiffness: 200,
    ease: "easeInOut",
  },
  whileHover: { scale: 1.01 },
};

// Card animations (Home balance card)
export const cardAnimation = {
  initial: { y: "-5vh" },
  animate: { y: 10 },
  transition: {
    delay: 0.1,
    type: "spring",
    stiffness: 200,
    ease: "easeInOut",
  },
  whileHover: { scale: 1.05 },
};

// List item animations (Transaction list)
export const listItemAnimation = (index) => ({
  initial: { y: "100vh" },
  animate: {
    opacity: [0, 0.5, 1],
    y: [100, 0, 0],
  },
  transition: {
    type: "twin",
    duration: 0.5,
    delay: (parseInt(index) + 0.5) / 10,
  },
});

// Page transition animation
export const pageAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};
