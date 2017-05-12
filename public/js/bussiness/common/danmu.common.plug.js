
(function ($) {
    $.initTitle =function (object) {
        $.danmuAjax('/v1/api/findDanmuType', 'GET', 'json', {}, function (data) {
            console.log(data);
            if (data.result == 200) {
                var array = data.data;
                var valueList = [];
                if(array!=null && array.length>0){
                    for(var i=0; i<array.length; i++){
                        var tempObject = {};
                        tempObject.id = array[i].id;
                        tempObject.name=array[i].name;
                        valueList.push(tempObject);
                    }
                    object.valueList = valueList;
                    $.setTitleListPlug(object);
                }
            }
        }, function (data) {
            console.log(data);
        });
    }


    /**
     *
     * @param divId 外部divId
     * @param widgetId 组件I
     * @param valueList 值
     * @param functionName 方法
     */
    $.setTitleListPlug =function (object) {
        var divId = object.divId;
        var valueList = object.valueList;
        var clickFunction=object.clickFunction;
        var partyId = object.partyId;
        if( null != valueList) {
            for (var i = 0; i < valueList.length; i++) {
                var id = valueList[i].id
                var object = $("#"+divId);
                var button = '<button class="btn" id="'+id+'"  style=" width: 100px; height:30px;margin-top: 1px; margin-right: 0.5em; vertical-align:middle;text-align:center;" value="'+id+'">'+valueList[i].name+'</button>';
                object.append(button);
                $('#'+id).click(function(){
                    $.createPlug($(this).val(),partyId);
                    $("#titleId").val($(this).val());
                    return false;
                });
            }
            $.createPlug(valueList[4].id,partyId);
            var hiddenInput="<input type='hidden' id='titleId' name='titleId'/>"
            object.append(hiddenInput);
        }
    }

    $.createPlug=function (id,partyId) {
        $.danmuAjax('/v1/api/findDanmuTemplateInfo/'+id, 'GET', 'json', {}, function (data) {
            console.log(data);
            if (data.result == 200) {
                var temObject = data.data;
                console.log(data);
                var cmdTempComponentDataList = temObject.cmdTempComponentDataList;
                var divId = "componentDivId";
                $("#"+divId).empty();
                createTitleComponent({'divId':divId,'name':temObject.name})
                if(cmdTempComponentDataList!=null){
                    for(var i=0; i<cmdTempComponentDataList.length; i++){
                        var componentObject = cmdTempComponentDataList[i];
                        var componentId  = componentObject.componentId;
                        var object = {
                            divId : divId,
                            widgetId : componentObject.id,
                            defaultValue : componentObject.defaultValue,
                            valueList : componentObject.cmdComponentValueList,
                            componentId : componentId,
                            componentType:componentObject.componentType,
                            key : componentObject.key,
                            partyId:partyId
                        };

                        //创建标题组件
                        if(componentId>=0 && componentId<=3){
                            createCompentBycomponentId(object);
                        }else{
                            createCompentBycomponentType(object);
                        }
                    }
                }
            }
        });
    }
    
    function createTitleComponent(object) {
        var divId = object.divId;
        var divObject = $("#"+divId).append('<div id="'+divId+'Div"></div>');
        $('#'+divId+'Div').append('<i class="icon-bookmark"></i><span style="margin-left: 3px;font-size: larger;">'+object.name+'</span>')

    }

    function findResource(object){
        var divId = object.divId;
        var widgetId=object.widgetId;
        var key = object.key;
        $.danmuAjax('/v1/api/admin/initResource?partyId=' + object.partyId, 'GET', 'json', {}, function (data) {
            if (data.result == 200) {
                var divObject = $("#"+divId).append('<div id="'+widgetId+'Div"></div>');
                var resourceArray = [];
                if(object.componentId==1){
                    //表情特效
                    resourceArray=data.data.specialVideos;
                    for (var i = 0; i < resourceArray.length; i++) {
                        var specialVideo = resourceArray[i];
                        var buttonName = specialVideo.resourceName.substring(0,4);
                        html = '<button class="btn"  style=" width: 65px; height:30px;margin-top: 1px; margin-right: 0.5em; " onclick="setElement(\'' + specialVideo.resourceName + '\',\'' + specialVideo.id + '\')" title="' + specialVideo.resourceName + '">' + buttonName + '</button>';
                        divObject.append(html);
                    }
                }else if(object.componentId==2){
                    //图片特效
                    resourceArray=data.data.specialImages;
                    for (var i = 0; i < resourceArray.length; i++) {
                        var image = resourceArray[i];
                        html = '<img src="' + _baseImageUrl + image.fileUrl + '" style="width: 50px; height: 50px;margin-left: 1em;" title="' + image.fileUrl + '" onclick="setElement(\'' + image.fileUrl + '\',\'' + image.id + '\')"/>';
                        divObject.append(html);
                    }
                }else if(object.componentId==3){
                    //视频特效
                    resourceArray=data.data.expressions;
                    for (var i = 0; i < resourceArray.length; i++) {
                        var expression = resourceArray[i];
                        var html = '<img src="' + _baseImageUrl + expression.smallFileUrl + '" style="width: 50px; height: 50px;margin-left: 1em;"  title="' + expression.smallFileUrl + '" onclick="setElement(\'' + expression.smallFileUrl + '\',\'' + expression.id + '\')"/>';
                        divObject.append(html);
                    }
                }


            } else {
                alert("资源加载失败")
            }
        },null,false);
    }

    function createCompentBycomponentId(object) {
        var componentId = object.componentId;
        if(componentId==0){
            //不生成任何控件
           // alert('无组件');
            console.log('不生成任何组件');
        }else if(componentId==1){
            //alert('特效视频');
            findResource(object);
        }else if(componentId==2){
            findResource(object);
        }else if(componentId==3){
            //checkbox
            //alert('表情图片');
            findResource(object);
        }
    }
    function createCompentBycomponentType(object) {
        var componentType = object.componentType;
        if(componentType==0){
            //不生成任何控件
            //alert('text');
            $.setTextPlug(object);
        }else if(componentType==1){
            //生成textarea控件
            $.setTextAreaPlug(object);
        }else if(componentType==2){
            //生成slect控件
            $.setSelectPlug(object);
        }else if(componentType==3){
            //生成radiobutton
            $.setRadioButtonListPlug(object);
        }else if(componentType==4){
            //checkbox
            $.setCheckBoxListPlug(object);
        }
    }

    $.setRadioButtonListPlug = function (object) {
        var divId = object.divId;
        var valueList = object.valueList;
        var widgetId=object.widgetId;
        var key = object.key;

        var divObject = $("#"+divId).append('<div id="'+widgetId+'Div"></div>');
        if( null != valueList){
            for( var i=0;i<valueList.length;i++){
                var name = valueList[i].name;
                var value = valueList[i].value;
                var id= valueList[i].id;
                var radioButton = '<label style="display: inline-block; width: 80px;"><input id="'+widgetId+id+'" name="'+key+'" type="radio" value="'+value+'" style="display: inline-block;"/>'+name+'</label> ';
                divObject.append(radioButton);
                if(object.defaultValue==value){
                    $("#"+widgetId+id).attr("checked",'checked');
                }
            }
        }
    }
    $.setCheckBoxListPlug = function (object) {
        var divId = object.divId;
        var valueList = object.valueList;
        var widgetId=object.widgetId;
        var key = object.key;
        var divObject = $("#"+divId).append('<div id="'+widgetId+'Div"></div>');

        if( null != valueList){
            for( var i=0;i<valueList.length;i++){
                var name = valueList[i].name;
                var value = valueList[i].value;
                var id= valueList[i].id;
                var checkBox = '<label style="display: inline-block; width: 80px;"><input id="'+widgetId+id+'" name="'+key+'" type="checkbox" value="'+value+'" style="display: inline-block;"/>'+name+'</label> ';
                divObject.append(checkBox);
                if(object.defaultValue==value){
                    $("#"+widgetId+id).attr("checked",'true');
                }
            }
        }
    }

    $.setSelectPlug =function (object) {

        var divId = object.divId;
        var valueList = object.valueList;
        var widgetId=object.widgetId;
        var key = object.key;
        var divObject = $("#"+divId).append('<div id="'+widgetId+'Div"></div>');
        var select='<select style="width: 260px;" id="'+widgetId+'" name="'+key+'">';
        if( null != valueList){
            for( var i=0;i<valueList.length;i++){
                select += '<option value=' + valueList[i].value + '>' + valueList[i].name + '</option>';
            }
        }
        select += '</select>';
        divObject.append(select);
        //set default value
        $("#"+widgetId).val(object.defaultValue);
    }

    $.setTextAreaPlug =function (object) {
        var divId = object.divId;
        var widgetId = object.widgetId;
        var key = object.key;
        var keyUp= object.keyUp;
        var keyDown= object.keyDown;
        var defaultValue = object.defaultValue;
        var divObject = $("#"+divId).append('<div id="'+widgetId+'Div"></div>');
        //placeholder="'+defaultValue+'"
        var textArea = '<textarea id="'+widgetId+'" name="'+key+'" class="form-control" rows="3" style="width: 260px;height: 80px;outline:none;resize:none;"></textarea>';
        divObject.append(textArea);
        $("#"+widgetId).val(object.defaultValue);

        /*var textArea = '<div id="'+widgetId+'Div"><textarea id="'+widgetId+'" name="'+widgetId+'" class="form-control" rows="3" placeholder="'+defaultValue+'"style="width: 260px;height: 80px;outline:none;resize:none;"></textarea></div>';
        object.append(textArea);
        if(keyUp!=undefined){
            $("#"+widgetId).bind("keyup",function () {
                keyUp();
            })
        }
        if(keyDown!=undefined){
            $("#"+widgetId).bind("keydown",function () {
                keyDown();
            })
        }*/
    }

    $.setTextPlug =function (object) {
        var divId = object.divId;
        var widgetId = object.widgetId;
        var key = object.key;
        var keyUp= object.keyUp;
        var keyDown= object.keyDown;
        var defaultValue = object.defaultValue;
        var divObject = $("#"+divId).append('<div id="'+widgetId+'Div"></div>');
        //placeholder="'+defaultValue+'"
        var textArea = '<input id="'+widgetId+'" name="'+key+'" class="form-control"  style="width: 260px;"></input>';
        divObject.append(textArea);
        $("#"+widgetId).val(object.defaultValue);
    }
})(jQuery);