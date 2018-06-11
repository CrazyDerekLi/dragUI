(function(){
    var dep = [];
    composerConfig.relativeContainer = 'dragUI/js/composer/relativeContainer';
    composerConfig.util = 'dragUI/js/composer/util';
    var realtiveGroup = {
        groupName:"布局",groupList:[{
            groupName:"布局组件",composerList:[
                {type:"relativeContainer",title:"6:6",icon:vendorPath+"dragUI/image/6-6.png",options:{property:{columnsSetting:"6:6"}}}
                ,{type:"relativeContainer",title:"4:8",icon:vendorPath+"dragUI/image/4-8.png",options:{property:{columnsSetting:"4:8"}}}
                ,{type:"relativeContainer",title:"8:4",icon:vendorPath+"dragUI/image/8-4.png",options:{property:{columnsSetting:"8:4"}}}
                ,{type:"relativeContainer",title:"4:4:4",icon:vendorPath+"dragUI/image/4-4-4.png",options:{property:{columnsSetting:"4:4:4"}}}
                ,{type:"relativeContainer",title:"5:5:2",icon:vendorPath+"dragUI/image/5-5-2.png",options:{property:{columnsSetting:"5:5:2"}}}
                ,{type:"relativeContainer",title:"5:2:5",icon:vendorPath+"dragUI/image/5-2-5.png",options:{property:{columnsSetting:"5:2:5"}}}
                ,{type:"relativeContainer",title:"2:5:5",icon:vendorPath+"dragUI/image/2-5-5.png",options:{property:{columnsSetting:"2：5：5"}}}
                ,{type:"relativeContainer",title:"3:3:6",icon:vendorPath+"dragUI/image/3-3-6.png",options:{property:{columnsSetting:"3：3：6"}}}
                ,{type:"relativeContainer",title:"3:6:3",icon:vendorPath+"dragUI/image/3-6-3.png",options:{property:{columnsSetting:"3：6：3"}}}
                ,{type:"relativeContainer",title:"6:3:3",icon:vendorPath+"dragUI/image/6-3-3.png",options:{property:{columnsSetting:"6:3:3"}}}
                ,{type:"relativeContainer",title:"3:3:3:3",icon:vendorPath+"dragUI/image/3-3-3-3.png",options:{property:{columnsSetting:"3:3:3:3"}}}
                ,{type:"relativeContainer",title:"2:2:2:2:2:2",icon:vendorPath+"dragUI/image/2-2-2-2-2-2.png",options:{property:{columnsSetting:"2:2:2:2:2:2"}}}
            ]
        }]
    };
    for(var key in composerConfig){
        dep.push(key);
    }
    require.config({
        paths:composerConfig
    });
    function f1(){
        var composerType = {};
        for (var i = 0; i < arguments.length; i++) {
            composerType[dep[i]] = {
                func:arguments[i]
            }
        }
        var composerMap = {
            allComposer:composerType,           //所有注入的控件，包括util等工具类对象，调用方式this.allComposer[key].func
            opeList:[],                         //todo和redo的数据
            opeIndex:0,                         //todo和redo的执行游标
            controlPress:false,                 //是否按住control进行多选
            selectedList:{},                    //控件多选选中列表，如果非多选则只有一个对象，key为id，value为控件对象
            bindGroupList:{},                   //组合控件的关系，key为组合id，value为控件id组成的数组
            groupList:[],                       //左侧拖拽区域控件列表的配置
            containerList:[],                   //容器列表
            bgImgList:[],                       //背景图片列表
            all:{},                             //所有创建的控件实例，key为id，value为控件内容
            lock:false,                         //页面锁定状态，取消拖拽修改事件
            current:null,                       //当前选中对象
            dragging:false,                     //相对布局的拖拽状态
            clone:undefined,                    //左侧拖拽工具复制出的对象
            cloneObj:null,                      //相对布局拖拽复制出来的对象
            relativeMoveStart:false,            //相对布局移动开始状态
            designerType:"absolute",            //面板设计模式
            theme:"white",                      //样式
            themePath:basePath+"css/",          //样式路径
            bodySetting:{
                width:1920,
                height:1080,
                rWidth:100,
                widthType:"px",
                pL:0,
                rPL:0,
                pR:0,
                rPR:0,
                pT:0,
                pB:0,
                pLType:"px",
                pRType:"px",
                bgColor:"#112247",
                className:"",
                bgImage:""
            },
            //保存接口
            save:function(){
                alert("保存成功");
            },
            //根据id获取对象
            get:function(id){
                return this.all[id];
            },
            //根据id选中对象
            select:function(id){

                if (!this.controlPress){
                    this.selectedList = {};
                }
                if(this.all[id]){
                    this.selectedList[id] = this.get(id);
                    if(!this.current||!this.controlPress){
                        this.current = this.get(id);
                    }
                }else{
                    this.current = null;
                }
                var all = this.all;
                var _this = this;
                for(var key in all){
                    var obj = $("#"+key);
                    if(_this.selectedList[key]){
                        obj.addClass("selected");
                        obj.addClass("child");
                    }else{
                        obj.removeClass("selected");
                    }
                    if(_this.current&&key == _this.current.id){
                        obj.addClass("selected");
                        obj.removeClass("child");
                    }
                }
                if(this.current&&this.designerType == "absolute"){
                    $("#commonLeft").spinner("value",this.current.layout.l);
                    $("#commonTop").spinner("value",this.current.layout.t);
                    $("#commonWidth").spinner("value",this.current.layout.w);
                    $("#commonHeight").spinner("value",this.current.layout.h);
                    $("#commonIndex").spinner("value",this.current.layout.index);

                    var bindGroup = this.bindGroupList;
                    for(var key in bindGroup){
                        for(var i=0;i<bindGroup[key].length;i++){
                            if(bindGroup[key][i] == this.current.id){
                                this.initGroup(key);
                                break;
                            }
                        }
                    }
                }else{
                    $("#commonLeft").spinner("value","");
                    $("#commonTop").spinner("value","");
                    $("#commonWidth").spinner("value","");
                    $("#commonHeight").spinner("value","");
                    $("#commonIndex").spinner("value","");
                }

            },
            //切换样式
            changeTheme:function(theme){

                this.theme = theme;
                if(this.theme == "white"){
                    this.bodySetting.bgColor = '#ffffff';
                }else{
                    this.bodySetting.bgColor = '#112247';
                }
                $("#designer_theme").remove();
                $("<link>")
                    .attr({ rel: "stylesheet",
                        type: "text/css",
                        href: vendorPath+"dragUI/css/designer_"+this.theme+".css",
                        id:"designer_theme"
                    })
                    .appendTo("head");
                this.designer.css({
                    background:this.bodySetting.bgColor
                });
            },
            //面板初始化
            init:function(options){
                var _this = this;
                this.designerType = options.designerType||this.designerType;//absolute,relative
                this.designer = options.designer;
                if(this.designerType == "relative"){
                    options.groupList.splice(0,0,realtiveGroup);
                }
                this.groupList = options.groupList;
                this.theme = options.theme||this.theme;
                this.save = options.save||this.save;
                this.bgImgList = options.bgImgList||this.bgImgList;
                this.changeTheme(this.theme);


                this.designer.addClass(this.bodySetting.className);
                //this.designer.html("");
                if(this.designerType == "relative"){
                    this.bindRelativeEvent();
                    this.initRelativeBodySetting();
                }else{
                    this.bindAbsoluteEvent();
                    this.initAbsoluteBodySetting();
                    this.initCommonSetting();
                }


                //鼠标mousdown时取消设计器选中控件
                $("body").delegate("*","mousedown",function(e){
                    if(
                        !$(e.target).hasClass("colorpicker")
                        && !$(e.target).hasClass("propertyList")
                        && !$(e.target).parents(".colorpicker").get(0)
                        && !$(e.target).parents(".propertyList").get(0)
                        && !$(e.target).parents(".designer_drag_tools").get(0)
                        && !$(e.target).hasClass("bind-group")
                        && !$(e.target).parents(".bind-group").get(0)
                        && $(e.target).attr("id")!="designer_tools"
                        && !$(e.target).parents("#designer_tools").get(0)
                        && $(e.target).attr("id")!="dragList"
                        && !$(e.target).parents("#dragList").get(0)
                    ){
                        _this.select("");
                        _this.closeAllGroup();
                        //_this.designer.find(".designer_drag_obj").removeClass("selected");
                        _this.current = null;
                    }
                });
                //鼠标mousup时删除控件克隆对象
                $("body").delegate("*","mouseup",function(e){
                    if(_this.clone){
                        _this.clone.remove();
                    }
                    _this.clone = undefined;
                    if(_this.cloneObj){
                        _this.cloneObj.remove();
                        _this.relativeMoveStart = false;
                    }
                    _this.cloneObj = undefined;
                });
                $("body").delegate("*","click",function(e){

                    if(
                        !$(e.target).hasClass("colorpicker")
                        && !$(e.target).parents(".colorpicker").get(0)
                        && !$(e.target).parents(".propertyList").get(0)
                        && !$(e.target).parents(".designer_drag_tools").get(0)
                        && !$(e.target).parents(".designer_container_head").get(0)
                    ){
                        if($(".propertyList").get(0)){
                            $(".propertyList").hide();
                        }
                    }

                });
                this.dragList = $("#dragList");

                this.initDragList();
                this.bindDragList();



                this.initBodyBg();

                $("#designer_save").click(function(e){
                    var jsonStr = _this._save();
                    _this.save(jsonStr);
                });
                $("#designer_lock").click(function(e){
                    var lock = $(this).attr("lock")+"";
                    if(lock == "0"){
                        _this.lock = true;
                        $( ".designer_drag_obj" ).draggable( "option", "revert", true );
                        $(this).attr("lock","1");
                        $(this).html('<i class="fa fa-unlock"></i>解锁');
                    }else{
                        _this.lock = false;
                        $( ".designer_drag_obj" ).draggable( "option", "revert", false );
                        $(this).attr("lock","0");
                        $(this).html('<i class="fa fa-lock"></i>锁定');
                    }

                });
                $("#designer_view").click(function(e){
                    _this.designerView($("#designerViewContainer"));
                    $("#designerView").show();
                });
                $("#designerCloseBtn").click(function(e){
                    $("#designerView").hide();
                });
                $("#designer_group").click(function(e){
                    var selectedList = _this.selectedList;
                    var groupid = "group_"+new Date().getTime();
                    _this.bindGroupList = _this.bindGroupList||{};
                    var list = [];
                    for (var key in selectedList) {
                        list.push(key);
                    }
                    var _result = _this.getSelectedComposerList(list);
                    var _list = _result.list;
                    var inGroup = _result.inGroup;
                    if(_list.length == list.length){
                        for(var i=0;i<inGroup.length;i++){
                            var gid = inGroup[i];
                            _this.closeGroup(gid);
                            delete _this.bindGroupList[gid];
                        }

                        _this.bindGroupList[groupid] = _list;
                        _this.initGroup(groupid);
                    }else{
                        alert("已存在group,且未全部选中，不能组合");
                    }

                });

                $("#designer_redo").click(function(e){
                    e.preventDefault();
                    var opeList = CM.opeList;
                    var opeIndex = CM.opeIndex;
                    if(opeList.length-1>=opeIndex){
                        var opeSetting = opeList[opeIndex];
                        var _util = _this.allComposer.util.func;
                        _util.doOpeSetting(opeSetting,"1");

                    }
                    CM.opeIndex++;
                    if(CM.opeIndex>opeList.length){
                        CM.opeIndex = opeList.length;
                    }
                });

                $("#designer_do").click(function(e){
                    e.preventDefault();
                    CM.opeIndex--;
                    if(CM.opeIndex<=0){
                        CM.opeIndex = 0;
                    }
                    var opeList = CM.opeList;
                    var opeIndex = CM.opeIndex;
                    if(opeIndex>=0&&opeList.length>0){
                        var opeSetting = opeList[opeIndex];
                        var _util = _this.allComposer.util.func;
                        _util.doOpeSetting(opeSetting,"0");

                    }

                });

            },
            //根据分组id关闭分组
            closeGroup:function(groupid){
                if($("#"+groupid).get(0)){
                    $("#"+groupid).remove();
                }
            },
            //关闭所有分组
            closeAllGroup:function(){
                $(".bind-group").remove();
            },
            //初始化分组dom
            initGroup:function(groupid){
                var _this = this;
                this.closeGroup(groupid);
                var group = $("<div>").attr("id",groupid).addClass("bind-group");
                var groupTools = $("<div>").addClass("bind-group-tools");
                var del = $("<i class='fa fa-trash-alt'>").data("groupid",groupid);
                del.appendTo(groupTools);
                groupTools.appendTo(group);
                del.click(function(e){
                    var _groupid = $(this).data("groupid");
                    $("#"+_groupid).remove();
                    delete _this.bindGroupList[_groupid]
                });
                var groupList = this.bindGroupList[groupid];
                var l=0,t=0,r=0,b=0;
                for(var i=0;i<groupList.length;i++){
                    var composer = this.all[groupList[i]];
                    var _w = composer.layout.w;
                    var _h = composer.layout.h;
                    var _l = composer.layout.l;
                    var _t = composer.layout.t;
                    _l = parseInt(_l);
                    _t = parseInt(_t);
                    _w = parseInt(_w);
                    _h = parseInt(_h);
                    var _r = _l+_w;
                    var _b = _t +_h;
                    if(i==0){
                        l = _l;
                        t = _t;
                        r = _r;
                        b = _b;
                    }else{
                        l = l<_l?l:_l;
                        t = t<_t?t:_t;
                        r = r>_r?r:_r;
                        b = b>_b?b:_b;
                    }
                }
                group.css({
                    position:"absolute",
                    left:l,
                    top:t,
                    width:r-l,
                    height:b-t,
                    border:"1px solid red",
                    background:"#ccc",
                    opacity:0.5,
                    "z-index":0
                });
                group.appendTo(this.designer);
                group.mousedown(function(e){
                   $(this).css({
                       "z-index":100000
                   });
                });
                group.mouseup(function(){
                    $(this).css({
                        "z-index":0
                    });
                });
                group.draggable({
                    containment:"#designer",
                    start:function(event, ui){
                        ui.helper.data("startPosition",ui.position);
                    },
                    stop:function(event, ui){
                        var startPosition = ui.helper.data("startPosition");
                        var py = {
                            l:ui.position.left - startPosition.left,
                            t:ui.position.top - startPosition.top
                        };
                        var groupid = ui.helper.attr("id");
                        var groupList = _this.bindGroupList[groupid];
                        for(var j=0;j<groupList.length;j++){
                            var c = _this.all[groupList[j]];
                            c.layout.l += py.l;
                            c.layout.t += py.t;
                            c.syncDragUI();
                        }
                    }
                });

            },
            //获取选中分组控件列表
            getSelectedComposerList:function(list1){
                var list = [].concat(list1);
                this.bindGroupList = this.bindGroupList||{};
                var inGroup = [];
                var delList = [];
                for(var key in this.bindGroupList){
                    var group = this.bindGroupList[key];
                    var indexList = [];
                    var allIn = true;
                    for(var i=0;i<group.length;i++){
                        var groupItem = group[i];
                        var _in = false;
                        for(var j=0;j<list.length;j++){
                            var item = list[j];
                            if(groupItem == item){
                                indexList.push(j);
                                _in = true;
                                break;
                            }
                        }
                        if(_in == false){
                            allIn = false;
                        }
                    }
                    if(allIn == false){
                        delList = delList.concat(indexList);
                    }else{
                        if(indexList.length>0){
                            inGroup.push(key);
                        }
                    }

                }
                delList.sort(function(a,b){
                    return b-a;
                });
                for(var i=0;i<delList.length;i++){
                    var _ind = delList[i];
                    list.splice(_ind,1);
                }
                return {
                    inGroup:inGroup,
                    list:list
                };
            },
            //绑定相对布局面板控件
            bindRelativeEvent:function(){
                this.designer.css({
                    width:this.bodySetting.width+this.bodySetting.widthType,
                    height:"100%"
                });
                var _this = this;
                this.designer.mouseup(function(e){
                    var _c = $(e.target);
                    if(_this.clone){
                        var container = _this.designer;


                        var type = _this.clone.attr("type");
                        var options = {
                            designer:true,
                            designerType:_this.designerType,
                            classname:type,
                            box : container
                        };
                        var relCreateSetting = "";
                        if(type!="relativeContainer"){
                            if(_this.designer.is(_c)){
                                var newContainerOptions = $.extend({},options,{property:{columns:["12"]}});
                                var container = new _this.allComposer["relativeContainer"].func(newContainerOptions);
                                var id = container.id;
                                _this.all[id] = container;
                                relCreateSetting = container.getSettings();
                                options.layout = options.layout||{};
                                options.layout.columnid = id+"_0";
                                options.layout.layoutid = id;
                            }else{
                                var container = _c.parents(".container_column").first();
                                if(_c.hasClass("container_column")){
                                    container = _c;
                                }

                                var id = container.attr("id");
                                options.layout = options.layout||{};
                                options.layout.columnid = id;
                                options.layout.layoutid = id.split("_")[0];
                            }
                            options.box = $("#"+options.layout.columnid);
                        }

                        var _options = _this.clone.data("options")||{};
                        var newOptions = $.extend({},options,_options);
                        var composer = new _this.allComposer[type].func(newOptions);
                        var id = composer.id;
                        _this.all[id] = composer;
                        if(type!="relativeContainer"){
                            var _container = _this.all[options.layout.layoutid];
                            var columnComposers = _container.property.columnComposers||{};
                            columnComposers[options.layout.columnid] = columnComposers[options.layout.columnid]||[];
                            columnComposers[options.layout.columnid].push(id);
                            _container.fitAllColumns();

                        }

                        var o = {
                            oldValue:{},
                            newValue:{
                                composerSettings:composer.getSettings(),
                                relCreateSetting:relCreateSetting
                            },
                            composerId:id,
                            type:"insertRelativeComposer"
                        };
                        CM.allComposer.util.func.addOpe(o);
                        _this.clone.remove();
                        delete _this.clone;
                        _this.clone = undefined;




                    }
                    if(_this.cloneObj){
                        var newContainerColumn = $(e.target);
                        if(newContainerColumn.hasClass("container_column") || newContainerColumn.parents(".container_column").first().get(0)){
                            newContainerColumn = newContainerColumn.hasClass("container_column")?newContainerColumn:newContainerColumn.parents(".container_column").first();
                            var composer = _this.cloneObj.data("composer");
                            var container = _this.all[composer.layout.layoutid];
                            var columnComposers = container.property.columnComposers;
                            var layoutid = composer.layout.layoutid;
                            var columnid = composer.layout.columnid;
                            var _columnid = newContainerColumn.attr("id");
                            var _layoutid = _columnid.split("_")[0];
                            var ind = columnComposers[columnid].indexOf(composer.id);
                            if(ind!=-1){
                                columnComposers[columnid].splice(ind,1);
                            }
                            var newContainer = _this.all[_layoutid];
                            newContainer.property.columnComposers[_columnid].push(composer.id);
                            var columnObj = newContainer.container.find("#"+_columnid);
                            composer.layout.columnid = _columnid;
                            composer.layout.layoutid = _layoutid;
                            composer.drag.appendTo(columnObj);
                            container.fitAllColumns();
                            newContainer.fitAllColumns();


                            var o = {
                                oldValue:{
                                    layoutid:layoutid,
                                    columnid:columnid
                                },
                                newValue:{
                                    layoutid:_layoutid,
                                    columnid:_columnid
                                },
                                composerId:id,
                                type:"dragRelativeComposer"
                            };
                            CM.allComposer.util.func.addOpe(o);

                        }
                        if(_this.cloneObj){
                            _this.cloneObj.remove();
                            _this.cloneObj = undefined;
                            _this.relativeMoveStart = false;
                        }

                    }

                });
            },
            //绑定绝对布局控件
            bindAbsoluteEvent:function(){
                this.designer.css({
                    width:this.bodySetting.width,
                    height:this.bodySetting.height
                });
                var _this = this;
                var Rect = {
                    obj:null,
                    container:null,
                    init:function(box){
                        Rect.container = box;
                        if(Rect.container&&Rect.container.get(0)){
                            if(!Rect.obj){
                                Rect.obj = $("<div>");
                            }
                            var o = Rect.obj;

                            o.addClass("select-box");
                            o.css({
                                "background":"red",
                                "position":"absolute",
                                "opacity":0.3
                            });

                            o.height(0);
                            o.width(0);
                            Rect.container.append(o);

                            Rect.container.mousedown(Rect.start);
                            Rect.container.mousemove(Rect.move);
                            Rect.container.mouseup(Rect.end);
                        }
                    },
                    start:function(e){
                        if($(e.target).hasClass("designer_drag_obj")
                            ||$(e.target).parents(".designer_drag_obj").get(0)
                            ||$(e.target).hasClass("bind-group")
                        ){
                            return;
                        }

                        var o = Rect.obj;

                        var left = e.pageX-Rect.container.offset().left;
                        var top = e.pageY-Rect.container.offset().top;
                        o.css("left", left);
                        o.attr("startX",left);
                        o.data("mouseBeginX",left);
                        o.css("top", top);
                        o.attr("startY",top);
                        o.data("mouseBeginY",top);
                        o.height(0);
                        o.width(0);
                        Rect.status = true;
                        Rect.obj.show();


                    },
                    move:function(e){
                        e.preventDefault();
                        var o = Rect.obj;
                        if(o&&Rect.status){
                            var dx = e.pageX-Rect.container.offset().left - o.data("mouseBeginX");
                            var dy = e.pageY-Rect.container.offset().top - o.data("mouseBeginY");
                            if(dx<0){
                                o.css("left" , parseFloat(o.attr("startX"))+dx );
                            }else{
                                o.css("left" , o.attr("startX"));
                            }
                            if(dy<0){
                                o.css("top" , parseFloat(o.attr("startY"))+dy);
                            }else{
                                o.css("top" , o.attr("startY"));
                            }

                            o.height (Math.abs(dy));
                            o.width (Math.abs(dx));
                        }

                    },
                    end:function(e){
                        if(Rect.status) {
                            var all = _this.all;
                            _this.controlPress = true;
                            var list = [];
                            for (var key in all) {
                                if (Rect.checkInclude(all[key].drag)) {
                                    list.push(key);
                                }
                            }
                            var _result = _this.getSelectedComposerList(list);
                            var _list = _result.list;
                            for(var i=0;i<_list.length;i++){
                                _this.select(_list[i]);
                            }
                            _this.controlPress = false;

                            if (Rect.obj) {
                                Rect.obj.hide();
                            }
                            Rect.status = false;
                        }


                    },
                    checkInclude:function(obj){
                        var startX = Rect.obj.position().left;
                        var startY = Rect.obj.position().top;
                        var endX = Rect.obj.width() + startX;
                        var endY = Rect.obj.height() + startY;
                        var cStartX = obj.position().left;
                        var cStartY = obj.position().top;
                        var cEndX = obj.width() + cStartX;
                        var cEndY = obj.height() + cStartY;
                        return startX<=cStartX && startY<=cStartY && endX>=cEndX && endY>=cEndY;
                    }
                };


                Rect.init(this.designer);

                $(window).keydown(function(e){
                    //e.preventDefault();
                    var step = 5;
                    if(e.keyCode=="37"||e.keyCode=="100"){
                        var position = "left";
                        var current = _this.current;
                        if(current){
                            current.layout.l = current.layout.l-step;
                            current._syncUI();
                            current.chooseMe();
                        }
                    }
                    if(e.keyCode=="38"||e.keyCode=="104"){
                        var position = "top";
                        var current = _this.current;
                        if(current){
                            current.layout.t = current.layout.t-step;
                            current._syncUI();
                            current.chooseMe();
                        }
                    }
                    if(e.keyCode=="39"||e.keyCode=="112"){
                        var position = "right";
                        var current = _this.current;
                        if(current){
                            current.layout.l = current.layout.l+step;
                            current._syncUI();
                            current.chooseMe();
                        }
                    }
                    if(e.keyCode=="40"||e.keyCode=="98"){
                        var position = "bottom";
                        var current = _this.current;
                        if(current){
                            current.layout.t = current.layout.t+step;
                            current._syncUI();
                            current.chooseMe();
                        }
                    }
                    //console.log(e.keyCode);
                    if(e.keyCode=="17"){
                        _this.controlPress = true;
                    }
                });
                $(window).keyup(function(e){
                    if(e.keyCode=="17"){
                        _this.controlPress = false;
                    }
                });
                this.designer.mouseup(function(e){
                    if(_this.clone){
                        var left = e.pageX;
                        var top = e.pageY;
                        var container =  _this.designer;
                        var offset = container.offset();

                        var x = left-offset.left;
                        var y = top-offset.top;
                        var type = _this.clone.attr("type");
                        var options = {
                            classname:type,
                            designerType:_this.designerType,
                            box : container,
                            designer:true,
                            layout:{
                                l:x,
                                t:y
                            }
                        };
                        var _options = _this.clone.data("options")||{};
                        var newOptions = $.extend({},options,_options);
                        var composer = new _this.allComposer[type].func(newOptions);
                        var id = composer.id;
                        _this.all[id] = composer;

                        newOptions.id = id;
                        var o = {
                            oldValue:{},
                            newValue:{
                                composerSettings:newOptions
                            },
                            composerId:id,
                            type:"insertAbsoluteComposer"
                        };
                        CM.allComposer.util.func.addOpe(o);

                        _this.clone.remove();
                        delete _this.clone;
                        _this.clone = undefined;
                    }


                });
            },
            //初始化左侧拖拽面板组件
            initDragList: function(){
                // this.dragList.find(".groupList li").not("#body_setting").remove();
                // this.dragList.find(".groupCenter").not("#bodySettingBox").remove();
                var groupList = this.dragList.find(".groupList");

                for(var i=this.groupList.length-1;i>=0;i--){
                    var groupItem = this.groupList[i];
                    var groupId = "drag_box_"+i;
                    var li = $("<li>");
                    li.html(groupItem.groupName).attr("bindshow",groupId);
                    groupList.prepend(li);
                    var dragBox = $("<div>").addClass("groupCenter").attr("id",groupId);
                    groupList.after(dragBox);
                    if(i==0){
                        li.addClass("selected");
                        dragBox.addClass("selected");
                    }
                    var childGroup = groupItem.groupList;
                    for(var j=0;j<childGroup.length;j++){
                        var childGroupItem = childGroup[j];
                        var group = $('<div class="dragGroup">');
                        var groupTitle = $('<div class="dragGroupTitle">').html(childGroupItem.groupName);
                        var dragGroupList = $('<div class="dragGroupList">');
                        var composerList = childGroupItem.composerList;
                        for(var m=0;m<composerList.length;m++){
                            var composerItem = composerList[m];
                            var type = composerItem.type;
                            var title = composerItem.title||composerType[type].func.classTitle;
                            var icon = composerItem.icon||composerType[type].func.classIcon;
                            var options = composerItem.options;
                            var groupItem = $('<div class="dragItem">').attr("type",type).data("options",options);
                            var groupItemIcon = $('<div class="dragItemIcon">');
                            var groupItemIconImg = $('<img src="'+icon+'" alt="">');
                            var groupItemLabel = $('<div class="dragItemName">'+title+'</div>');
                            groupItem.append(groupItemIcon).append(groupItemLabel);
                            groupItemIcon.append(groupItemIconImg);
                            dragGroupList.append(groupItem);
                        }
                        var clearDiv = $('<div class="clear"></div>');
                        group.append(groupTitle).append(dragGroupList).append(clearDiv);
                        dragBox.append(group);
                    }
                }

            },
            //更新spinnerbox
            updateSpinnerBox:function(id,wKey,rwKey,typeKey){
                var widthSpinner = $("#"+id);
                var pxbox = widthSpinner.find(".label_px");
                var bfhbox = widthSpinner.find(".label_bfh");
                var _w = this.bodySetting[wKey];
                if(this.bodySetting[typeKey] == "px"){
                    _w = this.bodySetting[wKey];
                    pxbox.addClass("selected");
                    bfhbox.removeClass("selected");
                }else{
                    _w = this.bodySetting[rwKey];
                    pxbox.removeClass("selected");
                    bfhbox.addClass("selected");
                }
                widthSpinner.find("input").spinner("value",_w);
            },
            //更新bodysetting
            updateBodySetting:function(){
                if(this.designerType == "relative"){
                    this.updateSpinnerBox("bodyWidth","width","rWidth","widthType");
                    this.updateSpinnerBox("paddingLeft","pL","rPL","pLType");
                    this.updateSpinnerBox("paddingRight","pR","rPR","pRType");
                    $("#paddingTop").spinner("value",this.bodySetting.pT);
                    $("#paddingBottom").spinner("value",this.bodySetting.pB);
                }else{
                    $("#bodyWidth").spinner("value",this.bodySetting.width);
                    $("#bodyHeight").spinner("value",this.bodySetting.height);
                }
            },
            //获取属性公共item对象
            getPropertyItem:function(){
                var propertyItem = $("<div class='property_item'>");
                var propertyLabel = $("<div class='property_label'>");
                var propertyInfo = $("<div class='property_info'>");
                var propertyTitle = $("<div class='property_label_title'>");
                propertyLabel.append(propertyTitle);
                propertyItem.append(propertyLabel).append(propertyInfo);
                return propertyItem;
            },
            //获取spinnerEditor
            getSpinnerEditor:function(){
                var spinnerEditor = $('<div class="spinner_editor_box">');
                var spinnerBox = $('<div class="spinner_box">');
                var spinnerType = $('<div class="spinner_type">');
                spinnerEditor.append(spinnerBox).append(spinnerType);
                var spinnerInput = $('<input type="text" class="spinner_input" style="width:60px;"/>');
                var spinnerTypePx = $('<label class="label_px"><i class="far"></i>px</label>');
                var spinnerTypeBFH = $('<label class="label_bfh"><i class="far"></i>%</label>');
                spinnerBox.append(spinnerInput);
                spinnerType.append(spinnerTypePx);
                spinnerType.append(spinnerTypeBFH);

                return spinnerEditor;
            },
            //修改公共Data
            commonSettingData:function(commonKey,val){
                var curr = this.current;
                var selectedList = this.selectedList;
                if(curr&&selectedList){
                    if(val == curr.layout[commonKey]){
                        return;
                    }
                    var o = {
                        oldValue:[],
                        newValue:[],
                        composerList:[],
                        type:"commonSettingChange"
                    };
                    var currentId = curr.id;
                    this.controlPress = true;
                    for(var key in selectedList){
                        var composer = selectedList[key];
                        var oldV = $.extend({},composer.layout);
                        composer.layout[commonKey] = val;
                        var newV = $.extend({},composer.layout);
                        composer._syncUI();
                        composer.afterResize(composer.composer);
                        this.select(composer.id);
                        o.oldValue.push(oldV);
                        o.newValue.push(newV);
                        o.composerList.push(composer.id);
                    }
                    this.allComposer.util.func.addOpe(o);
                    this.select(currentId);
                    this.controlPress = false;
                }
            },
            //初始化公共属性配置
            initCommonSetting:function(){
                var _this = this;
                var propertyItem = this.getPropertyItem();

                var leftBox = propertyItem.clone();
                leftBox.find(".property_label_title").html("横向偏移：");
                leftBox.find(".property_info").html($('<input type="text" id="commonLeft"/>'));


                var topBox = propertyItem.clone();
                topBox.find(".property_label_title").html("纵向偏移：");
                topBox.find(".property_info").html($('<input type="text" id="commonTop"/>'));

                var widthBox = propertyItem.clone();
                widthBox.find(".property_label_title").html("控件宽度：");
                widthBox.find(".property_info").html($('<input type="text" id="commonWidth"/>'));


                var heightBox = propertyItem.clone();
                heightBox.find(".property_label_title").html("控件高度：");
                heightBox.find(".property_info").html($('<input type="text" id="commonHeight"/>'));

                var indexBox = propertyItem.clone();
                indexBox.find(".property_label_title").html("控件层级：");
                indexBox.find(".property_info").html($('<input type="text" id="commonIndex"/>'));

                $("#commonSettingList").append(leftBox).append(topBox).append(widthBox).append(heightBox).append(indexBox);

                $( "#commonLeft" ).spinner({
                    min:0,
                    change:function(event,ui){
                        var val = $(this).val();
                        _this.commonSettingData("l",val);
                    }
                });
                $( "#commonTop" ).spinner({
                    min:0,
                    change:function(event,ui){
                        var val = $(this).val();
                        _this.commonSettingData("t",val);
                    }
                });
                $( "#commonWidth" ).spinner({
                    min:0,
                    change:function(event,ui){
                        var val = $(this).val();
                        _this.commonSettingData("w",val);
                    }
                });
                $( "#commonHeight" ).spinner({
                    min:0,
                    change:function(event,ui){
                        var val = $(this).val();
                        _this.commonSettingData("h",val);
                    }
                });
                $( "#commonIndex" ).spinner({
                    min:0,
                    change:function(event,ui){
                        var val = $(this).val();
                        _this.commonSettingData("index",val);
                    }
                });
            },
            //初始化绝对布局bodySetting
            initAbsoluteBodySetting:function(){
                var _this = this;
                var propertyItem = this.getPropertyItem();

                var widthBox = propertyItem.clone();
                widthBox.find(".property_label_title").html("页面宽度：");
                widthBox.find(".property_info").html($('<input type="text" id="bodyWidth"/>'));


                var heightBox = propertyItem.clone();
                heightBox.find(".property_label_title").html("页面高度：");
                heightBox.find(".property_info").html($('<input type="text" id="bodyHeight"/>'));


                var bgBox = propertyItem.clone();
                bgBox.find(".property_label_title").html("背景颜色：");
                var colorSelect = $('<div class="color_select">').html($('<input type="text" id="bodyBg" readonly="readonly"/>'));
                bgBox.find(".property_info").html(colorSelect);

                var bgImgBox = propertyItem.clone();
                bgImgBox.find(".property_label_title").html("背景图片：");
                var imgListBox = $("<div class='body_img_list'>").css("border","none");
                for(var i=0;i<this.bgImgList.length;i++){
                    var imgItem = $("<div>").addClass("body_img_item");
                    imgItem.data("data",this.bgImgList[i]);
                    //var imgTitle = $("<div>").addClass("body_img_title").html(this.bgImgList[i].title);
                    var imgObj = $("<div>").addClass("body_img_bg").css({
                        "background-image":"url("+this.bgImgList[i].link+")",
                        "background-repeat":"no-repeat no-repeat",
                        "background-size":"100% 100%"
                    });
                    imgObj.appendTo(imgItem);
                    //imgTitle.appendTo(imgItem);
                    if(this.bodySetting.bgImage == this.bgImgList[i].link){
                        imgItem.addClass("selected");
                    }
                    imgItem.appendTo(bgImgBox);
                    imgListBox.append(imgItem);
                }
                bgImgBox.find(".property_info").html(imgListBox);
                imgListBox.delegate(".body_img_item","click",function(){
                    imgListBox.find(".body_img_item").removeClass("selected");
                    $(this).addClass("selected");
                    var data = $(this).data("data");
                    _this.bodySetting.bgImage = data.link;
                    _this.designer.css({
                        "background-image":"url("+data.link+")",
                        "background-repeat":"no-repeat no-repeat",
                        "background-size":"100% 100%"
                    });
                });
                $("#bodySettingList").html("").append(widthBox).append(heightBox).append(bgBox).append(bgImgBox);

                $( "#bodyWidth" ).spinner({
                    min:1,
                    change:function(event,ui){
                        var _w = $(this).val();
                        _this.bodySetting.width = _w;
                        _this.designer.css({
                            width:_w
                        });
                    }
                });
                $( "#bodyHeight" ).spinner({
                    min:1,
                    change:function(event,ui){
                        var _h = $(this).val();
                        _this.bodySetting.height = _h;
                        _this.designer.css({
                            height:_h
                        });
                    }
                });
            },
            //初始化Spinnerbox
            initSpinnerBox:function(settingBox,propertyItem,spinnerEditor,id,label,wKey,rwKey,typeKey,changeSyncUI){
                var _this = this;
                var widthBox = propertyItem.clone(true);
                widthBox.attr("id",id);
                widthBox.find(".property_label_title").html(label);
                var widthSpinner = spinnerEditor.clone();
                var widthSpinnerInput = widthSpinner.find(".spinner_input");
                widthSpinner.find(".label_px").data("type","px");
                widthSpinner.find(".label_bfh").data("type","%");
                widthBox.find(".property_info").html(widthSpinner);
                widthBox.delegate("label","click",function(e){
                    var _t = $(e.currentTarget).data("type");
                    _this.bodySetting[typeKey] = _t;
                    var pxbox = widthSpinner.find(".label_px");
                    var bfhbox = widthSpinner.find(".label_bfh");
                    var _w = _this.bodySetting[typeKey]=="px"?_this.bodySetting[wKey]:_this.bodySetting[rwKey];
                    var spinnerBox = widthSpinner.find("input");

                    if(_t == "px"){
                        spinnerBox.spinner("option","max",null);
                        pxbox.addClass("selected");
                        bfhbox.removeClass("selected");
                    }else{
                        spinnerBox.spinner("option","max",100);
                        pxbox.removeClass("selected");
                        bfhbox.addClass("selected");
                    }
                    spinnerBox.spinner("value",_w);
                    if(_this.bodySetting[typeKey] == "%"){
                        _w = _w+_this.bodySetting[typeKey];
                    }else{
                        _w = parseInt(_w);
                    }
                    changeSyncUI(_w);
                });
                settingBox.append(widthBox);
                var opWidth = {
                    min:0,
                    change:function(event,ui){
                        var _w = $(this).val();
                        if(_this.bodySetting[typeKey] == "%"){
                            _this.bodySetting[rwKey] = _w;
                            _w = _w+CM.bodySetting[typeKey];
                        }else{
                            _w = parseInt(_w);
                            _this.bodySetting[wKey] = _w;
                        }
                        changeSyncUI(_w);
                    }
                };
                if(_this.bodySetting[typeKey] == "%"){
                    opWidth.max = 100;
                }
                widthSpinnerInput.spinner(opWidth);
            },
            //初始化相对布局bodysetting
            initRelativeBodySetting:function(){
                var _this = this;
                var propertyItem = this.getPropertyItem();
                var spinnerEditor = this.getSpinnerEditor();
                var bodySettingList = $("#bodySettingList");
                bodySettingList.html("");
                this.initSpinnerBox(bodySettingList,propertyItem,spinnerEditor,"bodyWidth","页面宽度：","width","rWidth","widthType",function(_w){
                    _this.designer.css({
                        width:_w
                    });
                });
                this.initSpinnerBox(bodySettingList,propertyItem,spinnerEditor,"paddingLeft","内边距（左）","pL","rPL","pLType",function(_w){
                    _this.designer.css({
                        "padding-left":_w
                    });
                });

                this.initSpinnerBox(bodySettingList,propertyItem,spinnerEditor,"paddingRight","内边距（右）","pR","rPR","pRType",function(_w){
                    _this.designer.css({
                        "padding-right":_w
                    });
                });

                var pTBox = propertyItem.clone();
                pTBox.find(".property_label_title").html("内边距（上）");
                pTBox.find(".property_info").html($('<input type="text" id="paddingTop"/>'));
                bodySettingList.append(pTBox);
                $( "#paddingTop" ).spinner({
                    min:0,
                    change:function(event,ui){
                        var _w = $(this).val();
                        _w = parseInt(_w);
                        _this.bodySetting.pT = _w;
                        _this.designer.css({
                            "padding-top":_w
                        });
                    }
                });

                var pBBox = propertyItem.clone();
                pBBox.find(".property_label_title").html("内边距（上）");
                pBBox.find(".property_info").html($('<input type="text" id="paddingBottom"/>'));
                bodySettingList.append(pBBox);
                $( "#paddingBottom" ).spinner({
                    min:0,
                    change:function(event,ui){
                        var _w = $(this).val();
                        _w = parseInt(_w);
                        _this.bodySetting.pB = _w;
                        _this.designer.css({
                            "padding-bottom":_w
                        });
                    }
                });

                var bgBox = propertyItem.clone();
                bgBox.find(".property_label_title").html("背景颜色：");
                var colorSelect = $('<div class="color_select">').html($('<input type="text" id="bodyBg" readonly="readonly"/>'));
                bgBox.find(".property_info").html(colorSelect);
                bodySettingList.append(bgBox);
                var bgImgBox = propertyItem.clone();
                bgImgBox.find(".property_label_title").html("背景图片：");
                var imgListBox = $("<div class='body_img_list'>").css("border","none");
                for(var i=0;i<this.bgImgList.length;i++){
                    var imgItem = $("<div>").addClass("body_img_item");
                    imgItem.data("data",this.bgImgList[i]);
                    //var imgTitle = $("<div>").addClass("body_img_title").html(this.bgImgList[i].title);
                    var imgObj = $("<div>").addClass("body_img_bg").css({
                        "background-image":"url("+this.bgImgList[i].link+")",
                        "background-repeat":"no-repeat no-repeat",
                        "background-size":"100% 100%"
                    });
                    imgObj.appendTo(imgItem);
                    //imgTitle.appendTo(imgItem);
                    if(this.bodySetting.bgImage == this.bgImgList[i].link){
                        imgItem.addClass("selected");
                    }
                    imgItem.appendTo(bgImgBox);
                    imgListBox.append(imgItem);
                }
                bgImgBox.find(".property_info").html(imgListBox);
                imgListBox.delegate(".body_img_item","click",function(){
                    imgListBox.find(".body_img_item").removeClass("selected");
                    $(this).addClass("selected");
                    var data = $(this).data("data");
                    _this.bodySetting.bgImage = data.link;
                    _this.designer.css({
                        "background-image":"url("+data.link+")",
                        "background-repeat":"no-repeat no-repeat",
                        "background-size":"100% 100%"
                    });
                });
                $("#bodySettingList").append(bgImgBox);


            },
            //初始化body背景
            initBodyBg : function(){
                var _this = this;
                var bg = $("#bodyBg");
                bg.spectrum({
                    color:_this.bodySetting.bgColor,
                    theme: "sp-light",
                    showInput: true,
                    showAlpha:true,
                    showButtons:false,
                    preferredFormat:'hex',
                    change:function(color){
                        var r = parseInt(color._r);
                        var g = parseInt(color._g);
                        var b = parseInt(color._b);
                        var _color = 'rgba('+r+','+g+','+b+','+color.getAlpha()+')';
                        _this.bodySetting.bgColor = _color;
                        _this.designer.css({
                            "background-color":_color
                        });
                    }
                });
            },
            //绑定左侧拖拽事件
            bindDragList:function(){
                var box = $("#dragList");
                var selector = '.dragItem';
                var _this = this;
                $("body").delegate("*","mouseup",function(e){
                    _this.dragging = false;
                });
                $("body").delegate("*","mousemove",function(e){
                    if(_this.dragging && _this.clone){
                        _this.clone.css({
                            position:"absolute",
                            left:e.pageX,
                            top:e.pageY
                        });
                    }else if(_this.clone){
                        _this.clone.remove();
                    }

                    if(_this.relativeMoveStart && _this.cloneObj){
                        _this.cloneObj.css({
                            position:"absolute",
                            left:e.pageX-_this.designer.offset().left+35,
                            top:e.pageY-_this.designer.offset().top+35
                        });
                    }else if(_this.cloneObj){
                        _this.cloneObj.remove();
                    }

                });
                box.delegate(selector,"mousedown",function(e){
                    e.preventDefault();
                    _this.dragging = true;
                    _this.clone = $(this).clone();
                    _this.clone.appendTo($("body"));
                    _this.clone.data("options",$(this).data("options"));
                    _this.clone.css({
                        position:"absolute"
                        ,left:e.pageX
                        ,top:e.pageY
                        // ,width:$(this).width()
                        // ,height:$(this).height()
                    });
                });

                box.find("#groupList li").click(function(e){
                    box.find("#groupList li").removeClass("selected");
                    box.find(".groupCenter").removeClass("selected");
                    $(this).addClass("selected");
                    var bindId = $(this).attr("bindShow");
                    $("#"+bindId).addClass("selected");
                    _this.updateBodySetting();
                });
            },
            //设计器回显
            show:function(showJson,box){
                var _box = box||this.designer;
                var data = showJson||window.localStorage.getItem("designerData");
                data = data || '{"composerList":[]}';
                if(typeof(data) == "string"){
                    data = JSON.parse(data);
                }
                this.bindGroupList = data.bindGroupList||this.bindGroupList;
                this.designerType = data.designerType||this.designerType;
                this.bodySetting = data.bodySetting||this.bodySetting;
                this.containerList = data.containerList||this.containerList;
                $('#bodyBg').spectrum("set", this.bodySetting.bgColor);//设置选择器当前颜色
                _box.css({
                    width:this.bodySetting.width,
                    height:this.bodySetting.height,
                    "background-color":this.bodySetting.bgColor
                });
                if(this.bodySetting.bgImage){
                    _box.css({"background-image":"url("+this.bodySetting.bgImage+")",
                        "background-repeat":"no-repeat no-repeat",
                        "background-size":"100% 100%"
                    });
                }
                if(this.designerType == "relative"){
                    var configSetting = {};
                    for(var i=0;data&&data.composerList&&i<data.composerList.length;i++){
                        var composerConfig = data.composerList[i];
                        composerConfig.box = _box;
                        composerConfig.designer = true;
                        var _composerType = composerConfig.classname;
                        if(_composerType == "relativeContainer"){
                            var id = composerConfig.id;
                            configSetting[id] = composerConfig
                        }
                    }
                    for(var i=0;data&&data.containerList&&i<data.containerList.length;i++){
                        var containerId = data.containerList[i];
                        var _o = configSetting[containerId];
                        var _composerType = _o.classname;
                        var composer = new composerType[_composerType].func(_o);
                        var id = composer.id;
                        this.all[id] = composer;
                    }
                }
                for(var i=0;data&&data.composerList&&i<data.composerList.length;i++){
                    var composerConfig = data.composerList[i];
                    composerConfig.box = _box;
                    composerConfig.designer = true;
                    var _composerType = composerConfig.classname;
                    if(_composerType == "relativeContainer"){
                        continue;
                    }
                    if(this.designerType == "relative"){
                        var columnid = composerConfig.layout.columnid;
                        var _b = this.designer.find("#"+columnid);
                        composerConfig.box = _b;
                    }
                    var composer = new composerType[_composerType].func(composerConfig);
                    var id = composer.id;
                    this.all[id] = composer;
                }
                return data;
            },
            //设计器预览
            designerView:function(box){
                box.html("");
                var all = this.all;
                var bodySetting = this.bodySetting;
                var cssOption = {
                    "background-color":bodySetting.bgColor
                };
                if(bodySetting.bgImage){
                    cssOption["background-image"]="url("+bodySetting.bgImage+")";
                    cssOption["background-repeat"]="no-repeat no-repeat";
                    cssOption["background-size"]="100% 100%";
                }
                if(bodySetting.widthType=="%"){
                    cssOption.width = bodySetting.rWidth+bodySetting.widthType;
                }else{
                    cssOption.width = parseInt(bodySetting.width);
                }
                if(bodySetting.pLType=="%"){
                    cssOption["padding-left"] = bodySetting.rPL+bodySetting.pLType;
                }else{
                    cssOption["padding-left"] = parseInt(bodySetting.pL);
                }
                if(bodySetting.pRType=="%"){
                    cssOption["padding-right"] = bodySetting.rPR+bodySetting.pRType;
                }else{
                    cssOption["padding-right"] = parseInt(bodySetting.pR);
                }
                if(this.designerType == "absolute"){
                    cssOption.height = bodySetting.height;
                }else{
                    cssOption.height = "auto";
                }
                box.css(cssOption);

                if(this.designerType == "relative"){
                    for(var key in all){
                        var composerConfig = all[key].getSettings();
                        composerConfig.box = box;
                        composerConfig.designer = false;
                        composerConfig.designerType = composerConfig.designerType||this.designerType;
                        var _composerType = composerConfig.classname;
                        if(_composerType == "relativeContainer"){
                            new composerType[_composerType].func(composerConfig);
                        }

                    }
                }
                for(var key in all){
                    var composerConfig = all[key].getSettings();
                    composerConfig.box = box;
                    composerConfig.designer = false;
                    var _composerType = composerConfig.classname;
                    if(_composerType == "relativeContainer"){
                        continue;
                    }
                    if(this.designerType == "relative"){
                        var columnid = composerConfig.layout.columnid;
                        var _b = box.find("#"+columnid);
                        composerConfig.box = _b;
                    }
                    new composerType[_composerType].func(composerConfig);
                }

            },
            //生产模式页面展示
            view:function(showJson,box){
                var _box = box||this.designer;
                var data = showJson||window.localStorage.getItem("designerData");
                data = data || '{"composerList":[]}';
                if(typeof(data) == "string"){
                    data = JSON.parse(data);
                }
                var designerType = data.designerType||this.designerType;
                this.bodySetting = data.bodySetting||this.bodySetting;

                var bodySetting = this.bodySetting;
                var cssOption = {
                    "background-color":bodySetting.bgColor
                };
                if(bodySetting.bgImage){
                    cssOption["background-image"]="url("+bodySetting.bgImage+")";
                    cssOption["background-repeat"]="no-repeat no-repeat";
                    cssOption["background-size"]="100% 100%";
                }
                if(bodySetting.widthType=="%"){
                    cssOption.width = bodySetting.rWidth+bodySetting.widthType;
                }else{
                    cssOption.width = parseInt(bodySetting.width);
                }
                if(bodySetting.pLType=="%"){
                    cssOption["padding-left"] = bodySetting.rPL+bodySetting.pLType;
                }else{
                    cssOption["padding-left"] = parseInt(bodySetting.pL);
                }
                if(bodySetting.pRType=="%"){
                    cssOption["padding-right"] = bodySetting.rPR+bodySetting.pRType;
                }else{
                    cssOption["padding-right"] = parseInt(bodySetting.pR);
                }
                if(designerType == "absolute"){
                    cssOption.height = bodySetting.height;
                }else{
                    cssOption.height = "auto";
                }
                _box.css(cssOption).html("");

                if(this.designerType == "relative"){
                    for(var i=0;data&&data.composerList&&i<data.composerList.length;i++){
                        var composerConfig = data.composerList[i];
                        composerConfig.box = _box;
                        composerConfig.designer = false;
                        composerConfig.designerType = composerConfig.designerType||this.designerType;
                        var _composerType = composerConfig.classname;
                        if(_composerType == "relativeContainer"){
                            var composer = new composerType[_composerType].func(composerConfig);
                        }
                        var id = composer.id;
                        this.all[id] = composer;
                    }
                }
                for(var i=0;data&&data.composerList&&i<data.composerList.length;i++){
                    var composerConfig = data.composerList[i];
                    composerConfig.box = _box;
                    composerConfig.designer = false;
                    var _composerType = composerConfig.classname;
                    if(_composerType == "relativeContainer"){
                        continue;
                    }
                    if(this.designerType == "relative"){
                        var columnid = composerConfig.layout.columnid;
                        var _b = _box.find("#"+columnid);
                        composerConfig.box = _b;
                    }
                    var composer = new composerType[_composerType].func(composerConfig);
                    var id = composer.id;
                    this.all[id] = composer;
                }

                return data;
            },
            //保存逻辑
            _save:function(){
                var data = {
                    composerList:[]
                };
                for(var key in this.all){
                    var o = this.all[key];
                    var setting = o.getSettings();
                    data.composerList.push(setting);
                }
                data.bindGroupList= this.bindGroupList;
                data.bodySetting = this.bodySetting;
                data.designerType = this.designerType;
                data.containerList = this.containerList;
                var jsonStr = JSON.stringify(data);
                window.localStorage.setItem("designerData",jsonStr);
                return jsonStr;
            }
        };
        return composerMap;
    }
    define(dep, f1);
})()
