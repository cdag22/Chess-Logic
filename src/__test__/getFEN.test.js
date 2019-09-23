const Chess = require('../index.js');

describe('getFEN()', () => {
  const Logic = Chess.ChessLogic();

  it('returns proper fen', () => {
    expect(Logic.getFEN()).toEqual(Logic.STARTING_FEN);
  });
});