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

  const isGameActive = board.some(value => value !== null);

  return (
    <div className="max-w-sm lg:max-w-2xl w-full bg-zinc-900/50 border border-white/10 p-5 rounded-[2rem] backdrop-blur-xl flex flex-col items-center select-none touch-none">
      
      {/* Top Turn / Diagnostic Match Outcome Banner */}
      <div className="w-full flex justify-center items-center h-10 mb-4 rounded-xl bg-zinc-950/60 border border-zinc-900/80 text-xs font-mono font-medium text-zinc-400">
        {winner ? (
          <span className={winner === 'X' ? 'text-emerald-400 tracking-wider font-bold' : 'text-rose-400 tracking-wider font-bold'}>
            {winner === 'X' ? '🎉 YOU WIN!' : '🤖 BOT WINS!'}
          </span>
        ) : isDraw ? (
          <span className="text-amber-400 tracking-wider font-bold">🤝 DRAW MATCH</span>
        ) : (
          <div className="flex items-center gap-2 tracking-widest uppercase text-[11px]">
            {isUserTurn ? (
              <><FaUser className="text-blue-400 animate-pulse" /> YOUR MOVE (X)</>
            ) : (
              <><FaRobot className="text-purple-400 animate-bounce" /> BOT THINKING...</>
            )}
          </div>
        )}
      </div>

      {/* Side-By-Side Grid Layout Split */}
      <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-6">
        
        {/* Left Interactive Arena Grid Block */}
        <div className="w-full max-w-[300px] xs:max-w-sm aspect-square flex items-center justify-center">
          <div className="grid grid-cols-3 gap-2.5 w-full aspect-square bg-zinc-950 border border-zinc-800/80 p-2.5 rounded-2xl shadow-inner content-center">
            {board.map((value, idx) => (
              <button
                key={idx}
                onClick={() => handleSquareClick(idx)}
                disabled={value !== null || winner !== null || isDraw || !isUserTurn}
                /* FIX Applied: Included relative layout boundaries and structural locked aspect ratios */
                className={`relative w-full aspect-square text-3xl font-black rounded-xl border transition duration-200 flex items-center justify-center select-none active:scale-95 overflow-hidden
                  ${value === null && !winner && !isDraw && isUserTurn ? 'border-zinc-800 bg-zinc-900/20 hover:border-blue-500/40 hover:bg-blue-500/5 cursor-pointer' : 'border-zinc-900/60 bg-zinc-950/40 cursor-default'}
                  ${value === 'X' ? 'text-blue-400 border-blue-500/20 shadow-[0_0_12px_rgba(96,165,250,0.05)]' : ''}
                  ${value === 'O' ? 'text-purple-400 border-purple-500/20 shadow-[0_0_12px_rgba(168,85,247,0.05)]' : ''}
                `}
              >
                {/* FIX Applied: Wrapped the input markers inside an absolute center container so typography calculations cannot warp the parent element */}
                <span className="absolute inset-0 flex items-center justify-center">
                  {value}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Operations Panel Block */}
        <div className="flex flex-col items-center justify-center min-w-[160px] h-[50px] lg:h-auto py-2">
          
          <div className="hidden lg:flex flex-col items-center text-center gap-2 mb-4 max-w-[160px] font-mono">
            <span className="text-[10px] text-zinc-500 tracking-widest uppercase">Engine Type</span>
            <span className="text-[11px] text-zinc-300 font-bold tracking-wider border border-zinc-800 bg-zinc-950/60 px-2 py-1 rounded-md">MATRIX_v1.0</span>
          </div>

          <div className={`transition-all duration-300 ${isGameActive || winner || isDraw ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
            <button 
              onClick={resetGame} 
              className="px-4 py-2 rounded-xl border border-white/10 bg-zinc-950/40 hover:bg-white/5 transition text-[11px] font-mono text-zinc-400 inline-flex items-center gap-2 cursor-pointer active:scale-95 shadow-md"
            >
              Reset Matrix <FaRotateLeft size={11} className="text-blue-400" />
            </button>
          </div>
          
        </div>

      </div>

    </div>
  );
}