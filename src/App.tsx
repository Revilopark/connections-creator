import { useState, useCallback, useEffect } from 'react';
import { nodes, findPaths, getEdgesForPath, generateNarrative, generateSerendipityScore, nodeColorMap, Node, Edge } from './lib/graphData';
import { api, APIPath } from './lib/api';
import { ConnectionPath } from './components/ConnectionPath';
import { ShareCard } from './components/ShareCard';
import { Search, Shuffle, Share2, BookOpen, Sparkles, Zap, Eye, Flame, Gem, ArrowRight, Server, ServerOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [startId, setStartId] = useState('');
  const [endId, setEndId] = useState('');
  const [paths, setPaths] = useState<Node[][]>([]);
  const [selectedPath, setSelectedPath] = useState<Node[] | null>(null);
  const [selectedEdges, setSelectedEdges] = useState<Edge[]>([]);
  const [narrative, setNarrative] = useState('');
  const [scores, setScores] = useState({ serendipity: 0, curiosity: 0, synchronicity: 0, fortuity: 0, materiality: 0 });
  const [showShare, setShowShare] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [minSteps, setMinSteps] = useState(5);
  const [maxSteps, setMaxSteps] = useState(10);

  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  const [apiNodes, setApiNodes] = useState<Node[] | null>(null);

  // Check API availability on mount
  useEffect(() => {
    api.checkAvailability().then(setApiAvailable);
  }, []);

  // Load nodes from API if available
  useEffect(() => {
    if (apiAvailable) {
      api.getNodes().then(setApiNodes).catch(() => setApiAvailable(false));
    }
  }, [apiAvailable]);

  const displayNodes = apiNodes || nodes;

  const handleSearch = useCallback(async () => {
    if (!startId || !endId) return;
    setIsSearching(true);
    setPaths([]);
    setSelectedPath(null);
    setNarrative('');

    if (apiAvailable) {
      try {
        const response = await api.findPaths(startId, endId, minSteps, maxSteps);
        const convertedPaths: Node[][] = response.paths.map(p => p.nodes);
        setPaths(convertedPaths);
        if (convertedPaths.length > 0) {
          selectPath(convertedPaths[0], response.paths[0].edges, response.paths[0].scores);
        }
      } catch {
        // Fallback to local
        const found = findPaths(startId, endId, minSteps, maxSteps);
        setPaths(found);
        if (found.length > 0) selectPath(found[0]);
      }
    } else {
      setTimeout(() => {
        const found = findPaths(startId, endId, minSteps, maxSteps);
        setPaths(found);
        if (found.length > 0) selectPath(found[0]);
      }, 800);
    }
    setIsSearching(false);
  }, [startId, endId, minSteps, maxSteps, apiAvailable]);

  const selectPath = useCallback((path: Node[], edges?: Edge[], apiScores?: APIPath['scores']) => {
    setSelectedPath(path);
    if (edges) {
      setSelectedEdges(edges);
    } else {
      setSelectedEdges(getEdgesForPath(path));
    }
    setNarrative(generateNarrative(path, edges || getEdgesForPath(path)));
    if (apiScores) {
      setScores({
        serendipity: apiScores.serendipity / 100,
        curiosity: apiScores.curiosity / 100,
        synchronicity: apiScores.synchronicity / 100,
        fortuity: apiScores.fortuity / 100,
        materiality: apiScores.materiality / 100,
      });
    } else {
      setScores(generateSerendipityScore(path, edges || getEdgesForPath(path)));
    }
  }, []);

  const handleRandom = useCallback(() => {
    const inventions = displayNodes.filter(n => n.type === 'invention');
    const idx1 = Math.floor(Math.random() * inventions.length);
    let idx2 = Math.floor(Math.random() * inventions.length);
    while (idx1 === idx2) idx2 = Math.floor(Math.random() * inventions.length);
    setStartId(inventions[idx1].id);
    setEndId(inventions[idx2].id);
    
    setTimeout(() => {
      setIsSearching(true);
      setPaths([]);
      setSelectedPath(null);
      setNarrative('');
      
      setTimeout(() => {
        if (apiAvailable) {
          api.findPaths(inventions[idx1].id, inventions[idx2].id, minSteps, maxSteps)
            .then(response => {
              const convertedPaths: Node[][] = response.paths.map(p => p.nodes);
              setPaths(convertedPaths);
              if (convertedPaths.length > 0) {
                selectPath(convertedPaths[0], response.paths[0].edges, response.paths[0].scores);
              }
              setIsSearching(false);
            })
            .catch(() => {
              const found = findPaths(inventions[idx1].id, inventions[idx2].id, minSteps, maxSteps);
              setPaths(found);
              if (found.length > 0) selectPath(found[0]);
              setIsSearching(false);
            });
        } else {
          const found = findPaths(inventions[idx1].id, inventions[idx2].id, minSteps, maxSteps);
          setPaths(found);
          if (found.length > 0) selectPath(found[0]);
          setIsSearching(false);
        }
      }, 600);
    }, 100);
  }, [minSteps, maxSteps, selectPath, apiAvailable, displayNodes]);

  return (
    <div className="min-h-screen bg-[#050510] text-[#e2e8f0] font-outfit relative">
      <div className="starfield" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Sparkles className="w-6 h-6 text-[#c9a227]" />
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#e2e8f0]">
              Connections
            </h1>
            <Sparkles className="w-6 h-6 text-[#c9a227]" />
          </div>
          <p className="text-[#64748b] text-sm md:text-base max-w-lg mx-auto">
            Discover the hidden threads between human inventions. 
            Every path reveals a story of serendipity, materiality, and creative convergence.
          </p>
        </motion.header>

        {/* Connection Status */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center mb-4"
        >
          <div className={`flex items-center gap-2 text-xs px-3 py-1 rounded-full border ${apiAvailable === true ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-400' : apiAvailable === false ? 'bg-amber-950/30 border-amber-800/50 text-amber-400' : 'bg-[#0a0a1a] border-[#1e293b] text-[#475569]'}`}>
            {apiAvailable === true ? <Server className="w-3 h-3" /> : apiAvailable === false ? <ServerOff className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full bg-[#475569] animate-pulse" />}
            {apiAvailable === true ? 'Connected to MCP Server' : apiAvailable === false ? 'Offline Mode' : 'Checking connection...'}
          </div>
        </motion.div>

        {/* Search Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0a0a1a] border border-[#1e293b] rounded-xl p-6 mb-8 max-w-4xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-[#64748b] mb-2 uppercase tracking-wider">
                From
              </label>
              <select 
                value={startId} 
                onChange={e => setStartId(e.target.value)}
                className="w-full bg-[#050510] border border-[#1e293b] rounded-lg px-4 py-3 text-sm text-[#e2e8f0] focus:outline-none focus:border-[#c9a227] transition-colors"
              >
                <option value="">Select an invention...</option>
                {displayNodes.filter(n => n.type === 'invention').map(n => (
                  <option key={n.id} value={n.id}>{n.name} ({n.year > 0 ? n.year : `${Math.abs(n.year)} BC`})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#64748b] mb-2 uppercase tracking-wider">
                To
              </label>
              <select 
                value={endId} 
                onChange={e => setEndId(e.target.value)}
                className="w-full bg-[#050510] border border-[#1e293b] rounded-lg px-4 py-3 text-sm text-[#e2e8f0] focus:outline-none focus:border-[#c9a227] transition-colors"
              >
                <option value="">Select an invention...</option>
                {displayNodes.filter(n => n.type === 'invention').map(n => (
                  <option key={n.id} value={n.id}>{n.name} ({n.year > 0 ? n.year : `${Math.abs(n.year)} BC`})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <label className="text-xs text-[#64748b]">Min steps:</label>
              <input 
                type="range" min="3" max="8" value={minSteps} 
                onChange={e => setMinSteps(Number(e.target.value))}
                className="w-24 accent-[#c9a227]"
              />
              <span className="text-xs text-[#c9a227] w-4">{minSteps}</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-[#64748b]">Max steps:</label>
              <input 
                type="range" min="6" max="15" value={maxSteps} 
                onChange={e => setMaxSteps(Number(e.target.value))}
                className="w-24 accent-[#c9a227]"
              />
              <span className="text-xs text-[#c9a227] w-4">{maxSteps}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSearch}
              disabled={!startId || !endId || isSearching}
              className="flex-1 bg-[#c9a227] text-[#050510] font-semibold py-3 px-6 rounded-lg hover:bg-[#d4b43a] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              {isSearching ? 'Discovering paths...' : 'Find Connections'}
            </button>
            <button
              onClick={handleRandom}
              disabled={isSearching}
              className="bg-[#0a0a1a] border border-[#1e293b] text-[#e2e8f0] font-medium py-3 px-5 rounded-lg hover:border-[#c9a227] disabled:opacity-40 transition-all flex items-center gap-2"
            >
              <Shuffle className="w-4 h-4" />
              Random
            </button>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {isSearching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="inline-flex items-center gap-3">
                <div className="w-3 h-3 bg-[#c9a227] rounded-full animate-pulse" />
                <div className="w-3 h-3 bg-[#8b5cf6] rounded-full animate-pulse delay-150" />
                <div className="w-3 h-3 bg-[#06b6d4] rounded-full animate-pulse delay-300" />
              </div>
              <p className="mt-4 text-[#64748b] text-sm">Tracing threads through the knowledge graph...</p>
            </motion.div>
          )}

          {selectedPath && !isSearching && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              {/* Path Summary */}
              <div className="bg-[#0a0a1a] border border-[#1e293b] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#e2e8f0]">
                    Connection Path
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowShare(true)}
                      className="text-xs bg-[#0a0a1a] border border-[#1e293b] text-[#64748b] px-3 py-1.5 rounded-md hover:text-[#c9a227] hover:border-[#c9a227] transition-colors flex items-center gap-1"
                    >
                      <Share2 className="w-3 h-3" />
                      Share
                    </button>
                  </div>
                </div>
                
                <ConnectionPath 
                  path={selectedPath} 
                  edges={selectedEdges} 
                  onNodeClick={(node) => console.log(node)}
                />
              </div>

              {/* Score Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { key: 'serendipity', label: 'Serendipity', icon: Sparkles, color: '#c9a227' },
                  { key: 'curiosity', label: 'Curiosity', icon: Eye, color: '#8b5cf6' },
                  { key: 'synchronicity', label: 'Synchronicity', icon: Zap, color: '#06b6d4' },
                  { key: 'fortuity', label: 'Fortuity', icon: Flame, color: '#ef4444' },
                  { key: 'materiality', label: 'Materiality', icon: Gem, color: '#10b981' },
                ].map(({ key, label, icon: Icon, color }) => (
                  <motion.div 
                    key={key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + Object.keys(scores).indexOf(key) * 0.1 }}
                    className="bg-[#0a0a1a] border border-[#1e293b] rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4" style={{ color }} />
                      <span className="text-xs font-medium text-[#64748b]">{label}</span>
                    </div>
                    <div className="h-2 bg-[#050510] rounded-full overflow-hidden mb-1">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${scores[key as keyof typeof scores] * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    </div>
                    <span className="text-xs text-[#475569]">
                      {Math.round(scores[key as keyof typeof scores] * 100)}%
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Narrative */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-[#0a0a1a] border border-[#1e293b] rounded-xl p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-[#c9a227]" />
                  <h2 className="text-lg font-semibold text-[#e2e8f0]">The Story</h2>
                </div>
                <div className="prose prose-invert prose-sm max-w-none">
                  <div className="text-[#94a3b8] leading-relaxed whitespace-pre-line">
                    {narrative}
                  </div>
                </div>
              </motion.div>

              {/* Alternative Paths */}
              {paths.length > 1 && (
                <div className="bg-[#0a0a1a] border border-[#1e293b] rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-[#64748b] uppercase tracking-wider mb-4">
                    Alternative Paths ({paths.length - 1})
                  </h3>
                  <div className="space-y-2">
                    {paths.slice(1, 4).map((path, i) => (
                      <button
                        key={i}
                        onClick={() => selectPath(path)}
                        className="w-full text-left bg-[#050510] border border-[#1e293b] rounded-lg p-3 hover:border-[#8b5cf6] transition-colors group"
                      >
                        <div className="flex items-center gap-2 text-xs text-[#475569] mb-1">
                          <span className="text-[#8b5cf6]">Path {i + 2}</span>
                          <span className="text-[#64748b]">{path.length} steps</span>
                        </div>
                        <div className="flex items-center gap-1 flex-wrap text-sm text-[#94a3b8]">
                          {path.map((node, j) => (
                            <span key={node.id} className="flex items-center">
                              <span 
                                className="inline-block w-2 h-2 rounded-full mr-1"
                                style={{ backgroundColor: nodeColorMap[node.type] }}
                              />
                              {node.name}
                              {j < path.length - 1 && <ArrowRight className="w-3 h-3 mx-1 text-[#475569] group-hover:text-[#c9a227] transition-colors" />}
                            </span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShare && selectedPath && (
          <ShareCard 
            path={selectedPath} 
            edges={selectedEdges} 
            scores={scores}
            onClose={() => setShowShare(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
