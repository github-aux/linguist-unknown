var url_ext = "https://raw.githubusercontent.com/luizperes/linguist-unknown/master/lib/extensions.json";
var url_lang_base = "https://raw.githubusercontent.com/luizperes/linguist-unknown/master/lib/languages/";
var current_url = "";

function JsonHelper() {
    this.load = function(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = function () {
            try {
                var resp = JSON.parse(xhr.responseText);
                callback(resp);
            } catch(e) {
                console.error(e);
            }
        }

        xhr.setRequestHeader("Content-Type", "*/*");
        xhr.send();
    };
}

function Utilities() {
    this.tryMatchUrlExtension = function(url, exts, successCallback) {
        exts.forEach(function(lang){
            lang.extensions.forEach(function(obj) {
                if (url.endsWith(obj.extension)) {
                   successCallback(lang);
                }
            });
        });
    };

    this.getLanguageDetails = function(url, ext, callback) {
        var jsonHelper = new JsonHelper();
        var newUrl = url + ext.language.toLowerCase() + ".json";
        jsonHelper.load(newUrl, function(objLang){
            // add extensions to the object just in case
            objLang.extensions = ext.extensions;
            callback(objLang);
        });
    };

    this.refresh = function() {
        var new_url = window.location.href;
        if (current_url != new_url) {
            current_url = new_url;
            window.setTimeout(function() {
                var jsonHelper = new JsonHelper();
                jsonHelper.load(url_ext, function(objs){
                    var util = new Utilities();
                    util.tryMatchUrlExtension(current_url, objs, function(obj){
                        util.getLanguageDetails(url_lang_base, obj, function(langObj){
                            new Highlighter(langObj).draw();
                        });
                    });
                });
            }, 100);
        }
    };
}

document.addEventListener('DOMContentLoaded', function(){
    chrome.storage.sync.get("shouldWork", function(items) {
        if (items.shouldWork) {
            new Utilities().refresh();
            // listening the webbrowser url change...
            document.body.addEventListener('DOMSubtreeModified', function () {
                new Utilities().refresh();
            }, false);
        }
    });
});
