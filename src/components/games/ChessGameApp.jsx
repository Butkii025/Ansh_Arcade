"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, RotateCcw, Sparkles, Swords, ShieldCheck, Trophy, AlertTriangle, ShieldAlert, RefreshCw } from "lucide-react";

const initialBoard = [
  ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
  ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
  ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"],
];

const pieces = {
  wp: "♙", wr: "♖", wn: "♘", wb: "♗", wq: "♕", wk: "♔",
  bp: "♟", br: "♜", bn: "♞", bb: "♝", bq: "♛", bk: "♚",
};

// --- STRATEGY ENGINE HELPERS ---
function findKing(board, color) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === `${color}k`) return [r, c];
    }
  }
  return null;
}

function isSquareAttacked(board, r, c, attackerColor) {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (!piece || piece[0] !== attackerColor) continue;

      const type = piece[1];
      if (type === "p") {
        const dir = attackerColor === "w" ? -1 : 1;
        if (i + dir === r && (j - 1 === c || j + 1 === c)) return true;
      } else if (type === "n") {
        const nMoves = [
          [-2,-1], [-2,1], [-1,-2], [-1,2],
          [1,-2], [1,2], [2,-1], [2,1]
        ];
        if (nMoves.some(([dr, dc]) => i + dr === r && j + dc === c)) return true;
      } else if (type === "k") {
        const kMoves = [
          [-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]
        ];
        if (kMoves.some(([dr, dc]) => i + dr === r && j + dc === c)) return true;
      } else {
        let dirs = [];
        if (type === "b" || type === "q") dirs.push([1, 1], [1, -1], [-1, 1], [-1, -1]);
        if (type === "r" || type === "q") dirs.push([1, 0], [-1, 0], [0, 1], [0, -1]);

        for (let [dr, dc] of dirs) {
          let nr = i + dr;
          let nc = j + dc;
          while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
            if (nr === r && nc === c) return true;
            if (board[nr][nc]) break;
            nr += dr;
            nc += dc;
          }
        }
      }
    }
  }
  return false;
}

function getRawMoves(board, r, c) {
  const piece = board[r][c];
  if (!piece) return [];
  const color = piece[0];
  const type = piece[1];
  const dirs = [];

  const add = (nr, nc) => {
    if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
      const target = board[nr][nc];
      if (!target || target[0] !== color) dirs.push([nr, nc]);
    }
  };

  if (type === "p") {
    const dir = color === "w" ? -1 : 1;
    const start = color === "w" ? 6 : 1;
    if (!board[r + dir]?.[c]) {
      dirs.push([r + dir, c]);
      if (r === start && !board[r + dir * 2]?.[c]) {
        dirs.push([r + dir * 2, c]);
      }
    }
    [[dir, -1], [dir, 1]].forEach(([dr, dc]) => {
      const target = board[r + dr]?.[c + dc];
      if (target && target[0] !== color) dirs.push([r + dr, c + dc]);
    });
  }

  if (type === "n") {
    [[-2,-1], [-2,1], [-1,-2], [-1,2], [1,-2], [1,2], [2,-1], [2,1]].forEach(([dr, dc]) => add(r + dr, c + dc));
  }

  const slide = (directions) => {
    directions.forEach(([dr, dc]) => {
      let nr = r + dr, nc = c + dc;
      while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        const target = board[nr][nc];
        if (!target) dirs.push([nr, nc]);
        else {
          if (target[0] !== color) dirs.push([nr, nc]);
          break;
        }
        nr += dr; nc += dc;
      }
    });
  };

  if (type === "b") slide([[1, 1], [1, -1], [-1, 1], [-1, -1]]);
  if (type === "r") slide([[1, 0], [-1, 0], [0, 1], [0, -1]]);
  if (type === "q") slide([[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]]);
  if (type === "k") {
    [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]].forEach(([dr, dc]) => add(r + dr, c + dc));
  }

  return dirs;
}

// Filter core moves to ensure safety state allocations
function getLegalMoves(board, r, c) {
  const piece = board[r][c];
  if (!piece) return [];
  const color = piece[0];
  const raw = getRawMoves(board, r, c);
  
  return raw.filter(([tr, tc]) => {
    const nextBoard = board.map(row => [...row]);
    nextBoard[tr][tc] = piece;
    nextBoard[r][c] = null;
    const kingPos = findKing(nextBoard, color);
    if (!kingPos) return false;
    return !isSquareAttacked(nextBoard, kingPos[0], kingPos[1], color === "w" ? "b" : "w");
  });
}

