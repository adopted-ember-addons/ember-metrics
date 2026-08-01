import BaseAdapter, { type AdapterOptions } from './base.ts';
export default class GoogleTagManager extends BaseAdapter {
    dataLayer: string;
    toStringExtension(): string;
    install(): void;
    trackEvent(options?: AdapterOptions): Record<string, unknown>;
    trackPage(options?: AdapterOptions): {
        event: {};
    };
    uninstall(): void;
}
//# sourceMappingURL=google-tag-manager.d.ts.map