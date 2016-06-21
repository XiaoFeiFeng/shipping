'use strict'
define([], function () {
    angular.module('channellistModule', [])
        .controller("channellistCtrl", ['$scope', '$ui', '$validate', '$request',
            function ($scope, $ui, $validate, $request) {

                $request.get(
                    'api/?model=logistic&action=getTransportWayList',
                    function (response) {
                        $scope.channels = response;
                    }, function (err) {
                    }
                );
            }
        ])
})