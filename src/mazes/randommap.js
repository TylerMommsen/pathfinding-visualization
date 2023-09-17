export default function randomMap(grid) {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const random = Math.random();
      if (random < 0.3) {
        grid[row][col].setNodeType('barrier');
      }
    }
  }
  return true; // maze generation finished
}
