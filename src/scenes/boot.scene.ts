import * as Phaser from "phaser";

export class BootScene extends Phaser.Scene {

    // noinspection JSUnusedGlobalSymbols
    preload() {
        this.load.image("flat-button", "dist/flat-button.png");
        this.load.image("square-button", "dist/square-button.png");
        this.load.image("gear", "dist/gear.png");
    }

    // noinspection JSUnusedGlobalSymbols
    create() {
        this.scene.start("main-menu");
    }
}
