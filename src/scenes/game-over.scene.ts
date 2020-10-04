import * as Phaser from "phaser";
import {Ads, Result} from "@m8/core";
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
        this.add.image(350, 400, "square-button").setScale(2);
        this._text = this.add.text(200, 300, "", {
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

        let result = this._getResult();

        switch (result) {
            case GameResult.Winner: {
                this._text.setText("Вы победили!");
                break;
            }
            case GameResult.Loser: {
                this._text.setText("Вы проиграли");
                Ads.showInterstitial();
                break;
            }
            case GameResult.Draw: {
                this._text.setText("Ничья");
                break
            }
        }
    }

    private _onComplete() {
        this.scene.start("main-menu");
        this.scene.stop("game");
        this.scene.stop("game-over");
    }

    private _onRestart() {
        this.scene.start("prepare-game", {restart: true});
    }

    private _getResult(): GameResult {
        // у соперника меньше очков чем у игрока - игрок победил
        if (this._result.enemyScore < this._result.playerScore) {
            return GameResult.Winner;
        }
        // у соперника больше очков чем у игрока - соперник победил
        if (this._result.enemyScore > this._result.playerScore) {
            return GameResult.Loser;
        }
        return GameResult.Draw;
    }
}

enum GameResult {
    Loser = -1,
    Draw = 0,
    Winner = 1
}
