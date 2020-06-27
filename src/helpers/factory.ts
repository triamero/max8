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

    public createField(): GameField {
        return new GameField(this._config.size);
    }

    public createTile(scene: Phaser.Scene, x: number, y: number): TileObject {

        const startX = this._config.size === 8 ? 6 : 14;
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
            x = 116;
            y = 427;
            width = 74;
            height = 592;
        } else if (this._config.size === 6) {
            x = 124;
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

        if (this._config.size === 8) {
            positions.set(0, {x: 40, y: 427});
            positions.set(1, {x: 114, y: 427});
            positions.set(2, {x: 188, y: 427});
            positions.set(3, {x: 262, y: 427});
            positions.set(4, {x: 336, y: 427});
            positions.set(5, {x: 410, y: 427});
            positions.set(6, {x: 484, y: 427});
            positions.set(7, {x: 558, y: 427});
        } else if (this._config.size === 6) {
            positions.set(0, {x: 59, y: 430});
            positions.set(1, {x: 155, y: 430});
            positions.set(2, {x: 251, y: 430});
            positions.set(3, {x: 347, y: 430});
            positions.set(4, {x: 443, y: 430});
            positions.set(5, {x: 539, y: 430});
        } else {
            throw new Error("Unknown size");
        }

        return positions;
    }

    private _getHorizontalPositions(): Map<number, { x: number, y: number }> {
        let positions = new Map<number, { x: number, y: number }>();

        if (this._config.size === 8) {
            positions.set(0, {x: 299, y: 168});
            positions.set(1, {x: 299, y: 242});
            positions.set(2, {x: 299, y: 316});
            positions.set(3, {x: 299, y: 390});
            positions.set(4, {x: 299, y: 464});
            positions.set(5, {x: 299, y: 538});
            positions.set(6, {x: 299, y: 612});
            positions.set(7, {x: 299, y: 686});

        } else if (this._config.size === 6) {
            positions.set(0, {x: 299, y: 190});
            positions.set(1, {x: 299, y: 286});
            positions.set(2, {x: 299, y: 382});
            positions.set(3, {x: 299, y: 478});
            positions.set(4, {x: 299, y: 574});
            positions.set(5, {x: 299, y: 670});
        } else {
            throw new Error("Unknown size");
        }

        return positions;
    }
}
