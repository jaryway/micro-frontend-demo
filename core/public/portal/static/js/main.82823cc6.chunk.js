define("portal", [null,"react-dom"], function(__WEBPACK_EXTERNAL_MODULE__0__, __WEBPACK_EXTERNAL_MODULE__1__) { return (window["webpackJsonpportal"] = window["webpackJsonpportal"] || []).push([[0],[
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__0__;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__1__;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var mod; }
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports["default"] = singleSpaReact;
  _exports.SingleSpaContext = void 0;

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }
  /* We don't import parcel.component.js from this file intentionally. See comment
   * in that file for why
   */
  // React context that gives any react component the single-spa props


  var SingleSpaContext = null;
  _exports.SingleSpaContext = SingleSpaContext;
  var defaultOpts = {
    // required opts
    React: null,
    ReactDOM: null,
    rootComponent: null,
    loadRootComponent: null,
    suppressComponentDidCatchWarning: false,
    // optional opts
    domElementGetter: null,
    parcelCanUpdate: true // by default, allow parcels created with single-spa-react to be updated

  };

  function singleSpaReact(userOpts) {
    if (_typeof(userOpts) !== 'object') {
      throw new Error("single-spa-react requires a configuration object");
    }

    var opts = _objectSpread({}, defaultOpts, userOpts);

    if (!opts.React) {
      throw new Error("single-spa-react must be passed opts.React");
    }

    if (!opts.ReactDOM) {
      throw new Error("single-spa-react must be passed opts.ReactDOM");
    }

    if (!opts.rootComponent && !opts.loadRootComponent) {
      throw new Error("single-spa-react must be passed opts.rootComponent or opts.loadRootComponent");
    }

    if (!SingleSpaContext && opts.React.createContext) {
      _exports.SingleSpaContext = SingleSpaContext = opts.React.createContext();
    }

    var lifecycles = {
      bootstrap: bootstrap.bind(null, opts),
      mount: mount.bind(null, opts),
      unmount: unmount.bind(null, opts)
    };

    if (opts.parcelCanUpdate) {
      lifecycles.update = update.bind(null, opts);
    }

    return lifecycles;
  }

  function bootstrap(opts, props) {
    if (opts.rootComponent) {
      // This is a class or stateless function component
      return Promise.resolve();
    } else {
      // They passed a promise that resolves with the react component. Wait for it to resolve before mounting
      return opts.loadRootComponent().then(function (resolvedComponent) {
        opts.rootComponent = resolvedComponent;
      });
    }
  }

  function mount(opts, props) {
    return new Promise(function (resolve, reject) {
      if (!opts.suppressComponentDidCatchWarning && atLeastReact16(opts.React)) {
        if (!opts.rootComponent.prototype) {
          console.warn("single-spa-react: ".concat(props.name || props.appName || props.childAppName, "'s rootComponent does not have a prototype.  If using a functional component, wrap it in an error boundary or other class that implements componentDidCatch to avoid accidentally unmounting the entire single-spa application"));
        } else if (!opts.rootComponent.prototype.componentDidCatch) {
          console.warn("single-spa-react: ".concat(props.name || props.appName || props.childAppName, "'s rootComponent should implement componentDidCatch to avoid accidentally unmounting the entire single-spa application."));
        }
      }

      var domElementGetter = chooseDomElementGetter(opts, props);

      if (typeof domElementGetter !== 'function') {
        throw new Error("single-spa-react: the domElementGetter for react application '".concat(props.appName || props.name, "' is not a function"));
      }

      var whenFinished = function whenFinished() {
        resolve(this);
      };

      var rootComponentElement = opts.React.createElement(opts.rootComponent, props);
      var elementToRender = SingleSpaContext ? opts.React.createElement(SingleSpaContext.Provider, {
        value: props
      }, rootComponentElement) : rootComponentElement;
      var domElement = getRootDomEl(domElementGetter, props);
      var renderedComponent = reactDomRender({
        elementToRender: elementToRender,
        domElement: domElement,
        whenFinished: whenFinished,
        opts: opts
      });
      opts.domElement = domElement;
    });
  }

  function unmount(opts, props) {
    return Promise.resolve().then(function () {
      opts.ReactDOM.unmountComponentAtNode(opts.domElement);
    });
  }

  function update(opts, props) {
    return new Promise(function (resolve, reject) {
      var whenFinished = function whenFinished() {
        resolve(this);
      };

      var rootComponentElement = opts.React.createElement(opts.rootComponent, props);
      var elementToRender = SingleSpaContext ? opts.React.createElement(SingleSpaContext.Provider, {
        value: props
      }, rootComponentElement) : rootComponentElement;
      var renderedComponent = reactDomRender({
        elementToRender: elementToRender,
        domElement: opts.domElement,
        whenFinished: whenFinished,
        opts: opts
      });
    });
  }

  function getRootDomEl(domElementGetter, props) {
    var el = domElementGetter();

    if (!el) {
      throw new Error("single-spa-react: domElementGetter function for application '".concat(props.appName || props.name, "' did not return a valid dom element. Please pass a valid domElement or domElementGetter via opts or props"));
    }

    return el;
  }

  function atLeastReact16(React) {
    if (React && typeof React.version === 'string' && React.version.indexOf('.') >= 0) {
      var majorVersionString = React.version.slice(0, React.version.indexOf('.'));

      try {
        return Number(majorVersionString) >= 16;
      } catch (err) {
        return false;
      }
    } else {
      return false;
    }
  }

  function chooseDomElementGetter(opts, props) {
    props = props && props.customProps ? props.customProps : props;

    if (props.domElement) {
      return function () {
        return props.domElement;
      };
    } else if (props.domElementGetter) {
      return props.domElementGetter;
    } else if (opts.domElementGetter) {
      return opts.domElementGetter;
    } else {
      return defaultDomElementGetter(props);
    }
  }

  function defaultDomElementGetter(props) {
    var htmlId = "single-spa-application:".concat(props.appName || props.name);

    if (!htmlId) {
      throw Error("single-spa-react was not given an application name as a prop, so it can't make a unique dom element container for the react application");
    }

    return function defaultDomEl() {
      var domElement = document.getElementById(htmlId);

      if (!domElement) {
        domElement = document.createElement('div');
        domElement.id = htmlId;
        document.body.appendChild(domElement);
      }

      return domElement;
    };
  }

  function reactDomRender(_ref) {
    var opts = _ref.opts,
        elementToRender = _ref.elementToRender,
        domElement = _ref.domElement,
        whenFinished = _ref.whenFinished;

    if (opts.renderType === 'createRoot') {
      return opts.ReactDOM.createRoot(domElement).render(elementToRender, whenFinished);
    }

    if (opts.renderType === 'hydrate') {
      return opts.ReactDOM.hydrate(elementToRender, domElement, whenFinished);
    } // default to this if 'renderType' is null or doesn't match the other options


    return opts.ReactDOM.render(elementToRender, domElement, whenFinished);
  }
});

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(4);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: external {"root":"React"}
var external_root_React_ = __webpack_require__(0);
var external_root_React_default = /*#__PURE__*/__webpack_require__.n(external_root_React_);

// EXTERNAL MODULE: external "react-dom"
var external_react_dom_ = __webpack_require__(1);
var external_react_dom_default = /*#__PURE__*/__webpack_require__.n(external_react_dom_);

// EXTERNAL MODULE: ./node_modules/single-spa-react/lib/single-spa-react.js
var single_spa_react = __webpack_require__(2);
var single_spa_react_default = /*#__PURE__*/__webpack_require__.n(single_spa_react);

// CONCATENATED MODULE: ./src/serviceWorker.js
// This optional code is used to register a service worker.
// register() is not called by default.
// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.
// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://bit.ly/CRA-PWA
var isLocalhost=Boolean(window.location.hostname==='localhost'||// [::1] is the IPv6 localhost address.
window.location.hostname==='[::1]'||// 127.0.0.1/8 is considered localhost for IPv4.
window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function register(config){if( true&&'serviceWorker'in navigator){// The URL constructor is available in all browsers that support SW.
var publicUrl=new URL("",window.location.href);if(publicUrl.origin!==window.location.origin){// Our service worker won't work if PUBLIC_URL is on a different origin
// from what our page is served on. This might happen if a CDN is used to
// serve assets; see https://github.com/facebook/create-react-app/issues/2374
return;}window.addEventListener('load',function(){var swUrl="".concat("","/service-worker.js");if(isLocalhost){// This is running on localhost. Let's check if a service worker still exists or not.
checkValidServiceWorker(swUrl,config);// Add some additional logging to localhost, pointing developers to the
// service worker/PWA documentation.
navigator.serviceWorker.ready.then(function(){console.log('This web app is being served cache-first by a service '+'worker. To learn more, visit https://bit.ly/CRA-PWA');});}else{// Is not localhost. Just register service worker
registerValidSW(swUrl,config);}});}}function registerValidSW(swUrl,config){navigator.serviceWorker.register(swUrl).then(function(registration){registration.onupdatefound=function(){var installingWorker=registration.installing;if(installingWorker==null){return;}installingWorker.onstatechange=function(){if(installingWorker.state==='installed'){if(navigator.serviceWorker.controller){// At this point, the updated precached content has been fetched,
// but the previous service worker will still serve the older
// content until all client tabs are closed.
console.log('New content is available and will be used when all '+'tabs for this page are closed. See https://bit.ly/CRA-PWA.');// Execute callback
if(config&&config.onUpdate){config.onUpdate(registration);}}else{// At this point, everything has been precached.
// It's the perfect time to display a
// "Content is cached for offline use." message.
console.log('Content is cached for offline use.');// Execute callback
if(config&&config.onSuccess){config.onSuccess(registration);}}}};};}).catch(function(error){console.error('Error during service worker registration:',error);});}function checkValidServiceWorker(swUrl,config){// Check if the service worker can be found. If it can't reload the page.
fetch(swUrl).then(function(response){// Ensure service worker exists, and that we really are getting a JS file.
var contentType=response.headers.get('content-type');if(response.status===404||contentType!=null&&contentType.indexOf('javascript')===-1){// No service worker found. Probably a different app. Reload the page.
navigator.serviceWorker.ready.then(function(registration){registration.unregister().then(function(){window.location.reload();});});}else{// Service worker found. Proceed as normal.
registerValidSW(swUrl,config);}}).catch(function(){console.log('No internet connection found. App is running in offline mode.');});}function unregister(){if('serviceWorker'in navigator){navigator.serviceWorker.ready.then(function(registration){registration.unregister();});}}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/createClass.js
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/typeof.js
function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

function _typeof(obj) {
  if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
    _typeof = function _typeof(obj) {
      return _typeof2(obj);
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
    };
  }

  return _typeof(obj);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js


function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/inherits.js

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
// CONCATENATED MODULE: ./src/root.component.js
var root_component_RootComponent=/*#__PURE__*/function(_React$Component){_inherits(RootComponent,_React$Component);function RootComponent(){_classCallCheck(this,RootComponent);return _possibleConstructorReturn(this,_getPrototypeOf(RootComponent).apply(this,arguments));}_createClass(RootComponent,[{key:"render",value:function render(){return external_root_React_default.a.createElement("div",{className:"portal"},"Wo! This is portal site");}}]);return RootComponent;}(external_root_React_default.a.Component);/* harmony default export */ var root_component = (root_component_RootComponent);
// CONCATENATED MODULE: ./src/index.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bootstrap", function() { return bootstrap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mount", function() { return mount; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "unmount", function() { return unmount; });
// ReactDOM.render(<App />, document.getElementById('root'));
// if (process.env.NODE_ENV === "development" && !MICRO) {
//   // 开发环境这样处理
//   ReactDOM.render(
//     <RootComponent
//     //   history={history}
//     //   store={storeInstance}
//     //   globalEventDistributor={storeInstance}
//     />,
//     document.getElementById("root")
//   );
// }
var reactLifecycles=single_spa_react_default()({React:external_root_React_default.a,ReactDOM:external_react_dom_default.a,rootComponent:function rootComponent(spa){return external_root_React_default.a.createElement(root_component,null);},// 可能会有加载顺序的问题
domElementGetter:domElementGetter});function domElementGetter(){// let el = document.getElementById("sub-module-page");
// if (!el) {
//   el = document.createElement("div");
//   el.id = "sub-module-page";
// }
// let timer = null;
// timer = setInterval(() => {
//   console.log(
//     "setInterval",
//     document.querySelector(".ant-layout-content #sub-module")
//   );
//   if (document.querySelector(".ant-layout-content #sub-module")) {
//     document.querySelector(".ant-layout-content #sub-module").appendChild(el);
//     clearInterval(timer);
//   }
// }, 100);
// return el;
return document.querySelector(".ant-layout-content #sub-module");}var bootstrap=[reactLifecycles.bootstrap];var mount=[reactLifecycles.mount];var unmount=[reactLifecycles.unmount];// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
unregister();

/***/ })
],[[3,1]]])});;
//# sourceMappingURL=main.82823cc6.chunk.js.map