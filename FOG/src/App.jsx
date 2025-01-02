import React, { useState, useEffect } from "react";
import "./App.css";

let baseHue = 0;
let lightness = 50;

const App = () => {
  const rows = 15;
  const cols = 20;
  const fadeSteps = 6;
  const dropDelay = 3;

  const [grid, setGrid] = useState(
    Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({ color: null, intensity: 0 }))
    )
  );
  const [columnDelays, setColumnDelays] = useState(Array(cols).fill(0));
  const [isAnimating, setIsAnimating] = useState(false);

  const createRainDrop = () => {
    const availableCols = columnDelays
      .map((delay, index) => (delay <= 0 ? index : null))
      .filter((index) => index !== null);

    if (availableCols.length === 0) return null;

    const col = availableCols[Math.floor(Math.random() * availableCols.length)];
    setColumnDelays((prev) => {
      const newDelays = [...prev];
      newDelays[col] = dropDelay;
      return newDelays;
    });

    return { row: 0, col, color: getNextColor() };
  };

  const getNextColor = () => {
    baseHue = (baseHue + 5) % 360;
    lightness = 40 + 10 * Math.sin(Date.now() / 500);
    return `hsl(${baseHue}, 100%, ${lightness}%)`;
  };

  useEffect(() => {
    if (!isAnimating) return;

    const rainDrops = [];
    const interval = setInterval(() => {
      setColumnDelays((prev) => prev.map((delay) => (delay > 0 ? delay - 1 : 0)));

      for (const drop of rainDrops) {
        drop.row += 1;
        if (drop.row >= rows) {
          rainDrops.shift();
        }
      }

      if (Math.random() > 0.5) {
        const newDrop = createRainDrop();
        if (newDrop) rainDrops.push(newDrop);
      }

      const newGrid = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({ color: null, intensity: 0 }))
      );

      for (const drop of rainDrops) {
        for (let i = 0; i <= fadeSteps; i++) {
          const fadeRow = drop.row - i;
          if (fadeRow >= 0) {
            const intensity = (fadeSteps - i) / fadeSteps;
            newGrid[fadeRow][drop.col] = {
              color: drop.color,
              intensity,
            };
          }
        }
      }

      setGrid(newGrid);
    }, 60);

    return () => clearInterval(interval);
  }, [isAnimating]);

  const toggleAnimation = () => {
    setIsAnimating((prev) => !prev);
  };

  return (
    <div className="app">
      <br />
      <button className="control-button" onClick={toggleAnimation}>
        {isAnimating ? "Stop Animation" : "Start Animation"}
      </button>
      <div className="container">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className="cell"
                style={{
                  backgroundColor: cell.color ? cell.color : "black",
                  opacity: cell.intensity,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
