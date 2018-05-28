require.config({
    paths:{

    }
});
define([], function(base){
    var o = {
        commonEditor:function (box,setting,composer){
            var editor = undefined;
            var _this = this;
            var val = this.getComposerValue(setting.field,composer);

            if(setting.type == "text"){
                editor = $("<input type='text'>").val(val);
                box.html(editor);
                editor.change(function(){
                    _this.editorChangeData(setting,composer,$(this).val());
                });
            }else if(setting.type == "spinner"){
                editor = $("<input type='text'>").val(val);
                box.html(editor);
                editor.spinner({
                    min:0,
                    start:function(event, ui){
                        _this.editorChangeData(setting,composer,$(this).val());
                    },
                    stop:function(event, ui){
                        _this.editorChangeData(setting,composer,$(this).val());
                    },
                    change:function(event, ui){
                        _this.editorChangeData(setting,composer,$(this).val());
                    }
                });
            }else if(setting.type == "checkbox"){
                console.log(val);
                editor = $("<input type='checkbox'>").val(val);
                if(val == "1"){
                    editor.prop("checked","true");
                }
                box.html(editor);
                editor.click(function(){
                    _this.editorChangeData(setting,composer,$(this).is(':checked')?"1":"0");
                });
            }else if(setting.type == "color"){
                editor = $('<div class="color_picker">');
                var input = $('<input type="text" readonly="readonly">');
                editor.append(input);
                box.html(editor);

                editor.css('backgroundColor', val);
                editor.find('input').val(val);

                editor.ColorPicker({
                    color: val,
                    onShow: function (colpkr) {
                        $(colpkr).fadeIn(500);
                        return false;
                    },
                    onHide: function (colpkr) {
                        $(colpkr).fadeOut(500);
                        return false;
                    },
                    onChange: function (hsb, hex, rgb) {
                        editor.css('backgroundColor', '#' + hex);
                        editor.find('input').val('#' + hex);
                        _this.editorChangeData(setting,composer,'#' + hex);
                    }
                });
            }

        },
        getComposerValue:function(list,o){
            if(list.length>0){
                var _o = o[list[0]];
                var _list = list.slice(1)||[];
                return this.getComposerValue(_list,_o);
            }else{
                return o;
            }
        },
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
        editorChangeData:function(setting,composer,value){
            this.setComposerValue(setting.field,composer,value,setting.type);
            composer._syncUI();
            composer.chooseMe();
        }

    };
    return o;
});