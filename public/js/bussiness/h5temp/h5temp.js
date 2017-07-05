var tableUrl = '/v1/api/admin/h5temp/page';
var columnsArray = [
    {
        title: '序号',
        align: 'center',
        formatter: function (value, row, index) {
            return index+1;
        }
    },
    {
        field: 'tempTitle',
        title: '页面名称',
        align: 'center'
    },
    {
        field: 'h5Url',
        title: '页面地址',
        align: 'center'
    },
    {
        title: '操作',
        align: 'center',
        formatter: function (value, row, index) {
            return '<a class="btn" onclick="openUpdateH5temp(\''+row.id+'\')">修改</a>'+
            '<a class="btn" onclick="del(\''+row.id+'\',\''+row.tempTitle+'\')">删除</a>';
        },
        events: 'operateEvents'
    }
];

var quaryObject = {
    pageSize: 20
};

var openAddH5temp = function(){
    $('#myModalLabel').html('创建页面');
    var htmlStr = '<form id="edit-profile" class="form-horizontal"><div class="control-group" style="margin-top: 18px;">'+
       '<label class="control-label" style="width:60px">页面名称</label><div class="controls" style="margin-left:60px;">'+
       '<input type="text" class="span4"  maxlength="16" id="tempTitle"> </div><br>';
       htmlStr +='<label class="control-label" style="width:60px">是否全局</label><div class="controls" style="margin-left:60px;">'+
          '<select id="isBase" class="span1" onchange="checkIsBase()"><option value="0">是</option><option value="1" selected>否</option></select><span>全局只能有一个</span></div><br>';
       htmlStr +='<label class="control-label" style="width:60px">是否首页</label><div class="controls" style="margin-left:60px;">'+
       '<select id="isIndex" class="span1" onchange="selectIndex()"><option value="0">是</option><option value="1" selected>否</option></select></div><br>';
       htmlStr +='<label class="control-label" style="width:60px">是否动态</label><div class="controls" style="margin-left:60px;">'+
                '<select id="type" class="span1" onchange="selectH5tempType()"><option value="0">是</option><option value="1" selected>否</option></select></div><br>';
       htmlStr +='<label class="control-label" style="width:60px">页面URL</label><div class="controls" style="margin-left:60px;">'+
       '<span id="baseUrl"></span><input type="text" class="span2"  maxlength="16" id="h5Url" onblur="checkH5Url()"><span id="suffix"></span> </div><br>';
       htmlStr +='<label class="control-label" style="width:60px">支付金额</label><div class="controls" style="margin-left:60px;">'+
               '<input type="text" class="span2"  id="payMoney" ><span>金额的单位为分</span> </div><br>';
       htmlStr +='<label class="control-label" style="width:60px">支付标题</label><div class="controls" style="margin-left:60px;">'+
        '<input type="text" class="span2"  id="payTitle" ><span>微信支付提醒的标题</span> </div><br>';
       htmlStr +='<label class="control-label" style="width:60px">页面HTML</label><div class="controls" style="margin-left:60px;">'+
                '<textarea class="span6" style="height:150px" id="html"></textarea></div><br>';
       htmlStr+='</div></form>';
    $('#modalBody').html(htmlStr);
    selectH5tempType(1);
    var buttonHtml = '<button class="btn btn-primary" onclick="saveHtml()">保存</button>';
    $('#modalFooter').html(buttonHtml);
    $('#myModal').modal('show');
}

