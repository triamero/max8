import * as Phaser from "phaser";

export class BootScene extends Phaser.Scene {

    // noinspection JSUnusedGlobalSymbols
    preload() {
        this.load.image("flat-button", "assets/flat-button.png");
        this.load.image("square-button", "assets/square-button.png");
        this.load.image("settings", "assets/settings.png");
        this.load.image("back", "assets/back.png");
        this.load.image("color", "assets/color.png");

        this.load.spritesheet("tiles", "assets/tiles.png", {
            frameHeight: 176,
            frameWidth: 176,
            startFrame: 0,
            endFrame: 15
        });
    }

    // noinspection JSUnusedGlobalSymbols
    create() {
        this.scene.start("main-menu");
    }
}
