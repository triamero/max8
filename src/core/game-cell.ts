export class GameCell {

    private readonly _x: number;
    private readonly _y: number;

    private readonly _value: number = 0;
    private _isDestroyed: boolean = false;

    public get isDestroyed(): boolean {
        return this._isDestroyed;
    }

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }

    public get value(): number {
        return this._value;
    }

    constructor(x: number, y: number, value: number) {
        this._x = x;
        this._y = y;
        this._value = value;
    }

    destroy(): void {
        this._isDestroyed = true;
    }
}
