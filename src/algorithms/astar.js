export default function astar(startNode, endNode) {
  const openList = [];
  const closedList = [];
  const finalPath = [];
  let animationFrameId = null;

  console.log(startNode, endNode);

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
      console.log('found path');
      return;
    }

    closedList.push(currentNode);
    currentNode.setNodeType('closed-list');
    removeFromArr(currentNode);

    const neighbors = currentNode.neighbors;

    for (let i = 0; i < neighbors.length; i++) {
      const currNeighbor = neighbors[i];

      if (
        currNeighbor.nodeType !== 'barrier' &&
        !closedList.includes(currNeighbor)
      ) {
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
      console.log('openlist empty');
    }
  }

  algorithm();
}
