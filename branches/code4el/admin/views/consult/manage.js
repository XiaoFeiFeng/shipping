/**
 * Created by admin on 2016/4/29.
 */
'use strict'
define([], function () {
    angular.module('consultManageModule', [])
        .controller('consultManageCtrl', ['$scope', '$request', '$ui', '$state', function ($scope, $request, $ui, $state) {
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
                            $scope.classifyBtn = '修改';
                            $scope.contactName = data.name;
                            $scope.contactQQ = data.link;
                            $scope.pid = data._id.$id;
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
                $scope.id = classify._id.$id;
                $scope.pitchonName = classify.name;
                $scope.querySubclass();

            }


            $scope.addProduct = function () {
                var data = {};
                data.name = $scope.contactName;
                data.link = $scope.contactQQ;
                if($scope.classifyBtn == '添加'){
                    data.pid = $scope.id;
                    data.type = 'qq';
                    var notify = '添加成功！';
                    var id = "";
                }else{
                    var id = '&id='+$scope.pid;
                    var notify = '修改成功！';
                }

                if($scope.contactName &&  $scope.contactQQ){
                    $request.post('api/?model=consult&action=edit_consult'+id,data ,
                        function (response) {
                            if (response.success) {
                                $ui.notify(notify, '提示', function () {
                                    if(notify == '修改成功！'){
                                        $scope.classifyBtn = "添加";
                                    }
                                    $scope.contactName ="";
                                    $scope.contactQQ ="";
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
                    $ui.error('内容不能为空', '错误', function () {

                    });
                }
            }

            $scope.del = function (id) {
                $request.get('api/?model=consult&action=remove_consult&id='+id,
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
                $request.get('api/?model=consult&action=custom_query&key=pid&value='+$scope.id,
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
                $request.get('api/?model=consult&action=custom_query&key=type&value=grouping',
                    function (response) {
                        if (response.success) {
                            $scope.classifys = response.data;
                            $scope.id = $scope.classifys[0]._id.$id;
                            $scope.pitchonName = $scope.classifys[0].name;
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
