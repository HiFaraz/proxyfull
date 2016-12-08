'use strict';

const Proxy = require('../');

const feedData = {
  name: 'hi',
  data: {
    age: 30,
    skill: 2,
    courses: [3, 4, 5]
  }
};

describe('Writing data to the Proxy', function() {

  it('should keep parity with the original data', function() {

    const myProxy = Proxy.revocable(feedData, {});

    myProxy.proxy.name = 'bye';
    expect(myProxy.proxy)
      .toEqual(feedData);

    myProxy.proxy.data.age = {
      initial: 12
    };
    expect(myProxy.proxy)
      .toEqual(feedData);

    myProxy.proxy.data.skill = {
      initial: [1, 2, 3]
    };
    expect(myProxy.proxy)
      .toEqual(feedData);

    myProxy.proxy.newProperty = 2;
    expect(myProxy.proxy)
      .toEqual(feedData);

  });

  it('should provide the property path to the handlers and to the logger', function() {

    const myProxy = new Proxy(feedData, {
      set: function(target, property, value, receiver, path) {
        expect(path)
          .toEqual(value);
        return true;
      }
    }, function(action) {
      expect(action.path)
        .toEqual(action.value);
    });

    myProxy.name = 'name';
    myProxy.data.skill = 'data.skill';
    myProxy.data = 'data';

  });

});
