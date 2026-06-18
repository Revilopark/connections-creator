import { useState, useCallback, useEffect } from 'react';
import { nodes, findPaths, getEdgesForPath, generateNarrative, generateSerendipityScore, Node, Edge } from './lib/graphData';
import { api } from './lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, ArrowRight, X, Search, Compass } from 'lucide-react';

const C = {
  bg: '#f5f5f0',
  card: '#ffffff',
  border: '#e0e0db',
  borderHover: '#c0c0bb',
  text: '#2a2a2a',
  textDim: '#5a5a5a',
  textMuted: '#888888',
  accent: '#4a4a4a',
  accentHover: '#333333',
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
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: C.bg, color: C.text, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8 sm:py-12">
        <header className="mb-10 border-b pb-6" style={{ borderColor: C.border }}>
          <h1 className="text-3xl font-bold tracking-tight uppercase" style={{ color: C.text }}>Connections</h1>
          <p className="mt-1 text-sm" style={{ color: C.textMuted }}>Trace the hidden threads between human inventions</p>
        </header>

        <div className="mb-8 p-5 border" style={{ background: C.card, borderColor: C.border }}>
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => setPickerMode('from')} className="flex-1 flex items-center gap-3 p-3 border transition-colors hover:bg-[#fafafa]" style={{ borderColor: C.border, background: startId ? '#f0f0ec' : '#fff' }}>
              {startId && getNode(startId)?.imageUrl ? <img src={getNode(startId)?.imageUrl} alt="" className="w-10 h-10 object-cover border" style={{ borderColor: C.border }} /> : <div className="w-10 h-10 border flex items-center justify-center" style={{ borderColor: C.border }}><Compass className="w-5 h-5" style={{ color: C.textMuted }} /></div>}
              <div className="text-left">
                <div className="text-[10px] uppercase tracking-wider font-bold" style={{ color: C.textMuted }}>From</div>
                <div className="text-sm font-semibold" style={{ color: C.text }}>{startId ? getNode(startId)?.name : 'Select invention'}</div>
              </div>
            </button>
            <ArrowRight className="w-5 h-5 flex-shrink-0" style={{ color: C.textMuted }} />
            <button onClick={() => setPickerMode('to')} className="flex-1 flex items-center gap-3 p-3 border transition-colors hover:bg-[#fafafa]" style={{ borderColor: C.border, background: endId ? '#f0f0ec' : '#fff' }}>
              {endId && getNode(endId)?.imageUrl ? <img src={getNode(endId)?.imageUrl} alt="" className="w-10 h-10 object-cover border" style={{ borderColor: C.border }} /> : <div className="w-10 h-10 border flex items-center justify-center" style={{ borderColor: C.border }}><Compass className="w-5 h-5" style={{ color: C.textMuted }} /></div>}
              <div className="text-left">
                <div className="text-[10px] uppercase tracking-wider font-bold" style={{ color: C.textMuted }}>To</div>
                <div className="text-sm font-semibold" style={{ color: C.text }}>{endId ? getNode(endId)?.name : 'Select invention'}</div>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-6 mb-4">
            {[{ label: 'Min', val: minSteps, set: setMinSteps, min: 3, max: 8 }, { label: 'Max', val: maxSteps, set: setMaxSteps, min: 5, max: 15 }].map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase" style={{ color: C.textMuted }}>{s.label}</span>
                <input type="range" min={s.min} max={s.max} value={s.val} onChange={e => s.set(Number(e.target.value))} className="w-24 accent-[#4a4a4a]" />
                <span className="text-xs font-bold tabular-nums w-4" style={{ color: C.accent }}>{s.val}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={handleSearch} disabled={!startId || !endId || isSearching} className="flex items-center gap-2 font-bold py-2.5 px-6 border transition-colors disabled:opacity-40 hover:bg-[#2a2a2a] hover:text-white" style={{ background: C.accent, color: '#fff', borderColor: C.accent }}>
              <Search className="w-4 h-4" />{isSearching ? 'Finding...' : 'Connect'}
            </button>
            <button onClick={handleRandom} disabled={isSearching} className="flex items-center gap-2 py-2.5 px-5 border transition-colors hover:bg-[#f0f0ec]" style={{ borderColor: C.border, color: C.text }}>
              <Shuffle className="w-4 h-4" />Random
            </button>
          </div>
        </div>

        <AnimatePresence>
          {pickerMode && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(245, 245, 240, 0.95)' }} onClick={() => setPickerMode(null)}>
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-3xl max-h-[75vh] border overflow-hidden flex flex-col" style={{ background: C.card, borderColor: C.border }} onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: C.border }}>
                  <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: C.text }}>Select {pickerMode === 'from' ? 'Start' : 'Destination'}</h2>
                  <button onClick={() => setPickerMode(null)} className="p-2 transition-colors hover:bg-[#f0f0ec]"><X className="w-5 h-5" style={{ color: C.textMuted }} /></button>
                </div>
                <div className="overflow-y-auto p-4">
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {inventions.map(node => (
                      <motion.div key={node.id} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => { if (pickerMode === 'from') setStartId(node.id); else setEndId(node.id); setPickerMode(null); }} className="cursor-pointer border overflow-hidden transition-colors hover:bg-[#fafafa]" style={{ background: (pickerMode === 'from' ? startId === node.id : endId === node.id) ? '#f0f0ec' : '#fff', borderColor: (pickerMode === 'from' ? startId === node.id : endId === node.id) ? C.accent : C.border }}>
                        <div className="aspect-square relative">
                          {node.imageUrl ? <img src={node.imageUrl} alt={node.name} className="w-full h-full object-cover" loading="lazy" /> : <div className="w-full h-full bg-[#e8e8e3] flex items-center justify-center"><Compass className="w-8 h-8" style={{ color: C.textMuted }} /></div>}
                        </div>
                        <div className="p-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold truncate" style={{ color: C.text }}>{node.name}</h3>
                            <span className="text-[10px] font-bold tabular-nums" style={{ color: C.textMuted }}>{node.year > 0 ? node.year : `${Math.abs(node.year)} BC`}</span>
                          </div>
                        </div>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-12 text-center">
              <div className="inline-flex items-center gap-2">
                {[0, 0.15, 0.3].map(d => <motion.div key={d} className="w-2 h-2 bg-[#4a4a4a]" animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.2, repeat: Infinity, delay: d }} />)}
              </div>
              <p className="mt-3 text-sm font-bold uppercase tracking-wider" style={{ color: C.textMuted }}>Discovering paths</p>
            </motion.div>
          )}

          {selectedPath && !isSearching && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
              <div className="p-5 border" style={{ background: C.card, borderColor: C.border }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold uppercase tracking-tight" style={{ color: C.text }}>{selectedPath[0].name} <span style={{ color: C.textMuted }}>→</span> {selectedPath[selectedPath.length - 1].name}</h2>
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: C.textMuted }}>{selectedPath.length} inventions · {selectedEdges.length} connections</span>
                </div>
                <div className="space-y-0">
                  {selectedPath.map((node, i) => (
                    <motion.div key={node.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-start gap-4">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="w-12 h-12 border overflow-hidden flex items-center justify-center" style={{ borderColor: C.border }}>
                          {node.imageUrl ? <img src={node.imageUrl} alt={node.name} className="w-full h-full object-cover" /> : <span className="text-xs font-bold" style={{ color: C.textMuted }}>{i + 1}</span>}
                        </div>
                        {i < selectedPath.length - 1 && <div className="w-px h-8 mt-1" style={{ background: C.border }} />}
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold" style={{ color: C.text }}>{node.name}</h4>
                          <span className="text-[10px] font-bold tabular-nums" style={{ color: C.textMuted }}>{node.year > 0 ? node.year : `${Math.abs(node.year)} BC`}</span>
                        </div>
                        {selectedEdges[i] && <p className="text-xs mt-1 italic" style={{ color: C.textDim }}>{selectedEdges[i].label}{selectedEdges[i].surpriseFactor > 0.6 && <span className="ml-2 text-[10px] font-bold" style={{ color: C.accent }}>✦ {Math.round(selectedEdges[i].surpriseFactor * 100)}</span>}</p>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="p-5 border" style={{ background: C.card, borderColor: C.border }}>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: C.accent }}>Serendipity Scores</h3>
                <div className="grid grid-cols-5 gap-4">
                  {[
                    { label: 'Serendipity', value: scores.serendipity },
                    { label: 'Curiosity', value: scores.curiosity },
                    { label: 'Sync', value: scores.synchronicity },
                    { label: 'Fortuity', value: scores.fortuity },
                    { label: 'Material', value: scores.materiality },
                  ].map(s => (
                    <div key={s.label} className="text-center">
                      <div className="text-2xl font-bold tabular-nums" style={{ color: C.accent }}>{Math.round(s.value)}</div>
                      <div className="text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: C.textMuted }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="p-5 border" style={{ background: C.card, borderColor: C.border }}>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: C.accent }}>The Story</h3>
                <p className="text-sm leading-relaxed" style={{ color: C.textDim }}>{narrative}</p>
              </motion.div>

              {paths.length > 1 && (
                <div className="p-5 border" style={{ background: C.card, borderColor: C.border }}>
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: C.textMuted }}>Other Paths ({paths.length - 1})</h3>
                  <div className="space-y-2">
                    {paths.slice(1, 4).map((path, i) => (
                      <button key={i} onClick={() => selectPath(path)} className="w-full text-left p-3 border transition-colors hover:bg-[#fafafa]" style={{ borderColor: C.border }}>
                        <div className="flex items-center gap-1 flex-wrap text-xs" style={{ color: C.textDim }}>
                          {path.map((n, j) => <span key={n.id} className="flex items-center">{n.name}{j < path.length - 1 && <ArrowRight className="w-3 h-3 mx-1" style={{ color: C.textMuted }} />}</span>)}
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
