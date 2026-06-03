import React from "react";
import { motion } from "framer-motion";

export function SidePanel({ moves, scores = { white: 0, black: 0 } }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[32px] p-6 shadow-2xl flex flex-col gap-4 max-h-[85vh] lg:h-[570px] overflow-hidden"
    >
      <div>
        <h2 className="text-lg font-bold tracking-tight">Live Match Logs</h2>
        <p className="text-slate-400 mt-0.5 text-xs">Real-time transactional verification matrix.</p>
      </div>

      {/* MOVE MATRIX */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar min-h-[150px]">
        {moves.length === 0 ? (
          <div className="text-xs text-slate-500 italic p-4 text-center border border-dashed border-white/10 rounded-xl">
            No secure tactical movements logged.
          </div>
        ) : (
          moves.map((move, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs flex justify-between items-center font-mono">
              <span className="text-slate-500">#{String(idx + 1).padStart(2, '0')}</span>
              <span className="font-bold text-cyan-400 tracking-wider text-[11px]">{move}</span>
            </div>
          ))
        )}
      </div>

      {/* VERIFIED LIVE SCORE PANEL */}
      <div className="grid grid-cols-2 gap-2 bg-white/5 border border-white/5 rounded-2xl p-3 font-mono">
        <div className="bg-white/[0.02] border border-white/5 p-2 rounded-xl text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">White Points</div>
          <div className="text-xl font-black text-white tracking-tight">
            {scores.white} <span className="text-[10px] text-slate-500 font-normal">PTS</span>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 p-2 rounded-xl text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Black Points</div>
          <div className="text-xl font-black text-cyan-400 tracking-tight">
            {scores.black} <span className="text-[10px] text-slate-500 font-normal">PTS</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}