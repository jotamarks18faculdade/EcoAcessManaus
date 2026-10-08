import { GraphNode, GraphEdge, RoutePath } from '../types';

/**
 * Urban network vertices representing key points and intersections in Manaus
 * Normalized x,y coordinates (0 to 1000) for spatial map and A* heuristic calculation
 */
export const MANAUS_GRAPH_NODES: Record<string, GraphNode> = {
  centro: { id: 'centro', name: 'Centro Histórico (Teatro / Adolpho Lisboa)', x: 420, y: 780, neighborhood: 'Centro' },
  praca14: { id: 'praca14', name: 'Praça 14 / Cachoeirinha', x: 490, y: 740, neighborhood: 'Praça 14 de Janeiro' },
  bilhares: { id: 'bilhares', name: 'Parque dos Bilhares (São Geraldo)', x: 410, y: 620, neighborhood: 'São Geraldo' },
  adrianopolis: { id: 'adrianopolis', name: 'Adrianópolis / Mário Ypiranga', x: 500, y: 610, neighborhood: 'Adrianópolis' },
  parque10: { id: 'parque10', name: 'Parque 10 de Novembro (CSU)', x: 520, y: 530, neighborhood: 'Parque 10' },
  flores: { id: 'flores', name: 'Flores / Torquato Tapajós', x: 440, y: 490, neighborhood: 'Flores' },
  redencao: { id: 'redencao', name: 'Redenção / Alvorada (Des. João Machado)', x: 330, y: 550, neighborhood: 'Redenção' },
  pontanegra: { id: 'pontanegra', name: 'Ponta Negra (Av. Coronel Teixeira)', x: 190, y: 510, neighborhood: 'Ponta Negra' },
  taruma: { id: 'taruma', name: 'Tarumã (Av. do Turismo)', x: 210, y: 350, neighborhood: 'Tarumã' },
  cidadenova: { id: 'cidadenova', name: 'Cidade Nova (Parque Estadual Sumaúma)', x: 510, y: 340, neighborhood: 'Cidade Nova' },
  aleixo: { id: 'aleixo', name: 'Aleixo / Ephigênio Salles (V8)', x: 590, y: 590, neighborhood: 'Aleixo' },
  coroado: { id: 'coroado', name: 'Coroado / UFAM (Av. Rodrigo Otávio)', x: 670, y: 650, neighborhood: 'Coroado' },
  jorgeteixeira: { id: 'jorgeteixeira', name: 'Jorge Teixeira / Grande Vitória', x: 780, y: 430, neighborhood: 'Jorge Teixeira' },
};

/**
 * Weighted edges representing main avenues and corridors of Manaus
 */
export const MANAUS_GRAPH_EDGES: GraphEdge[] = [
  { from: 'centro', to: 'praca14', distanceKm: 2.1, streetName: 'Av. Sete de Setembro / Castelo Branco' },
  { from: 'centro', to: 'bilhares', distanceKm: 3.4, streetName: 'Av. Constantino Nery' },
  { from: 'praca14', to: 'adrianopolis', distanceKm: 2.8, streetName: 'Av. Maceió' },
  { from: 'bilhares', to: 'adrianopolis', distanceKm: 1.9, streetName: 'Rua Djalma Batista / Maromba' },
  { from: 'bilhares', to: 'redencao', distanceKm: 3.6, streetName: 'Av. Desembargador João Machado' },
  { from: 'bilhares', to: 'flores', distanceKm: 3.2, streetName: 'Av. Djalma Batista' },
  { from: 'adrianopolis', to: 'parque10', distanceKm: 2.3, streetName: 'Av. Mário Ypiranga Monteiro' },
  { from: 'adrianopolis', to: 'aleixo', distanceKm: 2.5, streetName: 'Av. Ephigênio Salles (V8)' },
  { from: 'redencao', to: 'pontanegra', distanceKm: 4.8, streetName: 'Av. Coronel Teixeira' },
  { from: 'redencao', to: 'flores', distanceKm: 2.7, streetName: 'Av. Prof. Nilton Lins' },
  { from: 'pontanegra', to: 'taruma', distanceKm: 5.9, streetName: 'Av. do Turismo' },
  { from: 'taruma', to: 'cidadenova', distanceKm: 7.2, streetName: 'Av. Santos Dumont / Torquato' },
  { from: 'flores', to: 'cidadenova', distanceKm: 4.5, streetName: 'Av. Torquato Tapajós / Max Teixeira' },
  { from: 'parque10', to: 'cidadenova', distanceKm: 5.1, streetName: 'Av. Timbiras' },
  { from: 'parque10', to: 'aleixo', distanceKm: 2.4, streetName: 'Av. Paraíba / Morada do Sol' },
  { from: 'aleixo', to: 'coroado', distanceKm: 3.1, streetName: 'Av. André Araújo' },
  { from: 'praca14', to: 'coroado', distanceKm: 4.2, streetName: 'Av. Rodrigo Otávio' },
  { from: 'cidadenova', to: 'jorgeteixeira', distanceKm: 6.8, streetName: 'Av. Camapuã / Noel Nutels' },
  { from: 'coroado', to: 'jorgeteixeira', distanceKm: 7.5, streetName: 'Av. Cosme Ferreira / Autaz Mirim' },
];

/**
 * Adjacency List builder
 */
