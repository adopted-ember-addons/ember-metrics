type BaseConfig = Record<string, unknown>;

const packageName = 'ember-metrics';

const err = (name: string, type: string, optional = false): Error => {
  return new Error(`[${packageName}] Invalid ${optional ? 'optional ' : ''}${type} value for ${name}.`);
};

enum ValidationType {
  boolean = 'boolean',
  number = 'number',
  string = 'string',
}

/**
 * Validate a configuration object.
 */
class Validator {
  /**
   * @param config configuration object for validation.
   */
  constructor(private readonly config: Readonly<BaseConfig>) {}

  /**
   * Validate a primitive.
   *
   * @typeParam T data type to validate
   *
   * @param name name of the attribute to validate
   * @param type name of data type to validate (must match type parameter T)
   * @return     validated attribute as type T
   */
  validate<T>(this: Validator, name: string, type: ValidationType): T {
    const value: unknown = this.config[name];
    if (typeof value === type) {
      return value as T;
    }
    throw err(name, type);
  }

  /**
   * Validate an optional primitive.
   *
   * @typeParam T data type to validate
   *
   * @param name name of the attribute to validate
   * @param type name of data type to validate (must match type parameter T)
   * @return     validated attribute as type T
   */
  validateOpt<T>(this: Validator, name: string, type: ValidationType): T | undefined {
    const value: unknown = this.config[name];
    if (typeof value === type) {
      return value as T;
    }
    if (typeof value === 'undefined') {
      return undefined;
    }
    throw err(name, type, true);
  }

  /**
   * Validate an optional array.
   *
   * @typeParam T data type to validate
   *
   * @param name name of the attribute to validate
   * @param type name of the array element data type to validate (must match type parameter T)
   * @return     validated attribute as type ReadonlyArray<T>
   */
  validateArrayOpt<T>(this: Validator, name: string, type: ValidationType): ReadonlyArray<T> | undefined {
    const value: unknown = this.config[name];
    if (Array.isArray(value)) {
      const a = value as Array<unknown>;
      for (const s of a) {
        if (typeof s !== type) {
          throw err(name, `array of ${type}`, true);
        }
      }
      return a as ReadonlyArray<T>;
    }
    if (typeof value === 'undefined') {
      return undefined;
    }
    throw err(name, `array of ${type}`, true);
  }
}

export { BaseConfig, ValidationType, Validator };
