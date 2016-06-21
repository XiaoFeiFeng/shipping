'use strict'
define([], function () {
    angular.module('erpHelpArticleModule', [])
        .controller("erpHelpArticleCtrl", ['$scope', '$ui', '$request', '$validate', '$filter','$location', function ($scope, $ui, $request, $validate, $filter,$location) {



            $scope.currentCategory = "";

            $scope.currentPage = 1;
            $scope.pageSize = 10;

            $scope.gridOptions = {
                data: [],
                cols: [
                    {FieldName: 'title', DisplayName: '文章名'}
                ],
                colsOpr: {
                    headName: '操作',
                    headClass: '',
                    init: {
                        showEdit: true,
                        editFn: function (data) {
                            $location.url('/erp/addHelpArticle?operator=edit&id='+data._id.$id);
                        },
                        showDelete: true,
                        delFn: function (data) {
                            $ui.confirm("确认删除？", "确认", function () {
                                $scope.del(data._id.$id);
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
                    keyName: '_id',//if not get selected data.undefined
                    data: [],//if not get selected data.undefined
                },
                rowOpr: {
                    rowSelected: function (data) {
                        //alert("row selected");
                    },
                },
                colsHidden: [],
            }

            $scope.initGridData = function (type) {
                $request.get('api/?model=erp&action=help_article_list&id=' + type._id.$id + '&pi=' + $scope.currentPage + '&ps=' + $scope.pageSize, function (response) {
                    if (response.success) {
                        $scope.gridOptions.data = response.data;
                        $scope.totalItems = response.count;
                    } else if (angular.isUndefined(response.success)) {
                        $ui.error(response);
                    } else {
                        $ui.error(response.error);
                    }
                });

            }


            $scope.pageChange = function () {
                $scope.initGridData($scope.currentCategory);
            }

            $request.get('api/?model=erp&action=help_category_list', function (response) {
                $scope.articles = response.data;
            });


            $scope.getArticles = function (type) {
                $scope.currentCategory = type;
                $scope.initGridData(type);

            }

            $scope.add = function () {
                if ($validate.isEmpty($scope.currentCategory)) {
                    return;
                }
                $location.url('/erp/addHelpArticle?operator=add&category_id='+$scope.currentCategory._id.$id+'&name='+$scope.currentCategory.name);
            }

            $scope.del = function (id) {
                $request.get('api/?model=erp&action=del_article&id=' + id, function (response) {
                    $scope.initGridData($scope.currentCategory);
                });
            }

            $scope.isAdd = false;

            $scope.selectChannel = function () {
                console.log($scope.isAdd);
                $scope.isAdd = !$scope.isAdd;
            }

        }])
})