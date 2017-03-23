'use strict';

require('babel-polyfill');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

module.exports.alert = function (event, context, callback) {

  var rp = require('request-promise');
  var parser = require('xml2json');
  var moment = require('moment');

  var sendHook = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(item) {
      var options;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              options = {
                method: 'POST',
                uri: process.env.hookUrl,
                body: {
                  title: item.title,
                  text: 'CVSS Score is ' + item['sec:cvss'].score + '<br>' + item.title + '<br>' + item['rdf:about']
                },
                json: true
              };
              _context.next = 3;
              return rp(options);

            case 3:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function sendHook(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  var main = function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
      var venderId, yesterday, url, res, obj;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              venderId = process.env.venderId;
              yesterday = moment().add(9, 'hours').subtract(1, 'days'); // 9時間足してJSTにしてそこから1日ひく

              url = 'http://jvndb.jvn.jp/myjvn?rangeDateFirstPublished=n&rangeDatePublic=n&rangeDatePublished=n&method=getVulnOverviewList&lang=ja' + '&dateFirstPublishedEndM=' + yesterday.get('month') + '&dateFirstPublishedEndD=' + yesterday.get('date') + '&dateFirstPublishedStartY=' + yesterday.get('year') + '&dateFirstPublishedStartM=' + yesterday.get('month') + '&dateFirstPublishedStartD=' + yesterday.get('date') + '&dateFirstPublishedEndY=' + yesterday.get('year') + '&vendorId=' + venderId;
              _context2.next = 5;
              return rp(url);

            case 5:
              res = _context2.sent;
              obj = JSON.parse(parser.toJson(res));


              if (Array.isArray(obj['rdf:RDF'].item) === false) {
                sendHook(obj['rdf:RDF'].item);
              } else {
                obj['rdf:RDF']['item'].map(function (item) {
                  sendHook(item);
                });
              }
              callback();

            case 9:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    return function main() {
      return _ref2.apply(this, arguments);
    };
  }();

  main();
};