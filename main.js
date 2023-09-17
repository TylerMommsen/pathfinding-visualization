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
function updateSquare(grid, row, col, start, end, gridSquare) {
  const startNode = start.node;
  const endNode = end.node;
  const gridNode = grid[row][col];
  if (
    gridNode.nodeType !== 'start' &&
    gridNode.nodeType !== 'end' &&
    gridNode.nodeType !== 'barrier'
  ) {
    if (startNode === null) {
      gridSquare.classList.add('start');
    } else if (endNode === null) {
      gridSquare.classList.add('end');
    } else {
      gridSquare.classList.add('barrier');
    }
  }
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

  setSquareStatus(row, col) {
    if (this.start.node === null) {
      this.grid[row][col].nodeType = 'start';
      this.start.node = this.grid[row][col];
    } else if (this.end.node === null) {
      this.grid[row][col].nodeType = 'end';
      this.end.node = this.grid[row][col];
    } else {
      this.grid[row][col].nodeType = 'barrier';
    }
  }

  handleMouseDown(gridSquare, row, col) {
    this.isDragging = true;
    _domhandler__WEBPACK_IMPORTED_MODULE_1__["default"].updateSquare(this.grid, row, col, this.start, this.end, gridSquare);
    this.setSquareStatus(row, col);
  }

  handleMouseMove(gridSquare, row, col) {
    if (this.isDragging) {
      _domhandler__WEBPACK_IMPORTED_MODULE_1__["default"].updateSquare(this.grid, row, col, this.start, this.end, gridSquare);
      this.setSquareStatus(row, col);
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
const running = [false]; // check whether an algorithm is currently running

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

generateMazeBtn.addEventListener('click', () => {
  if (running[0]) return; // algorithm in progress
  gridObj.resetGrid();

  if (selectedMaze === 'Random Map') (0,_mazes_randommap__WEBPACK_IMPORTED_MODULE_3__["default"])(gridObj.grid);
  if (selectedMaze === 'Binary Tree') (0,_mazes_binarytree__WEBPACK_IMPORTED_MODULE_4__["default"])(gridObj.grid);
  if (selectedMaze === 'Sidewinder') (0,_mazes_sidewinder__WEBPACK_IMPORTED_MODULE_5__["default"])(gridObj.grid);
  if (selectedMaze === 'Recursive Division') (0,_mazes_recursivedivision__WEBPACK_IMPORTED_MODULE_6__["default"])(gridObj.grid);
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
function recursiveDivision(grid) {
  const rows = grid.length;
  const cols = grid[0].length;

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
  function divide(startRow, endRow, startCol, endCol) {
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
          grid[wallRow][col].setNodeType('barrier');
        }
      }
    } else if (orientation === 'vertical') {
      // make a vertical wall
      for (let row = startRow; row <= endRow; row++) {
        if (row !== passageRow) {
          grid[row][wallCol].setNodeType('barrier');
        }
      }
    }

    if (orientation === 'horizontal') {
      divide(startRow, wallRow - 1, startCol, endCol);
      divide(wallRow + 1, endRow, startCol, endCol);
    } else if (orientation === 'vertical') {
      divide(startRow, endRow, wallCol + 1, endCol);
      divide(startRow, endRow, startCol, wallCol - 1);
    }
  }

  divide(1, rows - 2, 1, cols - 2);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QzdEOzs7Ozs7Ozs7Ozs7O0FDTjBCO0FBQ0k7O0FBRTlCLHFEQUFJIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9zY3NzL21haW4uc2NzcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL2FsZ29yaXRobXMvYXN0YXIuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9hbGdvcml0aG1zL2RpamtzdHJhLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvZG9taGFuZGxlci5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL2dyaWQuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9tYWlubG9vcC5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL21hemVzL2JpbmFyeXRyZWUuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9tYXplcy9yYW5kb21tYXAuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9tYXplcy9yZWN1cnNpdmVkaXZpc2lvbi5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL21hemVzL3NpZGV3aW5kZXIuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9ub2RlLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFzdGFyKHN0YXJ0Tm9kZSwgZW5kTm9kZSkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBjb25zdCBvcGVuTGlzdCA9IFtdO1xuICAgIGNvbnN0IGNsb3NlZExpc3QgPSBbXTtcbiAgICBjb25zdCBmaW5hbFBhdGggPSBbXTtcbiAgICBsZXQgYW5pbWF0aW9uRnJhbWVJZCA9IG51bGw7XG5cbiAgICBmdW5jdGlvbiByZW1vdmVGcm9tQXJyKG5vZGUpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3Blbkxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKG9wZW5MaXN0W2ldID09PSBub2RlKSB7XG4gICAgICAgICAgb3Blbkxpc3Quc3BsaWNlKGksIDEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgb3Blbkxpc3QucHVzaChzdGFydE5vZGUpO1xuICAgIHN0YXJ0Tm9kZS5zZXROb2RlVHlwZSgnb3Blbi1saXN0Jyk7XG4gICAgZnVuY3Rpb24gYWxnb3JpdGhtKCkge1xuICAgICAgbGV0IGN1cnJlbnROb2RlID0gbnVsbDtcbiAgICAgIGxldCBsb3dlc3RGID0gSW5maW5pdHk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wZW5MaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG9wZW5MaXN0W2ldLmNhbGNTY29yZXMoc3RhcnROb2RlLCBlbmROb2RlKTtcbiAgICAgICAgaWYgKG9wZW5MaXN0W2ldLmYgPCBsb3dlc3RGKSB7XG4gICAgICAgICAgbG93ZXN0RiA9IG9wZW5MaXN0W2ldLmY7XG4gICAgICAgICAgY3VycmVudE5vZGUgPSBvcGVuTGlzdFtpXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoY3VycmVudE5vZGUgPT09IGVuZE5vZGUpIHtcbiAgICAgICAgbGV0IHRlbXAgPSBjdXJyZW50Tm9kZTtcbiAgICAgICAgZmluYWxQYXRoLnB1c2godGVtcCk7XG4gICAgICAgIHRlbXAuc2V0Tm9kZVR5cGUoJ2ZpbmFsLXBhdGgnKTtcbiAgICAgICAgd2hpbGUgKHRlbXAucHJldmlvdXNOb2RlKSB7XG4gICAgICAgICAgZmluYWxQYXRoLnB1c2godGVtcC5wcmV2aW91c05vZGUpO1xuICAgICAgICAgIHRlbXAucHJldmlvdXNOb2RlLnNldE5vZGVUeXBlKCdmaW5hbC1wYXRoJyk7XG4gICAgICAgICAgdGVtcCA9IHRlbXAucHJldmlvdXNOb2RlO1xuICAgICAgICB9XG4gICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY2xvc2VkTGlzdC5wdXNoKGN1cnJlbnROb2RlKTtcbiAgICAgIGN1cnJlbnROb2RlLnNldE5vZGVUeXBlKCdjbG9zZWQtbGlzdCcpO1xuICAgICAgcmVtb3ZlRnJvbUFycihjdXJyZW50Tm9kZSk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudE5vZGUubmVpZ2hib3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGN1cnJOZWlnaGJvciA9IGN1cnJlbnROb2RlLm5laWdoYm9yc1tpXTtcblxuICAgICAgICBpZiAoY3Vyck5laWdoYm9yLm5vZGVUeXBlICE9PSAnYmFycmllcicgJiYgIWNsb3NlZExpc3QuaW5jbHVkZXMoY3Vyck5laWdoYm9yKSkge1xuICAgICAgICAgIGNvbnN0IHRlbXBHID0gY3VycmVudE5vZGUuZyArIDE7XG4gICAgICAgICAgaWYgKG9wZW5MaXN0LmluY2x1ZGVzKGN1cnJOZWlnaGJvcikpIHtcbiAgICAgICAgICAgIGlmICh0ZW1wRyA8IGN1cnJOZWlnaGJvci5nKSB7XG4gICAgICAgICAgICAgIGN1cnJOZWlnaGJvci5nID0gdGVtcEc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGN1cnJOZWlnaGJvci5nID0gdGVtcEc7XG4gICAgICAgICAgICBvcGVuTGlzdC5wdXNoKGN1cnJOZWlnaGJvcik7XG4gICAgICAgICAgICBjdXJyTmVpZ2hib3Iuc2V0Tm9kZVR5cGUoJ29wZW4tbGlzdCcpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGN1cnJOZWlnaGJvci5wcmV2aW91c05vZGUgPSBjdXJyZW50Tm9kZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAob3Blbkxpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICBhbmltYXRpb25GcmFtZUlkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFsZ29yaXRobSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhbGdvcml0aG0oKTtcbiAgfSk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkaWprc3RyYShncmlkLCBzdGFydE5vZGUsIGVuZE5vZGUpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgY29uc3Qgb3Blbkxpc3RRdWV1ZSA9IFtdOyAvLyB0cmFja3Mgbm9kZXMgdG8gdmlzaXRcbiAgICBjb25zdCBjbG9zZWRMaXN0ID0gW107XG4gICAgY29uc3QgZmluYWxQYXRoID0gW107XG4gICAgbGV0IGFuaW1hdGlvbkZyYW1lSWQgPSBudWxsO1xuXG4gICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgZ3JpZC5sZW5ndGg7IHJvdysrKSB7XG4gICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBncmlkW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuICAgICAgICBncmlkW3Jvd11bY29sXS5nID0gSW5maW5pdHk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc3RhcnROb2RlLmcgPSAwO1xuICAgIG9wZW5MaXN0UXVldWUucHVzaChzdGFydE5vZGUpO1xuICAgIHN0YXJ0Tm9kZS5zZXROb2RlVHlwZSgnb3Blbi1saXN0Jyk7XG5cbiAgICBmdW5jdGlvbiBhbGdvcml0aG0oKSB7XG4gICAgICBjb25zdCBjdXJyZW50Tm9kZSA9IG9wZW5MaXN0UXVldWUuc2hpZnQoKTtcbiAgICAgIGN1cnJlbnROb2RlLnNldE5vZGVUeXBlKCdjbG9zZWQtbGlzdCcpO1xuXG4gICAgICBpZiAoY3VycmVudE5vZGUgPT09IGVuZE5vZGUpIHtcbiAgICAgICAgbGV0IHRlbXAgPSBjdXJyZW50Tm9kZTtcbiAgICAgICAgZmluYWxQYXRoLnB1c2godGVtcCk7XG4gICAgICAgIHRlbXAuc2V0Tm9kZVR5cGUoJ2ZpbmFsLXBhdGgnKTtcbiAgICAgICAgd2hpbGUgKHRlbXAucHJldmlvdXNOb2RlKSB7XG4gICAgICAgICAgZmluYWxQYXRoLnB1c2godGVtcC5wcmV2aW91c05vZGUpO1xuICAgICAgICAgIHRlbXAucHJldmlvdXNOb2RlLnNldE5vZGVUeXBlKCdmaW5hbC1wYXRoJyk7XG4gICAgICAgICAgdGVtcCA9IHRlbXAucHJldmlvdXNOb2RlO1xuICAgICAgICB9XG4gICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50Tm9kZS5uZWlnaGJvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgY3Vyck5laWdoYm9yID0gY3VycmVudE5vZGUubmVpZ2hib3JzW2ldO1xuXG4gICAgICAgIGlmIChjdXJyTmVpZ2hib3Iubm9kZVR5cGUgIT09ICdiYXJyaWVyJyAmJiAhY2xvc2VkTGlzdC5pbmNsdWRlcyhjdXJyTmVpZ2hib3IpKSB7XG4gICAgICAgICAgaWYgKGN1cnJOZWlnaGJvci5nID09PSBJbmZpbml0eSkge1xuICAgICAgICAgICAgY3Vyck5laWdoYm9yLmcgPSBjdXJyZW50Tm9kZS5nICsgMTtcbiAgICAgICAgICAgIGN1cnJOZWlnaGJvci5wcmV2aW91c05vZGUgPSBjdXJyZW50Tm9kZTtcbiAgICAgICAgICAgIG9wZW5MaXN0UXVldWUucHVzaChjdXJyTmVpZ2hib3IpO1xuICAgICAgICAgICAgY3Vyck5laWdoYm9yLnNldE5vZGVUeXBlKCdvcGVuLWxpc3QnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG9wZW5MaXN0UXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICBhbmltYXRpb25GcmFtZUlkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFsZ29yaXRobSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhbGdvcml0aG0oKTtcbiAgfSk7XG59XG4iLCJmdW5jdGlvbiB1cGRhdGVTcXVhcmUoZ3JpZCwgcm93LCBjb2wsIHN0YXJ0LCBlbmQsIGdyaWRTcXVhcmUpIHtcbiAgY29uc3Qgc3RhcnROb2RlID0gc3RhcnQubm9kZTtcbiAgY29uc3QgZW5kTm9kZSA9IGVuZC5ub2RlO1xuICBjb25zdCBncmlkTm9kZSA9IGdyaWRbcm93XVtjb2xdO1xuICBpZiAoXG4gICAgZ3JpZE5vZGUubm9kZVR5cGUgIT09ICdzdGFydCcgJiZcbiAgICBncmlkTm9kZS5ub2RlVHlwZSAhPT0gJ2VuZCcgJiZcbiAgICBncmlkTm9kZS5ub2RlVHlwZSAhPT0gJ2JhcnJpZXInXG4gICkge1xuICAgIGlmIChzdGFydE5vZGUgPT09IG51bGwpIHtcbiAgICAgIGdyaWRTcXVhcmUuY2xhc3NMaXN0LmFkZCgnc3RhcnQnKTtcbiAgICB9IGVsc2UgaWYgKGVuZE5vZGUgPT09IG51bGwpIHtcbiAgICAgIGdyaWRTcXVhcmUuY2xhc3NMaXN0LmFkZCgnZW5kJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdyaWRTcXVhcmUuY2xhc3NMaXN0LmFkZCgnYmFycmllcicpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBkaXNwbGF5QWxnb3JpdGhtKG5vZGUsIGdyaWQpIHtcbiAgY29uc3QgZG9tU3F1YXJlID0gZ3JpZC5maW5kRG9tU3F1YXJlKG5vZGUucm93IC0gMSwgbm9kZS5jb2wgLSAxKTtcbiAgZG9tU3F1YXJlLnJlbW92ZUF0dHJpYnV0ZSgnY2xhc3MnKTtcbiAgZG9tU3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2dyaWQtc3F1YXJlJyk7XG4gIGRvbVNxdWFyZS5jbGFzc0xpc3QuYWRkKG5vZGUubm9kZVR5cGUpO1xufVxuXG5mdW5jdGlvbiBkaXNwbGF5R3JpZChncmlkKSB7XG4gIGNvbnN0IGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ3JpZC1jb250YWluZXInKTtcbiAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgZ3JpZC5sZW5ndGg7IHJvdysrKSB7XG4gICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgZ3JpZFtyb3ddLmxlbmd0aDsgY29sKyspIHtcbiAgICAgIGNvbnN0IGdyaWRTcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGdyaWRTcXVhcmUuY2xhc3NMaXN0LmFkZCgnZ3JpZC1zcXVhcmUnKTtcbiAgICAgIGdyaWRTcXVhcmUuY2xhc3NMaXN0LmFkZCgnZW1wdHknKTtcbiAgICAgIGdyaWRDb250YWluZXIuYXBwZW5kQ2hpbGQoZ3JpZFNxdWFyZSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHJlc2V0R3JpZCgpIHtcbiAgY29uc3QgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ncmlkLWNvbnRhaW5lcicpO1xuICBjb25zdCBncmlkQ29udGFpbmVyQ2hpbGRyZW4gPSBncmlkQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5ncmlkLXNxdWFyZScpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JpZENvbnRhaW5lckNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgZ3JpZENvbnRhaW5lckNoaWxkcmVuW2ldLnJlbW92ZUF0dHJpYnV0ZSgnY2xhc3MnKTtcbiAgICBncmlkQ29udGFpbmVyQ2hpbGRyZW5baV0uY2xhc3NMaXN0LmFkZCgnZ3JpZC1zcXVhcmUnKTtcbiAgICBncmlkQ29udGFpbmVyQ2hpbGRyZW5baV0uY2xhc3NMaXN0LmFkZCgnZW1wdHknKTtcbiAgfVxufVxuXG5jb25zdCBEb21IYW5kbGVyID0ge1xuICBkaXNwbGF5R3JpZCxcbiAgdXBkYXRlU3F1YXJlLFxuICBkaXNwbGF5QWxnb3JpdGhtLFxuICByZXNldEdyaWQsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBEb21IYW5kbGVyO1xuIiwiaW1wb3J0IE5vZGUgZnJvbSAnLi9ub2RlJztcbmltcG9ydCBEb21IYW5kbGVyIGZyb20gJy4vZG9taGFuZGxlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyaWQge1xuICBjb25zdHJ1Y3Rvcihyb3dzLCBjb2xzKSB7XG4gICAgdGhpcy5yb3dzID0gcm93cztcbiAgICB0aGlzLmNvbHMgPSBjb2xzO1xuICAgIHRoaXMuc3RhcnQgPSB7IG5vZGU6IG51bGwgfTtcbiAgICB0aGlzLmVuZCA9IHsgbm9kZTogbnVsbCB9O1xuICAgIHRoaXMuZ3JpZCA9IFtdO1xuICAgIHRoaXMub3Blbkxpc3QgPSBbXTtcbiAgICB0aGlzLmNsb3NlZExpc3QgPSBbXTtcbiAgICB0aGlzLmZpbmFsUGF0aCA9IFtdO1xuICAgIHRoaXMuY3JlYXRlR3JpZCh0aGlzLnJvd3MsIHRoaXMuY29scyk7XG5cbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIHNldFNxdWFyZVN0YXR1cyhyb3csIGNvbCkge1xuICAgIGlmICh0aGlzLnN0YXJ0Lm5vZGUgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuZ3JpZFtyb3ddW2NvbF0ubm9kZVR5cGUgPSAnc3RhcnQnO1xuICAgICAgdGhpcy5zdGFydC5ub2RlID0gdGhpcy5ncmlkW3Jvd11bY29sXTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZW5kLm5vZGUgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuZ3JpZFtyb3ddW2NvbF0ubm9kZVR5cGUgPSAnZW5kJztcbiAgICAgIHRoaXMuZW5kLm5vZGUgPSB0aGlzLmdyaWRbcm93XVtjb2xdO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmdyaWRbcm93XVtjb2xdLm5vZGVUeXBlID0gJ2JhcnJpZXInO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZU1vdXNlRG93bihncmlkU3F1YXJlLCByb3csIGNvbCkge1xuICAgIHRoaXMuaXNEcmFnZ2luZyA9IHRydWU7XG4gICAgRG9tSGFuZGxlci51cGRhdGVTcXVhcmUodGhpcy5ncmlkLCByb3csIGNvbCwgdGhpcy5zdGFydCwgdGhpcy5lbmQsIGdyaWRTcXVhcmUpO1xuICAgIHRoaXMuc2V0U3F1YXJlU3RhdHVzKHJvdywgY29sKTtcbiAgfVxuXG4gIGhhbmRsZU1vdXNlTW92ZShncmlkU3F1YXJlLCByb3csIGNvbCkge1xuICAgIGlmICh0aGlzLmlzRHJhZ2dpbmcpIHtcbiAgICAgIERvbUhhbmRsZXIudXBkYXRlU3F1YXJlKHRoaXMuZ3JpZCwgcm93LCBjb2wsIHRoaXMuc3RhcnQsIHRoaXMuZW5kLCBncmlkU3F1YXJlKTtcbiAgICAgIHRoaXMuc2V0U3F1YXJlU3RhdHVzKHJvdywgY29sKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVNb3VzZVVwKCkge1xuICAgIHRoaXMuaXNEcmFnZ2luZyA9IGZhbHNlO1xuICB9XG5cbiAgZmluZERvbVNxdWFyZShyb3csIGNvbCkge1xuICAgIGNvbnN0IGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ3JpZC1jb250YWluZXInKTtcbiAgICBjb25zdCBncmlkQ29udGFpbmVyQ2hpbGRyZW4gPSBncmlkQ29udGFpbmVyLmNoaWxkcmVuO1xuICAgIGNvbnN0IGluZGV4ID0gcm93ICogdGhpcy5jb2xzICsgY29sO1xuICAgIHJldHVybiBncmlkQ29udGFpbmVyQ2hpbGRyZW5baW5kZXhdO1xuICB9XG5cbiAgYWRkTGlzdGVuZXJzKGN1cnJlbnRseVJ1bm5pbmcpIHtcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLmdyaWQubGVuZ3RoOyByb3crKykge1xuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgdGhpcy5ncmlkW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuICAgICAgICBjb25zdCBncmlkU3F1YXJlID0gdGhpcy5maW5kRG9tU3F1YXJlKHJvdywgY29sKTtcbiAgICAgICAgZ3JpZFNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoKSA9PiB7XG4gICAgICAgICAgaWYgKGN1cnJlbnRseVJ1bm5pbmdbMF0pIHJldHVybjtcbiAgICAgICAgICB0aGlzLmhhbmRsZU1vdXNlRG93bihncmlkU3F1YXJlLCByb3csIGNvbCk7XG4gICAgICAgIH0pO1xuICAgICAgICBncmlkU3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsICgpID0+IHtcbiAgICAgICAgICBpZiAoY3VycmVudGx5UnVubmluZ1swXSkgcmV0dXJuO1xuICAgICAgICAgIHRoaXMuaGFuZGxlTW91c2VNb3ZlKGdyaWRTcXVhcmUsIHJvdywgY29sKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsICgpID0+IHtcbiAgICAgIHRoaXMuaGFuZGxlTW91c2VVcCgpO1xuICAgIH0pO1xuICB9XG5cbiAgY3JlYXRlR3JpZChyb3dzLCBjb2xzKSB7XG4gICAgZm9yIChsZXQgcm93ID0gMTsgcm93IDw9IHJvd3M7IHJvdysrKSB7XG4gICAgICBjb25zdCBjdXJyZW50Um93ID0gW107XG4gICAgICBmb3IgKGxldCBjb2wgPSAxOyBjb2wgPD0gY29sczsgY29sKyspIHtcbiAgICAgICAgY3VycmVudFJvdy5wdXNoKG5ldyBOb2RlKHJvdywgY29sLCB0aGlzKSk7XG4gICAgICB9XG4gICAgICB0aGlzLmdyaWQucHVzaChjdXJyZW50Um93KTtcbiAgICB9XG4gICAgRG9tSGFuZGxlci5kaXNwbGF5R3JpZCh0aGlzLmdyaWQpO1xuICB9XG5cbiAgc2V0QWxsTm9kZU5laWdoYm9ycygpIHtcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLmdyaWQubGVuZ3RoOyByb3crKykge1xuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgdGhpcy5ncmlkW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuICAgICAgICB0aGlzLmdyaWRbcm93XVtjb2xdLnNldE5laWdoYm9ycyh0aGlzLmdyaWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlc2V0R3JpZCgpIHtcbiAgICAvLyBjcmVhdGluZyBuZXcgZ3JpZFxuICAgIHRoaXMuZ3JpZCA9IFtdO1xuICAgIGZvciAobGV0IHJvdyA9IDE7IHJvdyA8PSB0aGlzLnJvd3M7IHJvdysrKSB7XG4gICAgICBjb25zdCBjdXJyZW50Um93ID0gW107XG4gICAgICBmb3IgKGxldCBjb2wgPSAxOyBjb2wgPD0gdGhpcy5jb2xzOyBjb2wrKykge1xuICAgICAgICBjdXJyZW50Um93LnB1c2gobmV3IE5vZGUocm93LCBjb2wsIHRoaXMpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZ3JpZC5wdXNoKGN1cnJlbnRSb3cpO1xuICAgIH1cblxuICAgIC8vIHNldHRpbmcgbmVpZ2hib3VycyBhZ2FpblxuICAgIHRoaXMuc2V0QWxsTm9kZU5laWdoYm9ycygpO1xuXG4gICAgLy8gcmVzZXR0aW5nIHN0YXJ0IGFuZCBlbmQgbm9kZVxuICAgIHRoaXMuc3RhcnQubm9kZSA9IG51bGw7XG4gICAgdGhpcy5lbmQubm9kZSA9IG51bGw7XG5cbiAgICAvLyByZXNldGluZyBkb20gc3F1YXJlc1xuICAgIERvbUhhbmRsZXIucmVzZXRHcmlkKCk7XG4gIH1cbn1cbiIsImltcG9ydCBHcmlkIGZyb20gJy4vZ3JpZCc7XG5pbXBvcnQgYXN0YXIgZnJvbSAnLi9hbGdvcml0aG1zL2FzdGFyJztcbmltcG9ydCBkaWprc3RyYSBmcm9tICcuL2FsZ29yaXRobXMvZGlqa3N0cmEnO1xuaW1wb3J0IHJhbmRvbU1hcCBmcm9tICcuL21hemVzL3JhbmRvbW1hcCc7XG5pbXBvcnQgYmluYXJ5VHJlZSBmcm9tICcuL21hemVzL2JpbmFyeXRyZWUnO1xuaW1wb3J0IHNpZGV3aW5kZXIgZnJvbSAnLi9tYXplcy9zaWRld2luZGVyJztcbmltcG9ydCByZWN1cnNpdmVEaXZpc2lvbiBmcm9tICcuL21hemVzL3JlY3Vyc2l2ZWRpdmlzaW9uJztcblxubGV0IGdyaWRPYmogPSBudWxsO1xuY29uc3QgUk9XUyA9IDI1O1xuY29uc3QgQ09MUyA9IDYxO1xubGV0IHNlbGVjdGVkQWxnb3JpdGhtID0gbnVsbDtcbmxldCBzZWxlY3RlZE1hemUgPSBudWxsO1xuY29uc3QgcnVubmluZyA9IFtmYWxzZV07IC8vIGNoZWNrIHdoZXRoZXIgYW4gYWxnb3JpdGhtIGlzIGN1cnJlbnRseSBydW5uaW5nXG5cbmZ1bmN0aW9uIGxvYWRHcmlkKCkge1xuICBncmlkT2JqID0gbmV3IEdyaWQoUk9XUywgQ09MUyk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJ1bkFTdGFyKCkge1xuICBjb25zdCBzdGFydE5vZGUgPSBncmlkT2JqLnN0YXJ0Lm5vZGU7XG4gIGNvbnN0IGVuZE5vZGUgPSBncmlkT2JqLmVuZC5ub2RlO1xuXG4gIHRyeSB7XG4gICAgcnVubmluZ1swXSA9IHRydWU7XG4gICAgY29uc3QgcGF0aEZvdW5kID0gYXdhaXQgYXN0YXIoc3RhcnROb2RlLCBlbmROb2RlKTtcblxuICAgIGlmIChwYXRoRm91bmQpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdmb3VuZCBwYXRoJyk7XG4gICAgICBydW5uaW5nWzBdID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCdwYXRoIG5vdCBmb3VuZCcpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gIH0gZmluYWxseSB7XG4gICAgcnVubmluZ1swXSA9IGZhbHNlO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJ1bkRpamtzdHJhKCkge1xuICBjb25zdCBzdGFydE5vZGUgPSBncmlkT2JqLnN0YXJ0Lm5vZGU7XG4gIGNvbnN0IGVuZE5vZGUgPSBncmlkT2JqLmVuZC5ub2RlO1xuXG4gIHRyeSB7XG4gICAgcnVubmluZ1swXSA9IHRydWU7XG4gICAgY29uc3QgcGF0aEZvdW5kID0gYXdhaXQgZGlqa3N0cmEoZ3JpZE9iai5ncmlkLCBzdGFydE5vZGUsIGVuZE5vZGUpO1xuXG4gICAgaWYgKHBhdGhGb3VuZCkge1xuICAgICAgY29uc29sZS5sb2coJ2ZvdW5kIHBhdGgnKTtcbiAgICAgIHJ1bm5pbmdbMF0gPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ3BhdGggbm90IGZvdW5kJyk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBydW5uaW5nWzBdID0gZmFsc2U7XG4gIH1cbn1cblxuY29uc3Qgc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc3RhcnQtYWxnb3JpdGhtJyk7XG5cbnN0YXJ0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgKCkgPT4ge1xuICBpZiAocnVubmluZ1swXSkgcmV0dXJuOyAvLyBhbGdvcml0aG0gaW4gcHJvZ3Jlc3NcbiAgZ3JpZE9iai5zZXRBbGxOb2RlTmVpZ2hib3JzKCk7XG5cbiAgaWYgKGdyaWRPYmouc3RhcnQubm9kZSAmJiBncmlkT2JqLmVuZC5ub2RlKSB7XG4gICAgaWYgKHNlbGVjdGVkQWxnb3JpdGhtID09PSAnQSonKSBydW5BU3RhcigpO1xuICAgIGlmIChzZWxlY3RlZEFsZ29yaXRobSA9PT0gJ0RpamtzdHJhJykgcnVuRGlqa3N0cmEoKTtcbiAgfVxufSk7XG5cbmNvbnN0IGdlbmVyYXRlTWF6ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5nZW5lcmF0ZS1tYXplJyk7XG5cbmdlbmVyYXRlTWF6ZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgaWYgKHJ1bm5pbmdbMF0pIHJldHVybjsgLy8gYWxnb3JpdGhtIGluIHByb2dyZXNzXG4gIGdyaWRPYmoucmVzZXRHcmlkKCk7XG5cbiAgaWYgKHNlbGVjdGVkTWF6ZSA9PT0gJ1JhbmRvbSBNYXAnKSByYW5kb21NYXAoZ3JpZE9iai5ncmlkKTtcbiAgaWYgKHNlbGVjdGVkTWF6ZSA9PT0gJ0JpbmFyeSBUcmVlJykgYmluYXJ5VHJlZShncmlkT2JqLmdyaWQpO1xuICBpZiAoc2VsZWN0ZWRNYXplID09PSAnU2lkZXdpbmRlcicpIHNpZGV3aW5kZXIoZ3JpZE9iai5ncmlkKTtcbiAgaWYgKHNlbGVjdGVkTWF6ZSA9PT0gJ1JlY3Vyc2l2ZSBEaXZpc2lvbicpIHJlY3Vyc2l2ZURpdmlzaW9uKGdyaWRPYmouZ3JpZCk7XG59KTtcblxuZnVuY3Rpb24gYWRkTGlzdGVuZXJzVG9CdG5zKCkge1xuICBjb25zdCBkcm9wZG93bkJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZHJvcGRvd24tYnRuJyk7XG4gIGNvbnN0IGRyb3Bkb3duTGlzdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZHJvcGRvd24tbGlzdCcpO1xuICBjb25zdCBjbGVhckJvYXJkQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNsZWFyLWJvYXJkJyk7XG5cbiAgZnVuY3Rpb24gY2xvc2VEcm9wZG93bnMoKSB7XG4gICAgZHJvcGRvd25MaXN0cy5mb3JFYWNoKChsaXN0KSA9PiB7XG4gICAgICBsaXN0LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICB9KTtcbiAgfVxuXG4gIGRyb3Bkb3duQnV0dG9ucy5mb3JFYWNoKChidXR0b24sIGluZGV4KSA9PiB7XG4gICAgaWYgKHJ1bm5pbmdbMF0pIHJldHVybjsgLy8gYWxnb3JpdGhtIGluIHByb2dyZXNzXG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBjb25zdCBjdXJyZW50TGlzdCA9IGRyb3Bkb3duTGlzdHNbaW5kZXhdO1xuICAgICAgY29uc3QgaXNMaXN0T3BlbiA9IGN1cnJlbnRMaXN0LmNsYXNzTGlzdC5jb250YWlucygnc2hvdycpO1xuXG4gICAgICBjbG9zZURyb3Bkb3ducygpO1xuXG4gICAgICBpZiAoIWlzTGlzdE9wZW4pIHtcbiAgICAgICAgY3VycmVudExpc3QuY2xhc3NMaXN0LnRvZ2dsZSgnc2hvdycpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgY29uc3QgaXNDbGlja0luc2lkZURyb3Bkb3duID0gQXJyYXkuZnJvbShkcm9wZG93bkxpc3RzKS5zb21lKChsaXN0KSA9PiBsaXN0LmNvbnRhaW5zKGUudGFyZ2V0KSk7XG5cbiAgICBpZiAoIWlzQ2xpY2tJbnNpZGVEcm9wZG93bikge1xuICAgICAgY2xvc2VEcm9wZG93bnMoKTtcbiAgICB9XG4gIH0pO1xuXG4gIGRyb3Bkb3duTGlzdHMuZm9yRWFjaCgobGlzdCwgaW5kZXgpID0+IHtcbiAgICBjb25zdCBsaXN0SXRlbXMgPSBsaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5saXN0LXNlbGVjdGlvbicpO1xuXG4gICAgbGlzdEl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICBkcm9wZG93bkxpc3RzW2luZGV4XS5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICAgIGRyb3Bkb3duQnV0dG9uc1tpbmRleF0udGV4dENvbnRlbnQgPSBpdGVtLnRleHRDb250ZW50O1xuICAgICAgICBpZiAoaW5kZXggPT09IDApIHNlbGVjdGVkQWxnb3JpdGhtID0gaXRlbS50ZXh0Q29udGVudDtcbiAgICAgICAgaWYgKGluZGV4ID09PSAxKSBzZWxlY3RlZE1hemUgPSBpdGVtLnRleHRDb250ZW50O1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGNsZWFyQm9hcmRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgaWYgKHJ1bm5pbmdbMF0pIHJldHVybjsgLy8gYWxnb3JpdGhtIGluIHByb2dyZXNzXG4gICAgZ3JpZE9iai5yZXNldEdyaWQoKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZExpc3RlbmVyc1RvR3JpZCgpIHtcbiAgZ3JpZE9iai5hZGRMaXN0ZW5lcnMocnVubmluZyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvYWQoKSB7XG4gIGxvYWRHcmlkKCk7XG4gIGFkZExpc3RlbmVyc1RvR3JpZCgpO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICAgIGFkZExpc3RlbmVyc1RvQnRucygpO1xuICB9KTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGJpbmFyeVRyZWUoZ3JpZCkge1xuICBjb25zdCBkZWxheSA9IDAuMTtcblxuICBmdW5jdGlvbiBjb25uZWN0KG5vZGUxLCBub2RlMiwgYmFycmllckJldHdlZW4pIHtcbiAgICBub2RlMS5zZXROb2RlVHlwZSgnZW1wdHknKTtcbiAgICBub2RlMi5zZXROb2RlVHlwZSgnZW1wdHknKTtcbiAgICBiYXJyaWVyQmV0d2Vlbi5zZXROb2RlVHlwZSgnZW1wdHknKTtcbiAgfVxuXG4gIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IGdyaWQubGVuZ3RoOyByb3crKykge1xuICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGdyaWRbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG4gICAgICBncmlkW3Jvd11bY29sXS5zZXROb2RlVHlwZSgnYmFycmllcicpO1xuICAgIH1cbiAgfVxuXG4gIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IGdyaWQubGVuZ3RoOyByb3crKykge1xuICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGdyaWRbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG4gICAgICBpZiAocm93ICUgMiA9PT0gMCB8fCBjb2wgJSAyID09PSAwKSBjb250aW51ZTtcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG5cbiAgICAgIGNvbnN0IGN1cnJlbnRTcXVhcmUgPSBncmlkW3Jvd11bY29sXTtcbiAgICAgIGxldCBub3J0aE5laWdoYm9yO1xuICAgICAgbGV0IHdlc3ROZWlnaGJvcjtcblxuICAgICAgaWYgKHJvdyA+IDEpIHtcbiAgICAgICAgbm9ydGhOZWlnaGJvciA9IGdyaWRbcm93IC0gMl1bY29sXTsgLy8gdXBcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5vcnRoTmVpZ2hib3IgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29sID4gMSkge1xuICAgICAgICB3ZXN0TmVpZ2hib3IgPSBncmlkW3Jvd11bY29sIC0gMl07IC8vIGxlZnRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdlc3ROZWlnaGJvciA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmIChub3J0aE5laWdoYm9yICYmIHdlc3ROZWlnaGJvcikge1xuICAgICAgICAvLyBpZiBib3RoIHBhdGhzIGFyZSBhdmFpbGFibGVcbiAgICAgICAgY29uc3QgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMik7XG4gICAgICAgIGlmIChyYW5kb20gPT09IDApIHtcbiAgICAgICAgICBjb25uZWN0KGN1cnJlbnRTcXVhcmUsIG5vcnRoTmVpZ2hib3IsIGN1cnJlbnRTcXVhcmUubmVpZ2hib3JzWzNdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25uZWN0KGN1cnJlbnRTcXVhcmUsIHdlc3ROZWlnaGJvciwgY3VycmVudFNxdWFyZS5uZWlnaGJvcnNbMV0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBpZiBvbmUgb2YgdGhlIHBhdGhzIGdvIGJleW9uZCB0aGUgZ3JpZFxuICAgICAgICBpZiAocm93ID09PSAxICYmIGNvbCA+IDEpIHtcbiAgICAgICAgICBjb25uZWN0KGN1cnJlbnRTcXVhcmUsIHdlc3ROZWlnaGJvciwgY3VycmVudFNxdWFyZS5uZWlnaGJvcnNbMV0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb2wgPT09IDEgJiYgcm93ID4gMSkge1xuICAgICAgICAgIGNvbm5lY3QoY3VycmVudFNxdWFyZSwgbm9ydGhOZWlnaGJvciwgY3VycmVudFNxdWFyZS5uZWlnaGJvcnNbM10pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByYW5kb21NYXAoZ3JpZCkge1xuICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCBncmlkLmxlbmd0aDsgcm93KyspIHtcbiAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBncmlkW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuICAgICAgY29uc3QgcmFuZG9tID0gTWF0aC5yYW5kb20oKTtcbiAgICAgIGlmIChyYW5kb20gPCAwLjMpIHtcbiAgICAgICAgZ3JpZFtyb3ddW2NvbF0uc2V0Tm9kZVR5cGUoJ2JhcnJpZXInKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlY3Vyc2l2ZURpdmlzaW9uKGdyaWQpIHtcbiAgY29uc3Qgcm93cyA9IGdyaWQubGVuZ3RoO1xuICBjb25zdCBjb2xzID0gZ3JpZFswXS5sZW5ndGg7XG5cbiAgZnVuY3Rpb24gcmFuZG9tRXZlbihhLCBiKSB7XG4gICAgY29uc3QgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGIgLSBhICsgMSkpICsgYTtcbiAgICByZXR1cm4gcmFuZG9tICUgMiA9PT0gMCA/IHJhbmRvbSA6IHJhbmRvbSArIDE7XG4gIH1cblxuICBmdW5jdGlvbiByYW5kb21PZGQoYSwgYikge1xuICAgIGNvbnN0IHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChiIC0gYSArIDEpKSArIGE7XG4gICAgcmV0dXJuIHJhbmRvbSAlIDIgIT09IDAgPyByYW5kb20gOiByYW5kb20gKyAxO1xuICB9XG5cbiAgZnVuY3Rpb24gY2hvb3NlT3JpZW50YXRpb24oc3RhcnRSb3csIGVuZFJvdywgc3RhcnRDb2wsIGVuZENvbCkge1xuICAgIGNvbnN0IHdpZHRoID0gZW5kQ29sIC0gc3RhcnRDb2w7XG4gICAgY29uc3QgaGVpZ2h0ID0gZW5kUm93IC0gc3RhcnRSb3c7XG4gICAgaWYgKHdpZHRoID4gaGVpZ2h0KSB7XG4gICAgICByZXR1cm4gJ3ZlcnRpY2FsJztcbiAgICB9IGVsc2UgaWYgKHdpZHRoIDwgaGVpZ2h0KSB7XG4gICAgICByZXR1cm4gJ2hvcml6b250YWwnO1xuICAgIH1cblxuICAgIGNvbnN0IHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpO1xuICAgIHJldHVybiByYW5kb20gPT09IDAgPyAnaG9yaXpvbnRhbCcgOiAndmVydGljYWwnO1xuICB9XG5cbiAgLy8gc2V0IGVkZ2VzIG9mIGdyaWQgYXMgYmFycmllcnNcbiAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgcm93czsgcm93KyspIHtcbiAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBjb2xzOyBjb2wrKykge1xuICAgICAgaWYgKHJvdyA9PT0gMCB8fCByb3cgPT09IHJvd3MgLSAxIHx8IGNvbCA9PT0gMCB8fCBjb2wgPT09IGNvbHMgLSAxKSB7XG4gICAgICAgIGdyaWRbcm93XVtjb2xdLnNldE5vZGVUeXBlKCdiYXJyaWVyJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gdGhlIHJlY3Vyc2l2ZSBmdW5jdGlvbiB0byBkaXZpZGUgdGhlIGdyaWRcbiAgZnVuY3Rpb24gZGl2aWRlKHN0YXJ0Um93LCBlbmRSb3csIHN0YXJ0Q29sLCBlbmRDb2wpIHtcbiAgICBpZiAoZW5kQ29sIC0gc3RhcnRDb2wgPCAxIHx8IGVuZFJvdyAtIHN0YXJ0Um93IDwgMSkge1xuICAgICAgLy8gYmFzZSBjYXNlIGlmIHN1Yi1tYXplIGlzIHRvbyBzbWFsbFxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHdhbGxSb3cgPSByYW5kb21FdmVuKHN0YXJ0Um93ICsgMSwgZW5kUm93IC0gMSk7XG4gICAgY29uc3Qgd2FsbENvbCA9IHJhbmRvbUV2ZW4oc3RhcnRDb2wgKyAxLCBlbmRDb2wgLSAxKTtcblxuICAgIGNvbnN0IHBhc3NhZ2VSb3cgPSByYW5kb21PZGQoc3RhcnRSb3csIGVuZFJvdyk7XG4gICAgY29uc3QgcGFzc2FnZUNvbCA9IHJhbmRvbU9kZChzdGFydENvbCwgZW5kQ29sKTtcblxuICAgIGNvbnN0IG9yaWVudGF0aW9uID0gY2hvb3NlT3JpZW50YXRpb24oc3RhcnRSb3csIGVuZFJvdywgc3RhcnRDb2wsIGVuZENvbCk7XG5cbiAgICBpZiAob3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgLy8gbWFrZSBhIGhvcml6b250YWwgd2FsbFxuICAgICAgZm9yIChsZXQgY29sID0gc3RhcnRDb2w7IGNvbCA8PSBlbmRDb2w7IGNvbCsrKSB7XG4gICAgICAgIGlmIChjb2wgIT09IHBhc3NhZ2VDb2wpIHtcbiAgICAgICAgICBncmlkW3dhbGxSb3ddW2NvbF0uc2V0Tm9kZVR5cGUoJ2JhcnJpZXInKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgIC8vIG1ha2UgYSB2ZXJ0aWNhbCB3YWxsXG4gICAgICBmb3IgKGxldCByb3cgPSBzdGFydFJvdzsgcm93IDw9IGVuZFJvdzsgcm93KyspIHtcbiAgICAgICAgaWYgKHJvdyAhPT0gcGFzc2FnZVJvdykge1xuICAgICAgICAgIGdyaWRbcm93XVt3YWxsQ29sXS5zZXROb2RlVHlwZSgnYmFycmllcicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgIGRpdmlkZShzdGFydFJvdywgd2FsbFJvdyAtIDEsIHN0YXJ0Q29sLCBlbmRDb2wpO1xuICAgICAgZGl2aWRlKHdhbGxSb3cgKyAxLCBlbmRSb3csIHN0YXJ0Q29sLCBlbmRDb2wpO1xuICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgIGRpdmlkZShzdGFydFJvdywgZW5kUm93LCB3YWxsQ29sICsgMSwgZW5kQ29sKTtcbiAgICAgIGRpdmlkZShzdGFydFJvdywgZW5kUm93LCBzdGFydENvbCwgd2FsbENvbCAtIDEpO1xuICAgIH1cbiAgfVxuXG4gIGRpdmlkZSgxLCByb3dzIC0gMiwgMSwgY29scyAtIDIpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gc2lkZXdpbmRlcihncmlkKSB7XG4gIGNvbnN0IGRlbGF5ID0gMC4xO1xuICBjb25zdCByb3dzID0gZ3JpZC5sZW5ndGg7XG4gIGNvbnN0IGNvbHMgPSBncmlkWzBdLmxlbmd0aDtcblxuICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCByb3dzOyByb3crKykge1xuICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGNvbHM7IGNvbCsrKSB7XG4gICAgICBpZiAocm93ID09PSAxICYmIGNvbCAhPT0gMCAmJiBjb2wgIT09IGNvbHMgLSAxKSBjb250aW51ZTtcbiAgICAgIGlmIChjb2wgJSAyID09PSAwKSB7XG4gICAgICAgIGdyaWRbcm93XVtjb2xdLnNldE5vZGVUeXBlKCdiYXJyaWVyJyk7XG4gICAgICB9XG4gICAgICBpZiAocm93ICUgMiA9PT0gMCkge1xuICAgICAgICBncmlkW3Jvd11bY29sXS5zZXROb2RlVHlwZSgnYmFycmllcicpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZvciAobGV0IHJvdyA9IDE7IHJvdyA8IHJvd3M7IHJvdysrKSB7XG4gICAgbGV0IHJ1biA9IFtdO1xuICAgIGZvciAobGV0IGNvbCA9IDE7IGNvbCA8IGNvbHM7IGNvbCArPSAyKSB7XG4gICAgICBpZiAocm93ICUgMiA9PT0gMCkgY29udGludWU7XG5cbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG4gICAgICBpZiAocm93ID09PSAxKSB7XG4gICAgICAgIGdyaWRbcm93XVtjb2xdLnNldE5vZGVUeXBlKCdlbXB0eScpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY3VycmVudE5vZGUgPSBncmlkW3Jvd11bY29sXTtcbiAgICAgIHJ1bi5wdXNoKGN1cnJlbnROb2RlKTtcblxuICAgICAgaWYgKGNvbCA8IGNvbHMgLSAxKSB7XG4gICAgICAgIGlmIChNYXRoLnJhbmRvbSgpIDwgMC42ICYmIGNvbCAhPT0gY29scyAtIDIpIHtcbiAgICAgICAgICBjdXJyZW50Tm9kZS5uZWlnaGJvcnNbMF0uc2V0Tm9kZVR5cGUoJ2VtcHR5Jyk7XG4gICAgICAgIH0gZWxzZSBpZiAocnVuLmxlbmd0aCA+IDAgJiYgcm93ID4gMSkge1xuICAgICAgICAgIGNvbnN0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcnVuLmxlbmd0aCk7XG4gICAgICAgICAgcnVuW3JhbmRvbUluZGV4XS5uZWlnaGJvcnNbM10uc2V0Tm9kZVR5cGUoJ2VtcHR5Jyk7XG4gICAgICAgICAgcnVuID0gW107XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBEb21IYW5kbGVyIGZyb20gJy4vZG9taGFuZGxlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vZGUge1xuICBjb25zdHJ1Y3Rvcihyb3csIGNvbCwgZ3JpZCkge1xuICAgIHRoaXMubm9kZVdpZHRoID0gMzA7IC8vIHB4IHdpZHRoIGFuZCBoZWlnaHQgb2Ygc3F1YXJlXG4gICAgdGhpcy50b3RhbFJvd3MgPSAyNTtcbiAgICB0aGlzLnRvdGFsQ29scyA9IDYwO1xuICAgIHRoaXMucm93ID0gcm93O1xuICAgIHRoaXMuY29sID0gY29sO1xuICAgIHRoaXMueSA9IHRoaXMucm93ICogdGhpcy5ub2RlV2lkdGg7XG4gICAgdGhpcy54ID0gdGhpcy5jb2wgKiB0aGlzLm5vZGVXaWR0aDtcbiAgICB0aGlzLm5vZGVUeXBlID0gJ2VtcHR5JzsgLy8gdXNlZCB0byB1cGRhdGUgc3F1YXJlIGRpc3BsYXkgb24gZG9tIGUuZyBzdGFydCwgZW5kIG9yIGJhcnJpZXJcbiAgICB0aGlzLm5laWdoYm9ycyA9IFtdO1xuICAgIHRoaXMucHJldmlvdXNOb2RlID0gbnVsbDtcbiAgICB0aGlzLmdyaWQgPSBncmlkO1xuXG4gICAgLy8gYXN0YXIgc2NvcmVzXG4gICAgdGhpcy5mID0gMDtcbiAgICB0aGlzLmcgPSAwO1xuICAgIHRoaXMuaCA9IDA7XG4gIH1cblxuICBzZXROb2RlVHlwZShuZXdOb2RlVHlwZSkge1xuICAgIHRoaXMubm9kZVR5cGUgPSBuZXdOb2RlVHlwZTtcbiAgICBEb21IYW5kbGVyLmRpc3BsYXlBbGdvcml0aG0odGhpcywgdGhpcy5ncmlkKTtcbiAgfVxuXG4gIC8vIGNhbGMgZiwgZyBhbmQgaCBzY29yZXNcbiAgY2FsY1Njb3JlcyhzdGFydE5vZGUsIGVuZE5vZGUpIHtcbiAgICB0aGlzLmcgPSBNYXRoLmFicyh0aGlzLnggLSBzdGFydE5vZGUueCkgKyBNYXRoLmFicyh0aGlzLnkgLSBzdGFydE5vZGUueSk7XG4gICAgdGhpcy5oID0gTWF0aC5hYnModGhpcy54IC0gZW5kTm9kZS54KSArIE1hdGguYWJzKHRoaXMueSAtIGVuZE5vZGUueSk7XG4gICAgdGhpcy5mID0gdGhpcy5nICsgdGhpcy5oO1xuICAgIHJldHVybiB0aGlzLmY7XG4gIH1cblxuICBzZXROZWlnaGJvcnMoZ3JpZCkge1xuICAgIGNvbnN0IHRlbXBSb3cgPSB0aGlzLnJvdyAtIDE7XG4gICAgY29uc3QgdGVtcENvbCA9IHRoaXMuY29sIC0gMTtcblxuICAgIGlmICh0ZW1wQ29sIDwgdGhpcy50b3RhbENvbHMpIHtcbiAgICAgIC8vIHJpZ2h0XG4gICAgICB0aGlzLm5laWdoYm9ycy5wdXNoKGdyaWRbdGVtcFJvd11bdGVtcENvbCArIDFdKTtcbiAgICB9XG5cbiAgICBpZiAodGVtcENvbCA+IDApIHtcbiAgICAgIC8vIGxlZnRcbiAgICAgIHRoaXMubmVpZ2hib3JzLnB1c2goZ3JpZFt0ZW1wUm93XVt0ZW1wQ29sIC0gMV0pO1xuICAgIH1cblxuICAgIGlmICh0ZW1wUm93IDwgdGhpcy50b3RhbFJvd3MgLSAxKSB7XG4gICAgICAvLyBkb3duXG4gICAgICB0aGlzLm5laWdoYm9ycy5wdXNoKGdyaWRbdGVtcFJvdyArIDFdW3RlbXBDb2xdKTtcbiAgICB9XG5cbiAgICBpZiAodGVtcFJvdyA+IDApIHtcbiAgICAgIC8vIHVwXG4gICAgICB0aGlzLm5laWdoYm9ycy5wdXNoKGdyaWRbdGVtcFJvdyAtIDFdW3RlbXBDb2xdKTtcbiAgICB9XG4gIH1cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0ICcuL3Njc3MvbWFpbi5zY3NzJztcbmltcG9ydCBsb2FkIGZyb20gJy4vbWFpbmxvb3AnO1xuXG5sb2FkKCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=