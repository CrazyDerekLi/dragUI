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
                var options = setting.options||{};
                options.min = options.min || 0;
                options.start = function(event, ui){
                    _this.editorChangeData(setting,composer,$(this).val());
                };
                options.stop = function(event, ui){
                    _this.editorChangeData(setting,composer,$(this).val());
                };
                options.change = function(event, ui){
                    _this.editorChangeData(setting,composer,$(this).val());
                };
                editor.spinner(options);
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
                editor = $(' <div class="color_select"></div>');
                var input = $('<input type="text" readonly="readonly">');
                editor.append(input);
                box.html(editor);

                input.spectrum({
                    color:val,
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
                        _this.editorChangeData(setting,composer,_color);
                    }
                });
            }else if(setting.type == "slider"){
                editor = $('<div class="editor_slider">');

                var slider = $('<div>');
                var handle = $('<div class="slider_style ui-slider-handle"></div>');
                slider.append(handle);
                editor.append(slider);
                var options = setting.options||{};
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
                        handle.text( $( this ).slider( "value" ));
                    },
                    slide: function( event, ui ) {
                        handle.text( ui.value);
                        _this.editorChangeData(setting,composer,ui.value);
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