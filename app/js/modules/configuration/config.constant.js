(function () {
    'use strict';

    angular
        .module('giphyasm.configuration')
        .constant('CONFIG', {
            'urlSearch': 'http://api.giphy.com/v1/gifs/search?',
            'urlTrending': 'http://api.giphy.com/v1/gifs/trending?',
            'apiKey': 'dc6zaTOxFJmzC',
            'limitSearch': 10,
            'limitTrending': 10,
            'pagesInFooter': 5
        });
})();