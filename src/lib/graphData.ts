export interface Node {
  id: string;
  type: 'invention' | 'discovery' | 'person' | 'material' | 'idea' | 'event' | 'place' | 'institution';
  name: string;
  year: number;
  place?: string;
  summary: string;
  significance: string;
  tags: string[];
  imageUrl?: string;
}

export interface Edge {
  source: string;
  target: string;
  type: string;
  label: string;
  surpriseFactor: number;
  story?: string;
}

const IMAGE_BASE = 'https://upload.wikimedia.org/wikipedia/commons/thumb';

export const nodes: Node[] = [
  { id: "wheel", type: "invention", name: "The Wheel", year: -3500, place: "Mesopotamia", summary: "Circular object rotating on an axle", significance: "Foundation of transportation and machinery", tags: ["transportation", "mechanics"], imageUrl: `${IMAGE_BASE}/a/a1/Wagon_wheel_Châtillon-sur-Seine.jpg/640px-Wagon_wheel_Châtillon-sur-Seine.jpg` },
  { id: "paper", type: "invention", name: "Paper", year: 105, place: "China", summary: "Writing material from plant fibers", significance: "Enabled mass literacy and record-keeping", tags: ["writing", "communication"], imageUrl: `${IMAGE_BASE}/5/57/Paper_Making.jpg/640px-Paper_Making.jpg` },
  { id: "printing_press", type: "invention", name: "Printing Press", year: 1440, place: "Germany", summary: "Movable type mechanical printing", significance: "Democratized knowledge across Europe", tags: ["communication", "knowledge"], imageUrl: `${IMAGE_BASE}//a/a4/Gutenberg_Press.jpg/640px-Gutenberg_Press.jpg` },
  { id: "steam_engine", type: "invention", name: "Steam Engine", year: 1712, place: "England", summary: "Heat engine using steam power", significance: "Powered the Industrial Revolution", tags: ["power", "industrial"], imageUrl: `${IMAGE_BASE}/2/2a/Newcomen_atmospheric_engine.jpg/640px-Newcomen_atmospheric_engine.jpg` },
  { id: "electricity", type: "discovery", name: "Electricity", year: 1752, place: "USA", summary: "Harnessed electrical energy", significance: "Powered the modern world", tags: ["energy", "power"], imageUrl: `${IMAGE_BASE}/8/87/Franklin_Experiments.jpg/640px-Franklin_Experiments.jpg` },
  { id: "telegraph", type: "invention", name: "Electric Telegraph", year: 1837, place: "USA/UK", summary: "Long-distance electrical communication", significance: "First instant global communication", tags: ["communication", "electricity"], imageUrl: `${IMAGE_BASE}/d/d0/Samuel_Morse_telegraph.jpg/640px-Samuel_Morse_telegraph.jpg` },
  { id: "photography", type: "invention", name: "Photography", year: 1839, place: "France", summary: "Capturing light images chemically", significance: "Fixed visual memory permanently", tags: ["visual", "memory"], imageUrl: `${IMAGE_BASE}/9/9a/Daguerreotype_camera.jpg/640px-Daguerreotype_camera.jpg` },
  { id: "telephone", type: "invention", name: "Telephone", year: 1876, place: "USA", summary: "Voice transmission over wires", significance: "Personal communication transcended distance", tags: ["communication", "voice"], imageUrl: `${IMAGE_BASE}/0/0e/Bell_telephone_1876.jpg/640px-Bell_telephone_1876.jpg` },
  { id: "lightbulb", type: "invention", name: "Light Bulb", year: 1879, place: "USA", summary: "Electric incandescent lighting", significance: "Extended human activity beyond daylight", tags: ["light", "electricity"], imageUrl: `${IMAGE_BASE}/3/3a/Edison_light_bulb.jpg/640px-Edison_light_bulb.jpg` },
  { id: "radio", type: "invention", name: "Radio", year: 1895, place: "Italy", summary: "Wireless electromagnetic communication", significance: "First mass broadcast medium", tags: ["communication", "broadcast"], imageUrl: `${IMAGE_BASE}/1/10/Marconi_radio.jpg/640px-Marconi_radio.jpg` },
  { id: "film", type: "invention", name: "Motion Pictures", year: 1895, place: "France", summary: "Recording moving images", significance: "Created visual narrative medium", tags: ["visual", "narrative"], imageUrl: `${IMAGE_BASE}/f/f7/Lumiere_brothers_cinematograph.jpg/640px-Lumiere_brothers_cinematograph.jpg` },
  { id: "airplane", type: "invention", name: "Airplane", year: 1903, place: "USA", summary: "Powered heavier-than-air flight", significance: "Collapsed global travel time", tags: ["transportation", "flight"], imageUrl: `${IMAGE_BASE}/8/86/Wright_Flyer.jpg/640px-Wright_Flyer.jpg` },
  { id: "plastic", type: "invention", name: "Plastic", year: 1907, place: "Belgium", summary: "Synthetic moldable material", significance: "Transformed manufacturing and packaging", tags: ["material", "chemistry"], imageUrl: `${IMAGE_BASE}/7/7e/Bakelite_radio.jpg/640px-Bakelite_radio.jpg` },
  { id: "transistor", type: "invention", name: "Transistor", year: 1947, place: "USA", summary: "Semiconductor signal amplifier", significance: "Enabled all modern electronics", tags: ["electronics", "semiconductor"], imageUrl: `${IMAGE_BASE}/9/9e/First_Transistor_Bell_Labs.jpg/640px-First_Transistor_Bell_Labs.jpg` },
  { id: "computer", type: "invention", name: "Computer", year: 1945, place: "USA/UK", summary: "Electronic data processor", significance: "General-purpose thinking machine", tags: ["computation", "digital"], imageUrl: `${IMAGE_BASE}/4/4e/ENIAC_Penn.jpg/640px-ENIAC_Penn.jpg` },
  { id: "internet", type: "invention", name: "Internet", year: 1989, place: "Switzerland", summary: "Global network of networks", significance: "Connected all knowledge instantly", tags: ["communication", "network"], imageUrl: `${IMAGE_BASE}/3/3f/Internet_map_1024.jpg/640px-Internet_map_1024.jpg` },
  { id: "smartphone", type: "invention", name: "Smartphone", year: 2007, place: "USA", summary: "Pocket computer with connectivity", significance: "Made computing ambient and personal", tags: ["communication", "mobile"], imageUrl: `${IMAGE_BASE}/8/84/IPhone_1st_Gen.svg/320px-IPhone_1st_Gen.svg.png` },
  { id: "ai", type: "invention", name: "Neural Networks", year: 2012, place: "Canada/USA", summary: "Deep learning computation", significance: "Machines that learn patterns", tags: ["computation", "learning"], imageUrl: `${IMAGE_BASE}/0/0c/Neural_network.svg/640px-Neural_network.svg.png` },
  { id: "glass", type: "invention", name: "Glass", year: -50, place: "Levant", summary: "Transparent silicate material", significance: "Enabled lenses, windows, fiber optics", tags: ["material", "light"], imageUrl: `${IMAGE_BASE}/1/1c/Glass_blowing.jpg/640px-Glass_blowing.jpg` },
  { id: "compass", type: "invention", name: "Compass", year: 1100, place: "China", summary: "Magnetic navigation instrument", significance: "Enabled global exploration", tags: ["navigation", "magnetism"], imageUrl: `${IMAGE_BASE}/2/2e/Antique_compass.jpg/640px-Antique_compass.jpg` },
  { id: "clock", type: "invention", name: "Mechanical Clock", year: 1300, place: "Europe", summary: "Precise timekeeping device", significance: "Standardized time and scheduling", tags: ["time", "mechanics"], imageUrl: `${IMAGE_BASE}/5/5c/Salisbury_Cathedral_Clock.jpg/640px-Salisbury_Cathedral_Clock.jpg` },
  { id: "telescope", type: "invention", name: "Telescope", year: 1608, place: "Netherlands", summary: "Distant object viewer", significance: "Revealed the cosmos", tags: ["optics", "astronomy"], imageUrl: `${IMAGE_BASE}/9/9a/Galileo_telescope_replica.jpg/640px-Galileo_telescope_replica.jpg` },
  { id: "microscope", type: "invention", name: "Microscope", year: 1590, place: "Netherlands", summary: "Small object magnifier", significance: "Revealed microbial world", tags: ["optics", "biology"], imageUrl: `${IMAGE_BASE}/6/6e/Antique_microscope.jpg/640px-Antique_microscope.jpg` },
  { id: "penicillin", type: "discovery", name: "Penicillin", year: 1928, place: "UK", summary: "First antibiotic", significance: "Transformed modern medicine", tags: ["medicine", "biology"], imageUrl: `${IMAGE_BASE}/f/f7/Penicillin_mold.jpg/640px-Penicillin_mold.jpg` },
  { id: "vaccination", type: "invention", name: "Vaccination", year: 1796, place: "England", summary: "Disease prevention via inoculation", significance: "Eradicated smallpox", tags: ["medicine", "immunity"], imageUrl: `${IMAGE_BASE}/9/9c/Jenner_vaccination.jpg/640px-Jenner_vaccination.jpg` },
  { id: "laser", type: "invention", name: "Laser", year: 1960, place: "USA", summary: "Coherent light amplification", significance: "Precision tool for multiple fields", tags: ["light", "precision"], imageUrl: `${IMAGE_BASE}/2/2c/Laser_experiment.jpg/640px-Laser_experiment.jpg` },
  { id: "semiconductor", type: "invention", name: "Integrated Circuit", year: 1958, place: "USA", summary: "Multiple transistors on silicon", significance: "Enabled Moore's Law", tags: ["electronics", "silicon"], imageUrl: `${IMAGE_BASE}/3/3b/Integrated_circuit.jpg/640px-Integrated_circuit.jpg` },
  { id: "gps", type: "invention", name: "GPS", year: 1978, place: "USA", summary: "Satellite navigation system", significance: "Universal precise location", tags: ["navigation", "satellite"], imageUrl: `${IMAGE_BASE}/4/4e/GPS_satellite.jpg/640px-GPS_satellite.jpg` },
  { id: "crispr", type: "invention", name: "CRISPR", year: 2012, place: "USA/France", summary: "Gene editing technology", significance: "Precise genetic modification", tags: ["biology", "genetics"], imageUrl: `${IMAGE_BASE}/0/0a/CRISPR_Cas9.jpg/640px-CRISPR_Cas9.jpg` },
  { id: "gunpowder", type: "invention", name: "Gunpowder", year: 850, place: "China", summary: "Explosive chemical mixture", significance: "Transformed warfare and mining", tags: ["explosive", "chemistry"], imageUrl: `${IMAGE_BASE}/1/1a/Gunpowder_formula.jpg/640px-Gunpowder_formula.jpg` },
  { id: "refrigeration", type: "invention", name: "Refrigeration", year: 1851, place: "USA", summary: "Artificial cooling system", significance: "Transformed food supply chains", tags: ["food", "cooling"], imageUrl: `${IMAGE_BASE}/2/2e/Vintage_refrigerator.jpg/640px-Vintage_refrigerator.jpg` },
  { id: "assembly_line", type: "invention", name: "Assembly Line", year: 1913, place: "USA", summary: "Sequential manufacturing", significance: "Mass production of goods", tags: ["manufacturing", "efficiency"], imageUrl: `${IMAGE_BASE}/3/3f/Highland_Park_Ford_plant.jpg/640px-Highland_Park_Ford_plant.jpg` },
  { id: "magnetism", type: "discovery", name: "Electromagnetism", year: 1820, place: "Denmark", summary: "Electricity-magnetism unity", significance: "Unified fundamental forces", tags: ["physics", "energy"], imageUrl: `${IMAGE_BASE}/4/4e/Faraday_electromagnetism.jpg/640px-Faraday_electromagnetism.jpg` },
  { id: "television", type: "invention", name: "Television", year: 1927, place: "USA/UK", summary: "Broadcast moving images", significance: "Visual culture in every home", tags: ["communication", "visual"], imageUrl: `${IMAGE_BASE}/2/2e/Early_television.jpg/640px-Early_television.jpg` }
];

