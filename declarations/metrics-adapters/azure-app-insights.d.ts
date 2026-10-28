import BaseAdapter, { type AdapterOptions } from './base.ts';
export default class AzureAppInsightsAdapter extends BaseAdapter {
    toStringExtension(): string;
    install(): void;
    trackEvent(properties?: AdapterOptions): void;
    trackPage(options?: AdapterOptions): void;
    identify({ userId, accountId, storeInCookie, }?: {
        userId?: unknown;
        accountId?: unknown;
        storeInCookie?: boolean;
    }): void;
    uninstall(): void;
}
//# sourceMappingURL=azure-app-insights.d.ts.map