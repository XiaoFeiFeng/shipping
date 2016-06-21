/**
 * Created by fengxiaofei on 2015/12/17.
 */

'use strict'
define([], function () {
    angular.module('homeIndexModule', [])
        .controller("homeIndexCtrl", ['$scope', '$ui', function ($scope, $ui) {
            $(function () {
                $('#hlsBanner').carousel();
            })
        }])
})