export const initialBoard = [
  ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
  ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
  ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"],
];

export const pieces = {
  wp: "♙", wr: "♖", wn: "♘", wb: "♗", wq: "♕", wk: "♔",
  bp: "♟", br: "♜", bn: "♞", bb: "♝", bq: "♛", bk: "♚",
};

export function findKing(board, color) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === `${color}k`) return [r, c];
    }
  }
  return null;
}

export function isSquareAttacked(board, r, c, attackerColor) {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (!piece || piece[0] !== attackerColor) continue;

      const type = piece[1];
      if (type === "p") {
        const dir = attackerColor === "w" ? -1 : 1;
        if (i + dir === r && (j - 1 === c || j + 1 === c)) return true;
      } else if (type === "n") {
        const nMoves = [[-2,-1], [-2,1], [-1,-2], [-1,2], [1,-2], [1,2], [2,-1], [2,1]];
        if (nMoves.some(([dr, dc]) => i + dr === r && j + dc === c)) return true;
      } else if (type === "k") {
        const kMoves = [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]];
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
            nr += dr; nc += dc;
          }
        }
      }
    }
  }
  return false;
}

export function getRawMoves(board, r, c) {
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
      if (r === start && !board[r + dir * 2]?.[c]) dirs.push([r + dir * 2, c]);
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

export function getLegalMoves(board, r, c) {
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