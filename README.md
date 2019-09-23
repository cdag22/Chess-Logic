# Chess-Logic

##### A JavaScript Library for all the logic of Chess: piece placement/movement validation, and game state detection such as check/checkmate/stalemate.

# API &rarr; [detailed examples](./LOGIC.md)

## Properties

| STARTING_FEN &rarr; FEN string of initial board position
|---

## Methods

### Board Methods

| .clearBoard() &rarr; undefined
|---

| .loadFEN(fen) &rarr; Boolean
|---

| .makeMove(fromSquare, toSquare) &rarr; Boolean
|---

| .resetBoard() &rarr; undefined
|---

| .undoMove() &rarr; FEN of previous board state (String)
|---

| .validateFEN(fen) &rarr; Boolean
|---

### Game State Methods

| .determineIfCheck() &rarr; Boolean
|---

| .determineIfDraw() &rarr; Boolean
|---

| .determineIfGameOver() &rarr; Boolean
|---

| .determineIfStalemate() &rarr; Boolean
|---

| .determineIfThreefoldRepetition() &rarr; Boolean
|---

| .determineIfInsufficientMaterial() &rarr; Boolean
|---

| .whoseTurnIsIt() &rarr; Color (String)
|---

### Data Methods

| .getFEN() &rarr; FEN String
|---

| .getHistory([ options ]) &rarr; Array of FEN Strings
|---

| .getLegalMoves([ options ]) &rarr; Array of Squares (Strings)
|---

| .getPieceOnSquare(square) &rarr; Piece (String)
|---

| .getSquareColor(square) &rarr; Color (String)
|---