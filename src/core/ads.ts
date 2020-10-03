export class Ads {

    private static get window(): IWindow {
        return (<any>window);
    }

    public static showBanner(): Promise<void> {
        if (Ads.window.showBanner) {
            return Ads.window.showBanner();
        }
        return Promise.resolve();
    }

    public static hideBanner(): Promise<void> {
        if (Ads.window.hideBanner) {
            return Ads.window.hideBanner();
        }
        return Promise.resolve();
    }

    public static prepareInterstitial(): Promise<void> {
        if (Ads.window.prepareInterstitial) {
            return Ads.window.prepareInterstitial();
        }
        return Promise.resolve();
    }

    public static showInterstitial(): Promise<void> {
        if (Ads.window.showInterstitial) {
            return Ads.window.showInterstitial();
        }
        return Promise.resolve();
    }
}

interface IWindow {
    showBanner(): Promise<void>;

    hideBanner(): Promise<void>;

    prepareInterstitial(): Promise<void>;

    showInterstitial(): Promise<void>;
}
