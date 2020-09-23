import {Difficulty, GameParameters} from "@m8/core";
import {MenuButtonObject, SquareButtonObject} from "@m8/objects";
import {GameStorage} from "@m8/helpers";

export class NewGameScene extends Phaser.Scene {

    private _easy: SquareButtonObject;
    private _hard: SquareButtonObject;

    private _small: SquareButtonObject;
    private _large: SquareButtonObject;

    private _prevGameParams: GameParameters;

    private _textStyle: any = {
        fontSize: 36,
        fontFamily: "m8",
        color: "#aaaaaa",
        fixedWidth: 430,
        align: "center"
    };

    // noinspection JSUnusedGlobalSymbols
    init() {
        this._prevGameParams = GameStorage.getGameParams();
    }

    // noinspection JSUnusedGlobalSymbols
    create() {
        this.add.text(140, 100, "ПРОТИВНИК", this._textStyle);
        this.add.existing(this._easy = new SquareButtonObject(this, 225, 250, "ПРОСТОЙ"));
        this.add.existing(this._hard = new SquareButtonObject(this, 475, 250, "СЛОЖНЫЙ"));

        this.add.text(140, 400, "РАЗМЕР ПОЛЯ", this._textStyle);
        this.add.existing(this._small = new SquareButtonObject(this, 225, 550, "6x6"));
        this.add.existing(this._large = new SquareButtonObject(this, 475, 550, "8x8"));

        this.add.existing(new MenuButtonObject(this, 350, 700).setText("Начать игру").on("click", this._startNewGame, this));

        if (this._prevGameParams) {
            this._easy.selected = this._prevGameParams.difficulty === Difficulty.Easy;
            this._hard.selected = this._prevGameParams.difficulty === Difficulty.Hard;

            this._small.selected = this._prevGameParams.size === 6;
            this._large.selected = this._prevGameParams.size === 8;
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

        const params: GameParameters = {
            difficulty: this._easy.selected ? Difficulty.Easy : Difficulty.Hard,
            size: this._small.selected ? 6 : 8,
            isNew: true,
            restart: false
        };

        GameStorage.saveGameParams(params);

        this.scene.start("prepare-game", params);
    }
}
