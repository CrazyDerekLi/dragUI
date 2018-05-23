(function(){
    var dep = [];
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
            allComposer:composerType,
            groupList:[],
            all:{},
            lock:false,
            current:null,
            dragging:false,
            clone:undefined,
            theme:"white",
            themePath:basePath+"css/",
            bodySetting:{
                width:1920,
                height:1080,
                bgColor:"#112247",
                className:""
            },
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
                        href: composerBasePath+"css/designer_"+this.theme+".css",
                        id:"designer_theme"
                    })
                    .appendTo("head");
                this.designer.css({
                    background:this.bodySetting.bgColor
                });
            },
            init:function(options){
                var _this = this;
                this.designer = options.designer;
                this.groupList = options.groupList;
                this.theme = options.theme||this.theme;

                this.changeTheme(this.theme);

                this.designer.css({
                    width:this.bodySetting.width,
                    height:this.bodySetting.height
                });
                this.designer.addClass(this.bodySetting.className);
                this.designer.html("");
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
                            classname:"c_label",
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
                        _this.clone.remove();
                        delete _this.clone;
                        _this.clone = undefined;
                    }

                });
                //鼠标mousdown时取消设计器选中控件
                $("body").delegate("*","mousedown",function(e){
                    if(
                        !$(e.target).hasClass("colorpicker")
                        && !$(e.target).parents(".colorpicker").get(0)
                        && !$(e.target).parents("#propertyList").get(0)
                        && !$(e.target).parents(".designer_drag_tools").get(0)
                    ){
                        _this.designer.find(".designer_drag_obj").removeClass("selected");
                        _this.current = null;
                    }
                });
                //鼠标mousup时删除控件克隆对象
                $("body").delegate("*","mouseup",function(e){
                    if(_this.clone){
                        _this.clone.remove();
                    }
                    _this.clone = undefined;
                });
                $("body").delegate("*","click",function(e){

                    if(
                        !$(e.target).hasClass("colorpicker")
                        && !$(e.target).parents(".colorpicker").get(0)
                        && !$(e.target).parents("#propertyList").get(0)
                        && !$(e.target).parents(".designer_drag_tools").get(0)
                    ){
                        var propertyBox = $("#propertyList");
                        if(propertyBox.get(0)){
                            var bodySettingColorPickerid = $("#bodyBg").data("colorpickerId");
                            $("body .colorpicker").not("#"+bodySettingColorPickerid).remove();

                            propertyBox.hide();
                        }
                    }

                });
                this.dragList = $("#dragList");

                this.initDragList();
                this.bindDragList();

                var propertyBox = $("#propertyList");
                _this.initBodyBg();

                $("#designer_save").click(function(e){
                    _this.save();
                    alert("保存成功");
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
            },
            initDragList: function(){
                this.dragList.find(".groupList li").not("#body_setting").remove();
                this.dragList.find(".groupCenter").not("#bodySettingBox").remove();
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
            initBodyBg : function(){
                var _this = this;
                $('#bodyBg').css('backgroundColor', this.bodySetting.bgColor);
                $('#bodyBg').ColorPicker({
                    color: this.bodySetting.bgColor,
                    onShow: function (colpkr) {
                        $(colpkr).fadeIn(500);
                        return false;
                    },
                    onHide: function (colpkr) {
                        $(colpkr).fadeOut(500);
                        return false;
                    },
                    onChange: function (hsb, hex, rgb) {
                        $('#bodyBg').css('backgroundColor', '#' + hex);
                        $('#bodyBg input').val('#' + hex);
                        _this.bodySetting.bgColor = "#"+hex;
                        _this.designer.css({
                            background:"#"+hex
                        });
                    }
                });
            },
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
                box.find("#groupList li").click(function(e){
                    box.find("#groupList li").removeClass("selected");
                    box.find(".groupCenter").removeClass("selected");
                    $(this).addClass("selected");
                    var bindId = $(this).attr("bindShow");
                    $("#"+bindId).addClass("selected");
                    $("#bodyWidth").val(_this.bodySetting.width);

                    $("#bodyHeight").val(_this.bodySetting.height);

                    $("#bodyBg input").val(_this.bodySetting.bgColor);

                });
            },
            show:function(box){
                var _box = box||this.designer;
                var data = window.localStorage.getItem("designerData");
                data = data?JSON.parse(data):{composerList:[]};
                this.bodySetting = data.bodySetting||this.bodySetting;
                $('#bodyBg').css('backgroundColor', this.bodySetting.bgColor);
                _box.css({
                    width:this.bodySetting.width,
                    height:this.bodySetting.height,
                    background:this.bodySetting.bgColor
                });
                for(var i=0;data&&data.composerList&&i<data.composerList.length;i++){
                    var composerConfig = data.composerList[i];
                    composerConfig.box = _box;
                    composerConfig.designer = true;
                    var _composerType = composerConfig.classname;
                    var composer = new composerType[_composerType].func(composerConfig);
                    var id = composer.id;
                    this.all[id] = composer;
                }
            },
            designerView:function(box){
                box.html("");
                var all = this.all;
                var bodySetting = this.bodySetting;
                box.css({
                    width:bodySetting.width,
                    height:bodySetting.height,
                    background:bodySetting.bgColor
                });
                for(var key in all){
                    var composerConfig = all[key].getSettings();
                    composerConfig.box = box;
                    composerConfig.designer = false;
                    var _composerType = composerConfig.classname;
                    new composerType[_composerType].func(composerConfig);
                }

            },
            view:function(box){
                var _box = box||this.designer;
                var data = window.localStorage.getItem("designerData");
                data = data?JSON.parse(data):{composerList:[]};
                for(var i=0;data&&data.composerList&&i<data.composerList.length;i++){
                    var composerConfig = data.composerList[i];
                    composerConfig.box = _box;
                    composerConfig.designer = false;
                    var _composerType = composerConfig.classname;
                    var composer = new composerType[_composerType].func(composerConfig);
                    var id = composer.id;
                    this.all[id] = composer;
                }
            },
            save:function(){
                var data = {
                    composerList:[]
                };
                for(var key in this.all){
                    var o = this.all[key];
                    var setting = o.getSettings();
                    data.composerList.push(setting);
                }
                data.bodySetting = this.bodySetting;
                var jsonStr = JSON.stringify(data);
                console.log(jsonStr);
                window.localStorage.setItem("designerData",jsonStr);
                return jsonStr;
            }
        };
        return composerMap;
    }
    define(dep, f1);
})()
