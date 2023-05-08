import React, { useState, useEffect } from 'react';
import findMaximumWeightIndependentSet from './max-weight-independent-set';
import generateColors from './colors';
import './App.css';

var simulatedAnnealing = require('simulated-annealing');

const GRID_ROWS = 22;
const GRID_COLS = 15;
const MS_1 = 1000;
const MS_2 = 50;

const colors = generateColors(20);

const CIPHER = ["ESTSHDMNEDOIRRE",
"NCACOEEINOFCOED",
"CHRHNSLCCSAOSLI",
"OEVMRSEIAPLNOEA",
"NFOIOEIPOOTSBIS",
"TESDSRCIEDAETCS",
"RSSTAIAOGETGEAA",
"ORAEMAOSNREUROU",
"DEOLASDQEAMEGPD",
"EPPLSIEUSOPAOEA",
"SUIEHMVESCODVLC",
"EBNTAPIVBEEIEOO",
"JLIEDODOEDNARMS",
"OIARISOTMEIMNEO",
"SCOAFSCACRNEANO",
"SAEVFIHROPGNDOO",
"INLOIBEANAUTOSO",
"NAETCIFMVREORQO",
"CSIAULECEAMCAUO",
"EACCLISORIAEDIO",
"RCAADTMNSSQCINO",
"OAOOAAUVATUOAZO"];

function App() {
  const [grid, setGrid] = useState(createGrid(GRID_ROWS, GRID_COLS));
  let [currentRow, setCurrentRow] = useState(0);
  let [currentCol, setCurrentCol] = useState(0);

  return (
    <>
      <div className="App">
        {grid.map((row, rowIndex) => (
          <div className="row" key={rowIndex}>
            {row.map((col, colIndex) => (
              <div className={cl(rowIndex, colIndex, grid[rowIndex][colIndex])} key={`${rowIndex}-${colIndex}`}>{CIPHER[rowIndex][colIndex]}</div>
            ))}
          </div>
        ))}
      </div>
      <div className="controls">
        <button type="button" onClick={() => reading(setGrid, setCurrentRow, setCurrentCol, grid)}>Reading</button>
        <button type="button" onClick={() => ngramsRender(setGrid, grid, 2)}>Bigrams</button>
        <button type="button" onClick={() => ngramsRender(setGrid, grid, 3)}>Trigrams</button>
        <button type="button" onClick={() => ngramsRender(setGrid, grid, 4)}>Quadgrams</button>
        <button type="button" onClick={() => reset(setGrid, setCurrentRow, setCurrentCol, grid)}>Reset</button>
      </div>
    </>
  );
}

function reading(setGrid, setCurrentRow, setCurrentCol, grid) {
  setTimeout(tick(0, 0, setCurrentRow, setCurrentCol, grid, setGrid), MS_2);
}

function tick(currentRow, currentCol, setCurrentRow, setCurrentCol, grid, setGrid) {
  if (currentCol === GRID_COLS) return;

  grid[currentRow][currentCol] = 1;
  setGrid(grid);

  currentRow++;
  if (currentRow === GRID_ROWS) {
    currentRow = 0;
    currentCol++;
  }
  setCurrentRow(currentRow);
  setCurrentCol(currentCol);
  setTimeout(() => tick(currentRow, currentCol, setCurrentRow, setCurrentCol, grid, setGrid), MS_2);
}

function reset(setGrid, setCurrentRow, setCurrentCol, grid) {
  setGrid(createGrid(GRID_ROWS, GRID_COLS));
  setCurrentRow(0);
  setCurrentCol(0);
}

/*

  Consider a graph G.
  Each node in G is an ngram with a weight.
  Two nodes are connected with an edge if they have at least one letter in common.
  We seek largest set of ngrams that have no letters in common with each other, such that they have the maximum sum of weights.
  Therefore, we seek a subgraph in G such that no nodes are connected and the node weight sum is maximum.
  This is the maximum-weight independent set problem.

  I explored two ways of finding maximum-weight independent set:
  1) Simulated annealing to approximate the max set.
  2) Direct approach, by exhaustively computing all independent vertex sets, then scanning them to find ones with max weight sum.

*/

