const Chess = require('../index.js');

describe('getSquareColor()', () => {
  const Logic = Chess.ChessLogic();

  it('returns correct color', () => {
    expect(Logic.getSquareColor('a1')).toBe('b');
    expect(Logic.getSquareColor('h1')).toBe('w');
    expect(Logic.getSquareColor('a7')).toBe('b');
    expect(Logic.getSquareColor('b5')).toBe('w');
    expect(Logic.getSquareColor('c3')).toBe('b');
    expect(Logic.getSquareColor('a8')).toBe('w');
    expect(Logic.getSquareColor('h8')).toBe('b');
  });
});