import BaseAdapter, { type AdapterOptions } from './base.ts';
export default class Piwik extends BaseAdapter {
    toStringExtension(): string;
    install(): void;
    _injectScript(piwikUrl: string, siteId: unknown): void;
    identify(options?: AdapterOptions): void;
    trackEvent(options?: AdapterOptions): void;
    trackPage(options?: AdapterOptions): void;
    uninstall(): void;
}
//# sourceMappingURL=piwik.d.ts.map