(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Clipic = factory());
}(this, (function () { 'use strict';

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z = ".clipic-body{background:#1c1c1c;position:fixed;width:100%;height:100%;top:0;left:0;-webkit-transform:translateY(100%);-ms-transform:translateY(100%);transform:translateY(100%);-webkit-transition:.4s;-o-transition:.4s;transition:.4s;-webkit-touch-callout:none;-webkit-user-select:none;z-index:99;overflow:hidden}.clipic-body,.clipic-body *{-webkit-box-sizing:border-box;box-sizing:border-box}.clipic-operation-bar{display:-webkit-box;display:-ms-flexbox;display:flex;color:#f2f2f2;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;position:absolute;width:100%;bottom:0;left:0}.clipic-operation-bar [role=button]{padding:15px 20px;font-size:1em}.clipic-frame{background:#f2f2f2;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);transition:.3s;border:2px solid #fff}.clipic-frame img{-webkit-touch-callout:none;pointer-events:none}.clipic-frame-show{overflow:hidden}.clipic-frame-show-border1{left:33.33%}.clipic-frame-show-border1,.clipic-frame-show-border2{position:absolute;width:.5px;height:100%;top:0;background-color:#fff}.clipic-frame-show-border2{left:66.66%}.clipic-frame-show-border3{top:33.33%}.clipic-frame-show-border3,.clipic-frame-show-border4{position:absolute;width:100%;height:.5px;left:0;background-color:#fff}.clipic-frame-show-border4{top:66.66%}.clipic-cancel{color:#e04c4c}.clipic-reset{color:#3680fd}.clipic-confirm{color:#23c667}.clipic-layer{position:fixed;width:100%;height:100%;top:0;left:0;background:rgba(0,0,0,.8);pointer-events:none;transform:translateZ(0)}";
  styleInject(css_248z);

  var dom = "\n    <div class=\"clipic-frame\" id=\"clipicFrame1\"><img id=\"clipicImg1\"></div>\n    <div class=\"clipic-layer\"></div>\n    <div class=\"clipic-frame clipic-frame-show\" id=\"clipicFrame2\">\n    <img id=\"clipicImg2\">\n    <div class=\"clipic-frame-show-border1\"></div>\n    <div class=\"clipic-frame-show-border2\"></div>\n    <div class=\"clipic-frame-show-border3\"></div>\n    <div class=\"clipic-frame-show-border4\"></div>\n    </div>\n    <div class=\"clipic-operation-bar\">\n      <div class=\"clipic-cancel\" id=\"clipicCancel\" role=\"button\">\u53D6\u6D88</div>\n      <div class=\"clipic-reset\" id=\"clipicReset\" role=\"button\">\u91CD\u7F6E</div>\n      <div class=\"clipic-confirm\" id=\"clipicConfirm\" role=\"button\">\u5B8C\u6210</div>\n    </div>\n  ";

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var Clipic = function () {
    function Clipic() {
      classCallCheck(this, Clipic);

      this.default = {
        width: 500, // 裁剪宽度
        height: 500, // 裁剪高度
        src: '', // 需要裁剪的图片
        ratio: 1,
        encode: 'base64', // 导出格式，支持 base64|blob|file
        type: 'jpeg', // 裁剪后图片的类型，仅支持jpeg/png两种
        name: 'clipic', // 如果导出格式位file, 则可以填写图片名
        quality: 0.9, // 压缩质量
        buttonText: ['取消', '重置', '完成'], // 底部三个按钮文案,
        buttonColor: ['#e04c4c', '#3680fd', '#23c667']
      };
      this.init(); // 初始化，渲染dom跟css
      this.clipic = this.getId('clipic');
      this.img1 = this.getId('clipicImg1'); // 背景图
      this.img2 = this.getId('clipicImg2'); // 前景图
      this.frame1 = this.getId('clipicFrame1'); // 背景操作框
      this.frame2 = this.getId('clipicFrame2'); // 前景操作框
      this.cancelBtn = this.getId('clipicCancel'); // 取消按钮
      this.resetBtn = this.getId('clipicReset'); // 重置按钮
      this.confirmBtn = this.getId('clipicConfirm'); // 完成按钮
      this.reset = this.reset.bind(this);
      this.done = this.done.bind(this);
      this.cancel = this.cancel.bind(this);
    }

    createClass(Clipic, [{
      key: 'init',
      value: function init() {
        if (!this.getId('clipic')) {
          this.createHtml();
        }
      }
    }, {
      key: 'getId',
      value: function getId(id) {
        return document.getElementById(id);
      }
    }, {
      key: 'createHtml',
      value: function createHtml() {
        var div = document.createElement('div');
        div.className = 'clipic-body';
        div.setAttribute('id', 'clipic');
        div.innerHTML = dom;
        document.body.appendChild(div);
      }
    }, {
      key: 'getImage',
      value: function getImage() {
        var _this = this;

        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        // 初始化参数
        this.scale = 1; // 缩放
        this.rotate = 0; // 旋转
        this.translateX = 0; // 水平偏移
        this.translateY = 0; // 垂直偏移
        this.clipicWidth = 0; // 计算宽度
        this.clipicHeight = 0; // 计算高度
        var defaults = JSON.parse(JSON.stringify(this.default));
        this.options = Object.assign(defaults, options);
        this.cancelBtn.innerHTML = this.options.buttonText[0]; //关闭按钮
        this.resetBtn.innerHTML = this.options.buttonText[1]; // 重置按钮
        this.confirmBtn.innerHTML = this.options.buttonText[2]; // 提交按钮
        this.cancelBtn.style.color = this.options.buttonColor[0]; //关闭按钮颜色
        this.resetBtn.style.color = this.options.buttonColor[1]; //重置按钮颜色
        this.confirmBtn.style.color = this.options.buttonColor[2]; //提交按钮颜色
        this.img1.src = this.options.src;
        this.img2.src = this.options.src;
        var tempImage = new Image();
        tempImage.onload = function () {
          _this.originW = _this.img2.width;
          _this.originH = _this.img2.height;
          _this.originRatio = _this.originW / _this.originH;
          _this.initSize();
          _this.clipic.style.transform = 'translate(0, 0)';
          // 图片宽度大于图片高度
          if (_this.img1.width > _this.img1.height) {
            _this.img1.style.height = _this.frame1.clientHeight + 'px';
            _this.img2.style.height = _this.frame1.clientHeight + 'px';
            _this.img1.style.width = _this.img1.width * (_this.frame1.clientHeight / _this.img1.height) + 'px';
            _this.img2.style.width = _this.img1.width * (_this.frame1.clientHeight / _this.img1.height) + 'px';
          } else {
            _this.img1.style.width = _this.frame1.clientWidth + 'px';
            _this.img2.style.width = _this.frame1.clientWidth + 'px';
            _this.img1.style.height = _this.img1.height * (_this.frame1.clientWidth / _this.img1.width) + 'px';
            _this.img2.style.height = _this.img1.height * (_this.frame1.clientWidth / _this.img1.width) + 'px';
          }
          // 使图片居中显示
          if (_this.img1.height > _this.img1.width) {
            _this.translateY = -Math.floor((_this.img1.height - _this.options.clipicHeight) / 2);
            _this.translateX = 0;
          } else {
            _this.translateX = -Math.floor((_this.img1.width - _this.options.clipicWidth) / 2);
            _this.translateY = 0;
          }
          _this.setTransform();
          _this.cancelBtn.addEventListener('click', _this.cancel);
          _this.resetBtn.addEventListener('click', _this.reset);
          _this.confirmBtn.addEventListener('click', _this.done);
          _this.clipic.addEventListener('touchmove', function (e) {
            e.preventDefault();
            if (e.touches.length > 1) {
              _this.setScale(e.touches[0], e.touches[1]);
              _this.setRotate(e.touches[0], e.touches[1]);
              return;
            }
            _this.setTranslate(e.touches[0]);
          });
          _this.clipic.addEventListener('touchend', function (e) {
            _this.distance = null;
            _this.angle = null;
            _this.moveX = null;
            _this.moveY = null;
          });
        };
        tempImage.src = this.options.src;
      }

      // 初始化

    }, {
      key: 'initSize',
      value: function initSize() {
        var body = document.documentElement || document.body;
        var clipicWidth = 0;
        var clipicHeight = 0;
        var ratio = this.options.width / this.options.height;
        if (ratio === 1) {
          if (body.clientHeight > body.clientWidth) {
            clipicWidth = body.clientWidth - 60;
            clipicHeight = body.clientWidth - 60;
          } else {
            clipicWidth = body.clientHeight - 60;
            clipicHeight = body.clientHeight - 60;
          }
        } else {
          if (body.clientHeight > body.clientWidth) {
            if (body.clientWidth > this.options.width) {
              clipicWidth = this.options.width;
              clipicHeight = this.options.height;
            } else {
              clipicWidth = body.clientWidth - 60;
              clipicHeight = (body.clientWidth - 60) / ratio;
            }
          } else {
            if (body.clientHeight > this.options.height) {
              clipicWidth = this.options.width;
              clipicHeight = this.options.height;
            } else {
              clipicWidth = body.clientHeight - 60;
              clipicHeight = (body.clientHeight - 60) / ratio;
            }
          }
        }
        this.options.clipicWidth = clipicWidth;
        this.options.clipicHeight = clipicHeight;
        this.options.width = clipicWidth;
        this.options.height = clipicHeight;
        this.frame1.style.width = clipicWidth + 'px';
        this.frame1.style.height = clipicHeight + 'px';
        this.frame2.style.width = clipicWidth + 'px';
        this.frame2.style.height = clipicHeight + 'px';
      }
    }, {
      key: 'setScale',
      value: function setScale(touches1, touches2) {
        var x = Math.abs(touches1.clientX - touches2.clientX);
        var y = Math.abs(touches1.clientY - touches2.clientY);
        var s = Math.sqrt(x * x + y * y);
        if (this.distance) {
          this.scale += (s - this.distance) / this.img2.clientWidth;
          this.setTransform();
        }
        this.distance = s;
      }
    }, {
      key: 'setRotate',
      value: function setRotate(touches1, touches2) {
        var x = touches1.clientX - touches2.clientX;
        var y = touches1.clientY - touches2.clientY;
        var angle = Math.atan2(y, x) * 180 / Math.PI;
        if (this.angle) {
          this.rotate += angle - this.angle;
          this.setTransform();
        }
        this.angle = angle;
      }
    }, {
      key: 'setTranslate',
      value: function setTranslate(touches) {
        var x = touches.clientX;
        var y = touches.clientY;
        if (this.moveX) {
          this.translateX += x - this.moveX;
        }
        if (this.moveY) {
          this.translateY += y - this.moveY;
        }
        this.moveX = x;
        this.moveY = y;
        this.setTransform();
      }

      // 图片移动

    }, {
      key: 'setTransform',
      value: function setTransform() {
        var transform = 'translate(' + this.translateX + 'px, ' + this.translateY + 'px) scale(' + this.scale + ') rotate(' + this.rotate + 'deg)';
        this.img1.style.transform = transform;
        this.img2.style.transform = transform;
      }

      // 关闭按钮

    }, {
      key: 'cancel',
      value: function cancel(eventType) {
        var _this2 = this;

        this.clipic.style.transform = 'translate(0, 100%)';
        setTimeout(function () {
          _this2.img1.style = '';
          _this2.img1.src = '';
          _this2.img2.style = '';
          _this2.img2.src = '';
        }, 400);
        if (this.options.onCancel && eventType !== 'done') {
          this.options.onCancel();
        }
        this.cancelBtn.removeEventListener('click', this.cancel);
        this.resetBtn.removeEventListener('click', this.reset);
        this.confirmBtn.removeEventListener('click', this.done, true);
      }

      // 重置按钮

    }, {
      key: 'reset',
      value: function reset() {
        var _this3 = this;
        this.scale = 1;
        this.rotate = 0;
        if (this.img1.height > this.img1.width) {
          this.translateY = -Math.floor((this.img1.height - this.options.clipicHeight) / 2);
          this.translateX = 0;
        } else {
          this.translateX = -Math.floor((this.img1.width - this.options.clipicWidth) / 2);
          this.translateY = 0;
        }
        this.img1.style.transition = '0.3s';
        this.img2.style.transition = '0.3s';
        this.setTransform();
        setTimeout(function () {
          _this3.img1.style.transition = '';
          _this3.img2.style.transition = '';
        }, 300);
      }
    }, {
      key: 'done',
      value: function done() {
        var _this4 = this;

        var zommRatio = this.options.width / this.frame2.clientWidth;
        var canvas = document.createElement('canvas');
        canvas.width = this.options.width;
        canvas.height = this.options.height;
        console.log('258', this.img1, canvas.width, canvas.height, this.options.width, this.options.height);
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        var drawImageW = void 0;
        var drawImageH = void 0;
        if (this.img1.height > this.img1.width) {
          drawImageW = this.options.width;
          drawImageH = this.img1.height / (this.img1.width / this.options.width);
        } else {
          drawImageH = this.options.height;
          drawImageW = this.img1.width / (this.img1.height / this.options.height);
        }
        var point = { x: drawImageW / 2, y: drawImageH / 2 };
        ctx.translate(this.translateX * zommRatio, this.translateY * zommRatio);
        if (this.rotate !== 0) {
          ctx.translate(point.x, point.y);
          ctx.rotate(this.rotate * Math.PI / 180);
          ctx.translate(-point.x, -point.y);
        }
        if (this.scale !== 1) {
          ctx.translate(point.x * (1 - this.scale), point.y * (1 - this.scale));
          ctx.scale(this.scale, this.scale);
        }
        ctx.drawImage(this.img2, 0, 0, drawImageW, drawImageH);
        if (this.options.onDone) {
          switch (this.options.encode) {
            case 'base64':
              this.options.onDone(canvas.toDataURL('image/' + this.options.type, this.options.quality));
              break;
            case 'blob':
              canvas.toBlob(function (blob) {
                _this4.options.onDone(blob);
              }, 'image/' + this.options.type);
              break;
            case 'file':
              canvas.toBlob(function (blob) {
                var file = new window.File([blob], _this4.options.name, {
                  type: 'image/' + _this4.options.type
                });
                _this4.options.onDone(file);
              }, 'image/' + this.options.type);
              break;
            default:
              this.options.onDone(canvas.toDataURL('image/' + this.options.type, this.options.quality));
              break;
          }
        }
        this.cancel('done');
      }
    }]);
    return Clipic;
  }();

  return Clipic;

})));
