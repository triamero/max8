import {ClickableObject} from "./clickable.object";

export class TileObject extends ClickableObject {

    private readonly _rect: Phaser.GameObjects.Sprite;
    private readonly _bound: Phaser.GameObjects.Graphics;

    private _value: number;

    private _destroyed: boolean;
    private _coords: number[];

    public get coords(): number[] {
        return this._coords;
    }

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, coords: number[]) {
        super(scene, x, y);

        this._coords = coords;

        this._rect = scene.add.sprite(0, 0, "tiles");

        this._rect
            .setScale(width / this._rect.width, height / this._rect.height)
            .setAlpha(0.9);

        this._bound = scene.add.graphics()
            .lineStyle(5, 0xaaaaaa)
            .strokeRoundedRect(-width / 2, -height / 2, width, height, 23)
            .setVisible(false);

        this.setSize(width, height).setInteractive({useHandCursor: true});

        this.add([this._rect, this._bound]);
    }

    public select(): this {
        if (this._destroyed || !this.visible) {
            return this;
        }

        this._bound.setVisible(true);
        return this;
    }

    public deselect(): this {
        this._bound.setVisible(false);
        return this;
    }

    public setValue(value: number): this {
        this._value = value;

        if (value > 0) {
            this._rect.setFrame(8 - value);
        } else if (value < 0) {
            this._rect.setFrame(16 + value);
        }

        return this;
    }

    public getValue(): number {
        return this._value;
    }

    public disable(): this {

        if (this._destroyed) {
            return this;
        }

        this.disableInteractive();
        this.setAlpha(0.65);
        return this;
    }

    public enable(): this {

        if (this._destroyed) {
            return this;
        }

        this.setInteractive({useHandCursor: true});
        this.setAlpha(1);
        return this;
    }

    public setDestroyed(): this {
        this._destroyed = true;
        this.disableInteractive();
        this.setVisible(false);
        return this;
    }

    public destroyAsync(): Promise<void> {

        return new Promise(resolve => {
            this.scene.tweens.add({
                targets: [this],
                scale: 0,
                duration: 250,
                ease: "Linear",
                onComplete: () => {
                    this.setDestroyed();
                    resolve();
                }
            })
        });
    }
}
