import React from "react";
import { motion } from "framer-motion";
import { Crown, RotateCcw, Sparkles, Swords, ShieldCheck } from "lucide-react";
import { pieces } from "../utils/chessRules";

export function ChessBoard({ board, selected, turn, validMoves, handleClick, resetGame }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[32px] p-4 shadow-2xl flex flex-col items-center w-full">
      <div className="w-full max-w-[460px] flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
        <h1 className="text-2lg flex items-center gap-1.5 tracking-tight uppercase tracking-widest text-slate-500 "><Crown className="text-yellow-400" size={22} /> Kriyon Chess_Arena</h1>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-400/20 text-xs">Turn: <span className="font-bold text-indigo-300">{turn === "w" ? "White" : "Black"}</span></div>
          <button onClick={resetGame} className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs transition"><RotateCcw size={12} /> Reset</button>
        </div>
      </div>

      <div className="w-full max-w-[460px] aspect-square grid grid-cols-8 overflow-hidden rounded-2xl border-4 border-slate-950 shadow-2xl bg-slate-950">
        {board.map((row, r) =>
          row.map((cell, c) => {
            const isDarkSquare = (r + c) % 2 === 1;
            const active = selected?.[0] === r && selected?.[1] === c;
            const canMove = validMoves.some(([vr, vc]) => vr === r && vc === c);

            return (
              <button key={`${r}-${c}`} onClick={() => handleClick(r, c)} className={`relative aspect-square w-full h-full flex items-center justify-center p-0 transition-all duration-100 outline-none overflow-hidden ${isDarkSquare ? "bg-[#70a2ca]" : "bg-[#eae9d2]"} ${active ? "ring-4 ring-inset ring-cyan-400 z-20" : ""}`}>
                <div className="invisible w-full h-full pointer-events-none select-none"></div>
                {canMove && <div className="absolute w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.7)] z-20" />}
                {cell && (
                  <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <span className={`text-2xl sm:text-3xl md:text-4xl font-normal leading-none font-sans select-none ${cell[0] === "w" ? "text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.65)]" : "text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]"}`}>{pieces[cell]}</span>
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 w-full max-w-[460px] mt-4">
        <div className="bg-white/5 border border-white/5 rounded-xl p-2.5 text-center">
          <div className="text-[10px] font-bold text-yellow-400 flex items-center justify-center gap-1 mb-0.5 uppercase tracking-wide"><Sparkles size={11} /> v2.5.0</div>
          <p className="text-[9px] text-slate-400 leading-tight">Pawn promotions live.</p>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-xl p-2.5 text-center">
          <div className="text-[10px] font-bold text-cyan-400 flex items-center justify-center gap-1 mb-0.5 uppercase tracking-wide"><Swords size={11} />Validation</div>
          <p className="text-[9px] text-slate-400 leading-tight">Scoring Feachure Added</p>
        </div>
      </div>
    </motion.div>
  );
}