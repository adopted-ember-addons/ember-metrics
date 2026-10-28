import BaseAdapter, { type AdapterOptions } from './base.ts';
export default class GoogleAnalytics extends BaseAdapter {
    gaSendKey: string;
    toStringExtension(): string;
    install(): void;
    _injectScript(debug: unknown): void;
    identify(options?: AdapterOptions): void;
    trackEvent(options?: AdapterOptions): {
        hitType: string;
    };
    trackPage(options?: AdapterOptions): {
        hitType: string;
    };
    uninstall(): void;
}
//# sourceMappingURL=google-analytics.d.ts.map