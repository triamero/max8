import {MenuButtonObject} from "@m8/objects";

export class HallOfFameScene extends Phaser.Scene {

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

        this.add.existing(
            new MenuButtonObject(this, 350, 430)
                .setText("УЙТИ")
                .on("click", () => this.scene.switch("main-menu")));
    }
}
