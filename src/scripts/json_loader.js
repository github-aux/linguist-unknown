var url_ext = "https://raw.githubusercontent.com/luizperes/linguist-unknown/master/lib/extensions.json";
var url_lang = "https://raw.githubusercontent.com/luizperes/linguist-unknown/master/lib/languages.json";

function JsonHelper() {
    this.load = function(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = function () {
            var resp = JSON.parse(xhr.responseText);
            callback(resp);
        }

        xhr.setRequestHeader("Content-Type", "*/*");
        xhr.send();
    };
}


chrome.storage.sync.get("shouldWork", function(items) {
    if (items.shouldWork) {
        var jsonHelper = new JsonHelper();
        jsonHelper.load(url_ext, function(response){
            console.log("brau");
            console.log(response);
        });
    }
});

