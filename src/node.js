import DomHandler from './domhandler';

export default class Node {
  constructor(row, col, totalRows, totalCols, grid, nodeSize) {
    this.nodeSize = null; // holds px value of node width and height
    this.setNodeWidth(nodeSize);
    this.totalRows = totalRows;
    this.totalCols = totalCols;
    this.row = row;
    this.col = col;
    this.y = this.row * this.nodeSize;
    this.x = this.col * this.nodeSize;
    this.nodeType = 'empty'; // used to update square display on dom e.g start, end or barrier
    this.neighbors = [];
    this.previousNode = null;
    this.grid = grid;

    // used for Astar and Dijsktra
    this.f = 0;
    this.g = 0;
    this.h = 0;
  }

  // adjust size of node in px
  setNodeWidth(nodeSize) {
    if (nodeSize === 'small') {
      this.nodeSize = 50;
    } else if (nodeSize === 'medium') {
      this.nodeSize = 30;
    } else if (nodeSize === 'large') {
      this.nodeSize = 20;
    }
  }

  // change node type e.g barrier, start, end, open-list, closed-list
  setNodeType(newNodeType, delay) {
    DomHandler.displayNode(this, this.nodeType, newNodeType, this.grid, delay);
    this.nodeType = newNodeType;
  }

  // calc f, g and h scores
  calcScores(startNode, endNode) {
    this.g = Math.abs(this.x - startNode.x) + Math.abs(this.y - startNode.y);
    this.h = Math.abs(this.x - endNode.x) + Math.abs(this.y - endNode.y);
    this.f = this.g + this.h;
    return this.f;
  }

  // set neighbors for current node (no diagonals)
  setNeighbors(grid) {
    const tempRow = this.row - 1;
    const tempCol = this.col - 1;

    if (tempCol < this.totalCols - 1) {
      // right
      this.neighbors.push(grid[tempRow][tempCol + 1]);
    }

    if (tempCol > 0) {
      // left
      this.neighbors.push(grid[tempRow][tempCol - 1]);
    }

    if (tempRow < this.totalRows - 1) {
      // down
      this.neighbors.push(grid[tempRow + 1][tempCol]);
    }

    if (tempRow > 0) {
      // up
      this.neighbors.push(grid[tempRow - 1][tempCol]);
    }
  }
}
