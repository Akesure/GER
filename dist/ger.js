(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

var utils = {
    typeDecide: function typeDecide(o, type) {
        return Object.prototype.toString.call(o) === "[object " + (type || "Object") + "]";
    }
};

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









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Config = function () {
    function Config(options) {
        classCallCheck(this, Config);

        this.config = {
            mergeReport: true, // mergeReport 是否合并上报， false 关闭， true 启动（默认）
            delay: 1000, // 当 mergeReport 为 true 可用，延迟多少毫秒，合并缓冲区中的上报（默认）
            url: "ewewe", // 指定错误上报地址
            except: [/Script error/i], // 忽略某个错误
            random: 1, // 抽样上报，1~0 之间数值，1为100%上报（默认 1）
            repeat: 5, // 重复上报次数(对于同一个错误超过多少次不上报)
            //errorLSSign:'mx-error'                  // error错误数自增 0
            //maxErrorCookieNo:50,                    // error错误数自增 最大的错
            tryPeep: false,
            peepSystem: false,
            peepJquery: false,
            peepConsole: true
        };
        Object.assign(this.config, options); /// this.config
    }

    createClass(Config, [{
        key: "set",
        value: function set$$1() {}
    }, {
        key: "get",
        value: function get$$1() {}
    }]);
    return Config;
}();

/**
 * @author suman
 * @fileoverview report
 * @date 20170215
 */
//import delay from './delay';
var mergeTimeout = null;
var delayTimes = 1000;
var Report = function (_Config) {
  inherits(Report, _Config);

  function Report(options) {
    classCallCheck(this, Report);

    var _this = possibleConstructorReturn(this, (Report.__proto__ || Object.getPrototypeOf(Report)).call(this, options));

    _this.errorQueue = [];
    return _this;
  }
  // 手动上报


  createClass(Report, [{
    key: "error",
    value: function error(msg) {
      if (!msg) {
        console.log('error方法内 msg 参数为空');
        return;
      }
      var errorMsg = {};
      if (utils.typeDecide(msg, 'String')) {
        errorMsg.msg = msg;
        errorMsg.level = 5;
      } else if (utils.typeDecide(msg)) {
        errorMsg = msg;
        errorMsg.level = 5;
      }
      this.carryError(errorMsg);
    }

    // 发送

  }, {
    key: "send",
    value: function send(mergeReport, isNowReport) {
      var that = this;
      var fn = function fn() {
        var parames = '';
        if (mergeReport) {
          // 合并上报
          console.log('合并上报');
          for (var i = 0; i < that.errorQueue.length; i++) {
            var obj = that.errorQueue[i];
            for (var name in obj) {
              parames += name + '=' + obj[name] + '&';
            }
            if (i != that.errorQueue.length - 1) {
              parames += '###';
            }
          }
        } else {
          // 不合并上报
          console.log('不合并上报');
          var obj = that.errorQueue[0];
          for (var _name in obj) {
            parames += _name + '=' + obj[_name] + '&';
          }
        }
        console.log(that.config.url);
        that.config.url += '?' + parames;
        var oImg = new Image();
        oImg.src = that.config.url;
      };
      if (!isNowReport) {
        // 延迟上报
        mergeTimeout = setTimeout(fn, delayTimes);
      } else {
        // 现在上报
        fn();
      }
    }

    // push错误到pool

  }, {
    key: "carryError",
    value: function carryError(error) {
      if (!error) {
        console.log('carryError方法内 error 参数为空');
        return;
      }
      // 拿到onerror的参数 放数组中
      this.errorQueue.push(error);
    }

    // info

  }, {
    key: "info",
    value: function info(msg) {
      this.handleMsg(msg, 'info', 1);
    }

    // log

  }, {
    key: "log",
    value: function log(msg) {
      this.handleMsg(msg, 'log', 2);
    }

    // warn

  }, {
    key: "warn",
    value: function warn(msg) {
      this.handleMsg(msg, 'warn', 3);
    }

    // debug

  }, {
    key: "debug",
    value: function debug(msg) {
      this.handleMsg(msg, 'debug', 4);
    }

    // 手动上报 处理方法:全部立即上报 需要延迟吗?

  }, {
    key: "handleMsg",
    value: function handleMsg(msg, type, level) {
      if (!msg) {
        console.log(type + '方法内 msg 参数为空');
        return;
      }
      var errorMsg = {};
      if (utils.typeDecide(msg, 'String')) {
        errorMsg.msg = msg;
        errorMsg.level = level;
      } else if (utils.typeDecide(msg)) {
        errorMsg = msg;
        errorMsg.level = level;
      }
      this.carryError(errorMsg);
      this.send();
    }
  }]);
  return Report;
}(Config);

var GER = function (_Report) {
    inherits(GER, _Report);

    function GER(options) {
        classCallCheck(this, GER);
        return possibleConstructorReturn(this, (GER.__proto__ || Object.getPrototypeOf(GER)).call(this, options));
    }

    createClass(GER, [{
        key: 'rewriteError',
        value: function rewriteError() {
            window.onerror = function (msg, url, line, col, error) {
                var reportMsg = msg;
                if (error.stack && error) {
                    console.log(reportMsg);
                }
                //console.log(newMsg);
                console.log(arguments);
            };
        }
    }]);
    return GER;
}(Report);

window.Ger = GER;

})));
