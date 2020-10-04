import * as Phaser from "phaser";
import {Ads, Difficulty, GameCell, GameConfig, GameField, IEnemyEngine, Result, Turn} from "@m8/core";
import {Factory, GameStorage} from "@m8/helpers";
import {ControlButtonObject, PointerObject, TileObject} from "@m8/objects";

export class GameScene extends Phaser.Scene {

    private _difficulty: Difficulty;
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
        this._difficulty = config.difficulty;

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

        this.events
            .on("start", Ads.showBanner)
            .on("resume", Ads.showBanner)
            .on("wake", Ads.showBanner)

            .on("pause", Ads.hideBanner)
            .on("shutdown", Ads.hideBanner)
            .on("sleep", Ads.hideBanner)
            .on("destroy", Ads.hideBanner);

        Ads.showBanner();
        Ads.prepareInterstitial();
    }

    // noinspection JSUnusedGlobalSymbols
    create() {
        this.input.setTopOnly(true);

        let playerScoreTextStyle = {fontFamily: "m8", fontSize: 24, fixedWidth: 200, align: "left"};
        let enemyScoreTextStyle = {fontFamily: "m8", fontSize: 24, fixedWidth: 210, align: "right"};

        this._playerSide.text = this.add.text(70, 100, "", playerScoreTextStyle);
        this._enemySide.text = this.add.text(420, 100, "", enemyScoreTextStyle);

        this.add.existing(new ControlButtonObject(this, 100, 35, "back").on("click", () => {
            this.scene.start("main-menu");
            this.scene.stop();
        }));
        // this.add.existing(new ControlButtonObject(this, 530, 35, "color"));
        this.add.existing(new ControlButtonObject(this, 600, 35, "settings").on("click", this._onSettingsClick, this));

        this._tiles = [];
        for (let x = 0; x < this._gameField.size; x++) {

            this._tiles.push([]);
            for (let y = 0; y < this._gameField.size; y++) {
                const cell = this._gameField.getCell(x, y);

                const tile = this._tiles[x][y] =
                    this._factory
                        .createTile(this, x, y)
                        .setValue(this._gameField.getCell(x, y).value)
                        .setScale(0, 1)
                        .disable();

                if (cell.value === 0) {
                    tile.setDestroyed();
                } else {
                    tile.on("click", () => this._onClickTile(tile.coords[0], tile.coords[1]))
                        .on("pointerover", () => tile.select())
                        .on("pointerout", () => tile.deselect());
                }

                let tween = {
                    targets: [tile],
                    scaleX: 1,
                    duration: 200,
                    delay: (x + y) * 40,
                    onComplete: <Function>null
                };

                if (x === this._gameField.size - 1 && y === this._gameField.size - 1) {
                    tween.onComplete = this._startGame.bind(this)
                }

                this.add.tween(tween);
            }
        }
    }

    update() {
        if (this._playerSide.text) {
            this._playerSide.text.setText(`Игрок: ${this._playerSide.score} очк.`);
        }
        if (this._enemySide.text) {
            let enemy = this._difficulty == Difficulty.Hard ? "Сложный" : "Простой";
            this._enemySide.text.setText(`${enemy}: ${this._enemySide.score} очк.`);
        }
    }

    private _startGame() {
        this._gameField.once("cell-taken", this._onTileTaken, this);

        this._pointer = this._factory.createPointer(this).setStrokeStyle(6, 0x778CA7);

        this._pointer.moveToVertical(this._playerSide.index);

        this._redrawField();
    }

    private _onTileTaken(x: number, y: number) {

        if (this._turn !== Turn.Player) {
            return;
        }

        const tile = this._tiles[x][y].select();

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

    private _onSettingsClick() {
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
