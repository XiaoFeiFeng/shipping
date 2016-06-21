'use strict'
define(['select2', 'ng-ueditor'], function () {

    var app = angular.module('supplierModule', ['ngTable', 'ngAnimate', 'ng.ueditor', 'ngSanitize']);

    app.constant("HOSTNAME", "http://s1.93myb.com:8090/");
    app.controller('MainCtrl', function ($scope) {
        $scope.page = 'addCategory.html';
        $scope.tabs = {
            tabName: ['添加分类', '添加产品', '修改商品价格', '添加产品图片', '添加供应商', '添加产品描述'],
            templateUrls: ['addCategory.html', 'addProduct.html', 'addProductPrice.html', 'addPorductPic.html', 'addSupplier.html', 'addProductDesc.html']
        };
    })
        .controller('AddCategoryFormCtrl', ['$scope', '$http', '$ui', 'HOSTNAME', function ($scope, $http, $ui, HOSTNAME) {
            $scope.getParentIds = function () {
                $http({
                    method: 'GET',
                    url: HOSTNAME + 'selects/supplier/categorys'
                }).success(function (response, status, headers, config) {
                    $scope.parentIds = response.list;
                });
            }

            $scope.getParentIds();

            $scope.submitFlag = true;

            $scope.reset = function () {
                $scope.submitFlag = true;
            }

            $scope.$watch('model', function (newValue) {
                if (newValue != undefined) {
                    if (!!newValue.name)
                        $scope.submitFlag = false;
                    else
                        $scope.submitFlag = true;
                }
            }, true);

            $scope.submitForm = function () {
                var datas = {};
                datas.name = $scope.model.name;
                if (!!$scope.model.parent_id)
                    datas.parent_id = $scope.model.parent_id._id;

                $.ajax({
                    type: 'POST',
                    url: HOSTNAME + 'adds/supplier/categorys',
                    data: datas,
                    dataType: 'html',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    success: function (data) {
                        if (data == 'OK') {
                            $ui.notify('添加成功', '提示');
                            $scope.model = {};
                            $scope.getParentIds();
                        }
                    }
                })
            }

        }])
        .controller('AddProductFormCtrl', ['$scope', '$http', '$ui', 'HOSTNAME', 'fileReader', function ($scope, $http, $ui, HOSTNAME, fileReader) {
            $scope.getParentIds = function () {
                $http({
                    method: 'GET',
                    url: HOSTNAME + 'selects/supplier/categorys'
                }).success(function (response, status, headers, config) {
                    $scope.parentIds = response.list;
                });
            }

            $scope.getParentIds();

            $scope.submitFlag = true;

            $scope.reset = function () {
                $scope.submitFlag = true;
            }

            $scope.$watch('model', function (newValue) {
                if (newValue != undefined) {
                    if (newValue.parent_id && newValue.title)
                        $scope.submitFlag = false;
                    else
                        $scope.submitFlag = true;
                }
            }, true);

            $scope.submitForm = function () {

                $.ajax({
                    type: 'POST',
                    url: 'http://s1.93myb.com/supplier/addProduct.php',
                    data: {
                        "category_id": $scope.model.parent_id._id,
                        "title": $scope.model.title,
                        "code": $scope.model.code || "''",
                        "purchase_price": $scope.model.purchase_price || 0,
                        "unit_price": $scope.model.unit_price || 0,
                        "lower_price": $scope.model.lower_price || 0,
                        "productId": $scope.model.productId,
                        "description": $scope.model.description || "''",
                        "template_base": $scope.imageSrc,
                        "type": !!$scope.file ? $scope.file[0].type : null,
                        "size": !!$scope.file ? $scope.file[0].size : null
                    },
                    dataType: 'json',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    success: function (data) {
                        $.ajax({
                            type: 'POST',
                            url: HOSTNAME + 'productAdd/supplier/products',
                            data: data,
                            dataType: 'html',
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            success: function (data) {
                                if (data == 'OK') {
                                    $ui.notify('添加成功', '提示');
                                    $scope.model = {};
                                    $scope.getParentIds();
                                    $scope.imageSrc = null;
                                }
                            }
                        })
                    }
                })
            }

            $scope.getFile = function () {
                fileReader
                    .readAsDataUrl($scope.file[0], $scope)
                    .then(function (result) {
                        $scope.imageSrc = result;
                    });
            };

        }])
        .controller('AddPorductPicCtrl', ['$scope', '$http', '$ui', 'HOSTNAME', 'fileReader', function ($scope, $http, $ui, HOSTNAME, fileReader) {

            $scope.getProducts = function () {
                $http({
                    url: HOSTNAME + 'selects/supplier/products'
                }).success(function (response, status, headers, config) {
                    $scope.products = response.list;
                })
            }
            $scope.getProducts();

            $scope.reset = function () {
                $scope.imageSrcs = [];
            }

            $scope.submitFlag = true;

            $scope.$watch('model', function (newValue) {
                if (newValue != undefined) {
                    if (newValue.product)
                        $scope.submitFlag = false;
                    else
                        $scope.submitFlag = true;
                }
            }, true);

            $scope.imageSrcs = [];

            $scope.submitForm = function () {
                var imageInfo = [];
                for (var i = 0; i < $scope.file.length; i++) {
                    imageInfo.push({
                        "type": $scope.file[i].type,
                        "size": $scope.file[i].size
                    });
                }

                $.ajax({
                    type: 'POST',
                    url: 'http://s1.93myb.com/supplier/postImages.php',
                    data: {
                        "product_id": $scope.model.product,
                        "template_base": $scope.imageSrcs,
                        "imageInfo": imageInfo
                    },
                    dataType: 'json',
                    success: function (data) {
                        $.ajax({
                            type: 'POST',
                            url: HOSTNAME + 'proMoreFile',
                            data: data,
                            dateType: 'html',
                            success: function (data) {
                                if (data == 'OK') {
                                    $ui.notify('添加成功', '提示');
                                    $scope.model = {};
                                    $scope.getProducts();
                                    $scope.imageSrcs = [];
                                }
                            }
                        })
                    }
                })

            }

            $scope.getFile = function () {

                for (var i = 0; i < $scope.file.length; i++) {
                    fileReader
                        .readAsDataUrl($scope.file[i], $scope)
                        .then(function (result) {
                            $scope.imageSrcs.push(result);
                        });
                }
            };

        }])
        .controller('AddSupplierFormCtrl', ['$scope', '$http', '$ui', 'HOSTNAME', function ($scope, $http, $ui, HOSTNAME) {

            $scope.getProducts = function () {
                $http({
                    url: HOSTNAME + 'selects/supplier/products'
                }).success(function (response, status, headers, config) {
                    $scope.products = response.list;
                })
            }
            $scope.getProducts();

            $scope.submitFlag = true;

            $scope.reset = function () {
                $scope.submitFlag = true;
            }

            $scope.$watch('model', function (newValue) {
                if (newValue != undefined) {
                    if (!!newValue.name && !!newValue.tel && !!newValue.product)
                        $scope.submitFlag = false;
                    else
                        $scope.submitFlag = true;
                }
            }, true);

            $scope.submitForm = function () {
                $.ajax({
                    type: 'POST',
                    url: HOSTNAME + 'supplierAdd',
                    data: {
                        "name": $scope.model.name,
                        "tel": $scope.model.tel,
                        "productId": $scope.model.product,
                        "qq": $scope.model.qq || "''"
                    },
                    dataType: 'html',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    success: function (data) {
                        console.log(data);
                        if (data == 'OK') {
                            $ui.notify('添加成功', '提示');
                            $scope.model = {};
                        }
                    }
                })
            }
        }])
        .controller('AddProductDescFormCtrl', ['$scope', '$http', '$ui', 'HOSTNAME', function ($scope, $http, $ui, HOSTNAME) {
            $scope.model = {};

            $scope.ueditorConfig = {
                //toolbars:[['FullScreen', 'Source', 'Undo', 'Redo','Bold','test']],
                autoClearinitialContent: false,
                wordCount: true,
                elementPathEnabled: false,
                initialFrameHeight: 500
            }
            $scope.getParentIds = function () {
                $http({
                    method: 'GET',
                    url: HOSTNAME + 'selects/supplier/products'
                }).success(function (response, status, headers, config) {
                    $scope.products = response.list;
                });
            }

            $scope.syncDesc = function (product_id) {
                $scope.product_id = product_id;
                $http.get(HOSTNAME + 'findDetail/supplier/descs?product_id=' + product_id)
                    .success(function (response, status, headers, config) {

                    });
            }

            $scope.editor_num = 0;
            $scope.editor = {};

            $scope.ready = function (editor) {
                if ($scope.editor_num == 0) {
                    $scope.editor = editor;
                } else {
                    $http.get(HOSTNAME + 'findDetail/supplier/descs?product_id=' + editor)
                        .success(function (response, status, headers, config) {
                            $scope.editor.setContent(response.list.cn_desc);
                        })
                }
                $scope.editor_num++;
            }

            $scope.getParentIds();

            $scope.submitFlag = true;

            $scope.reset = function () {
                $scope.submitFlag = true;
            }

            $scope.$watch('model', function (newValue) {
                if (newValue != undefined) {
                    if (newValue.product && newValue.ce_desc || newValue.en_desc)
                        $scope.submitFlag = false;
                    else
                        $scope.submitFlag = true;
                }
            }, true);

            $scope.submitForm = function () {
                console.log($scope.model);
                $.ajax({
                    type: 'POST',
                    url: HOSTNAME + 'adds/supplier/descs',
                    data: {
                        "product_id": $scope.model.product,
                        "en_desc": $scope.model.en_desc || '',
                        "cn_desc": $scope.model.cn_desc || ''
                    },
                    dataType: 'html',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    success: function (data) {
                        if (data == 'OK') {
                            $ui.notify('添加成功', '提示');
                            $scope.model = {};
                        }
                    }
                })
            }

        }])
        .controller('addProductPriceFormCtrl', ['$scope', '$http', '$ui', 'HOSTNAME', 'fileReader', function ($scope, $http, $ui, HOSTNAME, fileReader) {

            $scope.getParentIds = function () {
                $http({
                    method: 'GET',
                    url: HOSTNAME + 'selects/supplier/products'
                }).success(function (response, status, headers, config) {
                    $scope.products = response.list;
                });
            }

            $scope.getParentIds();

            $scope.submitFlag = true;

            $scope.reset = function () {
                $scope.submitFlag = true;
            }

            $scope.getOneInfo = function () {
                for (var i in $scope.products) {
                    if ($scope.products[i]['_id'] == $scope.model.product) {
                        $scope.model.purchase_price = $scope.products[i]['purchase_price'];
                        $scope.model.unit_price = $scope.products[i]['unit_price'];
                        $scope.model.lower_price = $scope.products[i]['lower_price'];
                    }
                }
            }

            $scope.$watch('model', function (newValue) {
                if (newValue != undefined) {
                    if (newValue.product)
                        $scope.submitFlag = false;
                    else
                        $scope.submitFlag = true;
                }
            }, true);

            $scope.submitForm = function () {
                $.ajax({
                    type: 'POST',
                    url: HOSTNAME + 'productPrice/supplier/products',
                    data: {
                        "product_id": $scope.model.product,
                        "purchase_price": $scope.model.purchase_price || 0,
                        "unit_price": $scope.model.unit_price || 0,
                        "lower_price": $scope.model.lower_price || 0
                    },
                    dataType: 'html',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    success: function (data) {
                        if (data == 'OK') {
                            $ui.notify('添加成功', '提示');
                            $scope.model = {};
                        }
                    }
                })
            }

        }]);
    app.directive('myTab', function () {
        return {
            restrict: 'EA',
            replace: true,
            template: '<div>\
                            <ul class="nav nav-tabs">\
                            <li ng-repeat="tab in tabs.tabName" ng-class="{\'active\': $first}"><a href="#" ng-\click="setActive($index)">{{ tab }}</a></li>\
                            </ul>\
                            <div ng-include src="page"></div>\
                            </div>',
            controller: function ($scope) {
                $scope._index = 0;

                $scope.setActive = function (index) {
                    $scope._index = index;
                    $scope.page = $scope.tabs.templateUrls[index];
                }
            },
            link: function (scope, element, attrs) {
                $(element).on("click", function () {
                    $(element).find("li").removeClass("active").eq(scope._index).addClass("active");
                });
            }

        }
    }).directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, ngModel) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.on('change', function (event) {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files);
                    });
                    //附件预览
                    scope.file = (event.srcElement || event.target).files;
                    scope.getFile();
                });
            }
        };

    }]).directive('plupload', ['pluploadServ', function (pluploadServ) {
        return {
            restrict: 'EA',
            link: function (scope, element, attrs) {
                var uploader = pluploadServ(scope.plupConf);

                uploader.bind('FilesAdded', function (uploader, files) {
                    for (var i = 0; i < files.length; i++) {
                        var html = '<li id="file-' + files[i].id + '"><p class="file-name">' + files[i].name + '</p><p class="progress"></p></li>';
                        $(html).appendTo(scope.plupConf.progressWrap);
                    }
                });

                if (scope.plupConf.progressFlag) {
                    uploader.bind('UploadProgress', function (uploader, file) {
                        $('#file-' + file.id + ' .progress').css('width', file.percent + '%');
                    });
                }

                $('#' + scope.plupConf.upload_button).on('click', function () {
                    uploader.start();
                });
            }
        }
    }]).directive('select2', function () {     //select下拉框
        return {
            restrict: 'A',
            scope: {
                config: '=',
                ngModel: '=',
                select2Model: '='
            },
            link: function (scope, element, attrs) {
                var tagName = element[0].tagName,
                    config = {
                        allowClear: true,
                        multiple: !!attrs.multiple,
                        placeholder: attrs.placeholder || ' '
                    };

                if (tagName === 'SELECT') {
                    var $element = $(element);
                    delete config.multiple;

                    $element
                        .prepend('<option value=""></option>')
                        .val('')
                        .select2(config);

                    scope.$watch('ngModel', function (newVal) {
                        setTimeout(function () {
                            $element.find('[value^="?"]').remove();
                            $element.select2('val', newVal);
                        }, 0);
                    }, true);
                    return false;
                }

                if (tagName === 'INPUT') {
                    var $element = $(element);

                    if (attrs.query) {
                        scope.config = select2Query[attrs.query]();
                    }

                    scope.$watch('config', function () {
                        angular.extend(config, scope.config);
                        $element.select2('destroy').select2(config);
                    }, true);

                    $element.on('change', function () {
                        scope.$apply(function () {
                            scope.select2Model = $element.select2('data');
                        });
                    });

                    scope.$watch('select2Model', function (newVal) {
                        $element.select2('data', newVal);
                    }, true);

                    scope.$watch('ngModel', function (newVal) {

                        if (config.ajax || config.multiple) {
                            return false
                        }

                        $element.select2('val', newVal);
                    }, true);
                }
            }
        }
    })
    app.factory('fileReader', ["$q", "$log", function ($q, $log) {
        var onLoad = function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.resolve(reader.result);
                });
            };
        };
        var onError = function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.reject(reader.result);
                });
            };
        };
        var getReader = function (deferred, scope) {
            var reader = new FileReader();
            reader.onload = onLoad(reader, deferred, scope);
            reader.onerror = onError(reader, deferred, scope);
            return reader;
        };
        var readAsDataURL = function (file, scope) {
            var deferred = $q.defer();
            var reader = getReader(deferred, scope);
            reader.readAsDataURL(file);
            return deferred.promise;
        };
        return {
            readAsDataUrl: readAsDataURL
        };
    }]).factory('pluploadServ', function () {
        return function (config) {
            var uploader = new plupload.Uploader(config);
            uploader.init();

            return uploader;
        }
    });
})