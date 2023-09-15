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
    _domhandler__WEBPACK_IMPORTED_MODULE_1__["default"].updateSquare(
      this.grid,
      row,
      col,
      this.start,
      this.end,
      gridSquare,
    );
    this.setSquareStatus(row, col);
  }

  handleMouseMove(gridSquare, row, col) {
    if (this.isDragging) {
      _domhandler__WEBPACK_IMPORTED_MODULE_1__["default"].updateSquare(
        this.grid,
        row,
        col,
        this.start,
        this.end,
        gridSquare,
      );
      this.setSquareStatus(row, col);
    }
  }

  handleMouseUp() {
    this.isDragging = false;
  }

  findDomSquare(row, col) {
    const gridContainer = document.querySelector('.grid-container');
    const gridContainerChildren = gridContainer.children;
    const index = row * 60 + col;
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





let gridObj = null;
const ROWS = 25;
const COLS = 60;
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

function generateRandomMap() {
  (0,_mazes_randommap__WEBPACK_IMPORTED_MODULE_3__["default"])(gridObj.grid);
  console.log('clled');
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
  console.log('working');

  if (selectedMaze === 'Random Map') generateRandomMap();
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
    this.nodeType = 'none'; // used to update square display on dom e.g start, end or barrier
    this.neighbors = [];
    this.previousNode = null;
    this.grid = grid;

    // astar
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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SztBQUNMLEdBQUc7O0FBRUg7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBOztBQUVlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7Ozs7Ozs7Ozs7Ozs7OztBQ3JKZTtBQUNmLG9CQUFvQixtQkFBbUI7QUFDdkMsc0JBQXNCLHdCQUF3QjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQ1RzQzs7QUFFdkI7QUFDZjtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUksbURBQVU7QUFDZDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O1VDM0RBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7O0FDTjBCO0FBQ0k7O0FBRTlCLHFEQUFJIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9zY3NzL21haW4uc2NzcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL2FsZ29yaXRobXMvYXN0YXIuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9hbGdvcml0aG1zL2RpamtzdHJhLmpzIiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvZG9taGFuZGxlci5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL2dyaWQuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi8uL3NyYy9tYWlubG9vcC5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL21hemVzL3JhbmRvbW1hcC5qcyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uLy4vc3JjL25vZGUuanMiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9wYXRoZmluZGluZy12aXN1YWxpemF0aW9uL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcGF0aGZpbmRpbmctdmlzdWFsaXphdGlvbi93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3BhdGhmaW5kaW5nLXZpc3VhbGl6YXRpb24vLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYXN0YXIoc3RhcnROb2RlLCBlbmROb2RlKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGNvbnN0IG9wZW5MaXN0ID0gW107XG4gICAgY29uc3QgY2xvc2VkTGlzdCA9IFtdO1xuICAgIGNvbnN0IGZpbmFsUGF0aCA9IFtdO1xuICAgIGxldCBhbmltYXRpb25GcmFtZUlkID0gbnVsbDtcblxuICAgIGZ1bmN0aW9uIHJlbW92ZUZyb21BcnIobm9kZSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcGVuTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAob3Blbkxpc3RbaV0gPT09IG5vZGUpIHtcbiAgICAgICAgICBvcGVuTGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBvcGVuTGlzdC5wdXNoKHN0YXJ0Tm9kZSk7XG4gICAgc3RhcnROb2RlLnNldE5vZGVUeXBlKCdvcGVuLWxpc3QnKTtcbiAgICBmdW5jdGlvbiBhbGdvcml0aG0oKSB7XG4gICAgICBsZXQgY3VycmVudE5vZGUgPSBudWxsO1xuICAgICAgbGV0IGxvd2VzdEYgPSBJbmZpbml0eTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3Blbkxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgb3Blbkxpc3RbaV0uY2FsY1Njb3JlcyhzdGFydE5vZGUsIGVuZE5vZGUpO1xuICAgICAgICBpZiAob3Blbkxpc3RbaV0uZiA8IGxvd2VzdEYpIHtcbiAgICAgICAgICBsb3dlc3RGID0gb3Blbkxpc3RbaV0uZjtcbiAgICAgICAgICBjdXJyZW50Tm9kZSA9IG9wZW5MaXN0W2ldO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChjdXJyZW50Tm9kZSA9PT0gZW5kTm9kZSkge1xuICAgICAgICBsZXQgdGVtcCA9IGN1cnJlbnROb2RlO1xuICAgICAgICBmaW5hbFBhdGgucHVzaCh0ZW1wKTtcbiAgICAgICAgdGVtcC5zZXROb2RlVHlwZSgnZmluYWwtcGF0aCcpO1xuICAgICAgICB3aGlsZSAodGVtcC5wcmV2aW91c05vZGUpIHtcbiAgICAgICAgICBmaW5hbFBhdGgucHVzaCh0ZW1wLnByZXZpb3VzTm9kZSk7XG4gICAgICAgICAgdGVtcC5wcmV2aW91c05vZGUuc2V0Tm9kZVR5cGUoJ2ZpbmFsLXBhdGgnKTtcbiAgICAgICAgICB0ZW1wID0gdGVtcC5wcmV2aW91c05vZGU7XG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjbG9zZWRMaXN0LnB1c2goY3VycmVudE5vZGUpO1xuICAgICAgY3VycmVudE5vZGUuc2V0Tm9kZVR5cGUoJ2Nsb3NlZC1saXN0Jyk7XG4gICAgICByZW1vdmVGcm9tQXJyKGN1cnJlbnROb2RlKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50Tm9kZS5uZWlnaGJvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgY3Vyck5laWdoYm9yID0gY3VycmVudE5vZGUubmVpZ2hib3JzW2ldO1xuXG4gICAgICAgIGlmIChjdXJyTmVpZ2hib3Iubm9kZVR5cGUgIT09ICdiYXJyaWVyJyAmJiAhY2xvc2VkTGlzdC5pbmNsdWRlcyhjdXJyTmVpZ2hib3IpKSB7XG4gICAgICAgICAgY29uc3QgdGVtcEcgPSBjdXJyZW50Tm9kZS5nICsgMTtcbiAgICAgICAgICBpZiAob3Blbkxpc3QuaW5jbHVkZXMoY3Vyck5laWdoYm9yKSkge1xuICAgICAgICAgICAgaWYgKHRlbXBHIDwgY3Vyck5laWdoYm9yLmcpIHtcbiAgICAgICAgICAgICAgY3Vyck5laWdoYm9yLmcgPSB0ZW1wRztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3Vyck5laWdoYm9yLmcgPSB0ZW1wRztcbiAgICAgICAgICAgIG9wZW5MaXN0LnB1c2goY3Vyck5laWdoYm9yKTtcbiAgICAgICAgICAgIGN1cnJOZWlnaGJvci5zZXROb2RlVHlwZSgnb3Blbi1saXN0Jyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY3Vyck5laWdoYm9yLnByZXZpb3VzTm9kZSA9IGN1cnJlbnROb2RlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChvcGVuTGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGFuaW1hdGlvbkZyYW1lSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYWxnb3JpdGhtKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFsZ29yaXRobSgpO1xuICB9KTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRpamtzdHJhKGdyaWQsIHN0YXJ0Tm9kZSwgZW5kTm9kZSkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBjb25zdCBvcGVuTGlzdFF1ZXVlID0gW107IC8vIHRyYWNrcyBub2RlcyB0byB2aXNpdFxuICAgIGNvbnN0IGNsb3NlZExpc3QgPSBbXTtcbiAgICBjb25zdCBmaW5hbFBhdGggPSBbXTtcbiAgICBsZXQgYW5pbWF0aW9uRnJhbWVJZCA9IG51bGw7XG5cbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCBncmlkLmxlbmd0aDsgcm93KyspIHtcbiAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGdyaWRbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG4gICAgICAgIGdyaWRbcm93XVtjb2xdLmcgPSBJbmZpbml0eTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzdGFydE5vZGUuZyA9IDA7XG4gICAgb3Blbkxpc3RRdWV1ZS5wdXNoKHN0YXJ0Tm9kZSk7XG4gICAgc3RhcnROb2RlLnNldE5vZGVUeXBlKCdvcGVuLWxpc3QnKTtcblxuICAgIGZ1bmN0aW9uIGFsZ29yaXRobSgpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnROb2RlID0gb3Blbkxpc3RRdWV1ZS5zaGlmdCgpO1xuICAgICAgY3VycmVudE5vZGUuc2V0Tm9kZVR5cGUoJ2Nsb3NlZC1saXN0Jyk7XG5cbiAgICAgIGlmIChjdXJyZW50Tm9kZSA9PT0gZW5kTm9kZSkge1xuICAgICAgICBsZXQgdGVtcCA9IGN1cnJlbnROb2RlO1xuICAgICAgICBmaW5hbFBhdGgucHVzaCh0ZW1wKTtcbiAgICAgICAgdGVtcC5zZXROb2RlVHlwZSgnZmluYWwtcGF0aCcpO1xuICAgICAgICB3aGlsZSAodGVtcC5wcmV2aW91c05vZGUpIHtcbiAgICAgICAgICBmaW5hbFBhdGgucHVzaCh0ZW1wLnByZXZpb3VzTm9kZSk7XG4gICAgICAgICAgdGVtcC5wcmV2aW91c05vZGUuc2V0Tm9kZVR5cGUoJ2ZpbmFsLXBhdGgnKTtcbiAgICAgICAgICB0ZW1wID0gdGVtcC5wcmV2aW91c05vZGU7XG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnROb2RlLm5laWdoYm9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBjdXJyTmVpZ2hib3IgPSBjdXJyZW50Tm9kZS5uZWlnaGJvcnNbaV07XG5cbiAgICAgICAgaWYgKGN1cnJOZWlnaGJvci5ub2RlVHlwZSAhPT0gJ2JhcnJpZXInICYmICFjbG9zZWRMaXN0LmluY2x1ZGVzKGN1cnJOZWlnaGJvcikpIHtcbiAgICAgICAgICBpZiAoY3Vyck5laWdoYm9yLmcgPT09IEluZmluaXR5KSB7XG4gICAgICAgICAgICBjdXJyTmVpZ2hib3IuZyA9IGN1cnJlbnROb2RlLmcgKyAxO1xuICAgICAgICAgICAgY3Vyck5laWdoYm9yLnByZXZpb3VzTm9kZSA9IGN1cnJlbnROb2RlO1xuICAgICAgICAgICAgb3Blbkxpc3RRdWV1ZS5wdXNoKGN1cnJOZWlnaGJvcik7XG4gICAgICAgICAgICBjdXJyTmVpZ2hib3Iuc2V0Tm9kZVR5cGUoJ29wZW4tbGlzdCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAob3Blbkxpc3RRdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGFuaW1hdGlvbkZyYW1lSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYWxnb3JpdGhtKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFsZ29yaXRobSgpO1xuICB9KTtcbn1cbiIsImZ1bmN0aW9uIHVwZGF0ZVNxdWFyZShncmlkLCByb3csIGNvbCwgc3RhcnQsIGVuZCwgZ3JpZFNxdWFyZSkge1xuICBjb25zdCBzdGFydE5vZGUgPSBzdGFydC5ub2RlO1xuICBjb25zdCBlbmROb2RlID0gZW5kLm5vZGU7XG4gIGNvbnN0IGdyaWROb2RlID0gZ3JpZFtyb3ddW2NvbF07XG4gIGlmIChcbiAgICBncmlkTm9kZS5ub2RlVHlwZSAhPT0gJ3N0YXJ0JyAmJlxuICAgIGdyaWROb2RlLm5vZGVUeXBlICE9PSAnZW5kJyAmJlxuICAgIGdyaWROb2RlLm5vZGVUeXBlICE9PSAnYmFycmllcidcbiAgKSB7XG4gICAgaWYgKHN0YXJ0Tm9kZSA9PT0gbnVsbCkge1xuICAgICAgZ3JpZFNxdWFyZS5jbGFzc0xpc3QuYWRkKCdzdGFydCcpO1xuICAgIH0gZWxzZSBpZiAoZW5kTm9kZSA9PT0gbnVsbCkge1xuICAgICAgZ3JpZFNxdWFyZS5jbGFzc0xpc3QuYWRkKCdlbmQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ3JpZFNxdWFyZS5jbGFzc0xpc3QuYWRkKCdiYXJyaWVyJyk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGRpc3BsYXlBbGdvcml0aG0obm9kZSwgZ3JpZCkge1xuICBjb25zdCBkb21TcXVhcmUgPSBncmlkLmZpbmREb21TcXVhcmUobm9kZS5yb3cgLSAxLCBub2RlLmNvbCAtIDEpO1xuICBkb21TcXVhcmUuY2xhc3NMaXN0LmFkZChub2RlLm5vZGVUeXBlKTtcbn1cblxuZnVuY3Rpb24gZGlzcGxheUdyaWQoZ3JpZCkge1xuICBjb25zdCBncmlkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdyaWQtY29udGFpbmVyJyk7XG4gIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IGdyaWQubGVuZ3RoOyByb3crKykge1xuICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGdyaWRbcm93XS5sZW5ndGg7IGNvbCsrKSB7XG4gICAgICBjb25zdCBncmlkU3F1YXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBncmlkU3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2dyaWQtc3F1YXJlJyk7XG4gICAgICBncmlkU3F1YXJlLmNsYXNzTGlzdC5hZGQoJ2VtcHR5Jyk7XG4gICAgICBncmlkQ29udGFpbmVyLmFwcGVuZENoaWxkKGdyaWRTcXVhcmUpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiByZXNldEdyaWQoKSB7XG4gIGNvbnN0IGdyaWRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ3JpZC1jb250YWluZXInKTtcbiAgY29uc3QgZ3JpZENvbnRhaW5lckNoaWxkcmVuID0gZ3JpZENvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcuZ3JpZC1zcXVhcmUnKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGdyaWRDb250YWluZXJDaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgIGdyaWRDb250YWluZXJDaGlsZHJlbltpXS5yZW1vdmVBdHRyaWJ1dGUoJ2NsYXNzJyk7XG4gICAgZ3JpZENvbnRhaW5lckNoaWxkcmVuW2ldLmNsYXNzTGlzdC5hZGQoJ2dyaWQtc3F1YXJlJyk7XG4gICAgZ3JpZENvbnRhaW5lckNoaWxkcmVuW2ldLmNsYXNzTGlzdC5hZGQoJ2VtcHR5Jyk7XG4gIH1cbn1cblxuY29uc3QgRG9tSGFuZGxlciA9IHtcbiAgZGlzcGxheUdyaWQsXG4gIHVwZGF0ZVNxdWFyZSxcbiAgZGlzcGxheUFsZ29yaXRobSxcbiAgcmVzZXRHcmlkLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgRG9tSGFuZGxlcjtcbiIsImltcG9ydCBOb2RlIGZyb20gJy4vbm9kZSc7XG5pbXBvcnQgRG9tSGFuZGxlciBmcm9tICcuL2RvbWhhbmRsZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcmlkIHtcbiAgY29uc3RydWN0b3Iocm93cywgY29scykge1xuICAgIHRoaXMucm93cyA9IHJvd3M7XG4gICAgdGhpcy5jb2xzID0gY29scztcbiAgICB0aGlzLnN0YXJ0ID0geyBub2RlOiBudWxsIH07XG4gICAgdGhpcy5lbmQgPSB7IG5vZGU6IG51bGwgfTtcbiAgICB0aGlzLmdyaWQgPSBbXTtcbiAgICB0aGlzLm9wZW5MaXN0ID0gW107XG4gICAgdGhpcy5jbG9zZWRMaXN0ID0gW107XG4gICAgdGhpcy5maW5hbFBhdGggPSBbXTtcbiAgICB0aGlzLmNyZWF0ZUdyaWQodGhpcy5yb3dzLCB0aGlzLmNvbHMpO1xuXG4gICAgdGhpcy5pc0RyYWdnaW5nID0gZmFsc2U7XG4gIH1cblxuICBzZXRTcXVhcmVTdGF0dXMocm93LCBjb2wpIHtcbiAgICBpZiAodGhpcy5zdGFydC5ub2RlID09PSBudWxsKSB7XG4gICAgICB0aGlzLmdyaWRbcm93XVtjb2xdLm5vZGVUeXBlID0gJ3N0YXJ0JztcbiAgICAgIHRoaXMuc3RhcnQubm9kZSA9IHRoaXMuZ3JpZFtyb3ddW2NvbF07XG4gICAgfSBlbHNlIGlmICh0aGlzLmVuZC5ub2RlID09PSBudWxsKSB7XG4gICAgICB0aGlzLmdyaWRbcm93XVtjb2xdLm5vZGVUeXBlID0gJ2VuZCc7XG4gICAgICB0aGlzLmVuZC5ub2RlID0gdGhpcy5ncmlkW3Jvd11bY29sXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ncmlkW3Jvd11bY29sXS5ub2RlVHlwZSA9ICdiYXJyaWVyJztcbiAgICB9XG4gIH1cblxuICBoYW5kbGVNb3VzZURvd24oZ3JpZFNxdWFyZSwgcm93LCBjb2wpIHtcbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSB0cnVlO1xuICAgIERvbUhhbmRsZXIudXBkYXRlU3F1YXJlKFxuICAgICAgdGhpcy5ncmlkLFxuICAgICAgcm93LFxuICAgICAgY29sLFxuICAgICAgdGhpcy5zdGFydCxcbiAgICAgIHRoaXMuZW5kLFxuICAgICAgZ3JpZFNxdWFyZSxcbiAgICApO1xuICAgIHRoaXMuc2V0U3F1YXJlU3RhdHVzKHJvdywgY29sKTtcbiAgfVxuXG4gIGhhbmRsZU1vdXNlTW92ZShncmlkU3F1YXJlLCByb3csIGNvbCkge1xuICAgIGlmICh0aGlzLmlzRHJhZ2dpbmcpIHtcbiAgICAgIERvbUhhbmRsZXIudXBkYXRlU3F1YXJlKFxuICAgICAgICB0aGlzLmdyaWQsXG4gICAgICAgIHJvdyxcbiAgICAgICAgY29sLFxuICAgICAgICB0aGlzLnN0YXJ0LFxuICAgICAgICB0aGlzLmVuZCxcbiAgICAgICAgZ3JpZFNxdWFyZSxcbiAgICAgICk7XG4gICAgICB0aGlzLnNldFNxdWFyZVN0YXR1cyhyb3csIGNvbCk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlTW91c2VVcCgpIHtcbiAgICB0aGlzLmlzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIGZpbmREb21TcXVhcmUocm93LCBjb2wpIHtcbiAgICBjb25zdCBncmlkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdyaWQtY29udGFpbmVyJyk7XG4gICAgY29uc3QgZ3JpZENvbnRhaW5lckNoaWxkcmVuID0gZ3JpZENvbnRhaW5lci5jaGlsZHJlbjtcbiAgICBjb25zdCBpbmRleCA9IHJvdyAqIDYwICsgY29sO1xuICAgIHJldHVybiBncmlkQ29udGFpbmVyQ2hpbGRyZW5baW5kZXhdO1xuICB9XG5cbiAgYWRkTGlzdGVuZXJzKGN1cnJlbnRseVJ1bm5pbmcpIHtcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLmdyaWQubGVuZ3RoOyByb3crKykge1xuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgdGhpcy5ncmlkW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuICAgICAgICBjb25zdCBncmlkU3F1YXJlID0gdGhpcy5maW5kRG9tU3F1YXJlKHJvdywgY29sKTtcbiAgICAgICAgZ3JpZFNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoKSA9PiB7XG4gICAgICAgICAgaWYgKGN1cnJlbnRseVJ1bm5pbmdbMF0pIHJldHVybjtcbiAgICAgICAgICB0aGlzLmhhbmRsZU1vdXNlRG93bihncmlkU3F1YXJlLCByb3csIGNvbCk7XG4gICAgICAgIH0pO1xuICAgICAgICBncmlkU3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsICgpID0+IHtcbiAgICAgICAgICBpZiAoY3VycmVudGx5UnVubmluZ1swXSkgcmV0dXJuO1xuICAgICAgICAgIHRoaXMuaGFuZGxlTW91c2VNb3ZlKGdyaWRTcXVhcmUsIHJvdywgY29sKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsICgpID0+IHtcbiAgICAgIHRoaXMuaGFuZGxlTW91c2VVcCgpO1xuICAgIH0pO1xuICB9XG5cbiAgY3JlYXRlR3JpZChyb3dzLCBjb2xzKSB7XG4gICAgZm9yIChsZXQgcm93ID0gMTsgcm93IDw9IHJvd3M7IHJvdysrKSB7XG4gICAgICBjb25zdCBjdXJyZW50Um93ID0gW107XG4gICAgICBmb3IgKGxldCBjb2wgPSAxOyBjb2wgPD0gY29sczsgY29sKyspIHtcbiAgICAgICAgY3VycmVudFJvdy5wdXNoKG5ldyBOb2RlKHJvdywgY29sLCB0aGlzKSk7XG4gICAgICB9XG4gICAgICB0aGlzLmdyaWQucHVzaChjdXJyZW50Um93KTtcbiAgICB9XG4gICAgRG9tSGFuZGxlci5kaXNwbGF5R3JpZCh0aGlzLmdyaWQpO1xuICB9XG5cbiAgc2V0QWxsTm9kZU5laWdoYm9ycygpIHtcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLmdyaWQubGVuZ3RoOyByb3crKykge1xuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgdGhpcy5ncmlkW3Jvd10ubGVuZ3RoOyBjb2wrKykge1xuICAgICAgICB0aGlzLmdyaWRbcm93XVtjb2xdLnNldE5laWdoYm9ycyh0aGlzLmdyaWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlc2V0R3JpZCgpIHtcbiAgICAvLyBjcmVhdGluZyBuZXcgZ3JpZFxuICAgIHRoaXMuZ3JpZCA9IFtdO1xuICAgIGZvciAobGV0IHJvdyA9IDE7IHJvdyA8PSB0aGlzLnJvd3M7IHJvdysrKSB7XG4gICAgICBjb25zdCBjdXJyZW50Um93ID0gW107XG4gICAgICBmb3IgKGxldCBjb2wgPSAxOyBjb2wgPD0gdGhpcy5jb2xzOyBjb2wrKykge1xuICAgICAgICBjdXJyZW50Um93LnB1c2gobmV3IE5vZGUocm93LCBjb2wsIHRoaXMpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZ3JpZC5wdXNoKGN1cnJlbnRSb3cpO1xuICAgIH1cblxuICAgIC8vIHNldHRpbmcgbmVpZ2hib3VycyBhZ2FpblxuICAgIHRoaXMuc2V0QWxsTm9kZU5laWdoYm9ycygpO1xuXG4gICAgLy8gcmVzZXR0aW5nIHN0YXJ0IGFuZCBlbmQgbm9kZVxuICAgIHRoaXMuc3RhcnQubm9kZSA9IG51bGw7XG4gICAgdGhpcy5lbmQubm9kZSA9IG51bGw7XG5cbiAgICAvLyByZXNldGluZyBkb20gc3F1YXJlc1xuICAgIERvbUhhbmRsZXIucmVzZXRHcmlkKCk7XG4gIH1cbn1cbiIsImltcG9ydCBHcmlkIGZyb20gJy4vZ3JpZCc7XG5pbXBvcnQgYXN0YXIgZnJvbSAnLi9hbGdvcml0aG1zL2FzdGFyJztcbmltcG9ydCBkaWprc3RyYSBmcm9tICcuL2FsZ29yaXRobXMvZGlqa3N0cmEnO1xuaW1wb3J0IHJhbmRvbU1hcCBmcm9tICcuL21hemVzL3JhbmRvbW1hcCc7XG5cbmxldCBncmlkT2JqID0gbnVsbDtcbmNvbnN0IFJPV1MgPSAyNTtcbmNvbnN0IENPTFMgPSA2MDtcbmxldCBzZWxlY3RlZEFsZ29yaXRobSA9IG51bGw7XG5sZXQgc2VsZWN0ZWRNYXplID0gbnVsbDtcbmNvbnN0IHJ1bm5pbmcgPSBbZmFsc2VdOyAvLyBjaGVjayB3aGV0aGVyIGFuIGFsZ29yaXRobSBpcyBjdXJyZW50bHkgcnVubmluZ1xuXG5mdW5jdGlvbiBsb2FkR3JpZCgpIHtcbiAgZ3JpZE9iaiA9IG5ldyBHcmlkKFJPV1MsIENPTFMpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBydW5BU3RhcigpIHtcbiAgY29uc3Qgc3RhcnROb2RlID0gZ3JpZE9iai5zdGFydC5ub2RlO1xuICBjb25zdCBlbmROb2RlID0gZ3JpZE9iai5lbmQubm9kZTtcblxuICB0cnkge1xuICAgIHJ1bm5pbmdbMF0gPSB0cnVlO1xuICAgIGNvbnN0IHBhdGhGb3VuZCA9IGF3YWl0IGFzdGFyKHN0YXJ0Tm9kZSwgZW5kTm9kZSk7XG5cbiAgICBpZiAocGF0aEZvdW5kKSB7XG4gICAgICBjb25zb2xlLmxvZygnZm91bmQgcGF0aCcpO1xuICAgICAgcnVubmluZ1swXSA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygncGF0aCBub3QgZm91bmQnKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5sb2coZXJyb3IpO1xuICB9IGZpbmFsbHkge1xuICAgIHJ1bm5pbmdbMF0gPSBmYWxzZTtcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBydW5EaWprc3RyYSgpIHtcbiAgY29uc3Qgc3RhcnROb2RlID0gZ3JpZE9iai5zdGFydC5ub2RlO1xuICBjb25zdCBlbmROb2RlID0gZ3JpZE9iai5lbmQubm9kZTtcblxuICB0cnkge1xuICAgIHJ1bm5pbmdbMF0gPSB0cnVlO1xuICAgIGNvbnN0IHBhdGhGb3VuZCA9IGF3YWl0IGRpamtzdHJhKGdyaWRPYmouZ3JpZCwgc3RhcnROb2RlLCBlbmROb2RlKTtcblxuICAgIGlmIChwYXRoRm91bmQpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdmb3VuZCBwYXRoJyk7XG4gICAgICBydW5uaW5nWzBdID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCdwYXRoIG5vdCBmb3VuZCcpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gIH0gZmluYWxseSB7XG4gICAgcnVubmluZ1swXSA9IGZhbHNlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlUmFuZG9tTWFwKCkge1xuICByYW5kb21NYXAoZ3JpZE9iai5ncmlkKTtcbiAgY29uc29sZS5sb2coJ2NsbGVkJyk7XG59XG5cbmNvbnN0IHN0YXJ0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnN0YXJ0LWFsZ29yaXRobScpO1xuXG5zdGFydEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jICgpID0+IHtcbiAgaWYgKHJ1bm5pbmdbMF0pIHJldHVybjsgLy8gYWxnb3JpdGhtIGluIHByb2dyZXNzXG4gIGdyaWRPYmouc2V0QWxsTm9kZU5laWdoYm9ycygpO1xuXG4gIGlmIChncmlkT2JqLnN0YXJ0Lm5vZGUgJiYgZ3JpZE9iai5lbmQubm9kZSkge1xuICAgIGlmIChzZWxlY3RlZEFsZ29yaXRobSA9PT0gJ0EqJykgcnVuQVN0YXIoKTtcbiAgICBpZiAoc2VsZWN0ZWRBbGdvcml0aG0gPT09ICdEaWprc3RyYScpIHJ1bkRpamtzdHJhKCk7XG4gIH1cbn0pO1xuXG5jb25zdCBnZW5lcmF0ZU1hemVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ2VuZXJhdGUtbWF6ZScpO1xuXG5nZW5lcmF0ZU1hemVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gIGlmIChydW5uaW5nWzBdKSByZXR1cm47IC8vIGFsZ29yaXRobSBpbiBwcm9ncmVzc1xuICBncmlkT2JqLnJlc2V0R3JpZCgpO1xuICBjb25zb2xlLmxvZygnd29ya2luZycpO1xuXG4gIGlmIChzZWxlY3RlZE1hemUgPT09ICdSYW5kb20gTWFwJykgZ2VuZXJhdGVSYW5kb21NYXAoKTtcbn0pO1xuXG5mdW5jdGlvbiBhZGRMaXN0ZW5lcnNUb0J0bnMoKSB7XG4gIGNvbnN0IGRyb3Bkb3duQnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5kcm9wZG93bi1idG4nKTtcbiAgY29uc3QgZHJvcGRvd25MaXN0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5kcm9wZG93bi1saXN0Jyk7XG4gIGNvbnN0IGNsZWFyQm9hcmRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2xlYXItYm9hcmQnKTtcblxuICBmdW5jdGlvbiBjbG9zZURyb3Bkb3ducygpIHtcbiAgICBkcm9wZG93bkxpc3RzLmZvckVhY2goKGxpc3QpID0+IHtcbiAgICAgIGxpc3QuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xuICAgIH0pO1xuICB9XG5cbiAgZHJvcGRvd25CdXR0b25zLmZvckVhY2goKGJ1dHRvbiwgaW5kZXgpID0+IHtcbiAgICBpZiAocnVubmluZ1swXSkgcmV0dXJuOyAvLyBhbGdvcml0aG0gaW4gcHJvZ3Jlc3NcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGNvbnN0IGN1cnJlbnRMaXN0ID0gZHJvcGRvd25MaXN0c1tpbmRleF07XG4gICAgICBjb25zdCBpc0xpc3RPcGVuID0gY3VycmVudExpc3QuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93Jyk7XG5cbiAgICAgIGNsb3NlRHJvcGRvd25zKCk7XG5cbiAgICAgIGlmICghaXNMaXN0T3Blbikge1xuICAgICAgICBjdXJyZW50TGlzdC5jbGFzc0xpc3QudG9nZ2xlKCdzaG93Jyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBjb25zdCBpc0NsaWNrSW5zaWRlRHJvcGRvd24gPSBBcnJheS5mcm9tKGRyb3Bkb3duTGlzdHMpLnNvbWUoKGxpc3QpID0+IGxpc3QuY29udGFpbnMoZS50YXJnZXQpKTtcblxuICAgIGlmICghaXNDbGlja0luc2lkZURyb3Bkb3duKSB7XG4gICAgICBjbG9zZURyb3Bkb3ducygpO1xuICAgIH1cbiAgfSk7XG5cbiAgZHJvcGRvd25MaXN0cy5mb3JFYWNoKChsaXN0LCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IGxpc3RJdGVtcyA9IGxpc3QucXVlcnlTZWxlY3RvckFsbCgnLmxpc3Qtc2VsZWN0aW9uJyk7XG5cbiAgICBsaXN0SXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgIGRyb3Bkb3duTGlzdHNbaW5kZXhdLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcbiAgICAgICAgZHJvcGRvd25CdXR0b25zW2luZGV4XS50ZXh0Q29udGVudCA9IGl0ZW0udGV4dENvbnRlbnQ7XG4gICAgICAgIGlmIChpbmRleCA9PT0gMCkgc2VsZWN0ZWRBbGdvcml0aG0gPSBpdGVtLnRleHRDb250ZW50O1xuICAgICAgICBpZiAoaW5kZXggPT09IDEpIHNlbGVjdGVkTWF6ZSA9IGl0ZW0udGV4dENvbnRlbnQ7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgY2xlYXJCb2FyZEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBpZiAocnVubmluZ1swXSkgcmV0dXJuOyAvLyBhbGdvcml0aG0gaW4gcHJvZ3Jlc3NcbiAgICBncmlkT2JqLnJlc2V0R3JpZCgpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gYWRkTGlzdGVuZXJzVG9HcmlkKCkge1xuICBncmlkT2JqLmFkZExpc3RlbmVycyhydW5uaW5nKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbG9hZCgpIHtcbiAgbG9hZEdyaWQoKTtcbiAgYWRkTGlzdGVuZXJzVG9HcmlkKCk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gICAgYWRkTGlzdGVuZXJzVG9CdG5zKCk7XG4gIH0pO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmFuZG9tTWFwKGdyaWQpIHtcbiAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgZ3JpZC5sZW5ndGg7IHJvdysrKSB7XG4gICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgZ3JpZFtyb3ddLmxlbmd0aDsgY29sKyspIHtcbiAgICAgIGNvbnN0IHJhbmRvbSA9IE1hdGgucmFuZG9tKCk7XG4gICAgICBpZiAocmFuZG9tIDwgMC4zKSB7XG4gICAgICAgIGdyaWRbcm93XVtjb2xdLnNldE5vZGVUeXBlKCdiYXJyaWVyJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgRG9tSGFuZGxlciBmcm9tICcuL2RvbWhhbmRsZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb2RlIHtcbiAgY29uc3RydWN0b3Iocm93LCBjb2wsIGdyaWQpIHtcbiAgICB0aGlzLm5vZGVXaWR0aCA9IDMwOyAvLyBweCB3aWR0aCBhbmQgaGVpZ2h0IG9mIHNxdWFyZVxuICAgIHRoaXMudG90YWxSb3dzID0gMjU7XG4gICAgdGhpcy50b3RhbENvbHMgPSA2MDtcbiAgICB0aGlzLnJvdyA9IHJvdztcbiAgICB0aGlzLmNvbCA9IGNvbDtcbiAgICB0aGlzLnkgPSB0aGlzLnJvdyAqIHRoaXMubm9kZVdpZHRoO1xuICAgIHRoaXMueCA9IHRoaXMuY29sICogdGhpcy5ub2RlV2lkdGg7XG4gICAgdGhpcy5ub2RlVHlwZSA9ICdub25lJzsgLy8gdXNlZCB0byB1cGRhdGUgc3F1YXJlIGRpc3BsYXkgb24gZG9tIGUuZyBzdGFydCwgZW5kIG9yIGJhcnJpZXJcbiAgICB0aGlzLm5laWdoYm9ycyA9IFtdO1xuICAgIHRoaXMucHJldmlvdXNOb2RlID0gbnVsbDtcbiAgICB0aGlzLmdyaWQgPSBncmlkO1xuXG4gICAgLy8gYXN0YXJcbiAgICB0aGlzLmYgPSAwO1xuICAgIHRoaXMuZyA9IDA7XG4gICAgdGhpcy5oID0gMDtcbiAgfVxuXG4gIHNldE5vZGVUeXBlKG5ld05vZGVUeXBlKSB7XG4gICAgdGhpcy5ub2RlVHlwZSA9IG5ld05vZGVUeXBlO1xuICAgIERvbUhhbmRsZXIuZGlzcGxheUFsZ29yaXRobSh0aGlzLCB0aGlzLmdyaWQpO1xuICB9XG5cbiAgLy8gY2FsYyBmLCBnIGFuZCBoIHNjb3Jlc1xuICBjYWxjU2NvcmVzKHN0YXJ0Tm9kZSwgZW5kTm9kZSkge1xuICAgIHRoaXMuZyA9IE1hdGguYWJzKHRoaXMueCAtIHN0YXJ0Tm9kZS54KSArIE1hdGguYWJzKHRoaXMueSAtIHN0YXJ0Tm9kZS55KTtcbiAgICB0aGlzLmggPSBNYXRoLmFicyh0aGlzLnggLSBlbmROb2RlLngpICsgTWF0aC5hYnModGhpcy55IC0gZW5kTm9kZS55KTtcbiAgICB0aGlzLmYgPSB0aGlzLmcgKyB0aGlzLmg7XG4gICAgcmV0dXJuIHRoaXMuZjtcbiAgfVxuXG4gIHNldE5laWdoYm9ycyhncmlkKSB7XG4gICAgY29uc3QgdGVtcFJvdyA9IHRoaXMucm93IC0gMTtcbiAgICBjb25zdCB0ZW1wQ29sID0gdGhpcy5jb2wgLSAxO1xuXG4gICAgaWYgKHRlbXBDb2wgPCB0aGlzLnRvdGFsQ29scyAtIDEpIHtcbiAgICAgIC8vIHJpZ2h0XG4gICAgICB0aGlzLm5laWdoYm9ycy5wdXNoKGdyaWRbdGVtcFJvd11bdGVtcENvbCArIDFdKTtcbiAgICB9XG5cbiAgICBpZiAodGVtcENvbCA+IDApIHtcbiAgICAgIC8vIGxlZnRcbiAgICAgIHRoaXMubmVpZ2hib3JzLnB1c2goZ3JpZFt0ZW1wUm93XVt0ZW1wQ29sIC0gMV0pO1xuICAgIH1cblxuICAgIGlmICh0ZW1wUm93IDwgdGhpcy50b3RhbFJvd3MgLSAxKSB7XG4gICAgICAvLyBkb3duXG4gICAgICB0aGlzLm5laWdoYm9ycy5wdXNoKGdyaWRbdGVtcFJvdyArIDFdW3RlbXBDb2xdKTtcbiAgICB9XG5cbiAgICBpZiAodGVtcFJvdyA+IDApIHtcbiAgICAgIC8vIHVwXG4gICAgICB0aGlzLm5laWdoYm9ycy5wdXNoKGdyaWRbdGVtcFJvdyAtIDFdW3RlbXBDb2xdKTtcbiAgICB9XG4gIH1cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0ICcuL3Njc3MvbWFpbi5zY3NzJztcbmltcG9ydCBsb2FkIGZyb20gJy4vbWFpbmxvb3AnO1xuXG5sb2FkKCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=