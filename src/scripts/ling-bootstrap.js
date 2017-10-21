(function(doc, browser){
  'use strict';
  if (undefined === window.exports) {
    window.exports = {};
  }

  doc.addEventListener('DOMContentLoaded', function() {
    browser.storage.sync.get('shouldWork', function(items) {
      if (items.shouldWork) {
        new LinguistLoader.Utilities().refresh(window.location);
        // listening the webbrowser url change...
        var observer = new MutationObserver(function(mutations) {
          new LinguistLoader.Utilities().refresh(window.location, null);
        });

        var config = { attributes: true, childList: true, characterData: true };
        observer.observe(doc.body, config); 
      }
    });
  });
}(document, chrome));
