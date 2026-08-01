import BaseAdapter, { type AdapterOptions } from './base.ts';
export default class GoogleAnalyticsFour extends BaseAdapter {
    options: Record<string, unknown>;
    toStringExtension(): string;
    install(): void;
    _injectScript(id: string): void;
    gtag(...args: unknown[]): object;
    trackEvent(options?: AdapterOptions): object | undefined;
    trackPage(options?: AdapterOptions): object | undefined;
    uninstall(): void;
}
//# sourceMappingURL=google-analytics-four.d.ts.map