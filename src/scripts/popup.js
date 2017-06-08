(function(doc, browser){
  'use strict';

  function save_options() {
    var active = doc.getElementById('main-checkbox').checked;
    browser.storage.sync.set({ 'shouldWork': active }, function() {});

    // refresh page
    browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var code = 'window.location.reload();';
      browser.tabs.executeScript(tabs[0].id, { code: code });
    });
  }

  function restore_options() {
    browser.storage.sync.get('shouldWork', function(items) {
      var checkbox = doc.getElementById('main-checkbox');
      if (checkbox) {
        checkbox.checked = items.shouldWork;
      }
    });
  }

  doc.addEventListener('DOMContentLoaded', function() {
    restore_options();
    doc.getElementById('main-checkbox').addEventListener('change',
      save_options,
      false
    );
  });
}(document, chrome));
