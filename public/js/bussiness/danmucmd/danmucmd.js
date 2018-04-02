var _allComponent;
var tableUrl = '/v1/api/admin/cmdTemp/page';
var columnsArray = [
    {
        title: '序号',
        align: 'center',
        formatter: function (value, row, index) {
            return index+1;
        }
    },
    {
        field: 'id',
        title: '指令id',
        align: 'center'
    },
    {
        field: 'name',
        title: '指令名称',
        align: 'center'
    },
    {
        title: '操作',
        align: 'center',
        formatter: function (value, row, index) {
            return '<a class="btn" onclick="openUpdateCmdTemp(\''+row.id+'\')">修改</a>'+
            '<a class="btn" onclick="delCmdTemp(\''+row.id+'\',\''+row.name+'\')">删除</a>';
        },
        events: 'operateEvents'
    }
];
var quaryObject = {
    pageSize: 20
};


var searchCmdPage = function(){
    var quaryObject = {
        pageSize: 20,
        type:$('#cmdSearchType').val()
    };
    $.initTable('tableList', columnsArray, quaryObject, tableUrl);
}

var addParamHtml = function(){
    var paramHtml = '<div class="control-group">'+
           '<label class="control-label" style="width:60px">排序</label>'+
           '<div class="controls" style="margin-left:60px;">'+
           '<input type="text" class="sort span1" >'+
           '<span style="margin-left: 10px;margin-right: 10px;">英文名</span>'+
           '<input type="text" class="key span1" >'+
           '<span style="margin-left: 10px;margin-right: 10px;">页面组件</span>'+
           '<select class="component span1" onchange="selectComponent(this)"  ><option value="0">无</option><option value="2">特效图片</option><option value="1">表情图片</option>';
           for(var i=0;i<_allComponent.length;i++){
                paramHtml += '<option value="'+_allComponent[i].id+'">'+_allComponent[i].name+'</option>';
           }

           paramHtml +='</select>'+
           '<span style="margin-left: 10px;margin-right: 10px;">类型</span>'+
           '<select class="type span1" >'+
               '<option value="0">数字</option>'+
               '<option value="1">布尔值</option>'+
               '<option value="2">字符串</option>'+
               '<option value="3">数组</option>'+
           '</select>'+
           '<span style="margin-left: 10px;margin-right: 10px;">默认值</span>'+
           '<input type="text" class="defaultValue span1" >'+
           '<span style="margin-left: 10px;margin-right: 10px;">校验规则</span>'+
           '<input type="text" class="checkRule span1" >'+
           '<span style="margin-left: 10px;margin-right: 10px;">是否审核</span>'+
           '<input type="radio" name="isCheck" class="isCheck" onclick="clickRadio(this)">'+
           '<a style="margin-left: 10px;margin-right: 10px;" onclick="delParam(this)">删除</a>'+
           '</div></div>';
    return paramHtml;
}

var selectComponent = function(obj){
    var componentId = $(obj).val();
    var parentHtml = $(obj).parent();
    var dmCmdType = parentHtml.find('.type.span1');
    var defaultValue = parentHtml.find('.defaultValue.span1');
    var checkRule = parentHtml.find('.checkRule.span1');
    var isCheck = parentHtml.find('.isCheck');
    $(dmCmdType).removeAttr("disabled");
    $(dmCmdType).removeAttr("disabled");
    $(defaultValue).removeAttr("disabled");
    $(checkRule).removeAttr("disabled");
    $(isCheck).removeAttr("disabled");
    if(componentId.length > 1){
         for(var i=0;i<_allComponent.length;i++){
            if( componentId == _allComponent[i].id){
                if(_allComponent[i].type == 4){
                    $(dmCmdType).empty();
                    $(dmCmdType).append('<option value="3">数组</option>');
                    $(dmCmdType).val(3);
                    $(dmCmdType).attr("disabled","disabled");
                }else if(_allComponent[i].type != 1 && _allComponent[i].type != 4){
                    $(dmCmdType).empty();
                    $(dmCmdType).append('<option value="0">数字</option>');
                    $(dmCmdType).append('<option value="1">布尔值</option>');
                    $(dmCmdType).append('<option value="2">字符串</option>');
                }else if(_allComponent[i].type == 1){
                    $(dmCmdType).empty();
                    $(dmCmdType).append('<option value="0">数字</option>');
                    $(dmCmdType).append('<option value="1">布尔值</option>');
                    $(dmCmdType).append('<option value="2">字符串</option>');
                    $(dmCmdType).append('<option value="3">数组</option>');
                }
            }
         }
    }else{
        $(dmCmdType).attr("disabled","disabled");
        $(defaultValue).attr("disabled","disabled");
        $(checkRule).attr("disabled","disabled");
        //$(isCheck).attr("disabled","disabled");
    }
}

