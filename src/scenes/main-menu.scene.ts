import {MenuButtonObject} from "@m8/objects";

export class MainMenuScene extends Phaser.Scene {

    create() {
        this.add.existing(new MenuButtonObject(this, 350, 250).setText("Новая игра").on("click", () => this.scene.start("new-game")));
        this.add.existing(new MenuButtonObject(this, 350, 350).setText("Продолжить").disable().on("click", () => this.scene.start("continue")));
        // this.add.existing(new MenuButtonObject(this, 350, 450).setText("Обучение").on("click", () => this.scene.start("training")));
        this.add.existing(new MenuButtonObject(this, 350, 450).setText("Достижения").on("click", () => this.scene.start("hall-of-fame")));
    }
}
