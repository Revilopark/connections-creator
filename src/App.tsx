import { useState, useCallback, useEffect } from 'react';
import { nodes, findPaths, getEdgesForPath, generateNarrative, generateSerendipityScore, Node, Edge } from './lib/graphData';
import { api } from './lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Shuffle, ArrowRight, X, Zap, Eye, Flame, Gem, Compass, Search } from 'lucide-react';

const C = {
  bg: '#0a0818', bgCard: 'rgba(20, 18, 40, 0.7)',
  border: 'rgba(139, 110, 220, 0.15)', borderHover: 'rgba(139, 110, 220, 0.4)',
  text: '#f0e6ff', textDim: '#a090c0', textMuted: '#6b5b8a',
  gold: '#e8c547', goldDim: 'rgba(232, 197, 71, 0.15)',
  violet: '#a855f7', cyan: '#22d3ee', emerald: '#34d399', red: '#f87171',
};

export default function App() {
  const [startId, setStartId] = useState('');
  const [endId, setEndId] = useState('');
  const [paths, setPaths] = useState<Node[][]>([]);
  const [selectedPath, setSelectedPath] = useState<Node[] | null>(null);
  const [selectedEdges, setSelectedEdges] = useState<Edge[]>([]);
  const [narrative, setNarrative] = useState('');
  const [scores, setScores] = useState({ serendipity: 0, curiosity: 0, synchronicity: 0, fortuity: 0, materiality: 0 });
  const [isSearching, setIsSearching] = useState(false);
  const [minSteps, setMinSteps] = useState(5);
  const [maxSteps, setMaxSteps] = useState(10);
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  const [pickerMode, setPickerMode] = useState<'from' | 'to' | null>(null);

  useEffect(() => { api.checkAvailability().then(setApiAvailable); }, []);

  const inventions = nodes.filter(n => n.type === 'invention' || n.type === 'discovery');
  const getNode = (id: string) => nodes.find(n => n.id === id);

  const selectPath = useCallback((path: Node[], edges?: Edge[], apiScores?: any) => {
    setSelectedPath(path);
    const e = edges || getEdgesForPath(path);
    setSelectedEdges(e);
    setNarrative(generateNarrative(path, e));
    if (apiScores) {
      setScores({ serendipity: apiScores.serendipity, curiosity: apiScores.curiosity, synchronicity: apiScores.synchronicity, fortuity: apiScores.fortuity, materiality: apiScores.materiality });
    } else {
      setScores(generateSerendipityScore(path, e));
    }
  }, []);

  const handleSearch = useCallback(async () => {
    if (!startId || !endId) return;
    setIsSearching(true); setPaths([]); setSelectedPath(null); setNarrative('');
    if (apiAvailable) {
      try {
        const res = await api.findPaths(startId, endId, minSteps, maxSteps);
        const p = res.paths.map((r: any) => r.nodes);
        setPaths(p); if (p.length) selectPath(p[0], res.paths[0].edges, res.paths[0].scores);
      } catch { const f = findPaths(startId, endId, minSteps, maxSteps); setPaths(f); if (f.length) selectPath(f[0]); }
    } else {
      setTimeout(() => { const f = findPaths(startId, endId, minSteps, maxSteps); setPaths(f); if (f.length) selectPath(f[0]); setIsSearching(false); }, 800); return;
    }
    setIsSearching(false);
  }, [startId, endId, minSteps, maxSteps, apiAvailable, selectPath]);

  const handleRandom = useCallback(() => {
    const i1 = Math.floor(Math.random() * inventions.length);
    let i2 = Math.floor(Math.random() * inventions.length);
    while (i1 === i2) i2 = Math.floor(Math.random() * inventions.length);
    setStartId(inventions[i1].id); setEndId(inventions[i2].id);
    setTimeout(() => { setIsSearching(true); setPaths([]); setSelectedPath(null); setNarrative('');
      setTimeout(() => { const f = findPaths(inventions[i1].id, inventions[i2].id, minSteps, maxSteps); setPaths(f); if (f.length) selectPath(f[0]); setIsSearching(false); }, 600);
    }, 100);
  }, [minSteps, maxSteps, selectPath]);

  return (
    <div className="min-h-screen text-[#f0e6ff] relative overflow-x-hidden" style={{ background: `linear-gradient(180deg, ${C.bg} 0%, #0d0b20 50%, ${C.bg} 100%)` }}>
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-6 sm:py-10">
        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sparkles className="w-6 h-6 text-[#e8c547]" />
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#f0e6ff]">Connections</h1>
            <Sparkles className="w-6 h-6 text-[#e8c547]" />
          </div>
          <p className="text-[#6b5b8a] text-sm max-w-md mx-auto">Trace the hidden threads between human inventions</p>
        </motion.header>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl p-4 sm:p-6 mb-6 border backdrop-blur-md" style={{ background: C.bgCard, borderColor: C.border }}>
          <div className="flex items-center justify-center gap-3 mb-5">
            <button onClick={() => setPickerMode('from')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${startId ? 'border-[#e8c547]/50 bg-[#e8c547]/5' : 'border-[rgba(139,110,220,0.2)] hover:border-[rgba(139,110,220,0.4)]'}`}>
              {startId && getNode(startId)?.imageUrl ? <img src={getNode(startId)?.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-[#1a1530] flex items-center justify-center"><Compass className="w-5 h-5 text-[#6b5b8a]" /></div>}
              <div className="text-left"><div className="text-[10px] text-[#6b5b8a] uppercase tracking-wider">From</div><div className="text-sm font-semibold text-[#f0e6ff]">{startId ? getNode(startId)?.name : 'Pick...'}</div></div>
            </button>
            <ArrowRight className="w-5 h-5 text-[#6b5b8a]" />
            <button onClick={() => setPickerMode('to')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${endId ? 'border-[#e8c547]/50 bg-[#e8c547]/5' : 'border-[rgba(139,110,220,0.2)] hover:border-[rgba(139,110,220,0.4)]'}`}>
              {endId && getNode(endId)?.imageUrl ? <img src={getNode(endId)?.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-[#1a1530] flex items-center justify-center"><Compass className="w-5 h-5 text-[#6b5b8a]" /></div>}
              <div className="text-left"><div className="text-[10px] text-[#6b5b8a] uppercase tracking-wider">To</div><div className="text-sm font-semibold text-[#f0e6ff]">{endId ? getNode(endId)?.name : 'Pick...'}</div></div>
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 mb-5">
            {[{ label: 'Min', val: minSteps, set: setMinSteps, min: 3, max: 8 }, { label: 'Max', val: maxSteps, set: setMaxSteps, min: 5, max: 15 }].map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="text-[11px] text-[#6b5b8a]">{s.label}</span>
                <input type="range" min={s.min} max={s.max} value={s.val} onChange={e => s.set(Number(e.target.value))} className="w-20 accent-[#e8c547]" />
                <span className="text-xs text-[#e8c547] font-bold w-4">{s.val}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center">
            <button onClick={handleSearch} disabled={!startId || !endId || isSearching}
              className="flex items-center gap-2 bg-gradient-to-r from-[#e8c547] to-[#d4a93a] text-[#0a0818] font-bold py-2.5 px-6 rounded-xl disabled:opacity-40 transition-all hover:shadow-lg hover:shadow-[#e8c547]/20">
              <Search className="w-4 h-4" />{isSearching ? 'Finding...' : 'Connect'}
            </button>
            <button onClick={handleRandom} disabled={isSearching}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[rgba(139,110,220,0.2)] text-[#f0e6ff] hover:border-[rgba(139,110,220,0.5)] hover:bg-[rgba(139,110,220,0.05)] transition-all">
              <Shuffle className="w-4 h-4" />Random
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {pickerMode && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#0a0818]/95 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setPickerMode(null)}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-3xl max-h-[75vh] rounded-2xl border overflow-hidden flex flex-col" style={{ background: C.bgCard, borderColor: C.border }} onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: C.border }}>
                  <h2 className="text-lg font-bold text-[#f0e6ff]">Select {pickerMode === 'from' ? 'Start' : 'Destination'}</h2>
                  <button onClick={() => setPickerMode(null)} className="p-2 hover:bg-[rgba(139,110,220,0.1)] rounded-lg transition-colors"><X className="w-5 h-5 text-[#6b5b8a]" /></button>
                </div>
                <div className="overflow-y-auto p-4">
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {inventions.map(node => (
                      <motion.div key={node.id} whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        onClick={() => { if (pickerMode === 'from') setStartId(node.id); else setEndId(node.id); setPickerMode(null); }}
                        className={`relative cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300 flex-shrink-0 ${pickerMode === 'from' ? (startId === node.id ? 'border-[#e8c547]' : 'border-[rgba(139,110,220,0.15)]') : (endId === node.id ? 'border-[#e8c547]' : 'border-[rgba(139,110,220,0.15)]')} hover:border-[rgba(139,110,220,0.4)]`}
                        style={{ background: C.bgCard }}>
                        <div className="aspect-square relative overflow-hidden">
                          {node.imageUrl ? <img src={node.imageUrl} alt={node.name} className="w-full h-full object-cover" loading="lazy" /> : <div className="w-full h-full bg-gradient-to-br from-[#1a1530] to-[#2a2050] flex items-center justify-center"><Sparkles className="w-8 h-8 text-[#6b5b8a]" /></div>}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0818] via-transparent to-transparent" />
                          <div className="absolute top-2 left-2"><span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0a0818]/80 text-[#e8c547] font-bold border border-[#e8c547]/30">{node.year > 0 ? node.year : `${Math.abs(node.year)} BC`}</span></div>
                        </div>
                        <div className="p-3"><h3 className="text-sm font-bold text-[#f0e6ff] truncate">{node.name}</h3><p className="text-[11px] text-[#6b5b8a] mt-0.5 truncate">{node.place}</p></div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isSearching && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
              <div className="inline-flex items-center gap-2">
                {[0, 0.15, 0.3].map(d => <motion.div key={d} className="w-3 h-3 bg-[#e8c547] rounded-full" animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity, delay: d }} />)}
              </div>
              <p className="mt-3 text-sm text-[#6b5b8a]">Discovering paths...</p>
            </motion.div>
          )}

          {selectedPath && !isSearching && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
              <div className="rounded-2xl p-5 border flex justify-around flex-wrap gap-4" style={{ background: C.bgCard, borderColor: C.border }}>
                {[{ label: 'Serendipity', k: 'serendipity', icon: Sparkles, color: C.gold }, { label: 'Curiosity', k: 'curiosity', icon: Eye, color: C.violet }, { label: 'Sync', k: 'synchronicity', icon: Zap, color: C.cyan }, { label: 'Fortuity', k: 'fortuity', icon: Flame, color: C.red }, { label: 'Material', k: 'materiality', icon: Gem, color: C.emerald }].map((s, i) => {
                  const r = 28, circ = 2 * Math.PI * r, pct = scores[s.k as keyof typeof scores] / 100;
                  return <motion.div key={s.k} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.08 }} className="flex flex-col items-center gap-2">
                    <div className="relative w-20 h-20">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
                        <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(139,110,220,0.1)" strokeWidth="5" />
                        <motion.circle cx="36" cy="36" r={r} fill="none" stroke={s.color} strokeWidth="5" strokeLinecap="round"
                          strokeDasharray={circ} initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ * (1 - pct) }}
                          transition={{ duration: 1.2, delay: 0.3 + i * 0.08 + 0.3, ease: 'easeOut' }} />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center"><s.icon className="w-5 h-5" style={{ color: s.color }} /></div>
                    </div>
                    <div className="text-center"><div className="text-lg font-bold" style={{ color: s.color }}>{Math.round(scores[s.k as keyof typeof scores])}%</div><div className="text-[10px] text-[#6b5b8a] uppercase tracking-wider">{s.label}</div></div>
                  </motion.div>;
                })}
              </div>

              <div className="rounded-2xl p-5 sm:p-6 border" style={{ background: C.bgCard, borderColor: C.border }}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-bold text-[#f0e6ff]">{selectedPath[0].name} <span className="text-[#6b5b8a]">→</span> {selectedPath[selectedPath.length - 1].name}</h2>
                    <p className="text-xs text-[#6b5b8a]">{selectedPath.length} inventions · {selectedEdges.length} connections</p>
                  </div>
                </div>
                <div className="space-y-0">
                  {selectedPath.map((node, i) => (
                    <motion.div key={node.id} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }} className="flex items-start gap-4">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-[rgba(139,110,220,0.3)]">
                          {node.imageUrl ? <img src={node.imageUrl} alt={node.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[#1a1530] flex items-center justify-center text-[#6b5b8a] text-xs font-bold">{i + 1}</div>}
                        </div>
                        {i < selectedPath.length - 1 && <div className="w-0.5 h-10 bg-gradient-to-b from-[rgba(139,110,220,0.3)] to-[rgba(139,110,220,0.05)] mt-1" />}
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex items-center gap-2"><h4 className="text-base font-bold text-[#f0e6ff]">{node.name}</h4><span className="text-[10px] text-[#6b5b8a]">{node.year > 0 ? node.year : `${Math.abs(node.year)} BC`}</span></div>
                        {selectedEdges[i] && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.12 + 0.2 }} className="text-sm text-[#a090c0] mt-1 italic leading-relaxed">{selectedEdges[i].label}{selectedEdges[i].surpriseFactor > 0.6 && <span className="ml-2 text-xs text-[#e8c547] font-medium">✨ {Math.round(selectedEdges[i].surpriseFactor * 100)}</span>}</motion.p>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="rounded-2xl p-5 border" style={{ background: C.bgCard, borderColor: C.border }}>
                <h3 className="text-sm font-bold text-[#e8c547] mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4" /> The Story</h3>
                <p className="text-sm text-[#a090c0] leading-relaxed whitespace-pre-line">{narrative}</p>
              </motion.div>

              {paths.length > 1 && (
                <div className="rounded-2xl p-5 border" style={{ background: C.bgCard, borderColor: C.border }}>
                  <h3 className="text-xs font-bold text-[#6b5b8a] uppercase tracking-wider mb-3">Other Paths ({paths.length - 1})</h3>
                  <div className="space-y-2">
                    {paths.slice(1, 4).map((path, i) => (
                      <button key={i} onClick={() => selectPath(path)} className="w-full text-left rounded-xl p-3 border border-[rgba(139,110,220,0.1)] hover:border-[#8b5cf6]/50 transition-all" style={{ background: 'rgba(10, 8, 24, 0.5)' }}>
                        <div className="flex items-center gap-1 flex-wrap text-xs text-[#a090c0]">
                          {path.map((n, j) => <span key={n.id} className="flex items-center">{n.name}{j < path.length - 1 && <ArrowRight className="w-3 h-3 mx-1 text-[#4a4e8f]" />}</span>)}
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
    </div>
  );
}
