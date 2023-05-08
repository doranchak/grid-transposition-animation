/*
  ChatGPT prompt: javascript code to find all independent vertex sets from adjacency matrix input
 */

  function findIndependentVertexSets(adjacencyMatrix) {
    const numVertices = adjacencyMatrix.length;
    const independentSets = [];
  
    function backtrack(currentSet, startVertex) {
      independentSets.push(currentSet.slice()); // Add a copy of the current set to the results
  
      for (let vertex = startVertex; vertex < numVertices; vertex++) {
        if (isIndependentSet(adjacencyMatrix, currentSet, vertex)) {
          currentSet.push(vertex);
          backtrack(currentSet, vertex + 1);
          currentSet.pop();
        }
      }
    }
  
    function isIndependentSet(adjacencyMatrix, currentSet, vertex) {
      for (let i = 0; i < currentSet.length; i++) {
        if (adjacencyMatrix[currentSet[i]][vertex] === 1) {
          return false;
        }
      }
      return true;
    }
  
    backtrack([], 0);
  
    return independentSets;
  }
  
function findMaximumWeightIndependentSet(graph, weights) {
  // get all independent vertex sets
  let all = findIndependentVertexSets(graph);
  console.log("Found " + all.length + " independent sets.");
  // identify the ones that have the biggest weight sum
  let maxSets = [];
  let maxWeight = 0;
  all.forEach(item => {
    let sum = 0;
    item.forEach(node => sum += weights[node]);
    if (sum == maxWeight) {
      maxSets.push(item);
    } else if (sum > maxWeight) {
      maxWeight = sum;
      maxSets = [item];
    }
  });
  console.log(maxWeight + " " + maxSets.length);
  maxSets.forEach(item => console.log("set: " + item));
  return maxSets;
}

export default findMaximumWeightIndependentSet;