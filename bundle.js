(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const index = require('./src/index');
const dashboard = require('./src/dashboard');
const library = require('./src/library');
const libdetails = require('./src/libdetails')
const newlibgame = require('./src/newlibgame')

const pageInitialization = {
  '/' : index.init,
  '/index.html': index.init,
  '/dashboard.html': dashboard.init,
  '/library.html': library.init,
  '/libdetails.html': libdetails.init,
  '/newlibgame.html': newlibgame.init
}

const path = window.location.pathname
if(pageInitialization.hasOwnProperty(path)) {
  pageInitialization[path]()
}
else {
  console.error(`${path} does not have an initializer`)
}
},{"./src/dashboard":29,"./src/index":30,"./src/libdetails":31,"./src/library":32,"./src/newlibgame":33}],2:[function(require,module,exports){
module.exports = require('./lib/axios');
},{"./lib/axios":4}],3:[function(require,module,exports){
(function (process){
'use strict';

var utils = require('./../utils');
var settle = require('./../core/settle');
var buildURL = require('./../helpers/buildURL');
var parseHeaders = require('./../helpers/parseHeaders');
var isURLSameOrigin = require('./../helpers/isURLSameOrigin');
var createError = require('../core/createError');
var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || require('./../helpers/btoa');

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false;

    // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
    if (process.env.NODE_ENV !== 'test' &&
        typeof window !== 'undefined' &&
        window.XDomainRequest && !('withCredentials' in request) &&
        !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;
      request.onprogress = function handleProgress() {};
      request.ontimeout = function handleTimeout() {};
    }

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request[loadEvent] = function handleLoad() {
      if (!request || (request.readyState !== 4 && !xDomain)) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/axios/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = require('./../helpers/cookies');

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

}).call(this,require('_process'))

},{"../core/createError":10,"./../core/settle":13,"./../helpers/btoa":17,"./../helpers/buildURL":18,"./../helpers/cookies":20,"./../helpers/isURLSameOrigin":22,"./../helpers/parseHeaders":24,"./../utils":26,"_process":28}],4:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;

},{"./cancel/Cancel":5,"./cancel/CancelToken":6,"./cancel/isCancel":7,"./core/Axios":8,"./defaults":15,"./helpers/bind":16,"./helpers/spread":25,"./utils":26}],5:[function(require,module,exports){
'use strict';

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;

},{}],6:[function(require,module,exports){
'use strict';

var Cancel = require('./Cancel');

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

},{"./Cancel":5}],7:[function(require,module,exports){
'use strict';

module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

},{}],8:[function(require,module,exports){
'use strict';

var defaults = require('./../defaults');
var utils = require('./../utils');
var InterceptorManager = require('./InterceptorManager');
var dispatchRequest = require('./dispatchRequest');

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, {method: 'get'}, this.defaults, config);
  config.method = config.method.toLowerCase();

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;

},{"./../defaults":15,"./../utils":26,"./InterceptorManager":9,"./dispatchRequest":11}],9:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

},{"./../utils":26}],10:[function(require,module,exports){
'use strict';

var enhanceError = require('./enhanceError');

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

},{"./enhanceError":12}],11:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var transformData = require('./transformData');
var isCancel = require('../cancel/isCancel');
var defaults = require('../defaults');
var isAbsoluteURL = require('./../helpers/isAbsoluteURL');
var combineURLs = require('./../helpers/combineURLs');

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

},{"../cancel/isCancel":7,"../defaults":15,"./../helpers/combineURLs":19,"./../helpers/isAbsoluteURL":21,"./../utils":26,"./transformData":14}],12:[function(require,module,exports){
'use strict';

/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request;
  error.response = response;
  return error;
};

},{}],13:[function(require,module,exports){
'use strict';

var createError = require('./createError');

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

},{"./createError":10}],14:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};

},{"./../utils":26}],15:[function(require,module,exports){
(function (process){
'use strict';

var utils = require('./utils');
var normalizeHeaderName = require('./helpers/normalizeHeaderName');

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

}).call(this,require('_process'))

},{"./adapters/http":3,"./adapters/xhr":3,"./helpers/normalizeHeaderName":23,"./utils":26,"_process":28}],16:[function(require,module,exports){
'use strict';

module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

},{}],17:[function(require,module,exports){
'use strict';

// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error;
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars;
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

module.exports = btoa;

},{}],18:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

},{"./../utils":26}],19:[function(require,module,exports){
'use strict';

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

},{}],20:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

  // Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })()
);

},{"./../utils":26}],21:[function(require,module,exports){
'use strict';

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

},{}],22:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      var href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                  urlParsingNode.pathname :
                  '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })()
);

},{"./../utils":26}],23:[function(require,module,exports){
'use strict';

var utils = require('../utils');

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

},{"../utils":26}],24:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

},{"./../utils":26}],25:[function(require,module,exports){
'use strict';

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

},{}],26:[function(require,module,exports){
'use strict';

var bind = require('./helpers/bind');
var isBuffer = require('is-buffer');

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};

},{"./helpers/bind":16,"is-buffer":27}],27:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],28:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],29:[function(require,module,exports){

},{}],30:[function(require,module,exports){
// let axios = require('axios') - "require is not defined" - using cdn


function init(){


    const createUserFormHTML = 
    `
    <form class='form-signin'>
        <h2 class='audiowide'>Create an account</h2>
        <label for="username-create">Username</label>
        <input type="text" name="username-create" id="username-create" class="form-control" placeholder="User" required autofocus><br>
    
        <label for="fname-create">First name</label>
        <input type="text" name="fname-create" id="fname-create" class="form-control" placeholder="First" required><br>
        <label for="lname-create">Last name</label>
        <input type="text" name="lname-create" id="lname-create" class="form-control" placeholder="Last" required><br>

        <label for="password-create">Password</label>
        <input type="text" name="password-create" id="password-create" class="form-control" placeholder="password" required> <br>
        <input type='submit' id="submit-create" class="btn btn-primary" value='Start my log!'>
        <button class='btn btn-primary' id='back-to-sign-in'>Back to sign-in</button>

    </form>
    `




    function request(path, method = 'get', body = null) {
    let bearerToken = ''
    const token = localStorage.getItem('token')
    if(token){
        bearerToken = `Bearer ${token}`
    }

    return axios(`http://localhost:3000${path}`, {
        method: method,
        headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': bearerToken
        },
        data: body
    })
    }



    window.addEventListener('DOMContentLoaded', () => {    

        let submitSign = document.getElementById('submit-signin')
    //sign in
        submitSign.addEventListener('click', (e) => {
            e.preventDefault()
            let alertBar = document.getElementById('alert-bar')  
            alertBar.innerHTML = ``
            let username = document.getElementById('username').value
            let password = document.getElementById('password').value
            console.log(username, password)
            if (!username || !password) {
                let alertBar = document.getElementById('alert-bar')  
                alertBar.innerHTML = ` 
                    <div class="alert alert-danger" role="alert">
                    Please fill out both User and Password fields.
                    </div>`
                    return
            }
            request('/auth/token', 'post', { username , password })
            .then(function(response){
                localStorage.setItem('token', response.data.token)
                window.location = 'dashboard.html'
            })
            .catch(() => {
                let alertBar = document.getElementById('alert-bar')  
                alertBar.innerHTML = ` 
                    <div class="alert alert-danger" role="alert">
                    Incorrect username or password.
                    </div>`
                throw {error: {status: 400, message: `Authentication failed`}}
                
            })

        })
    //create user
        let goToCreate = document.getElementById('go-to-create')
        goToCreate.addEventListener('click', () => {
            let alertBar = document.getElementById('alert-bar')  
            alertBar.innerHTML = ``
            let formSpace = document.getElementById('form-space')
            formSpace.innerHTML = createUserFormHTML
            let backBtn = document.getElementById('back-to-sign-in')
            backBtn.addEventListener('click', () => { location.reload() })


            let submitCreate = document.getElementById('submit-create')

            submitCreate.addEventListener('click', (e) => {
                e.preventDefault()
                let username = document.getElementById('username-create').value
                let fname = document.getElementById('fname-create').value
                let lname = document.getElementById('lname-create').value
                let password = document.getElementById('password-create').value
                if (!username || !fname || !lname || !password) {
                    let alertBar = document.getElementById('alert-bar')  
                    alertBar.innerHTML = ` 
                        <div class="alert alert-danger" role="alert">
                        Please fill out all fields.
                        </div>`
                        return
                }
                console.log(username, fname, lname, password)
                axios.post(`http://localhost:3000/user`, { "username": username, "password": password, "fname": fname, "lname": lname } )
                    .then(response => { 
                        console.log(response)
                        if (response.data.error) {
                            console.log(response.data.error.message)
                            let alertBar = document.getElementById('alert-bar')  
                            alertBar.innerHTML = ` 
                                <div class="alert alert-danger" role="alert">
                                <strong>Error:</strong>${response.data.error.message}
                                </div>`
                                
                        }
                        window.location = 'dashboard.html'
                        alert('user created!')//can add custom dashboard welcome message here for new user if we want  
                    })
                    .catch(() => {
                        let alertBar = document.getElementById('alert-bar')  
                        alertBar.innerHTML = ` 
                            <div class="alert alert-danger" role="alert">
                            Could not create user.
                            </div>`
                        throw {error: {status: 400, message: "Could not create user"}}
                    })
            })
        })

    })

 }
    



module.exports = {init}


},{}],31:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}],32:[function(require,module,exports){
function addNewEvent(){

    document.getElementById('add-new-game').addEventListener('click', function(e) {
        e.preventDefault()
        window.location = '/newlibgame.html'
    })
}

function init(){
    addNewEvent()
}

module.exports = {init}
},{}],33:[function(require,module,exports){
const { request } = require('../utils')

function addEventListeners(){
    console.log('hello!')
    document.getElementById('searchSub').addEventListener('click', function(e){
        console.log('hello!')
        let searchBox = document.getElementById('searchText')
        searchIGDB(searchBox.value)
    })
}

function searchIGDB(searchString){
    request(`/games/${searchString}`, 'get')
    .then(result => {
        console.log(result)
    })


    // .then(result => {
    //     document.querySelector('#newSuccess').classList.remove('hide-confirm')
    //     setTimeout(() => {
    //         document.querySelector('#newSuccess').classList.add('hide-confirm')
    //         window.location = `/show.html?=${result.data[0].id}`
    //     }, 1000);
    // })
    // .catch(error => {
    //     if(error.response.status === 406) {alert("ERROR 406, Invalid Parameters: Ratings must be 1-5")}
    //     else {
    //         alert(error)
    //         window.location = '/home.html'
    //     }   
    // })
}

function init(){
    addEventListeners()
}

module.exports = {init}
},{"../utils":34}],34:[function(require,module,exports){
const axios = require('axios')

function request(path, method = 'get', body = null) {
 
  return axios(`http://localhost:3000${path}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: body
  })

//   return axios(`https://arcane-brook-34722.herokuapp.com${path}`, {
//     method: method,
//     headers: {
//       'Content-Type': 'application/json',
//       'Accept': 'application/json'
//     },
//     data: body
//   })
}

},{}],4:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],5:[function(require,module,exports){
function init() {

    const create = require('./templates');

    const testArr = [
        {
        igdb_id: 41608,
        title: 'Halo: The Master Chief Collection',
        cover_url: '//images.igdb.com/igdb/image/upload/t_thumb/kuaub4pjaajuepmlxuq3.jpg',
        desc: 'Relive the greatest adventures of the ultimate solder with Halo: The Master Chief Collection, which includes the complete story of the Master Chief on one console for the first time ever. Halo: Combat Evolved , Halo 2, Halo 3 and Halo 4 are all packed into this massive package. And not only is the debut Halo delivered in its acclaimed Anniversary package, but for the first time, an entirely remastered version of the iconic sequel that revolutionized online console gaming is available with the Halo 2 Anniversary version of the game. This collection lets you experience Halo in an all-new way, at higher visual fidelity running at 60 frames per second (fps) on dedicated servers. \n \nHalo: The Master Chief Collection features curated campaign and multiplayer playlists across all four games and features more than 100 multiplayer maps -- authentic to their original release. In addition, Halo 2 Anniversary includes six all-new maps built from the ground up for Xbox One.'
    },
    {
        igdb_id: 25076, 
        title: 'Red Dead Redemption 2', 
        cover_url: '//images.igdb.com/igdb/image/upload/t_thumb/yfk9f2lbo0r7slytuhra.jpg' ,
        desc: 'Developed by the creators of Grand Theft Auto V and Red Dead Redemption, Red Dead Redemption 2 is an epic tale of life in America’s unforgiving heartland. The game\'s vast and atmospheric world will also provide the foundation for a brand new online multiplayer experience.' 
    }
];

    function generateGames(arr) {

        function formatCover(str) {
            let newStr = str.slice(2);
            return `http://${newStr}`;
        };

        function formatDesc(str) {
            if(str.length <= 300) {
                return str
            } else {
                let newStr = str.slice(0, 300)
                return `${newStr}...`;
            }
        }

        const appliedTemplates = arr.map(game => create.publicGameRow(game.igdb_id, formatCover(game.cover_url), game.title, formatDesc(game.desc))).join('\n');
        document.querySelector(".main-body").innerHTML = appliedTemplates;
    }

    generateGames(testArr);
}
module.exports= {
    init,
}

},{"./templates":6}],6:[function(require,module,exports){
const publicGameRow = (id, coverArt, title, desc) => {
    return `
    <div class="row justify-content-start item-rows border public-game-rows" data-id="${id}">
        <div class="col-3 border">
            <img src="${coverArt}" height="150px" width="125">
        </div>
        <div class="col-9">
            <div class="row justify-content-start">
                <div class="col-8">
                    <h2>${title}</h2>
                </div>
                <div class="col-4">
                    <button id="edit-film" data-id="${id}" type="button" class="btn btn-success">Add</button>
                </div>
                <div class="row justify-content-center">
                    <div class="col">
                        <p class="public-game-rows-text">${desc}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
};

module.exports = {
    publicGameRow,
}
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtYWluLmpzIiwic3JjL2Rhc2hib2FyZC5qcyIsInNyYy9pbmRleC5qcyIsInNyYy9saWJyYXJ5LmpzIiwic3JjL3RlbXBsYXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCBpbmRleCA9IHJlcXVpcmUoJy4vc3JjL2luZGV4Jyk7XG5jb25zdCBkYXNoYm9hcmQgPSByZXF1aXJlKCcuL3NyYy9kYXNoYm9hcmQnKTtcbmNvbnN0IGxpYnJhcnkgPSByZXF1aXJlKCcuL3NyYy9saWJyYXJ5Jyk7XG5jb25zdCBsaWJkZXRhaWxzID0gcmVxdWlyZSgnLi9zcmMvbGliZGV0YWlscycpXG5cbmNvbnN0IHBhZ2VJbml0aWFsaXphdGlvbiA9IHtcbiAgJy8nIDogaW5kZXguaW5pdCxcbiAgJy9pbmRleC5odG1sJzogaW5kZXguaW5pdCxcbiAgJy9kYXNoYm9hcmQuaHRtbCc6IGRhc2hib2FyZC5pbml0LFxuICAnL2xpYnJhcnkuaHRtbCc6IGxpYnJhcnkuaW5pdCxcbiAgJy9saWJkZXRhaWxzLmh0bWwnOiBsaWJkZXRhaWxzLmluaXRcbn1cblxuY29uc3QgcGF0aCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZVxuaWYocGFnZUluaXRpYWxpemF0aW9uLmhhc093blByb3BlcnR5KHBhdGgpKSB7XG4gIHBhZ2VJbml0aWFsaXphdGlvbltwYXRoXSgpXG59XG5lbHNlIHtcbiAgY29uc29sZS5lcnJvcihgJHtwYXRofSBkb2VzIG5vdCBoYXZlIGFuIGluaXRpYWxpemVyYClcbn0iLCIiLCIvLyBsZXQgYXhpb3MgPSByZXF1aXJlKCdheGlvcycpIC0gXCJyZXF1aXJlIGlzIG5vdCBkZWZpbmVkXCIgLSB1c2luZyBjZG5cblxuXG5mdW5jdGlvbiByZXF1ZXN0KHBhdGgsIG1ldGhvZCA9ICdnZXQnLCBib2R5ID0gbnVsbCkge1xubGV0IGJlYXJlclRva2VuID0gJydcbmNvbnN0IHRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Rva2VuJylcbmNvbnNvbGUubG9nKHRva2VuKVxuaWYodG9rZW4pe1xuICAgIGJlYXJlclRva2VuID0gYEJlYXJlciAke3Rva2VufWBcbiAgICBjb25zb2xlLmxvZygnYmVhcmVyVG9rZW46ICcgKyBiZWFyZXJUb2tlbilcbn1cblxucmV0dXJuIGF4aW9zKGBodHRwOi8vbG9jYWxob3N0OjMwMDAke3BhdGh9YCwge1xuICAgIG1ldGhvZDogbWV0aG9kLFxuICAgIGhlYWRlcnM6IHtcbiAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgJ0F1dGhvcml6YXRpb24nOiBiZWFyZXJUb2tlblxuICAgIH0sXG4gICAgZGF0YTogYm9keVxufSlcbn1cblxuXG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4geyAgICBcblxuICAgIGxldCBzdWJtaXRTaWduID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N1Ym1pdC1zaWduaW4nKVxuXG4gICAgc3VibWl0U2lnbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBsZXQgdXNlcm5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlcm5hbWUnKS52YWx1ZVxuICAgICAgICBsZXQgcGFzc3dvcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFzc3dvcmQnKS52YWx1ZVxuICAgICAgICBjb25zb2xlLmxvZyh1c2VybmFtZSwgcGFzc3dvcmQpXG5cbiAgICAgICAgcmVxdWVzdCgnL2F1dGgvdG9rZW4nLCAncG9zdCcsIHsgdXNlcm5hbWUgLCBwYXNzd29yZCB9KVxuICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Rva2VuJywgcmVzcG9uc2UuZGF0YS50b2tlbilcbiAgICAgICAgd2luZG93LmxvY2F0aW9uID0gJ2Rhc2hib2FyZC5odG1sJ1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgYWxlcnQoJ0xvZ2luIGZhaWxlZCcpXG4gICAgICAgICAgICB0aHJvdyB7ZXJyb3I6IHtzdGF0dXM6IDQwMCwgbWVzc2FnZTogYEF1dGhlbnRpY2F0aW9uIGZhaWxlZGB9fVxuICAgICAgICB9KVxuXG4gICAgfSlcblxuXG4gICAgbGV0IHN1Ym1pdENyZWF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdWJtaXQtY3JlYXRlJylcblxuICAgIHN1Ym1pdENyZWF0ZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBsZXQgdXNlcm5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlcm5hbWUtY3JlYXRlJykudmFsdWVcbiAgICAgICAgbGV0IGZuYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZuYW1lLWNyZWF0ZScpLnZhbHVlXG4gICAgICAgIGxldCBsbmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsbmFtZS1jcmVhdGUnKS52YWx1ZVxuICAgICAgICBsZXQgcGFzc3dvcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFzc3dvcmQtY3JlYXRlJykudmFsdWVcblxuICAgICAgICBheGlvcy5wb3N0KGBodHRwOi8vbG9jYWxob3N0OjMwMDAvdXNlcnNgLCB7IFwidXNlcm5hbWVcIjogdXNlcm5hbWUsIFwicGFzc3dvcmRcIjogcGFzc3dvcmQsIFwiZm5hbWVcIjogZm5hbWUsIFwibG5hbWVcIjogbG5hbWUgfSApXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7IFxuICAgICAgICAgICAgICAgIGFsZXJ0KCd1c2VyIGNyZWF0ZWQhJylcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRocm93IHtlcnJvcjoge3N0YXR1czogNDAwLCBtZXNzYWdlOiBcIkNvdWxkIG5vdCBjcmVhdGUgdXNlclwifX1cbiAgICAgICAgICAgIH0pXG4gICAgfSlcblxufSlcblxuICAgIFxuXG5cbiIsImZ1bmN0aW9uIGluaXQoKSB7XG5cbiAgICBjb25zdCBjcmVhdGUgPSByZXF1aXJlKCcuL3RlbXBsYXRlcycpO1xuXG4gICAgY29uc3QgdGVzdEFyciA9IFtcbiAgICAgICAge1xuICAgICAgICBpZ2RiX2lkOiA0MTYwOCxcbiAgICAgICAgdGl0bGU6ICdIYWxvOiBUaGUgTWFzdGVyIENoaWVmIENvbGxlY3Rpb24nLFxuICAgICAgICBjb3Zlcl91cmw6ICcvL2ltYWdlcy5pZ2RiLmNvbS9pZ2RiL2ltYWdlL3VwbG9hZC90X3RodW1iL2t1YXViNHBqYWFqdWVwbWx4dXEzLmpwZycsXG4gICAgICAgIGRlc2M6ICdSZWxpdmUgdGhlIGdyZWF0ZXN0IGFkdmVudHVyZXMgb2YgdGhlIHVsdGltYXRlIHNvbGRlciB3aXRoIEhhbG86IFRoZSBNYXN0ZXIgQ2hpZWYgQ29sbGVjdGlvbiwgd2hpY2ggaW5jbHVkZXMgdGhlIGNvbXBsZXRlIHN0b3J5IG9mIHRoZSBNYXN0ZXIgQ2hpZWYgb24gb25lIGNvbnNvbGUgZm9yIHRoZSBmaXJzdCB0aW1lIGV2ZXIuIEhhbG86IENvbWJhdCBFdm9sdmVkICwgSGFsbyAyLCBIYWxvIDMgYW5kIEhhbG8gNCBhcmUgYWxsIHBhY2tlZCBpbnRvIHRoaXMgbWFzc2l2ZSBwYWNrYWdlLiBBbmQgbm90IG9ubHkgaXMgdGhlIGRlYnV0IEhhbG8gZGVsaXZlcmVkIGluIGl0cyBhY2NsYWltZWQgQW5uaXZlcnNhcnkgcGFja2FnZSwgYnV0IGZvciB0aGUgZmlyc3QgdGltZSwgYW4gZW50aXJlbHkgcmVtYXN0ZXJlZCB2ZXJzaW9uIG9mIHRoZSBpY29uaWMgc2VxdWVsIHRoYXQgcmV2b2x1dGlvbml6ZWQgb25saW5lIGNvbnNvbGUgZ2FtaW5nIGlzIGF2YWlsYWJsZSB3aXRoIHRoZSBIYWxvIDIgQW5uaXZlcnNhcnkgdmVyc2lvbiBvZiB0aGUgZ2FtZS4gVGhpcyBjb2xsZWN0aW9uIGxldHMgeW91IGV4cGVyaWVuY2UgSGFsbyBpbiBhbiBhbGwtbmV3IHdheSwgYXQgaGlnaGVyIHZpc3VhbCBmaWRlbGl0eSBydW5uaW5nIGF0IDYwIGZyYW1lcyBwZXIgc2Vjb25kIChmcHMpIG9uIGRlZGljYXRlZCBzZXJ2ZXJzLiBcXG4gXFxuSGFsbzogVGhlIE1hc3RlciBDaGllZiBDb2xsZWN0aW9uIGZlYXR1cmVzIGN1cmF0ZWQgY2FtcGFpZ24gYW5kIG11bHRpcGxheWVyIHBsYXlsaXN0cyBhY3Jvc3MgYWxsIGZvdXIgZ2FtZXMgYW5kIGZlYXR1cmVzIG1vcmUgdGhhbiAxMDAgbXVsdGlwbGF5ZXIgbWFwcyAtLSBhdXRoZW50aWMgdG8gdGhlaXIgb3JpZ2luYWwgcmVsZWFzZS4gSW4gYWRkaXRpb24sIEhhbG8gMiBBbm5pdmVyc2FyeSBpbmNsdWRlcyBzaXggYWxsLW5ldyBtYXBzIGJ1aWx0IGZyb20gdGhlIGdyb3VuZCB1cCBmb3IgWGJveCBPbmUuJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBpZ2RiX2lkOiAyNTA3NiwgXG4gICAgICAgIHRpdGxlOiAnUmVkIERlYWQgUmVkZW1wdGlvbiAyJywgXG4gICAgICAgIGNvdmVyX3VybDogJy8vaW1hZ2VzLmlnZGIuY29tL2lnZGIvaW1hZ2UvdXBsb2FkL3RfdGh1bWIveWZrOWYybGJvMHI3c2x5dHVocmEuanBnJyAsXG4gICAgICAgIGRlc2M6ICdEZXZlbG9wZWQgYnkgdGhlIGNyZWF0b3JzIG9mIEdyYW5kIFRoZWZ0IEF1dG8gViBhbmQgUmVkIERlYWQgUmVkZW1wdGlvbiwgUmVkIERlYWQgUmVkZW1wdGlvbiAyIGlzIGFuIGVwaWMgdGFsZSBvZiBsaWZlIGluIEFtZXJpY2HigJlzIHVuZm9yZ2l2aW5nIGhlYXJ0bGFuZC4gVGhlIGdhbWVcXCdzIHZhc3QgYW5kIGF0bW9zcGhlcmljIHdvcmxkIHdpbGwgYWxzbyBwcm92aWRlIHRoZSBmb3VuZGF0aW9uIGZvciBhIGJyYW5kIG5ldyBvbmxpbmUgbXVsdGlwbGF5ZXIgZXhwZXJpZW5jZS4nIFxuICAgIH1cbl07XG5cbiAgICBmdW5jdGlvbiBnZW5lcmF0ZUdhbWVzKGFycikge1xuXG4gICAgICAgIGZ1bmN0aW9uIGZvcm1hdENvdmVyKHN0cikge1xuICAgICAgICAgICAgbGV0IG5ld1N0ciA9IHN0ci5zbGljZSgyKTtcbiAgICAgICAgICAgIHJldHVybiBgaHR0cDovLyR7bmV3U3RyfWA7XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gZm9ybWF0RGVzYyhzdHIpIHtcbiAgICAgICAgICAgIGlmKHN0ci5sZW5ndGggPD0gMzAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0clxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgbmV3U3RyID0gc3RyLnNsaWNlKDAsIDMwMClcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7bmV3U3RyfS4uLmA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhcHBsaWVkVGVtcGxhdGVzID0gYXJyLm1hcChnYW1lID0+IGNyZWF0ZS5wdWJsaWNHYW1lUm93KGdhbWUuaWdkYl9pZCwgZm9ybWF0Q292ZXIoZ2FtZS5jb3Zlcl91cmwpLCBnYW1lLnRpdGxlLCBmb3JtYXREZXNjKGdhbWUuZGVzYykpKS5qb2luKCdcXG4nKTtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tYWluLWJvZHlcIikuaW5uZXJIVE1MID0gYXBwbGllZFRlbXBsYXRlcztcbiAgICB9XG5cbiAgICBnZW5lcmF0ZUdhbWVzKHRlc3RBcnIpO1xufVxubW9kdWxlLmV4cG9ydHM9IHtcbiAgICBpbml0LFxufVxuIiwiY29uc3QgcHVibGljR2FtZVJvdyA9IChpZCwgY292ZXJBcnQsIHRpdGxlLCBkZXNjKSA9PiB7XG4gICAgcmV0dXJuIGBcbiAgICA8ZGl2IGNsYXNzPVwicm93IGp1c3RpZnktY29udGVudC1zdGFydCBpdGVtLXJvd3MgYm9yZGVyIHB1YmxpYy1nYW1lLXJvd3NcIiBkYXRhLWlkPVwiJHtpZH1cIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC0zIGJvcmRlclwiPlxuICAgICAgICAgICAgPGltZyBzcmM9XCIke2NvdmVyQXJ0fVwiIGhlaWdodD1cIjE1MHB4XCIgd2lkdGg9XCIxMjVcIj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtOVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBqdXN0aWZ5LWNvbnRlbnQtc3RhcnRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLThcIj5cbiAgICAgICAgICAgICAgICAgICAgPGgyPiR7dGl0bGV9PC9oMj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImVkaXQtZmlsbVwiIGRhdGEtaWQ9XCIke2lkfVwiIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tc3VjY2Vzc1wiPkFkZDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3cganVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cInB1YmxpYy1nYW1lLXJvd3MtdGV4dFwiPiR7ZGVzY308L3A+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIGBcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHB1YmxpY0dhbWVSb3csXG59Il19