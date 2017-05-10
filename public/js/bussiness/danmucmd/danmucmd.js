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


var addParamHtml = function(){
    var paramHtml = '<div class="control-group">'+
           '<label class="control-label" style="width:60px">排序</label>'+
           '<div class="controls" style="margin-left:60px;">'+
           '<input type="text" class="sort span1" >'+
           '<span style="margin-left: 10px;margin-right: 10px;">英文名</span>'+
           '<input type="text" class="key span1" >'+
           '<span style="margin-left: 10px;margin-right: 10px;">页面组件</span>'+
           '<select class="component span1"><option value="0">无</option>';
           for(var i=0;i<_allComponent.length;i++){
                paramHtml += '<option value="'+_allComponent[i].id+'">'+_allComponent[i].name+'</option>';
           }

           paramHtml +='</select>'+
           '<span style="margin-left: 10px;margin-right: 10px;">类型</span>'+
           '<select class="type span1">'+
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
           '<a onclick="delParam(this)">删除</a>'+
           '</div></div>';
    return paramHtml;
}

var drawParamHtml = function(obj){
    var s0,s1,s2,s3,s4 = "";
    if( obj.type == 0 ){
        s0 = "selected";
    }
    if( obj.type == 1 ){
        s1 = "selected";
    }
    if( obj.type == 2 ){
        s2 = "selected";
    }
    if( obj.type == 3 ){
        s3 = "selected";
    }
    var paramHtml = '<div class="control-group">'+
           '<label class="control-label" style="width:60px">排序</label>'+
           '<div class="controls" style="margin-left:60px;">'+
           '<input type="text" class="sort span1" value="'+obj.sort+'">'+
           '<span style="margin-left: 10px;margin-right: 10px;">英文名</span>'+
           '<input type="text" class="key span1" value="'+obj.key+'" cmdParamId="'+obj.id+'" readonly>'+
           '<span style="margin-left: 10px;margin-right: 10px;">页面组件</span>'+
           '<select class="component span1">';
           if(obj.componentId == 0){
                paramHtml += '<option value="0" selected>无</option>';
           }else{
                paramHtml += '<option value="0" >无</option>';
           }

           for(var i=0;i<_allComponent.length;i++){
                if(obj.componentId == _allComponent[i].id){
                    paramHtml += '<option value="'+_allComponent[i].id+'" selected>'+_allComponent[i].name+'</option>';
                }else{
                    paramHtml += '<option value="'+_allComponent[i].id+'">'+_allComponent[i].name+'</option>';
                }
           }

           paramHtml +='</select>'+
           '<span style="margin-left: 10px;margin-right: 10px;">类型</span>'+
           '<select class="type span1">'+
               '<option value="0" '+s0+'>数字</option>'+
              '<option value="1" '+s1+'>布尔值</option>'+
              '<option value="2" '+s2+'>字符串</option>'+
              '<option value="3" '+s3+'>数组</option>'+
           '</select>'+
           '<span style="margin-left: 10px;margin-right: 10px;">默认值</span>'+
           '<input type="text" class="defaultValue span1" value="'+obj.defaultValue+'">'+
           '<span style="margin-left: 10px;margin-right: 10px;">校验规则</span>'+
           '<input type="text" class="checkRule span1" value="'+obj.checkRule+'">'+
           '<span style="margin-left: 10px;margin-right: 10px;">是否审核</span>';
           if(obj.isCheck == 0){
                paramHtml +='<input type="radio" name="isCheck" class="isCheck" onclick="clickRadio(this)" checked>';
           }else{
                paramHtml +='<input type="radio" name="isCheck" class="isCheck" onclick="clickRadio(this)">';
           }
           paramHtml +='</div></div>';
    return paramHtml;

}

var clickRadio = function(obj){
    var status = $(obj).attr("checked");
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
       '<input type="text" class="span4"  maxlength="6" id="cmdTempKey" onblur="checkKey()"> </div><br>';
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
                    '<input type="text" class="span4"  maxlength="6" id="cmdTempKey" value="'+data.data.key+'" readonly> </div><br>';
          htmlStr+='<div id="paramList">';
          for(var i=0;i<data.data.cmdJsonParamList.length;i++){
             htmlStr+=drawParamHtml(data.data.cmdJsonParamList[i]);
          }
          htmlStr+='</div></div></form>';
          $('#modalBody').html(htmlStr);
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

    if( '' == cmdTempName){
        alert("指令名称不能为空");
        return;
    }

    if( '' == cmdTempKey){
        alert("指令KEY不能为空");
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
    var buttonHtml = '<button class="btn btn-primary" onclick="openComopent()">返回列表</button> <button class="btn btn-primary" onclick="saveComponent()">保存</button>';
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
           field: 'id', title: '操作',
           align: 'center',
           formatter: function (value, row, index) {
                return '<a class="btn">修改</a><a class="btn" onclick="delComponent(\''+row.id+'\',\''+row.name+'\')">删除</a>';
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

var saveComponent = function(){
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
        componentList.push(componentValue);
    }

    var obj={
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