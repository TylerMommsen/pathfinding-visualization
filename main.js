/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/scss/main.scss":
/*!****************************!*\
  !*** ./src/scss/main.scss ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/algorithms/astar.js":
/*!*********************************!*\
  !*** ./src/algorithms/astar.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ astar)
/* harmony export */ });
function astar(startNode, endNode) {
  return new Promise((resolve) => {
    const openList = [];
    const closedList = [];
    const finalPath = [];
    let animationFrameId = null;

    function removeFromArr(node) {
      for (let i = 0; i < openList.length; i++) {
        if (openList[i] === node) {
          openList.splice(i, 1);
        }
      }
    }

    openList.push(startNode);
    startNode.setNodeType('open-list');
    function algorithm() {
      let currentNode = null;
      let lowestF = Infinity;
      for (let i = 0; i < openList.length; i++) {
        openList[i].calcScores(startNode, endNode);
        if (openList[i].f < lowestF) {
          lowestF = openList[i].f;
          currentNode = openList[i];
        }
      }

      if (currentNode === endNode) {
        let temp = currentNode;
        finalPath.push(temp);
        temp.setNodeType('final-path');
        while (temp.previousNode) {
          finalPath.push(temp.previousNode);
          temp.previousNode.setNodeType('final-path');
          temp = temp.previousNode;
        }
        resolve(true);
        return;
      }

      closedList.push(currentNode);
      currentNode.setNodeType('closed-list');
      removeFromArr(currentNode);

      for (let i = 0; i < currentNode.neighbors.length; i++) {
        const currNeighbor = currentNode.neighbors[i];

        if (currNeighbor.nodeType !== 'barrier' && !closedList.includes(currNeighbor)) {
          const tempG = currentNode.g + 1;
          if (openList.includes(currNeighbor)) {
            if (tempG < currNeighbor.g) {
              currNeighbor.g = tempG;
            }
          } else {
            currNeighbor.g = tempG;
            openList.push(currNeighbor);
            currNeighbor.setNodeType('open-list');
          }

          currNeighbor.previousNode = currentNode;
        }
      }

      if (openList.length > 0) {
        animationFrameId = requestAnimationFrame(algorithm);
      } else {
        resolve(false);
      }
    }

    algorithm();
  });
}


/***/ }),

/***/ "./src/algorithms/dijkstra.js":
/*!************************************!*\
  !*** ./src/algorithms/dijkstra.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ dijkstra)
/* harmony export */ });
function dijkstra(grid, startNode, endNode) {
  return new Promise((resolve) => {
    const openListQueue = []; // tracks nodes to visit
    const closedList = [];
    const finalPath = [];
    let animationFrameId = null;

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        grid[row][col].g = Infinity;
      }
    }

    startNode.g = 0;
    openListQueue.push(startNode);
    startNode.setNodeType('open-list');

    function algorithm() {
      const currentNode = openListQueue.shift();
      currentNode.setNodeType('closed-list');

      if (currentNode === endNode) {
        let temp = currentNode;
        finalPath.push(temp);
        temp.setNodeType('final-path');
        while (temp.previousNode) {
          finalPath.push(temp.previousNode);
          temp.previousNode.setNodeType('final-path');
          temp = temp.previousNode;
        }
        resolve(true);
        return;
      }

      for (let i = 0; i < currentNode.neighbors.length; i++) {
        const currNeighbor = currentNode.neighbors[i];

        if (currNeighbor.nodeType !== 'barrier' && !closedList.includes(currNeighbor)) {
          if (currNeighbor.g === Infinity) {
            currNeighbor.g = currentNode.g + 1;
            currNeighbor.previousNode = currentNode;
            openListQueue.push(currNeighbor);
            currNeighbor.setNodeType('open-list');
          }
        }
      }

      if (openListQueue.length > 0) {
        animationFrameId = requestAnimationFrame(algorithm);
      } else {
        resolve(false);
      }
    }

    algorithm();
  });
}


/***/ }),

/***/ "./src/domhandler.js":
/*!***************************!*\
  !*** ./src/domhandler.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function updateSquare(gridSquare, nodeType) {
  gridSquare.classList.add(nodeType);
}

function displayAlgorithm(node, grid) {
  const domSquare = grid.findDomSquare(node.row - 1, node.col - 1);
  domSquare.removeAttribute('class');
  domSquare.classList.add('grid-square');
  domSquare.classList.add(node.nodeType);
}

function displayGrid(grid) {
  const gridContainer = document.querySelector('.grid-container');
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const gridSquare = document.createElement('div');
      gridSquare.classList.add('grid-square');
      gridSquare.classList.add('empty');
      gridContainer.appendChild(gridSquare);
    }
  }
}

function resetGrid() {
  const gridContainer = document.querySelector('.grid-container');
  const gridContainerChildren = gridContainer.querySelectorAll('.grid-square');

  for (let i = 0; i < gridContainerChildren.length; i++) {
    gridContainerChildren[i].removeAttribute('class');
    gridContainerChildren[i].classList.add('grid-square');
    gridContainerChildren[i].classList.add('empty');
  }
}

const DomHandler = {
  displayGrid,
  updateSquare,
  displayAlgorithm,
  resetGrid,
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DomHandler);


/***/ }),

/***/ "./src/grid.js":
/*!*********************!*\
  !*** ./src/grid.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Grid)
/* harmony export */ });
/* harmony import */ var _node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node */ "./src/node.js");
/* harmony import */ var _domhandler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./domhandler */ "./src/domhandler.js");



class Grid {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.start = { node: null };
    this.end = { node: null };
    this.grid = [];
    this.openList = [];
    this.closedList = [];
    this.finalPath = [];
    this.createGrid(this.rows, this.cols);

    this.isDragging = false;
  }

  setSquareStatus(gridSquare, row, col) {
    const currentNode = this.grid[row][col];
    if (currentNode.nodeType !== 'empty') return;
    if (this.start.node === null) {
      currentNode.nodeType = 'start';
      this.start.node = currentNode;
    } else if (this.end.node === null) {
      currentNode.nodeType = 'end';
      this.end.node = currentNode;
    } else {
      currentNode.nodeType = 'barrier';
    }
    _domhandler__WEBPACK_IMPORTED_MODULE_1__["default"].updateSquare(gridSquare, currentNode.nodeType);
  }

  handleMouseDown(gridSquare, row, col) {
    this.isDragging = true;
    this.setSquareStatus(gridSquare, row, col);
  }

  handleMouseMove(gridSquare, row, col) {
    if (this.isDragging) {
      this.setSquareStatus(gridSquare, row, col);
    }
  }

  handleMouseUp() {
    this.isDragging = false;
  }

  findDomSquare(row, col) {
    const gridContainer = document.querySelector('.grid-container');
    const gridContainerChildren = gridContainer.children;
    const index = row * this.cols + col;
    return gridContainerChildren[index];
  }

  addListeners(currentlyRunning) {
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[row].length; col++) {
        const gridSquare = this.findDomSquare(row, col);
        gridSquare.addEventListener('mousedown', () => {
          if (currentlyRunning[0]) return;
          this.handleMouseDown(gridSquare, row, col);
        });
        gridSquare.addEventListener('mousemove', () => {
          if (currentlyRunning[0]) return;
          this.handleMouseMove(gridSquare, row, col);
        });
      }
    }

    document.addEventListener('mouseup', () => {
      this.handleMouseUp();
    });
  }

  createGrid(rows, cols) {
    for (let row = 1; row <= rows; row++) {
      const currentRow = [];
      for (let col = 1; col <= cols; col++) {
        currentRow.push(new _node__WEBPACK_IMPORTED_MODULE_0__["default"](row, col, this));
      }
      this.grid.push(currentRow);
    }
    _domhandler__WEBPACK_IMPORTED_MODULE_1__["default"].displayGrid(this.grid);
  }

  setAllNodeNeighbors() {
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[row].length; col++) {
        this.grid[row][col].setNeighbors(this.grid);
      }
    }
  }

  resetGrid() {
    // creating new grid
    this.grid = [];
    for (let row = 1; row <= this.rows; row++) {
      const currentRow = [];
      for (let col = 1; col <= this.cols; col++) {
        currentRow.push(new _node__WEBPACK_IMPORTED_MODULE_0__["default"](row, col, this));
      }
      this.grid.push(currentRow);
    }

    // setting neighbours again
    this.setAllNodeNeighbors();

    // resetting start and end node
    this.start.node = null;
    this.end.node = null;

    // reseting dom squares
    _domhandler__WEBPACK_IMPORTED_MODULE_1__["default"].resetGrid();
  }
}


/***/ }),

