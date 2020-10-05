import * as Phaser from "phaser";
import {MenuButtonObject} from "@m8/objects";

export class MainMenuScene extends Phaser.Scene {

    // noinspection JSUnusedGlobalSymbols
    create() {

        let newGame = new MenuButtonObject(this, 350, 275)
            .setText("new_game")
            .on("click", () => this.scene.start("new-game"));

        let continueGame = new MenuButtonObject(this, 350, 375)
            .setText("continue")
            .on("click", () => this.scene.start("prepare-game", {isNew: false}));

        let training = new MenuButtonObject(this, 350, 475)
            .setText("training")
            .on("click", () => this.scene.start("training"));

        this.add.existing(newGame);
        this.add.existing(continueGame);
        this.add.existing(training);

        if (!localStorage.getItem("saved-game")) {
            continueGame.disable();
        }
    }
}
