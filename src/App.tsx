import { useState, useCallback, useEffect } from 'react';
import { nodes, findPaths, getEdgesForPath, generateNarrative, generateSerendipityScore, nodeColorMap, Node, Edge } from './lib/graphData';
import { api, APIPath } from './lib/api';
import { Search, Shuffle, Share2, BookOpen, Sparkles, Zap, Eye, Flame, Gem, ArrowRight, Server, ServerOff, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Midnight Galaxy Theme
const THEME = {
  bg: '#0f0c29',
  bgGradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
  card: 'rgba(43, 30, 62, 0.8)',
  cardBorder: 'rgba(164, 144, 194, 0.2)',
  cardHover: 'rgba(74, 78, 143, 0.5)',
  text: '#e6e6fa',
  textMuted: '#a490c2',
  accent: '#c9a227',
  accent2: '#4a4e8f',
  lavender: '#a490c2',
  silver: '#e6e6fa',
};

function InventionCard({ node, selected, onClick }: { node: Node; selected: boolean; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 ${
        selected 
          ? 'border-[#c9a227] shadow-lg shadow-[#c9a227]/30' 
          : 'border-[rgba(164,144,194,0.2)] hover:border-[rgba(164,144,194,0.5)]'
      }`}
      style={{ background: THEME.card }}
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        {node.imageUrl ? (
          <img 
            src={node.imageUrl} 
            alt={node.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#2b1e3e] to-[#4a4e8f] flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-[#a490c2] opacity-50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0c29] via-transparent to-transparent" />
        <div className="absolute bottom-2 left-2 right-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#4a4e8f]/80 text-[#e6e6fa] font-medium">
            {node.year > 0 ? node.year : `${Math.abs(node.year)} BC`}
          </span>
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold text-[#e6e6fa] truncate">{node.name}</h3>
        <p className="text-xs text-[#a490c2] mt-1 line-clamp-2">{node.summary}</p>
      </div>
      {selected && (
        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#c9a227] flex items-center justify-center">
          <Sparkles className="w-3 h-3 text-[#0f0c29]" />
        </div>
      )}
    </motion.div>
  );
}

function ConnectionStep({ node, edge, index, isLast }: { node: Node; edge?: Edge; index: number; isLast: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.15 }}
      className="flex items-start gap-4"
    >
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4a4e8f] to-[#2b1e3e] border-2 border-[#a490c2] flex items-center justify-center text-sm font-bold text-[#e6e6fa]">
          {index + 1}
        </div>
        {!isLast && (
          <div className="w-0.5 h-16 bg-gradient-to-b from-[#a490c2] to-[#4a4e8f] mt-1" />
        )}
      </div>
      <div className="flex-1 pb-6">
        <div className="flex items-start gap-3">
          {node.imageUrl && (
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-[rgba(164,144,194,0.3)]">
              <img src={node.imageUrl} alt={node.name} className="w-full h-full object-cover" loading="lazy" />
            </div>
          )}
          <div>
            <h4 className="text-base font-semibold text-[#e6e6fa]">{node.name}</h4>
            <span className="text-xs text-[#a490c2]">{node.year > 0 ? node.year : `${Math.abs(node.year)} BC`} · {node.place}</span>
            {edge && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-2 text-sm text-[#a490c2] italic"
              >
                {edge.label}
                {edge.surpriseFactor > 0.6 && (
                  <span className="ml-2 text-xs text-[#c9a227]">✨ Surprise: {Math.round(edge.surpriseFactor * 100)}%</span>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ScoreCard({ label, value, icon: Icon, color, delay }: { label: string; value: number; icon: any; color: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="rounded-xl p-4 border border-[rgba(164,144,194,0.2)]"
      style={{ background: THEME.card }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <span className="text-xs font-medium text-[#a490c2] uppercase tracking-wider">{label}</span>
      </div>
      <div className="h-2 bg-[#0f0c29] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.2, delay: delay + 0.2, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <div className="mt-2 flex justify-between items-center">
        <span className="text-lg font-bold" style={{ color }}>{Math.round(value)}%</span>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="w-1.5 h-1.5 rounded-full" 
              style={{ background: i < Math.round(value / 20) ? color : 'rgba(164,144,194,0.2)' }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

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
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [filterTag, setFilterTag] = useState<string | null>(null);

  useEffect(() => {
    api.checkAvailability().then(setApiAvailable);
  }, []);

  const inventionNodes = nodes.filter(n => n.type === 'invention' || n.type === 'discovery');
  const tags = Array.from(new Set(inventionNodes.flatMap(n => n.tags)));
  const filteredNodes = filterTag ? inventionNodes.filter(n => n.tags.includes(filterTag)) : inventionNodes;

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
        serendipity: apiScores.serendipity,
        curiosity: apiScores.curiosity,
        synchronicity: apiScores.synchronicity,
        fortuity: apiScores.fortuity,
        materiality: apiScores.materiality,
      });
    } else {
      setScores(generateSerendipityScore(path, edges || getEdgesForPath(path)));
    }
  }, []);

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
  }, [startId, endId, minSteps, maxSteps, apiAvailable, selectPath]);

  const handleRandom = useCallback(() => {
    const inventions = inventionNodes;
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
  }, [minSteps, maxSteps, selectPath, apiAvailable]);

  const getSelectedNode = (id: string) => nodes.find(n => n.id === id);

  return (
    <div 
      className="min-h-screen text-[#e6e6fa] font-sans relative"
      style={{ background: THEME.bgGradient }}
    >
      {/* Animated stars background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1,
            }}
            animate={{
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.div 
            className="flex items-center justify-center gap-3 mb-3"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-7 h-7 text-[#c9a227]" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#e6e6fa]">
              Connections
            </h1>
            <Sparkles className="w-7 h-7 text-[#c9a227]" />
          </motion.div>
          <p className="text-[#a490c2] text-sm md:text-base max-w-lg mx-auto">
            Discover the hidden threads between human inventions.
            Every path reveals a story of serendipity and creative convergence.
          </p>
          
          {/* Connection Status */}
          <div className="flex justify-center mt-4">
            <div className={`inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border ${apiAvailable === true ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-400' : apiAvailable === false ? 'bg-amber-950/30 border-amber-800/50 text-amber-400' : 'bg-[#2b1e3e] border-[#4a4e8f] text-[#a490c2]'}`}>
              {apiAvailable === true ? <Server className="w-3 h-3" /> : apiAvailable === false ? <ServerOff className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full bg-[#a490c2] animate-pulse" />}
              {apiAvailable === true ? 'Connected to MCP Server' : apiAvailable === false ? 'Offline Mode' : 'Checking connection...'}
            </div>
          </div>
        </motion.header>

        {/* Selection Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-6 mb-8 border border-[rgba(164,144,194,0.2)]"
          style={{ background: THEME.card }}
        >
          {/* Selected pair display */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={() => { setShowFromPicker(true); setShowToPicker(false); }}
              className={`flex items-center gap-3 px-5 py-3 rounded-xl border-2 transition-all ${startId ? 'border-[#c9a227] bg-[#c9a227]/10' : 'border-[rgba(164,144,194,0.3)] hover:border-[#a490c2]'}`}
            >
              {startId && getSelectedNode(startId)?.imageUrl ? (
                <img src={getSelectedNode(startId)?.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-[#4a4e8f]/30 flex items-center justify-center">
                  <Search className="w-5 h-5 text-[#a490c2]" />
                </div>
              )}
              <div className="text-left">
                <span className="text-xs text-[#a490c2] uppercase tracking-wider">From</span>
                <p className="text-sm font-semibold text-[#e6e6fa]">{startId ? getSelectedNode(startId)?.name : 'Select invention...'}</p>
              </div>
            </button>
            
            <ArrowRight className="w-6 h-6 text-[#a490c2]" />
            
            <button
              onClick={() => { setShowToPicker(true); setShowFromPicker(false); }}
              className={`flex items-center gap-3 px-5 py-3 rounded-xl border-2 transition-all ${endId ? 'border-[#c9a227] bg-[#c9a227]/10' : 'border-[rgba(164,144,194,0.3)] hover:border-[#a490c2]'}`}
            >
              {endId && getSelectedNode(endId)?.imageUrl ? (
                <img src={getSelectedNode(endId)?.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-[#4a4e8f]/30 flex items-center justify-center">
                  <Search className="w-5 h-5 text-[#a490c2]" />
                </div>
              )}
              <div className="text-left">
                <span className="text-xs text-[#a490c2] uppercase tracking-wider">To</span>
                <p className="text-sm font-semibold text-[#e6e6fa]">{endId ? getSelectedNode(endId)?.name : 'Select invention...'}</p>
              </div>
            </button>
          </div>

          {/* Step controls */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#a490c2]">Min steps:</span>
              <input 
                type="range" min="3" max="8" value={minSteps} 
                onChange={e => setMinSteps(Number(e.target.value))}
                className="w-24 accent-[#c9a227]"
              />
              <span className="text-xs text-[#c9a227] font-bold w-4">{minSteps}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#a490c2]">Max steps:</span>
              <input 
                type="range" min="6" max="15" value={maxSteps} 
                onChange={e => setMaxSteps(Number(e.target.value))}
                className="w-24 accent-[#c9a227]"
              />
              <span className="text-xs text-[#c9a227] font-bold w-4">{maxSteps}</span>
            </div>
          </div>

          <div className="flex gap-3 max-w-md mx-auto">
            <button
              onClick={handleSearch}
              disabled={!startId || !endId || isSearching}
              className="flex-1 bg-gradient-to-r from-[#c9a227] to-[#d4a93a] text-[#0f0c29] font-bold py-3 px-6 rounded-xl hover:from-[#d4b43a] hover:to-[#e0b845] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#c9a227]/20"
            >
              <Search className="w-4 h-4" />
              {isSearching ? 'Discovering...' : 'Find Connections'}
            </button>
            <button
              onClick={handleRandom}
              disabled={isSearching}
              className="px-5 py-3 rounded-xl border border-[rgba(164,144,194,0.3)] text-[#e6e6fa] font-medium hover:border-[#a490c2] hover:bg-[rgba(164,144,194,0.1)] disabled:opacity-40 transition-all flex items-center gap-2"
            >
              <Shuffle className="w-4 h-4" />
              Random
            </button>
          </div>
        </motion.div>

        {/* Invention Picker Modal */}
        <AnimatePresence>
          {(showFromPicker || showToPicker) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#0f0c29]/90 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => { setShowFromPicker(false); setShowToPicker(false); }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-4xl max-h-[80vh] rounded-2xl border border-[rgba(164,144,194,0.2)] overflow-hidden flex flex-col"
                style={{ background: THEME.card }}
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-4 border-b border-[rgba(164,144,194,0.2)]">
                  <h2 className="text-lg font-semibold text-[#e6e6fa]">
                    Select {showFromPicker ? 'Start' : 'End'} Invention
                  </h2>
                  <button onClick={() => { setShowFromPicker(false); setShowToPicker(false); }} className="p-2 hover:bg-[rgba(164,144,194,0.1)] rounded-lg transition-colors">
                    <X className="w-5 h-5 text-[#a490c2]" />
                  </button>
                </div>
                
                {/* Tag filter */}
                <div className="flex gap-2 p-4 overflow-x-auto border-b border-[rgba(164,144,194,0.1)]">
                  <button
                    onClick={() => setFilterTag(null)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${!filterTag ? 'bg-[#c9a227] text-[#0f0c29]' : 'bg-[#4a4e8f]/30 text-[#a490c2] hover:bg-[#4a4e8f]/50'}`}
                  >
                    All
                  </button>
                  {tags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setFilterTag(tag === filterTag ? null : tag)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all capitalize ${filterTag === tag ? 'bg-[#c9a227] text-[#0f0c29]' : 'bg-[#4a4e8f]/30 text-[#a490c2] hover:bg-[#4a4e8f]/50'}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                
                <div className="overflow-y-auto p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {filteredNodes.map(node => (
                      <InventionCard
                        key={node.id}
                        node={node}
                        selected={showFromPicker ? startId === node.id : endId === node.id}
                        onClick={() => {
                          if (showFromPicker) {
                            setStartId(node.id);
                            setShowFromPicker(false);
                          } else {
                            setEndId(node.id);
                            setShowToPicker(false);
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
                <motion.div 
                  className="w-4 h-4 bg-[#c9a227] rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <motion.div 
                  className="w-4 h-4 bg-[#8b5cf6] rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div 
                  className="w-4 h-4 bg-[#06b6d4] rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                />
              </div>
              <p className="mt-4 text-[#a490c2] text-sm">Tracing threads through the knowledge graph...</p>
            </motion.div>
          )}

          {selectedPath && !isSearching && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              {/* Path Visualization */}
              <div className="rounded-2xl p-6 border border-[rgba(164,144,194,0.2)]" style={{ background: THEME.card }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-[#e6e6fa]">Connection Path</h2>
                    <p className="text-sm text-[#a490c2]">{selectedPath.length} nodes · {selectedEdges.length} connections</p>
                  </div>
                  <button
                    onClick={() => setShowShare(true)}
                    className="text-xs bg-[#4a4e8f]/30 border border-[rgba(164,144,194,0.2)] text-[#a490c2] px-4 py-2 rounded-xl hover:text-[#c9a227] hover:border-[#c9a227] transition-all flex items-center gap-2"
                  >
                    <Share2 className="w-3 h-3" />
                    Share
                  </button>
                </div>
                
                <div className="space-y-0">
                  {selectedPath.map((node, i) => (
                    <ConnectionStep
                      key={node.id}
                      node={node}
                      edge={selectedEdges[i]}
                      index={i}
                      isLast={i === selectedPath.length - 1}
                    />
                  ))}
                </div>
              </div>

              {/* Score Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { key: 'serendipity', label: 'Serendipity', icon: Sparkles, color: '#c9a227' },
                  { key: 'curiosity', label: 'Curiosity', icon: Eye, color: '#8b5cf6' },
                  { key: 'synchronicity', label: 'Synchronicity', icon: Zap, color: '#06b6d4' },
                  { key: 'fortuity', label: 'Fortuity', icon: Flame, color: '#ef4444' },
                  { key: 'materiality', label: 'Materiality', icon: Gem, color: '#10b981' },
                ].map(({ key, label, icon, color }, i) => (
                  <ScoreCard
                    key={key}
                    label={label}
                    value={scores[key as keyof typeof scores]}
                    icon={icon}
                    color={color}
                    delay={0.3 + i * 0.1}
                  />
                ))}
              </div>

              {/* Narrative */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="rounded-2xl p-6 border border-[rgba(164,144,194,0.2)]" 
                style={{ background: THEME.card }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-[#c9a227]" />
                  <h2 className="text-lg font-semibold text-[#e6e6fa]">The Story</h2>
                </div>
                <div className="text-[#a490c2] leading-relaxed whitespace-pre-line text-sm">
                  {narrative}
                </div>
              </motion.div>

              {/* Alternative Paths */}
              {paths.length > 1 && (
                <div className="rounded-2xl p-6 border border-[rgba(164,144,194,0.2)]" style={{ background: THEME.card }}>
                  <h3 className="text-sm font-semibold text-[#a490c2] uppercase tracking-wider mb-4">
                    Alternative Paths ({paths.length - 1})
                  </h3>
                  <div className="space-y-2">
                    {paths.slice(1, 4).map((path, i) => (
                      <button
                        key={i}
                        onClick={() => selectPath(path)}
                        className="w-full text-left rounded-xl p-3 border border-[rgba(164,144,194,0.1)] hover:border-[#8b5cf6] transition-all group"
                        style={{ background: 'rgba(15, 12, 41, 0.5)' }}
                      >
                        <div className="flex items-center gap-2 text-xs text-[#475569] mb-2">
                          <span className="text-[#8b5cf6] font-semibold">Path {i + 2}</span>
                          <span className="text-[#a490c2]">{path.length} steps</span>
                        </div>
                        <div className="flex items-center gap-1 flex-wrap text-sm text-[#a490c2]">
                          {path.map((node, j) => (
                            <span key={node.id} className="flex items-center">
                              <span 
                                className="inline-block w-2 h-2 rounded-full mr-1"
                                style={{ backgroundColor: nodeColorMap[node.type] }}
                              />
                              {node.name}
                              {j < path.length - 1 && <ArrowRight className="w-3 h-3 mx-1 text-[#4a4e8f] group-hover:text-[#c9a227] transition-colors" />}
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
          <ShareModal 
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

function ShareModal({ path, scores, onClose }: { path: Node[]; edges: Edge[]; scores: any; onClose: () => void }) {
  const shareText = `I discovered a connection from ${path[0].name} to ${path[path.length - 1].name} in ${path.length} steps!\n\nSerendipity: ${Math.round(scores.serendipity)}%\nCuriosity: ${Math.round(scores.curiosity)}%\n\nCan you find a better path?`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#0f0c29]/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg rounded-2xl border border-[rgba(164,144,194,0.2)] overflow-hidden"
        style={{ background: THEME.card }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#e6e6fa]">Share Discovery</h3>
            <button onClick={onClose} className="p-2 hover:bg-[rgba(164,144,194,0.1)] rounded-lg transition-colors">
              <X className="w-5 h-5 text-[#a490c2]" />
            </button>
          </div>
          
          {/* Preview card */}
          <div className="rounded-xl p-4 mb-4 border border-[rgba(164,144,194,0.2)]" style={{ background: 'linear-gradient(135deg, #2b1e3e, #4a4e8f)' }}>
            <div className="flex items-center gap-3 mb-3">
              {path[0].imageUrl && <img src={path[0].imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />}
              <ArrowRight className="w-4 h-4 text-[#c9a227]" />
              {path[path.length - 1].imageUrl && <img src={path[path.length - 1].imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />}
            </div>
            <p className="text-sm text-[#e6e6fa] font-medium">{path[0].name} → {path[path.length - 1].name}</p>
            <p className="text-xs text-[#a490c2]">{path.length} steps · Serendipity {Math.round(scores.serendipity)}%</p>
          </div>
          
          <textarea
            readOnly
            value={shareText}
            className="w-full bg-[#0f0c29] border border-[rgba(164,144,194,0.2)] rounded-lg p-3 text-sm text-[#a490c2] resize-none h-24"
          />
          
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => navigator.clipboard?.writeText(shareText)}
              className="flex-1 bg-[#4a4e8f] text-[#e6e6fa] py-2 rounded-lg hover:bg-[#5a5e9f] transition-colors text-sm font-medium"
            >
              Copy Text
            </button>
            <button
              onClick={() => {
                const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
                window.open(url, '_blank');
              }}
              className="flex-1 bg-[#1da1f2] text-white py-2 rounded-lg hover:bg-[#1a91da] transition-colors text-sm font-medium"
            >
              Tweet
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
