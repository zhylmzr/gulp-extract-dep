"use strict";

var _stream = require("stream");

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _vinyl = _interopRequireDefault(require("vinyl"));

var _pluginError = _interopRequireDefault(require("plugin-error"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var TAG_RE = /(?<=<\w+\b[^>]*(src|href)=("|'))([^"']+)(?=\2>)/g; // dependencies array

var deps = []; // replace dependencies reference to outDir relative

function replaceStr(content, prefix, depDir, outDepDir) {
  return content.replace(TAG_RE, function (str) {
    if (str.indexOf(prefix) === 0) {
      var name = _path["default"].basename(str); // modify reference path


      var ref = str.replace(prefix, outDepDir); // avoid repeat add

      if (deps.length && deps.reduce(function (a, b) {
        return str === a.origin || str == b.origin;
      }, {})) {
        return ref;
      }

      deps.push({
        name: name,
        origin: str,
        path: str.replace(prefix, depDir)
      });
      return ref;
    }

    return str;
  });
}

var ExtractDepStream =
/*#__PURE__*/
function (_Transform) {
  _inherits(ExtractDepStream, _Transform);

  function ExtractDepStream(option) {
    var _this;

    _classCallCheck(this, ExtractDepStream);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ExtractDepStream).call(this, {
      objectMode: true
    }));
    option.prefix = option.prefix || 'bower_components';
    option.depDir = option.depDir || 'bower_components';
    option.outDepDir = option.outDepDir || '';

    for (var prop in option) {
      if (option.hasOwnProperty(prop)) {
        _this[prop] = option[prop];
      }
    }

    return _this;
  }

  _createClass(ExtractDepStream, [{
    key: "_transform",
    value: function _transform(file, enc, callback) {
      var _this2 = this;

      if (file.extname === '.html') {
        var content = replaceStr(file.contents.toString(), this.prefix, this.depDir, this.outDepDir);
        file.contents = Buffer.from(content); // add deps file

        deps.forEach(function (dep) {
          var depFile = new _vinyl["default"]({
            path: "".concat(_this2.outDepDir, "/").concat(dep.name)
          });

          try {
            depFile.contents = _fs["default"].readFileSync(dep.path);
          } catch (err) {
            var message = "Can't open the dependency file \"".concat(dep.origin, "\" in \"").concat(dep.path, "\"");
            callback(new _pluginError["default"]('gulp-extract-dep', message));
            return;
          }

          _this2.push(depFile);
        });
      }

      this.push(file);
      callback();
    }
  }]);

  return ExtractDepStream;
}(_stream.Transform);

module.exports = function (option) {
  var stream = new ExtractDepStream(option);
  return stream;
};