var drawParamHtml = function(obj){
    var s0,s1,s2,s3,s4 = "";
    var a0,a1,a2,a3,a4 = "";
    if( obj.componentId == 0 ){
        s0 = "selected";
    }
    if( obj.componentId == 2 ){
        s2 = "selected";
    }
    if( obj.componentId == 1 ){
        s3 = "selected";
    }
    if( obj.type == 0 ){
        a0 = "selected";
    }
    if( obj.type == 1 ){
        a1 = "selected";
    }
    if( obj.type == 2 ){
        a2 = "selected";
    }
    if( obj.type == 3 ){
        a3 = "selected";
    }

    var paramHtml = '<div class="control-group">'+
           '<label class="control-label" style="width:60px">排序</label>'+
           '<div class="controls" style="margin-left:60px;">'+
           '<input type="text" class="sort span1" value="'+obj.sort+'">'+
           '<span style="margin-left: 10px;margin-right: 10px;">英文名</span>'+
           '<input type="text" class="key span1" value="'+obj.key+'" cmdParamId="'+obj.id+'" readonly>'+
           '<span style="margin-left: 10px;margin-right: 10px;">页面组件</span>'+
           '<select class="component span1" onchange="selectComponent(this)" >';

           paramHtml += '<option value="0" '+s0+'>无</option><option value="2" '+s2+'>特效图片</option><option value="1" '+s3+'>表情图片</option>';

           var componentType = -1;
           for(var i=0;i<_allComponent.length;i++){
                if(obj.componentId == _allComponent[i].id){
                    paramHtml += '<option value="'+_allComponent[i].id+'" selected>'+_allComponent[i].name+'</option>';
                    componentType = _allComponent[i].type;
                }else{
                    paramHtml += '<option value="'+_allComponent[i].id+'">'+_allComponent[i].name+'</option>';
                }
           }

           var isDisable = "";
           var isTypeDisable = "";

           if( obj.componentId.length < 2){
                isDisable = "disabled";
                isTypeDisable = "disabled";
           }
           if(obj.checkRule == null){
               obj.checkRule = "";
           }
           if(componentType ==4){
                isTypeDisable = "disabled";
           }

           paramHtml +='</select>'+
           '<span style="margin-left: 10px;margin-right: 10px;">类型</span>';


           paramHtml +='<select class="type span1" '+isTypeDisable+'>';

           paramHtml +='<option value="0" '+a0+'>数字</option>'+
              '<option value="1" '+a1+'>布尔值</option>'+
              '<option value="2" '+a2+'>字符串</option>';
           if(componentType == 4){
                paramHtml +='<option value="3" '+a3+' selected>数组</option>';
           }else{
                paramHtml +='<option value="3" '+a3+' >数组</option>';
           }

           paramHtml +='</select>'+
           '<span style="margin-left: 10px;margin-right: 10px;">默认值</span>'+
           '<input type="text" class="defaultValue span1" value="'+obj.defaultValue+'" '+isDisable+'>'+
           '<span style="margin-left: 10px;margin-right: 10px;">校验规则</span>'+
           '<input type="text" class="checkRule span1" value="'+obj.checkRule+'" '+isDisable+'>'+
           '<span style="margin-left: 10px;margin-right: 10px;">是否审核</span>';
           if(obj.isCheck == 0){
                paramHtml +='<input type="radio" name="isCheck" class="isCheck" onclick="clickRadio(this)" checked >';
           }else{
                paramHtml +='<input type="radio" name="isCheck" class="isCheck" onclick="clickRadio(this)" >';
           }
           paramHtml +='</div></div>';
    return paramHtml;

}

