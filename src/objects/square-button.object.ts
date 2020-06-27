import {ClickableObject} from "./clickable.object";

export class SquareButtonObject extends ClickableObject {

    private readonly _graphics: Phaser.GameObjects.Graphics;
    private readonly _img: Phaser.GameObjects.Image;
    private readonly _text: Phaser.GameObjects.Text;

    private _selected: boolean;

    public get selected(): boolean {
        return this._selected;
    }

    public set selected(value: boolean) {
        if (value) {
            this._selected = true;
            this._img.setTint(0x555555, 0x555555, 0xffffff, 0xffffff);
            this._graphics.lineStyle(5, 0xf8fc03, 0.75);
            this._graphics.strokeRoundedRect(-88, -88, 176, 176, 50);
        } else {
            this._selected = false;
            this._img.setTint(0xffffff, 0xffffff, 0x555555, 0x555555);
            this._graphics.clear();
        }
    }

    constructor(scene: Phaser.Scene, x: number, y: number, text: string) {
        super(scene, x, y);

        this._img = scene.add.image(0, 0, "square-button");
        this._text = scene.add.text(-85, -14, text, {
            fontSize: "24px",
            fontFamily: "m8",
            color: "#aaaaaa",
            fixedWidth: 170,
            align: "center"
        });

        this._graphics = scene.add.graphics();

        this.add([this._img, this._text, this._graphics]);

        this._img.setTint(0xffffff, 0xffffff, 0x555555, 0x555555);

        this.setSize(176, 176).setInteractive({useHandCursor: true});
    }
}
