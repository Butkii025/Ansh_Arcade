"use client";

import React from "react";
import { useChessEngine } from "./hooks/useChessEngine";
import { ChessBoard } from "./subcomponents/ChessBoard";
import { SidePanel } from "./subcomponents/SidePanel";
import { AlertOverlays } from "./subcomponents/AlertOverlays";

export default function ChessGameApp() {
  const {
    board, selected, turn, moves, alertStatus, winner, promotionPending, validMoves, capturedScores,
    resetGame, handleClick, handlePromotionChoice
  } = useChessEngine();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white flex items-center justify-center p-4 relative select-none">
      
      <AlertOverlays 
        alertStatus={alertStatus}
        winner={winner}
        promotionPending={promotionPending}
        onPromotion={handlePromotionChoice}
        onReset={resetGame}
        scores={capturedScores}
      />

      <div className="w-full max-w-7xl grid lg:grid-cols-[1fr_350px] gap-6 items-center">
        <ChessBoard 
          board={board}
          selected={selected}
          turn={turn}
          validMoves={validMoves}
          handleClick={handleClick}
          resetGame={resetGame}
        />
        {/* Pass down the pure tracked scores directly here */}
        <SidePanel moves={moves} scores={capturedScores} />
      </div>

    </div>
  );
}