import BaseAdapter, { type AdapterOptions } from './base.ts';
export default class Intercom extends BaseAdapter {
    booted: boolean;
    toStringExtension(): string;
    install(): void;
    identify(options?: AdapterOptions): void;
    trackEvent(options?: AdapterOptions): void;
    trackPage(options?: AdapterOptions): void;
    uninstall(): void;
}
//# sourceMappingURL=intercom.d.ts.map