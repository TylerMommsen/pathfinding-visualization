export default function astar(startNode, endNode) {
  return new Promise((resolve) => {
    const openList = [];
    const closedList = [];
    const finalPath = [];
    let animationFrameId = null;
    const delay = 15;

    function removeFromArr(node) {
      for (let i = 0; i < openList.length; i++) {
        if (openList[i] === node) {
          openList.splice(i, 1);
        }
      }
    }

    async function displayFinalPath(path) {
      for (let i = path.length - 1; i >= 0; i--) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        path[i].setNodeType('final-path');
      }
    }

    openList.push(startNode);
    startNode.setNodeType('open-list');
    async function algorithm() {
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
        while (temp.previousNode) {
          finalPath.push(temp.previousNode);
          temp = temp.previousNode;
        }
        await displayFinalPath(finalPath);
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
