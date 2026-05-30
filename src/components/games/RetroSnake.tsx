'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaRotateLeft, FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight, FaPlay } from 'react-icons/fa6';

type Position = [number, number];

export default function RetroSnake(): React.JSX.Element {
  const GRID_SIZE = 15;
  
  const getInitialSnake = (): Position[] => [[7, 13]];
  const getInitialFood = (): Position => [7, 4];

  const [snake, setSnake] = useState<Position[]>(getInitialSnake());
  const [food, setFood] = useState<Position>([3, 3]);
  const [dir, setDir] = useState<Position>([0, -1]); // Default direction: Moving Upward
  
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Position[]): void => {
    let newFood: Position;
    do {
      newFood = [
        Math.floor(Math.random() * GRID_SIZE),
        Math.floor(Math.random() * GRID_SIZE),
      ];
    } while (currentSnake.some(cell => cell[0] === newFood[0] && cell[1] === newFood[1]));
    setFood(newFood);
  }, []);

  const handleDirectionChange = useCallback((nextDir: Position) => {
    setDir((prevDir) => {
      if ((nextDir[0] !== 0 && prevDir[0] === -nextDir[0]) || 
          (nextDir[1] !== 0 && prevDir[1] === -nextDir[1])) {
        return prevDir;
      }
      return nextDir;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (!isStarted || gameOver) return;
      switch (e.key) {
        case 'ArrowUp': handleDirectionChange([0, -1]); e.preventDefault(); break;
        case 'ArrowDown': handleDirectionChange([0, 1]); e.preventDefault(); break;
        case 'ArrowLeft': handleDirectionChange([-1, 0]); e.preventDefault(); break;
        case 'ArrowRight': handleDirectionChange([1, 0]); e.preventDefault(); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStarted, gameOver, handleDirectionChange]);

  useEffect(() => {
    if (!isStarted || gameOver) return;

    gameLoopRef.current = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead: Position = [head[0] + dir[0], head[1] + dir[1]];

        if (newHead[0] < 0 || newHead[0] >= GRID_SIZE || newHead[1] < 0 || newHead[1] >= GRID_SIZE) {
          setGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some(cell => cell[0] === newHead[0] && cell[1] === newHead[1])) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];
        
        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          setScore(s => s + 10);
          generateFood(newSnake);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 140);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [dir, food, gameOver, isStarted, generateFood]);

  const resetGame = (): void => {
    setSnake(getInitialSnake());
    setFood(getInitialFood());
    setDir([0, -1]);
    setGameOver(false);
    setIsStarted(false);
    setScore(0);
  };

  const startGame = (): void => {
    setIsStarted(true);
  };

  return (
    /* RESPONSIVE GRID LAYOUT CONTAINER:
      - Max width changes to 'max-w-2xl' on desktop screens to allow the game canvas and 
        controls to lay out side-by-side cleanly.
    */
    <div className="max-w-sm lg:max-w-2xl w-full bg-zinc-900/50 border border-white/10 p-5 rounded-[2rem] backdrop-blur-xl flex flex-col items-center select-none touch-none">
      
      {/* Universal Top-bar Scoring System */}
      <div className="w-full flex justify-between items-center mb-3 px-1 font-mono text-xs">
        <span className="text-zinc-500">SCORE: <strong className="text-emerald-400 text-sm">{score}</strong></span>
        {gameOver && <span className="text-rose-500 font-bold animate-pulse tracking-widest">GAME OVER</span>}
        {!isStarted && !gameOver && <span className="text-zinc-400 animate-pulse tracking-widest">READY TO LAUNCH</span>}
      </div>

      {/* SIDE-BY-SIDE GRID RESPONSIVE SPLIT:
        - Mobile: 'flex-col' (stacked vertically)
        - Desktop (Large viewports): 'lg:flex-row lg:items-center lg:justify-between lg:gap-8'
      */}
      <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-6">
        
        {/* Left Container Block: Main Game Play Area Grid Canvas */}
        <div className="w-full max-w-[320px] xs:max-w-sm aspect-square relative">
          <div 
            style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
            className="grid bg-zinc-950 border border-zinc-800/80 rounded-2xl overflow-hidden w-full aspect-square relative shadow-inner"
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
              const x = i % GRID_SIZE;
              const y = Math.floor(i / GRID_SIZE);
              const isSnake = snake.some(cell => cell[0] === x && cell[1] === y);
              const isHead = snake[0][0] === x && snake[0][1] === y;
              const isFood = food[0] === x && food[1] === y;

              return (
                <div
                  key={i}
                  className={`w-full aspect-square transition-all duration-75 ${
                    isHead ? 'bg-emerald-400 rounded-sm shadow-md shadow-emerald-500/20' : 
                    isSnake ? 'bg-emerald-500/50 rounded-sm' : 
                    isFood ? 'bg-rose-500 scale-75 animate-pulse rounded-full shadow-lg shadow-rose-500/40' : 'border-[0.2px] border-zinc-900/10'
                  }`}
                />
              );
            })}
          </div>

          {/* Active Overlay Menu Block Mask */}
          {!isStarted && !gameOver && (
            <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl transition duration-300">
              <button 
                onClick={startGame}
                className="px-5 py-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-mono tracking-widest uppercase inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/5 transition duration-200 active:scale-95"
              >
                Start Mission <FaPlay size={10} />
              </button>
            </div>
          )}
        </div>

        {/* Right Container Block (Desktop) / Bottom Container Block (Mobile):
          Holds the direction pad interface matrix and game controller states
        */}
        <div className="flex flex-col items-center justify-center gap-4 min-w-[160px]">
          
          {/* On-Screen Hardware Vector Controller Pad Layout */}
          <div className="flex flex-col items-center gap-1.5">
            <button 
              disabled={!isStarted || gameOver}
              onClick={() => handleDirectionChange([0, -1])}
              className="w-12 h-12 rounded-xl border border-white/5 bg-zinc-950/60 active:bg-zinc-800 hover:border-zinc-700 flex items-center justify-center text-zinc-400 disabled:opacity-20 disabled:pointer-events-none transition"
              aria-label="Move Up"
            >
              <FaArrowUp size={14} />
            </button>
            <div className="flex gap-8">
              <button 
                disabled={!isStarted || gameOver}
                onClick={() => handleDirectionChange([-1, 0])}
                className="w-12 h-12 rounded-xl border border-white/5 bg-zinc-950/60 active:bg-zinc-800 hover:border-zinc-700 flex items-center justify-center text-zinc-400 disabled:opacity-20 disabled:pointer-events-none transition"
                aria-label="Move Left"
              >
                <FaArrowLeft size={14} />
              </button>
              <button 
                disabled={!isStarted || gameOver}
                onClick={() => handleDirectionChange([1, 0])}
                className="w-12 h-12 rounded-xl border border-white/5 bg-zinc-950/60 active:bg-zinc-800 hover:border-zinc-700 flex items-center justify-center text-zinc-400 disabled:opacity-20 disabled:pointer-events-none transition"
                aria-label="Move Right"
              >
                <FaArrowRight size={14} />
              </button>
            </div>
            <button 
              disabled={!isStarted || gameOver}
              onClick={() => handleDirectionChange([0, 1])}
              className="w-12 h-12 rounded-xl border border-white/5 bg-zinc-950/60 active:bg-zinc-800 hover:border-zinc-700 flex items-center justify-center text-zinc-400 disabled:opacity-20 disabled:pointer-events-none transition"
              aria-label="Move Down"
            >
              <FaArrowDown size={14} />
            </button>
          </div>

          {/* Reset Engine Control Operations Key */}
          {(gameOver || isStarted) && (
            <button 
              onClick={resetGame} 
              className="mt-2 px-4 py-2 rounded-xl border border-white/10 bg-zinc-950/40 hover:bg-white/5 transition text-[11px] font-mono text-zinc-400 inline-flex items-center gap-2 cursor-pointer active:scale-95"
            >
              Reset Matrix <FaRotateLeft size={11} className="text-emerald-400" />
            </button>
          )}
          
        </div>

      </div>

    </div>
  );
}