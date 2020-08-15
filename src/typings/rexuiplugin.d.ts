declare module "phaser" {

    interface Scene {
        rexUI: RexUIPlugins;
    }

    interface RexUIPlugins {
        add: RexUIGameObjectFactory;
    }

    namespace Plugins {
        namespace GameObjects {
            class ContainerBase extends Phaser.GameObjects.Zone {
                constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number);

                destroy(fromScene?: boolean): void;

                contains(gameObject: Phaser.GameObjects.GameObject): boolean;

                add(gameObjects: Phaser.GameObjects.GameObject[]): this;

                remove(gameObjects: Phaser.GameObjects.GameObject[], destroyChild: boolean): this;

                clear(destroyChild: boolean): this;
            }

            class ContainerLite extends ContainerBase {
                constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, children: Phaser.GameObjects.GameObject[])
            }
        }
    }
}

interface RexUIGameObjectFactory {
    label(config: RexUILabelConfig): any;

    scrollablePanel(config: RexUIScrollablePanelConfig): RexUIScrollablePanel;

    sizer(config: any): any;

    gridSizer(config: RexUIGridSizerConfig): RexUIGridSizer;

    roundRectangle(x: number, y: number, width: number, height: number, radius: number, color?: number | string): any;

    fixWidthSizer(config: RexUIFixWidthSizerConfig): any;

    gridTable(config: any): any;
}

interface RexUIScrollablePanel {
    layout(): this;
}

interface RexUIScrollablePanelConfig {
    x: number;
    y: number;

    width: number;
    height: number;

    scrollMode: number;

    background?: any;

    panel?: any;

    scroller?: {
        threshold: number;
        slidingDeceleration: number;
        backDeceleration: number;
    };

    slider?: any;

    space: {
        left?: number;
        right?: number;
        top?: number;
        bottom?: number;

        panel?: number;
    }
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

interface RexUIFixWidthSizerConfig {
    space: {
        left?: number;
        right?: number;
        top?: number;
        bottom?: number;

        panel?: number;

        item?: number;
        line?: number;
    }
}

interface RexUIGridSizerConfig {
    x?: number;
    y?: number;
    width?: number;
    height?: number;

    anchor?: number;

    column: number;
    row: number;
}

interface RexUIGridSizer {
    add(gameObject: Phaser.GameObjects.GameObject, column: number, row: number, align?: string, padding?: number, expand?: boolean, key?: string): this;
}
