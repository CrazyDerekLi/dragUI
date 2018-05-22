require.config({
    paths:{
        'base':composerBasePath+'base'
    }
});
define(['base'], function(base){
    var classname = "chart_zhexiantu";
    var classTitle = "折线图";
    var classIcon = basePath+"image/zhexiantu.png";
    function o(options){
        var o1 = {
            id:"",
            layout:{						    //		公共布局属性
                l:0,							//		left
                t:0,							//		top
                w:100,							//		宽度
                h:100,							//		高度
                index:10,						//		布局位置（层级/顺序）
                layoutid:''						//		容器id
            },
            property:{							//		属性参数
                style:{},						//		样式属性
                private:{
                    a:3
                },						//		私有属性
                event:{},						//		事件属性
                data:{}							//		数据属性
            },
            createComposer:function(){
                return $("<div>").css({
                    width:this.layout.w,
                    height:this.layout.h
                });
            },		//		创建控件Dom
            bindEvent:function(){},				//		给控件绑定事件
            initSelfProperty:function(){			//		初始化控件属性

            },
            saveProperty:function(){},			//		保存控件属性

            setData:function(data){},			//		设置控件数据
            getData:function(){},				//		提取控件数据
            setValue:function(value){},			//		控件赋值
            getValue:function(){},				//		控件取值
            afterDrag:function(){},						//		拖拽结束事件
            afterResize:function(){}						//		调整列宽结束事件
        };
        o1 = $.extend({},base, o1);
        //因为这里获取不到类属性，因此在这里重新做了赋值
        options.classname = classname;
        options.classTitle = classTitle;
        options.classIcon = classIcon;

        o1.init(options);

        return o1;
    }
    //拖拽列表用到的属性，属于类属性
    o.classname = classname;
    o.classTitle = classTitle;
    o.classIcon = classIcon;
    return o;
});