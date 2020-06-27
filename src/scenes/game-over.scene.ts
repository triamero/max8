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

        const window = this.add.graphics();
        window.fillStyle(0x593711, 0.75);
        window.fillRoundedRect(150, 250, 300, 300, 50);

        const bound = this.add.graphics();
        bound.lineStyle(5, 0x000000, 0.75);
        bound.strokeRoundedRect(150, 250, 300, 300, 50);


        this._text = this.add.text(150, 300, this._getText(), {
            fontFamily: "m8",
            fontSize: 36,
            fixedWidth: 300,
            align: "center",
            color: "#aaaaaa"
        });

        this.add.existing(
            new MenuButtonObject(this, 300, 450)
                .setText("Завершить")
                .on("click", this._onComplete, this));
    }

    private _onComplete() {

        this.scene.start("menu");

        this.scene.stop("game");
        this.scene.stop("game-over");
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
