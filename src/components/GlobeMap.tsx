import { useState, useEffect, useRef, useCallback } from 'react';
import Globe from 'react-globe.gl';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Crosshair, FileText, Clock } from 'lucide-react';
import { AudioEngine } from '../audio/AudioEngine';
import { TIMELINE_NODES } from '../data/timeline';

export function GlobeMap() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<any>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [countries, setCountries] = useState<any[]>([]);
  const globeRef = useRef<any>();
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    
    // Fetch GeoJSON for country borders
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(data => setCountries(data.features));
      
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.3; // Slowed down from 0.8
      controls.enableZoom = true;
      controls.zoomSpeed = 0.8;
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.minDistance = 120; // Prevent zooming inside the earth
      controls.maxDistance = 500; // Prevent zooming too far out
      globeRef.current.pointOfView({ altitude: 2.5 }, 0);
    }
  }, []);

  // Handle auto-rotation based on hover and active states
  useEffect(() => {
    if (globeRef.current) {
      if (activeNode || hoveredNode) {
        globeRef.current.controls().autoRotate = false;
      } else {
        globeRef.current.controls().autoRotate = true;
      }
    }
  }, [activeNode, hoveredNode]);

  const handleNodeClick = useCallback((node: any) => {
    AudioEngine.playNodeClick();
    setActiveNode(node.id);
    setHoveredNode(null); // Hide tooltip when clicked
    
    if (globeRef.current) {
      // Zoom in smoothly to the clicked location
      globeRef.current.pointOfView({ lat: node.lat, lng: node.lng, altitude: 0.6 }, 1500);
    }
  }, []);

  const handleNodeHover = useCallback((node: any) => {
    if (node && node.id !== hoveredNode?.id) {
      AudioEngine.playNodeHover();
    }
    setHoveredNode(node);
  }, [hoveredNode]);

  const handleCloseModal = () => {
    setActiveNode(null);
    if (globeRef.current) {
      globeRef.current.pointOfView({ altitude: 2.5 }, 1500);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const activeData = TIMELINE_NODES.find(n => n.id === activeNode);

  // Calculate tooltip position to prevent overflow
  const isRightHalf = mousePos.x > dimensions.width / 2;
  const isBottomHalf = mousePos.y > dimensions.height / 2;

  return (
    <div className="w-full h-full relative overflow-hidden bg-black" onMouseMove={handleMouseMove}>
      <div className="absolute inset-0 cursor-crosshair">
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          
          // Country Polygons
          polygonsData={countries}
          polygonAltitude={d => (d as any).properties.ISO_A3 === activeData?.countryCode ? 0.01 : 0.005}
          polygonCapColor={d => (d as any).properties.ISO_A3 === activeData?.countryCode ? 'rgba(0, 255, 65, 0.1)' : 'rgba(0,0,0,0)'}
          polygonSideColor={() => 'rgba(0,0,0,0)'}
          polygonStrokeColor={d => (d as any).properties.ISO_A3 === activeData?.countryCode ? '#00ff41' : 'rgba(255,255,255, 0.05)'}
          polygonsTransitionDuration={500}
          
          // Rings (reduced size)
          ringsData={TIMELINE_NODES}
          ringColor={(d: any) => d.id === activeNode ? '#00ff41' : d.id === hoveredNode?.id ? '#ff7777' : '#ff2a2a'}
          ringMaxRadius={d => d.id === activeNode ? 3 : d.id === hoveredNode?.id ? 2 : 1.5}
          ringPropagationSpeed={d => d.id === activeNode ? 0.8 : 1.5}
          ringRepeatPeriod={d => d.id === activeNode ? 800 : 1200}
          
          // Labels
          labelsData={TIMELINE_NODES}
          labelLat={(d: any) => d.lat}
          labelLng={(d: any) => d.lng}
          labelText={(d: any) => d.title}
          labelSize={(d: any) => d.id === activeNode ? 0.9 : d.id === hoveredNode?.id ? 0.8 : 0.5}
          labelDotRadius={0.4}
          labelColor={(d: any) => d.id === activeNode ? '#00ff41' : d.id === hoveredNode?.id ? '#ffffff' : 'rgba(255, 255, 255, 0.4)'}
          labelResolution={2}
          onLabelClick={handleNodeClick}
          onRingClick={handleNodeClick}
          onLabelHover={handleNodeHover}
          onRingHover={handleNodeHover}
          
          // Arcs
          arcsData={TIMELINE_NODES.slice(0, -1).map((node, i) => ({
            startLat: node.lat,
            startLng: node.lng,
            endLat: TIMELINE_NODES[i + 1].lat,
            endLng: TIMELINE_NODES[i + 1].lng,
            color: ['rgba(255, 42, 42, 0.1)', 'rgba(255, 42, 42, 0.8)']
          }))}
          arcColor="color"
          arcDashLength={0.4}
          arcDashGap={0.2}
          arcDashAnimateTime={2000}
          arcAltitudeAutoScale={0.2}
        />
      </div>
      
      {/* Vignette Overlay to blend the edges of the globe into the dark background */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,1)]" />

      {/* Hover Mini Card (Hook) */}
      <AnimatePresence>
        {hoveredNode && !activeNode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute pointer-events-none z-40 bg-black/95 border border-treadstone-red/40 p-4 backdrop-blur-md shadow-[0_0_30px_rgba(255,42,42,0.15)] min-w-[250px] max-w-[300px]"
            style={{ 
              left: isRightHalf ? undefined : mousePos.x + 20,
              right: isRightHalf ? dimensions.width - mousePos.x + 20 : undefined,
              top: isBottomHalf ? undefined : mousePos.y + 20,
              bottom: isBottomHalf ? dimensions.height - mousePos.y + 20 : undefined,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-treadstone-red animate-pulse rounded-full"></div>
              <div className="text-treadstone-red font-mono text-[10px] tracking-widest uppercase">Target Acquired</div>
            </div>
            <div className="text-white font-black text-sm tracking-widest uppercase mb-1">{hoveredNode.title}</div>
            <div className="text-white/50 font-mono text-xs mb-3">{hoveredNode.location}</div>
            <div className="text-treadstone-amber font-mono text-xs leading-relaxed border-t border-white/10 pt-2">
              &gt; {hoveredNode.hook}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {activeData && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ type: "spring", damping: 20 }}
            className="absolute top-0 right-0 w-full md:w-[450px] h-full bg-black/80 border-l border-treadstone-red/20 backdrop-blur-xl p-8 pt-24 overflow-y-auto z-20 pointer-events-auto"
          >
            <button 
              onClick={handleCloseModal}
              className="absolute top-24 right-6 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

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
                    <div className="flex gap-4">
                      <div className="w-24 h-24 flex-shrink-0 border border-white/20 relative overflow-hidden bg-black/50">
                        <img 
                          key={activeData.id}
                          src={activeData.characterImage} 
                          alt={activeData.characterName}
                          className="w-full h-full object-cover grayscale contrast-125 brightness-75 group-hover:grayscale-0 transition-all duration-500"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            if (!target.src.includes('ui-avatars')) {
                              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(activeData.characterName)}&background=0D0D0D&color=ff2a2a&size=256&font-size=0.33`;
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-treadstone-red/10 pointer-events-none" />
                        <div className="absolute inset-0 border-[0.5px] border-white/10 pointer-events-none" />
                      </div>
                      <div className="flex-grow">
                        <div className="font-mono text-[10px] text-white/40 mb-1 uppercase tracking-widest">Primary Subject / Asset</div>
                        <div className="text-lg font-bold text-white tracking-tight leading-tight mb-2">{activeData.characterName}</div>
                        <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-treadstone-red/20 border border-treadstone-red/40 rounded-sm">
                          <span className="w-1 h-1 bg-treadstone-red rounded-full animate-pulse" />
                          <span className="font-mono text-[10px] text-treadstone-red font-bold">IDENTIFIED</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4 font-mono text-xs text-white/70">
                <div className="flex items-start gap-3 border-b border-white/10 pb-4">
                  <MapPin className="w-4 h-4 mt-0.5 text-white/40" />
                  <div>
                    <div className="text-white/40 mb-1">LOCATION</div>
                    <div className="text-white">{activeData.location}</div>
                    <div className="text-white/50 mt-1">{activeData.lat.toFixed(4)}°, {activeData.lng.toFixed(4)}°</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-b border-white/10 pb-4">
                  <Clock className="w-4 h-4 mt-0.5 text-white/40" />
                  <div>
                    <div className="text-white/40 mb-1">TIMESTAMP</div>
                    <div className="text-white">{activeData.date}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <FileText className="w-4 h-4 mt-0.5 text-white/40" />
                  <div>
                    <div className="text-white/40 mb-2">INCIDENT REPORT</div>
                    <p className="leading-relaxed text-sm text-white/90">
                      {activeData.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-4 border border-treadstone-red/30 bg-treadstone-red/5 rounded">
                <div className="font-mono text-[10px] text-treadstone-red mb-1">THREAT LEVEL</div>
                <div className="font-mono text-lg font-bold text-treadstone-red tracking-widest">
                  {activeData.status}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
