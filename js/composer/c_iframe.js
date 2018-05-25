require.config({
    paths:{
        'base':composerBasePath+'js/composer/base',
        'util':composerBasePath+'js/composer/util'
    }
});
define(['base','util'], function(base,util){
    var classname = "c_iframe";
    var classTitle = "引用页面控件";
    var classIcon = composerBasePath+"image/iframe.png";
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
                private:{
                    id:"",
                    src:"",
                    allowScroll:"1"
                },						//		私有属性
                event:{},						//		事件属性
                data:{}							//		数据属性
            },
            propertySetting:[
                {
                    groupName:"设置",groupList:[
                        {
                            childGroupName:"布局属性",
                            childGroupList:[
                                {value:"",type:"spinner",field:["layout","l"],title:"左偏移"},
                                {value:"",type:"spinner",field:["layout","t"],title:"右偏移"},
                                {value:"",type:"spinner",field:["layout","w"],title:"宽度"},
                                {value:"",type:"spinner",field:["layout","h"],title:"高度"},
                                {value:"",type:"spinner",field:["layout","index"],title:"层级"}
                            ]
                        },
                        {
                            childGroupName:"私有属性",
                            childGroupList:[
                                {value:"",type:"text",field:["property","private","id"],title:"id"},
                                {value:"",type:"text",field:["property","private","src"],title:"引用路径"},
                                {value:"",type:"checkbox",field:["property","private","allowScroll"],title:"允许滚动"}
                            ]
                        }
                    ]
                }
            ],
            createComposer:function(){
                var iframe = $('<iframe  frameborder="no" border="0" marginwidth="0" marginheight="0" allowtransparency="yes" >').css({
                    display:"block",
                    width:this.layout.w,
                    height:this.layout.h
                });
                if(this.property.private.allowScroll == "0"){
                    iframe.attr("scrolling","no");
                }
                iframe.attr("src",this.property.private.src).attr("id",this.property.private.id);
                return iframe;
            },		//		创建控件Dom
            bindEvent:function(){},				//		给控件绑定事件
            initSelfProperty:function(){			//		初始化控件属性

            },
            getTools:function(){
                var tools = [];
                var data = $("<i class='fa fa-database' title='数据'>");
                tools.push(data);
                return tools;
            },
            saveProperty:function(){},			//		保存控件属性

            setData:function(data){},			//		设置控件数据
            getData:function(){},				//		提取控件数据
            setValue:function(value){},			//		控件赋值
            getValue:function(){},				//		控件取值
            afterDrag:function(){},						//		拖拽结束事件
            afterResize:function(composer){
                composer.css({
                    width:this.layout.w,
                    height:this.layout.h
                });
            }						//		调整列宽结束事件
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