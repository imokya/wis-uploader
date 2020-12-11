"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _config = _interopRequireDefault(require("./config.js"));

var _requestPromise = _interopRequireDefault(require("request-promise"));

var _formData = _interopRequireDefault(require("form-data"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Uploader =
/*#__PURE__*/
function () {
  function Uploader() {
    _classCallCheck(this, Uploader);

    this._init();
  }

  _createClass(Uploader, [{
    key: "_init",
    value: function _init() {
      var st, elapse, total;
      return regeneratorRuntime.async(function _init$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              console.log('序列图上传生成中....');
              st = new Date().getTime();
              _context.next = 4;
              return regeneratorRuntime.awrap(this._getAccessToken());

            case 4:
              this.accessToken = _context.sent;
              _context.next = 7;
              return regeneratorRuntime.awrap(this._getLocalFiles());

            case 7:
              _context.next = 9;
              return regeneratorRuntime.awrap(this._uploadFiles());

            case 9:
              this._outputFile();

              elapse = (new Date().getTime() - st) / 1000;
              total = this._uploadFiles.length;
              console.log("\u5171".concat(total, "\u5F20\u56FE\u7247 \u8017\u65F6: ").concat(elapse, "s"));
              console.log('序列图生成完毕!');

            case 14:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "_outputFile",
    value: function _outputFile() {
      var fos = '',
          values = '';
      var total = this._uploadFiles.length;

      for (var i = 0; i < total; i++) {
        var url = this._uploadFiles[i];
        var offsetX = i * 1000;
        var translateX = -(i + 1) * 1000;
        var suffix = i == total - 1 ? '' : ';';
        var value = "".concat(translateX, " 0;").concat(translateX, " 0").concat(suffix);
        var fo = "\n              <foreignObject x=\"".concat(offsetX, "\" y=\"0\" width=\"800\" height=\"1100\">\n                <svg style=\"background-image:url(").concat(url, ");background-size:100%;background-repeat:no-repeat;\" viewBox=\"0 0 800 1100\"></svg>\n              </foreignObject>\n            ");
        fos += fo;
        values += value;
      }

      var output = "\n      <section style=\"overflow:hidden;margin:0 auto;\">\n        <svg viewBox=\"0 0 800 1100\" style=\"width:100%;display:inline-block;\">\n          <g>\n            <g>\n              ".concat(fos, "\n            </g>\n            <animateTransform attributeName=\"transform\" type=\"translate\" values=\"").concat(values, "\" restart=\"never\" fill=\"freeze\" dur=\"5s\" calcMode=\"discrete\" begin=\"click\"></animateTransform>\n          </g>\n        </svg>\n      </section>\n    ");

      var template = _fs["default"].readFileSync('template.html', {
        encoding: 'utf8'
      });

      template = template.replace('{placehoder}', output);

      _fs["default"].writeFileSync('index.html', template, {
        encoding: 'utf8'
      });
    }
  }, {
    key: "_uploadFiles",
    value: function _uploadFiles() {
      return regeneratorRuntime.async(function _uploadFiles$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              this._uploadFiles = [];
              _context2.next = 3;
              return regeneratorRuntime.awrap(this._uploadFile());

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "_uploadFile",
    value: function _uploadFile() {
      var file, fileStream, url;
      return regeneratorRuntime.async(function _uploadFile$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              file = this.files.shift();
              fileStream = _fs["default"].createReadStream("img/".concat(file));
              _context3.next = 4;
              return regeneratorRuntime.awrap(this._upload(this.accessToken, fileStream));

            case 4:
              url = _context3.sent;

              this._uploadFiles.push(url);

              if (!this.files.length) {
                _context3.next = 9;
                break;
              }

              _context3.next = 9;
              return regeneratorRuntime.awrap(this._uploadFile());

            case 9:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "_getLocalFiles",
    value: function _getLocalFiles() {
      this.files = _fs["default"].readdirSync('img');
      this.files.sort(function (a, b) {
        return parseInt(a) - parseInt(b);
      });
    }
  }, {
    key: "_upload",
    value: function _upload(accessToken, file) {
      var form, url, res;
      return regeneratorRuntime.async(function _upload$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              form = {
                media: file
              };
              url = "https://api.weixin.qq.com/cgi-bin/media/uploadimg?access_token=".concat(accessToken);
              _context4.next = 4;
              return regeneratorRuntime.awrap((0, _requestPromise["default"])({
                url: url,
                method: 'POST',
                headers: {
                  'Content-Type': 'multipart/form-data'
                },
                formData: form,
                json: true
              }));

            case 4:
              res = _context4.sent;
              return _context4.abrupt("return", res.url);

            case 6:
            case "end":
              return _context4.stop();
          }
        }
      });
    }
  }, {
    key: "_getAccessToken",
    value: function _getAccessToken() {
      var url, res;
      return regeneratorRuntime.async(function _getAccessToken$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=".concat(_config["default"].appid, "&secret=").concat(_config["default"].secret);
              _context5.next = 3;
              return regeneratorRuntime.awrap(_requestPromise["default"].get(url, {
                json: true
              }));

            case 3:
              res = _context5.sent;
              return _context5.abrupt("return", res['access_token']);

            case 5:
            case "end":
              return _context5.stop();
          }
        }
      });
    }
  }]);

  return Uploader;
}();

var _default = Uploader;
exports["default"] = _default;