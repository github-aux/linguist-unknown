chrome.storage.sync.get("shouldWork", function(items) {
  if (items.shouldWork) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json", true);
    var resp;
    xhr.onload = function () {
      resp = JSON.parse(xhr.responseText);
      console.log(resp);
    }
    xhr.setRequestHeader("Content-Type", "*/*");
    xhr.send();
  }
});

