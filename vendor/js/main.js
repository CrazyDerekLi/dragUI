require.config({
    baseUrl: vendorPath,
    urlArgs:'v='+(new Date()).getTime(),
    paths:{
        'css':'js/css.min',
        'jquery':"js/jquery-1.12.4.min",
        'jqueryui':"js/jquery-ui-1.12.1/jquery-ui.min",
        'bootstrap':'js/bootstrap-3.3.7/js/bootstrap.min',
        'bootstrapTable':'js/bootstrap-table-1.12.1/bootstrap-table.min',
        'colorPicker':'js/colorpicker/js/colorpicker',
        'bootstrapTable_zh':'js/bootstrap-table-1.12.1/locale/bootstrap-table-zh-CN.min'
    },
    shim:{
        'jqueryui':{
            deps: ['jquery','css!js/jquery-ui-1.12.1/jquery-ui.min'],
            exports:'jqueryui'
        },
        'bootstrap':{
            deps: ['jquery','css!js/bootstrap-3.3.7/css/bootstrap.min'],
            exports:'bootstrap'
        },
        'bootstrapTable':{
            deps: ['bootstrap','css!js/bootstrap-table-1.12.1/bootstrap-table.min'],
            exports:'bootstrapTable'
        },
        'bootstrapTable_zh':{
            deps:['bootstrapTable'],
            exports:'bootstrapTable_zh'
        },
        'colorPicker':{
            deps: ['jquery','css!js/colorpicker/css/colorpicker'],
            exports:'colorPicker'
        }

    }
});