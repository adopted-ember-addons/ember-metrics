import BaseAdapter, { type AdapterOptions } from './base.ts';
export default class AmplitudeMetricsAdapter extends BaseAdapter {
    _identity?: AmplitudeIdentify;
    toStringExtension(): string;
    install(): void;
    identify(options?: AdapterOptions): void;
    trackEvent(options?: AdapterOptions): void;
    trackPage(options?: AdapterOptions): void;
    optOut(): void;
    optIn(): void;
    uninstall(): void;
}
//# sourceMappingURL=amplitude.d.ts.map