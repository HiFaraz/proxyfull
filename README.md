# Proxyfull

Proxyfull allows you to access the exact/deep property path when using Proxy objects. It does this by extending the native Proxy object while respecting the ECMAScript 2015 Proxy specification.

An example:

```javascript
const data = {
  symbol: 'TSLA',
  bidPrice: {
    value: 200,
    currency: 'USD',
    meta: {
      date: '2016-01-01'
    }
  }
};

// this is a regular Proxy handler object in which the `set` trap also receives the deep property path as the fifth argument
const handlers = {
  set: function(target, property, value, receiver, path) {
    console.log(`${property} was set to ${value} at ${path}`);
    return true; // required by ECMAScript 2015 specification in strict mode
  }
};

const proxy = new proxyfull(data, handlers); // use of the `new` keyword is required by the ECMAScript 2015 specification for Proxy objects

// prints 'date was set to 2016-12-31 at bidPrice.meta.date' to the console
proxy.bidPrice.meta.date = '2016-12-31';
```

## Installation

Proxyfull is published on the NPM registry:

`$ npm install proxyfull`

Proxyfull is also compatible with Yarn:

`$ yarn add proxyfull`

## Test coverage

Proxyfull provides a test specification written in Jasmine, which is registered as a development dependency. Start the test runner with the `test` script in `package.json` with either:

- NPM: `$ npm test`
- Yarn: `$ yarn test`

## Stability

Proxyfull respects the ECMAScript 2015 specification for Proxy objects, and therefore the API is considered stable for public use.

## Limitations

While Proxyfull can be used with any Proxy handlers, Proxyfull only injects the deep property path into the `set` handler. Work on injecting into other handlers (e.g. `handler.get`, `handler.apply`) is in progress.

## Why Proxies anyway?
The [Proxy](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy) object in ECMAScript 2015 is an amazing step towards deeply observable objects, which are needed for binding views to data models.

Before we had proxies we needed to use complicated abstractions, such as:

- event emitters (e.g. [PubSub patterns](http://www.lucaongaro.eu/blog/2012/12/02/easy-two-way-data-binding-in-javascript/))
- observable functions instead of working on the data model directly (e.g. [Knockout JS](http://knockoutjs.com/documentation/observables.html))
- dirty checking with watchers and a digest loop (e.g. [Angular JS](https://www.ng-book.com/p/The-Digest-Loop-and-apply/))

## API

You can use Proxyfull just as you can regular Proxy objects. Proxyfull respects the ECMAScript 2015 specification for Proxy objects.

Proxyfull enhancements are listed below:

### new proxyfull (target, handler, [logger])

- `target`: A regular Proxy target object
- `handler`: A regular Proxy handler object
- `[logger]`: An optional logging function which receives action objects. It must have a signature of `function(action)`. Actions have the following properties:
 - `action`
 - `target`
 - `property`
 - `receiver`
 - `path`

### handler.set (target, property, value, receiver, path)

The `set` trap receives the deep property path as a fifth argument, in addition to the regular [`handler.set` arguments](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/set)


## Roadmap
- Add a polyfill using object property getters/setters for graceful degradation