export const edges: Edge[] = [
  // Material lineage
  { source: "glass", target: "telescope", type: "enabled", label: "Glass lenses made telescopes possible", surpriseFactor: 0.3 },
  { source: "glass", target: "microscope", type: "enabled", label: "Glass lenses revealed the microscopic world", surpriseFactor: 0.3 },
  { source: "glass", target: "lightbulb", type: "enabled", label: "Glass enclosure protected the filament", surpriseFactor: 0.4 },
  { source: "plastic", target: "transistor", type: "enabled", label: "Plastic housings protected delicate circuits", surpriseFactor: 0.5 },
  { source: "plastic", target: "smartphone", type: "enabled", label: "Plastic components enabled lightweight phones", surpriseFactor: 0.4 },
  
  // Power and energy
  { source: "electricity", target: "telegraph", type: "enabled", label: "Electric current carried messages across wires", surpriseFactor: 0.2 },
  { source: "electricity", target: "telephone", type: "enabled", label: "Electric signals transmitted voice", surpriseFactor: 0.2 },
  { source: "electricity", target: "lightbulb", type: "enabled", label: "Electricity became visible light", surpriseFactor: 0.2 },
  { source: "electricity", target: "radio", type: "enabled", label: "Electromagnetic waves carried wireless signals", surpriseFactor: 0.3 },
  { source: "electricity", target: "computer", type: "enabled", label: "Electronic circuits processed information", surpriseFactor: 0.2 },
  { source: "magnetism", target: "electricity", type: "inspired", label: "Electromagnetic induction linked the two forces", surpriseFactor: 0.4 },
  { source: "steam_engine", target: "electricity", type: "enabled", label: "Steam turbines generated electrical power", surpriseFactor: 0.3 },
  { source: "electricity", target: "television", type: "enabled", label: "Cathode ray tubes used electrical beams", surpriseFactor: 0.3 },
  { source: "electricity", target: "laser", type: "enabled", label: "Electrical pumping created coherent light", surpriseFactor: 0.5 },
  { source: "electricity", target: "refrigeration", type: "enabled", label: "Electric compressors powered cooling", surpriseFactor: 0.3 },
  { source: "electricity", target: "gps", type: "enabled", label: "Satellite electronics rely on solar power", surpriseFactor: 0.4 },
  
  // Communication evolution
  { source: "paper", target: "printing_press", type: "enabled", label: "Paper was the medium the press needed", surpriseFactor: 0.2 },
  { source: "printing_press", target: "telegraph", type: "preceded", label: "The press proved information could be mass-produced", surpriseFactor: 0.4 },
  { source: "telegraph", target: "telephone", type: "preceded", label: "Wires carried dots and dashes before voices", surpriseFactor: 0.2 },
  { source: "telephone", target: "radio", type: "inspired", label: "Wireless freed voice from physical wires", surpriseFactor: 0.3 },
  { source: "radio", target: "television", type: "enabled", label: "TV added images to radio's broadcast model", surpriseFactor: 0.2 },
  { source: "television", target: "internet", type: "preceded", label: "TV established visual content expectations", surpriseFactor: 0.5 },
  { source: "internet", target: "smartphone", type: "enabled", label: "Mobile internet put the web in pockets", surpriseFactor: 0.2 },
  { source: "compass", target: "telegraph", type: "analogous_to", label: "Both collapsed distance: space and time", surpriseFactor: 0.7 },
  { source: "internet", target: "ai", type: "enabled", label: "Massive data from internet trained neural networks", surpriseFactor: 0.4 },
  
  // Visual and recording
  { source: "photography", target: "film", type: "enabled", label: "Still images learned to move", surpriseFactor: 0.3 },
  { source: "film", target: "television", type: "enabled", label: "TV adopted film's visual language", surpriseFactor: 0.3 },
  { source: "photography", target: "internet", type: "enabled", label: "Digital images flooded the web", surpriseFactor: 0.4 },
  { source: "laser", target: "internet", type: "enabled", label: "Fiber optic lasers carry data globally", surpriseFactor: 0.6 },
  { source: "glass", target: "internet", type: "enabled", label: "Glass fibers became information highways", surpriseFactor: 0.7 },
  { source: "photography", target: "smartphone", type: "enabled", label: "Cameras became universal in phones", surpriseFactor: 0.4 },
  { source: "film", target: "smartphone", type: "preceded", label: "Mobile video replaced film's storytelling", surpriseFactor: 0.5 },
  
  // Computation and intelligence
  { source: "transistor", target: "computer", type: "enabled", label: "Transistors replaced vacuum tubes in computers", surpriseFactor: 0.2 },
  { source: "computer", target: "internet", type: "enabled", label: "Computers needed networks to share data", surpriseFactor: 0.2 },
  { source: "transistor", target: "semiconductor", type: "enabled", label: "Integrated circuits packed transistors densely", surpriseFactor: 0.3 },
  { source: "semiconductor", target: "smartphone", type: "enabled", label: "Silicon chips powered pocket supercomputers", surpriseFactor: 0.3 },
  { source: "semiconductor", target: "gps", type: "enabled", label: "Miniaturized chips enabled satellite navigation", surpriseFactor: 0.4 },
  { source: "computer", target: "ai", type: "enabled", label: "Neural networks run on computational hardware", surpriseFactor: 0.3 },
  { source: "internet", target: "smartphone", type: "enabled", label: "Always-on connectivity defined smartphones", surpriseFactor: 0.2 },
  { source: "semiconductor", target: "crispr", type: "enabled", label: "Computational analysis decodes genetic sequences", surpriseFactor: 0.6 },
  { source: "computer", target: "laser", type: "enabled", label: "Laser design and control requires computation", surpriseFactor: 0.5 },
  
  // Medicine and biology
  { source: "microscope", target: "penicillin", type: "enabled", label: "Microscopes revealed the bacterial world", surpriseFactor: 0.3 },
  { source: "microscope", target: "vaccination", type: "enabled", label: "Understanding germs made vaccination possible", surpriseFactor: 0.3 },
  { source: "vaccination", target: "penicillin", type: "preceded", label: "Both fought invisible enemies in the body", surpriseFactor: 0.5 },
  { source: "penicillin", target: "crispr", type: "preceded", label: "From treating disease to rewriting genetic code", surpriseFactor: 0.6 },
  { source: "microscope", target: "crispr", type: "enabled", label: "Visualizing DNA structures enabled gene editing", surpriseFactor: 0.5 },
  { source: "computer", target: "crispr", type: "enabled", label: "Computational biology models gene interactions", surpriseFactor: 0.5 },
  { source: "refrigeration", target: "penicillin", type: "enabled", label: "Cold storage preserved antibiotics", surpriseFactor: 0.6 },
  { source: "vaccination", target: "crispr", type: "inspired", label: "From preventing disease to preventing genetic disease", surpriseFactor: 0.7 },
  
  // Transportation and navigation
  { source: "wheel", target: "steam_engine", type: "enabled", label: "Steam engines turned wheels for locomotion", surpriseFactor: 0.3 },
  { source: "steam_engine", target: "airplane", type: "enabled", label: "Internal combustion replaced steam for flight", surpriseFactor: 0.4 },
  { source: "compass", target: "airplane", type: "enabled", label: "Navigation instruments guided flight paths", surpriseFactor: 0.3 },
  { source: "compass", target: "gps", type: "preceded", label: "GPS replaced magnetic needles with satellite signals", surpriseFactor: 0.4 },
  { source: "airplane", target: "internet", type: "analogous_to", label: "Both collapsed global distance dramatically", surpriseFactor: 0.6 },
  { source: "airplane", target: "gps", type: "enabled", label: "GPS navigation guides modern aviation", surpriseFactor: 0.3 },
  { source: "wheel", target: "assembly_line", type: "enabled", label: "Conveyor belts are continuous wheels", surpriseFactor: 0.5 },
  { source: "steam_engine", target: "refrigeration", type: "enabled", label: "Steam compression cycles powered early cooling", surpriseFactor: 0.6 },
  
  // Time and precision
  { source: "clock", target: "telegraph", type: "enabled", label: "Standardized time enabled synchronized communication", surpriseFactor: 0.5 },
  { source: "clock", target: "gps", type: "enabled", label: "GPS relies on precise atomic clock timing", surpriseFactor: 0.7 },
  { source: "clock", target: "computer", type: "enabled", label: "Clock cycles drive processor computation", surpriseFactor: 0.5 },
  { source: "telescope", target: "clock", type: "analogous_to", label: "Both extended human perception beyond limits", surpriseFactor: 0.6 },
  { source: "telescope", target: "gps", type: "enabled", label: "Satellite orbits calculated via celestial mechanics", surpriseFactor: 0.6 },
  { source: "telescope", target: "internet", type: "analogous_to", label: "Both expanded humanity's reach beyond physical limits", surpriseFactor: 0.7 },
  
  // Serendipity and surprise
  { source: "gunpowder", target: "steam_engine", type: "inspired", label: "Controlled explosions became controlled expansion", surpriseFactor: 0.6 },
  { source: "gunpowder", target: "laser", type: "analogous_to", label: "Both harness controlled energy release", surpriseFactor: 0.7 },
  { source: "penicillin", target: "internet", type: "unintended", label: "Mold and networks: both organic growth patterns", surpriseFactor: 0.8 },
  { source: "vaccination", target: "ai", type: "unintended", label: "Immune system learning inspired machine learning", surpriseFactor: 0.8 },
  { source: "wheel", target: "internet", type: "analogous_to", label: "Both became infrastructure everything else runs on", surpriseFactor: 0.7 },
  { source: "paper", target: "smartphone", type: "analogous_to", label: "From portable pages to portable screens", surpriseFactor: 0.5 },
  { source: "printing_press", target: "internet", type: "analogous_to", label: "Both democratized information at scale", surpriseFactor: 0.6 },
  { source: "compass", target: "ai", type: "analogous_to", label: "Both help navigate vast unknown spaces", surpriseFactor: 0.8 },
  { source: "glass", target: "ai", type: "analogous_to", label: "From physical lens to algorithmic lens", surpriseFactor: 0.8 },
  { source: "refrigeration", target: "internet", type: "analogous_to", label: "Both created storage systems for perishable goods", surpriseFactor: 0.7 },
  { source: "telescope", target: "microscope", type: "analogous_to", label: "Two lenses revealing invisible worlds", surpriseFactor: 0.6 },
  { source: "radio", target: "internet", type: "preceded", label: "Broadcast model evolved to peer-to-peer network", surpriseFactor: 0.5 },
  { source: "laser", target: "crispr", type: "analogous_to", label: "Both manipulate matter with precise beams", surpriseFactor: 0.8 },
  { source: "photography", target: "ai", type: "enabled", label: "Massive image datasets trained visual AI", surpriseFactor: 0.6 },
  { source: "film", target: "ai", type: "enabled", label: "Video content trained generative models", surpriseFactor: 0.6 },
  { source: "television", target: "smartphone", type: "preceded", label: "Small screen replaced big screen for attention", surpriseFactor: 0.5 },
  { source: "assembly_line", target: "computer", type: "analogous_to", label: "Both automated repetitive human tasks", surpriseFactor: 0.6 },
  { source: "assembly_line", target: "internet", type: "enabled", label: "Supply chains became digitally coordinated", surpriseFactor: 0.5 },
  { source: "refrigeration", target: "vaccination", type: "enabled", label: "Cold chain preserves vaccines globally", surpriseFactor: 0.5 },
  { source: "transistor", target: "laser", type: "enabled", label: "Semiconductor lasers power fiber optics", surpriseFactor: 0.6 },
  { source: "wheel", target: "computer", type: "analogous_to", label: "Both rotate to move forward: physical and logical", surpriseFactor: 0.7 },
  { source: "magnetism", target: "compass", type: "enabled", label: "Magnetic fields guide navigation", surpriseFactor: 0.2 },
  { source: "magnetism", target: "transistor", type: "enabled", label: "Magnetic storage preceded solid-state memory", surpriseFactor: 0.5 },
  { source: "gunpowder", target: "refrigeration", type: "unintended", label: "Explosive cooling: refrigeration used compressed gases", surpriseFactor: 0.7 },
  { source: "steam_engine", target: "transistor", type: "analogous_to", label: "Both convert energy across domains", surpriseFactor: 0.7 }
];

