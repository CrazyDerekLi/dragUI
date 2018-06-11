require.config({
    paths:{
        iframeConfig:vendorPath+"dragUI/js/composer/iframeConfig"
    }
});
define(['iframeConfig'], function(iframeConfig){
    //dom对象resize事件的实现
    (function($, h, c) {
        var a = $([]), e = $.resize = $.extend($.resize, {}), i, k = "setTimeout", j = "resize", d = j
            + "-special-event", b = "delay", f = "throttleWindow";
        e[b] = 350;
        e[f] = true;
        $.event.special[j] = {
            setup : function() {
                if (!e[f] && this[k]) {
                    return false
                }
                var l = $(this);
                a = a.add(l);
                $.data(this, d, {
                    w : l.width(),
                    h : l.height()
                });
                if (a.length === 1) {
                    g()
                }
            },
            teardown : function() {
                if (!e[f] && this[k]) {
                    return false
                }
                var l = $(this);
                a = a.not(l);
                l.removeData(d);
                if (!a.length) {
                    clearTimeout(i)
                }
            },
            add : function(l) {
                if (!e[f] && this[k]) {
                    return false
                }
                var n;
                function m(s, o, p) {
                    var q = $(this), r = $.data(this, d);
                    r.w = o !== c ? o : q.width();
                    r.h = p !== c ? p : q.height();
                    n.apply(this, arguments)
                }
                if ($.isFunction(l)) {
                    n = l;
                    return m
                } else {
                    n = l.handler;
                    l.handler = m
                }
            }
        };
        function g() {
            i = h[k](function() {
                a.each(function() {
                    var n = $(this), m = n.width(), l = n.height(), o = $
                        .data(this, d);
                    if (m !== o.w || l !== o.h) {
                        n.trigger(j, [ o.w = m, o.h = l ])
                    }
                });
                g()
            }, e[b])
        }
    })(jQuery, this);
    var o = {
        //公共编辑配置
        commonEditor:function (box,setting,composer){
            var editor = undefined;
            var _this = this;
            var val = this.getComposerValue(setting.field,composer);
            var opeType = setting.opeType||"";
            //console.log(setting);
            if(setting.type == "text"){
                editor = $("<input type='text'>").val(val);
                box.html(editor);
                editor.data("oldValue",val);
                editor.data("newValue",val);
                editor.change(function(e){
                    var oldValue = $(this).data("newValue");
                    $(this).data("oldValue",oldValue);
                    var newValue = $(this).val();
                    $(this).data("newValue",newValue);
                    _this.editorChangeData(setting,composer,newValue,opeType,oldValue);
                });
            }else if(setting.type == "spinner"){
                if(composer.designerType == "relative"
                    && setting.field.length==2
                    && setting.field[0]=="layout"){
                    if(setting.field[1] == "h"){
                        editor = $("<input type='text'>").val(val);
                        var _layoutid = composer.layout.layoutid;
                        if(CM.all[_layoutid].property.columnFit == "1"){
                            editor.attr("disabled","disabled");
                        }else{
                            editor.removeAttr("disabled");
                        }
                        box.html(editor);
                        editor.data("oldValue",val);
                        editor.data("newValue",val);
                        editor.change(function(){
                            var oldValue = $(this).data("newValue");
                            $(this).data("oldValue",oldValue);
                            var newValue = $(this).val();
                            $(this).data("newValue",newValue);
                            _this.editorChangeData(setting,composer,newValue,opeType,oldValue);
                        });
                    }
                }else{
                    editor = $("<input type='text'>").val(val);
                    box.html(editor);
                    editor.data("oldValue",val);
                    editor.data("newValue",val);
                    var options = setting.options||{};
                    options.min = options.min || 0;
                    options.stop = function(event, ui){
                        var oldValue = $(this).data("newValue");
                        $(this).data("oldValue",oldValue);
                        var newValue = $(this).val();
                        $(this).data("newValue",newValue);
                        _this.editorChangeData(setting,composer,newValue,opeType,oldValue);
                    };
                    editor.spinner(options);
                }

            }else if(setting.type == "checkbox"){
                editor = $("<input type='checkbox'>").val(val);
                if(val == "1"){
                    editor.prop("checked","true");
                }
                box.html(editor);
                editor.data("oldValue",val);
                editor.data("newValue",val);
                editor.click(function(){
                    var _v = $(this).is(':checked')?"1":"0";
                    var oldValue = $(this).data("newValue");
                    $(this).data("oldValue",oldValue);
                    var newValue = _v;
                    $(this).data("newValue",newValue);
                    _this.editorChangeData(setting,composer,newValue,opeType,oldValue);
                });

            }else if(setting.type == "color"){
                editor = $(' <div class="color_select"></div>');
                var input = $('<input type="text" readonly="readonly">');
                editor.append(input);
                box.html(editor);
                editor.data("oldValue",val);
                editor.data("newValue",val);
                input.spectrum({
                    color:val,
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
                        var oldValue = $(this).data("newValue");
                        editor.data("oldValue",oldValue);
                        var newValue = _color;
                        editor.data("newValue",newValue);
                        _this.editorChangeData(setting,composer,newValue,opeType,oldValue);
                    }
                });
            }else if(setting.type == "slider"){
                editor = $('<div class="editor_slider">');

                var slider = $('<div>');
                var handle = $('<div class="slider_style ui-slider-handle"></div>');
                slider.append(handle);
                editor.append(slider);
                editor.data("oldValue",val);
                editor.data("newValue",val);
                var options = setting.options||{};
                var _formatter = options.formatter||function(val,options){
                    return val;
                };
                if(options.dw){
                    var dwWidth = options.dwWidth||24;
                    var align = options.align||"right";
                    slider.css({
                        'margin-right':dwWidth
                    })
                    var dw = $("<div class='slider-dw'>");
                    dw.css({
                        'text-align':align,
                        width:dwWidth
                    });
                    dw.html(options.dw);
                    editor.append(dw);
                }
                box.html(editor);
                slider.slider({
                    create: function() {
                        val = val+""||"";
                        var slider_val = val.replace(/[^0-9]/ig,"");
                        $( this ).slider({
                            value : slider_val
                        })
                        handle.text( $( this ).slider( "value" ));
                    },
                    slide: function( event, ui ) {
                        handle.text( ui.value);
                        var _v = _formatter(ui.value,options);
                        var oldValue = $(this).data("newValue");
                        editor.data("oldValue",oldValue);
                        var newValue = _v;
                        editor.data("newValue",newValue);
                        _this.editorChangeData(setting,composer,newValue,opeType,oldValue);
                    }
                });
            }
            if(composer.designerType == "relative"
                && setting.field.length==2
                && setting.field[0]=="layout"
                && (setting.field[1] == "l"||setting.field[1] == "t"||setting.field[1] == "index"||setting.field[1] == "w")){
                return false;
            }
            return true;
        },
        //获取控件属性值
        getComposerValue:function(list,o){
            if(list.length>0){
                var _o = o[list[0]];
                var _list = list.slice(1)||[];
                return this.getComposerValue(_list,_o);
            }else{
                return o;
            }
        },
        //给控件属性赋值
        setComposerValue:function(list,o,value,type){
            if(list.length>1){
                var _o = o[list[0]];
                var _list = list.slice(1)||[];
                this.setComposerValue(_list,_o,value,type);
            }else if(list.length == 1){
                if(type=="spinner"){
                    value = parseInt(value);
                }
                o[list[0]] = value;
            }
        },
        //添加操作缓存，用于redo和todo
        addOpe:function(o){
            CM.opeList = CM.opeList||[];
            var _ind = CM.opeIndex;
            CM.opeList.splice(0,_ind,o);
            CM.opeIndex = 0;
        },
        //公共的数据修改事件
        editorChangeData:function(setting,composer,value,opeType,oldValue){
            if(opeType == "1"){
                var o = {
                    oldValue:oldValue,
                    newValue:value,
                    composerId:composer.id,
                    type:"editorUpdate",
                    setting:setting
                };
                this.addOpe(o);
            }
            if(composer.designerType == "relative"
                && setting.field.length==2
                && setting.field[0]=="layout"
                && setting.field[1] == "h"){
                this.setComposerValue(setting.field,composer,value,"text");
            }else{
                this.setComposerValue(setting.field,composer,value,setting.type);
            }

            composer._syncUI();
            composer.chooseMe();
        },
        //1为redo，0位todo，将来有新的类型在这添加
        doOpeSetting:function(setting,type){
            var _this = this;
            //console.log(setting);
            if(type == "1"){
                if(setting.type == "insertAbsoluteComposer"){
                    var composer = CM.all[setting.composerId];
                    if(composer){
                        composer.destroy();
                    }
                }else if(setting.type == "editorUpdate"){
                    var sett = setting.setting;
                    var composer = CM.all[setting.composerId];
                    var value = setting.oldValue;
                    if(composer){
                        _this.editorChangeData(sett,composer,value,sett.type,"");
                    }

                }else if(setting.type == "dragUpdate"){
                    var position = setting.oldValue;
                    var composer = CM.all[setting.composerId];
                    if(composer){
                        composer.layout.l = position.left;
                        composer.layout.t = position.top;
                        composer.syncDragUI();
                        _this.updateProperty(composer,"base","propertySetting");

                    }

                }else if(setting.type == "resizeUpdate"){
                    var size = setting.oldValue;
                    var composer = CM.all[setting.composerId];
                    if(composer){
                        composer.layout.w = size.w;
                        composer.layout.h = size.h;
                        composer._syncUI();
                        composer.afterResize(composer.composer);
                    }

                }else if(setting.type == "commonSettingChange"){
                    for(var i=0;i<setting.composerList.length;i++){
                        var layout = setting.oldValue[i];
                        var composer = CM.all[setting.composerList[i]];
                        if(composer){
                            composer.layout.w = layout.w;
                            composer.layout.h = layout.h;
                            composer.layout.l = layout.l;
                            composer.layout.t = layout.t;
                            composer.layout.index = layout.index;
                            composer._syncUI();
                            composer.afterResize(composer.composer);
                        }
                    }
                }
            }else if(type == "0"){
                if(setting.type == "insertAbsoluteComposer"){
                    var composer = CM.all[setting.composerId];
                    if(composer){
                        composer.destroy();
                    }
                    var composer = new CM.allComposer[setting.newValue.composerSettings.classname].func(setting.newValue.composerSettings);
                    CM.all[composer.id] = composer;
                }else if(setting.type == "editorUpdate"){
                    var sett = setting.setting;
                    var composer = CM.all[setting.composerId];
                    var value = setting.newValue;
                    if(composer){
                        _this.editorChangeData(sett,composer,value,sett.type,"");
                    }

                }else if(setting.type == "dragUpdate"){
                    var position = setting.newValue;
                    var composer = CM.all[setting.composerId];
                    if(composer){
                        composer.layout.l = position.left;
                        composer.layout.t = position.top;
                        console.log(position);
                        composer.syncDragUI();
                        _this.updateProperty(composer,"base","propertySetting");

                    }

                }else if(setting.type == "resizeUpdate"){
                    var size = setting.newValue;
                    var composer = CM.all[setting.composerId];
                    if(composer){
                        composer.layout.w = size.w;
                        composer.layout.h = size.h;
                        composer._syncUI();
                        composer.afterResize(composer.composer);
                    }

                }else if(setting.type == "commonSettingChange"){
                    for(var i=0;i<setting.composerList.length;i++){
                        var layout = setting.newValue[i];
                        var composer = CM.all[setting.composerList[i]];
                        if(composer){
                            composer.layout.w = layout.w;
                            composer.layout.h = layout.h;
                            composer.layout.l = layout.l;
                            composer.layout.t = layout.t;
                            composer.layout.index = layout.index;
                            composer._syncUI();
                            composer.afterResize(composer.composer);
                        }
                    }
                }
            }
        },
        //公共初始化配置property
        initProperty:function(composer,propertyCode,propertySettingKey){
            var util = this;
            propertyCode = propertyCode||"";
            var boxid = propertyCode+"PropertyList"+composer.id;
            var groupid = propertyCode+"PropertyGroupList"+composer.id;
            var containerid = propertyCode+"PropertyBox"+composer.id;
            var box = $("#"+boxid);
            var groupListBox = $("#"+groupid);
            var propertyContainerBox = $("#"+containerid);
            if(!box.get(0)){
                box = $('<div id="'+boxid+'" class="propertyList">');
                box.css({
                    display:"none",
                    'z-index':101
                });
                groupListBox = $('<div id="'+groupid+'" class="groupList">');
                propertyContainerBox = $('<div id="'+containerid+'" class="groupCenter selected">');
                box.append(groupListBox).append(propertyContainerBox);
                box.appendTo($("body"));
            }
            box.data("composer",composer);

            var _this = composer;

            var propertySetting = _this[propertySettingKey];

            groupListBox.html("");
            for(var i=0;propertySetting&&i<propertySetting.length;i++){
                var groupName = propertySetting[i].groupName;

                var groupType = propertySetting[i].groupType;
                var group = $("<li>").html(groupName)
                if(groupType){
                    var url = iframeConfig[groupType];
                    group.data("setting",propertySetting[i]);
                    group.click(function(e){
                        groupListBox.find("li").removeClass("selected");
                        $(this).addClass("selected");
                        var iframe = $('<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" allowtransparency="yes" >');
                        iframe.attr("src",url);
                        propertyContainerBox.html(iframe).css({
                            "overflow":"hidden"
                        });
                        _w = iframe.get(0).contentWindow;
                        _w.composer = composer;
                        _w.theme = CM.theme;
                        propertyContainerBox.resize(function(e){
                            iframe.css({
                                width:propertyContainerBox.width(),
                                height:propertyContainerBox.height()
                            });
                        });
                        propertyContainerBox.resize();
                    });
                }else{
                    group.data("setting",propertySetting[i].groupList);
                    group.data("composer",_this);
                    group.click(function(e){
                        var comp = $(this).data("composer");
                        groupListBox.find("li").removeClass("selected");
                        $(this).addClass("selected");
                        var settingData = $(this).data("setting");
                        propertyContainerBox.html("");
                        for(var _i=0;_i<settingData.length;_i++){
                            var sett = settingData[_i];
                            var childGroup = $("<div class='propertyGroup'>");
                            propertyContainerBox.append(childGroup);
                            var childGroupTitle = $("<div class='property_title'>").html(sett.childGroupName);
                            var childGroupList = $("<div class='property_list'>");
                            childGroup.append(childGroupTitle);
                            childGroup.append(childGroupList);

                            var list = sett.childGroupList;
                            for(var _j=0;_j<list.length;_j++){
                                var item = $("<div class='property_item'>");
                                var title = $("<div class='property_label_title'>").html(list[_j].title);
                                var itemLabel = $("<div class='property_label'>").html(title);
                                var itemEditor = $("<div class='property_info'>");
                                item.append(itemLabel).append(itemEditor);
                                childGroupList.append(item);
                                if(list[_j].editor){
                                    list[_j].editor(itemEditor,list[_j],comp);
                                }else{
                                    var flag = util.commonEditor(itemEditor,list[_j],comp);
                                    if(!flag){
                                        item.hide();
                                    }
                                }
                            }
                            childGroupList.append($("<div class='clear'>"));

                        }
                    });
                }


                group.appendTo(groupListBox);
            }
            groupListBox.find("li").first().trigger("click");
        },
        //更新property数据
        updateProperty:function(composer,propertyCode,propertySettingKey){

            propertyCode = propertyCode||"";
            var boxid = propertyCode+"PropertyList"+composer.id;
            var groupid = propertyCode+"PropertyGroupList"+composer.id;
            var groupListBox = $("#"+groupid);
            var box = $("#"+boxid);
            $(".propertyList").not("#"+boxid).hide();
            var _comp = box.data("composer")||{};
            if(_comp.id && composer.id && _comp.id == composer.id){
                if(groupListBox.get(0)){
                    var _this = composer;
                    var propertySetting = _this[propertySettingKey];
                    var index = groupListBox.find("li").index(groupListBox.find("li.selected"));
                    if(index>=propertySetting.length){
                        index = 0;
                    }
                    if(propertySetting.length>0 && propertySetting[index]){
                        var groupList = propertySetting[index].groupList;
                        groupListBox.find("li:eq("+index+")").data("setting",groupList).trigger("click");
                    }

                }
            }else{
                this.initProperty(composer,propertyCode,propertySettingKey);
            }

        },
        //显示property面板
        showProperty:function(composer,propertyCode,propertySettingKey){
            $(".propertyList").hide();
            var boxid = propertyCode+"PropertyList"+composer.id;
            var box = $("#"+boxid);
            box.show();
        }

    };
    return o;
});