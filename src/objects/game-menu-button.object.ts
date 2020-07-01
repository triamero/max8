import {ClickableObject} from "./clickable.object";

export class GameMenuButtonObject extends ClickableObject {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);

        const img = scene.add.image(0, 0, "gear");

        img.setTint(0xffffff, 0xffffff, 0x999999, 0x999999);

        this.add([img]);

        this.on("pointerover", () => {
            img.setTint(0xffffff, 0xffffff, 0xaaaaaa, 0xaaaaaa);
        });
        this.on("pointerout", () => {
            img.setTint(0xffffff, 0xffffff, 0x999999, 0x999999);
        });

        this.setSize(img.width, img.height).setInteractive({useHandCursor: true});
    }
}
