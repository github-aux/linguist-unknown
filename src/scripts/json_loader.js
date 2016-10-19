chrome.storage.sync.get("shouldWork", function(items) {
  if (items.shouldWork) {
    parseJson();
  }
});

function parseJson() {
   var xhr = new XMLHttpRequest();
   var url = "https://raw.githubusercontent.com/luizperes/linguist-unknown/master/lib/languages.json";
   xhr.open("GET", url, true);
   var resp;
   xhr.onload = function () {
     resp = JSON.parse(xhr.responseText);
     console.log(resp);
   }

   xhr.setRequestHeader("Content-Type", "*/*");
   xhr.send();
}
