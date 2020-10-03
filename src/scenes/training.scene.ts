import * as Phaser from "phaser";
import {ControlButtonObject} from "@m8/objects";

export class TrainingScene extends Phaser.Scene {

    // noinspection JSUnusedGlobalSymbols
    create() {
        this.add.text(200, 300, "YOU'RE NOT SUPPOSED TO BE HERE. GO AWAY", {
            fixedWidth: 300,
            fontSize: "24px",
            fontFamily: "m8",
            color: "#aaaaaa",
            align: "center",
            wordWrap: {width: 300, useAdvancedWrap: true}
        });

        this.add.text(360, 370, "- LEVELORD", {
            fixedWidth: 150,
            fontSize: "18px",
            fontFamily: "m8",
            color: "#aaaaaa",
            align: "center",
            wordWrap: {width: 300, useAdvancedWrap: true}
        });

        this.add.existing(new ControlButtonObject(this, 100, 35, "back").on("click", () => {
            this.scene.start("main-menu");
            this.scene.stop();
        }));
    }
}
