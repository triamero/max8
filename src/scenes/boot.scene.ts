import {Difficulty, GameConfig} from "@m8/core";

export class BootScene extends Phaser.Scene {

    preload() {
        this.load.image("flat-button", "dist/flat-button.png");
        this.load.image("square-button", "dist/square-button.png");
    }

    create() {
        const config: GameConfig = {
            size: 6,
            difficulty: Difficulty.Easy
        };

        this.scene.start("main-menu", config);
    }
}
