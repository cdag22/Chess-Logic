/*
 * Copyright (c) 2019, Cj D'Agostino and Surge Bethi
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 *----------------------------------------------------------------------------*/

/* @license
 * Copyright (c) 2019, Cj D'Agostino and Surge Bethi
 * Released under the BSD license
 */

/*
 * IMPORTS
 */
// import BitBoard from './bitBoard.js';
const bb = require('./bitBoard.js');

/*
* @function: ChessLogic( [FEN String] ) --> Base Class of all game logic
*/
const ChessLogic = function ChessLogic(fenString) {

  // PIECES AND TEAMS
  //
  const WHITE = 'WHITE';
  const BLACK = 'BLACK';

  let ALLY_TEAM = WHITE;
  let ENEMY_TEAM = BLACK;

  const PAWN = 'PAWN';
  const KNIGHT = 'KNIGHT';
  const BISHOP = 'BISHOP';
  const ROOK = 'ROOK';
  const QUEEN = 'QUEEN';
  const KING = 'KING';

  const PIECE_FEN = {
    PAWN: 'p',
    KNIGHT: 'n',
    BISHOP: 'b',
    ROOK: 'r',
    QUEEN: 'q',
    KING: 'k',
  };

  const TEAM_FEN = {
    WHITE: 'w',
    BLACK: 'b',
  };

  // BOARDS AND RELATED CONSTANTS
  //
  const BOARD_DIMENSION = 8;

  const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const GAME_RESULTS = ['0-1', '1-0', '1/2-1/2'];

  const BOARD = [].concat(
    'rnbqkbnr'.split(''),
    'pppppppp'.split(''),
    Array.from({ length: 32 }, (_, i) => ''),
    'PPPPPPPP'.split(''),
    'RNBQKBNR'.split(''),
  );

  const BIT_BOARD_DEFAULTS = {
    PIECE: new bb.BitBoard([255, 255, 0, 0, 0, 0, 255, 255]), // all pieces
    BLACK: new bb.BitBoard([0, 0, 0, 0, 0, 0, 255, 255]),  // any black piece
    WHITE: new bb.BitBoard([255, 255, 0, 0, 0, 0, 0, 0]), // any white piece
    PAWN: new bb.BitBoard([0, 255, 0, 0, 0, 0, 255, 0]),
    UNMOVED_PAWNS: new bb.BitBoard([0, 255, 0, 0, 0, 0, 255, 0]),
    FIRST_MOVE_TWO_SQUARE_PAWNS: new bb.BitBoard([0, 0, 0, 0, 0, 0, 0, 0]),
    KNIGHT: new bb.BitBoard([66, 0, 0, 0, 0, 0, 0, 66]),
    BISHOP: new bb.BitBoard([36, 0, 0, 0, 0, 0, 0, 36]),
    ROOK: new bb.BitBoard([129, 0, 0, 0, 0, 0, 0, 129]),
    QUEEN: new bb.BitBoard([8, 0, 0, 0, 0, 0, 0, 8]),
    KING: new bb.BitBoard([16, 0, 0, 0, 0, 0, 0, 16]),
  };

  const BIT_BOARDS = {
    PIECE: new bb.BitBoard([255, 255, 0, 0, 0, 0, 255, 255]), // all pieces
    BLACK: new bb.BitBoard([0, 0, 0, 0, 0, 0, 255, 255]),  // any black piece
    WHITE: new bb.BitBoard([255, 255, 0, 0, 0, 0, 0, 0]), // any white piece
    PAWN: new bb.BitBoard([0, 255, 0, 0, 0, 0, 255, 0]),
    UNMOVED_PAWNS: new bb.BitBoard([0, 255, 0, 0, 0, 0, 255, 0]),
    FIRST_MOVE_TWO_SQUARE_PAWNS: new bb.BitBoard([0, 0, 0, 0, 0, 0, 0, 0]),
    KNIGHT: new bb.BitBoard([66, 0, 0, 0, 0, 0, 0, 66]),
    BISHOP: new bb.BitBoard([36, 0, 0, 0, 0, 0, 0, 36]),
    ROOK: new bb.BitBoard([129, 0, 0, 0, 0, 0, 0, 129]),
    QUEEN: new bb.BitBoard([8, 0, 0, 0, 0, 0, 0, 8]),
    KING: new bb.BitBoard([16, 0, 0, 0, 0, 0, 0, 16]),
  };

  let HISTORY = [STARTING_FEN];

  // MOVEMENT AND SQUARES
  //
  let FULL_MOVE_COUNT = 1;
  let HALF_MOVE_COUNT = 0;

  const TWO_SQUARE_PAWN_MOVE = 16;

  let IS_EN_PASSANT = false;
  let EN_PASSANT_SQUARE = 0;

  const PIECE_OFFSETS = {
    PAWN: [8],
    PAWN_FIRST_MOVE: [8, 16],
    PAWN_ATTACK: [7, 9],
    EN_PASSANT: [-1, 1],
    KNIGHT: [6, 10, 15, 17],
    BISHOP: [7, 9],
    ROOK: [1, 8],
    QUEEN: [1, 7, 8, 9],
    KING: [1, 7, 8, 9],
  };

  const FLAGS = {
    NORMAL: 'n',
    CAPTURE: 'c',
    BIG_PAWN: 'b',
    EP_CAPTURE: 'e',
    PROMOTION: 'p',
    KSIDE_CASTLE: 'k',
    QSIDE_CASTLE: 'q',
  };

  const CASTLING_STATE = {
    WHITE: {
      KINGSIDE: 'K',
      QUEENSIDE: 'Q',
    },
    BLACK: {
      KINGSIDE: 'k',
      QUEENSIDE: 'q',
    },
  };

  const SQUARES = {
    a8: 0, b8: 1, c8: 2, d8: 3, e8: 4, f8: 5, g8: 6, h8: 7,
    a7: 8, b7: 9, c7: 10, d7: 11, e7: 12, f7: 13, g7: 14, h7: 15,
    a6: 16, b6: 17, c6: 18, d6: 19, e6: 20, f6: 21, g6: 22, h6: 23,
    a5: 24, b5: 25, c5: 26, d5: 27, e5: 28, f5: 29, g5: 30, h5: 31,
    a4: 32, b4: 33, c4: 34, d4: 35, e4: 36, f4: 37, g4: 38, h4: 39,
    a3: 40, b3: 41, c3: 42, d3: 43, e3: 44, f3: 45, g3: 46, h3: 47,
    a2: 48, b2: 49, c2: 50, d2: 51, e2: 52, f2: 53, g2: 54, h2: 55,
    a1: 56, b1: 57, c1: 58, d1: 59, e1: 60, f1: 61, g1: 62, h1: 63,
  };

  // ERRORS
  // 
  const ERRORS = {
    INVALID_SQUARE: new Error('Not a valid square. Must start with lowercase a through h and end in 1 through 8.'),
    NOT_BITBOARD: new Error('Invalid Input. Must be of type "BitBoard"'),
    NOT_CHESS_BITBOARD: new Error('Invalid Input. Must be a "BitBoard" of length 8.'),
  };

  /*----------------------------------------------*
  * PRIVATE METHODS
  *----------------------------------------------*/

  function _addNegativeOffsets(offsets) {
    offsets.slice().forEach(offset => offsets.push(-1 * offset));
    return offsets;
  }

  function _filterEdges(offsets, sq, piece) {
    if (piece === KNIGHT) {
      if (_isFirstColumn(sq)) {
        return offsets.filter(x => ![-17, -10, 6, 15].includes(x));
      } else if (_isSecondColumn(sq)) {
        return offsets.filter(x => ![-10, 6].includes(x));
      } else if (_isSeventhColumn(sq)) {
        return offsets.filter(x => ![-6, 10].includes(x));
      } else if (_isEigthColumn(sq)) {
        return offsets.filter(x => ![-15, -6, 10, 17].includes(x));
      }
      return offsets;

    } else if (piece === KING || piece === QUEEN) {
      if (_isFirstColumn(sq)) {
        return offsets.filter(x => ![-9, -1, ,7].includes(x));
      } else if (_isEigthColumn(sq)) {
        return offsets.filter(x => ![-7, 1, 9].includes(x));
      }
      return offsets;

    } else if (piece === BISHOP) {
      if (_isFirstColumn(sq)) {
        return offsets.filter(x => ![-9, 7].includes(x));
      } else if (_isEigthColumn(sq)) {
        return offsets.filter(x => ![-7, 9].includes(x));
      }
      return offsets;

    } else if (piece === ROOK) {
      if (_isFirstColumn(sq)) {
        return offsets.filter(x => x !== -1);
      } else if (_isEigthColumn(sq)) {
        return offsets.filter(x => x !== 1);
      }
      return offsets;

    }
  }

  function _getVectorOffsets(offsets, fromIndex) {
    let squares = [];
    let offset;
    let sq;

    for (let i = 0, length = offsets.length; i < length; i++) {
      offset = offsets[i];
      sq = offset + fromIndex;
      while (BIT_BOARDS[ALLY_TEAM].index(sq) === 0 && sq <= 64 && sq >= 0) {
        squares.push(sq);
        if (BIT_BOARDS[ENEMY_TEAM].index(sq) === 1) {
          break;
        } else if (_isFirstColumn(sq) || _isEigthColumn(sq)) {
          break;
        }
        sq += offset;
      }
    }
    return squares;
  }

  function _getCastling() {
    //
    // CHANGE CASTLING_STATE TO BOOLEANS ??
    //
    let castlings = CASTLING_STATE['WHITE']['KINGSIDE'];
    castlings += CASTLING_STATE['WHITE']['QUEENSIDE'];
    castlings += CASTLING_STATE['BLACK']['KINGSIDE'];
    castlings += CASTLING_STATE['BLACK']['QUEENSIDE'];
    return castlings;
  }

  function _getCurrentTeam() {
    return TEAM_FEN[ALLY_TEAM]
  }

  function _getEnPassantSquare() {
    //
    // TODO
    //
    return '-';
  }

  function _getHalfMoveCount() {
    return HALF_MOVE_COUNT;
  }

  function _getFullMoveCount() {
    return FULL_MOVE_COUNT;
  }

  function _getPieceByIndex(i) {
    let piece = '';
    if (BIT_BOARDS['PAWN'].index(i)) {
      piece = PAWN;
    } else if (BIT_BOARDS['KNIGHT'].index(i)) {
      piece = KNIGHT;
    } else if (BIT_BOARDS['BISHOP'].index(i)) {
      piece = BISHOP;
    } else if (BIT_BOARDS['ROOK'].index(i)) {
      piece = ROOK;
    } else if (BIT_BOARDS['QUEEN'].index(i)) {
      piece = QUEEN;
    } else if (BIT_BOARDS['KING'].index(i)) {
      piece = KING;
    }
    return piece;
  }

  function _getPieceFEN(i) {
    let piece = _getPieceByIndex(i);
    piece = PIECE_FEN[piece];

    if (BIT_BOARDS['PIECE'].index(i) & BIT_BOARDS['WHITE'].index(i)) { // piece is WHITE
      return piece.toUpperCase();
    }
    return piece; // piece is BLACK
  }

  function _getPinnedPieces() {
    // TODO
  }

  function _getIndexOfSquare(square) {
    const index = SQUARES[square];
    if (!(/[0-9]+/).test(index)) {
      throw ERRORS['INVALID_SQUARE'];
    }
    return index;
  }

  function _isFirstColumn(sq) {
    return sq % 8 === 0;
  }

  function _isSecondColumn(sq) {
    return sq % 8 === 1;
  }

  function _isSeventhColumn(sq) {
    return sq % 8 === 6;
  }

  function _isEigthColumn(sq) {
    return sq % 8 === 7;
  }

  function _resetCounters() {
    HALF_MOVE_COUNT = 0;
    FULL_MOVE_COUNT = 1;
  }

  function _resetHistory() {
    HISTORY = [STARTING_FEN];
  }

  function _resetTeams() {
    ALLY_TEAM = WHITE;
    ENEMY_TEAM = BLACK;
  }

  function _updateHalfMoveCount() {
    return ++HALF_MOVE_COUNT;
  }

  function _updateFullMoveCount() {
    return ++FULL_MOVE_COUNT;
  }

  function _updateMoveCounters() {
    let i = (_updateHalfMoveCount() - 1);
    i = i === 0 ? 1 : i;
    i % 2 === 0 ? _updateFullMoveCount() : null;
  }

  function _updateTeam(team) {
    return team === WHITE ? BLACK : WHITE;
  }

  function _updateBothTeams() {
    ALLY_TEAM = _updateTeam(ALLY_TEAM);
    ENEMY_TEAM = _updateTeam(ENEMY_TEAM);
  }

  function _validateIsCorrectTeam(i, team) {
    if (team === ALLY_TEAM) {
      return BIT_BOARDS[ALLY_TEAM].index(i) === 1;
    }
    return BIT_BOARDS[ALLY_TEAM].index(i) !== 1;
  }

  function _validateMove(fromIndex, toIndex, pieceType) {
    if (!_validateIsCorrectTeam(fromIndex, ALLY_TEAM) || !_validateIsCorrectTeam(toIndex, ENEMY_TEAM)) {
      if (pieceType === BISHOP) {
      }
      return false;
      
    } else if (pieceType === PAWN) {
      let movementOffsets;
      let isPotientalEnPassant = false;

      if (BIT_BOARDS[ENEMY_TEAM].index(toIndex)) {
        movementOffsets = PIECE_OFFSETS['PAWN_ATTACK'];
      } else if (BIT_BOARDS['UNMOVED_PAWNS'].index(fromIndex)) {
        movementOffsets = PIECE_OFFSETS['PAWN_FIRST_MOVE'];
      } else {
        isPotientalEnPassant = true;
        movementOffsets = PIECE_OFFSETS['PAWN'];
      }

      if (ALLY_TEAM === WHITE) {
        movementOffsets = movementOffsets.map(offset => -1 * offset);
      }
      const indexPlusOffsets = movementOffsets.map(offset => offset + fromIndex);

      if (isPotientalEnPassant && BIT_BOARDS['PIECE'].index(toIndex) === 0) {
        IS_EN_PASSANT = PIECE_OFFSETS['EN_PASSANT'].some(offset => {
          EN_PASSANT_SQUARE = fromIndex + offset;
          return _getPieceByIndex(EN_PASSANT_SQUARE) === PAWN;
        });
        return IS_EN_PASSANT;
      }
      return indexPlusOffsets.includes(toIndex);

    } else if (KNIGHT === pieceType || pieceType === KING) {
      // Regular Moves
      let movementOffsets = _addNegativeOffsets(PIECE_OFFSETS[pieceType]);
      movementOffsets = _filterEdges(movementOffsets, fromIndex, pieceType);
      const possibleSquares = movementOffsets.map(offset => offset + fromIndex);
      return possibleSquares.includes(toIndex);

    } else {
      // Vector Moves; i.e. BISHOP, ROOK, or QUEEN
      let movementOffsets = _addNegativeOffsets(PIECE_OFFSETS[pieceType]);
      movementOffsets = _filterEdges(movementOffsets, fromIndex, pieceType);
      const possibleSquares = _getVectorOffsets(movementOffsets, fromIndex);
      return possibleSquares.includes(toIndex);
    }
  }

  function _updateBitBoards(fromIndex, toIndex, pieceType) {
    const takenPiece = _getPieceByIndex(toIndex);

    if (IS_EN_PASSANT) {
      BIT_BOARDS['PIECE'] = BIT_BOARDS['PIECE'].xOr(EN_PASSANT_SQUARE);
      BIT_BOARDS[pieceType] = BIT_BOARDS[pieceType].index(EN_PASSANT_SQUARE) === 1 ? BIT_BOARDS[pieceType].xOr(EN_PASSANT_SQUARE) : BIT_BOARDS[pieceType];
    }

    BIT_BOARDS['PIECE'] = BIT_BOARDS['PIECE'].xOr(fromIndex);
    BIT_BOARDS['PIECE'] = BIT_BOARDS['PIECE'].or(toIndex);

    BIT_BOARDS[ALLY_TEAM] = BIT_BOARDS[ALLY_TEAM].xOr(fromIndex);
    BIT_BOARDS[ALLY_TEAM] = BIT_BOARDS[ALLY_TEAM].or(toIndex);

    if (BIT_BOARDS[ENEMY_TEAM].index(toIndex) === 1) {
      if (pieceType === PAWN && EN_PASSANT_SQUARE !== toIndex) {
        BIT_BOARDS[ENEMY_TEAM] = BIT_BOARDS[ENEMY_TEAM].xOr(EN_PASSANT_SQUARE);
      }
      BIT_BOARDS[ENEMY_TEAM] = BIT_BOARDS[ENEMY_TEAM].xOr(toIndex);
    }

    BIT_BOARDS[pieceType] = BIT_BOARDS[pieceType].xOr(fromIndex);
    BIT_BOARDS[pieceType] = BIT_BOARDS[pieceType].or(toIndex);

    if (takenPiece) {
      BIT_BOARDS[takenPiece] = BIT_BOARDS[takenPiece].xOr(toIndex);

      if (takenPiece === PAWN) {
        if (BIT_BOARDS['UNMOVED_PAWNS'].index(toIndex) === 1) {
          // if taken piece is an unmoved pawn, remove it from UNMOVED_PAWNS
          BIT_BOARDS['UNMOVED_PAWNS'] = BIT_BOARDS['UNMOVED_PAWNS'].xOr(toIndex);

        } else if (BIT_BOARDS['FIRST_MOVE_TWO_SQUARE_PAWNS'].index(toIndex) === 1) {
          // else if taken Piece is a PAWN who moved last two squares
          const targetSquare = IS_EN_PASSANT ? EN_PASSANT_SQUARE : toIndex;
          BIT_BOARDS['FIRST_MOVE_TWO_SQUARE_PAWNS'] = BIT_BOARDS['FIRST_MOVE_TWO_SQUARE_PAWNS'].xOr(targetSquare);
        }
      }
    }

    if (pieceType === PAWN) {
      // Remove from UNMOVED_PAWNS
      BIT_BOARDS['UNMOVED_PAWNS'] = BIT_BOARDS['UNMOVED_PAWNS'].xOr(fromIndex);

      if (Math.abs(toIndex - fromIndex) === TWO_SQUARE_PAWN_MOVE) {
        // if the pawn moved two squares, add it to the bit board FIRST_MOVE_TWO_SQUARE_PAWNS
        BIT_BOARDS['FIRST_MOVE_TWO_SQUARE_PAWNS'] = BIT_BOARDS['FIRST_MOVE_TWO_SQUARE_PAWNS'].or(toIndex);
      }
    }

    if (BIT_BOARDS['FIRST_MOVE_TWO_SQUARE_PAWNS'].index(fromIndex) === 1) {
      // Current move is a PAWN whose last move was a double move
      // So remove it from bit board FIRST_MOVE_TWO_SQUARE_PAWNS
      BIT_BOARDS['FIRST_MOVE_TWO_SQUARE_PAWNS'] = BIT_BOARDS['FIRST_MOVE_TWO_SQUARE_PAWNS'].xOr(fromIndex);
    }
  }

  /*----------------------------------------------*
   * API METHODS
   *----------------------------------------------*/

  // Board Methods

  function clearBoard() {
    // Set each BitBoard equal to a new 64 bit array of zeros
    Object.keys(BIT_BOARDS).forEach(board => BIT_BOARDS[board] = new bb.BitBoard());
    _resetCounters();
    _resetHistory();
    _resetTeams();
  }

  function loadFEN(fen) {

  }

  function makeMove(fromSquare, toSquare) {
    const fromIndex = _getIndexOfSquare(fromSquare);
    const toIndex = _getIndexOfSquare(toSquare);
    const piece = _getPieceByIndex(fromIndex);

    if (_validateMove(fromIndex, toIndex, piece)) {
      _updateBitBoards(fromIndex, toIndex, piece);
      _updateBothTeams();
      _updateMoveCounters();
      HISTORY.push(getFEN());

      return true;

    } else {
      return false;
    }


  }

  function resetBoard() {
    // Set all values in BIT_BOARDS equal to their values in BIT_BOARD_DEFAULTS
    Object.keys(BIT_BOARDS).forEach(board => BIT_BOARDS[board] = BIT_BOARD_DEFAULTS[board].copy());
    _resetHistory();
    _resetTeams();
    _resetCounters();
  }

  function undoMove() {
    HISTORY.pop();
    loadFEN(HISTORY[HISTORY.length - 1]);
  }

  function validateFEN(fen) {

  }

  // Game State Methods

  function determineIfCheck() {

  }

  function determineIfDraw() {

  }

  function determineIfGameOver() {

  }

  function determineIfStalemate() {

  }

  function determineIfThreefoldRepetition() {

  }

  function determineIfInsufficientMaterial() {

  }

  function whoseTurnIsIt() {
    return ALLY_TEAM;
  }

  // Data Methods

  function getFEN() {
    let fen = [];
    let pieceString = [];
    let row;
    let piece;
    let count = 0;

    // iterate over ranks or bytes
    for (let rank = 0; rank < BOARD_DIMENSION; rank++) {
      row = '';
      // iterate over one byte
      for (let file = 0; file < BOARD_DIMENSION; file++) {
        piece = _getPieceFEN(rank * BOARD_DIMENSION + file);
        if (piece && count > 0) {
          row += count + piece;
          count = 0
        } else if (!piece) {
          count++;
        } else {
          row += piece;
        }
      }
      if (count > 0) {
        row += count;
        count = 0;
      }
      pieceString.push(row);
    }
    fen.push(pieceString.join('/'));
    fen.push(_getCurrentTeam());
    fen.push(_getCastling());
    fen.push(_getEnPassantSquare());
    fen.push(_getHalfMoveCount());
    fen.push(_getFullMoveCount());
    return fen.join(' ');
  }

  function getHistory() {
    return HISTORY;
  }

  function getLegalMoves() {

  }

  function getPieceOnSquare(square) {

  }

  function getSquareColor(square) {
    const index = SQUARES[square];
    if (typeof index === 'number') {
      if (index % 16 < 8) {
        return index % 2 === 0 ? TEAM_FEN[WHITE] : TEAM_FEN[BLACK];
      } else {
        return index % 2 === 1 ? TEAM_FEN[WHITE] : TEAM_FEN[BLACK];
      }
    }
  }

  // FUNCTIONS AND CONSTANTS TO EXPOSE

  return {
    STARTING_FEN,
    clearBoard,
    loadFEN,
    makeMove,
    resetBoard,
    undoMove,
    validateFEN,
    determineIfCheck,
    determineIfDraw,
    determineIfGameOver,
    determineIfInsufficientMaterial,
    determineIfStalemate,
    determineIfThreefoldRepetition,
    whoseTurnIsIt,
    getFEN,
    getHistory,
    getLegalMoves,
    getPieceOnSquare,
    getSquareColor,
  };
};


if (typeof exports !== 'undefined') {
  /*
   * Export ChessLogic object if using node or any other CommonJS compatible environment.
   */

  exports.ChessLogic = ChessLogic;

} else if (typeof define !== 'undefined') {
  /*
   * Export ChessLogic object for any RequireJS compatible environment.
   */

  define((() => ChessLogic));
}