export const nodeColorMap: Record<string, string> = {
  invention: '#06b6d4',
  discovery: '#8b5cf6',
  person: '#f59e0b',
  material: '#10b981',
  idea: '#eab308',
  event: '#ef4444',
  place: '#f97316',
  institution: '#94a3b8'
};

export function getNodeById(id: string): Node | undefined {
  return nodes.find(n => n.id === id);
}

export function getEdgesForNode(nodeId: string): Edge[] {
  return edges.filter(e => e.source === nodeId || e.target === nodeId);
}

export function getAdjacentNodes(nodeId: string): { node: Node; edge: Edge; direction: 'forward' | 'backward' }[] {
  const results: { node: Node; edge: Edge; direction: 'forward' | 'backward' }[] = [];
  const node = getNodeById(nodeId);
  if (!node) return results;

  for (const edge of edges) {
    if (edge.source === nodeId) {
      const target = getNodeById(edge.target);
      if (target) {
        results.push({ node: target, edge, direction: 'forward' });
      }
    } else if (edge.target === nodeId) {
      const source = getNodeById(edge.source);
      if (source) {
        results.push({ node: source, edge, direction: 'backward' });
      }
    }
  }
  return results;
}

export function findPaths(startId: string, endId: string, minSteps: number = 5, maxSteps: number = 10): Node[][] {
  const paths: Node[][] = [];
  const visited = new Set<string>();
  
  function dfs(currentId: string, path: Node[], depth: number) {
    if (depth > maxSteps) return;
    
    if (currentId === endId && depth >= minSteps) {
      paths.push([...path]);
      return;
    }
    
    visited.add(currentId);
    const adjacents = getAdjacentNodes(currentId);
    
    adjacents.sort((a, b) => b.edge.surpriseFactor - a.edge.surpriseFactor);
    
    for (const { node } of adjacents) {
      if (!visited.has(node.id)) {
        path.push(node);
        dfs(node.id, path, depth + 1);
        path.pop();
      }
    }
    
    visited.delete(currentId);
  }
  
  const startNode = getNodeById(startId);
  if (startNode) {
    dfs(startId, [startNode], 1);
  }
  
  paths.sort((a, b) => {
    const aSurprise = calculatePathSurprise(a);
    const bSurprise = calculatePathSurprise(b);
    return bSurprise - aSurprise;
  });
  
  return paths.slice(0, 5);
}

