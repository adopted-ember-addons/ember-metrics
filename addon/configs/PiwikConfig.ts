import { BaseConfig, Constraint, ValidationType as VT, Validator } from './BaseConfig';

interface PiwikConfig extends BaseConfig {
  piwikUrl: string;
  siteId: number;
}

function validatePiwikConfig(config: Readonly<BaseConfig>): PiwikConfig {
  const v = new Validator(config);

  const positiveInteger: Constraint<number> = (x) => x > 0 && Number.isInteger(x);

  return {
    piwikUrl: v.validate<string>('piwikUrl', VT.string),
    siteId: v.validate<number>('siteId', VT.number, positiveInteger),
  };
}

export { PiwikConfig, validatePiwikConfig };
