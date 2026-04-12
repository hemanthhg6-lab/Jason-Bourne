import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Fingerprint, Database, Terminal, Globe2, Network } from 'lucide-react';
import { AudioEngine } from './audio/AudioEngine';
import { TitleSequence } from './components/TitleSequence';
import { GlobeMap } from './components/GlobeMap';
import { NetworkMap } from './components/NetworkMap';
import { DossierDrawer } from './components/DossierDrawer';
import { SoundtrackPlayer } from './components/SoundtrackPlayer';

export default function App() {
  const [started, setStarted] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const [viewMode, setViewMode] = useState<'globe' | 'network'>('globe');
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const handleStart = () => {
    setStarted(true);
    AudioEngine.init();
  };

  return (
    <div className="w-full h-screen bg-[#050505] text-white font-sans overflow-hidden crt-flicker">
      <div className="crt-overlay pointer-events-none z-50"></div>
      
      {started && <SoundtrackPlayer />}

      <AnimatePresence mode="wait">
        {!started ? (
          <motion.div 
            key="start"
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
            className="w-full h-full flex items-center justify-center cursor-pointer bg-black z-50 relative"
            onClick={handleStart}
          >
            <div className="text-center font-mono animate-pulse">
              <div className="text-treadstone-red border border-treadstone-red px-8 py-4 bg-treadstone-red/10 hover:bg-treadstone-red/20 transition-colors tracking-widest text-sm md:text-base flex items-center justify-center gap-3">
                <Terminal className="w-5 h-5" />
                <span>[ DECRYPT TREADSTONE DOSSIER ]</span>
              </div>
            </div>
          </motion.div>
        ) : !introComplete ? (
          <TitleSequence key="intro" onComplete={() => setIntroComplete(true)} />
        ) : (
          <motion.div 
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="w-full h-full relative"
          >
            {/* Top Navigation / Status Bar - Absolute to float over globe */}
            <header className="absolute top-0 left-0 w-full h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/50 backdrop-blur-md z-30 pointer-events-none">
              <div className="flex items-center gap-4">
                <ShieldAlert className="w-6 h-6 text-treadstone-red animate-pulse" />
                <div className="flex flex-col">
                  <span className="font-mono text-xs text-treadstone-red tracking-widest uppercase">Classified</span>
                  <span className="font-mono text-sm font-bold tracking-wider">OPERATION: TREADSTONE</span>
                </div>
              </div>
              
              <div className="flex items-center gap-6 font-mono text-xs text-white/50 hidden md:flex">
                <div className="flex items-center gap-2 pointer-events-auto">
                  <button 
                    onClick={() => setViewMode('globe')}
                    className={`flex items-center gap-2 px-3 py-1.5 border transition-colors ${viewMode === 'globe' ? 'bg-white/10 border-white/30 text-white' : 'border-transparent hover:text-white'}`}
                  >
                    <Globe2 className="w-4 h-4" />
                    <span>GLOBE VIEW</span>
                  </button>
                  <button 
                    onClick={() => setViewMode('network')}
                    className={`flex items-center gap-2 px-3 py-1.5 border transition-colors ${viewMode === 'network' ? 'bg-white/10 border-white/30 text-white' : 'border-transparent hover:text-white'}`}
                  >
                    <Network className="w-4 h-4" />
                    <span>NETWORK VIEW</span>
                  </button>
                </div>
                <div className="w-px h-4 bg-white/20 mx-2"></div>
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-4 h-4" />
                  <span>SUBJECT: BOURNE, J.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  <span>STATUS: ROGUE</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-treadstone-red animate-pulse"></span>
                  <span>LIVE TRACKING</span>
                </div>
              </div>
            </header>

            {/* Main Content Area */}
            <main className="w-full h-full">
              {viewMode === 'globe' ? (
                <GlobeMap activeNode={activeNode} onNodeSelect={setActiveNode} />
              ) : (
                <NetworkMap activeNode={activeNode} onNodeSelect={setActiveNode} />
              )}
            </main>

            {/* Dossier Drawer */}
            <DossierDrawer 
              activeNodeId={activeNode} 
              onClose={() => setActiveNode(null)} 
              onNavigate={setActiveNode}
            />
            
            {/* Footer Status */}
            <footer className="absolute bottom-0 left-0 w-full h-8 border-t border-white/10 flex items-center px-4 justify-between font-mono text-[10px] text-white/30 bg-black/80 z-30 pointer-events-none">
              <span>SYS.VER 9.4.2 // BLACKBRIAR PROTOCOL ACTIVE</span>
              <span>{new Date().toISOString()}</span>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
