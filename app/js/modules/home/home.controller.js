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