/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		0: 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/static/";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push([27,1]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ 27:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(49);


/***/ }),

/***/ 46:
/***/ (function(module, exports, __webpack_require__) {

// extracted by extract-css-chunks-webpack-plugin

/***/ }),

/***/ 49:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/regenerator/index.js
var regenerator = __webpack_require__(14);
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/asyncToGenerator.js
var asyncToGenerator = __webpack_require__(20);
var asyncToGenerator_default = /*#__PURE__*/__webpack_require__.n(asyncToGenerator);

// EXTERNAL MODULE: ./node_modules/react/cjs/react.development.js
var react_development = __webpack_require__(0);
var react_development_default = /*#__PURE__*/__webpack_require__.n(react_development);

// EXTERNAL MODULE: ./node_modules/react-dom/cjs/react-dom.development.js
var react_dom_development = __webpack_require__(15);
var react_dom_development_default = /*#__PURE__*/__webpack_require__.n(react_dom_development);

// EXTERNAL MODULE: ./node_modules/react-router-dom/umd/react-router-dom.js
var react_router_dom = __webpack_require__(16);

// EXTERNAL MODULE: ./node_modules/react-router-config/es/renderRoutes.js + 1 modules
var renderRoutes = __webpack_require__(53);

// EXTERNAL MODULE: ./node_modules/react-redux/dist/react-redux.js
var react_redux = __webpack_require__(21);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/classCallCheck.js
var classCallCheck = __webpack_require__(8);
var classCallCheck_default = /*#__PURE__*/__webpack_require__.n(classCallCheck);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/createClass.js
var createClass = __webpack_require__(9);
var createClass_default = /*#__PURE__*/__webpack_require__.n(createClass);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js
var possibleConstructorReturn = __webpack_require__(10);
var possibleConstructorReturn_default = /*#__PURE__*/__webpack_require__.n(possibleConstructorReturn);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/getPrototypeOf.js
var getPrototypeOf = __webpack_require__(11);
var getPrototypeOf_default = /*#__PURE__*/__webpack_require__.n(getPrototypeOf);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/inherits.js
var inherits = __webpack_require__(12);
var inherits_default = /*#__PURE__*/__webpack_require__.n(inherits);

// EXTERNAL MODULE: ./node_modules/react-helmet/lib/Helmet.js
var Helmet = __webpack_require__(22);

// EXTERNAL MODULE: ./src/home/App.less
var home_App = __webpack_require__(46);

// CONCATENATED MODULE: ./src/home/App.jsx









var App_App =
/*#__PURE__*/
function (_Component) {
  inherits_default()(App, _Component);

  function App() {
    classCallCheck_default()(this, App);

    return possibleConstructorReturn_default()(this, getPrototypeOf_default()(App).apply(this, arguments));
  }

  createClass_default()(App, [{
    key: "render",
    value: function render() {
      var pageTitle = "Welcome to demo page. Powered by ".concat(this.props.poweredBy, ".");
      return react_development_default.a.createElement("div", {
        className: "demo"
      }, react_development_default.a.createElement(Helmet["Helmet"], null, react_development_default.a.createElement("title", null, pageTitle)), react_development_default.a.createElement("p", {
        className: "message"
      }, " ", this.props.message, " "), react_development_default.a.createElement("p", {
        className: "footer"
      }, " ", this.props.poweredBy, " "));
    }
  }]);

  return App;
}(react_development["Component"]);


;
// EXTERNAL MODULE: ./node_modules/redux/dist/redux.js
var redux = __webpack_require__(3);

// EXTERNAL MODULE: ./node_modules/redux-thunk/es/index.js
var es = __webpack_require__(23);

// CONCATENATED MODULE: ./src/home/redux/actions/user.js
var SET_USERINFO = 'SET_USERINFO';
var setUserInfo = function setUserInfo(params) {
  return function (dispatch) {
    dispatch({
      type: SET_USERINFO,
      data: params
    });
  };
};
// CONCATENATED MODULE: ./src/home/redux/reducers/user.js

var user = {
  uid: null,
  isLogin: false,
  uname: null,
  avatar: null
};
function userInfo() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : user;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case SET_USERINFO:
      return Object.assign({}, state, action.data);

    default:
      return state;
  }
}
// CONCATENATED MODULE: ./src/home/redux/reducers/index.js


var reducers = Object(redux["combineReducers"])({
  user: userInfo
});
/* harmony default export */ var redux_reducers = (reducers);
// CONCATENATED MODULE: ./src/home/redux/store.js



var finalCreateStore = Object(redux["applyMiddleware"])(es["a" /* default */])(redux["createStore"]); //从window对象中获取redux谷歌浏览器插件对象如果存在就使用

