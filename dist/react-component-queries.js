'use strict'

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex
}

var React = require('react')
var React__default = _interopDefault(React)
var PropTypes = _interopDefault(require('prop-types'))
var invariant = _interopDefault(require('invariant'))
var sizeMe = _interopDefault(require('react-sizeme'))

// :: (Object, Object, (any, any) => any) => Object
var mergeWith = function mergeWith(x, y, fn) {
  var result = Object.assign({}, x)

  Object.keys(y).forEach(function(key) {
    if (x[key] && y[key]) {
      result[key] = fn(x[key], y[key], key)
    } else {
      result[key] = y[key]
    }
  })

  return result
}

// :: Component => String
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

// Taken from react-redux.  Thanks Dan!

function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true
  }

  var keysA = Object.keys(objA)
  var keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) {
    return false
  }

  // Test for A's keys different from B.
  var hasOwn = Object.prototype.hasOwnProperty
  for (var i = 0; i < keysA.length; i += 1) {
    // eslint-disable-line no-plusplus
    if (!hasOwn.call(objB, keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false
    }
  }

  return true
}

var classCallCheck = function(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

var createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i]
      descriptor.enumerable = descriptor.enumerable || false
      descriptor.configurable = true
      if ('value' in descriptor) descriptor.writable = true
      Object.defineProperty(target, descriptor.key, descriptor)
    }
  }

  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps)
    if (staticProps) defineProperties(Constructor, staticProps)
    return Constructor
  }
})()

var inherits = function(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(
      'Super expression must either be null or a function, not ' +
        typeof superClass,
    )
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  })
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass)
}

var objectWithoutProperties = function(obj, keys) {
  var target = {}

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue
    target[i] = obj[i]
  }

  return target
}

var possibleConstructorReturn = function(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called",
    )
  }

  return call && (typeof call === 'object' || typeof call === 'function')
    ? call
    : self
}

var defaultConfig = {
  monitorHeight: false,
  monitorWidth: true,
  refreshRate: 16,
  pure: true,
  noPlaceholder: false,
}

var defaultConflictResolver = function defaultConflictResolver(x, y) {
  return y
}

var defaultSizeMeConfig = function defaultSizeMeConfig() {
  return {
    monitorWidth: defaultConfig.monitorWidth,
    monitorHeight: defaultConfig.monitorHeight,
    refreshRate: defaultConfig.refreshRate,
  }
}

/**
 * :: Queries -> Component -> Component
 *
 * This is a HOC that provides you with the mechanism to specify Component
 * queries. A Component query is a similar concept to media queries except it
 * operates on the Component's width/height rather than the entire viewport
 * width/height.
 */
