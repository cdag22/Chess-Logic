/*--------------------------------------------------*
 *
 * CLASS BitBoard
 *
 * @params: [optional] Array of Numbers each of which
 * is in the range of 0-255; i.e. each number is a byte
 * 
 * DEFAULT: 64 bits, all set to 0 (Array of length 8;
 * i.e. 8 bytes)
 * 
 * -------------------------------------------------*/

class BitBoard {
  constructor(bitRows = [0, 0, 0, 0, 0, 0, 0, 0]) {
    this._BINARY_FLAG = 2;
    this._BITS_PER_BYTE = 8;
    bitRows = bitRows.map(byte => byte > 255 || byte < 0 ? 0 : byte);
    this.board = bitRows.map(byte => byte.toString(2).padStart(8, '0')).join('');
    this.bytes = this.board.length / this._BITS_PER_BYTE;
    this.length = this.board.length;
  }

  index(i) {
    if (i < this.length) {
      return Number(this.board[this.length -  1 - i]);
    }
  }

  copy() {
    let copyArr = '';

    for (let i = 0; i < this.length; i++) {
      copyArr += this.board[i];
    }
    let newBoard = new BitBoard();
    newBoard.board = copyArr;
    return newBoard;
  }

  and(bb) {
    let newBoard = this.copy();
    if (typeof bb === 'number') {
      const start = newBoard.board.slice(0, this.length - bb - 1);
      const altered = Number(this.board[this.length -  1 - bb]) & 1;
      const end = newBoard.board.slice(this.length - bb);

      newBoard.board =  start + altered + end;

      return newBoard;

    } else if (bb && this.length === bb.length) {
      let str = '';

      for (let i = 0; i < this.length; i++) {
        str += String(Number(newBoard.board[i]) & Number(bb.board[i]));
      }
      newBoard.board = str;
      return newBoard;
    }
  }

  or(bb) {
    let newBoard = this.copy()
    if (typeof bb === 'number') {
      const start = newBoard.board.slice(0, this.length - bb - 1);
      const altered = Number(this.board[this.length -  1 - bb]) | 1;
      const end = newBoard.board.slice(this.length - bb);

      newBoard.board =  start + altered + end;

      return newBoard;

    } else if (bb && this.length === bb.length) {
      let str = '';

      for (let i = 0; i < this.length; i++) {
        str += String(Number(newBoard.board[i]) | Number(bb.board[i]));
      }
      newBoard.board = str;
      return newBoard;
    }
  }

  xOr(bb) {
    let newBoard = this.copy();
    if (typeof bb === 'number') {
      const start = newBoard.board.slice(0, this.length - bb - 1);
      const altered = Number(this.board[this.length -  1 - bb]) ^ 1;
      const end = newBoard.board.slice(this.length - bb);

      newBoard.board =  start + altered + end;

      return newBoard;

    } else if (bb && this.length === bb.length) {
      let str = '';

      for (let i = 0; i < this.length; i++) {
        str += String(Number(newBoard.board[i]) ^ Number(bb.board[i]));
      }
      newBoard.board = str;
      return newBoard;
    }
  }

  not() {
    let newBoard = this.copy();
    let str = '';

    for (let i = 0; i < this.length; i++) {
      str += newBoard.board[i] === '1' ? '0' : '1';
    }
    newBoard.board = str;
    return newBoard;
  }

  shiftLeft(n) {
    if (n <= this.length) {
      let newBoard = this.copy();
      newBoard.board = newBoard.board.padEnd(this.length + n, '0').slice(n);
      return newBoard;
    }
  }

  shiftRight(n) {
    if (n <= this.length) {
      let newBoard = this.copy();
      newBoard.board = newBoard.board.padStart(this.length + n, '0').slice(0, this.length);
      return newBoard;
    }
  }
}


if (typeof exports !== 'undefined') {
  /*
   * export BitBoard object if using node or any other CommonJS compatible
   * environment
   */

  exports.BitBoard = BitBoard;

} else if (typeof define !== 'undefined') {
  /*
   * export BitBoard object for any RequireJS compatible environment
   */

  define((() => BitBoard));
}
