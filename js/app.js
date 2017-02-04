/*!
 * 
 * Giphy Assessment
 * 
 * Version: 1.0.0
 * Author: Orlando Vallejos
 * 
 */

// APP START
// ----------------------------------- 
(function () {
    'use strict';

    angular
        .module('giphyasm', []);
})();

// APP CONSTANTS
// ----------------------------------- 
(function () {
    'use strict';

    angular
        .module('giphyasm')
        .constant('GLOBAL', {
            'urlSearch': 'http://api.giphy.com/v1/gifs/search?',
            'urlTrending': 'http://api.giphy.com/v1/gifs/trending?',
            'apiKey': 'dc6zaTOxFJmzC',
            'limitSearch': 10,
            'limitTrending': 10
        });
})();


// APP SERVICES
// ----------------------------------- 
(function () {
    'use strict';

    angular
        .module('giphyasm')
        .factory('GiphyService', GiphyService);

    GiphyService.$inject = ['$http', 'GLOBAL'];
    function GiphyService($http, GLOBAL) {
        var service = {
            search: searchFunc,
            trending: trendingFunc
        };

        return service;

        //Method definitions
        function searchFunc(options) {
            /*
            q - search query term or phrase
            limit - (optional) number of results to return, maximum 100. Default 25.
            offset - (optional) results offset, defaults to 0.
            rating - (optional) limit results to those rated (y,g, pg, pg-13 or r).
            lang - (optional) specify default country for regional content; format is 2-letter ISO 639-1 country code. See list of supported languages here
            fmt - (optional) return results in html or json format (useful for viewing responses as GIFs to debug/test)
            */

            options = options || {};
            var limit = options.limit || GLOBAL.limitSearch;
            var url = GLOBAL.urlSearch + 'api_key=' + GLOBAL.apiKey + '&q=' + options.q + '&limit=' + limit + '&offset=' + options.offset
                + '&rating=' + options.rating + '&lang=' + options.lang + '&fmt=' + options.fmt;

            return $http
                .get(url);
        }

        function trendingFunc(options) {
            /*
            limit (optional) limits the number of results returned. By default returns 25 results.
            offset - (optional) results offset, defaults to 0.
            rating - limit results to those rated (y,g, pg, pg-13 or r).
            fmt - (optional) return results in html or json format (useful for viewing responses as GIFs to debug/test)
            */
            options = options || {};
            var limit = options.limit || GLOBAL.limitTrending;
            var url = GLOBAL.urlTrending + 'api_key=' + GLOBAL.apiKey + '&limit=' + limit;

            if (options.offset)
                url = url.concat('&offset=', options.offset);

            if (options.rating)
                url = url.concat('&rating=', options.rating);
            if (options.fmt)
                url = url.concat('&fmt=', options.fmt);

            return $http
                .get(url);
        }
    }
})();


// Main Controller
// ----------------------------------- 
(function () {
    'use strict';

    angular
        .module('giphyasm')
        .controller('MainController', MainController);

    MainController.$inject = ['GiphyService'];
    function MainController(GiphyService) {
        var vm = this;

        //Variables
        vm.title = 'Controller';

        activate();

        //Methods
        vm.getTrending = getTrending;

        //Method definitions
        function activate() {
            getTrending();
        }

        function getTrending() {
            GiphyService.trending()
                .then(function (response) {
                    console.log(response);
                });
        }

        //Functions


    }
})();