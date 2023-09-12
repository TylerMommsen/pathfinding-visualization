export default function astar(startNode, endNode) {
  const openList = [];
  const closedList = [];
  const finalPath = [];

  function removeFromArr(node) {
    for (let i = 0; i < openList.length; i++) {
      if (openList[i] === node) {
        openList.splice(i, 1);
      }
    }
  }

  openList.push(startNode);
  while (openList.length > 0) {
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
      console.log('found path');
      return;
    }

    console.log(currentNode.neighbors);
    closedList.push(currentNode);
    removeFromArr(currentNode);

    currentNode.neighbors.forEach((neighbor) => {
      if (!neighbor.barrier && !closedList.includes(neighbor)) {
        const currNeighbor = neighbor;
        const tempG = currentNode.g + 1;
        if (openList.includes(neighbor)) {
          if (tempG < neighbor.g) {
            currNeighbor.g = tempG;
          }
        } else {
          currNeighbor.g = tempG;
          openList.push(currNeighbor);
        }

        currNeighbor.previousNode = currentNode;
      }
    });
  }
  console.log('openlist empty');
}
