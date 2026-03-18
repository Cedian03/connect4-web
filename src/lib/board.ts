const WIDTH = 7;
const HEIGHT = 6;

export enum Disk {
    X = "X",
    O = "O",
}

export type Cell = Disk | null;
export type Matrix = Cell[][];

export class Board {
    matrix: Matrix;
    turn: number = 0;

    constructor() {
        this.matrix = Array.from(
            { length: WIDTH },
            () => Array(HEIGHT).fill(null),
        );
    }

    static fromStr(s: string): Board {
        const board = new Board();
        board.playSequence(s);
        return board;
    }

    get(col: number, row: number): Cell {
        return this.matrix[col][row];
    }

    set(col: number, row: number, item: Cell) {
        this.matrix[col][row] = item;
    }

    play(col: number) {
        const row = this.freeRowIn(col);
        if (row === null) throw new Error("Column is full");
        this.set(col, row, this.diskToPlay());
        this.turn++;
    }

    playSequence(sequence: string) {
        for (const col of parseMoves(sequence)) {
            this.play(col);
        }
    }

    diskToPlay(): Disk {
        return this.turn % 2 === 0 ? Disk.X : Disk.O;
    }

    freeRowIn(col: number): number | null {
        for (let row = 0; row < this.matrix[col].length; row++) {
            if (this.get(col, row) === null) return row;
        }
        return null;
    }
}

function parseMoves(sequence: string): number[] {
    return sequence.split("").map(columnFromChar);
}

function columnFromChar(ch: string): number {
    return "ABCDEFG".indexOf(ch);
}
