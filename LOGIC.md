## API

### Constructor: ChessLogic([ fen ])
The ChessLogic() constructor takes a optional parameter which specifies the board configuration
in [Forsyth-Edwards Notation](http://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation).


### .clearBoard()
Clears the board.

```js
chessLogic.clearBoard();
chessLogic.getFEN();
// -> '8/8/8/8/8/8/8/8 w - - 0 1' <- empty board
```

### .getFEN()
Returns the FEN string for the current position.

```js
var chess = new Chess();

// make some moves
chessLogic.makeMove('e4');
chessLogic.makeMove('e5');
chessLogic.makeMove('f4');

chessLogic.getFEN();
// -> 'rnbqkbnr/pppp1ppp/8/4p3/4PP2/8/PPPP2PP/RNBQKBNR b KQkq f3 0 2'
```

### .determineIfGameOver()
Returns true if the game has ended via checkmate, stalemate, draw, threefold repetition, or insufficient material. Otherwise, returns false.

```js
var chess = new Chess();
chessLogic.determineIfGameOver();
// -> false

chessLogic.loadFEN('4k3/4P3/4K3/8/8/8/8/8 b - - 0 78');
chessLogic.determineIfGameOver();
// -> true (stalemate)

chessLogic.loadFEN('rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3');
chessLogic.determineIfGameOver();
// -> true (checkmate)
```

### .getPieceOnSquare(square)
Returns the piece on the square:

```js
chessLogic.clearBoard();
chessLogic.put({ type: chessLogic.PAWN, color: chessLogic.BLACK }, 'a5') // put a black pawn on a5

chessLogic.getPieceOnSquare('a5');
// -> { type: 'p', color: 'b' },
chessLogic.getPieceOnSquare('a6');
// -> null
```

### .getHistory([ options ])
Returns a list containing the moves of the current game.  Options is an optional
parameter which may contain a 'verbose' flag.  See .getLegalMoves() for a description of the
verbose move fields.

```js
var chess = new Chess();
chessLogic.makeMove('e4');
chessLogic.makeMove('e5');
chessLogic.makeMove('f4');
chessLogic.makeMove('exf4');

chessLogic.getHistory();
// -> ['e4', 'e5', 'f4', 'exf4']

chessLogic.getHistory({ verbose: true });
// -> [{ color: 'w', from: 'e2', to: 'e4', flags: 'b', piece: 'p', san: 'e4' },
//     { color: 'b', from: 'e7', to: 'e5', flags: 'b', piece: 'p', san: 'e5' },
//     { color: 'w', from: 'f2', to: 'f4', flags: 'b', piece: 'p', san: 'f4' },
//     { color: 'b', from: 'e5', to: 'f4', flags: 'c', piece: 'p', captured: 'p', san: 'exf4' }]
```

### .determineIfCheck()
Returns true or false if the side to move is in check.

```js
var chess = new Chess('rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3');
chessLogic.determineIfCheck();
// -> true
```

### .determineIfCheckmate()
Returns true or false if the side to move has been checkmated.

```js
var chess = new Chess('rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3');
chessLogic.determineIfCheckmate();
// -> true
```

### .determineIfDraw()
Returns true or false if the game is drawn (50-move rule or insufficient material).

```js
var chess = new Chess('4k3/4P3/4K3/8/8/8/8/8 b - - 0 78');
chessLogic.determineIfDraw();
// -> true
```

### .determineIfStalemate()
Returns true or false if the side to move has been stalemated.

```js
var chess = new Chess('4k3/4P3/4K3/8/8/8/8/8 b - - 0 78');
chessLogic.determineIfStalemate();
// -> true
```

### .determineIfThreefoldRepetition()
Returns true or false if the current board position has occurred three or more
times.

```js
var chess = new Chess('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
// -> true
// rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq occurs 1st time
chessLogic.determineIfThreefoldRepetition();
// -> false

chessLogic.makeMove('Nf3'); chessLogic.makeMove('Nf6'); chessLogic.makeMove('Ng1'); chessLogic.makeMove('Ng8');
// rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq occurs 2nd time
chessLogic.determineIfThreefoldRepetition();
// -> false

chessLogic.makeMove('Nf3'); chessLogic.makeMove('Nf6'); chessLogic.makeMove('Ng1'); chessLogic.makeMove('Ng8');
// rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq occurs 3rd time
chessLogic.determineIfThreefoldRepetition();
// -> true
```

### .determineIfInsufficientMaterial()
Returns true if the game is drawn due to insufficient material (K vs. K,
K vs. KB, or K vs. KN); otherwise false.

```js
var chess = new Chess('k7/8/n7/8/8/8/8/7K b - - 0 1');
chessLogic.determineIfInsufficientMaterial()
// -> true
```

### .loadFEN(fen)
The board is cleared and the FEN string is loaded.  Returns true if position was
successfully loaded, otherwise false.

```js
var chess = new Chess();
chessLogic.loadFEN('4r3/8/2p2PPk/1p6/pP2p1R1/P1B5/2P2K2/3r4 w - - 1 45');
// -> true

chessLogic.loadFEN('4r3/8/X12XPk/1p6/pP2p1R1/P1B5/2P2K2/3r4 w - - 1 45');
// -> false, bad piece X
```

### .makeMove(move, [ options ])
Attempts to make a move on the board, returning a move object if the move was
legal, otherwise null.  The .makeMove function can be called two ways, by passing
a string in Standard Algebraic Notation (SAN):

```js
var chess = new Chess();

chessLogic.makeMove('e4')
// -> { color: 'w', from: 'e2', to: 'e4', flags: 'b', piece: 'p', san: 'e4' }

chessLogic.makeMove('nf6') // SAN is case sensitive!!
// -> null

chessLogic.makeMove('Nf6')
// -> { color: 'b', from: 'g8', to: 'f6', flags: 'n', piece: 'n', san: 'Nf6' }
```

Or by passing .makeMove() a move object (only the 'to', 'from', and when necessary
'promotion', fields are needed):

```js
var chess = new Chess();

chessLogic.makeMove({ from: 'g2', to: 'g3' });
// -> { color: 'w', from: 'g2', to: 'g3', flags: 'n', piece: 'p', san: 'g3' }
```

### .getLegalMoves([ options ])
Returns a list of legals moves from the current position.  The function takes an optional parameter which controls the single-square move generation and verbosity.

```js
var chess = new Chess();
chessLogic.getLegalMoves();
// -> ['a3', 'a4', 'b3', 'b4', 'c3', 'c4', 'd3', 'd4', 'e3', 'e4',
//     'f3', 'f4', 'g3', 'g4', 'h3', 'h4', 'Na3', 'Nc3', 'Nf3', 'Nh3']

chessLogic.getLegalMoves({square: 'e2'});
// -> ['e3', 'e4']

chessLogic.getLegalMoves({square: 'e9'}); // invalid square
// -> []

chessLogic.getLegalMoves({ verbose: true });
// -> [{ color: 'w', from: 'a2', to: 'a3',
//       flags: 'n', piece: 'p', san 'a3'
//       # a captured: key is included when the move is a capture
//       # a promotion: key is included when the move is a promotion
//     },
//     ...
//     ]
```

The _piece_, _captured_, and _promotion_ fields contain the lowercase
representation of the applicable piece.

The _flags_ field in verbose mode may contain one or more of the following values:

- 'n' - a non-capture
- 'b' - a pawn push of two squares
- 'e' - an en passant capture
- 'c' - a standard capture
- 'p' - a promotion
- 'k' - kingside castling
- 'q' - queenside castling

A flag of 'pc' would mean that a pawn captured a piece on the 8th rank and promoted.

### .removePiece(square)
Remove and return the piece on _square_.

```js
chessLogic.clearBoard();
chessLogic.put({ type: chessLogic.PAWN, color: chessLogic.BLACK }, 'a5') // put a black pawn on a5
chessLogic.put({ type: chessLogic.KING, color: chessLogic.WHITE }, 'h1') // put a white king on h1

chessLogic.removePiece('a5');
// -> { type: 'p', color: 'b' },
chessLogic.removePiece('h1');
// -> { type: 'k', color: 'w' },
chessLogic.removePiece('e1');
// -> null
```

### .resetBoard()
Reset the board to the initial starting position.

### .getSquareColor(square)
Returns the color of the square ('light' or 'dark').

```js
var chess = Chess();
chessLogic.getSquareColor('h1')
// -> 'light'
chessLogic.getSquareColor('a7')
// -> 'dark'
chessLogic.getSquareColor('bogus square')
// -> null
```

### .whoseTurnIsIt()
Returns the current side to move.

```js
chessLogic.loadFEN('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1')
chessLogic.whoseTurnIsIt()
// -> 'b'
```

### .undoMove()
Takeback the last half-move, returning a move object if successful, otherwise null.

```js
var chess = new Chess();

chessLogic.getFEN();
// -> 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
chessLogic.makeMove('e4');
chessLogic.getFEN();
// -> 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'

chessLogic.undoMove();
// -> { color: 'w', from: 'e2', to: 'e4', flags: 'b', piece: 'p', san: 'e4' }
chessLogic.getFEN();
// -> 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
chessLogic.undoMove();
// -> null
```

### .validateFEN(fen)
Returns a validation object specifying validity or the errors found within the
FEN string.

```js
chessLogic.validateFEN('2n1r3/p1k2pp1/B1p3b1/P7/5bP1/2N1B3/1P2KP2/2R5 b - - 4 25');
// -> { valid: true, error_number: 0, error: 'No errors.' }

chessLogic.validateFEN('4r3/8/X12XPk/1p6/pP2p1R1/P1B5/2P2K2/3r4 w - - 1 45');
// -> { valid: false, error_number: 9,
//     error: '1st field (piece positions) is invalid [invalid piece].' }
```