export class Ads {

    private static get window(): IWindow {
        return (<any>window);
    }

    public static showBanner(): Promise<void> {
        if (Ads.window.showBanner) {
            Ads.window.showBanner();
        }
        return Promise.resolve();
    }

    public static hideBanner(): Promise<void> {
        if (Ads.window.hideBanner) {
            Ads.window.hideBanner();
        }
        return Promise.resolve();
    }

    public static prepareInterstitial(): Promise<void> {
        if (Ads.window.prepareInterstitial) {
            Ads.window.prepareInterstitial();
        }
        return Promise.resolve();
    }

    public static showInterstitial(): Promise<void> {
        if (Ads.window.showInterstitial) {
            Ads.window.showInterstitial();
        }
        return Promise.resolve();
    }
}

interface IWindow {
    showBanner(): void;

    hideBanner(): void;

    prepareInterstitial(): void;

    showInterstitial(): void;
}
