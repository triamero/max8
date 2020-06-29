import {MenuButtonObject} from "@m8/objects";

export class GameMenuScene extends Phaser.Scene {

    private _text: Phaser.GameObjects.Text;

    // noinspection JSUnusedGlobalSymbols
    create() {
        const window = this.add.image(350, 400, "square-button").setScale(2);

        this.add.existing(
            new MenuButtonObject(this, 350, 450)
                .setText("Продолжить")
                .on("click", this._onContinue, this));

        this.add.existing(
            new MenuButtonObject(this, 350, 450)
                .setText("Заново")
                .on("click", this._onRestart, this));

        this.add.existing(
            new MenuButtonObject(this, 350, 450)
                .setText("Новая игра")
                .on("click", this._onNewGame, this));
    }

    private _onContinue() {
        this.scene.stop("game-menu");
    }

    private _onRestart() {

    }

    private _onNewGame() {

        this.scene.start("main-menu");

        this.scene.stop("game");
        this.scene.stop("game-over");
    }
}
