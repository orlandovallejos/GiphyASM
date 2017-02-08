(function () {
    'use strict';

    angular
        .module('giphyasm.giphy')
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
                    return processResults(response.data);
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
                    return processResults(response.data);
                })
                .catch(CommonService.errorHandler);
        }

        //Functions
        function processResults(dataAPI) {
            var results = {
                images: [],
                pagination: dataAPI.pagination
            };

            results.images = dataAPI.data.map(function (item) {
                return item.images.fixed_width.url;
            });

            return results;
        }
    }
})();