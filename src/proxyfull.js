// attach to CommonJS, AMD, Node, or Window
// inspired by https://github.com/addyosmani/memoize.js/blob/master/memoize.js
(function(root, factory) {
  if (typeof define === 'function' && define.amd) { // eslint-disable-line no-undef
    // AMD. Register as an anonymous module.
    define([], factory); // eslint-disable-line no-undef
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.proxyfull = factory();
  }
}(this, function() {
  'use strict';

  function proxyfull(original, handler, logger, basePath) {

    if (typeof original !== 'object') throw TypeError('Cannot create proxy with a non-object as target');
    if (typeof handler !== 'object') throw TypeError('Cannot create proxy with a non-object as handler');

    if (typeof basePath === 'undefined') basePath = '';
    var _target = Object.assign({}, original);

    Object.keys(_target)
      .forEach(function(key) {
        if (typeof _target[key] === 'object' && !Array.isArray(_target[key])) {
          _target[key] = proxyfull.call({
            nested: true
          }, _target[key], handler, logger, basePath + '.' + key);
        }
      });

    const _handler = Object.assign({}, handler, {
      set: function(target, property, value, receiver) {
        if (logger) logger({
          action: 'set',
          target: target,
          value: value,
          receiver: receiver,
          path: JSONPath(basePath, property)
        });

        if (typeof value === 'object' && !Array.isArray(value)) Reflect.set(target, property, proxyfull.call({
          nested: true
        }, value, handler, logger, JSONPath(basePath, property)));
        else Reflect.set(target, property, value);

        Reflect.set(original, property, value);

        if (handler.set) return handler.set(target, property, value, receiver, JSONPath(basePath, property));
        else return true;
      }
    });

    let options = this;
    if (this === undefined) options = {
      revocable: false,
      nested: false
    };

    if (options.revocable) return Proxy.revocable(_target, _handler);
    else if (options.nested) return new Proxy(_target, _handler);
    else if (new.target) return new Proxy(_target, _handler);
    else throw TypeError('Constructor Proxy requires \'new\'');

  }

  proxyfull.revocable = function revocable(target, handler, logger) {
    return proxyfull.call({
      revocable: true
    }, target, handler, logger);
  };

  function JSONPath(basePath, property) {
    return (basePath + '.' + property)
      .match(/[^\.].*/)[0];
  }

  return proxyfull;
}));