var clickRadio = function(obj){
    var status = $(obj).attr("checked");
    var isCheckList = $('.isCheck');
    for(var i=0;i<isCheckList.length;i++){
        if(obj != isCheckList[i]){
            $(isCheckList[i]).attr("checked",false);
        }
    }
    if(status){
        $(obj).attr("checked",false);
    }else{
        $(obj).attr("checked",true);
    }
}

var addParam = function(){
    $('#paramList').append(addParamHtml());
    return false;
}

var openAddCmdTemp = function () {

    $('#myModalLabel').html('创建指令');
    var htmlStr = '<form id="edit-profile" class="form-horizontal"><div class="control-group" style="margin-top: 18px;">'+
       '<label class="control-label" style="width:60px">指令名称</label><div class="controls" style="margin-left:60px;">'+
       '<input type="text" class="span4"  maxlength="16" id="cmdTempName"> </div><br>';
    htmlStr+='<label class="control-label" style="width:60px">指令KEY</label><div class="controls" style="margin-left:60px;">'+
       '<input type="text" class="span4"  id="cmdTempKey" onblur="checkKey()"> </div><br>';
    htmlStr+='<label class="control-label" style="width:60px">是否入库</label><div class="controls" style="margin-left:60px;">'+
           '<select id="cmdIsInLib"><option value="0">是</option><option value="1" selected>否</option></select></div><br>';
    htmlStr+='<label class="control-label" style="width:60px">是否到H5</label><div class="controls" style="margin-left:60px;">'+
           '<select id="cmdIsSendH5"><option value="0">是</option><option value="1" selected>否</option></select></div><br>';
    htmlStr+='<label class="control-label" style="width:60px">指令排序</label><div class="controls" style="margin-left:60px;">'+
            '<input type="text" class="span1"  id="sort" > </div><br>';
    htmlStr+='<label class="control-label" style="width:60px">是否展示</label><div class="controls" style="margin-left:60px;">'+
            '<select id="show"><option value="0" selected>是</option><option value="1" >否</option></select></div><br>';
    htmlStr+='<label class="control-label" style="width:60px">指令类型</label><div class="controls" style="margin-left:60px;">'+
            '<select id="cmdType"><option value="0" selected>FLASH</option><option value="1" >小程序</option></select></div><br>';
    htmlStr+='<div id="paramList">'+addParamHtml();
    htmlStr+='</div></div></form>';
    $('#modalBody').html(htmlStr);
    var buttonHtml = '<a class="btn btn-primary" onclick="addParam()">新增属性</a> <button class="btn btn-primary" onclick="saveParam()">保存</button> ';
    $('#modalFooter').html(buttonHtml);

    $('#myModal').modal('show').css({
        display:'inline-block',
        width:'auto'
   });
};

