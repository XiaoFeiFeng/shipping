/**
 * Created by fengxiaofei on 2016/3/11.
 */

define([], function () {
    angular.module("notifyIndexModule", [])
        .controller('notifyIndexCtrl', ['$scope', '$request', '$store', '$ui', '$data', '$rootScope', '$state',
            function ($scope, $request, $store, $ui, $data, $rootScope, $state) {

                $scope.userInfo = $store.getUserInfo();

                if (!$rootScope.logined) {
                    $ui.locateLogin();
                }

                $scope.getDate = function (tick) {
                    return $data.getDate(tick);
                }

                $scope.jumptopage = function (notify) {

                    var url = "";
                    switch (notify.type) {
                        case "myorder":
                            url = "#/order/detail?id=" + notify.tid;
                            break;
                        case "clientorder":
                            url = "#/order/clientorder?code=" + notify.tid;
                            break;
                    }

                    $ui.locate(url);
                }

                $scope.test = function () {
                    var data = {};
                    data.uid = $scope.userInfo._id.$id;
                    data.data = "您有一条订单有更新";
                    data.tid = "56d011ac096a81281f000029";
                    data.type = "myorder";

                    $request.post('api/?model=notification&action=create',
                        data,
                        function (response) {
                            if (response.success) {
                                $scope.getNotifications();
                            } else if (angular.isUndefined(response.success)) {
                                $ui.error(response);
                            } else {
                                $ui.error(response.error);
                            }

                        }, function (err) {
                            $ui.error('添加失败，' + err, '错误');
                        });
                }
                $scope.getNotifications = function () {

                    var paramStr = '&pi=1&ps=20'
                        + '&uid=' + $scope.userInfo._id.$id;

                    $request.get('api/?model=notification&action=get_byuser' + paramStr,
                        function (response) {
                            if (response.success) {
                                $scope.notifications = response.data;
                                $scope.totalItems = response.count;
                            } else if (angular.isUndefined(response.success)) {
                                $ui.error(response);
                            } else {
                                $ui.error(response.error);
                            }
                        });
                }

                $scope.getNotifications();
            }
        ])
})