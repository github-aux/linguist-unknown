var LinguistLoader = (function() {
  'use strict';

  var GITHUB_HOST = "github.com";
  var GITHUB_URL_FILE = "blob/";
  var GITHUB_RAW = "https://raw.githubusercontent.com";
  var FILENAME = ".linguist.yml";

  var linguistObj = null;
  var current_url = "";

  var DownloadHelper = (function() {
    var DownloadHelper = function() { };
    DownloadHelper.prototype.load = function(url, callback) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onload = function () {
        try {
          if (xhr.status === 404) {
            return; // ignore if file is not found
          }

          var resp = jsyaml.load(xhr.responseText);
          callback(resp);
        } catch(e) {
          console.error(e);
        }
      };

      xhr.setRequestHeader("Content-Type", "*/*");
      xhr.send();
    };

    return DownloadHelper;
  }());

  var Utilities = (function() {
    var Utilities = function() { };

    Utilities.prototype.tryMatchUrlExtension = function(url, objs, successCallback) {
      var keys = Object.keys(objs);
      var i = 0;
      var still_looking_for = true;
      var lang;

      // Don't make a function within a loop
      var extFunc = function(extension) {
        if (url.endsWith(extension)) {
          successCallback(lang);
          still_looking_for = false;
          return false;
        }

        return true;
      };

      var langKey = null;
      while ((langKey = keys[i++]) && still_looking_for) {
        lang = objs[langKey];
        lang.extensions.every(extFunc);
      }
    };

    Utilities.prototype.isGithub = function(l) {
      return l.hostname === GITHUB_HOST && l.href.includes(GITHUB_URL_FILE);
    };

    Utilities.prototype.getPossibleFilepath = function(l) {
      var uri = l.pathname.split(GITHUB_URL_FILE);
      return GITHUB_RAW + uri[0] + uri[1].split('/')[0] + '/' + FILENAME;
    };

    Utilities.prototype.refresh = function() {
      var new_url = window.location.href;

      if (new_url === current_url || !this.isGithub(window.location)) {
        return;
      }

      current_url = new_url;
      if (linguistObj === null) {
        linguistObj = {
          path: this.getPossibleFilepath(window.location)
        };
      }

      window.setTimeout(function() {
        var downloadHelper = new DownloadHelper();
        downloadHelper.load(linguistObj.path, function(objs){
          this.tryMatchUrlExtension(current_url, objs, function(langObj){
            new LinguistHighlighter.Highlighter(langObj).draw();
          });
        }.bind(this));
      }.bind(this), 100);
    };

    return Utilities;
  }());

  return {
    Utilities: Utilities
  };
}());

exports.LinguistLoader = LinguistLoader;