function ngramsRender(setGrid, grid, n) {
  // get counts of ngrams
  let ng = ngrams(decode(), n);
  console.log("Plaintext: " + decode());
  console.log("Ngram counts: " + ng);
  // get nodes.  ignore all that don't repeat.
  let nodes = Object.keys(ng).filter(item => ng[item] > 1 && item !== 'OOOO');
  console.log("Nodes: " + nodes);
  let weights = nodes.map(ngram => ng[ngram]);
  console.log("Weights: " + weights);

  // Use simulated annealing to try to find max weighted independent set
  // doSA(nodes, ng, 1);

  let adj = adjacencyMatrix(nodes);
  let mwis = findMaximumWeightIndependentSet(adj, weights)[0];
  let ind_set = mwis.map(item => nodes[item]);
  console.log("Max weight independent set: " + ind_set);
  console.log("Weights: " + ind_set.map(item => ng[item]));
}

function doSA(nodes, ng, iterations) {
  for (let i=0; i<iterations; i++) {
    var result = simulatedAnnealing({
      initialState: {nodes: [], counts: ng},
      tempMax: 15,
      tempMin: 0.001,
      newState: newState,
      getTemp: getTemp,
      getEnergy: getEnergy,
    });
    console.log(getEnergy(result) + ", " + JSON.stringify(result));
  }
}

// Two nodes are adjacent if they share at least one letter
function adjacencyMatrix(nodes) {
  let adjacency = [];
  for (let i=0; i<nodes.length; i++) {
    adjacency[i] = [];
    for (let j=0; j<nodes.length; j++) {
      if (i===j)
        adjacency[i][j] = 0;
      else if (share(nodes[i], nodes[j])) 
        adjacency[i][j] = 1;
      else
        adjacency[i][j] = 0;
    }
  }
  return adjacency;
}

function share(ngram1, ngram2) {
  let s = new Set();
  [...ngram1, ...ngram2].forEach(item => s.add(item));
  return s.size !== ngram1.length + ngram2.length;
}

function cl(row, col, highlight) {
  return highlight ? "col highlight" : "col";
}
function createGrid(rows, cols) {
  const grid = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push(0);
    }
    grid.push(row);
  }
  return grid;
}

function decode() {
  var decoded = "";
  for (let col=0; col<CIPHER[0].length; col++) {
    for (let row=0; row<CIPHER.length; row++) {
      decoded += CIPHER[row][col];
    }
  }  
  return decoded;
}

function ngrams(text, n) {
  let counts = [];
  for (let i=0; i<text.length-n+1; i++) {
    let ngram = text.substring(i, i+n);
    if (!counts[ngram]) counts[ngram] = 0;
    counts[ngram]++;
  }
  return counts;
}

function getEnergy(state) {
  let energy = 0;
  if (state.nodes && state.nodes.length > 0) state.nodes.forEach(node => energy -= state.counts[node]);
  return energy;
}

function nextInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function newState(state) {
  let count = nextInt(1, 3);
  let newNodes = [...state.nodes];
  for (let i=0; i<count; i++) {
    if (Math.random() < 0.5) {
      if (newNodes.length > 0) {
        newNodes.splice(nextInt(0, newNodes.length-1), 1);
      }
    } else {
      let ngrams = [];
      Object.keys(state.counts).forEach(ngram => {
        if (!(newNodes.find(node => node === ngram))) {
          // add only if no nodes are adjacent to ngram
          if (!(newNodes.find(node2 => share(node2, ngram))))
            if (state.counts[ngram] > 1) ngrams.push(ngram);
        }
      });
      if (ngrams.length > 0) newNodes.push(ngrams[nextInt(0, ngrams.length-1)]);
    }
  }
  return {nodes: newNodes, counts: state.counts};
}

// linear temperature decreasing
function getTemp(prevTemperature) {
  return prevTemperature - 0.001;
}

function randomColor() {
  var r = Math.floor(Math.random() * 256);
  var g = Math.floor(Math.random() * 256);
  var b = Math.floor(Math.random() * 256);
  var rgb = "rgb(" + r + "," + g + "," + b + ")";
  var lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  var textColor = lum > 0.5 ? "black" : "white";
  return { backgroundColor: rgb, color: textColor };
}

export default App;
