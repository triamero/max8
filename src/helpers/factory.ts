import {Difficulty, EasyEnemyEngine, GameConfig, GameField, HardEnemyEngine, IEnemyEngine} from "@m8/core";
import {PointerObject, TileObject} from "@m8/objects";

export class Factory {

    constructor(private _config: GameConfig) {

    }

    public createEngine(): IEnemyEngine {
        if (this._config.difficulty === Difficulty.Easy) {
            return new EasyEnemyEngine();
        }

        if (this._config.difficulty === Difficulty.Hard) {
            return new HardEnemyEngine();
        }

        throw new Error("Unknown difficulty");
    }

    /** Создать игровое поле */
    public createField(): GameField {
        return new GameField(this._config.size);
    }

    /** Создать игровое поле из массива ячеек */
    public createFieldFromCells(cells: number[][]): GameField {
        const field = new GameField(this._config.size);

        for (let x = 0; x < field.size; x++) {
            for (let y = 0; y < field.size; y++) {

                const value = cells[x][y];

                const cell = field.getCell(x, y);

                if (value === 0) {
                    cell.destroy();
                } else {
                    cell.setValue(value);
                }
            }
        }

        return field;
    }

    public createTile(scene: Phaser.Scene, x: number, y: number): TileObject {

        const startX = this._config.size === 8 ? 56 : 64;
        const startY = 100;

        const size: number = this._config.size === 8 ? 68 : 90;

        const offset: number = this._config.size === 8 ? 74 : 96;

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

        if (this._config.size === 8) {
            x = 156;
            y = 427;
            width = 74;
            height = 592;
        } else if (this._config.size === 6) {
            x = 174;
            y = 430;
            width = 96;
            height = 575;
        }

        const pointer = new PointerObject(scene, x, y, width, height, this._getVerticalPositions(), this._getHorizontalPositions(), this._config.size);
        scene.add.existing(pointer);
        return pointer;
    }

    private _getVerticalPositions(): Map<number, { x: number, y: number }> {
        let positions = new Map<number, { x: number, y: number }>();

        let startX: number;
        let offset: number;
        let y: number;

        if (this._config.size === 8) {
            startX = 90;
            offset = 74;
            y = 427;
        } else if (this._config.size === 6) {
            startX = 109;
            offset = 96;
            y = 430;
        } else {
            throw new Error("Unknown size");
        }

        for (let i = 0; i < this._config.size; i++) {
            positions.set(i, {x: startX + i * offset, y: y});
        }

        return positions;
    }

    private _getHorizontalPositions(): Map<number, { x: number, y: number }> {
        let positions = new Map<number, { x: number, y: number }>();

        let startY: number;
        let offset: number;
        let x: number = 349;

        if (this._config.size === 8) {
            startY = 168;
            offset = 74;
        } else if (this._config.size === 6) {
            startY = 190;
            offset = 96;
        } else {
            throw new Error("Unknown size");
        }

        for (let i = 0; i < this._config.size; i++) {
            positions.set(i, {x: x, y: startY + i * offset});
        }

        return positions;
    }
}
