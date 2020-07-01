import {Result, Turn} from "@m8/core";
import {MenuButtonObject} from "@m8/objects";

export class GameOverScene extends Phaser.Scene {

    private _result: Result;
    private _text: Phaser.GameObjects.Text;

    // noinspection JSUnusedGlobalSymbols
    init(result: Result) {
        this._result = result;
    }

    // noinspection JSUnusedGlobalSymbols
    create() {
        const window = this.add.image(350, 400, "square-button").setScale(2);
        this._text = this.add.text(200, 300, this._getText(), {
            fontFamily: "m8",
            fontSize: 36,
            fixedWidth: 300,
            align: "center",
            color: "#aaaaaa"
        });

        this.add.existing(
            new MenuButtonObject(this, 350, 400)
                .setText("Заново")
                .on("click", this._onRestart, this));

        this.add.existing(
            new MenuButtonObject(this, 350, 470)
                .setText("Выйти")
                .on("click", this._onComplete, this));
    }

    private _onComplete() {

        this.scene.start("main-menu");

        this.scene.stop("game");
        this.scene.stop("game-over");
    }

    private _onRestart() {
        this.scene.start("prepare-game", {restart: true});
    }

    private _getText(): string {

        if (this._result.boardEmpty) {
            // у игрока больше очков чем у соперника - игрок победил
            if (this._result.enemyScore < this._result.playerScore) {
                return "Вы победили!";
            }

            // у соперника больше очков чем у игрока - соперник победил
            if (this._result.enemyScore > this._result.playerScore) {
                return "Вы проиграли";
            }

            // ничья
            return "Ничья";
        }

        // игроку некуда ходить - соперник победил
        if (this._result.turn === Turn.Player) {
            return "Вы проиграли";
        }

        // сопернику некуда ходить - игрок победил
        return "Вы победили!";
    }
}
