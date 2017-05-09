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
            return '<a class="btn" onclick="openUpdateParamTemplate(\''+row.id+'\')">修改</a>'+
            '<a class="btn" onclick="delParamTemplate(\''+row.id+'\',\''+row.name+'\')">删除</a>';
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
           '<input type="text" class="paramName span1" >'+
           '<span style="margin-left: 10px;margin-right: 10px;">英文名</span>'+
           '<input type="text" class="paramName span1" >'+
           '<span style="margin-left: 10px;margin-right: 10px;">页面组件</span>'+
           '<select class="span1"><option value="0">无</option>';
           for(var i=0;i<_allComponent.length;i++){
                paramHtml += '<option value="'+_allComponent[i].value+'">'+_allComponent[i].name+'</option>';
           }

           paramHtml +='</select>'+
           '<span style="margin-left: 10px;margin-right: 10px;">类型</span>'+
           '<select class="paramType span1">'+
               '<option value="0">数字</option>'+
               '<option value="1">布尔值</option>'+
               '<option value="2">字符串</option>'+
               '<option value="3">数组</option>'+
           '</select>'+
           '<span style="margin-left: 10px;margin-right: 10px;">默认值</span>'+
           '<input type="text" class="paramDefaultValue span1" >'+
           '<span style="margin-left: 10px;margin-right: 10px;">校验规则</span>'+
           '<input type="text" class="paramDefaultValue span1" >'+
           '<a onclick="delParam(this)">删除</a>'+
           '</div></div>';
    return paramHtml;
}


var drawParamHtml = function(param){
    var s0,s1,s2,s3,s4 = "";
    if( param.valueType == 0 ){
        s0 = "selected";
    }
    if( param.valueType == 1 ){
        s1 = "selected";
    }
    if( param.valueType == 2 ){
        s2 = "selected";
    }
    if( param.valueType == 3 ){
        s3 = "selected";
    }

    var paramHtml = '<div class="control-group">'+
           '<label class="control-label" style="width:60px">参数名称</label>'+
           '<div class="controls" style="margin-left:60px;">'+
               '<input type="text" class="paramName span1" value="'+param.name+'" paramId="'+param.id+'">'+
               '<span style="margin-left: 10px;margin-right: 10px;">类型</span>'+
               '<select class="paramType span1">'+
                   '<option value="0" '+s0+'>数字</option>'+
                   '<option value="1" '+s1+'>布尔值</option>'+
                   '<option value="2" '+s2+'>字符串</option>'+
                   '<option value="3" '+s3+'>数组</option>'+
               '</select>'+
               '<span style="margin-left: 10px;margin-right: 10px;">默认值</span>'+
               '<input type="text" class="paramDefaultValue span1" value="'+param.defaultValue+'" >'+
               '<span style="margin-left: 10px;margin-right: 10px;">备注</span>'+
               '<input type="text" class="paramDes span1" value="'+param.des+'">'+
               '<a onclick="delParam(this)" paramId="'+param.id+'">删除</a>'+
           '</div></div>';
    return paramHtml;
}


var addParam = function(){
    $('#paramList').append(addParamHtml());
    return false;
}

var openAddCmdTemp = function () {

    $('#myModalLabel').html('创建指令');
    var htmlStr = '<form id="edit-profile" class="form-horizontal"><div class="control-group" style="margin-top: 18px;">'+
       '<label class="control-label" style="width:60px">指令名称</label><div class="controls" style="margin-left:60px;">'+
       '<input type="text" class="span4"  maxlength="16" id="paramTemplateName"> </div><br>';
    htmlStr+='<label class="control-label" style="width:60px">指令KEY</label><div class="controls" style="margin-left:60px;">'+
       '<input type="text" class="span4"  maxlength="6" id="paramTemplateName"> </div><br>';
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

var openUpdateParamTemplate = function (id) {
    var obj = {
        id:id
    }
    $.danmuAjax('/v1/api/admin/paramTemplate/get', 'GET','json','',obj, function (data) {
        if(data.result == 200) {
          console.log(data);
          $('#myModalLabel').html('修改参数'+data.data.paramTempName+'模版');
          var htmlStr = '<form id="edit-profile" class="form-horizontal"><div class="control-group" style="margin-top: 18px;">'+
             '<label class="control-label" style="width:60px">模版名称</label><div class="controls" style="margin-left:60px;">'+
             '<input type="text" class="span4"  maxlength="16" id="paramTemplateName" value="'+data.data.paramTempName+'"> </div><br>';
          for(var i=0;i<data.data.paramList.length;i++){
             htmlStr+='<div id="paramList">'+drawParamHtml(data.data.paramList[i]);
             htmlStr+='</div>';
          }
          htmlStr+='</div></form>';
          $('#modalBody').html(htmlStr);
          var buttonHtml = '<a class="btn btn-primary" onclick="addParam()">新增参数</a> <button class="btn btn-primary" onclick="saveParam(\''+id+'\')">保存</button>';
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
    var paramNameList = $('.paramName.span1');

    var paramTypeList = $('.paramType.span1');

    var paramDefaultValueList = $('.paramDefaultValue.span1');
    var paramDesList = $('.paramDes.span1');

    var paramTemplateName = $('#paramTemplateName').val();
    if( '' == paramTemplateName){
        alert("模版名称不能为空");
        return;
    }

    if(paramNameList.length == 0 || paramTypeList.length == 0 || paramDefaultValueList.length == 0 ||
        paramDesList.length == 0){
         alert("参数不能为空");
         return;
    }

    var paramList = new Array();

    for( var i=0;i<paramNameList.length;i++){
        var param = new Object();

        param.name = $(paramNameList[i]).val();
        if( '' == param.name ){
            alert("参数名称不能为空");
            return;
        }
        var reg = /^[a-zA-Z0-9]*$/g;
        if(!reg.test(param.name)){
            alert("参数名称只能为字母和数字");
            return;
        }
        param.valueType = $(paramTypeList[i]).val();
        param.defaultValue = $(paramDefaultValueList[i]).val();

        param.des = $(paramDesList[i]).val();
        if( '' == param.des){
            alert("备注不能为空");
            return;
        }
        param.id = $(paramNameList[i]).attr('paramId');
        paramList.push(param);
    }

    var obj={
        paramTempId:id,
        paramTempName:paramTemplateName,
        paramList:paramList
    }

    $.danmuAjax('/v1/api/admin/paramTemplate/save', 'POST','json','', JSON.stringify(obj), function (data) {
        if(data.result == 200) {
            console.log(data);
             $.initTable('tableList', columnsArray, quaryObject, tableUrl);
              $('#myModal').modal('hide');
            alert('创建成功');
        }else{
            alert('创建失败');
        }
    }, function (data) {
        console.log(data);
    });

}




var delParamTemplate = function(id,paramName){
    if(confirm('确定要删除'+paramName+'吗？')){
        var obj = {
            id:id
        }
        $.danmuAjax('/v1/api/admin/paramTemplate/del', 'GET','json','',obj, function (data) {
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