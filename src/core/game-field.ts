import {GameCell} from "./game-cell";
import {RandomHelper} from "@m8/helpers";

/**
 *  Игровое поле
 */
export class GameField extends Phaser.Events.EventEmitter {

    private readonly _cells: GameCell[][];

    public get size(): number {
        return this._size;
    }

    public get anyExists(): boolean {

        for (let x = 0; x < this._size; x++) {
            for (let y = 0; y < this._size; y++) {

                if (!this._cells[x][y].isDestroyed) {
                    return true;
                }
            }
        }

        return false;
    }

    constructor(private _size: number) {
        super();
        this._cells = [];

        for (let x = 0; x < _size; x++) {
            this._cells.push([]);

            for (let y = 0; y < _size; y++) {
                this._cells[x].push(new GameCell(x, y).setValue(RandomHelper.GenerateValue()));
            }
        }
    }

    /**
     * Получить колонку игрового поля по индексу
     * @param x Индекс колонки
     */
    public getColumn(x: number): GameCell[] {
        return this._cells[x];
    }

    /**
     * Получить строку игрового поля по индексу
     * @param y Индекс строки
     */
    public getRow(y: number): GameCell[] {
        return this._cells.map(x => x[y]);
    }

    /**
     * Получить ячейку
     * @param x Индекс колонк
     * @param y Индекс строки
     */
    public getCell(x: number, y: number): GameCell {
        return this._cells[x][y];
    }


    public take(x: number, y: number): number {
        const cell = this._cells[x][y];
        cell.destroy();

        this.emit("cell-taken", x, y);

        return cell.value;
    }

    public getCells(): number[][] {

        const cells: number[][] = [];

        for (let x = 0; x < this._size; x++) {
            cells.push([]);
            for (let y = 0; y < this._size; y++) {
                const cell = this.getCell(x, y);
                cells[x][y] = cell.isDestroyed ? 0 : cell.value;
            }
        }

        return cells;
    }
}
