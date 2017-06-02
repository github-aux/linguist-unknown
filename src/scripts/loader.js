var LinguistLoader = (function() {
  const GITHUB_HOST = "github.com";
  const GITHUB_URL_FILE = "blob/";
  const GITHUB_RAW = "https://raw.githubusercontent.com";
  const FILENAME = ".linguist.yml";

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
        }

        xhr.setRequestHeader("Content-Type", "*/*");
        xhr.send();
    };

    return DownloadHelper;
  }());

  var Utilities = (function() {
    var Utilities = function() { };

    Utilities.prototype.tryMatchUrlExtension = function(url, exts, successCallback) {
        exts.every(function(lang){
            var still_looking_for = true;
            lang.extensions.every(function(obj) {
                if (url.endsWith(obj.extension)) {
                   successCallback(lang);
                   still_looking_for = false;
                   return false;
                }

                return true;
            });

            return still_looking_for;
        });
    };

    Utilities.prototype.getLanguageDetails = function(url, ext, callback) {
        var jsonHelper = new JsonHelper();
        var newUrl = url + ext.language.toLowerCase() + ".json";
        jsonHelper.load(newUrl, function(objLang){
            // add extensions to the object just in case
            objLang.extensions = ext.extensions;
            callback(objLang);
        });
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
                console.log(objs);
            });
        }, 100);
    };

    // this.refresh = function() {
    //     var new_url = window.location.href;
    //     if (current_url != new_url) {
    //         current_url = new_url;
    //         window.setTimeout(function() {
    //             var jsonHelper = new JsonHelper();
    //             jsonHelper.load(url_ext, function(objs){
    //                 var util = new Utilities();
    //                 util.tryMatchUrlExtension(current_url, objs, function(obj){
    //                     util.getLanguageDetails(url_lang_base, obj, function(langObj){
    //                         new Highlighter(langObj).draw();
    //                     });
    //                 });
    //             });
    //         }, 100);
    //     }
    // };

    return Utilities;
  }());

  return {
    Utilities: Utilities
  };   
}());

