import BaseAdapter, { type AdapterOptions } from './base.ts';
export default class Mixpanel extends BaseAdapter {
    toStringExtension(): string;
    install(): void;
    _injectScript(): void;
    identify(options?: AdapterOptions): void;
    trackEvent(options?: AdapterOptions): void;
    trackPage(options?: AdapterOptions): void;
    alias(options?: AdapterOptions): void;
    uninstall(): void;
}
//# sourceMappingURL=mixpanel.d.ts.map