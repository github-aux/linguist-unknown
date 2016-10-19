chrome.storage.sync.get("shouldWork", function(items) {
  if (items.shouldWork) {
    document.getElementsByClassName("header-nav")[0].innerHTML += "test";
  }
});

