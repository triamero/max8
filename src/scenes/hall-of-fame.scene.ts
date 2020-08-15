import * as Phaser from "phaser";
import {AchievementsStorage} from "@m8/helpers";
import {MenuButtonObject} from "@m8/objects";
import {Achievement} from "@m8/core";

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export class HallOfFameScene extends Phaser.Scene {

    private _grid: any;

    // noinspection JSUnusedGlobalSymbols
    preload() {
        this.load.scenePlugin({key: "rexuiplugin", url: "dist/rexuiplugin.min.js", sceneKey: "rexUI"});
    }

    // noinspection JSUnusedGlobalSymbols
    create() {

        AchievementsStorage.give(7);

        const my = AchievementsStorage.getMy();

        this._grid = this.rexUI.add
            .gridTable({
                x: 350,
                y: 400,
                width: 600,
                height: 630,

                scrollMode: 0,

                background: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, 0x2e3c4c),

                table: {
                    cellWidth: undefined,
                    cellHeight: 110,

                    columns: 1,

                    mask: {
                        padding: 2,
                    },

                    reuseCellContainer: true,
                },

                header: this.rexUI.add.label({
                    height: 30,
                    text: this.add.text(0, 0, `Открыто: ${my.count(x => x > 0)}/${my.length}`, {
                        fontSize: "24px",
                        fontFamily: "m8",
                        color: "#aaaaaa"
                    }),
                }),

                slider: {
                    track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, 0x0f1f31),
                    thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 13, 0xaaaaaa),
                },

                space: {
                    left: 20,
                    right: 20,
                    top: 20,
                    bottom: 20,

                    table: 10,
                    header: 10,
                    footer: 10,
                },

                createCellContainerCallback: (cell: any, cellContainer: any) => {
                    let scene = cell.scene,
                        width: number = cell.width,
                        height: number = cell.height,
                        item: Achievement = cell.item;

                    if (cellContainer === null) {

                        cellContainer = scene.rexUI.add.label({
                            width: width,
                            height: height,

                            background: scene.rexUI.add
                                .roundRectangle(0, 0, 20, 20, 5)
                                .setStrokeStyle(2, 0xaaaaaa),

                            icon: scene.add.image(0, 0, "ach-icon"),
                            text: scene.add.existing(new AchievementText(scene, 0, 0)),

                            space: {
                                icon: 10,
                                left: 15,
                                top: 0,
                            }
                        });
                    }

                    cellContainer.getElement("text").setAchievement(item.name, item.description);
                    cellContainer.getElement("icon").setTexture(item.unlocked ? "ach-icon" : "ach-icon-locked");

                    return cellContainer.setMinSize(width, height);
                },
                items: this._createItems()
            })
            .layout();

        this.add.existing(
            new MenuButtonObject(this, 350, 730)
                .setText("УЙТИ")
                .on("click", () => this.scene.switch("main-menu")));
    }

    private _createItems(): Achievement[] {
        return AchievementsStorage.getMy()
            .map((v: number, index: number) => AchievementsStorage.getById(index));
    }
}


class AchievementText extends Phaser.GameObjects.Container {

    private readonly _name: Phaser.GameObjects.Text;
    private readonly _description: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);

        this._name = scene.add.text(0, -45, "", {
            fontSize: "24px",
            fontFamily: "m8",
            color: "#aaaaaa",
            wordWrap: {width: 400, useAdvancedWrap: true}
        });
        this._description = scene.add.text(0, 0, "", {
            fontSize: "18px",
            fontFamily: "m8",
            color: "#aaaaaa",
            wordWrap: {width: 400, useAdvancedWrap: true}
        });

        this.add([this._name, this._description]);
    }

    public setAchievement(name: string, description: string): this {
        this._name.setText(name);
        this._description.setText(description);
        return this;
    }
}
