import {GameConfig, GameCell, GameField, IEnemyEngine, Result, Turn} from "@m8/core";
import {Factory, RandomHelper} from "@m8/helpers";
import {PointerObject, TileObject} from "@m8/objects";

export class GameScene extends Phaser.Scene {

    private _factory: Factory;
    private _enemyEngine: IEnemyEngine;

    private _gameField: GameField;

    private _cells: TileObject[][];

    /** Чей ход в данный момент */
    private _turn: Turn;

    private _playerSide: Side;
    private _enemySide: Side;

    private _pointer: PointerObject;

    // noinspection JSUnusedGlobalSymbols
    init(config: GameConfig): void {
        this._turn = Turn.Player;

        this._factory = new Factory(config);

        this._gameField = this._factory.createField();
        this._enemyEngine = this._factory.createEngine();
        this._enemyEngine.setField(this._gameField);
    }

    // noinspection JSUnusedGlobalSymbols
    create() {
        this.input.setTopOnly(true);

        this._cells = [];

        const tweens: any[] = [];

        for (let x = 0; x < this._gameField.size; x++) {

            this._cells.push([]);

            for (let y = 0; y < this._gameField.size; y++) {
                this._cells[x][y] =
                    this._factory
                        .createTile(this, x, y)
                        .setValue(this._gameField.getCell(x, y).value)
                        .setScale(0, 1)
                        .disable();

                tweens.push({
                    targets: [this._cells[x][y]],
                    scaleX: 1,
                    duration: 200,
                    delay: x * 40 + y * 40 * this._gameField.size
                });
            }
        }

        const lastTween = tweens[tweens.length - 1];
        lastTween.onComplete = this._startGame.bind(this);
        tweens.forEach(x => {
            this.add.tween(x);
        });
    }

    private _startGame() {
        this._gameField.once("cell-taken", this._onTileTaken, this);

        this._cells.forEach(rows => {
            rows.forEach(cell => {
                cell.on("click", () => this._onClickTile(cell.coords[0], cell.coords[1]))
                    .on("pointerover", () => cell.select())
                    .on("pointerout", () => cell.deselect());
            });
        });

        this._playerSide = {
            index: RandomHelper.GenerateIndex(this._gameField.size),
            score: 0,
            text: this.add.text(50, 100, "0 очк.", {fontFamily: "m8", fontSize: 24, fixedWidth: 100, align: "center"})
        };

        this._enemySide = {
            index: RandomHelper.GenerateIndex(this._gameField.size),
            score: 0,
            text: this.add.text(450, 100, "0 очк.", {fontFamily: "m8", fontSize: 24, fixedWidth: 100, align: "center"})
        };

        this._pointer = this._factory.createPointer(this).setStrokeStyle(6, 0x778CA7);

        this._pointer.moveToVertical(this._playerSide.index);

        this._redrawField();
    }

    private _onTileTaken(x: number, y: number) {

        if (this._turn !== Turn.Player) {
            return;
        }

        const tile = this._cells[x][y].select();

        setTimeout(
            async () => {
                await this._makeTurnAsync(tile, x, y);
                tile.deselect();
            },
            100);
    }

    private _onClickTile(x: number, y: number) {
        this._gameField.take(x, y);
    }

    private async _makeTurnAsync(tile: TileObject, x: number, y: number): Promise<void> {

        let score: number;
        let text: Phaser.GameObjects.Text;

        if (this._turn === Turn.Player) {
            score = this._playerSide.score;
            text = this._playerSide.text;
        } else {
            score = this._enemySide.score;
            text = this._enemySide.text;
        }

        const newScore = score + tile.getValue();
        text.setText(`${newScore} очк.`);

        if (this._turn === Turn.Player) {
            this._playerSide.score = newScore;
        } else {
            this._enemySide.score = newScore;
        }

        await tile.destroyAsync();
        this._gameField.take(x, y);

        if (!this._gameField.anyExists) {
            this._gameOver();
            return;
        }

        await this._toggleTurnAsync(x, y);

        if (!this._hasAnyMove(this._turn)) {
            this._gameOver();
            return;
        }

        this._redrawField();

        await this._enemyTurnAsync();
    }

    private async _toggleTurnAsync(cellX: number, cellY: number): Promise<void> {

        const cell = this._cells[cellX][cellY];

        await this._pointer.flipAsync(cellX, cellY);

        if (this._turn === Turn.Player) {
            this._turn = Turn.Enemy;
            this._enemySide.index = cellY;
        } else {
            this._turn = Turn.Player;
            this._playerSide.index = cellX;
            this._gameField.once("cell-taken", this._onTileTaken, this);
        }
    }

    private _redrawField(): void {
        if (this._turn === Turn.Player) {

            for (let x = 0; x < this._cells.length; x++) {
                for (let y = 0; y < this._cells[x].length; y++) {

                    if (this._playerSide.index != x) {
                        this._cells[x][y].disable();
                    } else {
                        this._cells[x][y].enable();
                    }
                }
            }
        } else {

            for (let x = 0; x < this._cells.length; x++) {
                for (let y = 0; y < this._cells[x].length; y++) {

                    if (this._enemySide.index != y) {
                        this._cells[x][y].disable();
                    } else {
                        this._cells[x][y].enable();
                    }
                }
            }
        }
    }

    private _hasAnyMove(turn: Turn): boolean {

        const cells: GameCell[] =
            turn === Turn.Player
                ? this._gameField.getColumn(this._playerSide.index)
                : this._gameField.getRow(this._enemySide.index);

        for (let i = 0; i < cells.length; i++) {

            if (!cells[i].isDestroyed) {
                return true;
            }
        }

        return false;
    }

    private async _enemyTurnAsync(): Promise<void> {

        if (this._turn !== Turn.Enemy) {
            return;
        }

        const cell = await this._enemyEngine.makeTurnAsync(this._enemySide.index);

        const tile = this._cells[cell.x][cell.y];
        tile.select();

        return new Promise<void>(async resolve => {
            setTimeout(async () => {
                await this._makeTurnAsync(tile, cell.x, cell.y);
                resolve();
            }, 300);
        });
    }

    private _gameOver() {
        this._pointer.setVisible(false);

        const result: Result = {
            boardEmpty: !this._gameField.anyExists,

            playerScore: this._playerSide.score,
            enemyScore: this._enemySide.score,

            turn: this._turn
        };

        this.scene.launch("game-over", result);
        this.scene.pause();
    }
}

export interface Side {
    index: number;
    score: number;
    text: Phaser.GameObjects.Text;
}
