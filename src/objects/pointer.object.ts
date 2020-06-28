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

    public async flipAsync(cellX: number, cellY: number): Promise<void> {

        const mainDiag = new Phaser.Geom.Line(0, 0, this._size - 1, this._size - 1);
        const sideDiag = new Phaser.Geom.Line(this._size - 1, 0, 0, this._size - 1);

        const center = new Phaser.Geom.Point();
        const target = new Phaser.Geom.Point();

        if (this._direction === Direction.Vertical) {

            target.x = this._horizPositions.get(cellY).x;
            target.y = this._horizPositions.get(cellY).y;

            const pseudoLine = new Phaser.Geom.Line(cellX, 0, cellX, this._size - 1);

            if (cellX < this._size / 2 && cellY < this._size / 2) {
                this._angle -= 90;
                Phaser.Geom.Intersects.LineToLine(pseudoLine, mainDiag, center);
            } else if (cellX < this._size / 2 && cellY >= this._size / 2) {
                this._angle += 90;
                Phaser.Geom.Intersects.LineToLine(pseudoLine, sideDiag, center);
            } else if (cellX >= this._size / 2 && cellY < this._size / 2) {
                this._angle += 90;
                Phaser.Geom.Intersects.LineToLine(pseudoLine, sideDiag, center);
            } else {
                this._angle -= 90;
                Phaser.Geom.Intersects.LineToLine(pseudoLine, mainDiag, center);
            }
        } else {

            target.x = this._vertPositions.get(cellX).x;
            target.y = this._vertPositions.get(cellX).y;

            const pseudoLine = new Phaser.Geom.Line(0, cellY, this._size - 1, cellY);

            if (cellX < this._size / 2 && cellY < this._size / 2) {
                this._angle += 90;
                Phaser.Geom.Intersects.LineToLine(pseudoLine, mainDiag, center);
            } else if (cellX < this._size / 2 && cellY >= this._size / 2) {
                this._angle -= 90;
                Phaser.Geom.Intersects.LineToLine(pseudoLine, sideDiag, center);
            } else if (cellX >= this._size / 2 && cellY < this._size / 2) {
                this._angle -= 90;
                Phaser.Geom.Intersects.LineToLine(pseudoLine, sideDiag, center);
            } else {
                this._angle += 90;
                Phaser.Geom.Intersects.LineToLine(pseudoLine, mainDiag, center);
            }
        }

        await this.rotateAsync(center, target);
    }

    private rotateAsync(center: Phaser.Geom.Point, targetPoint: Phaser.Geom.Point): Promise<void> {

        const distance = Phaser.Math.Distance.BetweenPoints(center, targetPoint);

        return new Promise<void>(resolve => {

            this.scene.tweens.add({
                targets: [this],
                angle: this._angle,
                x: targetPoint.x,
                y: targetPoint.y,
                duration: 150,
                ease: "Linear",
                repeat: 0,
                onActive: (tween: any, targets: any[]) => {
                    const me = targets[0];

                    var t = me.rotation + Math.atan2(targetPoint.y - center.y, targetPoint.x - center.x);
                    me.x = center.x + (distance * Math.cos(t));
                    me.y = center.y + (distance * Math.sin(t));
                },
                onComplete: () => {
                    this._direction = this._direction === Direction.Vertical
                        ? Direction.Horizontal
                        : Direction.Vertical;

                    if (this._angle % 180 === 0) {
                        this.setRotation(0);
                    }

                    this._angle %= 180;

                    resolve();
                }
            });
        });
    }
}
