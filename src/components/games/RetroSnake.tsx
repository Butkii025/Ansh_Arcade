'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaRotateLeft } from 'react-icons/fa6';

type Position = [number, number];

export default function RetroSnake(): React.JSX.Element {
  const GRID_SIZE = 15;
  const [snake, setSnake] = useState<Position[]>([[7, 7]]);
  const [food, setFood] = useState<Position>([3, 3]);
  const [dir, setDir] = useState<Position>([0, -1]); // Up
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      switch (e.key) {
        case 'ArrowUp': if (dir[1] !== 1) setDir([0, -1]); break;
        case 'ArrowDown': if (dir[1] !== -1) setDir([0, 1]); break;
        case 'ArrowLeft': if (dir[0] !== 1) setDir([-1, 0]); break;
        case 'ArrowRight': if (dir[0] !== -1) setDir([1, 0]); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dir]);

  useEffect(() => {
    if (gameOver) return;

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
    }, 150);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [dir, food, gameOver, generateFood]);

  const resetGame = (): void => {
    setSnake([[7, 7]]);
    setFood([3, 3]);
    setDir([0, -1]);
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="max-w-md w-full bg-zinc-900/50 border border-white/10 p-6 rounded-[2.5rem] backdrop-blur-xl flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-4 px-2 font-mono text-xs">
        <span className="text-zinc-500">SCORE: <strong className="text-emerald-400 text-sm">{score}</strong></span>
        {gameOver && <span className="text-rose-500 font-bold animate-pulse">GAME OVER</span>}
      </div>

      <div className="grid grid-cols-15 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden w-full aspect-square relative mb-6">
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
                isHead ? 'bg-emerald-400 rounded-sm' : 
                isSnake ? 'bg-emerald-500/60 rounded-sm' : 
                isFood ? 'bg-rose-500 scale-75 animate-pulse rounded-full' : 'border-[0.5px] border-zinc-900/20'
              }`}
            />
          );
        })}
      </div>

      <button onClick={resetGame} className="px-4 py-2 rounded-xl border border-white/10 bg-zinc-900/50 hover:bg-white/10 transition text-xs font-mono text-zinc-300 inline-flex items-center gap-2 cursor-pointer">
        Reset <FaRotateLeft size={12} className="text-emerald-400" />
      </button>
    </div>
  );
}