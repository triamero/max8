declare module "phaser" {

    interface Scene {
        rexUI: RexUIPlugins;
    }

    interface RexUIPlugins {
        add: RexUIGameObjectFactory;
    }
}

interface RexUIGameObjectFactory {
    label(config: RexUILabelConfig): any;

    roundRectangle(x: number, y: number, width: number, height: number, radius: number, color?: number | string): any;

    gridTable(config: any): any;
}

interface RexUILabelConfig {
    width?: number | undefined;
    height?: number | undefined;
    orientation?: number | string;
    icon?: Phaser.GameObjects.GameObject;
    text?: Phaser.GameObjects.GameObject;
    background?: any;

    space?: {
        icon?: number;
        left?: number;
        right?: number;
        top?: number;
        bottom?: number;
    }
}
