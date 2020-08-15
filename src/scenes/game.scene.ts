import {GameCell, GameConfig, GameField, IEnemyEngine, Result, Turn} from "@m8/core";
import {AchievementsStorage, Factory, GameStorage} from "@m8/helpers";
import {GameMenuButtonObject, PointerObject, TileObject} from "@m8/objects";

export class GameScene extends Phaser.Scene {

    private _factory: Factory;
    private _enemyEngine: IEnemyEngine;

    private _gameField: GameField;

    private _tiles: TileObject[][];

    /** Чей ход в данный момент */
    private _turn: Turn;

    private _playerSide: Side;
    private _enemySide: Side;

    private _pointer: PointerObject;

    // noinspection JSUnusedGlobalSymbols
    init(config: GameConfig): void {
        this._turn = Turn.Player;

        this._factory = config.factory;
        this._gameField = config.gameField;
        this._enemyEngine = config.engine;

        this._playerSide = {
            index: config.pointerIndex,
            score: config.playerScore,
            text: null
        };

        this._enemySide = {
            index: config.pointerIndex,
            score: config.enemyScore,
            text: null
        };

        this._saveGame();
    }

    // noinspection JSUnusedGlobalSymbols
    create() {
        this.input.setTopOnly(true);

        const scoreTextStyle = {fontFamily: "m8", fontSize: 24, fixedWidth: 100, align: "center"};

        this._playerSide.text = this.add.text(100, 100, "", scoreTextStyle);
        this._enemySide.text = this.add.text(500, 100, "", scoreTextStyle);

        this._tiles = [];

        const tweens: any[] = [];

        for (let x = 0; x < this._gameField.size; x++) {

            this._tiles.push([]);

            for (let y = 0; y < this._gameField.size; y++) {

                const cell = this._gameField.getCell(x, y);

                const tile =
                    this._tiles[x][y] =
                        this._factory
                            .createTile(this, x, y)
                            .setValue(this._gameField.getCell(x, y).value)
                            .setScale(0, 1)
                            .disable();

                if (cell.value === 0) {
                    tile.setDestroyed();
                }

                tweens.push({
                    targets: [tile],
                    scaleX: 1,
                    duration: 200,
                    delay: (x + y) * 40
                });
            }
        }

        const lastTween = tweens[tweens.length - 1];
        lastTween.onComplete = this._startGame.bind(this);
        tweens.forEach(x => {
            this.add.tween(x);
        });
    }

    update() {
        if (this._playerSide.text) {
            this._playerSide.text.setText(`${this._playerSide.score} очк.`);
        }
        if (this._enemySide.text) {
            this._enemySide.text.setText(`${this._enemySide.score} очк.`);
        }
    }

    private _startGame() {
        this._gameField.once("cell-taken", this._onTileTaken, this);

        this._tiles.forEach(rows => {
            rows.forEach(cell => {

                if (cell.getValue() !== 0) {
                    cell.on("click", () => this._onClickTile(cell.coords[0], cell.coords[1]))
                        .on("pointerover", () => cell.select())
                        .on("pointerout", () => cell.deselect());
                }
            });
        });

        this._pointer = this._factory.createPointer(this).setStrokeStyle(6, 0x778CA7);

        this._pointer.moveToVertical(this._playerSide.index);

        this._redrawField();

        this.add.existing(new GameMenuButtonObject(this, 600, 35).on("click", this._onGameMenuClick, this));
    }

    private _onTileTaken(x: number, y: number) {

        if (this._turn !== Turn.Player) {
            return;
        }

        const tile = this._tiles[x][y].select();

        if (tile.getValue() === 8) {
            AchievementsStorage.give(1);
        } else if (tile.getValue() == -8) {
            AchievementsStorage.give(2);
        }

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

        if (this._turn === Turn.Player) {
            score = this._playerSide.score;
        } else {
            score = this._enemySide.score;
        }

        const newScore = score + tile.getValue();

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

            for (let x = 0; x < this._tiles.length; x++) {
                for (let y = 0; y < this._tiles[x].length; y++) {

                    if (this._playerSide.index != x) {
                        this._tiles[x][y].disable();
                    } else {
                        this._tiles[x][y].enable();
                    }
                }
            }
        } else {

            for (let x = 0; x < this._tiles.length; x++) {
                for (let y = 0; y < this._tiles[x].length; y++) {

                    if (this._enemySide.index != y) {
                        this._tiles[x][y].disable();
                    } else {
                        this._tiles[x][y].enable();
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

        const tile = this._tiles[cell.x][cell.y].select();

        return new Promise<void>(async resolve => {
            setTimeout(async () => {
                await this._makeTurnAsync(tile, cell.x, cell.y);
                this._saveGame();
                resolve();
            }, 300);
        });
    }

    private _gameOver() {
        this._pointer.setVisible(false);

        const result: Result = {
            difficulty: this._factory.getParams().difficulty,
            playerScore: this._playerSide.score,
            enemyScore: this._enemySide.score
        };

        this.scene.launch("game-over", result);
        this.scene.pause();
    }

    private _saveGame() {

        if (!this._gameField.anyExists || !this._hasAnyMove(this._turn)) {
            GameStorage.removeGame();
            return;
        }

        const params = this._factory.getParams();

        GameStorage.saveGame({
            size: params.size,
            difficulty: params.difficulty,
            score: [this._playerSide.score, this._enemySide.score],
            index: this._playerSide.index,
            isNew: false,
            restart: false,
            cells: this._gameField.getCells()
        });
    }

    private _onGameMenuClick() {
        this.scene.launch("game-menu");

        const gameMenu = this.scene.get("game-menu");

        gameMenu.events.on("continue", () => {
            this.scene.resume();
        });

        this.scene.pause();
    }
}

export interface Side {
    index: number;
    score: number;
    text: Phaser.GameObjects.Text;
}
