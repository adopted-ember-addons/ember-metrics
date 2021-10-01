import { BaseConfig, ValidationType as VT, Validator } from './BaseConfig';

interface PiwikConfig extends BaseConfig {
  piwikUrl: string;
  siteId: number;
}

function validatePiwikConfig(config: Readonly<BaseConfig>): PiwikConfig {
  const v = new Validator(config);

  return {
    piwikUrl: v.validate<string>('piwikUrl', VT.string),
    siteId: v.validate<number>('siteId', VT.number),
  };
}

export { PiwikConfig, validatePiwikConfig };
