import {Difficulty, GameConfig} from "@m8/core";
import {MenuButtonObject, SquareButtonObject} from "@m8/objects";

export class NewGameScene extends Phaser.Scene {

    private _easy: SquareButtonObject;
    private _hard: SquareButtonObject;

    private _small: SquareButtonObject;
    private _large: SquareButtonObject;

    private _prevGameConfig: GameConfig;

    private _textStyle: any = {
        fontSize: 36,
        fontFamily: "m8",
        color: "#000000",
        fixedWidth: 430,
        align: "center"
    };

    // noinspection JSUnusedGlobalSymbols
    init() {
        const prevGameJson = localStorage.getItem("game-config");

        if (prevGameJson) {
            this._prevGameConfig = JSON.parse(prevGameJson);
        } else {
            this._prevGameConfig = null;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    create() {
        this.add.image(300, 400, "background");

        this.add.text(90, 100, "УРОВЕНЬ СЛОЖНОСТИ", this._textStyle);
        this.add.existing(this._easy = new SquareButtonObject(this, 175, 250, "НИЗКИЙ"));
        this.add.existing(this._hard = new SquareButtonObject(this, 425, 250, "ВЫСОКИЙ"));

        this.add.text(90, 400, "РАЗМЕР ПОЛЯ", this._textStyle);
        this.add.existing(this._small = new SquareButtonObject(this, 175, 550, "6x6"));
        this.add.existing(this._large = new SquareButtonObject(this, 425, 550, "8x8"));

        this.add.existing(new MenuButtonObject(this, 300, 700).setText("Начать игру").on("click", this._startNewGame, this));

        if (this._prevGameConfig) {
            this._easy.selected = this._prevGameConfig.difficulty === Difficulty.Easy;
            this._hard.selected = this._prevGameConfig.difficulty === Difficulty.Hard;

            this._small.selected = this._prevGameConfig.size === 6;
            this._large.selected = this._prevGameConfig.size === 8;
        } else {
            this._easy.selected = true;
            this._small.selected = true;
        }

        this._easy.on("click", () => this._toggleDifficulty(true, false));
        this._hard.on("click", () => this._toggleDifficulty(false, true));

        this._small.on("click", () => this._toggleSize(true, false));
        this._large.on("click", () => this._toggleSize(false, true));
    }

    private _toggleDifficulty(easy: boolean, hard: boolean) {
        this._easy.selected = easy;
        this._hard.selected = hard;
    }

    private _toggleSize(small: boolean, large: boolean) {
        this._small.selected = small;
        this._large.selected = large;
    }

    private _startNewGame() {

        const config: GameConfig = {
            difficulty: this._easy.selected ? Difficulty.Easy : Difficulty.Hard,
            size: this._small.selected ? 6 : 8
        };

        localStorage.setItem("game-config", JSON.stringify(config));

        this.scene.start("game", config);
    }
}
