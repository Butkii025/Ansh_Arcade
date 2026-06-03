import { useState, useMemo } from "react";
import { initialBoard, getLegalMoves, findKing, isSquareAttacked } from "../utils/chessRules";

export function useChessEngine() {
  const [board, setBoard] = useState(initialBoard);
  const [selected, setSelected] = useState(null);
  const [turn, setTurn] = useState("w");
  const [moves, setMoves] = useState([]);
  const [alertStatus, setAlertStatus] = useState(null); 
  const [winner, setWinner] = useState(null); 
  const [promotionPending, setPromotionPending] = useState(null); 

  const [capturedScores, setCapturedScores] = useState({ white: 0, black: 0 });

  const resetGame = () => {
    setBoard(initialBoard);
    setSelected(null);
    setTurn("w");
    setMoves([]);
    setAlertStatus(null);
    setWinner(null);
    setPromotionPending(null);
    setCapturedScores({ white: 0, black: 0 });
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
      setAlertStatus("stalemate");
    }
  };

  const movePiece = (r, c) => {
    if (!selected) return;
    const isValid = validMoves.some(([vr, vc]) => vr === r && vc === c);
    if (!isValid) return;

    const [sr, sc] = selected;
    const piece = board[sr][sc];
    const targetCell = board[r][c]; 

    //  ACCURATE REAL-TIME CAPTURE FILTER MATRIX
    if (targetCell && targetCell[0] !== piece[0]) {
      const targetType = targetCell[1];
      const pointValues = { p: 1, r: 3, b: 3, n: 3, q: 9, k: 0 };
      const pointsGained = pointValues[targetType] || 0;

      setCapturedScores(prev => ({
        ...prev,
        white: piece[0] === "w" ? prev.white + pointsGained : prev.white,
        black: piece[0] === "b" ? prev.black + pointsGained : prev.black
      }));
    }

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
    
    // Check if the promotion square itself involves a direct capture event
    const targetCell = board[r][c];
    if (targetCell && targetCell[0] !== color) {
      const targetType = targetCell[1];
      const pointValues = { p: 1, r: 3, b: 3, n: 3, q: 9, k: 0 };
      const pointsGained = pointValues[targetType] || 0;

      setCapturedScores(prev => ({
        ...prev,
        white: color === "w" ? prev.white + pointsGained : prev.white,
        black: color === "b" ? prev.black + pointsGained : prev.black
      }));
    }

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

  return {
    board, selected, turn, moves, alertStatus, winner, promotionPending, validMoves, capturedScores,
    resetGame, handleClick, handlePromotionChoice
  };
}