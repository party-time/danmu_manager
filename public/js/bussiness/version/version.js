var tableUrl = '/v1/api/admin/version/page';
var columnsArray = [
    {
        title: '序号',
        align: 'center',
        formatter: function (value, row, index) {
            return index+1;
        }
    },
    {
        field: 'name',
        title: '版本名称',
        align: 'center'
    },
    {
        field: 'version',
        title: '版本号',
        align: 'center'
    },
    {
        field: 'id', title: '操作',
        align: 'center',
        formatter: function (value, row, index) {
            return '<a class="btn" onclick="delVersion(\''+row.id+'\',\''+row.version+'\')">删除</a>';
        },
        events: 'operateEvents'
    }
];
var quaryObject = {
    pageSize: 20
};

var openAddVersion = function(){
    $('#myModalLabel').html('新建版本信息');
    var htmlStr = '<form id="edit-profile" class="form-horizontal"><div class="control-group" style="margin-top: 18px;">'+
   '<label class="control-label" style="width:65px">版本名称</label><div class="controls" style="margin-left:60px;">'+
   '<input type="text" class="span4" id="versionName" maxlength="6" /></div><br>'+
   '<label class="control-label" style="width:65px">版本号</label><div class="controls" style="margin-left:60px;">'+
       '<input type="text" class="span4" id="version"  maxlength="30" placeholder="xxx.xxx.xxx例如1.0.0" onblur="checkVersion()"></div><br>'+
   '<label class="control-label" style="width:65px">版本描述</label><div class="controls" style="margin-left:60px;">'+
          '<textarea class="span4" id="describe"></textarea></div><br>';

    htmlStr += '</div></div></form>';
    $('#modalBody').html(htmlStr);
    var footerHtml = '<button class="btn btn-primary" onclick="addVersion()" id="addVersion">保存</button>';
    $('#modalFooter').html(footerHtml);
    $('#myModal').modal('show');

}

var addVersion = function(){
    var versionName = $("#versionName").val();
    var versionNum = $("#version").val();
    var describe = $("#describe").val();

    if( '' == versionName){
        alert("版本名称不能为空");
        return;
    }

    checkVersion();
    var obj= {
        name:versionName,
        version:versionNum,
        describe,describe
    }
    $.danmuAjax('/v1/api/admin/version/save', 'POST','json',obj, function (data) {
        if( data.result == 200){
            $('#myModal').modal('hide');
            $.initTable('tableList', columnsArray, quaryObject, tableUrl);
        }else{
            if(data.result_msg){
                alert(data.result_msg)
            }else{
                alert('保存失败')
            }
        }
    }, function (data) {
        console.log(data);
    });
}

var delVersion = function(id,versionNum){
    if (confirm('确认要删除这个版本“' + versionNum + '”吗？')) {
             $.danmuAjax('/v1/api/admin/version/del?id='+id, 'GET','json',null, function (data) {
              if (data.result == 200) {
                  console.log(data);
                  $.initTable('tableList', columnsArray, quaryObject, tableUrl);
              }else{
                 alert('删除失败')
              }
            }, function (data) {
                console.log(data);
            });
        }
}

var checkVersion = function(version){
    var versionNum = $("#version").val();
    if( ''== versionNum){
            $('#addVersion').attr('disabled','true');
            alert("版本号不能为空");
            return;
    }else{
        var reg = new RegExp("^([0-9]{1}).([0-9]{1}).([0-9]{1})$");
        var r=versionNum.match(reg);
        if( r == null){
            $('#addVersion').attr('disabled','true');
            alert("版本号不正确");
            return;
        }
    }
    var obj = {
        version:versionNum
    }
    $.danmuAjax('/v1/api/admin/version/checkVersion', 'GET','json',obj, function (data) {
        if( data.result != 200){
            if(data.result_msg){
                $('#addVersion').attr('disabled','true');
                alert(data.result_msg);
                return;
            }else{
                alert('查询失败')
            }
        }else{
            $('#addVersion').removeAttr('disabled');
        }
    }, function (data) {
        console.log(data);
    });
}

//加载表格数据
$.initTable('tableList', columnsArray, quaryObject, tableUrl);