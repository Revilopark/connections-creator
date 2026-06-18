import { useState, useEffect } from 'react';
import { Node, Edge, nodeColorMap } from '../lib/graphData';
import { motion } from 'framer-motion';

interface ConnectionPathProps {
  path: Node[];
  edges: Edge[];
  onNodeClick?: (node: Node) => void;
}

export function ConnectionPath({ path, edges, onNodeClick }: ConnectionPathProps) {
  const [revealedIndex, setRevealedIndex] = useState(-1);

  useEffect(() => {
    setRevealedIndex(-1);
    let i = 0;
    const timer = setInterval(() => {
      if (i < path.length) {
        setRevealedIndex(i);
        i++;
      } else {
        clearInterval(timer);
      }
    }, 400);
    return () => clearInterval(timer);
  }, [path]);

  return (
    <div className="relative">
      <div className="flex flex-col gap-1">
        {path.map((node, i) => (
          <div key={node.id}>
            {/* Node */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={i <= revealedIndex ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex items-start gap-4"
            >
              {/* Timeline dot */}
              <div className="flex flex-col items-center">
                <div 
                  className="w-4 h-4 rounded-full border-2 flex-shrink-0 relative z-10"
                  style={{ 
                    borderColor: nodeColorMap[node.type] || '#94a3b8',
                    backgroundColor: i <= revealedIndex ? nodeColorMap[node.type] || '#94a3b8' : 'transparent',
                    boxShadow: i <= revealedIndex ? `0 0 12px ${nodeColorMap[node.type] || '#94a3b8'}40` : 'none'
                  }}
                >
                  {i <= revealedIndex && (
                    <div 
                      className="absolute inset-0 rounded-full animate-ping"
                      style={{ backgroundColor: nodeColorMap[node.type] || '#94a3b8', opacity: 0.3 }}
                    />
                  )}
                </div>
                {i < path.length - 1 && (
                  <div className="w-px h-16 bg-gradient-to-b from-[#1e293b] to-[#1e293b] my-1" />
                )}
              </div>

              {/* Card */}
              <div 
                className="flex-1 bg-[#050510] border border-[#1e293b] rounded-lg p-4 mb-2 hover:border-[#c9a227] transition-colors cursor-pointer node-glow"
                onClick={() => onNodeClick?.(node)}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ 
                        color: nodeColorMap[node.type] || '#94a3b8',
                        backgroundColor: `${nodeColorMap[node.type] || '#94a3b8'}15`
                      }}
                    >
                      {node.type}
                    </span>
                    <span className="text-xs text-[#475569] font-mono">
                      {node.year > 0 ? node.year : `${Math.abs(node.year)} BC`}
                    </span>
                  </div>
                  {node.place && (
                    <span className="text-xs text-[#475569]">{node.place}</span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-[#e2e8f0] mb-1">{node.name}</h3>
                <p className="text-xs text-[#64748b] leading-relaxed">{node.significance}</p>
              </div>
            </motion.div>

            {/* Edge */}
            {i < path.length - 1 && edges[i] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={i < revealedIndex ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="ml-8 pl-4 border-l-2 border-dashed border-[#1e293b] py-2 overflow-hidden"
                style={edges[i].surpriseFactor > 0.6 ? { borderColor: '#8b5cf640' } : undefined}
              >
                <div className="flex items-center gap-2">
                  {edges[i].surpriseFactor > 0.6 && (
                    <span className="text-xs text-[#8b5cf6] font-medium">✦ surprising</span>
                  )}
                  <span className="text-sm text-[#94a3b8] italic">
                    {edges[i].label}
                  </span>
                </div>
                {edges[i].surpriseFactor > 0.6 && (
                  <p className="text-xs text-[#64748b] mt-1">
                    Connection strength: {Math.round(edges[i].surpriseFactor * 100)}%
                  </p>
                )}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
