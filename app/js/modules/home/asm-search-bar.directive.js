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