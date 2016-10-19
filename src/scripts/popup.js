function save_options() {
  var active = document.getElementById('main-checkbox').checked;
  chrome.storage.sync.set({"shouldWork": active}, function() {
    //console.log('Settings saved');
  });

  // refresh page
  chrome.tabs.getSelected(null, function(tab) {
    var code = 'window.location.reload();';
    chrome.tabs.executeScript(tab.id, {code: code});
  });
}

function restore_options() {
  chrome.storage.sync.get("shouldWork", function(items) {
    var checkbox = document.getElementById('main-checkbox');
    if (checkbox) {
      checkbox.checked = items.shouldWork;
      //console.log(items);
      //console.log(items.shouldWork);
    }
  });
}

document.addEventListener('DOMContentLoaded', function(){
  restore_options();
  document.getElementById('main-checkbox').addEventListener('change',
    save_options, false);
});

