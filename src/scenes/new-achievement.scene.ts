export class NewAchievementScene extends Phaser.Scene {
    create() {
        const rect = this.add.rectangle(350, -100, 300, 100, 0xffffff);
        const text = this.add.text(350, -100, "AI lives matter",{
            color: "#000000",
            font: "m8"
        });

        this.add.tween({
            targets: [rect, text],
            y: 100,
            x: 350,
            duration: 1500,
            ease: "Linear"
        });
    }
}
