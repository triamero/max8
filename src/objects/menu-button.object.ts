import * as Phaser from "phaser";
import {ClickableObject} from "./clickable.object";

export class MenuButtonObject extends ClickableObject {

    private readonly _img: Phaser.GameObjects.Image;
    private readonly _text: Phaser.GameObjects.Text;

    private _enabled: boolean = true;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);

        this._img = scene.add.image(0, 0, "flat-button")
            .setTint(0xffffff, 0xffffff, 0x555555, 0x555555);

        this._text = scene.add.text(-131, -12, "", {
            fixedWidth: 261,
            fontSize: 24,
            fontFamily: "m8",
            color: "#aaaaaa",
            align: "center"
        });

        this.add([this._img, this._text])
            .setSize(261, 58)
            .setInteractive({useHandCursor: true});

        this.on("pointerover", this.onPointerOver, this)
            .on("pointerout", this.onPointerOut, this)
            .on("pointerup", this.onPointerUp, this)
            .on("pointerdown", this.onPointerDown, this);
    }

    public setText(text: string): this {
        this._text.setText(text.toUpperCase());
        return this;
    }

    public disable(): this {
        this._img.setTint(0xeeeeee);
        this._img.setAlpha(0.75);

        this._enabled = false;
        this.disableInteractive();
        return this;
    }

    public enable(): this {
        this._img.setTint(0xffffff, 0xffffff, 0x555555, 0x555555);
        this._img.setAlpha(1);

        this._enabled = true;
        this.setInteractive({useHandCursor: true});
        return this;
    }

    private onPointerOver() {

        if (this._enabled) {
            this._img.setTint(0xffffff, 0xffffff, 0x777777, 0x777777);
        }
    }

    private onPointerOut() {
        if (this._enabled) {
            this._img.setTint(0xffffff, 0xffffff, 0x555555, 0x555555);
        }
    }

    private onPointerDown() {
        if (this._enabled) {
            this._img.setTint(0x555555, 0x555555, 0xffffff, 0xffffff);
        }
    }

    private onPointerUp() {
        if (this._enabled) {
            this._img.setTint(0xffffff, 0xffffff, 0x555555, 0x555555);
        }
    }
}
