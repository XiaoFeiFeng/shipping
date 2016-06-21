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

                $scope.openDetail = function (key) {
                    $state.go('module', {
                        'module': 'order',
                        'action': 'detail',
                        'params': 'key=' + key
                    });
                }

                $scope.getDate = function (tick) {
                    return $data.getDate(tick);
                }

                $scope.test = function () {
                    var data = {};
                    data.uid = $scope.userInfo._id.$id;
                    data.data = "您有一条订单需要处理";
                    data.tid = "56dd47b6096a81580b000029";
                    data.type = "order";

                    $request.post('api/?model=notification&action=create',
                        data,
                        function (response) {
                            if (response.success) {
                                $ui.notify('添加成功，是否继续添加?', '提示',
                                    function () {

                                    })
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
            }])
})