var store_store = finalCreateStore(redux_reducers, typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
/* harmony default export */ var redux_store = (store_store);
// CONCATENATED MODULE: ./src/home/index.js


function createApp(context) {
  var routes = [{
    path: '/',
    component: App_App,
    exact: true
  }];
  return {
    routes: routes,
    store: redux_store
  };
}
;
// EXTERNAL MODULE: ./node_modules/react-router/es/Route.js
var Route = __webpack_require__(19);

// EXTERNAL MODULE: ./node_modules/react-router/es/withRouter.js
var withRouter = __webpack_require__(51);

// EXTERNAL MODULE: ./node_modules/react-router-config/es/matchRoutes.js + 1 modules
var matchRoutes = __webpack_require__(52);

// CONCATENATED MODULE: ./src/public/AsyncDataRouter.jsx









var AsyncDataRouter_loadBranchData = function loadBranchData(store, routes, location) {
  var branch = Object(matchRoutes["a" /* default */])(routes, location.pathname);
  var promises = branch.map(function (_ref) {
    var route = _ref.route,
        match = _ref.match;
    return route.component.loadData ? route.component.loadData(store, match, location) : Promise.resolve(null);
  });
  return Promise.all(promises);
};

var AsyncDataRouter_LocationChangeRouter =
/*#__PURE__*/
function (_Component) {
  inherits_default()(LocationChangeRouter, _Component);

  function LocationChangeRouter(props) {
    var _this;

    classCallCheck_default()(this, LocationChangeRouter);

    _this = possibleConstructorReturn_default()(this, getPrototypeOf_default()(LocationChangeRouter).call(this, props));
    _this.state = {
      previousLocation: null,
      showChildren: false
    };
    return _this;
  } // only support react 16 ?


  createClass_default()(LocationChangeRouter, [{
    key: "UNSAFE_componentWillMount",
    value: function UNSAFE_componentWillMount() {
      var _this2 = this;

      var _this$props = this.props,
          initState = _this$props.initState,
          routes = _this$props.routes,
          store = _this$props.store,
          location = _this$props.location;

      if (!initState) {
        // only active at  window.__INITIAL_STATE__ is not defined
        AsyncDataRouter_loadBranchData(store, routes, location).then(function (data) {
          _this2.setState({
            previousLocation: null,
            showChildren: true
          });
        });
      } else {
        this.setState({
          showChildren: true
        });
      }
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var _this3 = this;

      var navigated = nextProps.location !== this.props.location;
      var _this$props2 = this.props,
          routes = _this$props2.routes,
          store = _this$props2.store;

      if (navigated) {
        this.setState({
          previousLocation: this.props.location
        });
        AsyncDataRouter_loadBranchData(store, routes, location).then(function (data) {
          _this3.setState({
            previousLocation: null
          });
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          children = _this$props3.children,
          location = _this$props3.location;
      var _this$state = this.state,
          previousLocation = _this$state.previousLocation,
          showChildren = _this$state.showChildren;
      return react_development_default.a.createElement(Route["a" /* default */], {
        location: previousLocation || location,
        render: function render() {
          if (showChildren) {
            return children;
          } else {
            return null;
          }
        }
      });
    }
  }]);

  return LocationChangeRouter;
}(react_development["Component"]);

/* harmony default export */ var AsyncDataRouter = (Object(withRouter["a" /* default */])(AsyncDataRouter_LocationChangeRouter));
// CONCATENATED MODULE: ./src/home/entry-client.js










var run =
/*#__PURE__*/
function () {
  var _ref = asyncToGenerator_default()(
  /*#__PURE__*/
  regenerator_default.a.mark(function _callee(initState) {
    var _createApp, routes, store;

    return regenerator_default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _createApp = createApp({
              initState: initState
            }), routes = _createApp.routes, store = _createApp.store;
            return _context.abrupt("return", react_development_default.a.createElement(react_redux["Provider"], {
              store: store
            }, react_development_default.a.createElement(react_router_dom["BrowserRouter"], null, react_development_default.a.createElement(react_router_dom["Switch"], null, react_development_default.a.createElement(AsyncDataRouter, {
              initState: initState,
              routes: routes,
              store: store
            }, Object(renderRoutes["a" /* default */])(routes))))));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function run(_x) {
    return _ref.apply(this, arguments);
  };
}();

if (typeof window !== 'undefined' && window.__INITIAL_STATE__) {
  run(window.__INITIAL_STATE__).then(function (app) {
    react_dom_development_default.a.hydrate(app, document.getElementById('server-app'));
  });
} else {
  run().then(function (app) {
    react_dom_development_default.a.render(app, document.getElementById('demo-app'));
  });
}

/***/ })

/******/ });
//# sourceMappingURL=home.local.js.map