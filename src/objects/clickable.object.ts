import * as Phaser from "phaser";

export abstract class ClickableObject extends Phaser.GameObjects.Container {
    private _isPressed: boolean = false;

    protected constructor(
        scene: Phaser.Scene,
        x: number,
        y: number) {
        super(scene, x, y);

        this
            .on("pointerdown", this._onPointerDown, this)
            .on("pointerup", this._onPointerUp, this)
            .on("pointerout", this._onPointerOut, this);
    }

    private _onPointerDown() {
        this._isPressed = true;
    }

    private _onPointerUp() {
        if (this._isPressed) {
            this.emit("click");
        }
        this._isPressed = false;
    }

    private _onPointerOut() {
        this._isPressed = false;
    }
}
