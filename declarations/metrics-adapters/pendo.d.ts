import BaseAdapter, { type AdapterOptions } from './base.ts';
export default class Pendo extends BaseAdapter {
    toStringExtension(): string;
    install(): void;
    identify(options?: AdapterOptions): void;
    trackEvent(options?: AdapterOptions): void;
    trackPage(options?: AdapterOptions): void;
    uninstall(): void;
}
//# sourceMappingURL=pendo.d.ts.map