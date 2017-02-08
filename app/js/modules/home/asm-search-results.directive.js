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