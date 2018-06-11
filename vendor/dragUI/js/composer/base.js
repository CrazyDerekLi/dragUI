require.config({
});
define(["util"], function(util){

    var base = {
        designer:true,                      //设计模式（true）和生产模式（false）
        designerType:"absolute",            //控件设计类型
        box:'',                             //外层容器
        drag:undefined,                     //控件拖拽dom对象
        composer:undefined,                 //内嵌控件实现dom对象
        classname:"",                       //控件类型
        classTitle:"",                      //控件名称
        classIcon:"",                       //控件图标
        id:"",                              //控件id
        propertyBox:undefined,              //属性容器
        //布局属性
        layout:{						    //		公共布局属性
            l:0,							//		left
            t:0,							//		top
            w:100,							//		宽度
            h:20,							//		高度
            index:1,						//		布局位置（层级/顺序）
            columnid:'',
            layoutid:''						//		容器id
        },
        //私有属性列表
        property:{							//		属性参数
            style:{},						//		样式属性
            private:{},						//		私有属性
            event:{},						//		事件属性
            data:{}							//		数据属性
        },
        //深层复制对象实现
        _copyObj:function(o1,o2){
            if(typeof o1 === "object" && o1 instanceof Array){
                o2 = o2||[];
                for(var i=0;i<o1.length;i++){
                    var _o11 = o1[i];
                    var _o21 = o2[i];
                    o2[i] = o2[i];
                    if(!_o21){
                        if(typeof _o11 === "object" && _o11 instanceof Array){
                            _o21 = _o21||[];
                        }else if(typeof _o11 === "object" && _o11 instanceof jQuery){
                            _o21 = _o21||"";
                        }else if(typeof _o11 === "object" && !(_o11 instanceof Array) && !(_o11 instanceof jQuery)){
                            _o21 = _o21||{};
                        }else if(typeof _o11 === "string"||typeof _o11 === "boolean"||typeof _o11 === "number"){
                            _o21 = _o21||"";
                        }
                    }
                    if(typeof _o11 === "string"||typeof _o11 === "boolean"||typeof _o11 === "number" || _o11 === null){
                        o2[i] = _o11||_o21;
                    }else{
                        this._copyObj(_o11,_o21);
                        o2[i] = _o11||_o21;
                    }

                }
            }else if(typeof o1 === "object" && o1 instanceof jQuery){
                o2 = o1;
            }else if(typeof o1 === "object" && !(o1 instanceof Array) && !(o1 instanceof jQuery)){
                o2 = o2||{};
                for(var key in o1){
                    var o = o1[key];
                    if(typeof o === "string"||typeof o === "boolean"||typeof o === "number" || o === null){
                        o2[key] = o;
                    }else if(typeof o === "object"){
                        if(o instanceof Array){
                            o2[key] = o2[key]||[];
                        }else if(o instanceof jQuery){
                            o2[key] = o2[key];
                        }else{
                            o2[key] = o2[key]||{};
                        }
                        this._copyObj(o1[key],o2[key]);
                    }
                }
            }else if(typeof o1 === "string"||typeof o1 === "boolean"||typeof o1 === "number"|| o === null){
                o2 = o1;
            }

        },
        //默认初始化复制逻辑
        _initAttrs:function(options){
            this.box = options.box;
            this.designer = options.designer;
            this._copyObj(options,this);
        },
        //控件初始化入口
        init:function(options){
            this._initAttrs(options);
            if(!this.id){
                this.id = "id"+new Date().getTime();
            }
            this._createDrag();
            return this;
        },
        //将来控件复制粘贴的实现，获取options配置~~进行控件的复制，目前没做
        _clone:function(options){
            options.id = '';
            var o = {};
            o = $.extend(o,this);
            o.init(options);
            return o;
        },
        //创建拖拽对象，这个是设计模式和生产模式的入口
        _createDrag:function(){
            this._destroyDrag();
            this.drag = $("<div>");
            if(this.designerType == "absolute"){
                var l = this.layout.l;
                var t = this.layout.t;
                l = parseInt(l);
                t = parseInt(t);

                this.drag.css({
                    position:"absolute",
                    width:this.layout.w,
                    height:this.layout.h,
                    left:l,
                    top:t,
                    "z-index":this.layout.index
                });
            }else{
                this.drag.css({
                    position:"relative",
                    width:"100%",
                    height:this.layout.h
                });
            }


            this.box.append(this.drag);
            this.composer = this._createComposer();

            this.drag.append(this.composer);
            this.afterCreateComposer();
            if(this.designer){
                this._bindDesignerEvent();
            }
        },
        //销毁控件拖拽dom对象
        _destroyDrag:function(){
            if(this.drag){
                this.drag.remove();
            }
        },
        //创建控件逻辑，先销毁后创建，createComposer在每个控件加自定义实现
        _createComposer:function(){
            this.destroyComposer();
            return this.createComposer();
        },
        //获取控件上侧工具栏，并初始化工具栏事件，getTools为自定义工具栏实现，摆放位置为拖拽按钮和其他按钮之间
        _getTools:function(){
            var tools = this.getTools()||[];
            var moveBtn = $("<i class='fa fa-arrows-alt drag_move_btn' title='移动'>");
            var setting = $("<i class='fa fa-cog' title='配置'>");
            var up = $("<i class='fa fa-arrow-alt-circle-up' title='上移'>");
            var down = $("<i class='fa fa-arrow-alt-circle-down' title='下移'>");
            var del = $("<i class='fa fa-trash-alt' title='删除'>");
            var _this = this;

            setting.mousedown(function(e){
                e.preventDefault();
                e.stopPropagation();
                util.initProperty(_this,"base","propertySetting");
                util.showProperty(_this,"base","propertySetting");
            });
            up.mousedown(function(e){
                e.preventDefault();
                e.stopPropagation();
                _this.layout.index ++;
                _this.drag.css({
                    "z-index":_this.layout.index
                });
            });
            down.mousedown(function(e){
                e.preventDefault();
                e.stopPropagation();
                _this.layout.index --;
                if(_this.layout.index<0)_this.layout.index=0;
                _this.drag.css({
                    "z-index":_this.layout.index
                });
            });
            del.mousedown(function(e){
                e.preventDefault();
                e.stopPropagation();
                CM.opeList = CM.opeList||[];
                var o = {
                    oldValue:_this.getSettings(),
                    newValue:"",
                    composerId:_this.id,
                    type:"deleteComposer"
                };
                CM.opeList.splice(0,CM.opeIndex,o);
                CM.opeIndex = 0;
                _this.destroy();

            });
            if(this.designerType == "relative"){
                var move = $("<i class='fa fa-arrows-alt' title='移动'>");

                move.data("composer",_this);
                move.mousedown(function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    var composer = $(this).data("composer");
                    var clone = $(this).clone();
                    clone.css({
                        width:"30px",
                        height:"30px",
                        "line-height":"30px",
                        "text-align":"center",
                        "background":"#01132d",
                        "opacity":"0.5",
                        color:"#fff",
                        position:"absolute",
                        "z-index":"100000",
                        left:e.pageX-CM.designer.offset().left+25,
                        top:e.pageY-CM.designer.offset().top+25
                    });
                    clone.data("composer",composer);
                    clone.appendTo(CM.designer);

                    CM.cloneObj = clone;
                    CM.relativeMoveStart = true;
                });
                tools.splice(0,0,move);
            }else{
                tools.splice(0,0,moveBtn);
            }

            tools.push(setting);
            if(this.designerType == "absolute"){
                tools.push(up);
                tools.push(down);
            }
            tools.push(del);
            return tools;
        },
        //控件工具栏接口
        getTools:function(){
            return [];
        },
        //绑定设计模式事件
        _bindDesignerEvent:function(){
            var _this = this;
            //		绑定设计器拖拽/resize事件
            this.drag.addClass("designer_drag_obj");
            //this.drag.append($("<div class='drag_msk'>"));
            this.dragHead = $("<div class='designer_drag_head'>");
            this.dragTools = $("<div class='designer_drag_tools'>");

            var tools = this._getTools();
            this.dragTools.width(tools.length*30+15);
            for(var i=0;i<tools.length;i++){
                this.dragTools.append(tools[i]);
            }
            this.drag.append(this.dragHead);
            this.dragHead.append(this.dragTools);
            this.drag.click(function(e){
                var id = _this.id;
                CM.select(id);
            });
            if(this.designerType == "absolute"){
                this.drag.draggable({
                    handle: ".drag_move_btn",
                    snap: ".designer_drag_obj",
                    snapMode: "outer",
                    containment: "#designer",
                    scroll: false,
                    start: function(e,ui) {
                        ui.helper.addClass("start_move");
                        ui.helper.css({
                            opacity:0.5
                        });
                    },
                    drag: function(e,ui) {

                    },
                    stop: function(e,ui) {
                        ui.helper.removeClass("start_move");
                        ui.helper.css({
                            opacity:1
                        });
                        var oldPosition = {
                            left:_this.layout.l,
                            top:_this.layout.t
                        };
                        var position = ui.position;
                        _this.layout.l = position.left;
                        _this.layout.t = position.top;
                        util.updateProperty(_this,"base","propertySetting");
                        _this.afterDrag();
                        _this.syncGroup();
                        var o = {
                            oldValue:oldPosition,
                            newValue:position,
                            composerId:_this.id,
                            type:"dragUpdate"
                        };
                        util.addOpe(o);

                    }
                });
            }

            if(CM.lock){
                this.drag.draggable( "option", "revert", true );
            }
            var containerId = "designer";
            if(this.layout.columnid){
                containerId = this.layout.columnid;
            }
            var resizeOption = {
                containment: "#designer",
                delay: 150,
                resize:function(event,ui){

                },
                stop:function(event,ui){
                    var oldValue = {
                        w:_this.layout.w,
                        h:_this.layout.h
                    };
                    var newValue = {
                        w: ui.size.width,
                        h: ui.size.height
                    }
                    _this.layout.w = ui.size.width;
                    _this.layout.h = ui.size.height;
                    util.updateProperty(_this,"base","propertySetting");
                    _this.afterResize(_this.composer);

                    var o = {
                        oldValue:oldValue,
                        newValue:newValue,
                        composerId:_this.id,
                        type:"resizeUpdate"
                    };
                    util.addOpe(o);
                }
            };
            if(this.designerType == "relative"){
                resizeOption.handles="s";
            }

            this.drag.resizable(resizeOption);
            this.drag.attr("id",this.id);
            this.afterResize(this.composer);
        },
        //启用resize
        bindResize:function(){
            this.drag.resizable( "enable" );
        },
        //关闭resize
        unBindResize:function(){
            this.drag.resizable( "disable" );
        },
        //同步属性渲染
        _syncUI:function(){
            this._createDrag();
        },
        //销毁控件接口
        destroyComposer:function(){
            if(this.composer){
                this.composer.remove();
            }

        },
        //同步拖拽属性和Group
        syncDragUI:function(){
            var l = this.layout.l;
            var t = this.layout.t;
            l = parseInt(l);
            t = parseInt(t);
            this.drag.css({
                left:l,
                top:t
            });
            this.syncGroup();
        },
        //同步控件group
        syncGroup:function(){
            var bindGroup = CM.bindGroupList;
            for(var key in bindGroup){
                for(var i=0;i<bindGroup[key].length;i++){
                    if(bindGroup[key][i] == this.id){
                        CM.initGroup(key);
                        break;
                    }
                }
            }
        },
        //创建控件内容接口
        createComposer:function(){},
        afterCreateComposer:function(){},	//		创建控件追加到页面后的回调
        bindEvent:function(){},				//		给控件绑定事件
        //获取控件setting，用于控件的保存和复制，复制时去掉id并且需要添加box等其他属性
        getSettings:function(){
            var o = {
                id:this.id,
                designerType:this.designerType,
                classname:this.classname,
                layout:this.layout,
                property:this.property
            };
            return o;
        },
        //拖拽结束回调事件
        afterDrag:function(){

        },
        //控件resize结束后回调事件
        afterResize:function(){

        },
        //控件销毁，且关闭控件的属性框
        destroy:function(){
            this.destroyComposer();
            this.drag.remove();
            delete CM.all[this.id];
            var propertyBox = $("#propertyList");
            if(propertyBox.get(0)){
                var bodySettingColorPickerid = $("#bodyBg").data("colorpickerId");
                $("body .colorpicker").not("#"+bodySettingColorPickerid).remove();
                propertyBox.hide();
            }
        },
        //控件的自选择
        chooseMe:function(){
            var id = this.id;
            CM.select(id);
        }
    };
    return base;
});