var openUpdateH5temp = function(id){
    var obj={
        id:id
    }
    $.danmuAjax('/v1/api/admin/h5temp/get', 'GET','json',obj, function (data) {
        if(data.result == 200) {
            $('#myModalLabel').html('修改页面');
                var html = data.data.html.replace(/textarea>/g,"textarea&gt;");
                if(data.data.payMoney == null){
                    data.data.payMoney = '';
                }
                if(data.data.payTitle == null ){
                    data.data.payTitle = '';
                }
                var htmlStr = '<form id="edit-profile" class="form-horizontal"><div class="control-group" style="margin-top: 18px;">'+
                   '<label class="control-label" style="width:60px">页面名称</label><div class="controls" style="margin-left:60px;">'+
                   '<input type="text" class="span4"  maxlength="16" id="tempTitle" value="'+data.data.tempTitle+'"> </div><br>';
                   htmlStr +='<label class="control-label" style="width:60px">是否全局</label><div class="controls" style="margin-left:60px;">'+
                  '<select id="isBase" class="span1" onchange="checkIsBase(\''+data.data.id+'\')"><option value="0">是</option><option value="1" selected>否</option></select><span>全局只能有一个</span></div><br>';
                  htmlStr +='<label class="control-label" style="width:60px">是否是首页</label><div class="controls" style="margin-left:60px;">'+
                   '<select id="isIndex" onchange="selectIndex()"><option value="0">是</option><option value="1" selected>否</option></select></div><br>';
                   htmlStr +='<label class="control-label" style="width:60px">是否动态</label><div class="controls" style="margin-left:60px;">'+
                   '<select id="type" onchange="selectH5tempType()"><option value="0">是</option><option value="1" selected>否</option></select></div><br>';
                   htmlStr +='<label class="control-label" style="width:60px">页面URL</label><div class="controls" style="margin-left:60px;">'+
                   '<span id="baseUrl"></span><input type="text" class="span4"  maxlength="16" id="h5Url" value="'+data.data.h5Url+'"><span id="suffix"></span> </div><br>';
                   htmlStr +='<label class="control-label" style="width:60px">支付金额</label><div class="controls" style="margin-left:60px;">'+
                      '<input type="text" class="span2"  maxlength="16" value="'+data.data.payMoney+'" id="payMoney" ><span>金额的单位为分</span> </div><br>';
                   htmlStr +='<label class="control-label" style="width:60px">支付标题</label><div class="controls" style="margin-left:60px;">'+
                      '<input type="text" class="span2"  id="payTitle" value="'+data.data.payTitle+'"><span>微信支付提醒的标题</span> </div><br>';
                   htmlStr +='<label class="control-label" style="width:60px">页面HTML</label><div class="controls" style="margin-left:60px;">'+
                            '<textarea class="span6" style="height:150px" id="html" >'+html+'</textarea></div><br>';
                   htmlStr+='</div></form>';
                $('#modalBody').html(htmlStr);
                $('#isIndex').val(data.data.isIndex);
                $('#type').val(data.data.type);
                selectH5tempType();
                $('#isBase').val(data.data.isBase);
                var buttonHtml = '<button class="btn btn-primary" onclick="updateHtml(\''+data.data.id+'\')">修改</button>';
                $('#modalFooter').html(buttonHtml);
                $('#myModal').modal('show');
        }else{
            alert('打开失败');
        }
    }, function (data) {
        console.log(data);
    });
}

var selectH5tempType= function(type){
    if(!type){
        type = $('#type').val();
    }
    var html = "";
    if( type == 0){
        html = _baseUploadUrl+'/wechat/h5temp/';
        $('#suffix').html("");
    }else if( type == 1){
        html = _baseUploadUrl+"/upload/h5html/";
        $('#suffix').html(".html");
    }
    $('#baseUrl').html(html);
}


var saveHtml = function(){
    if( '' == $('#tempTitle').val()){
        alert("页面名称不能为空");
        return;
    }
    if( '' == $('#h5Url').val()){
        alert('页面的url不能为空');
        return;
    }
    if( '' == $('#html').val()){
        alert('页面的html不能为空');
        return;
    }

    checkH5Url();
    checkIsBase();

    var cc = $('#checkResult').attr("check");
    if( cc > 0){
        return;
    }
    var obj ={
        tempTitle:$('#tempTitle').val(),
        h5Url:$('#h5Url').val(),
        html:$('#html').val(),
        isIndex:$('#isIndex').val(),
        type:$('#type').val(),
        isBase:$('#isBase').val(),
        payMoney:$('#payMoney').val(),
        payTitle:$('#payTitle').val()
    }
    $.danmuAjax('/v1/api/admin/h5temp/save', 'POST','json',obj, function (data) {
        if(data.result == 200) {
            console.log(data);
            $('#myModal').modal('hide');
            $.initTable('tableList', columnsArray, quaryObject, tableUrl);
            alert('创建成功');
        }else{
            alert('创建失败');
        }
    }, function (data) {
        console.log(data);
    });

}

