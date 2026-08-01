import BaseAdapter, { type AdapterOptions } from './base.ts';
export default class FacebookPixel extends BaseAdapter {
    toStringExtension(): string;
    install(): void;
    trackEvent(options?: AdapterOptions): void;
    trackPage(options?: AdapterOptions): void;
    uninstall(): void;
}
//# sourceMappingURL=facebook-pixel.d.ts.map