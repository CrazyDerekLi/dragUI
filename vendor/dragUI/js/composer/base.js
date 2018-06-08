require.config({
});
define(["util"], function(util){

    var base = {
        designer:true,
        designerType:"absolute",
        box:'',
        drag:undefined,
        composer:undefined,
        classname:"",
        classTitle:"",
        classIcon:"",
        id:"",
        all:{},
        propertyBox:undefined,
        layout:{						    //		公共布局属性
            l:0,							//		left
            t:0,							//		top
            w:100,							//		宽度
            h:20,							//		高度
            index:1,						//		布局位置（层级/顺序）
            columnid:'',
            layoutid:''						//		容器id
        },
        property:{							//		属性参数
            style:{},						//		样式属性
            private:{},						//		私有属性
            event:{},						//		事件属性
            data:{}							//		数据属性
        },
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
        _initAttrs:function(options){
            this.box = options.box;
            this.designer = options.designer;
            this._copyObj(options,this);
        },
        init:function(options){
            this._initAttrs(options);
            if(!this.id){
                this.id = "id"+new Date().getTime();
            }
            this._createDrag();
            return this;
        },
        _clone:function(options){
            options.id = '';
            var o = {};
            o = $.extend(o,this);
            o.init(options);
            return o;
        },
        _createDrag:function(){
            this._destroyDrag();
            this.drag = $("<div>");
            if(CM.designerType == "absolute"){
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
        _destroyDrag:function(){
            if(this.drag){
                this.drag.remove();
            }
        },
        _createComposer:function(){
            this.destroyComposer();
            return this.createComposer();
        },
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
        getTools:function(){
            return [];
        },
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
            if(CM.designerType == "absolute"){
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
                        var position = ui.position;
                        _this.layout.l = position.left;
                        _this.layout.t = position.top;
                        util.updateProperty(_this,"base","propertySetting");
                        _this.afterDrag();
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
                    _this.layout.w = ui.size.width;
                    _this.layout.h = ui.size.height;
                    util.updateProperty(_this,"base","propertySetting");
                    _this.afterResize(_this.composer);
                }
            };
            if(this.designerType == "relative"){
                resizeOption.handles="s";
            }

            this.drag.resizable(resizeOption);
            this.drag.attr("id",this.id);
            this.afterResize(this.composer);
        },
        bindResize:function(){
            this.drag.resizable( "enable" );
        },
        unBindResize:function(){
            this.drag.resizable( "disable" );
        },
        _getOptions:function(){
            return this;
        },
        _setOptions:function(options){
            this.init(options)
        },
        _syncUI:function(){
            this._createDrag();
        },
        destroyComposer:function(){
            if(this.composer){
                this.composer.remove();
            }

        },
        syncDragUI:function(){
            var l = this.layout.l;
            var t = this.layout.t;
            l = parseInt(l);
            t = parseInt(t);
            this.drag.css({
                left:l,
                top:t
            });
        },
        createComposer:function(){},
        afterCreateComposer:function(){},	//		创建控件追加到页面后的回调
        bindEvent:function(){},				//		给控件绑定事件
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
        initSelfProperty:function(){

        },
        saveProperty:function(){},			//		保存控件属性
        setData:function(data){},			//		设置控件数据
        getData:function(){},				//		提取控件数据
        setValue:function(value){},			//		控件赋值
        getValue:function(){},				//		控件取值
        		//		渲染
        afterDrag:function(){},				//		拖拽结束事件
        afterResize:function(){

        },			//		调整列宽结束事件
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
        chooseMe:function(){
            var id = this.id;
            CM.select(id);
        }
    };
    return base;
});