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
        .module('giphyasm', [
            'giphyasm.constants',
            'giphyasm.services',
            'giphyasm.search'
        ]);
})();

// APP CONSTANTS
// ----------------------------------- 
(function () {
    'use strict';

    angular
        .module('giphyasm.constants', []);
})();

(function () {
    'use strict';

    angular
        .module('giphyasm.constants')
        .constant('CONFIG', {
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
        .module('giphyasm.services', [
            'giphyasm.constants',
            'giphyasm.common'
        ]);
})();

(function () {
    'use strict';

    angular
        .module('giphyasm.services')
        .factory('GiphyService', GiphyService);

    GiphyService.$inject = ['$http', 'CONFIG', 'CommonService'];
    function GiphyService($http, CONFIG, CommonService) {
        var service = {
            search: searchFunc,
            trending: trendingFunc
        };

        return service;

        //Method definitions
        function searchFunc(options) {
            /*
            q - search query term or phrase
            lang - (optional) specify default country for regional content; format is 2-letter ISO 639-1 country code. See list of supported languages here
            limit - (optional) number of results to return, maximum 100. Default 25.
            offset - (optional) results offset, defaults to 0.
            rating - (optional) limit results to those rated (y,g, pg, pg-13 or r).
            fmt - (optional) return results in html or json format (useful for viewing responses as GIFs to debug/test)
            */

            options = options || {};
            var limit = options.limit || CONFIG.limitSearch;
            var url = CONFIG.urlSearch + 'api_key=' + CONFIG.apiKey + '&q=' + options.q + '&limit=' + limit + '&offset=' + options.offset;

            if (options.rating) {
                url = url.concat('&rating=', options.rating);
            }
            if (options.lang) {
                url = url.concat('&lang=', options.lang);
            }
            if (options.fmt) {
                url = url.concat('&fmt=', options.fmt);
            }

            return $http
                .get(url)
                .then(function (response) {
                    return response;
                })
                .catch(CommonService.errorHandler);
        }

        function trendingFunc(options) {
            /*
            limit (optional) limits the number of results returned. By default returns 25 results.
            offset - (optional) results offset, defaults to 0.
            rating - limit results to those rated (y,g, pg, pg-13 or r).
            fmt - (optional) return results in html or json format (useful for viewing responses as GIFs to debug/test)
            */
            options = options || {};
            var limit = options.limit || CONFIG.limitTrending;
            var url = CONFIG.urlTrending + 'api_key=' + CONFIG.apiKey + '&limit=' + limit;

            if (options.offset) {
                url = url.concat('&offset=', options.offset);
            }
            if (options.rating) {
                url = url.concat('&rating=', options.rating);
            }
            if (options.fmt) {
                url = url.concat('&fmt=', options.fmt);
            }

            return $http
                .get(url)
                .then(function (response) {
                    return response;
                })
                .catch(CommonService.errorHandler);
        }
    }
})();



// APP SERVICES
// ----------------------------------- 
(function () {
    'use strict';

    angular
        .module('giphyasm.common', [
        ]);
})();

(function () {
    'use strict';

    angular
        .module('giphyasm.common')
        .factory('CommonService', CommonService);

    CommonService.$inject = ['$log'];
    function CommonService($log) {
        var service = {
            errorHandler: errorHandlerFunc
        };

        return service;

        //Method definitions
        function errorHandlerFunc(error) {
            $log.error(error);
        }
    }
})();

// Main Controller
// ----------------------------------- 
(function () {
    'use strict';

    angular
        .module('giphyasm.search', [
            'giphyasm.constants',
            'giphyasm.common'
        ]);
})();

(function () {
    'use strict';

    angular
        .module('giphyasm.search')
        .controller('MainController', MainController);

    MainController.$inject = ['GiphyService', 'CommonService'];
    function MainController(GiphyService, CommonService) {
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
                })
                .catch(CommonService.errorHandler);
        }

        //Functions

    }
})();