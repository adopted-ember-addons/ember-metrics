import { BaseConfig, ValidationType as VT, Validator } from './BaseConfig';

interface GoogleAnalyticsConfig extends BaseConfig {
  id: string;
  debug?: boolean;
  require?: ReadonlyArray<string>;
  sendHitTask?: boolean;
  trace?: boolean;
  trackerName?: string;
}

function validateGoogleAnalyticsConfig(config: Readonly<BaseConfig>): GoogleAnalyticsConfig {
  const v = new Validator(config);

  return {
    id: v.validate<string>('id', VT.string),
    debug: v.validateOpt<boolean>('debug', VT.boolean),
    require: v.validateArrayOpt<string>('require', VT.string),
    sendHitTask: v.validateOpt<boolean>('sendHitTask', VT.boolean),
    trace: v.validateOpt<boolean>('trace', VT.boolean),
    trackerName: v.validateOpt<string>('trackerName', VT.string),
  };
}

export { GoogleAnalyticsConfig, validateGoogleAnalyticsConfig };
