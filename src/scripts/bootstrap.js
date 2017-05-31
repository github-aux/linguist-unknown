document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.sync.get("shouldWork", function(items) {
        if (items.shouldWork) {
            new Utilities().refresh();
            // listening the webbrowser url change...
            document.body.addEventListener('DOMSubtreeModified', function () {
                new Utilities().refresh();
            }, false);
        }
    });
});

