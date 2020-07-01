import * as Phaser from "phaser";
import {GameStorage} from "@m8/helpers";

export class BootScene extends Phaser.Scene {

    preload() {
        this.load.image("flat-button", "dist/flat-button.png");
        this.load.image("square-button", "dist/square-button.png");
        this.load.image("gear", "dist/gear.png");
    }

    create() {
        this.scene.start("main-menu");
    }
}
