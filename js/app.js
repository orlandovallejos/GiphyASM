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
            'giphyasm.configuration',
            'giphyasm.giphy',
            'giphyasm.home'
        ]);
})();

// APP SERVICES
// ----------------------------------- 
(function () {
    'use strict';

    angular
        .module('giphyasm.giphy', [
            'giphyasm.configuration'
        ]);
})();

// APP CONFIGURATION
// ----------------------------------- 
(function () {
    'use strict';

    angular
        .module('giphyasm.configuration', []);
})();
// Home Module
// ----------------------------------- 
(function () {
    'use strict';

    angular
        .module('giphyasm.home', [
            'giphyasm.configuration'
        ]);
})();
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
(function () {
    'use strict';

    angular
        .module('giphyasm.configuration')
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
(function () {
    'use strict';

    angular
        .module('giphyasm.home')
        .directive('asmSearchBar', asmSearchBar);

    asmSearchBar.$inject = ['$q'];
    function asmSearchBar($q) {

        var directive = {
            restrict: 'E',
            scope: {
                search: '='
            },
            controller: ['$scope', 'GiphyService', 'CommonService', 'CONFIG', function ($scope, GiphyService, CommonService, CONFIG) {
                $scope.$watch('search.currentPage', function () {
                    //Perform search when the current page changes.
                    if ($scope.currentPage === 0 || !$scope.search.query) {
                        return;
                    }

                    var opt = {
                        q: $scope.search.query,
                        offset: $scope.search.currentPage * CONFIG.limitSearch
                    };

                    GiphyService.search(opt)
                        .then(function (response) {
                            $scope.search.results = response;
                        })
                        .catch(CommonService.errorHandler);
                });

                $scope.execute = function (search) {
                    if (search.query) {
                        var opt = {
                            q: $scope.search.query,
                            offset: 0
                        };
                        GiphyService.search(opt)
                            .then(function (response) {
                                search.results = response;
                                search.currentPage = 0;
                            });
                    }
                };
            }],
            template:
            '<div class="input-group">' +
            '   <input type="text" class="form-control" ng-model="search.query" placeholder="Search for...">' +
            '   <span class="input-group-btn">' +
            '       <button class="btn btn-default" type="button" ng-click="execute(search)">Go</button>' +
            '   </span>' +
            '</div>'
        };

        return directive;
    }
})();
(function () {
    'use strict';

    angular
        .module('giphyasm.home')
        .directive('asmSearchResults', asmSearchResults);

    asmSearchResults.$inject = ['$q'];
    function asmSearchResults($q) {

        var directive = {
            restrict: 'E',
            scope: {
                search: '='
            },
            controller: ['$scope', 'CONFIG', function ($scope, CONFIG) {

                function init() {
                    $scope.paginationVisible = false;
                    $scope.pagesPerGroup = CONFIG.pagesInFooter;
                    $scope.pages = [];
                    $scope.previousEnabled = false;
                    $scope.nextEnabled = false;

                    $scope.$watch('search.results', setupPages);
                }

                init();

                $scope.changePagination = function (pageNumber) {
                    $scope.search.currentPage = pageNumber;
                };

                $scope.changePaginationGroupPrevious = function () {
                    var currentGroup = getCurrentGroup();
                    currentGroup--;
                    $scope.search.currentPage = ((currentGroup) * $scope.pagesPerGroup);

                    setupPages();
                };

                $scope.changePaginationGroupNext = function () {
                    var currentGroup = getCurrentGroup();
                    $scope.search.currentPage = ((currentGroup + 1) * $scope.pagesPerGroup);

                    setupPages();
                };

                function setupPages() {
                    if (!$scope.search.results || ($scope.search.results.images && $scope.search.results.images.length === 0)) {
                        $scope.paginationVisible = false;
                        return;
                    }

                    $scope.paginationVisible = true;
                    var cantPageGroups = parseInt($scope.search.results.pagination.total_count / $scope.search.results.pagination.count);

                    var currentGroup = getCurrentGroup();
                    var startPage = (currentGroup * $scope.pagesPerGroup),
                        endPage = startPage + $scope.pagesPerGroup;

                    $scope.pages = [];
                    $scope.previousEnabled = (currentGroup !== 0);
                    $scope.nextEnabled = true;

                    for (var i = startPage; i < endPage; i++) {
                        if (i < cantPageGroups) {
                            var page = {
                                number: i,
                                active: (i === $scope.search.currentPage)
                            };

                            $scope.pages.push(page);
                        }
                        else {
                            $scope.nextEnabled = false;
                            break;
                        }
                    }
                }

                function getCurrentGroup() {
                    return parseInt($scope.search.currentPage / $scope.pagesPerGroup);
                }
            }],
            template:
            '<div class="row">' +
            '    <div class="col-md-4" ng-repeat="item in search.results.images">' +
            '        <img ng-src="{{item}}" class="img-responsive" alt="Responsive image">' +
            '    </div>' +
            '</div>' +

            '<nav aria-label="Search results search.pages" ng-show="paginationVisible">' +
            '    <ul class="pagination">' +
            '        <li ng-class="{disabled: !previousEnabled}">' +
            '            <a href="#" aria-label="Previous" ng-click="previousEnabled && changePaginationGroupPrevious()">' +
            '                <span aria-hidden="true">&laquo;</span>' +
            '            </a>' +
            '        </li>' +
            '        <li ng-repeat="page in pages" ng-class="{active: page.active}">' +
            '           <a href="#" ng-click="changePagination(page.number)">{{page.number + 1}}</a>' +
            '        </li>' +
            '        <li ng-class="{disabled: !nextEnabled}">' +
            '            <a href="#" aria-label="Next" ng-click="nextEnabled && changePaginationGroupNext()">' +
            '                <span aria-hidden="true">&raquo;</span>' +
            '            </a>' +
            '        </li>' +
            '    </ul>' +
            '</nav>'
        };

        return directive;
    }
})();
(function () {
    'use strict';

    angular
        .module('giphyasm.home')
        .directive('asmTrendingResults', asmTrendingResults);

    asmTrendingResults.$inject = ['$q', 'GiphyService', 'CommonService'];
    function asmTrendingResults($q, GiphyService, CommonService) {

        var directive = {
            restrict: 'E',
            scope: {
                itemsCant: '@'
            },
            template: '<div class="row">' +
            '    <div class="col-md-4" ng-repeat="item in items.images">' +
            '        <img ng-src="{{item}}" class="img-responsive" alt="Responsive image">' +
            '    </div>' +
            '</div>',
            link: function (scope, element, attrs) {
                var opt = { limit: scope.itemsCant };

                GiphyService.trending(opt)
                    .then(function (response) {
                        scope.items = response;
                    })
                    .catch(CommonService.errorHandler);
            }
        };
        return directive;
    }
})();
(function () {
    'use strict';

    angular
        .module('giphyasm.home')
        .controller('MainController', MainController);

    MainController.$inject = ['GiphyService', 'CommonService'];
    function MainController(GiphyService, CommonService) {
        var vm = this;

        //Variables
        vm.mySearch = {
            query: '',
            currentPage: 0
        };

        activate();

        //Methods

        //Method definitions
        function activate() {
        }

        //Functions
    }
})();