/***/ "./src/mainloop.js":
/*!*************************!*\
  !*** ./src/mainloop.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ load)
/* harmony export */ });
/* harmony import */ var _grid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./grid */ "./src/grid.js");
/* harmony import */ var _algorithms_astar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./algorithms/astar */ "./src/algorithms/astar.js");
/* harmony import */ var _algorithms_dijkstra__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./algorithms/dijkstra */ "./src/algorithms/dijkstra.js");
/* harmony import */ var _mazes_randommap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./mazes/randommap */ "./src/mazes/randommap.js");
/* harmony import */ var _mazes_binarytree__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./mazes/binarytree */ "./src/mazes/binarytree.js");
/* harmony import */ var _mazes_sidewinder__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./mazes/sidewinder */ "./src/mazes/sidewinder.js");
/* harmony import */ var _mazes_recursivedivision__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./mazes/recursivedivision */ "./src/mazes/recursivedivision.js");








let gridObj = null;
const ROWS = 25;
const COLS = 61;
let selectedAlgorithm = null;
let selectedMaze = null;
const running = [false]; // check if algorithm is currently running

function loadGrid() {
  gridObj = new _grid__WEBPACK_IMPORTED_MODULE_0__["default"](ROWS, COLS);
}

async function runAStar() {
  const startNode = gridObj.start.node;
  const endNode = gridObj.end.node;

  try {
    running[0] = true;
    const pathFound = await (0,_algorithms_astar__WEBPACK_IMPORTED_MODULE_1__["default"])(startNode, endNode);

    if (pathFound) {
      console.log('found path');
      running[0] = false;
    } else {
      console.log('path not found');
    }
  } catch (error) {
    console.log(error);
  } finally {
    running[0] = false;
  }
}

async function runDijkstra() {
  const startNode = gridObj.start.node;
  const endNode = gridObj.end.node;

  try {
    running[0] = true;
    const pathFound = await (0,_algorithms_dijkstra__WEBPACK_IMPORTED_MODULE_2__["default"])(gridObj.grid, startNode, endNode);

    if (pathFound) {
      console.log('found path');
      running[0] = false;
    } else {
      console.log('path not found');
    }
  } catch (error) {
    console.log(error);
  } finally {
    running[0] = false;
  }
}

const startBtn = document.querySelector('.start-algorithm');

startBtn.addEventListener('click', async () => {
  if (running[0]) return; // algorithm in progress
  gridObj.setAllNodeNeighbors();

  if (gridObj.start.node && gridObj.end.node) {
    if (selectedAlgorithm === 'A*') runAStar();
    if (selectedAlgorithm === 'Dijkstra') runDijkstra();
  }
});

const generateMazeBtn = document.querySelector('.generate-maze');

generateMazeBtn.addEventListener('click', async () => {
  if (running[0]) return; // algorithm in progress
  running[0] = true;
  gridObj.resetGrid();

  let done;
  if (selectedMaze === 'Random Map') {
    done = await (0,_mazes_randommap__WEBPACK_IMPORTED_MODULE_3__["default"])(gridObj.grid);
  }
  if (selectedMaze === 'Binary Tree') {
    done = await (0,_mazes_binarytree__WEBPACK_IMPORTED_MODULE_4__["default"])(gridObj.grid);
  }
  if (selectedMaze === 'Sidewinder') {
    done = await (0,_mazes_sidewinder__WEBPACK_IMPORTED_MODULE_5__["default"])(gridObj.grid);
  }
  if (selectedMaze === 'Recursive Division') {
    done = await (0,_mazes_recursivedivision__WEBPACK_IMPORTED_MODULE_6__["default"])(gridObj.grid);
  }
  if (done) running[0] = false;
});

function addListenersToBtns() {
  const dropdownButtons = document.querySelectorAll('.dropdown-btn');
  const dropdownLists = document.querySelectorAll('.dropdown-list');
  const clearBoardBtn = document.querySelector('.clear-board');

  function closeDropdowns() {
    dropdownLists.forEach((list) => {
      list.classList.remove('show');
    });
  }

  dropdownButtons.forEach((button, index) => {
    if (running[0]) return; // algorithm in progress
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const currentList = dropdownLists[index];
      const isListOpen = currentList.classList.contains('show');

      closeDropdowns();

      if (!isListOpen) {
        currentList.classList.toggle('show');
      }
    });
  });

  document.addEventListener('click', (e) => {
    const isClickInsideDropdown = Array.from(dropdownLists).some((list) => list.contains(e.target));

    if (!isClickInsideDropdown) {
      closeDropdowns();
    }
  });

  dropdownLists.forEach((list, index) => {
    const listItems = list.querySelectorAll('.list-selection');

    listItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        dropdownLists[index].classList.remove('show');
        dropdownButtons[index].textContent = item.textContent;
        if (index === 0) selectedAlgorithm = item.textContent;
        if (index === 1) selectedMaze = item.textContent;
        e.stopPropagation();
      });
    });
  });

  clearBoardBtn.addEventListener('click', () => {
    if (running[0]) return; // algorithm in progress
    gridObj.resetGrid();
  });
}

function addListenersToGrid() {
  gridObj.addListeners(running);
}

function load() {
  loadGrid();
  addListenersToGrid();
  document.addEventListener('DOMContentLoaded', () => {
    addListenersToBtns();
  });
}


/***/ }),

/***/ "./src/mazes/binarytree.js":
/*!*********************************!*\
  !*** ./src/mazes/binarytree.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ binaryTree)
/* harmony export */ });
async function binaryTree(grid) {
  const delay = 0.1;

  function connect(node1, node2, barrierBetween) {
    node1.setNodeType('empty');
    node2.setNodeType('empty');
    barrierBetween.setNodeType('empty');
  }

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      grid[row][col].setNodeType('barrier');
    }
  }

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (row % 2 === 0 || col % 2 === 0) continue;
      await new Promise((resolve) => setTimeout(resolve, delay));

      const currentSquare = grid[row][col];
      let northNeighbor;
      let westNeighbor;

      if (row > 1) {
        northNeighbor = grid[row - 2][col]; // up
      } else {
        northNeighbor = null;
      }

      if (col > 1) {
        westNeighbor = grid[row][col - 2]; // left
      } else {
        westNeighbor = null;
      }

      if (northNeighbor && westNeighbor) {
        // if both paths are available
        const random = Math.floor(Math.random() * 2);
        if (random === 0) {
          connect(currentSquare, northNeighbor, currentSquare.neighbors[3]);
        } else {
          connect(currentSquare, westNeighbor, currentSquare.neighbors[1]);
        }
      } else {
        // if one of the paths go beyond the grid
        if (row === 1 && col > 1) {
          connect(currentSquare, westNeighbor, currentSquare.neighbors[1]);
        }
        if (col === 1 && row > 1) {
          connect(currentSquare, northNeighbor, currentSquare.neighbors[3]);
        }
      }
    }
  }
  return true; // maze generation finished
}


/***/ }),

/***/ "./src/mazes/randommap.js":
/*!********************************!*\
  !*** ./src/mazes/randommap.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ randomMap)
/* harmony export */ });
function randomMap(grid) {
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


/***/ }),

/***/ "./src/mazes/recursivedivision.js":
/*!****************************************!*\
  !*** ./src/mazes/recursivedivision.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ recursiveDivision)
/* harmony export */ });
async function recursiveDivision(grid) {
  const delay = 5;
  const rows = grid.length;
  const cols = grid[0].length;
  let isFinished = false; // is recursive process finished?

  function randomEven(a, b) {
    const random = Math.floor(Math.random() * (b - a + 1)) + a;
    return random % 2 === 0 ? random : random + 1;
  }

  function randomOdd(a, b) {
    const random = Math.floor(Math.random() * (b - a + 1)) + a;
    return random % 2 !== 0 ? random : random + 1;
  }

  function chooseOrientation(startRow, endRow, startCol, endCol) {
    const width = endCol - startCol;
    const height = endRow - startRow;
    if (width > height) {
      return 'vertical';
    } else if (width < height) {
      return 'horizontal';
    }

    const random = Math.floor(Math.random() * 2);
    return random === 0 ? 'horizontal' : 'vertical';
  }

  // set edges of grid as barriers
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (row === 0 || row === rows - 1 || col === 0 || col === cols - 1) {
        grid[row][col].setNodeType('barrier');
      }
    }
  }

  // the recursive function to divide the grid
  async function divide(startRow, endRow, startCol, endCol) {
    if (endCol - startCol < 1 || endRow - startRow < 1) {
      // base case if sub-maze is too small
      return;
    }

    const wallRow = randomEven(startRow + 1, endRow - 1);
    const wallCol = randomEven(startCol + 1, endCol - 1);

    const passageRow = randomOdd(startRow, endRow);
    const passageCol = randomOdd(startCol, endCol);

    const orientation = chooseOrientation(startRow, endRow, startCol, endCol);

    if (orientation === 'horizontal') {
      // make a horizontal wall
      for (let col = startCol; col <= endCol; col++) {
        if (col !== passageCol) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          grid[wallRow][col].setNodeType('barrier');
        }
      }
    } else if (orientation === 'vertical') {
      // make a vertical wall
      for (let row = startRow; row <= endRow; row++) {
        if (row !== passageRow) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          grid[row][wallCol].setNodeType('barrier');
        }
      }
    }

    if (orientation === 'horizontal') {
      await divide(startRow, wallRow - 1, startCol, endCol);
      await divide(wallRow + 1, endRow, startCol, endCol);
    } else if (orientation === 'vertical') {
      await divide(startRow, endRow, wallCol + 1, endCol);
      await divide(startRow, endRow, startCol, wallCol - 1);
    }

    // Check if this is the last recursive call
    if (startRow === 1 && endRow === rows - 2 && startCol === 1 && endCol === cols - 2) {
      isFinished = true;
    }
  }

  await divide(1, rows - 2, 1, cols - 2);

  return isFinished; // maze generation finished
}