function buildAdjacencyList() {
  const adj: Record<string, { to: string; distanceKm: number; streetName: string }[]> = {};
  
  Object.keys(MANAUS_GRAPH_NODES).forEach(nodeId => {
    adj[nodeId] = [];
  });

  MANAUS_GRAPH_EDGES.forEach(edge => {
    adj[edge.from]?.push({ to: edge.to, distanceKm: edge.distanceKm, streetName: edge.streetName });
    // Bidirectional urban road network
    adj[edge.to]?.push({ to: edge.from, distanceKm: edge.distanceKm, streetName: edge.streetName });
  });

  return adj;
}

/**
 * Euclidean distance heuristic for A* algorithm
 */
function heuristicDistance(nodeA: GraphNode, nodeB: GraphNode): number {
  const dx = nodeA.x - nodeB.x;
  const dy = nodeA.y - nodeB.y;
  // Convert map coordinate distance to approx km scale
  return (Math.sqrt(dx * dx + dy * dy) / 100) * 1.5;
}

/**
 * Dijkstra / A* Shortest Path implementation on Manaus Urban Network
 */
export function calculateShortestPath(startNodeId: string, targetNodeId: string, algorithm: 'dijkstra' | 'astar' = 'astar'): RoutePath | null {
  const nodes = MANAUS_GRAPH_NODES;
  const adj = buildAdjacencyList();

  if (!nodes[startNodeId] || !nodes[targetNodeId]) {
    return null;
  }

  if (startNodeId === targetNodeId) {
    const node = nodes[startNodeId];
    return {
      nodes: [node],
      totalDistanceKm: 0.1,
      estimatedMinutes: 2,
      instructions: [
        {
          step: 1,
          instruction: `Você já está nas imediações de ${node.name}. Descarte seguro a poucos passos.`,
          street: node.neighborhood,
          distanceKm: 0.1,
          icon: 'check',
        },
      ],
    };
  }

  const gScore: Record<string, number> = {};
  const fScore: Record<string, number> = {};
  const previousNode: Record<string, string | null> = {};
  const streetUsed: Record<string, string> = {};
  const openSet = new Set<string>([startNodeId]);
  const closedSet = new Set<string>();

  Object.keys(nodes).forEach(id => {
    gScore[id] = Infinity;
    fScore[id] = Infinity;
    previousNode[id] = null;
  });

  gScore[startNodeId] = 0;
  fScore[startNodeId] = algorithm === 'astar' 
    ? heuristicDistance(nodes[startNodeId], nodes[targetNodeId])
    : 0;

  while (openSet.size > 0) {
    // Find node with minimum fScore in openSet
    let current: string | null = null;
    let lowestF = Infinity;
    openSet.forEach(nodeId => {
      const f = fScore[nodeId];
      if (f < lowestF) {
        lowestF = f;
        current = nodeId;
      }
    });

    if (!current || current === targetNodeId) {
      break;
    }

    openSet.delete(current);
    closedSet.add(current);

    const neighbors = adj[current] || [];
    for (const neighbor of neighbors) {
      if (closedSet.has(neighbor.to)) continue;

      const tentativeG = gScore[current] + neighbor.distanceKm;

      if (tentativeG < gScore[neighbor.to]) {
        previousNode[neighbor.to] = current;
        streetUsed[neighbor.to] = neighbor.streetName;
        gScore[neighbor.to] = tentativeG;

        const h = algorithm === 'astar' 
          ? heuristicDistance(nodes[neighbor.to], nodes[targetNodeId])
          : 0;

        fScore[neighbor.to] = tentativeG + h;

        if (!openSet.has(neighbor.to)) {
          openSet.add(neighbor.to);
        }
      }
    }
  }

  // Reconstruct path
  const pathNodes: GraphNode[] = [];
  let curr: string | null = targetNodeId;

  if (gScore[targetNodeId] === Infinity) {
    return null; // No path found
  }

  while (curr) {
    pathNodes.unshift(nodes[curr]);
    curr = previousNode[curr];
  }

  const totalDistance = Math.round(gScore[targetNodeId] * 10) / 10;
  // Average urban speed in Manaus traffic ~ 22 km/h + 3 min buffer
  const estimatedMinutes = Math.max(5, Math.round((totalDistance / 22) * 60) + 2);

  // Turn by turn directions
  const instructions = [];
  for (let i = 0; i < pathNodes.length - 1; i++) {
    const from = pathNodes[i];
    const to = pathNodes[i + 1];
    const street = streetUsed[to.id] || 'Via de Acesso Local';
    const edge = adj[from.id]?.find(e => e.to === to.id);
    const dist = edge ? edge.distanceKm : 1.2;

    instructions.push({
      step: i + 1,
      instruction: i === 0 
        ? `Partida de ${from.name}: siga pela ${street} em direção a ${to.neighborhood}.`
        : `Continue pela ${street} até atingir ${to.name}.`,
      street,
      distanceKm: dist,
      icon: i === 0 ? 'navigation' : (i % 2 === 0 ? 'arrow-right' : 'arrow-up'),
    });
  }

  instructions.push({
    step: instructions.length + 1,
    instruction: `Chegada ao Ponto de Entrega Voluntária: ${nodes[targetNodeId].name}. Estacionamento e baias acessíveis disponíveis.`,
    street: nodes[targetNodeId].neighborhood,
    distanceKm: 0.1,
    icon: 'check-circle',
  });

  return {
    nodes: pathNodes,
    totalDistanceKm: totalDistance,
    estimatedMinutes,
    instructions,
  };
}
