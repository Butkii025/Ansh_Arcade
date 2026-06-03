'use client';

import React, { useState } from 'react';
import { FaBrain, FaRobot, FaGamepad, FaChessKnight, FaArrowLeft } from 'react-icons/fa';
import TicTacToe from './games/TicTacToe';
import RetroSnake from './games//RetroSnake';
import ChessGameApp from './games//chess/ChessGameApp';
import VisitorCounter from '../components/VisitorCounter';
import FooterPanel from '../components/FooterPanel';



type GameId = 'tic-tac-toe' | 'retro-snake' | 'chess-game-app' | null;

interface GameItem {
  id: Exclude<GameId, null>;
  title: string;
  description: string;
  icon: React.JSX.Element;
  tag: string;
  color: string;
  borderColor: string;
  glowColor: string;
}

export default function HomeArcade(): React.JSX.Element {
  const [activeGame, setActiveGame] = useState<GameId>(null);

  const gamesList: GameItem[] = [
    {
      id: 'tic-tac-toe',
      title: 'Tic-Tac-Toe AI',
      description: 'Face off against a defensive bot algorithm that calculates blocks and center control dynamically.',
      icon: <FaRobot className="text-purple-400 group-hover:scale-110 transition duration-300" size={24} />,
      tag: 'AI Logic',
      color: 'from-purple-500/10 via-purple-500/5 to-transparent',
      borderColor: 'hover:border-purple-500/40',
      glowColor: 'group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]'
    },
    {
      id: 'retro-snake',
      title: 'Retro Snake Grid',
      description: 'Classic arcade grid physics rebuilt with high-speed coordinate interval loop tracking systems.',
      icon: <FaGamepad className="text-emerald-400 group-hover:scale-110 transition duration-300" size={24} />,
      tag: 'Classic Mechanics',
      color: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
      borderColor: 'hover:border-emerald-500/40',
      glowColor: 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]'
    },
    {
      id: 'chess-game-app', 
      title: 'Chess Endgames',
      description: 'Under Development',
      icon: <FaChessKnight className="text-blue-400 group-hover:scale-110 transition duration-300" size={24} />,
      tag: 'Strategy Matrix',
      color: 'from-blue-500/10 via-blue-500/5 to-transparent',
      borderColor: 'hover:border-blue-500/40',
      glowColor: 'group-hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]'
    }
  ];

  const getSubheaderText = () => {
    if (!activeGame) return 'Built For : Frictionless Multi-Game Matrix';
    const match = gamesList.find(g => g.id === activeGame);
    return match ? `Running Mode // ${match.title}` : '';
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 selection:text-blue-200 relative overflow-x-hidden p-6 md:p-12">
      
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full filter blur-[120px] pointer-events-none" />



      <div className="max-w-5xl mx-auto pt-12 pb-12 flex flex-col items-center relative z-10">
        
        <header className="text-center mb-20  transition-all duration-500 ease-in-out">
        
          <h1 className={`font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-zinc-200 to-zinc-600 select-none transition-all duration-500 ease-in-out ${
            activeGame ? 'text-3xl md:text-4xl' : 'text-5xl md:text-7xl'
          }`}>
            Xela_Arcade
          </h1>

          <p className={`tracking-[0.25em] uppercase font-semibold max-w-md mx-auto mt-3 transition-all duration-500 ${
            activeGame ? 'text-purple-400 text-xs md:text-sm tracking-widest' : 'text-zinc-500 text-[10px] md:text-xs'
          }`}>
            {getSubheaderText()}
          </p>
          
        </header>

        {!activeGame ? (
          <section className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-8 border-b border-zinc-900 pb-4">
              <h3 className="text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase">Available Core Frameworks</h3>
              <span className="text-[10px] font-mono bg-zinc-900 text-zinc-500 border border-zinc-800 px-2.5 py-0.5 rounded-full">
                {gamesList.length} Online 
              </span>
              
              <p className="text-[10px] font-mono text-zinc-500 tracking-widest border-l border-zinc-800 pl-4">
                🕹️ ARCADE VISITORS: <VisitorCounter />
              </p>
              
            </div>

            <div className="grid md:grid-cols-3 gap-6 w-full">
              {gamesList.map((game) => (
                <div
                  key={game.id}
                  onClick={() => setActiveGame(game.id)}
                  className={`group p-6 rounded-[2rem] bg-gradient-to-b ${game.color} border border-white/5 ${game.borderColor} ${game.glowColor} backdrop-blur-md transition-all duration-300 flex flex-col h-full cursor-pointer hover:-translate-y-1.5`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-900 shadow-inner group-hover:border-zinc-800 transition">
                      {game.icon}
                    </div>
                    <span className="text-[9px] font-mono tracking-wider uppercase text-zinc-500 bg-zinc-950 px-2.5 py-1 rounded-md border border-zinc-900/40">
                      {game.tag}
                    </span>
                  </div>
                  
                  <h4 className="text-white font-bold text-lg tracking-tight group-hover:text-zinc-200 transition">
                    {game.title}
                  </h4>
                  
                  <p className="text-zinc-500 text-xs leading-relaxed mt-2 flex-grow">
                    {game.description}
                  </p>

                  <div className="mt-6 pt-4 border-t border-zinc-950 text-[10px] font-mono tracking-widest text-blue-400 group-hover:text-white uppercase font-bold inline-flex items-center gap-1.5 transition">
                    Boot System →
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
            
            <div className="w-full max-w-md flex items-center justify-start mb-6 px-2">
              <button 
                onClick={() => setActiveGame(null)}
                className="text-xs font-mono text-zinc-500 hover:text-white transition duration-200 inline-flex items-center gap-2 group cursor-pointer"
              >
                <FaArrowLeft size={10} className="group-hover:-translate-x-0.5 transition" /> Close Console
              </button>
            </div>

            <div className="w-full flex justify-center relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-[3rem] blur-xl opacity-30 pointer-events-none" />
              <div className="relative w-full flex justify-center">
                {activeGame === 'tic-tac-toe' && <TicTacToe />}
                {activeGame === 'retro-snake' && <RetroSnake />}
                {activeGame === 'chess-game-app' && <ChessGameApp />}
              </div>
            </div>
          </section>
        )}
      </div>
      
      <p className="text-center mt-10  transition-all duration-500 ease-in-out">
          {!activeGame && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-4 animate-in fade-in duration-300 mt-4">
              <FaBrain className="text-blue-400 animate-pulse" /> Game Environment Lobby 
              designed by
              <div className="flex flex-wrap gap-3">
                <a 
                href="https://p-vijay.vercel.app/" 
                target="_blank" 
                rel="noreferrer"
                className="hover:bg-zinc-800 text-zinc-400 hover:text-blue-500 transition-all duration-300 shadow-xl active:scale-90"
                >P_Vijay
                </a>
              </div>
            </div>
          )}
        </p>

       <FooterPanel />
    </div>
  );
}
