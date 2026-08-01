import BaseAdapter, { type AdapterOptions } from './base.ts';
export default class Segment extends BaseAdapter {
    toStringExtension(): string;
    install(): void;
    alias(options?: AdapterOptions): void;
    identify(options?: AdapterOptions): void;
    trackEvent(options?: AdapterOptions): void;
    trackPage(options?: AdapterOptions): void;
    uninstall(): void;
}
//# sourceMappingURL=segment.d.ts.map