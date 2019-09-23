const Chess = require('../index.js');

describe('makeMove()', () => {
  let Logic;

  beforeEach(() => {
    Logic = Chess.ChessLogic();
  });

  it('Lets white go first', () => {
    expect(Logic.makeMove('e2', 'e4')).toBe(true);
  });

  it('Does not let black go first', () => {
    expect(Logic.makeMove('e7', 'e5')).toBe(false);
  });

  describe('exchanges', () => {

    it('allows valid exchanges', () => {
      expect(Logic.makeMove('e2', 'e4')).toBe(true); // White Pawn
      expect(Logic.makeMove('d7', 'd6')).toBe(true); // Black Pawn
      expect(Logic.makeMove('d2', 'd4')).toBe(true); // White Pawn
      expect(Logic.makeMove('e7', 'e5')).toBe(true); // Black Pawn
      expect(Logic.makeMove('c1', 'g5')).toBe(true); // White Bishop
      expect(Logic.makeMove('d8', 'g5')).toBe(true); // Black Queen takes Bishop
    });
  });

  describe('en passant', () => {

    it('returns true for valid enPassant', () => {
      expect(Logic.makeMove('a2', 'a4')).toBe(true); // White Pawn
      expect(Logic.makeMove('h7', 'h5')).toBe(true); // Black Pawn
      expect(Logic.makeMove('a4', 'a5')).toBe(true); // White Pawn
      expect(Logic.makeMove('b7', 'b5')).toBe(true); // Black Pawn
      expect(Logic.makeMove('a5', 'b6')).toBe(true); // White Pawn takes Black Pawn in EnPassant exchange
    });

    it('returns false for invalid enPassant', () => {
      
    });
  });

});
