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