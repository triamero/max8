import * as Phaser from "phaser";

export class ArrowHandlerPlugin {

    private readonly _emitter: Phaser.Events.EventEmitter;


    constructor(private _cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        this._emitter = new Phaser.Events.EventEmitter()
    }

    update() {
        if (this._cursors.up.isDown) {
            this._emitter.emit("up");
        } else if (this._cursors.down.isDown) {
            this._emitter.emit("down");
        } else if (this._cursors.left.isDown) {
            this._emitter.emit("left");
        } else if (this._cursors.right.isDown) {
            this._emitter.emit("right");
        }
    }

    public on(event: string, handler: Function, context?: any): void {
        this._emitter.on(event, handler, context);
    }

    public off(event: string) {
        this._emitter.off(event);
    }
}
