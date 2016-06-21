/**
 * Created by Administrator on 2016/3/18.
 */

'use strict'
define([], function () {
    angular.module('newsIndexModule', [])
        .controller('newsIndexCtrl', ['$scope', '$request', '$ui', '$location', function ($scope, $request, $ui, $location) {
            $scope.obj = {};
            $scope.currentPage = 1;
            $scope.pageSize = 10;
            $scope.classifyBtn = "添加分类";
            $scope.gridOptions = {
                tableClass: "table table-bordered table-striped table-hover",
                data: [],
                cols: [
                    {FieldName: 'name', DisplayName: '产品名'}
                ],
                colsOpr: {
                    headName: '操作',
                    headClass: '',
                    init: {
                        showEdit: true,
                        editTitle: "编辑",
                        editIcon: "fa fa-edit text-primary",
                        editFn: function (data) {
                            $scope.classify = data.name;
                            $scope.classifyBtn = "确认修改"
                            delete data.$$hashKey;
                            delete data.$checked;
                            $scope.obj = data;
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
            //添加分类
            $scope.addProduct = function(){
                if($scope.classifyBtn == '添加分类'){
                    //判断当前分类是否大于5个
                    if($scope.totalItems >= 5){
                        $ui.error('分类已满', '错误', function () {

                                        });
                        return;
                    }
                    $scope.obj.type = "parent";
                    var notify = '添加成功！';
                    var id = "";
                }else{
                    var id = '&id='+$scope.obj._id.$id;
                    var notify = '修改成功！';
                }
                $scope.obj.name = $scope.classify;

                if($scope.classify){
                        $request.post('api/?model=news&action=add_classify'+id,$scope.obj ,
                                            function (response) {
                                                if (response.success) {
                                                      $ui.notify(notify, '提示', function () {
                                                          if(notify == '修改成功！'){
                                                              $scope.classifyBtn = "添加分类";
                                                          }
                                                          $scope.classify = "";
                                                          $scope.obj = {};
                                                          $scope.init();
                                                                      });
                                                } else if (angular.isUndefined(response.success)) {
                                                    $ui.error(response);
                                                } else {
                                                    $ui.error(response.error);
                                                }

                                            }, function (err) {
                                                $ui.error(err);
                                            });
                }else{
                    $ui.error('请输入分类名称', '错误', function () {
                                        
                                    });
                }
            }

            $scope.del = function (id) {
                $request.get('api/?model=news&action=remove_one_classify&id=' + id,
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
                $request.get('api/?model=news&action=get_classify&type=parent&pi=' + $scope.currentPage + '&ps=' + $scope.pageSize,
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


            $scope.cancel = function(){
                $scope.classifyBtn = "添加分类";
                $scope.classify = "";
            }
        }])
})
