import runBidirectional from './algorithms/bidirectional';
import runAstar from './algorithms/astar';
import runDijkstra from './algorithms/dijkstra';

class AlgorithmFactory {
  static createAlgorithm(algorithmName) {
    // Map algorithm names to their corresponding implementations
    const algorithms = {
      'A*': runAstar,
      Dijkstra: runDijkstra,
      Bidirectional: runBidirectional,
    };

    const AlgorithmClass = algorithms[algorithmName];

    if (!AlgorithmClass) {
      throw new Error(`Algorithm "${algorithmName}" not found`);
    }

    return AlgorithmClass;
  }
}

export default AlgorithmFactory;
