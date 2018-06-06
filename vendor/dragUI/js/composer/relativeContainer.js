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
            property:{
                columnComposers:{},
                rowIndex:0,
                columns:[
                    "12"
                ]
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
                return this;
            },
            _createContainer:function(){
                this.container = $("<div class='designer_container_obj'>");
                if(this.designer){
                    this.container.addClass("designer");
                }
                var row = $("<div class='row'>");
                for(var i=0;i<this.property.columns.length;i++){
                    var column = $('<div>').addClass("col-xs-"+this.property.columns[i]);
                    column.addClass("container_column");
                    console.log(this.designer);
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
            _getTools:function(){
                var tools = this.getTools()||[];
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
                // tools.push(setting);
                // tools.push(up);
                // tools.push(down);
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

            },
            getSettings:function(){
                var o = {
                    id:this.id,
                    classname:this.classname,
                    property:this.property
                };
                return o;
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