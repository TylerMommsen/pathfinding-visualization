export default class Node {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.visited = false;
    this.start = false;
    this.finish = false;
  }
}
