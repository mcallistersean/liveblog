'use strict';

/*
  Send pageview signal to analytics providers
  IVW and Google Analytics. Not to be tied to angular app.
*/

var sendPageview = {
  _foundProviders: [], // Cache after first lookup

  _sendIVW: function() {
    if (!window.iom) return;

    var iam_data = {
      "st": window._iframeDataset.szmSt, // ID
      "cp": window._iframeDataset.szmCp, // Code
      "co": window._iframeDataset.szmCo, // Comment
      "sv": "ke" // Disable Q&A invite
    }

    window.iom.c(iam_data, 1); // where's the .h? ahahaha
  },

  _sendGA: function() {
    if (window.ga.length > 0) {
      window.ga('create', window._iframeDataset.gaProperty, 'auto');
      window.ga('set', 'anonymizeIp', true);
    }

    if (window.ga.loaded) {
      ga('send', {
        hitType: 'pageview',
        location: window.document.referrer, // set to parent url
        hitCallback: function() {}
      }); 
    }
  },

  _insertScript: function(src, cb) {
    var script = document.createElement('script'); script.src = src;
    document.getElementsByTagName("body")[0].appendChild(script);
    script.addEventListener("load", cb);
  },

  _getProviders: function() {
    var parent = this
      , foundProviders = [];

    if (parent._foundProviders.length) {
      return parent._foundProviders // return early
    }

    for (var p in parent._providers) {
      var provider = parent._providers[p]
      var keysfound = provider.requiredData.reduce(function(prev, curr) {
        return window._iframeDataset.hasOwnProperty(curr)
      }, true) // needs initial value for one element

      if (keysfound === true) { // all required attrs found
        if (!provider.object) {
          parent._insertScript(provider.scriptURL, provider.send) // not yet loaded
        }
        else foundProviders.push(provider.send) // list of _send funcs
      }
    };

    parent._foundProviders = foundProviders; // cache after initial
    return foundProviders;
  },

  send: function() { // public, invoke w/o params
    if (!window.hasOwnProperty("_iframeDataset")) return // return early
    var providers = this._getProviders(); // is cached on first call
    for (var i = providers.length - 1; i >= 0; i--) {
      providers[i](); // _send function calls
    }
  },

  receiveMessage: function(e) {
    var parent = this;
    if (e.data.type === "analytics") {
      var payload = JSON.parse(e.data.payload);
      window._iframeDataset = payload // store dataset from parentNode 
    }
  },

  init: function() {
    var parent = this;
    window.addEventListener("message", this.receiveMessage, false);
    window.addEventListener("sendpageview", this.send.bind(this), false)
  }
}

sendPageview._providers = {
  ivw: {
    send: sendPageview._sendIVW,
    requiredData: ['szmSt', 'szmCp', 'szmCo'],
    scriptURL: "https://script.ioam.de/iam.js",
    object: window.hasOwnProperty("iom") ? window.iom : null
  },

  ga: {
    send: sendPageview._sendGA,
    requiredData: ['gaProperty'],
    scriptURL: "https://www.google-analytics.com/analytics.js",
    object: window.hasOwnProperty("ga") ? window.ga : null
  }
};

module.exports = sendPageview;
