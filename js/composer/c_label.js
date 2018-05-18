require.config({
    paths:{
        'base':'js/composer/base',
        'util':'js/composer/util'
    }
});
define(['base','util'], function(base,util){
    var classname = "c_label";
    var classTitle = "标签";
    var classIcon = "image/biaoqian.png";
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
                style:{
                    fontColor:"#ccc",
                    fontSize:12,
                    hasBackground:"0",
                    background:"#ffffff",
                    textAlign:"left"
                },						//		样式属性
                private:{
                    id:"",
                    info:"标签"
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
                                {value:"",type:"spinner",field:["layout","index"],title:"层级"},
                            ]
                        },
                        {
                            childGroupName:"私有属性",
                            childGroupList:[
                                {value:"",type:"text",field:["property","private","id"],title:"id"},
                                {value:"",type:"text",field:["property","private","info"],title:"标签文本"},
                            ]
                        }
                    ]
                },
                {
                    groupName:"样式",groupList:[
                        {
                            childGroupName:"样式设置",
                            childGroupList:[
                                {value:"",type:"color",field:["property","style","fontColor"],title:"字体颜色"},
                                {value:"",type:"spinner",field:["property","style","fontSize"],title:"字体大小"},
                                {value:"",type:"checkbox",field:["property","style","hasBackground"],title:"使用背景"},
                                {value:"",type:"color",field:["property","style","background"],title:"背景色"},
                                {value:"",type:"self",field:["property","style","textAlign"],title:"对齐方式",editor:function(box,setting,composer){
                                        var left = $('<div class="property_btn">居左</div>');
                                        var center = $('<div class="property_btn">居中</div>');
                                        var right = $('<div class="property_btn">居右</div>');
                                        box.append(left).append(center).append(right);
                                        var val = util.getComposerValue(setting.field,composer);
                                        if(val == "left"){
                                            left.addClass("selected");
                                        }else if(val == "center"){
                                            center.addClass("selected");
                                        }else if(val == "right"){
                                            right.addClass("selected");
                                        }
                                        var clickHandle = function(obj,value){
                                            obj.parent().find(".property_btn").removeClass("selected");
                                            obj.addClass("selected");
                                            util.editorChangeData(setting,composer,value);
                                        }
                                        left.click(function(){
                                            clickHandle($(this),"left");
                                        });
                                        center.click(function(){
                                            clickHandle($(this),"center");
                                        });
                                        right.click(function(){
                                            clickHandle($(this),"right");
                                        });

                                    }}
                            ]
                        }
                    ]
                }
            ],
            createComposer:function(){
                var label = $("<label>").css({
                    color:this.property.style.fontColor,
                    "font-size":this.property.style.fontSize+"px",
                    "text-align":this.property.style.textAlign,
                    display:"block",
                    width:this.layout.w,
                    height:this.layout.h
                });
                if(this.property.style.hasBackground == "1"){
                    label.css({
                        background:this.property.style.background
                    });
                }
                label.html(this.property.private.info).attr("id",this.property.private.id);
                return label;
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