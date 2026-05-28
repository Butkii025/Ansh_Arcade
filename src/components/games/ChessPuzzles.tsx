'use client';

import React, { useState } from 'react';
// Changed to legacy Font Awesome icons which are universally available
import { FaCheckCircle, FaTimesCircle, FaLightbulb } from 'react-icons/fa';

type PuzzleStatus = 'hint' | 'correct' | 'wrong';

export default function ChessPuzzles(): React.JSX.Element {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [status, setStatus] = useState<PuzzleStatus>('hint');

  const handleSquareClick = (coord: string): void => {
    setSelectedSquare(coord);
    if (coord === 'c6') {
      setStatus('correct');
    } else {
      setStatus('wrong');
    }
  };

  return (
    <div className="max-w-md w-full bg-zinc-900/50 border border-white/10 p-6 rounded-[2.5rem] backdrop-blur-xl flex flex-col items-center">
      <div className="text-center mb-4">
        <p className="text-blue-400 text-xs font-mono tracking-wider uppercase mb-1">Tactical Puzzle</p>
        <h4 className="text-white font-bold text-base">Find the Killer Knight Jump ♟️</h4>
      </div>

      <div className="grid grid-cols-4 bg-amber-900/20 border border-zinc-800 rounded-xl overflow-hidden mb-6 w-64 aspect-square shadow-inner">
        {['a8','b8','c8','d8','a7','b7','c7','d7','a6','b6','c6','d6','a5','b5','c5','d5'].map((square, idx) => {
          const isDark = (Math.floor(idx / 4) + (idx % 4)) % 2 === 1;
          const hasKing = square === 'c8';

          return (
            <button
              key={square}
              onClick={() => handleSquareClick(square)}
              className={`relative flex items-center justify-center text-xl transition duration-200 select-none aspect-square cursor-pointer
                ${isDark ? 'bg-zinc-800/40' : 'bg-zinc-950/20'} 
                ${selectedSquare === square ? 'ring-2 ring-blue-500 bg-blue-500/10 z-10' : 'hover:bg-white/5'}
              `}
            >
              {hasKing && <span className="text-2xl text-white drop-shadow">👑</span>}
              {square === 'c6' && selectedSquare !== 'c6' && <span className="w-2 h-2 bg-blue-400/30 rounded-full" />}
              
              <span className="absolute bottom-0.5 right-1 text-[8px] font-mono text-zinc-600 uppercase select-none">
                {square}
              </span>
            </button>
          );
        })}
      </div>

      <div className="w-full text-center p-3 rounded-xl bg-zinc-950/40 border border-zinc-900/60 text-xs font-mono min-h-10 flex items-center justify-center">
        {status === 'hint' && <p className="text-zinc-500 flex items-center gap-1.5"><FaLightbulb className="text-amber-400 shrink-0" /> Target the block to checkmate the black King.</p>}
        {status === 'correct' && <p className="text-emerald-400 flex items-center gap-1.5"><FaCheckCircle className="shrink-0" /> CORRECT! Nc6# Delivering smother checkmate.</p>}
        {/* Swapped FaCircleXmark out for the bulletproof FaTimesCircle */}
        {status === 'wrong' && <p className="text-rose-400 flex items-center gap-1.5"><FaTimesCircle className="shrink-0" /> WRONG MOVE. King escapes. Try another tile!</p>}
      </div>
    </div>
  );
}