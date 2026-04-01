import { useEffect } from 'react';
import { motion } from 'motion/react';

export function TitleSequence({ onComplete }: { onComplete: () => void }) {
  const title = "JASON BOURNE";
  const letters = Array.from(title);

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 7000); // 7 seconds total duration before transitioning to the globe
    return () => clearTimeout(timer);
  }, [onComplete]);

  const container = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 1.2,
      }
    },
    exit: {
      opacity: 0,
      scale: 1.1,
      filter: "blur(15px)",
      transition: { duration: 1.5, ease: "easeInOut" }
    }
  };

  const child = {
    hidden: { opacity: 0, filter: "blur(20px)", x: 40, scale: 1.5 },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      x: 0,
      scale: 1,
      transition: {
        duration: 1.5,
        ease: [0.16, 1, 0.3, 1] // Smooth, cinematic ease-out
      }
    }
  };

  return (
    <motion.div 
      className="w-full h-full bg-black flex items-center justify-center relative z-50 overflow-hidden"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={container}
    >
      <div className="relative flex flex-col items-center">
        <div className="flex overflow-visible pb-4 px-8">
          {letters.map((letter, index) => (
            <motion.span
              key={index}
              variants={child}
              className="text-white text-5xl md:text-8xl lg:text-9xl font-black uppercase tracking-widest inline-block"
              style={{ 
                marginRight: letter === ' ' ? '2rem' : '0.2rem',
                transformOrigin: 'center center'
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>
        
        {/* Sci-Fi Scanning Line / Underline */}
        <motion.div 
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 3.2, duration: 1.5, ease: "easeInOut" }}
          className="h-[1px] w-full bg-treadstone-red/40 mt-2 relative origin-left"
        >
          <motion.div 
            initial={{ left: "0%", opacity: 0 }}
            animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
            transition={{ delay: 3.8, duration: 2, ease: "linear" }}
            className="absolute top-[-1px] w-12 h-[3px] bg-treadstone-red shadow-[0_0_20px_#ff2a2a] -ml-6"
          />
        </motion.div>

        {/* Subtitle Reveal */}
        <motion.div 
          initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 4.0, duration: 1.5, ease: "easeOut" }}
          className="mt-8 text-treadstone-red font-mono tracking-[0.5em] text-xs md:text-sm uppercase"
        >
          Operation: Treadstone
        </motion.div>
      </div>
    </motion.div>
  );
}
