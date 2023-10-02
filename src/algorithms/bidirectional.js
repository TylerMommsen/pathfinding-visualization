export default async function runBidirectional(startNode, endNode, delay) {
  const visitedForwards = new Set();
  const visitedBackwards = new Set();

  const queueForwards = [];
  const queueBackwards = [];

  async function displayFinalPath(backwardNode, forwardNode) {
    let pathForward = [];
    const pathBackward = [];

    let node = backwardNode;
    pathBackward.push(node);
    while (node.previousNode) {
      pathBackward.push(node.previousNode);
      node = node.previousNode;
    }

    let node2 = forwardNode;
    pathForward.push(node2);
    while (node2.previousNode) {
      pathForward.push(node2.previousNode);
      node2 = node2.previousNode;
    }

    const temp = [];
    for (let i = pathForward.length - 1; i >= 0; i--) {
      temp.push(pathForward[i]);
    }
    pathForward = temp;

    const finalPath = pathForward.concat(pathBackward);

    for (let i = 0; i < finalPath.length; i++) {
      if (finalPath[i].nodeType !== 'start' && finalPath[i].nodeType !== 'end') {
        await new Promise((resolve) => setTimeout(resolve, 30));
        finalPath[i].setNodeType('final-path', delay);
      }
    }
  }

  queueForwards.push(startNode);
  queueBackwards.push(endNode);
  visitedForwards.add(startNode);
  visitedBackwards.add(endNode);

  while (queueForwards.length > 0 && queueBackwards.length > 0) {
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    // forwards
    const currNodeForward = queueForwards.shift();

    if (currNodeForward !== startNode) {
      currNodeForward.setNodeType('closed-list', delay);
    }
    const neighborsForward = currNodeForward.neighbors;
    let currNeighborForward = null;

    for (let i = 0; i < neighborsForward.length; i++) {
      currNeighborForward = neighborsForward[i];
      if (visitedBackwards.has(currNeighborForward)) {
        displayFinalPath(currNeighborForward, currNodeForward);
        return true;
      }

      if (!visitedForwards.has(currNeighborForward) && !queueForwards.includes(currNeighborForward) && currNeighborForward.nodeType !== 'barrier') {
        queueForwards.push(currNeighborForward);
        currNeighborForward.previousNode = currNodeForward;
        currNeighborForward.setNodeType('open-list', delay);
        visitedForwards.add(currNeighborForward);
      }
    }

    // backwards
    const currNodeBackward = queueBackwards.shift();

    if (currNodeBackward !== endNode) {
      currNodeBackward.setNodeType('closed-list', delay);
    }
    const neighborsBackward = currNodeBackward.neighbors;
    let currNeighborBackward = null;

    for (let i = 0; i < neighborsBackward.length; i++) {
      currNeighborBackward = neighborsBackward[i];
      if (visitedForwards.has(currNeighborBackward)) {
        displayFinalPath(currNodeBackward, currNeighborBackward);
        return true;
      }

      if (
        !visitedBackwards.has(currNeighborBackward)
        && !queueBackwards.includes(currNeighborBackward)
        && currNeighborBackward.nodeType !== 'barrier'
      ) {
        queueBackwards.push(currNeighborBackward);
        currNeighborBackward.previousNode = currNodeBackward;
        currNeighborBackward.setNodeType('open-list', delay);
        visitedBackwards.add(currNeighborBackward);
      }
    }
  }

  return false;
}
