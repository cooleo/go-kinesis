'use strict';
var req = require('request');
var Promise = require('bluebird');
var request = Promise.promisify(req);
var pageSize = 1000;

var ServiceHelper = function (queue) {
  var self = this;
  var parserChannelData = function (data) {
    if (data == null || data == undefined) return;
    var dataObject = JSON.parse(data.body);
    var pages = [];
    for (var i = 0; i < dataObject.totalPage; i++) {
        pages.push(i);
    }
    return pages;
  };
  var getChannelSummary = function () {
    var requestOption = {
        url: 'http://0.0.0.0:5000/api/v1/channel/' + pageSize
    };
    return request(requestOption).then(parserChannelData)
  };

  var pushItems = function (items) {
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var ex = item.source;
      var msg = JSON.stringify(item);
      console.log('queue:' + queue.name);
      queue.publish(ex, queue.name, new Buffer(msg));
      console.log(" [x] Sent %s", msg);
    }
 };
  var parserChannels = function (data) {
     var body = JSON.parse(data.body);
     return body.channels;
 };
 var getItemsOfPageAndPush = function (page) {
   var requestOption = {
      url: 'http://0.0.0.0:5000/api/v1/channels/' + page
    };
   return request(requestOption).then(parserChannels).then(pushItems);
  };
  
  var getItems = function (pages) {
    return Promise.map(pages, function (page) {
      console.log('page' + page);
      return getItemsOfPageAndPush(page);
    });
  };
  
  self.pushToQueue = function () {
    getChannelSummary()
    .then(getItems);
  };
};

module.exports = ServiceHelper;