var openUpdateCmdTemp = function (id) {
    var obj = {
        id:id
    }
    $.danmuAjax('/v1/api/admin/cmdTemp/find', 'GET','json','',obj, function (data) {
        if(data.result == 200) {
          console.log(data);
          $('#myModalLabel').html('修改指令');
          var htmlStr = '<form id="edit-profile" class="form-horizontal"><div class="control-group" style="margin-top: 18px;">'+
             '<label class="control-label" style="width:60px">指令名称</label><div class="controls" style="margin-left:60px;">'+
             '<input type="text" class="span4"  maxlength="16" id="cmdTempName" value="'+data.data.tempName+'" > </div><br>';
          htmlStr+='<label class="control-label" style="width:60px">指令KEY</label><div class="controls" style="margin-left:60px;">'+
                    '<input type="text" class="span4" id="cmdTempKey" value="'+data.data.key+'" readonly> </div><br>';
          htmlStr+='<label class="control-label" style="width:60px">是否入库</label><div class="controls" style="margin-left:60px;">'+
                        '<select id="cmdIsInLib"><option value="0">是</option><option value="1" selected>否</option></select></div><br>';
          htmlStr+='<label class="control-label" style="width:60px">是否到H5</label><div class="controls" style="margin-left:60px;">'+
                        '<select id="cmdIsSendH5"><option value="0">是</option><option value="1" selected>否</option></select></div><br>';
          htmlStr+='<label class="control-label" style="width:60px">指令排序</label><div class="controls" style="margin-left:60px;">'+
                      '<input type="text" class="span1"  id="sort"  value="'+data.data.sort+'"  > </div><br>';
          htmlStr+='<label class="control-label" style="width:60px">是否展示</label><div class="controls" style="margin-left:60px;">'+
                      '<select id="show"><option value="0" selected>是</option><option value="1" >否</option></select></div><br>';
          htmlStr+='<label class="control-label" style="width:60px">指令类型</label><div class="controls" style="margin-left:60px;">'+
                       '<select id="cmdType"><option value="0">FLASH</option><option value="1" >小程序</option></select></div><br>';
          htmlStr+='<div id="paramList">';
          var componentType = -1;
          for(var i=0;i<data.data.cmdJsonParamList.length;i++){
             htmlStr+=drawParamHtml(data.data.cmdJsonParamList[i]);
          }
          htmlStr+='</div></div></form>';
          $('#modalBody').html(htmlStr);
          $('#cmdIsInLib').val(data.data.isInDanmuLib);
          $('#cmdIsSendH5').val(data.data.isSendH5);
          $('#cmdType').val(data.data.type);
          if(data.data.show){
                $('#show').val(data.data.show);
          }
          var buttonHtml = '<a class="btn btn-primary" onclick="addParam()">新增属性</a> <button class="btn btn-primary" onclick="saveParam(\''+id+'\')">保存</button>';
          $('#modalFooter').html(buttonHtml);
          $('#myModal').modal('show');
         }else{
            alert('查询失败');
         }
    }, function (data) {
        console.log(data);
    });
};

var delParam = function(obj){
    var parentHtml = $(obj).parent();
    var paramName = parentHtml.find('.paramName.span1').val();
    var paramId = $(obj).attr('paramId');

    $(obj).parent().parent().remove();

    if( null != paramId ){
        if(confirm('确定要删除'+paramName+'吗？')){
                var obj = {
                    id:paramId
                }
                $.danmuAjax('/v1/api/admin/paramTemplate/delParam', 'GET','json',obj, function (data) {
                    if(data.result == 200) {
                      console.log(data);

                     alert("删除成功");
                     }else{
                        alert('删除失败');
                     }
                }, function (data) {
                    console.log(data);
                });
        }
    }
}

