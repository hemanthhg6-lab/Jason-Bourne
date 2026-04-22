import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { motion, AnimatePresence } from 'motion/react';
import { Move, MousePointerClick } from 'lucide-react';
import { AudioEngine } from '../audio/AudioEngine';
import { TIMELINE_NODES } from '../data/timeline';

interface GlobeMapProps {
  activeNode: string | null;
  onNodeSelect: (nodeId: string | null) => void;
}

export function GlobeMap({ activeNode, onNodeSelect }: GlobeMapProps) {
  const [hoveredNode, setHoveredNode] = useState<any>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [countries, setCountries] = useState<any[]>([]);
  const globeRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [ftueStep, setFtueStep] = useState(0); // 0: needs globe drag/zoom, 1: needs node click, 2: complete
  const [activeAct, setActiveAct] = useState<number | null>(null);

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
      // Center on the Mediterranean/Europe where the first events occur
      globeRef.current.pointOfView({ lat: 43.0211, lng: 5.9322, altitude: 2.5 }, 0);
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

  // Automatically switch act if activeNode changes externally and is not in the current act
  useEffect(() => {
    if (activeNode) {
      const node = TIMELINE_NODES.find(n => n.id === activeNode);
      if (node && activeAct !== null && node.act !== activeAct) {
        setActiveAct(node.act);
      }
    }
  }, [activeNode, activeAct]);

  // Handle zooming when activeNode or activeAct changes
  useEffect(() => {
    if (globeRef.current) {
      if (activeNode) {
        const node = TIMELINE_NODES.find(n => n.id === activeNode);
        if (node) {
          globeRef.current.pointOfView({ lat: node.lat, lng: node.lng, altitude: 0.6 }, 1500);
        }
      } else if (activeAct !== null) {
        // Zoom to the first node of the selected act
        const firstNodeOfAct = TIMELINE_NODES.find(n => n.act === activeAct);
        if (firstNodeOfAct) {
          globeRef.current.pointOfView({ lat: firstNodeOfAct.lat, lng: firstNodeOfAct.lng, altitude: 1.5 }, 1500);
        }
      } else {
        globeRef.current.pointOfView({ altitude: 2.5 }, 1500);
      }
    }
  }, [activeNode, activeAct]);

  const handleNodeClick = useCallback((node: any) => {
    AudioEngine.playNodeClick();
    onNodeSelect(node.id);
    setHoveredNode(null); // Hide tooltip when clicked
    if (ftueStep < 2) setFtueStep(2);
  }, [onNodeSelect, ftueStep]);

  const handleNodeHover = useCallback((node: any) => {
    if (node && node.id !== hoveredNode?.id) {
      AudioEngine.playNodeHover();
    }
    setHoveredNode(node);
  }, [hoveredNode]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const activeData = TIMELINE_NODES.find(n => n.id === activeNode);

  // Filter nodes by active act
  const filteredNodes = useMemo(() => {
    return activeAct 
      ? TIMELINE_NODES.filter(n => n.act === activeAct)
      : TIMELINE_NODES;
  }, [activeAct]);

  const arcsData = useMemo(() => {
    return filteredNodes.slice(0, -1).map((node, i) => ({
      startLat: node.lat,
      startLng: node.lng,
      endLat: filteredNodes[i + 1].lat,
      endLng: filteredNodes[i + 1].lng,
      color: ['rgba(255, 42, 42, 0.1)', 'rgba(255, 42, 42, 0.8)']
    }));
  }, [filteredNodes]);

  // Calculate tooltip position to prevent overflow
  const isRightHalf = mousePos.x > dimensions.width / 2;
  const isBottomHalf = mousePos.y > dimensions.height / 2;

  return (
    <div className="w-full h-full relative overflow-hidden bg-black" onMouseMove={handleMouseMove}>
      {/* CRT Scanline Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.15] mix-blend-overlay bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
      
      {/* Act Selection */}
      <div className="absolute top-24 left-6 z-40 flex flex-col gap-2 pointer-events-auto">
        <div className="font-mono text-xs text-white/50 tracking-widest mb-2">FILTER BY ACT</div>
        <button
          onClick={() => { setActiveAct(null); onNodeSelect(null); }}
          className={`px-4 py-2 text-left font-mono text-xs tracking-widest border transition-colors ${
            activeAct === null 
              ? 'bg-white text-black border-white' 
              : 'bg-black text-white/70 border-white/20 hover:border-white/50 hover:text-white'
          }`}
        >
          ALL ACTS
        </button>
        {[1, 2, 3, 4].map(act => (
          <div key={act} className="relative group flex">
            <button
              onClick={() => { setActiveAct(act); onNodeSelect(null); }}
              className={`w-full text-left px-4 py-2 font-mono text-xs tracking-widest border transition-colors ${
                activeAct === act 
                  ? 'bg-treadstone-red text-white border-treadstone-red' 
                  : 'bg-black text-white/70 border-white/20 hover:border-white/50 hover:text-white'
              }`}
            >
              ACT {act}
            </button>
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-black/90 border border-treadstone-red/30 px-3 py-1.5 font-mono text-[10px] text-white whitespace-nowrap tracking-widest shadow-[0_0_15px_rgba(255,42,42,0.15)] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-treadstone-red animate-pulse" />
                {['THE BOURNE IDENTITY', 'THE BOURNE SUPREMACY', 'THE BOURNE ULTIMATUM', 'JASON BOURNE'][act - 1]}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div 
        className="absolute inset-0 cursor-crosshair"
        onPointerDown={() => ftueStep === 0 && setFtueStep(1)}
        onWheel={() => ftueStep === 0 && setFtueStep(1)}
      >
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
          ringsData={filteredNodes}
          ringColor={(d: any) => d.id === activeNode ? '#00ff41' : d.id === hoveredNode?.id ? '#ff7777' : '#ff2a2a'}
          ringMaxRadius={(d: any) => d.id === activeNode ? 3 : d.id === hoveredNode?.id ? 2 : 1.5}
          ringPropagationSpeed={(d: any) => d.id === activeNode ? 0.8 : 1.5}
          ringRepeatPeriod={(d: any) => d.id === activeNode ? 800 : 1200}
          
          // Labels
          labelsData={filteredNodes}
          labelLat={(d: any) => d.lat}
          labelLng={(d: any) => d.lng}
          labelText={(d: any) => d.title}
          labelSize={(d: any) => d.id === activeNode ? 0.9 : d.id === hoveredNode?.id ? 0.8 : 0.5}
          labelDotRadius={0.4}
          labelColor={(d: any) => d.id === activeNode ? '#00ff41' : d.id === hoveredNode?.id ? '#ffffff' : 'rgba(255, 255, 255, 0.4)'}
          labelResolution={2}
          labelAltitude={0.02}
          onLabelClick={handleNodeClick}
          onLabelHover={handleNodeHover}
          
          // Arcs
          arcsData={arcsData}
          arcColor="color"
          arcDashLength={0.4}
          arcDashGap={0.2}
          arcDashAnimateTime={2000}
          arcAltitudeAutoScale={0.2}
        />
      </div>
      
      {/* Vignette Overlay to blend the edges of the globe into the dark background */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,1)]" />

      {/* FTUE Nudges */}
      <AnimatePresence>
        {ftueStep === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-1/4 left-1/2 -translate-x-1/2 pointer-events-none z-40"
          >
            <div className="bg-black/80 border border-[#00ff41]/50 text-[#00ff41] px-6 py-3 rounded font-mono text-xs tracking-widest flex items-center gap-3 shadow-[0_0_20px_rgba(0,255,65,0.2)] backdrop-blur-sm">
              <Move className="w-4 h-4 animate-pulse" />
              <span>[ SYSTEM PROMPT: DRAG TO ROTATE // SCROLL TO ZOOM ]</span>
            </div>
          </motion.div>
        )}
        {ftueStep === 1 && !activeNode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-none z-40"
          >
            <div className="bg-black/80 border border-treadstone-red/50 text-treadstone-red px-6 py-3 rounded font-mono text-xs tracking-widest flex items-center gap-3 shadow-[0_0_20px_rgba(255,42,42,0.2)] backdrop-blur-sm">
              <MousePointerClick className="w-4 h-4 animate-pulse" />
              <span>[ SYSTEM PROMPT: SELECT TARGET TO VIEW DOSSIER ]</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Timeline Scrubber */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          {filteredNodes.map((node, i) => (
            <div key={node.id} className="flex items-center">
              <button
                onClick={() => handleNodeClick(node)}
                onMouseEnter={() => handleNodeHover(node)}
                onMouseLeave={() => handleNodeHover(null)}
                className={`relative w-3 h-3 rounded-full transition-all duration-300 ${
                  activeNode === node.id 
                    ? 'bg-[#00ff41] scale-125 shadow-[0_0_10px_rgba(0,255,65,0.5)]' 
                    : hoveredNode?.id === node.id
                      ? 'bg-white scale-110'
                      : 'bg-white/30 hover:bg-white/50'
                }`}
                title={node.title}
              />
              {i < filteredNodes.length - 1 && (
                <div className={`w-4 h-[1px] ${activeNode === node.id || activeNode === filteredNodes[i+1].id ? 'bg-[#00ff41]/50' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

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
    </div>
  );
}
