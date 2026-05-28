'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FaRotateLeft, FaRobot, FaUser } from 'react-icons/fa6';

type SquareValue = string | null;
type BoardState = SquareValue[];

export default function TicTacToe(): React.JSX.Element {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [isUserTurn, setIsUserTurn] = useState<boolean>(true);
  const [winner, setWinner] = useState<SquareValue>(null);
  const [isDraw, setIsDraw] = useState<boolean>(false);

  const winningLines: number[][] = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const checkWinner = (currentBoard: BoardState): SquareValue => {
    for (let i = 0; i < winningLines.length; i++) {
      const [a, b, c] = winningLines[i];
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return currentBoard[a];
      }
    }
    return null;
  };

  const executeBotMove = (index: number): void => {
    setBoard((prev) => {
      const nextBoard = [...prev];
      nextBoard[index] = 'O';
      
      const gameWinner = checkWinner(nextBoard);
      if (gameWinner) {
        setWinner(gameWinner);
      } else if (!nextBoard.includes(null)) {
        setIsDraw(true);
      } else {
        setIsUserTurn(true);
      }
      return nextBoard;
    });
  };

  const makeBotMove = useCallback((currentBoard: BoardState): void => {
    const availableIndices = currentBoard
      .map((val, idx) => (val === null ? idx : null))
      .filter((val): val is number => val !== null);

    if (availableIndices.length === 0) return;

    for (let i = 0; i < availableIndices.length; i++) {
      const testIndex = availableIndices[i];
      const testBoard = [...currentBoard];
      testBoard[testIndex] = 'O';
      if (checkWinner(testBoard) === 'O') {
        executeBotMove(testIndex);
        return;
      }
    }

    for (let i = 0; i < availableIndices.length; i++) {
      const testIndex = availableIndices[i];
      const testBoard = [...currentBoard];
      testBoard[testIndex] = 'X';
      if (checkWinner(testBoard) === 'X') {
        executeBotMove(testIndex);
        return;
      }
    }

    if (availableIndices.includes(4)) {
      executeBotMove(4);
      return;
    }

    const randomIdx = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    executeBotMove(randomIdx);
  }, []);

  const handleSquareClick = (index: number): void => {
    if (board[index] || winner || isDraw || !isUserTurn) return;

    const nextBoard = [...board];
    nextBoard[index] = 'X';
    setBoard(nextBoard);

    const gameWinner = checkWinner(nextBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else if (!nextBoard.includes(null)) {
      setIsDraw(true);
    } else {
      setIsUserTurn(false);
    }
  };

  useEffect(() => {
    if (!isUserTurn && !winner && !isDraw) {
      const timer = setTimeout(() => {
        makeBotMove(board);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isUserTurn, board, winner, isDraw, makeBotMove]);

  const resetGame = (): void => {
    setBoard(Array(9).fill(null));
    setIsUserTurn(true);
    setWinner(null);
    setIsDraw(false);
  };

  return (
    <div className="max-w-md w-full bg-zinc-900/50 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl flex flex-col items-center">
      <div className="w-full flex justify-center items-center h-12 mb-6 rounded-xl bg-zinc-950/60 border border-zinc-900 text-xs font-mono font-medium text-zinc-400">
        {winner ? (
          <span className={winner === 'X' ? 'text-emerald-400' : 'text-rose-400'}>
            {winner === 'X' ? '🎉 YOU WIN!' : '🤖 BOT WINS!'}
          </span>
        ) : isDraw ? (
          <span className="text-amber-400">🤝 DRAW MATCH</span>
        ) : (
          <div className="flex items-center gap-2">
            {isUserTurn ? (
              <><FaUser className="text-blue-400 animate-pulse" /> YOUR MOVE (X)</>
            ) : (
              <><FaRobot className="text-purple-400 animate-bounce" /> BOT THINKING... (O)</>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 w-full aspect-square mb-6">
        {board.map((value, idx) => (
          <button
            key={idx}
            onClick={() => handleSquareClick(idx)}
            disabled={value !== null || winner !== null || isDraw || !isUserTurn}
            className={`text-4xl font-black rounded-2xl border transition duration-300 flex items-center justify-center select-none
              ${value === null && !winner && !isDraw && isUserTurn ? 'border-zinc-800 bg-zinc-900/20 hover:border-blue-500/40 hover:bg-blue-500/5 cursor-pointer' : 'border-zinc-900 bg-zinc-950/40 cursor-default'}
              ${value === 'X' ? 'text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(96,165,250,0.05)]' : ''}
              ${value === 'O' ? 'text-purple-400 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.05)]' : ''}
            `}
          >
            {value}
          </button>
        ))}
      </div>

      <button onClick={resetGame} className="px-4 py-2 rounded-xl border border-white/10 bg-zinc-900/50 hover:bg-white/10 transition text-xs font-mono text-zinc-300 inline-flex items-center gap-2 cursor-pointer">
        Reset <FaRotateLeft size={12} className="text-blue-400" />
      </button>
    </div>
  );
}