export default async function sidewinder(gridObj, delay) {
  gridObj.fillGrid(); // set the grid as walls

  const grid = gridObj.grid;
  const rows = grid.length;
  const cols = grid[0].length;

  // leave first row empty
  for (let col = 0; col < cols; col++) {
    if (col !== 0 && col !== cols - 1) {
      grid[1][col].setNodeType('empty', delay);
    }
  }

  for (let row = 1; row < rows; row += 2) {
    let run = [];
    for (let col = 1; col < cols; col += 2) {
      const currentNode = grid[row][col];
      currentNode.setNodeType('empty', delay);
      run.push(currentNode);

      if (Math.random() < 0.6 && col !== cols - 2) {
        if (delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
        currentNode.neighbors[0].setNodeType('empty', delay);
      } else if (run.length > 0 && row > 1) {
        const randomIndex = Math.floor(Math.random() * run.length);
        if (delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
        run[randomIndex].neighbors[3].setNodeType('empty', delay);
        run = [];
      }
    }
  }
  return true; // maze generation finished
}
