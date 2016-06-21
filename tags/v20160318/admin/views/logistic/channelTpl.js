'use strict'
define([], function () {
    angular.module('logisticChannelTplModule', [])
        .controller("logisticChannelTplCtrl", ['$scope', '$ui', '$request', '$validate', '$filter', function ($scope, $ui, $request, $validate, $filter) {

            $scope.currentCategory = "";

            $scope.currentPage = 1;
            $scope.pageSize = 10;

            $scope.gridOptions = {
                data: [],
                cols: [
                    {FieldName: 'channel_name', DisplayName: '渠道名称',},
                    {FieldName: 'channel_code', DisplayName: '渠道编码',},
                    {FieldName: 'img', DisplayName: 'LOGO', Formatter: $scope.formatterImg}
                ],
                colsOpr: {
                    headName: '操作',
                    headClass: '',
                    init: {
                        showEdit: true,
                        editFn: function (data) {
                            $scope.edit(data);
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
                $request.get('api/?model=logistic&action=channelList&id=' + type._id.$id + '&pi=' + $scope.currentPage + '&ps=' + $scope.pageSize, function (response) {
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

            $request.get('api/?model=logistic&action=logisticList', function (response) {
                $scope.logistics = response.data;
            });


            $scope.getChannels = function (type) {
                $scope.currentCategory = type;
                $scope.initGridData(type);

            }

            $scope.add = function () {
                if ($validate.isEmpty($scope.currentCategory)) {
                    return;
                }
                var data = {
                    'operator': 'add',
                    'category': $scope.currentCategory
                }
                $ui.openWindow('views/logistic/addChannelTpl.html', 'logisticaddChannelTplCtrl', data, function (data) {
                    $scope.getChannels($scope.currentCategory);
                }, function (data) {
                });

            }
            $scope.edit = function (channel) {

                var data = {
                    'operator': 'edit',
                    'category': $scope.currentCategory,
                    'channel': channel
                }
                $ui.openWindow('views/logistic/addChannelTpl.html', 'logisticaddChannelTplCtrl', data, function (data) {
                    $scope.getChannels($scope.currentCategory);
                }, function (data) {

                });

            }
            $scope.del = function (id) {
                $request.get('api/?model=logistic&action=del_channel&id=' + id, function (response) {
                    $scope.initGridData($scope.currentCategory);
                });
            }

            $scope.isAdd = false;

            $scope.selectChannel = function () {
                console.log($scope.isAdd);
                $scope.isAdd = !$scope.isAdd;
            }


            /*$scope.getData = function () {

             $request.get('http://www.cpowersoft.com:8888/join/logistic/logistics_channel', function (response) {
             $scope.listData = response.list;

             $scope.tableParams = new ngTableParams({
             page: 1,
             count: 10,
             sorting: {
             channel_name: 'asc'
             }
             }, {
             total: $scope.listData.length,
             getData: function ($defer, params) {

             var orderedData = params.sorting() ?
             $filter('orderBy')($scope.listData, params.orderBy()) :
             $scope.listData;

             orderedData = params.filter ?
             $filter('filter')(orderedData, params.filter()) :
             orderedData;

             $scope.users = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

             params.total(orderedData.length);
             $defer.resolve($scope.users);
             }
             });
             }, function () {
             })
             }

             $scope.delData = function (id) {

             $request.getWithData('http://www.cpowersoft.com:8888/logist_del/logistic/logistics_channel',
             {id: id},
             function (response) {
             if (response == 'OK') {
             $ui.notify('添加成功', '提示');
             }
             $scope.getData();
             },
             function () {
             }
             );
             }

             $scope.getData();*/
        }])
})