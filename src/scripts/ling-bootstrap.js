(function(doc, browser){
  'use strict';

  doc.addEventListener('DOMContentLoaded', function() {
    browser.storage.sync.get('shouldWork', function(items) {
      if (items.shouldWork) {
        new LinguistLoader.Utilities().refresh();
        // listening the webbrowser url change...
        doc.body.addEventListener('DOMSubtreeModified', function () {
          new LinguistLoader.Utilities().refresh();
        }, false);
      }
    });
  });
}(document, chrome));