export default function ChessGameApp() {
  const [board, setBoard] = useState(initialBoard);
  const [selected, setSelected] = useState(null);
  const [turn, setTurn] = useState("w");
  const [moves, setMoves] = useState([]);
  
  // Game state system notices
  const [alertStatus, setAlertStatus] = useState(null); // 'check', 'checkmate', 'stalemate'
  const [winner, setWinner] = useState(null); 

  // Pawn Promotion State Block
  const [promotionPending, setPromotionPending] = useState(null); 

  const resetGame = () => {
    setBoard(initialBoard);
    setSelected(null);
    setTurn("w");
    setMoves([]);
    setAlertStatus(null);
    setWinner(null);
    setPromotionPending(null);
  };

  const validMoves = useMemo(() => {
    if (!selected || promotionPending) return [];
    return getLegalMoves(board, selected[0], selected[1]);
  }, [selected, board, promotionPending]);

  const checkGameEndConditions = (nextBoard, nextTurn) => {
    const opponentColor = nextTurn;
    const playerColor = nextTurn === "w" ? "b" : "w";
    
    let totalLegalMoves = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (nextBoard[r][c] && nextBoard[r][c][0] === opponentColor) {
          totalLegalMoves += getLegalMoves(nextBoard, r, c).length;
        }
      }
    }

    const kingPos = findKing(nextBoard, opponentColor);
    const isKingChecked = kingPos ? isSquareAttacked(nextBoard, kingPos[0], kingPos[1], playerColor) : false;

    if (isKingChecked) {
      if (totalLegalMoves === 0) {
        setAlertStatus("checkmate");
        setWinner(playerColor === "w" ? "White" : "Black");
      } else {
        setAlertStatus("check");
        setTimeout(() => setAlertStatus(null), 2000);
      }
    } else if (totalLegalMoves === 0) {
      // Stalemate / Draw Condition triggered securely
      setAlertStatus("stalemate");
    }
  };

  const movePiece = (r, c) => {
    if (!selected) return;

    const isValid = validMoves.some(([vr, vc]) => vr === r && vc === c);
    if (!isValid) return;

    const [sr, sc] = selected;
    const piece = board[sr][sc];
    
    const isPawn = piece[1] === "p";
    const reachesEndRow = (piece[0] === "w" && r === 0) || (piece[0] === "b" && r === 7);

    if (isPawn && reachesEndRow) {
      setPromotionPending({ r, c, fromRow: sr, fromCol: sc, color: piece[0] });
      setSelected(null);
      return; 
    }

    const updated = board.map((row) => [...row]);
    updated[r][c] = piece;
    updated[sr][sc] = null;

    const nextTurn = turn === "w" ? "b" : "w";
    
    setBoard(updated);
    setMoves((prev) => [...prev, `${piece.toUpperCase()} → ${String.fromCharCode(97 + c)}${8 - r}`]);
    setSelected(null);
    setTurn(nextTurn);

    checkGameEndConditions(updated, nextTurn);
  };

  const handlePromotionChoice = (pieceType) => {
    if (!promotionPending) return;
    const { r, c, fromRow, fromCol, color } = promotionPending;
    
    const upgradedPiece = `${color}${pieceType}`;
    const updated = board.map((row) => [...row]);
    
    updated[r][c] = upgradedPiece;
    updated[fromRow][fromCol] = null;

    const nextTurn = turn === "w" ? "b" : "w";

    setBoard(updated);
    setMoves((prev) => [...prev, `Pawn ➔ ${upgradedPiece.toUpperCase()} (${String.fromCharCode(97 + c)}${8 - r})`]);
    setPromotionPending(null);
    setTurn(nextTurn);

    checkGameEndConditions(updated, nextTurn);
  };

  const handleClick = (r, c) => {
    if (winner || alertStatus === "checkmate" || alertStatus === "stalemate" || promotionPending) return; 
    const piece = board[r][c];

    if (selected) {
      if (selected[0] === r && selected[1] === c) {
        setSelected(null);
        return;
      }
      if (piece && piece[0] === turn) {
        setSelected([r, c]);
        return;
      }
      movePiece(r, c);
    } else if (piece && piece[0] === turn) {
      setSelected([r, c]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white flex items-center justify-center p-4 relative select-none">
      
      {/* INTERACTIVE MODALS LAYER */}
      <AnimatePresence>
        {alertStatus === "check" && (
          <motion.div 
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-6 z-50 bg-amber-500 text-black font-mono font-bold px-6 py-2.5 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)] border border-amber-300 text-xs tracking-wider"
          >
            <AlertTriangle size={16} className="animate-pulse" />
            <span>SYSTEM // KING IS UNDER CHECK</span>
          </motion.div>
        )}

        {/* RE-ARCHITECTED SMALLER PROMOTION POPUP */}
        {promotionPending && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-zinc-900/95 border border-indigo-500/30 p-4 rounded-2xl w-full max-w-[260px] text-center shadow-2xl backdrop-blur-md"
            >
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
                  <button
                    key={choice.type}
                    onClick={() => handlePromotionChoice(choice.type)}
                    className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5 hover:border-indigo-500/40 hover:bg-indigo-500/10 transition group text-left"
                  >
                    <span className="text-xl text-white group-hover:scale-110 transition-transform">{choice.icon}</span>
                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-white">{choice.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* CHECKMATE END MODAL */}
        {alertStatus === "checkmate" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div 
              initial={{ y: 30, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              className="bg-zinc-900 border border-red-500/30 p-8 rounded-[2.5rem] max-w-sm shadow-[0_0_50px_rgba(239,68,68,0.2)]"
            >
              <div className="w-14 h-14 bg-red-500/10 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                <Trophy size={28} />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-red-500">CHECK MATE</h2>
              <p className="text-slate-400 mt-2 text-xs leading-relaxed">
                The target objective is fully locked.
                <br />
                <span className="text-white font-bold text-sm mt-2 block">Victory for Team {winner}!</span>
              </p>
              <button 
                onClick={resetGame}
                className="mt-6 w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold flex items-center justify-center gap-2 text-xs tracking-wide transition"
              >
                <RotateCcw size={14} /> Start New Simulation
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* BRAND NEW DYNAMIC STALEMATE DRAW MODAL */}
        {alertStatus === "stalemate" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div 
              initial={{ y: 30, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              className="bg-zinc-900 border border-amber-500/30 p-8 rounded-[2.5rem] max-w-sm shadow-[0_0_50px_rgba(245,158,11,0.15)]"
            >
              <div className="w-14 h-14 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                <RefreshCw size={28} className="animate-spin-slow" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-amber-500">DRAW / STALEMATE</h2>
              <p className="text-slate-400 mt-2 text-xs leading-relaxed">
                The King is safe but contains zero legal movement pathways remaining. 
                <br />
                <span className="text-white font-bold text-sm mt-2 block">The match ends in a Draw.</span>
              </p>
              <button 
                onClick={resetGame}
                className="mt-6 w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-bold flex items-center justify-center gap-2 text-xs tracking-wide transition"
              >
                <RotateCcw size={14} /> Reset Combat Arena
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-7xl grid lg:grid-cols-[1fr_350px] gap-6 items-center">
        <ChessBoard 
          board={board} 
          selected={selected} 
          turn={turn} 
          validMoves={validMoves} 
          handleClick={handleClick} 
          resetGame={resetGame} 
        />
        <SidePanel moves={moves} />
      </div>
    </div>
  );
}

function ChessBoard({ board, selected, turn, validMoves, handleClick, resetGame }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[32px] p-4 shadow-2xl flex flex-col items-center w-full"
    >
      {/* PANEL TITLE BAR */}
      <div className="w-full max-w-[460px] flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl font-black flex items-center gap-1.5 tracking-tight">
            <Crown className="text-yellow-400" size={22} />
            Neon Chess Arena
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-400/20 text-xs">
            Turn: <span className="font-bold text-indigo-300">{turn === "w" ? "White" : "Black"}</span>
          </div>
          <button
            onClick={resetGame}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs transition"
          >
            <RotateCcw size={12} /> Reset
          </button>
        </div>
      </div>

      {/* CHESSBOARD GRID CONTAINER */}
      <div className="w-full max-w-[460px] aspect-square grid grid-cols-8 overflow-hidden rounded-2xl border-4 border-slate-950 shadow-2xl bg-slate-950">
        {board.map((row, r) =>
          row.map((cell, c) => {
            const isDarkSquare = (r + c) % 2 === 1;
            const active = selected?.[0] === r && selected?.[1] === c;
            const canMove = validMoves.some(([vr, vc]) => vr === r && vc === c);

            return (
              <button
                key={`${r}-${c}`}
                onClick={() => handleClick(r, c)}
                className={`
                  relative aspect-square w-full h-full flex items-center justify-center p-0 transition-all duration-100 outline-none overflow-hidden
                  ${isDarkSquare ? "bg-[#70a2ca]" : "bg-[#eae9d2]"}
                  ${active ? "ring-4 ring-inset ring-cyan-400 z-20" : ""}
                `}
              >
                <div className="invisible w-full h-full pointer-events-none select-none"></div>

                {/* Valid Move Indicator Dots */}
                {canMove && (
                  <div className="absolute w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.7)] z-20" />
                )}

                {/* Absolutely Centered Graphics Wrapper */}
                {cell && (
                  <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <span
                      className={`
                        text-2xl sm:text-3xl md:text-4xl font-normal leading-none font-sans select-none transition-transform
                        ${cell[0] === "w" ? "text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.65)]" : "text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]"}
                      `}
                    >
                      {pieces[cell]}
                    </span>
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* FOOTER METRIC WIDGETS */}
      <div className="grid grid-cols-3 gap-2 w-full max-w-[460px] mt-4">
        <div className="bg-white/5 border border-white/5 rounded-xl p-2.5 text-center">
          <div className="text-[10px] font-bold text-yellow-400 flex items-center justify-center gap-1 mb-0.5 uppercase tracking-wide">
            <Sparkles size={11} /> Upgrades
          </div>
          <p className="text-[9px] text-slate-400 leading-tight">Pawn promotions live.</p>
        </div>

        <div className="bg-white/5 border border-white/5 rounded-xl p-2.5 text-center">
          <div className="text-[10px] font-bold text-cyan-400 flex items-center justify-center gap-1 mb-0.5 uppercase tracking-wide">
            <Swords size={11} /> Validation
          </div>
          <p className="text-[9px] text-slate-400 leading-tight">Anti-jumping raycast.</p>
        </div>

        <div className="bg-white/5 border border-white/5 rounded-xl p-2.5 text-center">
          <div className="text-[10px] font-bold text-green-400 flex items-center justify-center gap-1 mb-0.5 uppercase tracking-wide">
            <ShieldCheck size={11} /> Grid
          </div>
          <p className="text-[9px] text-slate-400 leading-tight">Pro Blue & Cream.</p>
        </div>
      </div>
    </motion.div>
  );
}

function SidePanel({ moves }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[32px] p-6 shadow-2xl flex flex-col gap-4 max-h-[85vh] lg:h-[570px] overflow-hidden"
    >
      <div>
        <h2 className="text-lg font-bold tracking-tight">Live Match Logs</h2>
        <p className="text-slate-400 mt-0.5 text-xs">
          Real-time transactional verification matrix.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar min-h-[150px]">
        {moves.length === 0 ? (
          <div className="text-xs text-slate-500 italic p-4 text-center border border-dashed border-white/10 rounded-xl">
            No secure tactical movements logged.
          </div>
        ) : (
          moves.map((move, idx) => (
            <div 
              key={idx} 
              className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs flex justify-between items-center font-mono"
            >
              <span className="text-slate-500">#{String(idx + 1).padStart(2, '0')}</span>
              <span className="font-bold text-cyan-400 tracking-wider text-[11px]">{move}</span>
            </div>
          ))
        )}
      </div>

      <div className="rounded-2xl bg-black/40 border border-white/5 p-4">
        <div className="text-[9px] uppercase tracking-widest text-slate-500 mb-1 font-mono">
          Engine Build Architecture
        </div>
        <div className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
          v1.5.0 // Production Setup
        </div>
      </div>
    </motion.div>
  );
}