var updateHtml = function(id){
    if( '' == $('#tempTitle').val()){
        alert("页面名称不能为空");
        return;
    }
    if( '' == $('#h5Url').val()){
        alert('页面的url不能为空');
        return;
    }
    if( '' == $('#html').val()){
        alert('页面的html不能为空');
        return;
    }
    var html = $('#html').val().replace(/textarea&gt;/g,"textarea>");

    checkH5Url(id);
    checkIsBase(id);

    var cc = $('#checkResult').attr("check");
    if( cc > 0){
        return;
    }

    var obj ={
        id:id,
        tempTitle:$('#tempTitle').val(),
        h5Url:$('#h5Url').val(),
        html:html,
        isIndex:$('#isIndex').val(),
        type:$('#type').val(),
        isBase:$('#isBase').val(),
        payMoney:$('#payMoney').val(),
        payTitle:$('#payTitle').val()
    }
    $.danmuAjax('/v1/api/admin/h5temp/update', 'POST','json',obj, function (data) {
        if(data.result == 200) {
            console.log(data);
            $('#myModal').modal('hide');
            $.initTable('tableList', columnsArray, quaryObject, tableUrl);
            alert('修改成功');
        }else{
            alert('修改失败');
        }
    }, function (data) {
        console.log(data);
    });
}


var del = function(id,name){
    if(confirm('确定要删除'+name+'的页面吗？')){
        var obj = {
            id:id
        }
        $.danmuAjax('/v1/api/admin/h5temp/del', 'GET','json',obj, function (data) {
            if(data.result == 200) {
                console.log(data);
                $('#myModal').modal('hide');
                $.initTable('tableList', columnsArray, quaryObject, tableUrl);
                alert('删除成功');
            }else{
                alert('创建失败');
            }
        }, function (data) {
            console.log(data);
        });
    }
}

var checkH5Url = function(id){
    var obj = {
        h5Url:$('#h5Url').val(),
        id:id
    }
    $.danmuAjax('/v1/api/admin/h5temp/countByh5Url', 'GET','json',obj, function (data) {
        if(data.result == 200) {
            console.log(data);
            if(data.data>0){
                $('#checkResult').attr("check","1");
                alert('h5的URL有重复，请重新填写');
            }else{
                $('#checkResult').attr("check","0");
            }
        }else{
            alert('检查h5url失败');
        }
    }, function (data) {
        console.log(data);
    });
}

var checkIsBase = function(id){
    var obj = {
        isBase:$('#isBase').val(),
        id:id
    }
    $.danmuAjax('/v1/api/admin/h5temp/countByIsBase', 'GET','json',obj, function (data) {
        if(data.result == 200) {
            console.log(data);
            var cc = 0;
            if( null == id){
                cc = 1;
            }else{
                if(obj.isBase == 0){
                    cc = 0;
                }else{
                    cc = 1;
                }
            }

            if(data.data>cc){
                $('#checkResult').attr("check","2");
                alert('已经存在全局的页面，不可以在创建');
            }else{
                $('#checkResult').attr("check","0");
            }

        }else{
            alert('检查全局页面失败');
        }
    }, function (data) {
        console.log(data);
    });
}

var selectIndex = function(){
    var isIndex = $('#isIndex').val();
    $('#type').removeAttr("disabled");
    if(isIndex == 0){
        $('#type').val(0);
        $('#type').attr("disabled","disabled");
        $('#payMoney').attr("disabled","disabled");
        $('#suffix').html("");
        $('#baseUrl').html("");
    }else{
        selectH5tempType(0);
    }
}

//加载表格数据
$.initTable('tableList', columnsArray, quaryObject, tableUrl);



