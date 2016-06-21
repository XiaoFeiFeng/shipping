/**
 * Created by admin on 2016/4/22.
 */

'use strict'
define([], function () {
    angular.module('newsNoticeModule', [])
        .controller('newsNoticeCtrl', ['$scope', '$request', '$ui','$state', function ($scope, $request, $ui,$state) {
            $scope.type = 'notice';
            $scope.currentPage = 1;
            $scope.pageSize = 10;
            $scope.gridOptions = {
                tableClass: "table table-bordered table-striped table-hover",
                data: [],
                cols: [
                    {FieldName: 'title', DisplayName: '产品名'}
                ],
                colsOpr: {
                    headName: '操作',
                    headClass: '',
                    init: {
                        showEdit: true,
                        editTitle: "编辑",
                        editIcon: "fa fa-edit text-primary",
                        editFn: function (data) {
                            $state.go('module', {
                                'module': 'news',
                                'action': 'add',
                                'params': 'id='+data._id.$id+'&type='+data.type
                            });
                        },

                        showDelete: true,
                        delTitle: "删除",
                        delIcon: "fa fa-remove text-danger",
                        delFn: function (data) {
                            $ui.confirm('确认删除？', '确认', function () {
                                $scope.del(data._id.$id);
                            }, function () {

                            });
                        }

                    }

                },
                colsChk: {
                    checkAllChange: function () {
                    },
                    rowCheckChange: function (data) {
                    },
                    keyName: 'ID',
                    data: [],
                },
                rowOpr: {
                    rowSelected: function (data) {
                    },
                },
                colsHidden: [],
            }

            $scope.pageChange = function () {
                $scope.init();
            }

            $scope.add = function(){
                $state.go('module', {
                    'module': 'news',
                    'action': 'add',
                    'params': 'type='+$scope.type
                });
            }

            $scope.del = function (id) {
                $request.get('api/?model=news&action=remove_one_news&id=' + id,
                    function (response) {
                        if (response.success) {
                            $scope.init();
                        } else if (angular.isUndefined(response.success)) {
                            $ui.error(response);
                        } else {
                            $ui.error(response.error);
                        }
                    }, function (err) {
                        $ui.error(err);
                    });
            }

            $scope.init = function(){
                $request.get('api/?model=news&action=get_all_news&type='+$scope.type+'&pi=' + $scope.currentPage + '&ps=' + $scope.pageSize,
                    function (response) {
                        if (response.success) {
                            $scope.gridOptions.data = response.data;
                            $scope.totalItems = response.count;
                        } else if (angular.isUndefined(response.success)) {
                            $ui.error(response);
                        } else {
                            $ui.error(response.error);
                        }
                    }, function (err) {
                        $ui.error(err);
                    });
            }
            $scope.init();
        }])
})