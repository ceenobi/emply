import { motion } from "framer-motion";

const FADE_DOWN_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } },
};

export const Headings = ({
  text,
  header,
  className,
}: {
  text: React.ReactNode;
  header: boolean;
  className?: string | undefined | object;
}) => {
  return (
    <>
      {header ? (
        <motion.div
          initial="hidden"
          animate="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          <motion.h1
            className={`font-semibold text-3xl tracking-[-0.02em] drop-shadow-sm ${className}`}
            variants={FADE_DOWN_ANIMATION_VARIANTS}
          >
            {text}
          </motion.h1>
        </motion.div>
      ) : (
        <h1 className={`font-semibold ${className}`}>{text}</h1>
      )}
    </>
  );
};

export const Texts = ({
  text,
  className,
  ...rest
}: {
  text: React.ReactNode;
  className?: string;
  onClick?: () => void;
  role?: string;
}) => {
  return (
    <p className={className} {...rest}>
      {text}
    </p>
  );
};
