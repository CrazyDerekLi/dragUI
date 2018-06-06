(function(){
    var dep = [];
    composerConfig.relativeContainer = 'dragUI/js/composer/relativeContainer';
    var realtiveGroup = {
        groupName:"布局",groupList:[{
            groupName:"布局组件",composerList:[
                {type:"relativeContainer",title:"6:6",icon:vendorPath+"dragUI/image/6-6.png",options:{property:{columns:["6","6"]}}}
                ,{type:"relativeContainer",title:"4:8",icon:vendorPath+"dragUI/image/4-8.png",options:{property:{columns:["4","8"]}}}
                ,{type:"relativeContainer",title:"8:4",icon:vendorPath+"dragUI/image/8-4.png",options:{property:{columns:["8","4"]}}}
                ,{type:"relativeContainer",title:"4:4:4",icon:vendorPath+"dragUI/image/4-4-4.png",options:{property:{columns:["4","4","4"]}}}
                ,{type:"relativeContainer",title:"5:5:2",icon:vendorPath+"dragUI/image/5-5-2.png",options:{property:{columns:["5","5","2"]}}}
                ,{type:"relativeContainer",title:"5:2:5",icon:vendorPath+"dragUI/image/5-2-5.png",options:{property:{columns:["5","2","5"]}}}
                ,{type:"relativeContainer",title:"2:5:5",icon:vendorPath+"dragUI/image/2-5-5.png",options:{property:{columns:["2","5","5"]}}}
                ,{type:"relativeContainer",title:"3:3:6",icon:vendorPath+"dragUI/image/3-3-6.png",options:{property:{columns:["3","3","6"]}}}
                ,{type:"relativeContainer",title:"3:6:3",icon:vendorPath+"dragUI/image/3-6-3.png",options:{property:{columns:["3","6","3"]}}}
                ,{type:"relativeContainer",title:"6:3:3",icon:vendorPath+"dragUI/image/6-3-3.png",options:{property:{columns:["6","3","3"]}}}
                ,{type:"relativeContainer",title:"3:3:3:3",icon:vendorPath+"dragUI/image/3-3-3-3.png",options:{property:{columns:["3","3","3","3"]}}}
                ,{type:"relativeContainer",title:"2:2:2:2:2:2",icon:vendorPath+"dragUI/image/2-2-2-2-2-2.png",options:{property:{columns:["2","2","2","2","2","2"]}}}
            ]
        }]
    };
    for(var key in composerConfig){
        dep.push(key);
    }
    console.log(dep);
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
        console.log(composerType);
        var composerMap = {
            allComposer:composerType,
            groupList:[],
            all:{},
            lock:false,
            current:null,
            dragging:false,
            clone:undefined,
            cloneObj:null,
            relativeMoveStart:false,
            designerType:"absolute",
            theme:"white",
            themePath:basePath+"css/",
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
                className:""
            },
            save:function(){
                alert("保存成功");
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
                        href: vendorPath+"dragUI/css/designer_"+this.theme+".css",
                        id:"designer_theme"
                    })
                    .appendTo("head");
                this.designer.css({
                    background:this.bodySetting.bgColor
                });
            },
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

                this.changeTheme(this.theme);


                this.designer.addClass(this.bodySetting.className);
                //this.designer.html("");
                console.log(this.designerType);
                if(this.designerType == "relative"){
                    this.bindRelativeEvent();
                    this.initRelativeBodySetting();
                }else{
                    this.bindAbsoluteEvent();
                    this.initAbsoluteBodySetting();
                }


                //鼠标mousdown时取消设计器选中控件
                $("body").delegate("*","mousedown",function(e){
                    if(
                        !$(e.target).hasClass("colorpicker")
                        && !$(e.target).parents(".colorpicker").get(0)
                        && !$(e.target).parents(".propertyList").get(0)
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
                    if(_this.cloneObj){
                        _this.cloneObj.remove();
                        _this.relativeMoveStart = false;
                    }
                });
                $("body").delegate("*","click",function(e){

                    if(
                        !$(e.target).hasClass("colorpicker")
                        && !$(e.target).parents(".colorpicker").get(0)
                        && !$(e.target).parents(".propertyList").get(0)
                        && !$(e.target).parents(".designer_drag_tools").get(0)
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
            },
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
                        if(type!="relativeContainer"){
                            if(_this.designer.is(_c)){
                                var newContainerOptions = $.extend({},options,{property:{columns:["12"]}});
                                var container = new _this.allComposer["relativeContainer"].func(newContainerOptions);
                                var id = container.id;
                                _this.all[id] = container;
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

                        if(type!="relativeContainer"){
                            var columnComposers = _this.all[options.layout.layoutid].property.columnComposers||{};
                            columnComposers[options.layout.columnid] = columnComposers[options.layout.columnid]||[];
                            columnComposers[options.layout.columnid].push(id);
                        }

                        _this.all[id] = composer;
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
                        }
                        if(_this.cloneObj){
                            _this.cloneObj.remove();
                            _this.cloneObj = undefined;
                            _this.relativeMoveStart = false;
                        }

                    }

                });
            },
            bindAbsoluteEvent:function(){
                this.designer.css({
                    width:this.bodySetting.width,
                    height:this.bodySetting.height
                });
                var _this = this;
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
                        _this.clone.remove();
                        delete _this.clone;
                        _this.clone = undefined;
                    }


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
            getPropertyItem:function(){
                var propertyItem = $("<div class='property_item'>");
                var propertyLabel = $("<div class='property_label'>");
                var propertyInfo = $("<div class='property_info'>");
                var propertyTitle = $("<div class='property_label_title'>");
                propertyLabel.append(propertyTitle);
                propertyItem.append(propertyLabel).append(propertyInfo);
                return propertyItem;
            },
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

                $("#bodySettingList").html("").append(widthBox).append(heightBox).append(bgBox);

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

            },
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
                    move:function(color){
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
                            left:e.pageX-_this.designer.offset().left+25,
                            top:e.pageY-_this.designer.offset().top+25
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
            show:function(showJson,box){
                var _box = box||this.designer;
                var data = showJson||window.localStorage.getItem("designerData");
                data = data || '{"composerList":[]}';
                if(typeof(data) == "string"){
                    data = JSON.parse(data);
                }
                this.designerType = data.designerType||this.designerType;
                this.bodySetting = data.bodySetting||this.bodySetting;
                $('#bodyBg').spectrum("set", this.bodySetting.bgColor);//设置选择器当前颜色
                _box.css({
                    width:this.bodySetting.width,
                    height:this.bodySetting.height,
                    background:this.bodySetting.bgColor
                });
                if(this.designerType == "relative"){
                    for(var i=0;data&&data.composerList&&i<data.composerList.length;i++){
                        var composerConfig = data.composerList[i];
                        composerConfig.box = _box;
                        composerConfig.designer = true;
                        var _composerType = composerConfig.classname;
                        if(_composerType == "relativeContainer"){
                            var composer = new composerType[_composerType].func(composerConfig);
                            var id = composer.id;
                            this.all[id] = composer;
                        }
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
            designerView:function(box){
                box.html("");
                var all = this.all;
                var bodySetting = this.bodySetting;
                var cssOption = {
                    background:bodySetting.bgColor
                };
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
                    background:bodySetting.bgColor
                };
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
            _save:function(){
                var data = {
                    composerList:[]
                };
                for(var key in this.all){
                    var o = this.all[key];
                    var setting = o.getSettings();
                    data.composerList.push(setting);
                }
                data.bodySetting = this.bodySetting;
                data.designerType = this.designerType;
                var jsonStr = JSON.stringify(data);
                window.localStorage.setItem("designerData",jsonStr);
                return jsonStr;
            }
        };
        return composerMap;
    }
    define(dep, f1);
})()
