var url_ext = "https://raw.githubusercontent.com/luizperes/linguist-unknown/master/lib/extensions.json";
var url_lang_base = "https://raw.githubusercontent.com/luizperes/linguist-unknown/master/lib/languages/";
var current_url = "";

function DownloadHelper() {
    this.load = function(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = function () {
            try {
                var resp = jsyaml.load(xhr.responseText);
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

    this.getLanguageDetails = function(url, ext, callback) {
        var jsonHelper = new JsonHelper();
        var newUrl = url + ext.language.toLowerCase() + ".json";
        jsonHelper.load(newUrl, function(objLang){
            // add extensions to the object just in case
            objLang.extensions = ext.extensions;
            callback(objLang);
        });
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

    this.refresh = function() {
        var url = "https://raw.githubusercontent.com/brain-labs/brain/master/.travis.yml";
        var downloadHelper = new DownloadHelper();
        downloadHelper.load(url, function(objs){
            console.log(objs);
        });
    };
}

