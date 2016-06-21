'use strict'
define([], function () {
    angular.module('newsClassifyModule', [])
        .controller('newsClassifyCtrl', ['$scope', '$request', '$ui', '$state', function ($scope, $request, $ui, $state) {
            $scope.classifyBtn = "添加";
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
                            $scope.classifyBtn = '修改产品名';
                            $scope.subclassName = data.name;
                            $scope.pid = data._id.$id;
                            $scope.oName  = data.name;
                            $scope.edit = true;
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
            //改变按钮状态
            $scope.changeState = function (classify) {
                $scope.subclassName = "";
                $scope.id = classify._id.$id;
                $scope.querySubclass();

            }

            $scope.editProduct = function(){
                $state.go('module', {
                    'module': 'news',
                    'action': 'editsubclass',
                    'params': 'pid='+$scope.pid
                });
            }

            $scope.addProduct = function () {
                var data = {};
                data.name = $scope.subclassName;
                if($scope.classifyBtn == '添加'){
                    data.pid = $scope.id;
                    data.type = 'subclass';
                    var notify = '添加成功！';
                    var id = "";
                }else{
                    if(data.name == $scope.oName){
                        $ui.error('产品名不能重复', '错误', function () {
                                            
                                        });
                        return;
                    }
                    var id = '&id='+$scope.pid;
                    var notify = '修改成功！';
                }

                if($scope.subclassName){
                    $request.post('api/?model=news&action=add_classify'+id,data ,
                        function (response) {
                            if (response.success) {
                                $ui.notify(notify, '提示', function () {
                                    if(notify == '修改成功！'){
                                        $scope.classifyBtn = "添加分类";
                                    }
                                    $scope.subclassName ="";
                                    $scope.querySubclass();
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
                    $ui.error('请输入子分类名称', '错误', function () {

                    });
                }
            }

            $scope.del = function (id) {
                 $request.get('api/?model=news&action=del_product&id='+id,
                                     function (response) {
                                         if (response.success) {
                                             $scope.querySubclass();
                                         } else if (angular.isUndefined(response.success)) {
                                             $ui.error(response);
                                         } else {
                                             $ui.error(response.error);
                                         }
                                     }, function (err) {
                                         $ui.error(err);
                                     });
            }

            $scope.querySubclass =function(){
                //查询父类对应下面的子类
                $request.get('api/?model=news&action=custom_query&key=pid&value='+$scope.id,
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

            $scope.init = function () {
                //查询父类
                $request.get('api/?model=news&action=get_classify&type=parent',
                    function (response) {
                        if (response.success) {
                            $scope.classifys = response.data;
                            $scope.id = $scope.classifys[0]._id.$id;
                            $scope.querySubclass();
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
