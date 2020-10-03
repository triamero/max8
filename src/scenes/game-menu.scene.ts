import * as Phaser from "phaser";
import {MenuButtonObject} from "@m8/objects";

export class GameMenuScene extends Phaser.Scene {

    // noinspection JSUnusedGlobalSymbols
    create() {
        this.add.image(350, 400, "square-button").setScale(2);

        this.add.existing(
            new MenuButtonObject(this, 350, 330)
                .setText("Продолжить")
                .on("click", this._onContinue, this));

        this.add.existing(
            new MenuButtonObject(this, 350, 400)
                .setText("Заново")
                .on("click", this._onRestart, this));

        this.add.existing(
            new MenuButtonObject(this, 350, 470)
                .setText("Выйти")
                .on("click", this._onExit, this));
    }

    private _onContinue() {
        this.scene.scene.events.emit("continue");
        this.scene.stop("game-menu");
    }

    private _onRestart() {
        this.scene.start("prepare-game", {restart: true});
    }

    private _onExit() {
        this.scene.start("main-menu");
        this.scene.stop("game");
    }
}
