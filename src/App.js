import React, { useState, useEffect } from 'react';
import './App.css';

const GRID_ROWS = 22;
const GRID_COLS = 15;
const MS_1 = 1000;
const MS_2 = 50;

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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentCol == GRID_COLS) return;

      grid[currentRow][currentCol] = 1;
      console.log(grid);
      setGrid(grid);

      currentRow++;
      if (currentRow == GRID_ROWS) {
        currentRow = 0;
        currentCol++;
      }
      console.log(currentRow, currentCol);
      setCurrentRow(currentRow);
      setCurrentCol(currentCol);
    }, currentRow == 0 && currentCol == 0 ? MS_1 : MS_2);
    return () => clearTimeout(timer);
  }, [grid, currentRow, currentCol]);

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
      {/* <div className="controls">
        <button type="button">Reading</button>
      </div> */}
    </>
  );
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

export default App;
