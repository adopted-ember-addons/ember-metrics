import objectTransforms from '../../../utils/object-transforms';
import { module, test } from 'qunit';

module('Unit | Utility | object transforms', function() {
  test('#without returns an object without the specified keys', function(assert) {
    const employee = {
      name: 'Milton Waddams',
      stapler: 'Red',
      deskLocation: 'basement'
    };

    const expectedResult = {
      name: 'Milton Waddams',
      deskLocation: 'basement'
    };

    const result = objectTransforms.without(employee, [ 'stapler' ]);

    assert.deepEqual(result, expectedResult, 'it returns an object without the specified keys');
  });

  test('#only returns an object with only the specified keys', function(assert) {
    const employee = {
      name: 'Milton Waddams',
      stapler: 'Red',
      deskLocation: 'basement'
    };

    const expectedResult = {
      name: 'Milton Waddams',
      deskLocation: 'basement'
    };

    const result = objectTransforms.only(employee, [ 'name', 'deskLocation' ]);

    assert.deepEqual(result, expectedResult, 'it returns an object with only the specified keys');
  });

  test('#compact returns an object with all `null` and `undefined` elements removed', function(assert) {
    const rawData = {
      firstName: 'Michael',
      lastName: 'Bolton',
      company: undefined,
      age: null,
      favoriteDrink: ''
    };
    const expectedResult = {
      firstName: 'Michael',
      lastName: 'Bolton'
    };

    const result = objectTransforms.compact(rawData);
    assert.deepEqual(result, expectedResult, 'it should not contain `null` or `undefined` elements');
  });

  test('#isPresent returns `true` if an object is not empty ', function(assert) {
    const rawData = {
      foo: 'bar'
    };
    const expectedResult = true;

    const result = objectTransforms.isPresent(rawData);
    assert.equal(result, expectedResult, 'it returns `true` if an object is not empty');
  });

  test('#isPresent returns `false` if an object is empty ', function(assert) {
    const rawData = {};
    const expectedResult = false;

    const result = objectTransforms.isPresent(rawData);
    assert.equal(result, expectedResult, 'it returns `false` if an object is empty');
  });
});
