import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows, ncols, chanceLightStartsOn }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];

    for (let i = 0; i < nrows; i++) {
      let row = [];
      for (let j = 0; j < ncols; j++) {
        row.push(Math.random() >= chanceLightStartsOn);
      }

      initialBoard.push(row);
    }

    return initialBoard;
  }

  /** Checks if every cell has a value of false */
  function hasWon() {
    return board.every((row) => row.every((col) => col === false));
  }

  /** Takes in a [y,x] coordinate and flips that cell and all cells surrounding it.
   *
   *  Input: [[x, t, x],  given coord = [1,1]
   *          [t, t, t],
   *          [x, t, x]]
   *
   *  Output: [[x, f, x],
   *           [f, f, f],
   *           [x, f, x]]
   */
  function flipCellsAround(coord) {
    setBoard((oldBoard) => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          // flips t to f or vice versa
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      const boardCopy = [...board];

      flipCell(y, x, boardCopy); // current
      flipCell(y - 1, x, boardCopy); // top
      flipCell(y + 1, x, boardCopy); // below
      flipCell(y, x - 1, boardCopy); // left
      flipCell(y, x + 1, boardCopy); // right

      return boardCopy;
    });
  }

  /** If lights are all out, display winning message  */
  if (hasWon()) {
    return <div>You Won!</div>;
  }

  /** Makes table => array of arrays containing Cell Components
   *
   *  Cell Component:
   *    props:
   *      - isLit: boolean
   *      - flipCellsAroundMe: callback function
   */
  let coordBoard = [];
  for (let y = 0; y < nrows; y++) {
    let row = [];
    for (let x = 0; x < ncols; x++) {
      let coord = `${y}-${x}`;
      row.push(
        <Cell
          isLit={board[y][x]}
          flipCellsAroundMe={() => flipCellsAround(coord)}
        />
      );
    }
    coordBoard.push(<tr>{row}</tr>);
  }

  return (
    <table>
      <tbody>{coordBoard}</tbody>
    </table>
  );
}

Board.defaultProps = {
  nrows: 5,
  ncols: 5,
  chanceLightStartsOn: 0.5,
};

export default Board;
