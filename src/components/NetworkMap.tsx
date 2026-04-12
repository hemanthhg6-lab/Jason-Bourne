import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  NodeProps,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { TIMELINE_NODES } from '../data/timeline';
import { AudioEngine } from '../audio/AudioEngine';

interface NetworkMapProps {
  activeNode: string | null;
  onNodeSelect: (nodeId: string | null) => void;
}

// Custom Node Component
function TimelineNode({ data, selected }: NodeProps) {
  const nodeData = data as any;
  const statusColor = 
    nodeData.status === 'CRITICAL' ? 'border-treadstone-red text-treadstone-red shadow-[0_0_15px_rgba(255,42,42,0.3)]' :
    nodeData.status === 'ACTIVE' ? 'border-treadstone-amber text-treadstone-amber shadow-[0_0_15px_rgba(255,170,0,0.3)]' :
    'border-[#00ff41] text-[#00ff41] shadow-[0_0_15px_rgba(0,255,65,0.3)]';

  return (
    <div 
      className={`px-4 py-2 bg-black/90 border-2 backdrop-blur-md cursor-pointer transition-all duration-300 ${statusColor} ${selected ? 'scale-110 z-50' : 'hover:scale-105'}`}
      style={{ minWidth: '180px' }}
    >
      <Handle type="target" position={Position.Left} className="!bg-white/50 !w-2 !h-2" />
      <div className="font-mono text-[10px] opacity-70 mb-1">{nodeData.date} // {nodeData.location}</div>
      <div className="font-black text-xs tracking-widest uppercase">{nodeData.title}</div>
      <Handle type="source" position={Position.Right} className="!bg-white/50 !w-2 !h-2" />
    </div>
  );
}

const nodeTypes = {
  timeline: TimelineNode,
};

export function NetworkMap({ activeNode, onNodeSelect }: NetworkMapProps) {
  const [activeAct, setActiveAct] = useState<number | null>(null);

  // Automatically switch act if activeNode changes externally and is not in the current act
  useEffect(() => {
    if (activeNode) {
      const node = TIMELINE_NODES.find(n => n.id === activeNode);
      if (node && activeAct !== null && node.act !== activeAct) {
        setActiveAct(node.act);
      }
    }
  }, [activeNode, activeAct]);

  // Generate nodes and edges based on selected act or all
  const { initialNodes, initialEdges } = useMemo(() => {
    const filteredNodes = activeAct 
      ? TIMELINE_NODES.filter(n => n.act === activeAct)
      : TIMELINE_NODES;

    const nodes = filteredNodes.map((node, index) => {
      // Create a horizontal layout with slight deterministic vertical variations
      const x = index * 300 + 100;
      const y = (index % 2 === 0 ? 150 : 250) + (index % 3 === 0 ? 20 : -20);

      return {
        id: node.id,
        type: 'timeline',
        position: { x, y },
        data: { ...node },
      };
    });

    const edges = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      const isConnectedToActive = activeNode === nodes[i].id || activeNode === nodes[i+1].id;
      edges.push({
        id: `e-${nodes[i].id}-${nodes[i+1].id}`,
        source: nodes[i].id,
        target: nodes[i+1].id,
        type: 'smoothstep',
        animated: true,
        style: { 
          stroke: isConnectedToActive ? '#00ff41' : 'rgba(255, 255, 255, 0.2)', 
          strokeWidth: isConnectedToActive ? 3 : 2,
          filter: isConnectedToActive ? 'drop-shadow(0 0 5px rgba(0,255,65,0.5))' : 'none'
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isConnectedToActive ? '#00ff41' : 'rgba(255, 255, 255, 0.2)',
        },
      });
    }

    return { initialNodes: nodes, initialEdges: edges };
  }, [activeAct, activeNode]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [showNudge, setShowNudge] = useState(true);
  const [showConnectedNudge, setShowConnectedNudge] = useState(false);

  // Update nodes when initialNodes changes
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Update selected state of nodes
  useEffect(() => {
    setNodes(nds => nds.map(node => ({
      ...node,
      selected: node.id === activeNode
    })));
  }, [activeNode, setNodes]);

  const onNodeClick = useCallback((_, node) => {
    AudioEngine.playNodeClick();
    onNodeSelect(node.id);
    if (showNudge) {
      setShowNudge(false);
      setShowConnectedNudge(true);
    } else if (showConnectedNudge) {
      setShowConnectedNudge(false);
    }
  }, [onNodeSelect, showNudge, showConnectedNudge]);

  return (
    <div className="w-full h-full relative bg-black">
      {/* CRT Scanline Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.15] mix-blend-overlay bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
      
      {/* Act Selection */}
      <div className="absolute top-24 left-6 z-40 flex flex-col gap-2">
        <div className="font-mono text-xs text-white/50 tracking-widest mb-2">FILTER BY ACT</div>
        <button
          onClick={() => setActiveAct(null)}
          className={`px-4 py-2 font-mono text-xs tracking-widest border transition-colors ${
            activeAct === null 
              ? 'bg-white text-black border-white' 
              : 'bg-black text-white/70 border-white/20 hover:border-white/50 hover:text-white'
          }`}
        >
          ALL ACTS
        </button>
        {[1, 2, 3, 4].map(act => (
          <button
            key={act}
            onClick={() => setActiveAct(act)}
            className={`px-4 py-2 font-mono text-xs tracking-widest border transition-colors ${
              activeAct === act 
                ? 'bg-treadstone-red text-white border-treadstone-red' 
                : 'bg-black text-white/70 border-white/20 hover:border-white/50 hover:text-white'
            }`}
          >
            ACT {act}
          </button>
        ))}
      </div>

      {/* FTUE Nudge */}
      {showNudge && !activeNode && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
          <div className="bg-black/80 border border-treadstone-red/50 text-treadstone-red px-6 py-3 rounded font-mono text-xs tracking-widest flex items-center gap-3 shadow-[0_0_20px_rgba(255,42,42,0.2)] backdrop-blur-sm animate-pulse">
            <span>[ SYSTEM PROMPT: SELECT NODE TO DECRYPT EVENT DATA ]</span>
          </div>
        </div>
      )}

      {showConnectedNudge && activeNode && (
         <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
         <div className="bg-black/80 border border-[#00ff41]/50 text-[#00ff41] px-6 py-3 rounded font-mono text-xs tracking-widest flex items-center gap-3 shadow-[0_0_20px_rgba(0,255,65,0.2)] backdrop-blur-sm animate-pulse">
           <span>[ SYSTEM PROMPT: EXPLORE CONNECTED NODES FOR MORE DETAILS ]</span>
         </div>
       </div>
      )}

      {/* Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,1)] z-30" />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        className="bg-black"
        minZoom={0.2}
        maxZoom={2}
      >
        <Background color="rgba(255, 255, 255, 0.05)" gap={30} size={1} />
        <Controls className="!bg-black !border-white/20 !fill-white" />
      </ReactFlow>
    </div>
  );
}
