import recursiveDivision from './mazes/recursivedivision';
import binaryTree from './mazes/binarytree';
import sidewinder from './mazes/sidewinder';
import generatePrims from './mazes/prims';
import generateHuntAndKill from './mazes/huntandkill';
import randomMap from './mazes/randommap';

class MazeFactory {
  static createMaze(mazeAlgorithm) {
    // Map algorithm names to their corresponding implementations
    const algorithms = {
      'Recursive Division': recursiveDivision,
      'Binary Tree': binaryTree,
      Sidewinder: sidewinder,
      "Prim's": generatePrims,
      'Hunt & Kill': generateHuntAndKill,
      'Random Map': randomMap,
    };

    const AlgorithmClass = algorithms[mazeAlgorithm];

    if (!AlgorithmClass) {
      throw new Error(`Algorithm "${mazeAlgorithm}" not found`);
    }

    return AlgorithmClass;
  }
}

export default MazeFactory;