/***/ }),

/***/ "./src/mazes/sidewinder.js":
/*!*********************************!*\
  !*** ./src/mazes/sidewinder.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ sidewinder)
/* harmony export */ });
async function sidewinder(grid) {
  const delay = 0.1;
  const rows = grid.length;
  const cols = grid[0].length;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (row === 1 && col !== 0 && col !== cols - 1) continue;
      if (col % 2 === 0) {
        grid[row][col].setNodeType('barrier');
      }
      if (row % 2 === 0) {
        grid[row][col].setNodeType('barrier');
      }
    }
  }

  for (let row = 1; row < rows; row++) {
    let run = [];
    for (let col = 1; col < cols; col += 2) {
      if (row % 2 === 0) continue;

      await new Promise((resolve) => setTimeout(resolve, delay));
      if (row === 1) {
        grid[row][col].setNodeType('empty');
        continue;
      }

      const currentNode = grid[row][col];
      run.push(currentNode);

      if (col < cols - 1) {
        if (Math.random() < 0.6 && col !== cols - 2) {
          currentNode.neighbors[0].setNodeType('empty');
        } else if (run.length > 0 && row > 1) {
          const randomIndex = Math.floor(Math.random() * run.length);
          run[randomIndex].neighbors[3].setNodeType('empty');
          run = [];
        }
      }
    }
  }
  return true; // maze generation finished
}


/***/ }),

/***/ "./src/node.js":
/*!*********************!*\
  !*** ./src/node.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Node)
/* harmony export */ });
/* harmony import */ var _domhandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./domhandler */ "./src/domhandler.js");


class Node {
  constructor(row, col, grid) {
    this.nodeWidth = 30; // px width and height of square
    this.totalRows = 25;
    this.totalCols = 60;
    this.row = row;
    this.col = col;
    this.y = this.row * this.nodeWidth;
    this.x = this.col * this.nodeWidth;
    this.nodeType = 'empty'; // used to update square display on dom e.g start, end or barrier
    this.neighbors = [];
    this.previousNode = null;
    this.grid = grid;

    // astar scores
    this.f = 0;
    this.g = 0;
    this.h = 0;
  }

  setNodeType(newNodeType) {
    this.nodeType = newNodeType;
    _domhandler__WEBPACK_IMPORTED_MODULE_0__["default"].displayAlgorithm(this, this.grid);
  }

  // calc f, g and h scores
  calcScores(startNode, endNode) {
    this.g = Math.abs(this.x - startNode.x) + Math.abs(this.y - startNode.y);
    this.h = Math.abs(this.x - endNode.x) + Math.abs(this.y - endNode.y);
    this.f = this.g + this.h;
    return this.f;
  }