function calculatePathSurprise(path: Node[]): number {
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const edge = edges.find(e => 
      (e.source === path[i].id && e.target === path[i + 1].id) ||
      (e.source === path[i + 1].id && e.target === path[i].id)
    );
    if (edge) total += edge.surpriseFactor;
  }
  return total / (path.length - 1);
}

export function getEdgesForPath(path: Node[]): Edge[] {
  const result: Edge[] = [];
  for (let i = 0; i < path.length - 1; i++) {
    const edge = edges.find(e => 
      (e.source === path[i].id && e.target === path[i + 1].id) ||
      (e.source === path[i + 1].id && e.target === path[i].id)
    );
    if (edge) result.push(edge);
  }
  return result;
}

export function generateNarrative(path: Node[], edges: Edge[]): string {
  const parts: string[] = [];
  parts.push(`The path from ${path[0].name} to ${path[path.length - 1].name} unfolds across ${path.length} moments of human ingenuity.`);
  parts.push('');
  
  for (let i = 0; i < path.length - 1; i++) {
    const node = path[i];
    const nextNode = path[i + 1];
    const edge = edges[i];
    
    if (edge.surpriseFactor > 0.6) {
      parts.push(`**${i + 1}.** ${node.name} → ${nextNode.name}`);
      parts.push(`*${edge.label}*`);
      parts.push(`A surprising thread: ${edge.story || 'The connection defies obvious categorization, revealing hidden patterns in human innovation.'}`);
    } else {
      parts.push(`**${i + 1}.** ${node.name} → ${nextNode.name}`);
      parts.push(`${edge.label}`);
    }
    parts.push('');
  }
  
  parts.push(`Across ${path.length - 1} connections, the chain reveals how ${path[0].name.toLowerCase()} and ${path[path.length - 1].name.toLowerCase()} share an invisible lineage of human creativity.`);
  
  return parts.join('\n');
}

export function generateSerendipityScore(path: Node[], edges: Edge[]): {
  serendipity: number;
  curiosity: number;
  synchronicity: number;
  fortuity: number;
  materiality: number;
} {
  const scores = {
    serendipity: 0,
    curiosity: 0,
    synchronicity: 0,
    fortuity: 0,
    materiality: 0
  };
  
  edges.forEach(edge => {
    if (edge.type === 'unintended') scores.fortuity += edge.surpriseFactor;
    if (edge.type === 'analogous_to') scores.synchronicity += edge.surpriseFactor;
    if (edge.surpriseFactor > 0.6) scores.serendipity += edge.surpriseFactor;
    if (edge.type === 'enabled' && edge.surpriseFactor > 0.5) scores.curiosity += edge.surpriseFactor;
  });
  
  const materialNodes = path.filter(n => n.type === 'material' || n.tags.includes('material'));
  scores.materiality = materialNodes.length / path.length;
  
  const max = Math.max(...Object.values(scores));
  if (max > 0) {
    Object.keys(scores).forEach(key => {
      scores[key as keyof typeof scores] = Math.min(1, scores[key as keyof typeof scores] / max);
    });
  }
  
  return scores;
}