function componentQueries() {
  var queries = void 0
  var sizeMeConfig = void 0
  var pure = void 0
  var conflictResolver = void 0

  for (
    var _len = arguments.length, params = Array(_len), _key = 0;
    _key < _len;
    _key++
  ) {
    params[_key] = arguments[_key]
  }

  if (params.length === 1 && params[0].queries) {
    queries = params[0].queries || []
    if (params[0].sizeMeConfig) {
      // Old school config style.
      sizeMeConfig = params[0].sizeMeConfig || defaultSizeMeConfig()
      pure = defaultConfig.pure // this didn't exist before, so we default it.
    } else if (params[0].config) {
      // New school config style.
      pure = params[0].config.pure
      var _params$0$config = params[0].config,
        monitorHeight = _params$0$config.monitorHeight,
        monitorWidth = _params$0$config.monitorWidth,
        refreshRate = _params$0$config.refreshRate,
        refreshMode = _params$0$config.refreshMode,
        noPlaceholder = _params$0$config.noPlaceholder

      sizeMeConfig = {
        monitorHeight:
          monitorHeight != null ? monitorHeight : defaultConfig.monitorHeight,
        monitorWidth:
          monitorWidth != null ? monitorWidth : defaultConfig.monitorWidth,
        refreshRate:
          refreshRate != null ? refreshRate : defaultConfig.refreshRate,
        refreshMode:
          refreshMode != null ? refreshMode : defaultConfig.refreshMode,
        noPlaceholder:
          noPlaceholder != null ? noPlaceholder : defaultConfig.noPlaceholder,
      }
    }
    conflictResolver =
      conflictResolver || params[0].conflictResolver || defaultConflictResolver
    invariant(
      typeof conflictResolver === 'function',
      'The conflict resolver you provide to ComponentQueries should be a function.',
    )
    invariant(
      Array.isArray(queries),
      '"queries" must be provided as an array when using the complex configuration.',
    )
  } else {
    queries = params
  }

  // TODO: Consider removing this check.  Perhaps it's best to just silently
  // pass through if no queries were provided?  Maybe a development based
  // warning would be the most useful.
  invariant(
    queries.length > 0,
    'You must provide at least one query to ComponentQueries.',
  )
  invariant(
    queries.filter(function(q) {
      return typeof q !== 'function'
    }).length === 0,
    'All provided queries for ComponentQueries should be functions.',
  )

  // We will default out any configuration if it wasn't set.
  sizeMeConfig = sizeMeConfig || defaultSizeMeConfig()
  conflictResolver = conflictResolver || defaultConflictResolver
  pure = pure != null ? pure : defaultConfig.pure

  var mergeWithCustomizer = function mergeWithCustomizer(x, y, key) {
    if (x === undefined) return undefined
    return conflictResolver(x, y, key)
  }

  return function WrapComponent(WrappedComponent) {
    var ComponentWithComponentQueries = (function(_Component) {
      inherits(ComponentWithComponentQueries, _Component)

      function ComponentWithComponentQueries() {
        var _ref

        var _temp, _this, _ret

        classCallCheck(this, ComponentWithComponentQueries)

        for (
          var _len2 = arguments.length, args = Array(_len2), _key2 = 0;
          _key2 < _len2;
          _key2++
        ) {
          args[_key2] = arguments[_key2]
        }

        return (
          (_ret =
            ((_temp =
              ((_this = possibleConstructorReturn(
                this,
                (_ref =
                  ComponentWithComponentQueries.__proto__ ||
                  Object.getPrototypeOf(
                    ComponentWithComponentQueries,
                  )).call.apply(_ref, [this].concat(args)),
              )),
              _this)),
            (_this.state = {
              queryResult: {},
            }),
            _temp)),
          possibleConstructorReturn(_this, _ret)
        )
      }

      createClass(ComponentWithComponentQueries, [
        {
          key: 'UNSAFE_componentWillMount',
          value: function UNSAFE_componentWillMount() {
            var _props = this.props,
              size = _props.size,
              otherProps = objectWithoutProperties(_props, ['size'])

            this.runQueries(size, otherProps)
          },
        },
        {
          key: 'UNSAFE_componentWillReceiveProps',
          value: function UNSAFE_componentWillReceiveProps(nextProps) {
            var size = this.props.size
            var nextSize = nextProps.size,
              nextOtherProps = objectWithoutProperties(nextProps, ['size'])

            if (!shallowEqual(size, nextSize)) {
              this.runQueries(nextSize, nextOtherProps)
            }
          },
        },
        {
          key: 'shouldComponentUpdate',
          value: function shouldComponentUpdate(nextProps, nextState) {
            var _props2 = this.props,
              size = _props2.size,
              otherProps = objectWithoutProperties(_props2, ['size'])
            var nextSize = nextProps.size,
              nextOtherProps = objectWithoutProperties(nextProps, ['size'])

            return (
              !pure ||
              !shallowEqual(otherProps, nextOtherProps) ||
              !shallowEqual(this.state.queryResult, nextState.queryResult)
            )
          },
        },
        {
          key: 'runQueries',
          value: function runQueries(_ref2, otherProps) {
            var width = _ref2.width,
              height = _ref2.height

            var queryResult = queries.reduce(function(acc, cur) {
              return mergeWith(
                acc,
                cur(
                  {
                    width: sizeMeConfig.monitorWidth ? width : null,
                    height: sizeMeConfig.monitorHeight ? height : null,
                  },
                  otherProps,
                ),
                mergeWithCustomizer,
              )
            }, {})

            this.setState({ queryResult: queryResult })
          },
        },
        {
          key: 'render',
          value: function render() {
            var _props3 = this.props,
              size = _props3.size,
              otherProps = objectWithoutProperties(_props3, ['size'])

            var allProps = mergeWith(
              this.state.queryResult,
              otherProps,
              mergeWithCustomizer,
            )

            return React__default.createElement(WrappedComponent, allProps)
          },
        },
      ])
      return ComponentWithComponentQueries
    })(React.Component)

    ComponentWithComponentQueries.displayName =
      'ComponentQueries(' + getDisplayName(WrappedComponent) + ')'
    ComponentWithComponentQueries.propTypes = {
      size: PropTypes.shape({
        width: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
        height: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
      }).isRequired,
    }
    ComponentWithComponentQueries.WrappedComponent = WrappedComponent

    return sizeMe(sizeMeConfig)(ComponentWithComponentQueries)
  }
}

module.exports = componentQueries
//# sourceMappingURL=react-component-queries.js.map
