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