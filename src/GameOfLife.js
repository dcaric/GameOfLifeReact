import React, { useState, useEffect, useCallback } from 'react';

const numRows = 90;
const numCols = 200;
let cycles = 0;
const operations = [
  [0, 1], [0, -1], [1, -1], [-1, 1],
  [1, 1], [-1, -1], [1, 0], [-1, 0]
];

function generateEmptyGrid() {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
}

function randomizeGrid() {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(
      Array.from(Array(numCols), () => (Math.random() > 0.8 ? 1 : 0))
    );
  }
  return rows;
}

function GameOfLife() {
  const [grid, setGrid] = useState(() => generateEmptyGrid());
  const [running, setRunning] = useState(false);

  const runSimulation = useCallback(() => {
    if (!running) return;
    cycles++;
    setGrid((g) => {
      return g.map((row, i) =>
        row.map((cell, j) => {
          let neighbors = 0;
          operations.forEach(([x, y]) => {
            const newI = i + x;
            const newJ = j + y;
            if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
              neighbors += g[newI][newJ];
            }
          });

          if (cell === 1 && (neighbors < 2 || neighbors > 3)) {
            return 0;
          }
          if (cell === 0 && neighbors === 3) {
            return 1;
          }
          return cell;
        })
      );
    });
    setTimeout(runSimulation, 200);
  }, [running]);

  useEffect(() => {
    if (running) {
      runSimulation();
    }
  }, [runSimulation, running]);

  return (
    <>
      <button onClick={() => {
        cycles = 0;
        setRunning(!running);
        if (!running) {
          
          setGrid(randomizeGrid());
        }
      }}>
        {running ? 'Stop' : 'Start'}
      </button>
      <label>  Generations: {cycles}</label>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${numCols}, 5px)`,
        margin: '1px 0'
      }}>
        {grid.map((rows, i) =>
          rows.map((col, j) => {
            // generate randoom color, all but not black
            const randomColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            return(
            <div
              key={`${i}-${j}`}
              onClick={() => {
                if (!running) {
                  const newGrid = JSON.parse(JSON.stringify(grid));
                  newGrid[i][j] = grid[i][j] ? 0 : 1;
                  setGrid(newGrid);
                }
              }}
              style={{
                width: 5,
                height: 5,
                backgroundColor: grid[i][j] ? randomColor : 'black',
                border: 'solid 1px black'
              }}
            />
          )})
        )}
      </div>
    </>
  );
}

export default GameOfLife;
