/**
 * Created by fengxiaofei on 2015/12/9.
 */



define(['hls-ui'], function () {
    angular.module('quoteSearchModule', ['hls.ui'])
        .controller("quoteSearchCtrl", ['$scope', '$ui', 'validateService', function ($scope, $ui, validateService) {

            $scope.countryData = {selectedData: {}};
            $scope.weight = "";


            $scope.gotoList = function () {
                if (validateService.isEmpty($scope.weight)) {
                    $scope.weight = 0.1;
                }
                var path = "/quote/list";
                var data = {
                    'countryData': $scope.countryData,
                    'weight': $scope.weight
                }

                $ui.locatePartWithData(path, data);
            }

        }])
})