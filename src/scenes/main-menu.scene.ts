import {MenuButtonObject} from "@m8/objects";

export class MainMenuScene extends Phaser.Scene {

    // noinspection JSUnusedGlobalSymbols
    create() {

        let newGame = new MenuButtonObject(this, 350, 250)
            .setText("Новая игра")
            .on("click", () => this.scene.start("new-game"));

        let continueGame = new MenuButtonObject(this, 350, 350)
            .setText("Продолжить")
            .on("click", this._onContinue, this);

        let training = new MenuButtonObject(this, 350, 450)
            .setText("Обучение")
            .on("click", () => this.scene.start("training"));

        let achievements = new MenuButtonObject(this, 350, 450)
            .setText("Достижения")
            .on("click", () => this.scene.start("hall-of-fame"));

        this.add.existing(newGame);
        this.add.existing(continueGame);
        //this.add.existing(training);
        this.add.existing(achievements);

        if (!localStorage.getItem("saved-game")) {
            continueGame.disable();
        }

        this.scene.launch("new-achievement");
    }

    private _onContinue() {
        this.scene.start("prepare-game", {isNew: false});
    }
}
