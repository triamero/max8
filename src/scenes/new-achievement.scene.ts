import {AchievementsStorage} from "@m8/helpers";

export class NewAchievementScene extends Phaser.Scene {

    private _icon: Phaser.GameObjects.Image;
    private _back: Phaser.GameObjects.Image;
    private _end: Phaser.GameObjects.Image;

    private _title: Phaser.GameObjects.Text;
    private _text: Phaser.GameObjects.Text;

    private readonly _duration: number = 150;

    private _inAction: boolean = false;

    private _myAchs: number[];

    // noinspection JSUnusedGlobalSymbols
    create() {
        this._back = this.add.image(350, 100, "ach-back").setScale(0, 1);
        this._end = this.add.image(350, 100, "ach-end").setAlpha(0);
        this._icon = this.add.image(350, 100, "ach-icon").setAlpha(0);

        this._title = this.add.text(220, 75, "Достижение получено", {
            fontSize: 24,
            fontFamily: "m8",
            color: "#cccccc",
            //fixedWidth: 74,
            align: "center"
        }).setAlpha(0);
        this._text = this.add.text(220, 105, "", {
            fontSize: 18,
            fontFamily: "m8",
            color: "#ffffff",
            //fixedWidth: 74,
            align: "center"
        }).setAlpha(0);

        this._myAchs = AchievementsStorage.getMy();
    }

    // noinspection JSUnusedGlobalSymbols
    update() {
        if (!this._inAction) {

            const newAchId = this._getNewAchievement();

            if (newAchId > -1) {
                this._inAction = true;

                // noinspection JSIgnoredPromiseFromCall
                this._show(newAchId);
            }
        }
    }

    private async _show(id: number): Promise<void> {

        const t0 = new Promise(resolve => {
            this.add.tween({
                targets: [this._icon],
                alpha: 1,
                duration: this._duration,
                onComplete: () => resolve()
            });
        });

        await t0;

        const t1 = new Promise(resolve => {
            this.add.tween({
                targets: [this._icon],
                x: 150,
                duration: this._duration,
                onComplete: () => resolve()
            });
        });

        const t2 = new Promise(resolve => {
            this.add.tween({
                targets: [this._end],
                x: 550,
                alpha: 1,
                duration: this._duration,
                onComplete: () => resolve()
            });
        });

        const t3 = new Promise(resolve => {
            this.add.tween({
                targets: [this._back],
                scaleX: 1,
                duration: this._duration,
                onComplete: () => resolve()
            });
        });

        await Promise.all([t1, t2, t3]);

        const text = AchievementsStorage.getById(id).name;

        this._title.setAlpha(1);
        this._text.setText(text).setAlpha(1);

        setTimeout(() => this._hide(), 3000);
    }

    private async _hide(): Promise<void> {

        this._title.setAlpha(0);
        this._text.setAlpha(0);

        const t1 = new Promise(resolve => {
            this.add.tween({
                targets: [this._icon],
                x: 350,
                duration: this._duration,
                onComplete: () => resolve()
            });
        });

        const t2 = new Promise(resolve => {
            this.add.tween({
                targets: [this._end],
                x: 350,
                alpha: 0,
                duration: this._duration,
                onComplete: () => resolve()
            });
        });

        const t3 = new Promise(resolve => {
            this.add.tween({
                targets: [this._back],
                scaleX: 0,
                duration: this._duration,
                onComplete: () => resolve()
            });
        });

        await Promise.all([t1, t2, t3]);

        this.add.tween({
            targets: [this._icon],
            alpha: 0,
            duration: this._duration,
            onComplete: () => {
                this._inAction = false;
            }
        });
    }

    private _getNewAchievement(): number {

        const newMy = AchievementsStorage.getMy();

        for (let i = 0; i < this._myAchs.length; i++) {
            if (newMy[i] === 1 && this._myAchs[i] === 0) {
                this._myAchs[i] = 1;

                if (AchievementsStorage.getById(i)) {
                    return i;
                }
            }
        }

        return -1;
    }
}
