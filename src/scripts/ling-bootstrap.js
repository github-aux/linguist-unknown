(function(doc, browser){
  'use strict';

  doc.addEventListener('DOMContentLoaded', function() {
    browser.storage.sync.get('shouldWork', function(items) {
      if (items.shouldWork) {
        new LinguistLoader.Utilities().refresh(window.location);
        // listening the webbrowser url change...
        doc.body.addEventListener('DOMSubtreeModified', function () {
          new LinguistLoader.Utilities().refresh(window.location, null);
        }, false);
      }
    });
  });
}(document, chrome));
