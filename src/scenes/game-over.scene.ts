import {Difficulty, Result} from "@m8/core";
import {MenuButtonObject} from "@m8/objects";
import {AchievementsStorage} from "@m8/helpers";

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
        // у игрока больше очков чем у соперника - игрок победил
        if (this._result.enemyScore < this._result.playerScore) {

            if (this._result.difficulty === Difficulty.Easy) {
                AchievementsStorage.give(3);
            } else if (this._result.difficulty === Difficulty.Hard) {
                AchievementsStorage.give(4);
            }

            return "Вы победили!";
        }

        // у соперника больше очков чем у игрока - соперник победил
        if (this._result.enemyScore > this._result.playerScore) {
            AchievementsStorage.give(6);
            return "Вы проиграли";
        }

        // ничья
        AchievementsStorage.give(5);
        return "Ничья";
    }
}
