import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ShieldAlert, Trophy, RotateCcw, RefreshCw } from "lucide-react";

export function AlertOverlays({ alertStatus, winner, promotionPending, onPromotion, onReset }) {
  return (
    <AnimatePresence>
      {alertStatus === "check" && (
        <motion.div 
          initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
          className="absolute top-6 z-50 bg-amber-500 text-black font-mono font-bold px-6 py-2.5 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)] border border-amber-300 text-xs tracking-wider"
        >
          <AlertTriangle size={16} className="animate-pulse" />
          <span>SYSTEM // KING IS UNDER CHECK</span>
        </motion.div>
      )}

      {promotionPending && (
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} className="bg-zinc-900/95 border border-indigo-500/30 p-4 rounded-2xl w-full max-w-[260px] text-center shadow-2xl backdrop-blur-md">
            <div className="w-8 h-8 bg-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center mx-auto mb-2">
              <ShieldAlert size={16} />
            </div>
            <h3 className="text-sm font-black text-white tracking-tight">Pawn Promotion</h3>
            <p className="text-[10px] text-slate-400 mt-0.5 mb-3">Select upgrade type:</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { type: "q", label: "Queen", icon: promotionPending.color === "w" ? "♕" : "♛" },
                { type: "r", label: "Rook", icon: promotionPending.color === "w" ? "♖" : "♜" },
                { type: "b", label: "Bishop", icon: promotionPending.color === "w" ? "♗" : "♝" },
                { type: "n", label: "Knight", icon: promotionPending.color === "w" ? "♘" : "♞" },
              ].map((choice) => (
                <button key={choice.type} onClick={() => onPromotion(choice.type)} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5 hover:border-indigo-500/40 hover:bg-indigo-500/10 transition group text-left">
                  <span className="text-xl text-white group-hover:scale-110 transition-transform">{choice.icon}</span>
                  <span className="text-[10px] font-mono text-slate-400 group-hover:text-white">{choice.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {alertStatus === "checkmate" && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center">
          <motion.div initial={{ y: 30, scale: 0.95 }} animate={{ y: 0, scale: 1 }} className="bg-zinc-900 border border-red-500/30 p-8 rounded-[2.5rem] max-w-sm shadow-[0_0_50px_rgba(239,68,68,0.2)]">
            <div className="w-14 h-14 bg-red-500/10 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/20"><Trophy size={28} /></div>
            <h2 className="text-2xl font-black tracking-tight text-red-500">CHECK MATE</h2>
            <p className="text-slate-400 mt-2 text-xs leading-relaxed">The target objective is fully locked.<br /><span className="text-white font-bold text-sm mt-2 block">Victory for Team {winner}!</span></p>
            <button onClick={onReset} className="mt-6 w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold flex items-center justify-center gap-2 text-xs tracking-wide transition"><RotateCcw size={14} /> Start New Simulation</button>
          </motion.div>
        </div>
      )}

      {alertStatus === "stalemate" && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center">
          <motion.div initial={{ y: 30, scale: 0.95 }} animate={{ y: 0, scale: 1 }} className="bg-zinc-900 border border-amber-500/30 p-8 rounded-[2.5rem] max-w-sm shadow-[0_0_50px_rgba(245,158,11,0.15)]">
            <div className="w-14 h-14 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/20"><RefreshCw size={28} /></div>
            <h2 className="text-2xl font-black tracking-tight text-amber-500">DRAW / STALEMATE</h2>
            <p className="text-slate-400 mt-2 text-xs leading-relaxed">The King is safe but contains zero legal movement pathways remaining.<br /><span className="text-white font-bold text-sm mt-2 block">The match ends in a Draw.</span></p>
            <button onClick={onReset} className="mt-6 w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-bold flex items-center justify-center gap-2 text-xs tracking-wide transition"><RotateCcw size={14} /> Reset Combat Arena</button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}