var saveParam = function(id){
    var sortList = $('.sort.span1');
    var keyList = $('.key.span1');
    var componentList = $('.component.span1');
    var typeList = $('.type.span1');
    var defaultValueList = $('.defaultValue.span1');
    var checkRuleList = $('.checkRule.span1');
    var isCheckList = $('.isCheck');

    var cmdTempName = $('#cmdTempName').val();
    var cmdTempKey = $('#cmdTempKey').val();

    var isInDanmuLib = $('#cmdIsInLib').val();

    var isSendH5 = $('#cmdIsSendH5').val();

    var sort = $('#sort').val();

    var show = $('#show').val();

    var cmdType = $('#cmdType').val();

    if( '' == cmdTempName){
        alert("指令名称不能为空");
        return;
    }

    if( '' == cmdTempKey){
        alert("指令KEY不能为空");
        return;
    }

    if( '' == sort){
        alert("排序不能为空");
        return;
    }

    if(sortList.length == 0 || keyList.length == 0 || componentList.length == 0 ||
        typeList.length == 0 || checkRuleList.length == 0){
         alert("属性不能为空");
         return;
    }

    var paramList = new Array();

    for( var i=0;i<sortList.length;i++){
        var param = new Object();

        param.sort = $(sortList[i]).val();
        if( '' == param.sort ){
            alert("排序不能为空");
            return;
        }
        var reg = /^[0-9]*$/g;
        if(!reg.test(param.sort)){
            alert("排序只能为数字");
            return;
        }

        param.key = $(keyList[i]).val();
        if( '' == param.key){
            alert("英文名不能为空");
            return;
        }
        var reg = /^[a-zA-Z0-9]*$/g;
        if(!reg.test(param.key)){
            alert("英文名只能为字母和数字");
            return;
        }

        param.componentId = $(componentList[i]).val();

        param.type = $(typeList[i]).val();

        param.defaultValue =$(defaultValueList[i]).val();
        if(param.componentId.length > 1 ){
            param.checkRule = $(checkRuleList[i]).val();
            if( '' == param.checkRule){
                alert("校验规则不能为空");
                return;
            }
            var reg = /^[0-9]*-[0-9]*$/g;
            if(!reg.test(param.checkRule)){
                alert("校验规则为数字-数字，第一个数字代表最短，为0时代表可以为空，第二个数字代表最长，例如0-5，代表可以为空，最长为5位");
                return;
            }
        }


        var r = $(isCheckList[i]).attr("checked");
        if(r){
            param.isCheck = 0;
        }else{
            param.isCheck = 1;
        }
        param.id = $(keyList[i]).attr("cmdParamId");
        paramList.push(param);
    }

    var obj={
        cmdTempId:id,
        tempName:cmdTempName,
        key:cmdTempKey,
        isInDanmuLib:isInDanmuLib,
        isSendH5:isSendH5,
        sort:sort,
        show:show,
        type:cmdType,
        cmdJsonParamList:paramList
    }

    $.danmuAjax('/v1/api/admin/cmdTemp/save', 'POST','json','', JSON.stringify(obj), function (data) {
        if(data.result == 200) {
            console.log(data);
             $.initTable('tableList', columnsArray, quaryObject, tableUrl);
              $('#myModal').modal('hide');
            alert('创建成功');
        }else{
            if(data.result == 501){
                alert('key已经存在');

            }else{
                alert('创建失败');
            }
        }
    }, function (data) {
        console.log(data);
    });

}

var checkKey = function(){
    var keyStr = $('#cmdTempKey').val().trim();
    if( null != keyStr || '' != keyStr){
        var obj = {
            key:$('#cmdTempKey').val()
        }
        $.danmuAjax('/v1/api/admin/cmdTemp/checkKey', 'GET','json','',obj, function (data) {
            if(data.result == 501) {
              console.log(data);
               alert('key重复，请重新输入');
             }
        }, function (data){
            console.log(data);
        });
    }

}


var delCmdTemp = function(id,name){
    if(confirm('确定要删除'+name+'吗？')){
        var obj = {
            id:id
        }
        $.danmuAjax('/v1/api/admin/cmdTemp/del', 'GET','json','',obj, function (data) {
            if(data.result == 200) {
              console.log(data);
              $.initTable('tableList', columnsArray, quaryObject, tableUrl);
             }else{
                alert('删除失败');
             }
        }, function (data) {
            console.log(data);
        });
    }
}

