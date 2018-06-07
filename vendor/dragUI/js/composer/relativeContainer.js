require.config({
});
define(["util"], function(util){
    var classname = "relativeContainer";
    var classTitle = "容器组件";
    var classIcon = vendorPath+"dragUI/image/6-6.png";
    var relativeObj = function(options){
        var relative = {
            classname:"",
            classTitle:"",
            classIcon:"",
            id:"",
            box:null,
            container:null,
            propertySetting:[
                {
                    groupName:"列",groupList:[
                        {
                            childGroupName:"列配置",
                            childGroupList:[
                                {value:"",type:"text",field:["property","columnsSetting"],title:"列布局配置"},
                            ]
                        }
                    ]
                }
            ],
            property:{
                columnComposers:{},
                rowIndex:0,
                columnsSetting:"12"
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
                this._createContainer();
                var id = this.id;
                CM.containerList = CM.containerList||[];
                CM.containerList.push(id);
                return this;
            },
            _createContainer:function(){

                if(!this.container||!this.container.get()){
                    this.container = $("<div class='designer_container_obj'>");
                }
                if(this.designer){
                    this.container.addClass("designer");
                }
                var row = $("<div class='row'>");
                this.property.columnsSetting = this.property.columnsSetting||"12";
                this.columns = this.property.columnsSetting.split(":");

                for(var i=0;i<this.columns.length;i++){
                    var column = $('<div>').addClass("col-xs-"+this.columns[i]);
                    column.addClass("container_column");
                    if(this.designer){
                        column.css({
                            border:"1px dotted #aaa",
                            "min-height": "30px"
                        });
                    }

                    column.attr("id",this.id+"_"+i);
                    this.property.columnComposers[this.id+"_"+i] = this.property.columnComposers[this.id+"_"+i]||[];
                    row.append(column);
                }



                this.container.html("");
                this.container.append(row);

                this.box.append(this.container);
                if(this.designer){
                    this._bindContainerEvent();
                }
            },
            setComposer:function(){
                for(var key in this.property.columnComposers){
                    var arr = this.property.columnComposers[key]||[];
                    for(var i=0;i<arr.length;i++){
                        var id = arr[i];
                        var composer = CM.all[id];
                        var options = composer.getSettings();
                        var columnid = options.layout.columnid;
                        var _b = CM.designer.find("#"+columnid);
                        options.box = _b;
                        options.designer = true;
                        // composer.drag.appendTo($("#"+key));
                        var _c = new CM.allComposer[composer.classname].func(options);
                        var id = _c.id;
                        CM.all[id] = _c;

                    }
                }
            },
            initAllColumns:function(){

                var arr = [];
                for(var key in this.property.columnComposers){
                    var _i = key.split("_");
                    var i = this.columns.length-1;
                    if(i<parseInt(_i[1])){
                        arr.push(key);
                    }
                }
                var newArr = [];
                for(var m=0;m<arr.length;m++){
                    var key = arr[m];
                    var composerList = this.property.columnComposers[key];
                    newArr = newArr.concat(composerList);
                }
                for(var i=0;i<arr.length;i++){
                    var key = arr[i];
                    delete this.property.columnComposers[key];
                }
                for(var i=0;i<newArr.length;i++){
                    var id = newArr[i];
                    var composer = CM.all[id];
                    composer.layout.layoutid = this.id;
                    composer.layout.columnid = this.id+"_"+(this.columns.length-1);
                }
                var lastColumns = this.property.columnComposers[this.id+"_"+(this.columns.length-1)];
                this.property.columnComposers[this.id+"_"+(this.columns.length-1)] = lastColumns.concat(newArr);

            },
            _getTools:function(){
                var tools = this.getTools()||[];
                var setting = $("<i class='fa fa-cog' title='配置'>");
                var up = $("<i class='fa fa-arrow-alt-circle-up' title='上移'>");
                var down = $("<i class='fa fa-arrow-alt-circle-down' title='下移'>");
                var del = $("<i class='fa fa-trash-alt' title='删除'>");
                var _this = this;
                setting.data("container",this);
                up.data("container",this);
                down.data("container",this);
                setting.mousedown(function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    var container = $(this).data("container");
                    util.initProperty(container,"container","propertySetting");
                    util.showProperty(container,"container","propertySetting");
                });
                up.mousedown(function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    var _c = $(this).data("container");
                    var _id = _c.id;
                    var _ind = CM.containerList.indexOf(_id);
                    if(_ind>=1){
                        var _ind1 = _ind-1;
                        var upCId = CM.containerList[_ind1];
                        var upC = CM.all[upCId];
                        upC.container.before(_c.container);
                        CM.containerList.splice(_ind,1);
                        CM.containerList.splice(_ind1,0,_id);
                    }
                });
                down.mousedown(function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    var _c = $(this).data("container");
                    var _id = _c.id;
                    var _ind = CM.containerList.indexOf(_id);
                    if(_ind<CM.containerList.length-1){
                        var _ind1 = _ind+1;
                        var downCId = CM.containerList[_ind1];
                        var downC = CM.all[downCId];
                        downC.container.after(_c.container);
                        CM.containerList.splice(_ind,1);
                        CM.containerList.splice(_ind1,0,_id);
                    }
                });
                del.mousedown(function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    _this.destroy();
                });
                tools.push(setting);
                tools.push(up);
                tools.push(down);
                tools.push(del);
                return tools;
            },
            getTools:function(){
                return [];
            },
            _bindContainerEvent:function(){
                var _this = this;
                var head = $('<div class="designer_container_head">');
                var showBtn = $('<i class="fa fa-angle-left"></i>');
                var tools = $('<div class="designer_container_tools">');
                head.append(showBtn).append(tools);
                this.container.append(head);
                var toolsList = this._getTools();
                for(var i=0;i<toolsList.length;i++){
                    tools.append(toolsList[i]);
                }
                head.hover(function(){
                    $(this).addClass("selected");
                },function(){
                    $(this).removeClass("selected");
                });
                //		绑定设计器拖拽/resize事件
                this.container.addClass("designer_container_obj");
                this.container.hover(function(e){
                    $(this).addClass("selected");
                },function(e){
                    $(this).removeClass("selected");
                });
                this.container.attr("id",this.id);
            },
            syncContainerUI:function(){


                this.container.html("");
                this._createContainer();
                this.initAllColumns();
                this.setComposer();
            },
            getSettings:function(){
                var o = {
                    id:this.id,
                    classname:this.classname,
                    property:this.property
                };
                return o;
            },
            _syncUI:function(){
                this.syncContainerUI();
            },
            chooseMe:function(){

            },
            destroy:function(){
                var columns = this.property.columnComposers;
                for(var key in columns){
                    var column = columns[key];
                    for(var i=0;i<column.length;i++){
                        var id = column[i];
                        if(CM.all[id]){
                            CM.all[id].destroy();
                        }

                    }
                }
                this.container.remove();
                var _ind = CM.containerList.indexOf(this.id);
                CM.containerList.splice(_ind,1);
                delete CM.all[this.id];
            }
        };

        options.classname = classname;
        options.classTitle = classTitle;
        options.classIcon = classIcon;

        relative.init(options);
        return relative;
    };
    relativeObj.classname = classname;
    relativeObj.classTitle = classTitle;
    relativeObj.classIcon = classIcon;
    return relativeObj;
});