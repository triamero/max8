import * as Phaser from "phaser";
import {Difficulty, EasyEnemyEngine, GameParameters, GameField, HardEnemyEngine, IEnemyEngine} from "@m8/core";
import {PointerObject, TileObject} from "@m8/objects";

export class Factory {

    constructor(private _params: GameParameters) {

    }

    public getParams(): GameParameters {
        return this._params;
    }

    public createEngine(): IEnemyEngine {
        if (this._params.difficulty === Difficulty.Easy) {
            return new EasyEnemyEngine();
        }

        if (this._params.difficulty === Difficulty.Hard) {
            return new HardEnemyEngine();
        }

        throw new Error("Unknown difficulty");
    }

    /** Создать игровое поле */
    public createField(): GameField {
        return new GameField(this._params.size);
    }

    /** Создать игровое поле из массива ячеек */
    public createFieldFromCells(cells: number[][]): GameField {

        if (cells.length != this._params.size) {
            throw new Error("Cells' size does not match gameConfig size");
        }

        const field = new GameField(this._params.size);

        for (let x = 0; x < this._params.size; x++) {
            for (let y = 0; y < this._params.size; y++) {

                const value = cells[x][y];

                const cell = field.getCell(x, y);
                cell.setValue(value);

                if (value === 0) {
                    cell.destroy();
                }
            }
        }

        return field;
    }

    public createTile(scene: Phaser.Scene, x: number, y: number): TileObject {

        const startX = this._params.size === 8 ? 56 : 64;
        const startY = 100;

        const size: number = this._params.size === 8 ? 68 : 90;

        const offset: number = this._params.size === 8 ? 74 : 96;

        const cellX = startX + offset * x + size / 2;
        const cellY = startY + offset * y + size;

        const tile = new TileObject(scene, cellX, cellY, size, size, [x, y]);

        scene.add.existing(tile);

        return tile;
    }

    public createPointer(scene: Phaser.Scene): PointerObject {

        let x: number;
        let y: number;
        let width: number;
        let height: number;

        if (this._params.size === 8) {
            x = 156;
            y = 427;
            width = 74;
            height = 592;
        } else if (this._params.size === 6) {
            x = 174;
            y = 430;
            width = 96;
            height = 575;
        }

        const pointer = new PointerObject(scene, x, y, width, height, this._getVerticalPositions(), this._getHorizontalPositions(), this._params.size);
        scene.add.existing(pointer);
        return pointer;
    }

    private _getVerticalPositions(): Map<number, { x: number, y: number }> {
        let positions = new Map<number, { x: number, y: number }>();

        let startX: number;
        let offset: number;
        let y: number;

        if (this._params.size === 8) {
            startX = 90;
            offset = 74;
            y = 427;
        } else if (this._params.size === 6) {
            startX = 109;
            offset = 96;
            y = 430;
        } else {
            throw new Error("Unknown size");
        }

        for (let i = 0; i < this._params.size; i++) {
            positions.set(i, {x: startX + i * offset, y: y});
        }

        return positions;
    }

    private _getHorizontalPositions(): Map<number, { x: number, y: number }> {
        let positions = new Map<number, { x: number, y: number }>();

        let startY: number;
        let offset: number;
        let x: number = 349;

        if (this._params.size === 8) {
            startY = 168;
            offset = 74;
        } else if (this._params.size === 6) {
            startY = 190;
            offset = 96;
        } else {
            throw new Error("Unknown size");
        }

        for (let i = 0; i < this._params.size; i++) {
            positions.set(i, {x: x, y: startY + i * offset});
        }

        return positions;
    }
}
