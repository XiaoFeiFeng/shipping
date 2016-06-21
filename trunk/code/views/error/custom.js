/**
 * Created by fengxiaofei on 2016/4/6.
 */

"use strict";
define([], function () {
    angular.module('errorCustomModule', [])
        .controller('errorCustomCtrl', ['$scope', '$data', '$ui',
            function ($scope, $data, $ui) {


                var data = $ui.getKeyByUrl();

                $scope.msg = decodeURIComponent(data.msg);

            }])
});