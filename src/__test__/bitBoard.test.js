const bb = require('../bitBoard.js');

describe('BitBoard', () => {

  it('defaults to creating a 64 bit array', () => {
    expect(new bb.BitBoard().length).toEqual(64);
  });

  it('returns two zero bytes for values less than zero or greater than 255', () => {
    expect(new bb.BitBoard([257, -1]).board).toEqual('0'.repeat(16));
  });

  describe('operations between bit boards', () => {
    let boardA;
    let boardB;
    let zeroBoard = '0'.repeat(8);
    let oneBoard = '1'.repeat(8);


    beforeEach(() => {
      boardA = new bb.BitBoard([255]);
      boardB = new bb.BitBoard([0]);
    });

    it('does not change either bit board with AND', () => {
      boardA.and(boardB);

      expect(boardA.board).toEqual(oneBoard);
      expect(boardB.board).toEqual(zeroBoard);
    });

    it('correctly ANDs two bit boards', () => {
      expect(boardA.and(boardB).board).toEqual(zeroBoard);
    });

    it('does not change either bit board with OR', () => {
      boardA.or(boardB);

      expect(boardA.board).toEqual(oneBoard);
      expect(boardB.board).toEqual(zeroBoard);
    });

    it('correctly ORs two bit boards', () => {
      expect(boardA.or(boardB).board).toEqual(oneBoard);
    });

    it('does not change either bit board with XOR', () => {
      boardA.xOr(boardB);

      expect(boardA.board).toEqual(oneBoard);
      expect(boardB.board).toEqual(zeroBoard);
    });

    it('correctly XORs two bit boards', () => {
      expect(boardA.xOr(boardB).board).toEqual(oneBoard);
    });

    it('does not change a bit board with NOT', () => {
      boardA.not();

      expect(boardA.board).toEqual(oneBoard);
    });

    it('correctly NOTs a bit board', () => {
      expect(boardA.not().board).toEqual(zeroBoard);
    });

    it('does not change either bit board with shiftLeft()', () => {
      boardA.shiftLeft(8);

      expect(boardA.board).toEqual(oneBoard);
    });

    it('correctly bit shifts a bit board left', () => {
      expect(boardA.shiftLeft(8).board).toEqual(zeroBoard);

      boardA = new bb.BitBoard([255]);

      expect(boardA.shiftLeft(4).board).toEqual('1111'.padEnd(8, '0'));
    });

    it('does not change either bit board with shiftRight()', () => {
      boardA.shiftRight(8);

      expect(boardA.board).toEqual(oneBoard);
    });

    it('correctly bit shifts a bit board right', () => {
      expect(boardA.shiftRight(8).board).toEqual(zeroBoard);

      boardA = new bb.BitBoard([255]);

      expect(boardA.shiftRight(4).board).toEqual('1111'.padStart(8, '0'));
    });
  });

  describe('operations between a bit board and a number', () => {
    let boardA;
    let zeroBoard = '0'.repeat(8);
    let oneBoard = '1'.repeat(8);


    beforeEach(() => {
      boardA = new bb.BitBoard([255]);
    });

    it('correctly returns the bit at an index', () => {
      bitBoard = new bb.BitBoard([129]);

      expect(bitBoard.index(0)).toBe(1);
      expect(bitBoard.index(1)).toBe(0);
      expect(bitBoard.index(6)).toBe(0);
      expect(bitBoard.index(7)).toBe(1);
    });

    it('does not change the bit board with AND', () => {
      boardA.and(1);

      expect(boardA.board).toEqual(oneBoard);
    });

    it('correctly ANDs a bit board and one at an index', () => {
      expect(boardA.and(0).board).toEqual(oneBoard);
      expect(boardA.and(1).board).toEqual(oneBoard);
      expect(boardA.and(2).board).toEqual(oneBoard);
      expect(boardA.and(3).board).toEqual(oneBoard);
    });

    it('does not change a bit board with OR', () => {
      boardA.or(1);

      expect(boardA.board).toEqual(oneBoard);
    });

    it('correctly ORs a bit board and 1 at an index', () => {
      expect(boardA.or(1).board).toEqual(oneBoard);
      expect(boardA.or(2).board).toEqual(oneBoard);
      expect(boardA.or(3).board).toEqual(oneBoard);
    });

    it('does not change the bit board with XOR', () => {
      boardA.xOr(5);

      expect(boardA.board).toEqual(oneBoard);
    });

    it('correctly XORs a bit board and 1 at an index', () => {
      expect(boardA.xOr(0).board).toEqual('1'.repeat(7) + '0');
      expect(boardA.xOr(1).board).toEqual('1'.repeat(6) + '01');
      expect(boardA.xOr(2).board).toEqual('1'.repeat(5) + '011');
      expect(boardA.xOr(3).board).toEqual('1'.repeat(4) + '0111');
    });
  });
});