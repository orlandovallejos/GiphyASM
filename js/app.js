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
            'giphyasm.home',
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
        .module('giphyasm.home', [
            'giphyasm.constants',
            'giphyasm.common'
        ]);
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
        vm.trendingResults = {};
        vm.query = '';

        activate();

        //Methods
        vm.searchGIF = searchGIF;
        vm.changePage = changePage;

        //Method definitions
        function activate() {
        }

        function searchGIF() {
            var opt = {
                q: vm.query
            };

            GiphyService.search(opt)
                .then(function (response) {
                    vm.searchResults = response;
                })
                .catch(CommonService.errorHandler);
        }

        function changePage(pageNumber) {
            console.log('Change page from controller');
            var opt = {
                q: vm.query,
                offset: pageNumber * 10
            };

            GiphyService.search(opt)
                .then(function (response) {
                    vm.searchResults = response;
                })
                .catch(CommonService.errorHandler);
        }

        //Functions
    }
})();

// Directives
// ----------------------------------- 
(function () {
    'use strict';

    angular
        .module('giphyasm.search', [
        ]);
})();

(function () {
    'use strict';

    angular
        .module('giphyasm.search')
        .directive('asmSearchBar', asmSearchBar);

    asmSearchBar.$inject = ['$q'];
    function asmSearchBar($q) {

        var directive = {
            restrict: 'E',
            scope: {
                search: '&',
                query: '='
            },
            template:
            '<div class="input-group">' +
            '   <input type="text" class="form-control" ng-model="query" placeholder="Search for...">' +
            '   <span class="input-group-btn">' +
            '       <button class="btn btn-default" type="button" ng-click="search()">Go</button>' +
            '   </span>' +
            '</div>'
        };
        return directive;
    }
})();

(function () {
    'use strict';

    angular
        .module('giphyasm.search')
        .directive('asmSearchResults', asmSearchResults);

    asmSearchResults.$inject = ['$q'];
    function asmSearchResults($q) {

        var directive = {
            restrict: 'E',
            scope: {
                items: '=',
                changePage: '&'
            },
            controller: ['$scope', function ($scope) {

                function init() {
                    //$scope.items = angular.copy($scope.items);
                    $scope.paginationVisible = false;
                    $scope.pagesPerGroup = 5;
                    $scope.currentPage = 1;
                    $scope.pages = [];
                    $scope.previousEnabled = false;
                    $scope.nextEnabled = false;

                    $scope.$watch('items', setupPages);
                }

                init();

                $scope.changePagination = function (pageNumber) {
                    $scope.currentPage = pageNumber;
                    $scope.changePage({ pageNumber: (pageNumber - 1) });
                };

                $scope.changePaginationGroupPrevious = function () {
                    var currentGroup = getCurrentGroup();
                    currentGroup--;
                    $scope.currentPage = ((currentGroup) * $scope.pagesPerGroup) + 1;
                    $scope.changePage({ pageNumber: ($scope.currentPage - 1) });

                    setupPages();
                };

                $scope.changePaginationGroupNext = function () {
                    var currentGroup = getCurrentGroup();
                    $scope.currentPage = ((currentGroup + 1) * $scope.pagesPerGroup) + 1;
                    $scope.changePage({ pageNumber: ($scope.currentPage - 1) });

                    setupPages();
                };

                function setupPages() {
                    if (!$scope.items) {
                        $scope.paginationVisible = false;
                        return;
                    }

                    $scope.paginationVisible = true;
                    var cantPageGroups = parseInt($scope.items.pagination.total_count / $scope.items.pagination.count);

                    var currentGroup = getCurrentGroup();
                    var startPage = (currentGroup * $scope.pagesPerGroup) + 1,
                        endPage = startPage + $scope.pagesPerGroup;

                    $scope.pages = [];
                    $scope.previousEnabled = (currentGroup !== 0);
                    $scope.nextEnabled = true;

                    for (var i = startPage; i < endPage; i++) {
                        if (i < cantPageGroups) {
                            var page = {
                                number: i,
                                active: (i === $scope.currentPage)
                            };

                            $scope.pages.push(page);
                        }
                        else {
                            $scope.nextEnabled = false;
                            break;
                        }
                    }

                    console.log($scope.pages);
                }

                function getCurrentGroup(){
                    return parseInt(($scope.currentPage - 1) / $scope.pagesPerGroup);
                }
            }],
            template: '<div class="row">' +
            '    <div class="col-md-4" ng-repeat="item in items.images">' +
            '        <img ng-src="{{item}}" class="img-responsive" alt="Responsive image">' +
            '    </div>' +
            '</div>' +

            '<nav aria-label="Search results pages" ng-show="paginationVisible">' +
            '    <ul class="pagination">' +
            '        <li ng-class="{disabled: !previousEnabled}">' +
            '            <a href="#" aria-label="Previous" ng-click="previousEnabled && changePaginationGroupPrevious()">' +
            '                <span aria-hidden="true">&laquo;</span>' +
            '            </a>' +
            '        </li>' +
            '        <li ng-repeat="page in pages" ng-class="{active: page.active}">' +
            '           <a href="#" ng-click="changePagination(page.number)">{{page.number}}</a>' +
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
        .module('giphyasm.search')
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