import BaseAdapter, { type AdapterOptions } from './base.ts';
export default class Hotjar extends BaseAdapter {
    toStringExtension(): string;
    install(): void;
    identify(options?: AdapterOptions): void;
    trackEvent(options?: AdapterOptions): void;
    trackPage(options?: AdapterOptions): void;
    uninstall(): void;
}
//# sourceMappingURL=hotjar.d.ts.map