  setNeighbors(grid) {
    const tempRow = this.row - 1;
    const tempCol = this.col - 1;

    if (tempCol < this.totalCols) {
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


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scss_main_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scss/main.scss */ "./src/scss/main.scss");
/* harmony import */ var _mainloop__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mainloop */ "./src/mainloop.js");



(0,_mainloop__WEBPACK_IMPORTED_MODULE_1__["default"])();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7QUNOMEI7QUFDSTs7QUFFOUIscURBQUkiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL3Njc3MvbWFpbi5zY3NzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvYWxnb3JpdGhtcy9hc3Rhci5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL2FsZ29yaXRobXMvZGlqa3N0cmEuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9kb21oYW5kbGVyLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvZ3JpZC5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL21haW5sb29wLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvbWF6ZXMvYmluYXJ5dHJlZS5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL21hemVzL3JhbmRvbW1hcC5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL21hemVzL3JlY3Vyc2l2ZWRpdmlzaW9uLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvbWF6ZXMvc2lkZXdpbmRlci5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL25vZGUuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYXN0YXIoc3RhcnROb2RlLCBlbmROb2RlKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGNvbnN0IG9wZW5MaXN0ID0gW107XG4gICAgY29uc3QgY2xvc2VkTGlzdCA9IFtdO1xuICAgIGNvbnN0IGZpbmFsUGF0aCA9IFtdO1xuICAgIGxldCBhbmltYXRpb25GcmFtZUlkID0gbnVsbDtcblxuICAgIGZ1bmN0aW9uIHJlbW92ZUZyb21BcnIobm9kZSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcGVuTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAob3Blbkxpc3RbaV0gPT09IG5vZGUpIHtcbiAgICAgICAgICBvcGVuTGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBvcGVuTGlzdC5wdXNoKHN0YXJ0Tm9kZSk7XG4gICAgc3RhcnROb2RlLnNldE5vZGVUeXBlKCdvcGVuLWxpc3QnKTtcbiAgICBmdW5jdGlvbiBhbGdvcml0aG0oKSB7XG4gICAgICBsZXQgY3VycmVudE5vZGUgPSBudWxsO1xuICAgICAgbGV0IGxvd2VzdEYgPSBJbmZpbml0eTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3Blbkxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgb3Blbkxpc3RbaV0uY2FsY1Njb3JlcyhzdGFydE5vZGUsIGVuZE5vZGUpO1xuICAgICAgICBpZiAob3Blbkxpc3RbaV0uZiA8IGxvd2VzdEYpIHtcbiAgICAgICAgICBsb3dlc3RGID0gb3Blbkxpc3RbaV0uZjtcbiAgICAgICAgICBjdXJyZW50Tm9kZSA9IG9wZW5MaXN0W2ldO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChjdXJyZW50Tm9kZSA9PT0gZW5kTm9kZSkge1xuICAgICAgICBsZXQgdGVtcCA9IGN1cnJlbnROb2RlO1xuICAgICAgICBmaW5hbFBhdGgucHVzaCh0ZW1wKTtcbiAgICAgICAgdGVtcC5zZXROb2RlVHlwZSgnZmluYWwtcGF0aCcpO1xuICAgICAgICB3aGlsZSAodGVtcC5wcmV2aW91c05vZGUpIHtcbiAgICAgICAgICBmaW5hbFBhdGgucHVzaCh0ZW1wLnByZXZpb3VzTm9kZSk7XG4gICAgICAgICAgdGVtcC5wcmV2aW91c05vZGUuc2V0Tm9kZVR5cGUoJ2ZpbmFsLXBhdGgnKTtcbiAgICAgICAgICB0ZW1wID0gdGVtcC5wcmV2aW91c05vZGU7XG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjbG9zZWRMaXN0LnB1c2goY3VycmVudE5vZGUpO1xuICAgICAgY3VycmVudE5vZGUuc2V0Tm9kZVR5cGUoJ2Nsb3NlZC1saXN0Jyk7XG4gICAgICByZW1vdmVGcm9tQXJyKGN1cnJlbnROb2RlKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50Tm9kZS5uZWlnaGJvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgY3Vyck5laWdoYm9yID0gY3VycmVudE5vZGUubmVpZ2hib3JzW2ldO1xuXG4gICAgICAgIGlmIChjdXJyTmVpZ2hib3Iubm9kZVR5cGUgIT09ICdiYXJyaWVyJyAmJiAhY2xvc2VkTGlzdC5pbmNsdWRlcyhjdXJyTmVpZ2hib3IpKSB7XG4gICAgICAgICAgY29uc3QgdGVtcEcgPSBjdXJyZW50Tm9kZS5nICsgMTtcbiAgICAgICAgICBpZiAob3Blbkxpc3QuaW5jbHVkZXMoY3Vyck5laWdoYm9yKSkge1xuICAgICAgICAgICAgaWYgKHRlbXBHIDwgY3Vyck5laWdoYm9yLmcpIHtcbiAgICAgICAgICAgICAgY3Vyck5laWdoYm9yLmcgPSB0ZW1wRztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3Vyck5laWdoYm9yLmcgPSB0ZW1wRztcbiAgICAgICAgICAgIG9wZW5MaXN0LnB1c2goY3Vyck5laWdoYm9yKTtcbiAgICAgICAgICAgIGN1cnJOZWlnaGJvci5zZXROb2RlVHlwZSgnb3Blbi1saXN0Jyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY3Vyck5laWdoYm9yLnByZXZpb3VzTm9kZSA9IGN1cnJlbnROb2RlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChvcGVuTGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGFuaW1hdGlvbkZyYW1lSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYWxnb3JpdGhtKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFsZ29yaXRobSgpO1xuICB9KTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRpamtzdHJhKGdyaWQsIHN0YXJ0Tm9kZSwgZW5kTm9kZSkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBjb25zdCBvcGVuTGlzdFF1ZXVlID0gW107IC8vIHRyYWNrcyBub2RlcyB0byB2aXNpdFxuICAgIGNvbnN0IGNsb3NlZExpc3QgPSBbXTtcbiAgICBjb25zdCBmaW5hbFBhdGggPSBbXTtcbiAgICBsZXQgYW5pbWF0aW9uRnJhbWVJZCA9IG51bGw7XG5cbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCBncmlkLmxlbmd0aDsgcm93KyspIHtcbiAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGdyaWRbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG4gICAgICAgIGdyaWRbcm93XVtjb2xdLmcgPSBJbmZpbml0eTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzdGFydE5vZGUuZyA9IDA7XG4gICAgb3Blbkxpc3RRdWV1ZS5wdXNoKHN0YXJ0Tm9kZSk7XG4gICAgc3RhcnROb2RlLnNldE5vZGVUeXBlKCdvcGVuLWxpc3QnKTtcblxuICAgIGZ1bmN0aW9uIGFsZ29yaXRobSgpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnROb2RlID0gb3Blbkxpc3RRdWV1ZS5zaGlmdCgpO1xuICAgICAgY3VycmVudE5vZGUuc2V0Tm9kZVR5cGUoJ2Nsb3NlZC1saXN0Jyk7XG5cbiAgICAgIGlmIChjdXJyZW50Tm9kZSA9PT0gZW5kTm9kZSkge1xuICAgICAgICBsZXQgdGVtcCA9IGN1cnJlbnROb2RlO1xuICAgICAgICBmaW5hbFBhdGgucHVzaCh0ZW1wKTtcbiAgICAgICAgdGVtcC5zZXROb2RlVHlwZSgnZmluYWwtcGF0aCcpO1xuICAgICAgICB3aGlsZSAodGVtcC5wcmV2aW91c05vZGUpIHtcbiAgICAgICAgICBmaW5hbFBhdGgucHVzaCh0ZW1wLnByZXZpb3VzTm9kZSk7XG4gICAgICAgICAgdGVtcC5wcmV2aW91c05vZGUuc2V0Tm9kZVR5cGUoJ2ZpbmFsLXBhdGgnKTtcbiAgICAgICAgICB0ZW1wID0gdGVtcC5wcmV2aW91c05vZGU7XG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnROb2RlLm5laWdoYm9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBjdXJyTmVpZ2hib3IgPSBjdXJyZW50Tm9kZS5uZWlnaGJvcnNbaV07XG5cbiAgICAgICAgaWYgKGN1cnJOZWlnaGJvci5ub2RlVHlwZSAhPT0gJ2JhcnJpZXInICYmICFjbG9zZWRMaXN0LmluY2x1ZGVzKGN1cnJOZWlnaGJvcikpIHtcbiAgICAgICAgICBpZiAoY3Vyck5laWdoYm9yLmcgPT09IEluZmluaXR5KSB7XG4gICAgICAgICAgICBjdXJyTmVpZ2hib3IuZyA9IGN1cnJlbnROb2RlLmcgKyAxO1xuICAgICAgICAgICAgY3Vyck5laWdoYm9yLnByZXZpb3VzTm9kZSA9IGN1cnJlbnROb2RlO1xuICAgICAgICAgICAgb3Blbkxpc3RRdWV1ZS5wdXNoKGN1cnJOZWlnaGJvcik7XG4gICAgICAgICAgICBjdXJyTmVpZ2hib3Iuc2V0Tm9kZVR5cGUoJ29wZW4tbGlzdCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAob3Blbkxpc3RRdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGFuaW1hdGlvbkZyYW1lSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYWxnb3JpdGhtKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFsZ29yaXRobSgpO1xuICB9KTtcbn1cbiIsImZ1bmN0aW9uIHVwZGF0ZVNxdWFyZShncmlkU3F1YXJlLCBub2RlVHlwZSkge1xuICBncmlkU3F1YXJlLmNsYXNzTGlzdC5hZGQobm9kZVR5cGUpO1xufVxuXG5mdW5jdGlvbiBkaXNwbGF5QWxnb3JpdGhtKG5vZGUsIGdyaWQpIHtcbiAgY29uc3QgZG9tU3F1YXJlID0gZ3JpZC5maW5kRG9tU3F1YXJlKG5vZGUucm93IC0gMSwgbm9kZS5jb2wgLSAxKTtcbiAgZG9tU3F1YXJlLnJlbW92ZUF0dHJpYnV0ZSgnY2xhc3MnKTtcbiAgZG9tU3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2dyaWQtc3F1YXJlJyk7XG4gIGRvbVNxdWFyZS5jbGFzc0xpc3QuYWRkKG5vZGUubm9kZVR5cGUpO1xufVxuXG5mdW5jdGlvbiBkaXNwbGF5R3JpZChncmlkKSB7XG4gIGNvbnN0IGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ3JpZC1jb250YWluZXInKTtcbiAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgZ3JpZC5sZW5ndGg7IHJvdysrKSB7XG4gICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgZ3JpZFtyb3ddLmxlbmd0aDsgY29sKyspIHtcbiAgICAgIGNvbnN0IGdyaWRTcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGdyaWRTcXVhcmUuY2xhc3NMaXN0LmFkZCgnZ3JpZC1zcXVhcmUnKTtcbiAgICAgIGdyaWRTcXVhcmUuY2xhc3NMaXN0LmFkZCgnZW1wdHknKTtcbiAgICAgIGdyaWRDb250YWluZXIuYXBwZW5kQ2hpbGQoZ3JpZFNxdWFyZSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHJlc2V0R3JpZCgpIHtcbiAgY29uc3QgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ncmlkLWNvbnRhaW5lcicpO1xuICBjb25zdCBncmlkQ29udGFpbmVyQ2hpbGRyZW4gPSBncmlkQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5ncmlkLXNxdWFyZScpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JpZENvbnRhaW5lckNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgZ3JpZENvbnRhaW5lckNoaWxkcmVuW2ldLnJlbW92ZUF0dHJpYnV0ZSgnY2xhc3MnKTtcbiAgICBncmlkQ29udGFpbmVyQ2hpbGRyZW5baV0uY2xhc3NMaXN0LmFkZCgnZ3JpZC1zcXVhcmUnKTtcbiAgICBncmlkQ29udGFpbmVyQ2hpbGRyZW5baV0uY2xhc3NMaXN0LmFkZCgnZW1wdHknKTtcbiAgfVxufVxuXG5jb25zdCBEb21IYW5kbGVyID0ge1xuICBkaXNwbGF5R3JpZCxcbiAgdXBkYXRlU3F1YXJlLFxuICBkaXNwbGF5QWxnb3JpdGhtLFxuICByZXNldEdyaWQsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBEb21IYW5kbGVyO1xuIiwiaW1wb3J0IE5vZGUgZnJvbSAnLi9ub2RlJztcbmltcG9ydCBEb21IYW5kbGVyIGZyb20gJy4vZG9taGFuZGxlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyaWQge1xuICBjb25zdHJ1Y3Rvcihyb3dzLCBjb2xzKSB7XG4gICAgdGhpcy5yb3dzID0gcm93cztcbiAgICB0aGlzLmNvbHMgPSBjb2xzO1xuICAgIHRoaXMuc3RhcnQgPSB7IG5vZGU6IG51bGwgfTtcbiAgICB0aGlzLmVuZCA9IHsgbm9kZTogbnVsbCB9O1xuICAgIHRoaXMuZ3JpZCA9IFtdO1xuICAgIHRoaXMub3Blbkxpc3QgPSBbXTtcbiAgICB0aGlzLmNsb3NlZExpc3QgPSBbXTtcbiAgICB0aGlzLmZpbmFsUGF0aCA9IFtdO1xuICAgIHRoaXMuY3JlYXRlR3JpZCh0aGlzLnJvd3MsIHRoaXMuY29scyk7XG5cbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIHNldFNxdWFyZVN0YXR1cyhncmlkU3F1YXJlLCByb3csIGNvbCkge1xuICAgIGNvbnN0IGN1cnJlbnROb2RlID0gdGhpcy5ncmlkW3Jvd11bY29sXTtcbiAgICBpZiAoY3VycmVudE5vZGUubm9kZVR5cGUgIT09ICdlbXB0eScpIHJldHVybjtcbiAgICBpZiAodGhpcy5zdGFydC5ub2RlID09PSBudWxsKSB7XG4gICAgICBjdXJyZW50Tm9kZS5ub2RlVHlwZSA9ICdzdGFydCc7XG4gICAgICB0aGlzLnN0YXJ0Lm5vZGUgPSBjdXJyZW50Tm9kZTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZW5kLm5vZGUgPT09IG51bGwpIHtcbiAgICAgIGN1cnJlbnROb2RlLm5vZGVUeXBlID0gJ2VuZCc7XG4gICAgICB0aGlzLmVuZC5ub2RlID0gY3VycmVudE5vZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1cnJlbnROb2RlLm5vZGVUeXBlID0gJ2JhcnJpZXInO1xuICAgIH1cbiAgICBEb21IYW5kbGVyLnVwZGF0ZVNxdWFyZShncmlkU3F1YXJlLCBjdXJyZW50Tm9kZS5ub2RlVHlwZSk7XG4gIH1cblxuICBoYW5kbGVNb3VzZURvd24oZ3JpZFNxdWFyZSwgcm93LCBjb2wpIHtcbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSB0cnVlO1xuICAgIHRoaXMuc2V0U3F1YXJlU3RhdHVzKGdyaWRTcXVhcmUsIHJvdywgY29sKTtcbiAgfVxuXG4gIGhhbmRsZU1vdXNlTW92ZShncmlkU3F1YXJlLCByb3csIGNvbCkge1xuICAgIGlmICh0aGlzLmlzRHJhZ2dpbmcpIHtcbiAgICAgIHRoaXMuc2V0U3F1YXJlU3RhdHVzKGdyaWRTcXVhcmUsIHJvdywgY29sKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVNb3VzZVVwKCkge1xuICAgIHRoaXMuaXNEcmFnZ2luZyA9IGZhbHNlO1xuICB9XG5cbiAgZmluZERvbVNxdWFyZShyb3csIGNvbCkge1xuICAgIGNvbnN0IGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ3JpZC1jb250YWluZXInKTtcbiAgICBjb25zdCBncmlkQ29udGFpbmVyQ2hpbGRyZW4gPSBncmlkQ29udGFpbmVyLmNoaWxkcmVuO1xuICAgIGNvbnN0IGluZGV4ID0gcm93ICogdGhpcy5jb2xzICsgY29sO1xuICAgIHJldHVybiBncmlkQ29udGFpbmVyQ2hpbGRyZW5baW5kZXhdO1xuICB9XG5cbiAgYWRkTGlzdGVuZXJzKGN1cnJlbnRseVJ1bm5pbmcpIHtcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLmdyaWQubGVuZ3RoOyByb3crKykge1xuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgdGhpcy5ncmlkW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuICAgICAgICBjb25zdCBncmlkU3F1YXJlID0gdGhpcy5maW5kRG9tU3F1YXJlKHJvdywgY29sKTtcbiAgICAgICAgZ3JpZFNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoKSA9PiB7XG4gICAgICAgICAgaWYgKGN1cnJlbnRseVJ1bm5pbmdbMF0pIHJldHVybjtcbiAgICAgICAgICB0aGlzLmhhbmRsZU1vdXNlRG93bihncmlkU3F1YXJlLCByb3csIGNvbCk7XG4gICAgICAgIH0pO1xuICAgICAgICBncmlkU3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsICgpID0+IHtcbiAgICAgICAgICBpZiAoY3VycmVudGx5UnVubmluZ1swXSkgcmV0dXJuO1xuICAgICAgICAgIHRoaXMuaGFuZGxlTW91c2VNb3ZlKGdyaWRTcXVhcmUsIHJvdywgY29sKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsICgpID0+IHtcbiAgICAgIHRoaXMuaGFuZGxlTW91c2VVcCgpO1xuICAgIH0pO1xuICB9XG5cbiAgY3JlYXRlR3JpZChyb3dzLCBjb2xzKSB7XG4gICAgZm9yIChsZXQgcm93ID0gMTsgcm93IDw9IHJvd3M7IHJvdysrKSB7XG4gICAgICBjb25zdCBjdXJyZW50Um93ID0gW107XG4gICAgICBmb3IgKGxldCBjb2wgPSAxOyBjb2wgPD0gY29sczsgY29sKyspIHtcbiAgICAgICAgY3VycmVudFJvdy5wdXNoKG5ldyBOb2RlKHJvdywgY29sLCB0aGlzKSk7XG4gICAgICB9XG4gICAgICB0aGlzLmdyaWQucHVzaChjdXJyZW50Um93KTtcbiAgICB9XG4gICAgRG9tSGFuZGxlci5kaXNwbGF5R3JpZCh0aGlzLmdyaWQpO1xuICB9XG5cbiAgc2V0QWxsTm9kZU5laWdoYm9ycygpIHtcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLmdyaWQubGVuZ3RoOyByb3crKykge1xuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgdGhpcy5ncmlkW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuICAgICAgICB0aGlzLmdyaWRbcm93XVtjb2xdLnNldE5laWdoYm9ycyh0aGlzLmdyaWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlc2V0R3JpZCgpIHtcbiAgICAvLyBjcmVhdGluZyBuZXcgZ3JpZFxuICAgIHRoaXMuZ3JpZCA9IFtdO1xuICAgIGZvciAobGV0IHJvdyA9IDE7IHJvdyA8PSB0aGlzLnJvd3M7IHJvdysrKSB7XG4gICAgICBjb25zdCBjdXJyZW50Um93ID0gW107XG4gICAgICBmb3IgKGxldCBjb2wgPSAxOyBjb2wgPD0gdGhpcy5jb2xzOyBjb2wrKykge1xuICAgICAgICBjdXJyZW50Um93LnB1c2gobmV3IE5vZGUocm93LCBjb2wsIHRoaXMpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZ3JpZC5wdXNoKGN1cnJlbnRSb3cpO1xuICAgIH1cblxuICAgIC8vIHNldHRpbmcgbmVpZ2hib3VycyBhZ2FpblxuICAgIHRoaXMuc2V0QWxsTm9kZU5laWdoYm9ycygpO1xuXG4gICAgLy8gcmVzZXR0aW5nIHN0YXJ0IGFuZCBlbmQgbm9kZVxuICAgIHRoaXMuc3RhcnQubm9kZSA9IG51bGw7XG4gICAgdGhpcy5lbmQubm9kZSA9IG51bGw7XG5cbiAgICAvLyByZXNldGluZyBkb20gc3F1YXJlc1xuICAgIERvbUhhbmRsZXIucmVzZXRHcmlkKCk7XG4gIH1cbn1cbiIsImltcG9ydCBHcmlkIGZyb20gJy4vZ3JpZCc7XG5pbXBvcnQgYXN0YXIgZnJvbSAnLi9hbGdvcml0aG1zL2FzdGFyJztcbmltcG9ydCBkaWprc3RyYSBmcm9tICcuL2FsZ29yaXRobXMvZGlqa3N0cmEnO1xuaW1wb3J0IHJhbmRvbU1hcCBmcm9tICcuL21hemVzL3JhbmRvbW1hcCc7XG5pbXBvcnQgYmluYXJ5VHJlZSBmcm9tICcuL21hemVzL2JpbmFyeXRyZWUnO1xuaW1wb3J0IHNpZGV3aW5kZXIgZnJvbSAnLi9tYXplcy9zaWRld2luZGVyJztcbmltcG9ydCByZWN1cnNpdmVEaXZpc2lvbiBmcm9tICcuL21hemVzL3JlY3Vyc2l2ZWRpdmlzaW9uJztcblxubGV0IGdyaWRPYmogPSBudWxsO1xuY29uc3QgUk9XUyA9IDI1O1xuY29uc3QgQ09MUyA9IDYxO1xubGV0IHNlbGVjdGVkQWxnb3JpdGhtID0gbnVsbDtcbmxldCBzZWxlY3RlZE1hemUgPSBudWxsO1xuY29uc3QgcnVubmluZyA9IFtmYWxzZV07IC8vIGNoZWNrIGlmIGFsZ29yaXRobSBpcyBjdXJyZW50bHkgcnVubmluZ1xuXG5mdW5jdGlvbiBsb2FkR3JpZCgpIHtcbiAgZ3JpZE9iaiA9IG5ldyBHcmlkKFJPV1MsIENPTFMpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBydW5BU3RhcigpIHtcbiAgY29uc3Qgc3RhcnROb2RlID0gZ3JpZE9iai5zdGFydC5ub2RlO1xuICBjb25zdCBlbmROb2RlID0gZ3JpZE9iai5lbmQubm9kZTtcblxuICB0cnkge1xuICAgIHJ1bm5pbmdbMF0gPSB0cnVlO1xuICAgIGNvbnN0IHBhdGhGb3VuZCA9IGF3YWl0IGFzdGFyKHN0YXJ0Tm9kZSwgZW5kTm9kZSk7XG5cbiAgICBpZiAocGF0aEZvdW5kKSB7XG4gICAgICBjb25zb2xlLmxvZygnZm91bmQgcGF0aCcpO1xuICAgICAgcnVubmluZ1swXSA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygncGF0aCBub3QgZm91bmQnKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5sb2coZXJyb3IpO1xuICB9IGZpbmFsbHkge1xuICAgIHJ1bm5pbmdbMF0gPSBmYWxzZTtcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBydW5EaWprc3RyYSgpIHtcbiAgY29uc3Qgc3RhcnROb2RlID0gZ3JpZE9iai5zdGFydC5ub2RlO1xuICBjb25zdCBlbmROb2RlID0gZ3JpZE9iai5lbmQubm9kZTtcblxuICB0cnkge1xuICAgIHJ1bm5pbmdbMF0gPSB0cnVlO1xuICAgIGNvbnN0IHBhdGhGb3VuZCA9IGF3YWl0IGRpamtzdHJhKGdyaWRPYmouZ3JpZCwgc3RhcnROb2RlLCBlbmROb2RlKTtcblxuICAgIGlmIChwYXRoRm91bmQpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdmb3VuZCBwYXRoJyk7XG4gICAgICBydW5uaW5nWzBdID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCdwYXRoIG5vdCBmb3VuZCcpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gIH0gZmluYWxseSB7XG4gICAgcnVubmluZ1swXSA9IGZhbHNlO1xuICB9XG59XG5cbmNvbnN0IHN0YXJ0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnN0YXJ0LWFsZ29yaXRobScpO1xuXG5zdGFydEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jICgpID0+IHtcbiAgaWYgKHJ1bm5pbmdbMF0pIHJldHVybjsgLy8gYWxnb3JpdGhtIGluIHByb2dyZXNzXG4gIGdyaWRPYmouc2V0QWxsTm9kZU5laWdoYm9ycygpO1xuXG4gIGlmIChncmlkT2JqLnN0YXJ0Lm5vZGUgJiYgZ3JpZE9iai5lbmQubm9kZSkge1xuICAgIGlmIChzZWxlY3RlZEFsZ29yaXRobSA9PT0gJ0EqJykgcnVuQVN0YXIoKTtcbiAgICBpZiAoc2VsZWN0ZWRBbGdvcml0aG0gPT09ICdEaWprc3RyYScpIHJ1bkRpamtzdHJhKCk7XG4gIH1cbn0pO1xuXG5jb25zdCBnZW5lcmF0ZU1hemVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ2VuZXJhdGUtbWF6ZScpO1xuXG5nZW5lcmF0ZU1hemVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoKSA9PiB7XG4gIGlmIChydW5uaW5nWzBdKSByZXR1cm47IC8vIGFsZ29yaXRobSBpbiBwcm9ncmVzc1xuICBydW5uaW5nWzBdID0gdHJ1ZTtcbiAgZ3JpZE9iai5yZXNldEdyaWQoKTtcblxuICBsZXQgZG9uZTtcbiAgaWYgKHNlbGVjdGVkTWF6ZSA9PT0gJ1JhbmRvbSBNYXAnKSB7XG4gICAgZG9uZSA9IGF3YWl0IHJhbmRvbU1hcChncmlkT2JqLmdyaWQpO1xuICB9XG4gIGlmIChzZWxlY3RlZE1hemUgPT09ICdCaW5hcnkgVHJlZScpIHtcbiAgICBkb25lID0gYXdhaXQgYmluYXJ5VHJlZShncmlkT2JqLmdyaWQpO1xuICB9XG4gIGlmIChzZWxlY3RlZE1hemUgPT09ICdTaWRld2luZGVyJykge1xuICAgIGRvbmUgPSBhd2FpdCBzaWRld2luZGVyKGdyaWRPYmouZ3JpZCk7XG4gIH1cbiAgaWYgKHNlbGVjdGVkTWF6ZSA9PT0gJ1JlY3Vyc2l2ZSBEaXZpc2lvbicpIHtcbiAgICBkb25lID0gYXdhaXQgcmVjdXJzaXZlRGl2aXNpb24oZ3JpZE9iai5ncmlkKTtcbiAgfVxuICBpZiAoZG9uZSkgcnVubmluZ1swXSA9IGZhbHNlO1xufSk7XG5cbmZ1bmN0aW9uIGFkZExpc3RlbmVyc1RvQnRucygpIHtcbiAgY29uc3QgZHJvcGRvd25CdXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRyb3Bkb3duLWJ0bicpO1xuICBjb25zdCBkcm9wZG93bkxpc3RzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRyb3Bkb3duLWxpc3QnKTtcbiAgY29uc3QgY2xlYXJCb2FyZEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jbGVhci1ib2FyZCcpO1xuXG4gIGZ1bmN0aW9uIGNsb3NlRHJvcGRvd25zKCkge1xuICAgIGRyb3Bkb3duTGlzdHMuZm9yRWFjaCgobGlzdCkgPT4ge1xuICAgICAgbGlzdC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgfSk7XG4gIH1cblxuICBkcm9wZG93bkJ1dHRvbnMuZm9yRWFjaCgoYnV0dG9uLCBpbmRleCkgPT4ge1xuICAgIGlmIChydW5uaW5nWzBdKSByZXR1cm47IC8vIGFsZ29yaXRobSBpbiBwcm9ncmVzc1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgY29uc3QgY3VycmVudExpc3QgPSBkcm9wZG93bkxpc3RzW2luZGV4XTtcbiAgICAgIGNvbnN0IGlzTGlzdE9wZW4gPSBjdXJyZW50TGlzdC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3cnKTtcblxuICAgICAgY2xvc2VEcm9wZG93bnMoKTtcblxuICAgICAgaWYgKCFpc0xpc3RPcGVuKSB7XG4gICAgICAgIGN1cnJlbnRMaXN0LmNsYXNzTGlzdC50b2dnbGUoJ3Nob3cnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgIGNvbnN0IGlzQ2xpY2tJbnNpZGVEcm9wZG93biA9IEFycmF5LmZyb20oZHJvcGRvd25MaXN0cykuc29tZSgobGlzdCkgPT4gbGlzdC5jb250YWlucyhlLnRhcmdldCkpO1xuXG4gICAgaWYgKCFpc0NsaWNrSW5zaWRlRHJvcGRvd24pIHtcbiAgICAgIGNsb3NlRHJvcGRvd25zKCk7XG4gICAgfVxuICB9KTtcblxuICBkcm9wZG93bkxpc3RzLmZvckVhY2goKGxpc3QsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgbGlzdEl0ZW1zID0gbGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcubGlzdC1zZWxlY3Rpb24nKTtcblxuICAgIGxpc3RJdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgZHJvcGRvd25MaXN0c1tpbmRleF0uY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgICAgICBkcm9wZG93bkJ1dHRvbnNbaW5kZXhdLnRleHRDb250ZW50ID0gaXRlbS50ZXh0Q29udGVudDtcbiAgICAgICAgaWYgKGluZGV4ID09PSAwKSBzZWxlY3RlZEFsZ29yaXRobSA9IGl0ZW0udGV4dENvbnRlbnQ7XG4gICAgICAgIGlmIChpbmRleCA9PT0gMSkgc2VsZWN0ZWRNYXplID0gaXRlbS50ZXh0Q29udGVudDtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBjbGVhckJvYXJkQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGlmIChydW5uaW5nWzBdKSByZXR1cm47IC8vIGFsZ29yaXRobSBpbiBwcm9ncmVzc1xuICAgIGdyaWRPYmoucmVzZXRHcmlkKCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRMaXN0ZW5lcnNUb0dyaWQoKSB7XG4gIGdyaWRPYmouYWRkTGlzdGVuZXJzKHJ1bm5pbmcpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBsb2FkKCkge1xuICBsb2FkR3JpZCgpO1xuICBhZGRMaXN0ZW5lcnNUb0dyaWQoKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgICBhZGRMaXN0ZW5lcnNUb0J0bnMoKTtcbiAgfSk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBiaW5hcnlUcmVlKGdyaWQpIHtcbiAgY29uc3QgZGVsYXkgPSAwLjE7XG5cbiAgZnVuY3Rpb24gY29ubmVjdChub2RlMSwgbm9kZTIsIGJhcnJpZXJCZXR3ZWVuKSB7XG4gICAgbm9kZTEuc2V0Tm9kZVR5cGUoJ2VtcHR5Jyk7XG4gICAgbm9kZTIuc2V0Tm9kZVR5cGUoJ2VtcHR5Jyk7XG4gICAgYmFycmllckJldHdlZW4uc2V0Tm9kZVR5cGUoJ2VtcHR5Jyk7XG4gIH1cblxuICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCBncmlkLmxlbmd0aDsgcm93KyspIHtcbiAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBncmlkW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuICAgICAgZ3JpZFtyb3ddW2NvbF0uc2V0Tm9kZVR5cGUoJ2JhcnJpZXInKTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCBncmlkLmxlbmd0aDsgcm93KyspIHtcbiAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBncmlkW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuICAgICAgaWYgKHJvdyAlIDIgPT09IDAgfHwgY29sICUgMiA9PT0gMCkgY29udGludWU7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuXG4gICAgICBjb25zdCBjdXJyZW50U3F1YXJlID0gZ3JpZFtyb3ddW2NvbF07XG4gICAgICBsZXQgbm9ydGhOZWlnaGJvcjtcbiAgICAgIGxldCB3ZXN0TmVpZ2hib3I7XG5cbiAgICAgIGlmIChyb3cgPiAxKSB7XG4gICAgICAgIG5vcnRoTmVpZ2hib3IgPSBncmlkW3JvdyAtIDJdW2NvbF07IC8vIHVwXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub3J0aE5laWdoYm9yID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbCA+IDEpIHtcbiAgICAgICAgd2VzdE5laWdoYm9yID0gZ3JpZFtyb3ddW2NvbCAtIDJdOyAvLyBsZWZ0XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3ZXN0TmVpZ2hib3IgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAobm9ydGhOZWlnaGJvciAmJiB3ZXN0TmVpZ2hib3IpIHtcbiAgICAgICAgLy8gaWYgYm90aCBwYXRocyBhcmUgYXZhaWxhYmxlXG4gICAgICAgIGNvbnN0IHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpO1xuICAgICAgICBpZiAocmFuZG9tID09PSAwKSB7XG4gICAgICAgICAgY29ubmVjdChjdXJyZW50U3F1YXJlLCBub3J0aE5laWdoYm9yLCBjdXJyZW50U3F1YXJlLm5laWdoYm9yc1szXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29ubmVjdChjdXJyZW50U3F1YXJlLCB3ZXN0TmVpZ2hib3IsIGN1cnJlbnRTcXVhcmUubmVpZ2hib3JzWzFdKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gaWYgb25lIG9mIHRoZSBwYXRocyBnbyBiZXlvbmQgdGhlIGdyaWRcbiAgICAgICAgaWYgKHJvdyA9PT0gMSAmJiBjb2wgPiAxKSB7XG4gICAgICAgICAgY29ubmVjdChjdXJyZW50U3F1YXJlLCB3ZXN0TmVpZ2hib3IsIGN1cnJlbnRTcXVhcmUubmVpZ2hib3JzWzFdKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29sID09PSAxICYmIHJvdyA+IDEpIHtcbiAgICAgICAgICBjb25uZWN0KGN1cnJlbnRTcXVhcmUsIG5vcnRoTmVpZ2hib3IsIGN1cnJlbnRTcXVhcmUubmVpZ2hib3JzWzNdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTsgLy8gbWF6ZSBnZW5lcmF0aW9uIGZpbmlzaGVkXG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByYW5kb21NYXAoZ3JpZCkge1xuICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCBncmlkLmxlbmd0aDsgcm93KyspIHtcbiAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBncmlkW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuICAgICAgY29uc3QgcmFuZG9tID0gTWF0aC5yYW5kb20oKTtcbiAgICAgIGlmIChyYW5kb20gPCAwLjMpIHtcbiAgICAgICAgZ3JpZFtyb3ddW2NvbF0uc2V0Tm9kZVR5cGUoJ2JhcnJpZXInKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7IC8vIG1hemUgZ2VuZXJhdGlvbiBmaW5pc2hlZFxufVxuIiwiZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gcmVjdXJzaXZlRGl2aXNpb24oZ3JpZCkge1xuICBjb25zdCBkZWxheSA9IDU7XG4gIGNvbnN0IHJvd3MgPSBncmlkLmxlbmd0aDtcbiAgY29uc3QgY29scyA9IGdyaWRbMF0ubGVuZ3RoO1xuICBsZXQgaXNGaW5pc2hlZCA9IGZhbHNlOyAvLyBpcyByZWN1cnNpdmUgcHJvY2VzcyBmaW5pc2hlZD9cblxuICBmdW5jdGlvbiByYW5kb21FdmVuKGEsIGIpIHtcbiAgICBjb25zdCByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoYiAtIGEgKyAxKSkgKyBhO1xuICAgIHJldHVybiByYW5kb20gJSAyID09PSAwID8gcmFuZG9tIDogcmFuZG9tICsgMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJhbmRvbU9kZChhLCBiKSB7XG4gICAgY29uc3QgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGIgLSBhICsgMSkpICsgYTtcbiAgICByZXR1cm4gcmFuZG9tICUgMiAhPT0gMCA/IHJhbmRvbSA6IHJhbmRvbSArIDE7XG4gIH1cblxuICBmdW5jdGlvbiBjaG9vc2VPcmllbnRhdGlvbihzdGFydFJvdywgZW5kUm93LCBzdGFydENvbCwgZW5kQ29sKSB7XG4gICAgY29uc3Qgd2lkdGggPSBlbmRDb2wgLSBzdGFydENvbDtcbiAgICBjb25zdCBoZWlnaHQgPSBlbmRSb3cgLSBzdGFydFJvdztcbiAgICBpZiAod2lkdGggPiBoZWlnaHQpIHtcbiAgICAgIHJldHVybiAndmVydGljYWwnO1xuICAgIH0gZWxzZSBpZiAod2lkdGggPCBoZWlnaHQpIHtcbiAgICAgIHJldHVybiAnaG9yaXpvbnRhbCc7XG4gICAgfVxuXG4gICAgY29uc3QgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMik7XG4gICAgcmV0dXJuIHJhbmRvbSA9PT0gMCA/ICdob3Jpem9udGFsJyA6ICd2ZXJ0aWNhbCc7XG4gIH1cblxuICAvLyBzZXQgZWRnZXMgb2YgZ3JpZCBhcyBiYXJyaWVyc1xuICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCByb3dzOyByb3crKykge1xuICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGNvbHM7IGNvbCsrKSB7XG4gICAgICBpZiAocm93ID09PSAwIHx8IHJvdyA9PT0gcm93cyAtIDEgfHwgY29sID09PSAwIHx8IGNvbCA9PT0gY29scyAtIDEpIHtcbiAgICAgICAgZ3JpZFtyb3ddW2NvbF0uc2V0Tm9kZVR5cGUoJ2JhcnJpZXInKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyB0aGUgcmVjdXJzaXZlIGZ1bmN0aW9uIHRvIGRpdmlkZSB0aGUgZ3JpZFxuICBhc3luYyBmdW5jdGlvbiBkaXZpZGUoc3RhcnRSb3csIGVuZFJvdywgc3RhcnRDb2wsIGVuZENvbCkge1xuICAgIGlmIChlbmRDb2wgLSBzdGFydENvbCA8IDEgfHwgZW5kUm93IC0gc3RhcnRSb3cgPCAxKSB7XG4gICAgICAvLyBiYXNlIGNhc2UgaWYgc3ViLW1hemUgaXMgdG9vIHNtYWxsXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgd2FsbFJvdyA9IHJhbmRvbUV2ZW4oc3RhcnRSb3cgKyAxLCBlbmRSb3cgLSAxKTtcbiAgICBjb25zdCB3YWxsQ29sID0gcmFuZG9tRXZlbihzdGFydENvbCArIDEsIGVuZENvbCAtIDEpO1xuXG4gICAgY29uc3QgcGFzc2FnZVJvdyA9IHJhbmRvbU9kZChzdGFydFJvdywgZW5kUm93KTtcbiAgICBjb25zdCBwYXNzYWdlQ29sID0gcmFuZG9tT2RkKHN0YXJ0Q29sLCBlbmRDb2wpO1xuXG4gICAgY29uc3Qgb3JpZW50YXRpb24gPSBjaG9vc2VPcmllbnRhdGlvbihzdGFydFJvdywgZW5kUm93LCBzdGFydENvbCwgZW5kQ29sKTtcblxuICAgIGlmIChvcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAvLyBtYWtlIGEgaG9yaXpvbnRhbCB3YWxsXG4gICAgICBmb3IgKGxldCBjb2wgPSBzdGFydENvbDsgY29sIDw9IGVuZENvbDsgY29sKyspIHtcbiAgICAgICAgaWYgKGNvbCAhPT0gcGFzc2FnZUNvbCkge1xuICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG4gICAgICAgICAgZ3JpZFt3YWxsUm93XVtjb2xdLnNldE5vZGVUeXBlKCdiYXJyaWVyJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgICAvLyBtYWtlIGEgdmVydGljYWwgd2FsbFxuICAgICAgZm9yIChsZXQgcm93ID0gc3RhcnRSb3c7IHJvdyA8PSBlbmRSb3c7IHJvdysrKSB7XG4gICAgICAgIGlmIChyb3cgIT09IHBhc3NhZ2VSb3cpIHtcbiAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBkZWxheSkpO1xuICAgICAgICAgIGdyaWRbcm93XVt3YWxsQ29sXS5zZXROb2RlVHlwZSgnYmFycmllcicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgIGF3YWl0IGRpdmlkZShzdGFydFJvdywgd2FsbFJvdyAtIDEsIHN0YXJ0Q29sLCBlbmRDb2wpO1xuICAgICAgYXdhaXQgZGl2aWRlKHdhbGxSb3cgKyAxLCBlbmRSb3csIHN0YXJ0Q29sLCBlbmRDb2wpO1xuICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgIGF3YWl0IGRpdmlkZShzdGFydFJvdywgZW5kUm93LCB3YWxsQ29sICsgMSwgZW5kQ29sKTtcbiAgICAgIGF3YWl0IGRpdmlkZShzdGFydFJvdywgZW5kUm93LCBzdGFydENvbCwgd2FsbENvbCAtIDEpO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIHRoaXMgaXMgdGhlIGxhc3QgcmVjdXJzaXZlIGNhbGxcbiAgICBpZiAoc3RhcnRSb3cgPT09IDEgJiYgZW5kUm93ID09PSByb3dzIC0gMiAmJiBzdGFydENvbCA9PT0gMSAmJiBlbmRDb2wgPT09IGNvbHMgLSAyKSB7XG4gICAgICBpc0ZpbmlzaGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBhd2FpdCBkaXZpZGUoMSwgcm93cyAtIDIsIDEsIGNvbHMgLSAyKTtcblxuICByZXR1cm4gaXNGaW5pc2hlZDsgLy8gbWF6ZSBnZW5lcmF0aW9uIGZpbmlzaGVkXG59XG4iLCJleHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBzaWRld2luZGVyKGdyaWQpIHtcbiAgY29uc3QgZGVsYXkgPSAwLjE7XG4gIGNvbnN0IHJvd3MgPSBncmlkLmxlbmd0aDtcbiAgY29uc3QgY29scyA9IGdyaWRbMF0ubGVuZ3RoO1xuXG4gIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHJvd3M7IHJvdysrKSB7XG4gICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgY29sczsgY29sKyspIHtcbiAgICAgIGlmIChyb3cgPT09IDEgJiYgY29sICE9PSAwICYmIGNvbCAhPT0gY29scyAtIDEpIGNvbnRpbnVlO1xuICAgICAgaWYgKGNvbCAlIDIgPT09IDApIHtcbiAgICAgICAgZ3JpZFtyb3ddW2NvbF0uc2V0Tm9kZVR5cGUoJ2JhcnJpZXInKTtcbiAgICAgIH1cbiAgICAgIGlmIChyb3cgJSAyID09PSAwKSB7XG4gICAgICAgIGdyaWRbcm93XVtjb2xdLnNldE5vZGVUeXBlKCdiYXJyaWVyJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZm9yIChsZXQgcm93ID0gMTsgcm93IDwgcm93czsgcm93KyspIHtcbiAgICBsZXQgcnVuID0gW107XG4gICAgZm9yIChsZXQgY29sID0gMTsgY29sIDwgY29sczsgY29sICs9IDIpIHtcbiAgICAgIGlmIChyb3cgJSAyID09PSAwKSBjb250aW51ZTtcblxuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgZGVsYXkpKTtcbiAgICAgIGlmIChyb3cgPT09IDEpIHtcbiAgICAgICAgZ3JpZFtyb3ddW2NvbF0uc2V0Tm9kZVR5cGUoJ2VtcHR5Jyk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjdXJyZW50Tm9kZSA9IGdyaWRbcm93XVtjb2xdO1xuICAgICAgcnVuLnB1c2goY3VycmVudE5vZGUpO1xuXG4gICAgICBpZiAoY29sIDwgY29scyAtIDEpIHtcbiAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPCAwLjYgJiYgY29sICE9PSBjb2xzIC0gMikge1xuICAgICAgICAgIGN1cnJlbnROb2RlLm5laWdoYm9yc1swXS5zZXROb2RlVHlwZSgnZW1wdHknKTtcbiAgICAgICAgfSBlbHNlIGlmIChydW4ubGVuZ3RoID4gMCAmJiByb3cgPiAxKSB7XG4gICAgICAgICAgY29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBydW4ubGVuZ3RoKTtcbiAgICAgICAgICBydW5bcmFuZG9tSW5kZXhdLm5laWdoYm9yc1szXS5zZXROb2RlVHlwZSgnZW1wdHknKTtcbiAgICAgICAgICBydW4gPSBbXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTsgLy8gbWF6ZSBnZW5lcmF0aW9uIGZpbmlzaGVkXG59XG4iLCJpbXBvcnQgRG9tSGFuZGxlciBmcm9tICcuL2RvbWhhbmRsZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb2RlIHtcbiAgY29uc3RydWN0b3Iocm93LCBjb2wsIGdyaWQpIHtcbiAgICB0aGlzLm5vZGVXaWR0aCA9IDMwOyAvLyBweCB3aWR0aCBhbmQgaGVpZ2h0IG9mIHNxdWFyZVxuICAgIHRoaXMudG90YWxSb3dzID0gMjU7XG4gICAgdGhpcy50b3RhbENvbHMgPSA2MDtcbiAgICB0aGlzLnJvdyA9IHJvdztcbiAgICB0aGlzLmNvbCA9IGNvbDtcbiAgICB0aGlzLnkgPSB0aGlzLnJvdyAqIHRoaXMubm9kZVdpZHRoO1xuICAgIHRoaXMueCA9IHRoaXMuY29sICogdGhpcy5ub2RlV2lkdGg7XG4gICAgdGhpcy5ub2RlVHlwZSA9ICdlbXB0eSc7IC8vIHVzZWQgdG8gdXBkYXRlIHNxdWFyZSBkaXNwbGF5IG9uIGRvbSBlLmcgc3RhcnQsIGVuZCBvciBiYXJyaWVyXG4gICAgdGhpcy5uZWlnaGJvcnMgPSBbXTtcbiAgICB0aGlzLnByZXZpb3VzTm9kZSA9IG51bGw7XG4gICAgdGhpcy5ncmlkID0gZ3JpZDtcblxuICAgIC8vIGFzdGFyIHNjb3Jlc1xuICAgIHRoaXMuZiA9IDA7XG4gICAgdGhpcy5nID0gMDtcbiAgICB0aGlzLmggPSAwO1xuICB9XG5cbiAgc2V0Tm9kZVR5cGUobmV3Tm9kZVR5cGUpIHtcbiAgICB0aGlzLm5vZGVUeXBlID0gbmV3Tm9kZVR5cGU7XG4gICAgRG9tSGFuZGxlci5kaXNwbGF5QWxnb3JpdGhtKHRoaXMsIHRoaXMuZ3JpZCk7XG4gIH1cblxuICAvLyBjYWxjIGYsIGcgYW5kIGggc2NvcmVzXG4gIGNhbGNTY29yZXMoc3RhcnROb2RlLCBlbmROb2RlKSB7XG4gICAgdGhpcy5nID0gTWF0aC5hYnModGhpcy54IC0gc3RhcnROb2RlLngpICsgTWF0aC5hYnModGhpcy55IC0gc3RhcnROb2RlLnkpO1xuICAgIHRoaXMuaCA9IE1hdGguYWJzKHRoaXMueCAtIGVuZE5vZGUueCkgKyBNYXRoLmFicyh0aGlzLnkgLSBlbmROb2RlLnkpO1xuICAgIHRoaXMuZiA9IHRoaXMuZyArIHRoaXMuaDtcbiAgICByZXR1cm4gdGhpcy5mO1xuICB9XG5cbiAgc2V0TmVpZ2hib3JzKGdyaWQpIHtcbiAgICBjb25zdCB0ZW1wUm93ID0gdGhpcy5yb3cgLSAxO1xuICAgIGNvbnN0IHRlbXBDb2wgPSB0aGlzLmNvbCAtIDE7XG5cbiAgICBpZiAodGVtcENvbCA8IHRoaXMudG90YWxDb2xzKSB7XG4gICAgICAvLyByaWdodFxuICAgICAgdGhpcy5uZWlnaGJvcnMucHVzaChncmlkW3RlbXBSb3ddW3RlbXBDb2wgKyAxXSk7XG4gICAgfVxuXG4gICAgaWYgKHRlbXBDb2wgPiAwKSB7XG4gICAgICAvLyBsZWZ0XG4gICAgICB0aGlzLm5laWdoYm9ycy5wdXNoKGdyaWRbdGVtcFJvd11bdGVtcENvbCAtIDFdKTtcbiAgICB9XG5cbiAgICBpZiAodGVtcFJvdyA8IHRoaXMudG90YWxSb3dzIC0gMSkge1xuICAgICAgLy8gZG93blxuICAgICAgdGhpcy5uZWlnaGJvcnMucHVzaChncmlkW3RlbXBSb3cgKyAxXVt0ZW1wQ29sXSk7XG4gICAgfVxuXG4gICAgaWYgKHRlbXBSb3cgPiAwKSB7XG4gICAgICAvLyB1cFxuICAgICAgdGhpcy5uZWlnaGJvcnMucHVzaChncmlkW3RlbXBSb3cgLSAxXVt0ZW1wQ29sXSk7XG4gICAgfVxuICB9XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCAnLi9zY3NzL21haW4uc2Nzcyc7XG5pbXBvcnQgbG9hZCBmcm9tICcuL21haW5sb29wJztcblxubG9hZCgpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9