/**
 * Created by admin on 2016/4/19.
 */
"use strict";

'use strict'
define([], function () {
    angular.module('articleIndexModule', [])
        .controller('articleIndexCtrl', ['$scope', '$request', '$ui', '$location', function ($scope, $request, $ui, $location) {

            $scope.currentPage = 1;
            $scope.pageSize = 10;
            $scope.gridOptions = {
                tableClass: "table table-bordered table-striped table-hover",
                data: [],
                cols: [
                    {FieldName: 'title', DisplayName: '文章名'}
                ],
                colsOpr: {
                    headName: '操作',
                    headClass: '',
                    init: {
                        showEdit: true,
                        editTitle: "编辑",
                        editIcon: "fa fa-edit text-primary",
                        editFn: function (data) {
                            $location.url('/article/edit?id=' + data._id.$id);
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
                colsChk: {//if not need checkbox,undefined this
                    //rowCheckname: 'checked',//if undefined,use default name
                    checkAllChange: function () {
                    },
                    rowCheckChange: function (data) {
                    },
                    keyName: 'ID',//if not get selected data.undefined
                    data: [],//if not get selected data.undefined
                },
                rowOpr: {
                    rowSelected: function (data) {
                        //alert("row selected");
                    },
                },
                colsHidden: [],
            }

            $scope.pageChange = function () {
                $scope.init();
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

            $scope.init = function () {
                $request.get('api/?model=news&action=get_all_news&type=notice&pi=' + $scope.currentPage + '&ps=' + $scope.pageSize,
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