var openAddCmdComponent = function(){
    $('#myModalLabel').html('创建页面组件');
    var htmlStr = '<form id="edit-profile" class="form-horizontal"><div class="control-group" style="margin-top: 18px;">'+
       '<label class="control-label" style="width:60px">组件名称</label><div class="controls" style="margin-left:60px;">'+
       '<input type="text" class="span4"  maxlength="16" id="componentName"> </div><br>';
    htmlStr+='<label class="control-label" style="width:60px">组件类型</label><div class="controls" style="margin-left:60px;">'+
       '<select id="componentType" onChange="selectComponentType()">'+
       '<option value="0">text</option>'+
       '<option value="1">textarea</option>'+
       '<option value="2">select</option>'+
       '<option value="3">radiobutton</option>'+
       '<option value="4">checkbox</option>'+
       '</select></div><br>';
    htmlStr+='<div id="componentValList"></div></div></form>';
    $('#modalBody').html(htmlStr);
    var buttonHtml = '<button class="btn btn-primary" onclick="openComponent()">返回列表</button> <button class="btn btn-primary" onclick="saveComponent()">保存</button>';
    $('#modalFooter').html(buttonHtml);
    $('#myModal').modal('show');
}

var selectComponentType = function(){
    var ct = $('#componentType').val();
    if(ct > 1){
        var addValBtn = $('#addValBtn').html();
        if(addValBtn == null){
            var btnHtml = '<button id="addValBtn" class="btn btn-primary" onclick="addComponentVal()">新增值</button>';
            $('#modalFooter').prepend(btnHtml);
            addComponentVal();
        }
    }else{
        $('#addValBtn').remove();
        $('#componentValList').empty();
    }
}

var addComponentVal = function(){
    $('#componentValList').append(drawComponentVal());
    return false;
}

var drawComponentVal = function(){
    var paramHtml = '<div class="control-group">'+
               '<label class="control-label" style="width:60px">中文名</label>'+
               '<div class="controls" style="margin-left:60px;">'+
                   '<input type="text" class="componentValName span1" >'+
                   '<span style="margin-left: 10px;margin-right: 10px;">值</span>'+
                   '<input type="text" class="componentValVal span1" >'+
                   '<a onclick="delComponentVal(this)">删除</a>'+
               '</div></div>';
        return paramHtml;
}

var delComponentVal = function(obj){
        $(obj).parent().parent().remove();
}

var openComponent = function(){
    $('#myModalLabel').html('页面组件管理');
    var tableHtml = '<table id="componentTableList" class="table table-striped" table-height="360" style="width:500px"></table>';
    $('#modalBody').html(tableHtml);
    var componentUrl = '/v1/api/admin/cmdTemp/componentPage';
    var componentQueryObject = {
        pageSize: 6
    }
    var componentColumnsArray =[
        {
            field: 'name',
            title: '名称',
            align: 'center'
        },
        {
           field: '', title: '操作',
           align: 'center',
           formatter: function (value, row, index) {
                return '<a class="btn" onclick="openUpdateComponent(\''+row.id+'\')">修改</a><a class="btn" onclick="delComponent(\''+row.id+'\',\''+row.name+'\')">删除</a>';
           }
        }
    ];
    var tableSuccess = function(){
        $('#modalBody').find('.pull-left').remove();
    }
    $.initTable('componentTableList', componentColumnsArray, componentQueryObject, componentUrl,tableSuccess);
    var buttonHtml = '<button class="btn btn-primary" onclick="openAddCmdComponent()">新增组件</button>';
    $('#modalFooter').html(buttonHtml);
    $('#myModal').modal('show');
}

var drawUpdateComponentVal = function(obj){
    var paramHtml = '<div class="control-group">'+
               '<label class="control-label" style="width:60px">中文名</label>'+
               '<div class="controls" style="margin-left:60px;">'+
                   '<input type="text" class="componentValName span1" value="'+obj.name+'" data-id="'+obj.id+'">'+
                   '<span style="margin-left: 10px;margin-right: 10px;">值</span>'+
                   '<input type="text" class="componentValVal span1" value="'+obj.value+'">'+
               '</div></div>';
        return paramHtml;
}

