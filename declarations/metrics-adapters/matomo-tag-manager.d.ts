import BaseAdapter, { type AdapterOptions } from './base.ts';
export default class MatomoTagManager extends BaseAdapter {
    toStringExtension(): string;
    install(): void;
    _injectScript(matomoUrl: string, containerId: string): void;
    identify(options?: AdapterOptions): void;
    trackEvent(options?: AdapterOptions): void;
    trackPage(options?: AdapterOptions): void;
    uninstall(): void;
}
//# sourceMappingURL=matomo-tag-manager.d.ts.map