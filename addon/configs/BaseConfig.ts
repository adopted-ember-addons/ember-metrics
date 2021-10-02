type BaseConfig = Record<string, unknown>;

const packageName = 'ember-metrics';

const err = (name: string, type: string): Error => {
  return new Error(`[${packageName}] Invalid ${type} value for ${name}.`);
};

enum ValidationType {
  boolean = 'boolean',
  number = 'number',
  string = 'string',
}

type Constraint<T> = (x: T) => boolean;

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
   * @param name       name of the attribute to validate
   * @param type       name of data type to validate (must match type parameter T)
   * @param constraint optional constraint on the value
   * @return           validated attribute as type T
   */
  validate<T>(this: Validator, name: string, type: ValidationType, constraint: Constraint<T> | undefined = undefined): T {
    const value: unknown = this.config[name];
    if (typeof value === type) {
      const v = value as T;
      if (constraint === undefined || constraint(v)) {
        return v;
      }
    }
    throw err(name, type);
  }

  /**
   * Validate an optional primitive.
   *
   * @typeParam T data type to validate
   *
   * @param name       name of the attribute to validate
   * @param type       name of data type to validate (must match type parameter T)
   * @param constraint optional constraint on the value
   * @return           validated attribute as type T
   */
  validateOpt<T>(
    this: Validator,
    name: string,
    type: ValidationType,
    constraint: Constraint<T> | undefined = undefined
  ): T | undefined {
    if (typeof this.config[name] === 'undefined') {
      return undefined;
    }
    return this.validate<T>(name, type, constraint);
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
          throw err(name, `array of ${type}`);
        }
      }
      return a as ReadonlyArray<T>;
    }
    if (typeof value === 'undefined') {
      return undefined;
    }
    throw err(name, `array of ${type}`);
  }
}

export { BaseConfig, Constraint, ValidationType, Validator };
