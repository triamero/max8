import {Direction} from "@m8/core";

export class PointerObject extends Phaser.GameObjects.Rectangle {

    private _vertPositions: Map<number, { x: number, y: number }>;
    private _horizPositions: Map<number, { x: number, y: number }>;

    private readonly _size: number;
    private _direction: Direction;
    private _angle: number = 0;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        vertPositions: Map<number, { x: number, y: number }>,
        horizPositions: Map<number, { x: number, y: number }>,
        size: number) {
        super(scene, x, y, width, height);

        this._size = size;

        this._vertPositions = vertPositions;
        this._horizPositions = horizPositions;
        this._direction = Direction.Vertical;
    }

    public moveToVertical(index: number): void {
        const coords = {
            x: this._vertPositions.get(index).x,
            y: this.y
        };
        this.setPosition(coords.x, coords.y);
    }

    public moveToHorizontal(index: number): void {
        const coords = {
            x: this.x,
            y: this._horizPositions.get(index).y
        };
        this.setPosition(coords.x, coords.y);
    }

    public flipAsync(cellX: number, cellY: number): Promise<void> {

        if (this._angle > 0) {
            this._angle -= 90;
        } else if (this._angle <= 0) {
            this._angle += 90;
        }

        const newPosition: number[] = [0, 0];

        if (this._direction === Direction.Vertical) {
            newPosition[0] = this._horizPositions.get(cellY).x;
            newPosition[1] = this._horizPositions.get(cellY).y;
        } else {
            newPosition[0] = this._vertPositions.get(cellX).x;
            newPosition[1] = this._vertPositions.get(cellX).y;
        }

        return new Promise<void>(resolve => {

            this.scene.tweens.add({
                targets: [this],
                angle: this._angle,
                duration: 150,
                ease: "sine",
                x: newPosition[0],
                y: newPosition[1],
                repeat: 0,
                onComplete: () => {
                    this._direction = this._direction === Direction.Vertical
                        ? Direction.Horizontal
                        : Direction.Vertical;
                    resolve();
                    //this.scene
                }
            });
        });
    }

    public disable() {
        this.setAlpha(0);
    }

    public enable() {
        this.setAlpha(1);
    }

    private _getOrigin(position: number): number {
        return (position + 1) / this._size;
    }
}
