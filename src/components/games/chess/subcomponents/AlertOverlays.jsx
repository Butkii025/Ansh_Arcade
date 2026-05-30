import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, RefreshCw, Sparkles } from "lucide-react";

export function AlertOverlays({ alertStatus, winner, promotionPending, onPromotion, onReset, scores = { white: 0, black: 0 } }) {
  
  const winningScore = winner === "White" ? scores.white : scores.black;

  return (
    <AnimatePresence>
      {/* CHECKMATE / VICTORY OVERLAY CARD */}
      {alertStatus === "checkmate" && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }} 
            animate={{ scale: 1, y: 0 }} 
            className="bg-slate-900 border border-emerald-500/30 rounded-[32px] p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl" />

            <div className="mx-auto w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 shadow-lg shadow-emerald-500/5">
              <Trophy size={32} className="animate-bounce" />
            </div>

            <h2 className="text-3xl font-black tracking-tight text-white uppercase font-mono">
              {winner} Victory!
            </h2>
            
            <p className="text-slate-400 text-sm mt-2">
              Tactical domination achieved via systematic checkmate matrix.
            </p>

            {/* LIVE WINNING SCORE COMPONENT DISPLAY */}
            <div className="my-6 bg-white/5 border border-white/5 rounded-2xl p-4 font-mono">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Final Score Tally</div>
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                {winningScore} <span className="text-xs font-bold text-slate-500">PTS</span>
              </div>
            </div>

            <button 
              onClick={onReset} 
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold py-3.5 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 active:scale-[0.98]"
            >
              <RefreshCw size={18} />
              Initialize Next Simulation
            </button>
          </motion.div>
        </motion.div>
      )}

      {/*  STALEMATE OVERLAY CARD */}
      {alertStatus === "stalemate" && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }} 
            animate={{ scale: 1, y: 0 }} 
            className="bg-slate-900 border border-white/10 rounded-[32px] p-8 max-w-md w-full text-center shadow-2xl"
          >
            <div className="mx-auto w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-slate-400 mb-6">
              <RefreshCw size={28} className="animate-spin" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white uppercase font-mono">Stalemate</h2>
            <p className="text-slate-400 text-xs mt-1 mb-6">No legal operations remaining. Tactical deadlock verified.</p>
            <button 
              onClick={onReset} 
              className="w-full bg-white/10 hover:bg-white/15 text-white font-bold py-3.5 px-6 rounded-2xl transition-all border border-white/5"
            >
              Restart Simulation
            </button>
          </motion.div>
        </motion.div>
      )}

      {/*  LIVE PROMOTION SELECTION MODAL */}
      {promotionPending && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 10 }} 
            animate={{ scale: 1, y: 0 }} 
            className="bg-slate-900/90 border border-white/10 backdrop-blur-xl rounded-[32px] p-6 max-w-sm w-full text-center shadow-2xl"
          >
            <div className="flex justify-center gap-2 text-cyan-400 mb-3">
              <Sparkles size={16} />
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">Pawn Sequence Promotion</span>
              <Sparkles size={16} />
            </div>
            <h3 className="text-lg font-bold text-white mb-5">Select Upgrade</h3>
            <div className="grid grid-cols-4 gap-2.5">
              {[
                { type: "Q", label: "Queen" },
                { type: "R", label: "Rook" },
                { type: "B", label: "Bishop" },
                { type: "N", label: "Knight" }
              ].map((p) => (
                <button
                  key={p.type}
                  onClick={() => onPromotion(p.type)}
                  className="bg-white/5 hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/30 p-4 rounded-xl text-center transition-all group active:scale-95"
                >
                  <span className="text-xl font-bold block text-slate-300 group-hover:text-cyan-400 uppercase font-mono">
                    {p.type}
                  </span>
                  <span className="text-[9px] text-slate-500 group-hover:text-cyan-500 block mt-1 font-mono">
                    {p.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}