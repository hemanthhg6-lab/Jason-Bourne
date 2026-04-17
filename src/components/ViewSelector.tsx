import { useState } from 'react';
import { motion } from 'motion/react';
import { Crosshair } from 'lucide-react';
import { WireframeGlobe, WireframeNetwork } from './Visual3D';

interface ViewSelectorProps {
  onSelect: (mode: 'globe' | 'network') => void;
}

export function ViewSelector({ onSelect }: ViewSelectorProps) {
  const [hoveredGlobe, setHoveredGlobe] = useState(false);
  const [hoveredNetwork, setHoveredNetwork] = useState(false);

  return (
    <motion.div
      key="selector"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 1 }}
      className="w-full h-full flex flex-col items-center justify-center bg-black z-40 relative px-4"
    >
      <div className="text-center mb-16 pointer-events-none">
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
          onMouseEnter={() => setHoveredGlobe(true)}
          onMouseLeave={() => setHoveredGlobe(false)}
          onClick={() => onSelect('globe')}
          className="flex-1 relative group border border-white/20 bg-white/5 p-10 overflow-hidden transition-all duration-500 hover:border-treadstone-red hover:bg-treadstone-red/5 text-center flex flex-col items-center cursor-pointer"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,42,42,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <div className="h-56 flex items-center justify-center relative mb-8 w-full pointer-events-none">
            <WireframeGlobe isHovered={hoveredGlobe} />
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
          onMouseEnter={() => setHoveredNetwork(true)}
          onMouseLeave={() => setHoveredNetwork(false)}
          onClick={() => onSelect('network')}
          className="flex-1 relative group border border-white/20 bg-white/5 p-10 overflow-hidden transition-all duration-500 hover:border-[#00ff41] hover:bg-[#00ff41]/5 text-center flex flex-col items-center cursor-pointer"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,65,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <div className="h-56 flex items-center justify-center relative mb-8 w-full pointer-events-none">
             <WireframeNetwork isHovered={hoveredNetwork} />
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
