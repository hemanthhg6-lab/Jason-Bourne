import { motion } from 'motion/react';
import { Globe2, Network, Crosshair } from 'lucide-react';

interface ViewSelectorProps {
  onSelect: (mode: 'globe' | 'network') => void;
}

export function ViewSelector({ onSelect }: ViewSelectorProps) {
  return (
    <motion.div
      key="selector"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 1 }}
      className="w-full h-full flex flex-col items-center justify-center bg-black z-40 relative px-4"
    >
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="font-mono text-treadstone-red text-xs tracking-[0.5em] mb-4 flex items-center justify-center gap-2"
        >
          <Crosshair className="w-4 h-4 animate-pulse" />
          <span>SYSTEM INITIALIZED</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-3xl md:text-5xl font-black tracking-widest uppercase text-white"
        >
          SELECT INTERFACE MODE
        </motion.h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl">
        {/* Globe View Option */}
        <motion.button
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, type: "spring", damping: 20 }}
          whileHover="hover"
          onClick={() => onSelect('globe')}
          className="flex-1 relative group border border-white/20 bg-white/5 p-10 overflow-hidden transition-all duration-500 hover:border-treadstone-red hover:bg-treadstone-red/5 text-center flex flex-col items-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,42,42,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="h-48 flex items-center justify-center relative mb-8 w-full">
            <Globe2 className="w-32 h-32 text-white/30 group-hover:text-treadstone-red transition-colors duration-500 relative z-10" />
            <motion.div
              variants={{ hover: { scale: [1, 1.5], opacity: [0.5, 0] } }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute w-32 h-32 border border-treadstone-red rounded-full opacity-0 group-hover:opacity-100"
            />
            <motion.div
              variants={{ hover: { scale: [1, 1.2], opacity: [0.8, 0] } }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              className="absolute w-32 h-32 border border-treadstone-red rounded-full opacity-0 group-hover:opacity-100"
            />
          </div>

          <h3 className="font-black text-2xl tracking-widest uppercase text-white mb-4 group-hover:text-treadstone-red transition-colors duration-500">
            GLOBAL VIEW
          </h3>
          
          <div className="h-20 flex items-start justify-center">
            <p className="font-mono text-sm text-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
              Geospatial tracking of all known assets. Trace the subject's movements across international borders.
            </p>
          </div>
        </motion.button>

        {/* Network View Option */}
        <motion.button
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2, type: "spring", damping: 20 }}
          whileHover="hover"
          onClick={() => onSelect('network')}
          className="flex-1 relative group border border-white/20 bg-white/5 p-10 overflow-hidden transition-all duration-500 hover:border-[#00ff41] hover:bg-[#00ff41]/5 text-center flex flex-col items-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,65,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="h-48 flex items-center justify-center relative mb-8 w-full">
            <Network className="w-32 h-32 text-white/30 group-hover:text-[#00ff41] transition-colors duration-500 relative z-10" />
            <motion.div
              variants={{ hover: { rotate: 180 } }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute w-40 h-40 border border-[#00ff41]/30 border-dashed rounded-full opacity-0 group-hover:opacity-100"
            />
            <motion.div
              variants={{ hover: { rotate: -180 } }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute w-48 h-48 border border-[#00ff41]/20 border-dotted rounded-full opacity-0 group-hover:opacity-100"
            />
          </div>

          <h3 className="font-black text-2xl tracking-widest uppercase text-white mb-4 group-hover:text-[#00ff41] transition-colors duration-500">
            NETWORK VIEW
          </h3>
          
          <div className="h-20 flex items-start justify-center">
            <p className="font-mono text-sm text-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
              Chronological event decryption. Analyze the timeline and interconnected nodes of Operation Treadstone.
            </p>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
}
