function save_options() {
  var active = document.getElementById('main-checkbox').checked;
  chrome.storage.sync.set({"shouldWork": active}, function() {
    console.log('Settings saved');
  });
}

function restore_options() {
  chrome.storage.sync.get("shouldWork", function(items) {
    var checkbox = document.getElementById('main-checkbox');
    if (checkbox) {
      checkbox.checked = items.shouldWork;
      console.log(items);
      console.log(items.shouldWork);
    }
  });
}

document.addEventListener('DOMContentLoaded', function(){
  restore_options();
  document.getElementById('main-checkbox').addEventListener('change',
    save_options, false);
});

