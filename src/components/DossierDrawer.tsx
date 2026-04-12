import { motion, AnimatePresence } from 'motion/react';
import { X, Crosshair, FileText, Clock, ChevronLeft, ChevronRight, Cctv } from 'lucide-react';
import { TIMELINE_NODES } from '../data/timeline';

interface DossierDrawerProps {
  activeNodeId: string | null;
  onClose: () => void;
  onNavigate: (nodeId: string) => void;
}

export function DossierDrawer({ activeNodeId, onClose, onNavigate }: DossierDrawerProps) {
  const activeData = TIMELINE_NODES.find(n => n.id === activeNodeId);
  const activeIndex = activeData ? TIMELINE_NODES.findIndex(n => n.id === activeData.id) : -1;
  const prevNode = activeIndex > 0 ? TIMELINE_NODES[activeIndex - 1] : null;
  const nextNode = activeIndex < TIMELINE_NODES.length - 1 && activeIndex !== -1 ? TIMELINE_NODES[activeIndex + 1] : null;

  return (
    <AnimatePresence>
      {activeData && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ type: "spring", damping: 20 }}
          className="absolute top-0 right-0 w-full md:w-[450px] h-full bg-black/80 border-l border-treadstone-red/20 backdrop-blur-xl p-8 pt-24 overflow-y-auto z-40 pointer-events-auto flex flex-col"
        >
          <button 
            onClick={onClose}
            className="absolute top-24 right-6 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex-grow">
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-2">
                <Crosshair className="w-4 h-4 text-treadstone-red" />
                <span className="font-mono text-xs text-treadstone-red tracking-widest">FILE: {activeData.id.toUpperCase()}</span>
              </div>
              
              <h2 className="text-3xl font-black tracking-tighter mb-6 uppercase glitch-text" data-text={activeData.title}>
                {activeData.title}
              </h2>

              {/* Character Dossier Section */}
              {activeData.characterName && (
                <div className="mb-8 p-4 border border-white/10 bg-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-treadstone-red" />
                  <div className="pl-2">
                    <div className="font-mono text-[10px] text-white/40 mb-1 uppercase tracking-widest">Primary Subject / Asset</div>
                    <div className="text-lg font-bold text-white tracking-tight leading-tight mb-2">{activeData.characterName}</div>
                    <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-treadstone-red/20 border border-treadstone-red/40 rounded-sm">
                      <span className="w-1 h-1 bg-treadstone-red rounded-full animate-pulse" />
                      <span className="font-mono text-[10px] text-treadstone-red font-bold">IDENTIFIED</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div className="border-l-2 border-white/20 pl-4">
                  <div className="font-mono text-[10px] text-white/40 mb-1 uppercase tracking-widest">Location</div>
                  <div className="font-mono text-sm text-white">{activeData.location}</div>
                </div>
                
                <div className="border-l-2 border-white/20 pl-4">
                  <div className="font-mono text-[10px] text-white/40 mb-1 uppercase tracking-widest">Date</div>
                  <div className="font-mono text-sm text-white">{activeData.date}</div>
                </div>

                <div className="border-l-2 border-white/20 pl-4">
                  <div className="font-mono text-[10px] text-white/40 mb-1 uppercase tracking-widest">Status</div>
                  <div className={`font-mono text-sm font-bold ${
                    activeData.status === 'CRITICAL' ? 'text-treadstone-red' : 
                    activeData.status === 'ACTIVE' ? 'text-treadstone-amber' : 
                    'text-[#00ff41]'
                  }`}>
                    {activeData.status}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                  <FileText className="w-4 h-4 text-white/50" />
                  <span className="font-mono text-xs text-white/50 tracking-widest uppercase">Incident Report</span>
                </div>
                <p className="font-mono text-sm leading-relaxed text-white/80">
                  {activeData.description}
                </p>
              </div>

              {/* Surveillance Footage Section */}
              {activeData.youtubeId && (
                <div className="mt-8">
                  <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                    <Cctv className="w-4 h-4 text-treadstone-red animate-pulse" />
                    <span className="font-mono text-xs text-treadstone-red tracking-widest uppercase">Surveillance Footage</span>
                  </div>
                  <div className="relative w-full aspect-video bg-black border border-white/10 overflow-hidden group">
                    <div className="absolute inset-0 z-10 pointer-events-none border border-treadstone-red/20" />
                    <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
                      <span className="w-2 h-2 bg-treadstone-red rounded-full animate-pulse" />
                      <span className="font-mono text-[10px] text-treadstone-red font-bold tracking-widest">REC</span>
                    </div>
                    <div className="absolute bottom-2 left-2 z-10 font-mono text-[10px] text-white/50 tracking-widest">
                      CAM_0{Math.floor(Math.random() * 9) + 1} // {activeData.location.toUpperCase()}
                    </div>
                    
                    <iframe
                      className="w-full h-full grayscale-[0.5] contrast-125 opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                      src={`https://www.youtube.com/embed/${activeData.youtubeId}?autoplay=1&mute=1&controls=0&modestbranding=1&playsinline=1&start=${activeData.youtubeStartTime || 0}`}
                      title="Surveillance Footage"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="mt-12 pt-6 border-t border-white/10 flex justify-between items-center">
            <button 
              onClick={() => prevNode && onNavigate(prevNode.id)}
              disabled={!prevNode}
              className="flex items-center gap-2 text-white/50 hover:text-white disabled:opacity-20 disabled:hover:text-white/50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-mono text-xs tracking-widest uppercase">Prev</span>
            </button>
            <div className="flex items-center gap-2 text-white/30">
              <Clock className="w-4 h-4" />
              <span className="font-mono text-[10px] tracking-widest">{activeIndex + 1} / {TIMELINE_NODES.length}</span>
            </div>
            <button 
              onClick={() => nextNode && onNavigate(nextNode.id)}
              disabled={!nextNode}
              className="flex items-center gap-2 text-white/50 hover:text-white disabled:opacity-20 disabled:hover:text-white/50 transition-colors"
            >
              <span className="font-mono text-xs tracking-widest uppercase">Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
