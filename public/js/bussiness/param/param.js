var tableUrl = '/v1/api/admin/paramTemplate/page';
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
        title: '模版id',
        align: 'center'
    },
    {
        field: 'name',
        title: '模版名称',
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
           '<label class="control-label" style="width:60px">参数名称</label>'+
           '<div class="controls" style="margin-left:60px;">'+
               '<input type="text" class="paramName span1" >'+
               '<span style="margin-left: 10px;margin-right: 10px;">类型</span>'+
               '<select class="paramType span1">'+
                   '<option value="0">整数</option>'+
                   '<option value="1">小数</option>'+
                   '<option value="2">布尔值</option>'+
                   '<option value="3">字符串</option>'+
                   '<option value="4">数组</option>'+
               '</select>'+
               '<span style="margin-left: 10px;margin-right: 10px;">默认值</span>'+
               '<input type="text" class="paramDefaultValue span1" >'+
               '<span style="margin-left: 10px;margin-right: 10px;">备注</span>'+
               '<input type="text" class="paramDes span1" >'+
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
    if( param.valueType == 4 ){
        s4 = "selected";
    }
    var paramHtml = '<div class="control-group">'+
           '<label class="control-label" style="width:60px">参数名称</label>'+
           '<div class="controls" style="margin-left:60px;">'+
               '<input type="text" class="paramName span1" value="'+param.name+'">'+
               '<span style="margin-left: 10px;margin-right: 10px;">类型</span>'+
               '<select class="paramType span1">'+
                   '<option value="0" '+s0+'>整数</option>'+
                   '<option value="1" '+s1+'>小数</option>'+
                   '<option value="2" '+s2+'>布尔值</option>'+
                   '<option value="3" '+s3+'>字符串</option>'+
                   '<option value="4" '+s4+'>数组</option>'+
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

var openAddParamTemplate = function () {
    $('#myModalLabel').html('创建参数模版');
    var htmlStr = '<form id="edit-profile" class="form-horizontal"><div class="control-group" style="margin-top: 18px;">'+
       '<label class="control-label" style="width:60px">模版名称</label><div class="controls" style="margin-left:60px;">'+
       '<input type="text" class="span4"  maxlength="16" id="paramTemplateName"> <a class="btn btn-primary" onclick="addParam()">新增参数</a></div><br>';
    htmlStr+='<div id="paramList">'+addParamHtml();
    htmlStr+='</div></div></form>';
    $('#modalBody').html(htmlStr);
    var buttonHtml = '<button class="btn btn-primary" onclick="saveParam()">保存</button>';
    $('#modalFooter').html(buttonHtml);
    $('#myModal').modal('show');
};

var openUpdateParamTemplate = function (id) {
    var obj = {
        id:id
    }
    $.danmuAjax('/v1/api/admin/paramTemplate/get', 'GET','json',obj, function (data) {
        if(data.result == 200) {
          console.log(data);
          $('#myModalLabel').html('修改参数'+data.data.name+'模版');
          var htmlStr = '<form id="edit-profile" class="form-horizontal"><div class="control-group" style="margin-top: 18px;">'+
             '<label class="control-label" style="width:60px">模版名称</label><div class="controls" style="margin-left:60px;">'+
             '<input type="text" class="span4"  maxlength="16" id="paramTemplateName" value="'+data.data.name+'"> <a class="btn btn-primary" onclick="addParam()">新增参数</a></div><br>';
          for(var i=0;i<data.data.paramList.length;i++){
             htmlStr+='<div id="paramList">'+drawParamHtml(data.data.paramList[i]);
             htmlStr+='</div>';
          }
          htmlStr+='</div></form>';
          $('#modalBody').html(htmlStr);
          var buttonHtml = '<button class="btn btn-primary" onclick="saveParam()">保存</button>';
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

var saveParam = function(){
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
        var reg = /^[a-zA-Z]*$/g;
        if(!reg.test(param.name)){
            alert("参数名称只能为字母");
            return;
        }
        param.valueType = $(paramTypeList[i]).val();
        param.defaultValue = $(paramDefaultValueList[i]).val();
        if( '' == param.defaultValue){
             alert("默认值不能为空");
             return;
        }
        param.des = $(paramDesList[i]).val();
        if( '' == param.des){
            alert("备注不能为空");
            return;
        }
        paramList.push(param);
    }

    var obj={
        name:paramTemplateName,
        paramList:paramList
    }

    $.danmuAjax('/v1/api/admin/paramTemplate/save', 'POST','json', JSON.stringify(obj), function (data) {
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
        $.danmuAjax('/v1/api/admin/paramTemplate/del', 'GET','json',obj, function (data) {
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



//加载表格数据
$.initTable('tableList', columnsArray, quaryObject, tableUrl);