var openUpdateComponent = function(id){
    var obj = {
        id:id
    }
    $.danmuAjax('/v1/api/admin/cmdTemp/findComponentById', 'GET','json','',obj, function (data) {

        if(data.result == 200){
            $('#myModalLabel').html('修改页面组件');
            var htmlStr = '<form id="edit-profile" class="form-horizontal"><div class="control-group" style="margin-top: 18px;">'+
               '<label class="control-label" style="width:60px">组件名称</label><div class="controls" style="margin-left:60px;">'+
               '<input type="text" class="span4"  maxlength="16" id="componentName" value="'+data.data.name+'"> </div><br>';
            htmlStr+='<label class="control-label" style="width:60px">组件类型</label><div class="controls" style="margin-left:60px;">'+
               '<select id="componentType" onChange="selectComponentType()">'+
               '<option value="0">text</option>'+
               '<option value="1">textarea</option>'+
               '<option value="2">select</option>'+
               '<option value="3">radiobutton</option>'+
               '<option value="4">checkbox</option>'+
               '</select></div><br>';
            htmlStr+='<div id="componentValList">'
            for(var i=0;i<data.data.cmdComponentValueList.length;i++){
                htmlStr+=drawUpdateComponentVal(data.data.cmdComponentValueList[i]);
            }

            htmlStr+='</div></div></form>';
            $('#modalBody').html(htmlStr);
            $('#componentType').val(data.data.type);
            var buttonHtml = '<button id="addValBtn" class="btn btn-primary" onclick="addComponentVal()">新增值</button> <button class="btn btn-primary" onclick="openComponent()">返回列表</button> <button class="btn btn-primary" onclick="saveComponent(\''+id+'\')">保存</button>';
            $('#modalFooter').html(buttonHtml);
            $('#myModal').modal('show');

        }else{
            alert("查询失败");
        }

    });
}

var saveComponent = function(id){
    var componentValNameList = $('.componentValName.span1');
    var componentValValList = $('.componentValVal.span1');

    var componentName = $('#componentName').val();
    var componentType = $('#componentType').val();

    if( '' == componentName){
        alert("组件名称不能为空");
        return;
    }

    if( componentType > 1 ){
        if(componentValNameList.length==0){
            alert("组件类型为select,radiobutton和checkbox时，请添加值");
            return;
        }
    }

    var componentList = new Array();

    for( var i=0;i<componentValNameList.length;i++){
        var componentValue = new Object();

        componentValue.name = $(componentValNameList[i]).val();
        if( '' == componentValue.name ){
            alert("中文名不能为空");
            return;
        }
        componentValue.value = $(componentValValList[i]).val();
        if( '' == componentValue.value ){
            alert("值不能为空");
            return;
        }
        componentValue.id = $(componentValNameList[i]).attr("data-id");
        componentList.push(componentValue);
    }

    var obj={
        componentId:id,
        name:componentName,
        type:componentType,
        cmdComponentValueList:componentList
    }

    $.danmuAjax('/v1/api/admin/cmdTemp/saveComponent', 'POST','json','', JSON.stringify(obj), function (data) {
        if(data.result == 200) {
            console.log(data);
             openComponent();
            alert('创建成功');
        }else{
            alert('创建失败');
        }
    }, function (data) {
        console.log(data);
    });
}

var delComponent = function(id,name){
    if(confirm('确定要删除'+name+'吗？')){
        var obj = {
            id:id
        }
        $.danmuAjax('/v1/api/admin/cmdTemp/delComponent', 'GET','json','',obj, function (data) {
            if(data.result == 200) {
                console.log(data);
                openComponent();
                alert("删除成功");
            }else{
                alert('删除失败');
            }
        }, function (data) {
            console.log(data);
        });
    }
}

var findAllComponent = function(){
    $.danmuAjax('/v1/api/admin/cmdTemp/findAllComponent', 'GET','json','',null, function (data) {
        if(data.result == 200) {
            console.log(data);
            _allComponent = data.data
        }
    }, function (data) {
        console.log(data);
    });
}

findAllComponent();

//加载表格数据
$.initTable('tableList', columnsArray, quaryObject, tableUrl);