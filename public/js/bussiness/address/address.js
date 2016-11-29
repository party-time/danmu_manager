var tableUrl = '/v1/api/admin/address/page';
var columnsArray = [
    {
        field: 'name',
        title: '名称',
        align: 'center'
    },
    {
        field: 'cityId',
        title: '城市',
        halign: "center",
        align: "center",
        formatter:function(value, row, index){
            for (var i = 0; i < _cities.length; i++) {
                if (_cities[i].CityID == row.cityId) {
                    return _cities[i].name;
                }
            }
            return '-';
        }
    },
    {
        field: 'address',
        title: '地址',
        align: 'center',
    },
    {
        field: 'id', title: '操作',
        align: 'center',
        formatter: function (value, row, index) {
            return '<a class="btn" onclick="delAddress(\''+row.name+'\',\''+row.id+'\')">删除</a><a class="btn" onclick="updateAddress(\''+row.id+'\')">修改</a>'+
            '<a class="btn" onclick="openScreenDialog(\''+row.name+'\',\''+row.id+'\')">屏幕管理</a>';
        },
        events: 'operateEvents'
    }
];
var quaryObject = {
    pageSize: 20
};

var delAddress = function(name,id){
    if (confirm('确定要删除' + name + '的地址吗？')) {
        var obj = {
                id:id
        }
        $.danmuAjax('/v1/api/admin/address/del', 'GET','json',obj, function (data) {
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

var addAddress = function(){
    window.location.href='/cinema/add';
}

var updateAddress = function(addressId){
    window.location.href='/cinema/update?addressId='+addressId;
}

var screenTableUrl = '/v1/api/admin/client/page';

var g_addressName ='';
var g_addressId = '';



var screenColumnsArray =[
  {
      field: 'name',
      title: '名称',
      align: 'center'
  },
  {
      field: 'registCode',
      title: '注册码',
      align: 'center'
  },
  {
      field: 'overdueStr',
      title: '有效期',
      align: 'center'
  },
  {
      field: 'isHaveClient',
      title: '客户端',
      align: 'center',
      formatter: function (value, row, index) {
          if(row.isHaveClient==0){
              return '无';
          }else{
              return '有';
          }
      }
  },
  {
     field: 'id', title: '操作',
     align: 'center',
     formatter: function (value, row, index) {
          return '<a class="btn" onclick="delScreen(\''+g_addressId+'\',\''+row.id+'\',\''+row.name+'\')">删除</a>';
     }
  }
];

var openScreenDialog = function(addressName,addressId){
    g_addressName = addressName;
    g_addressId = addressId;
    var screenQueryObject = {
        addressId:g_addressId,
        pageSize: 6
    };
    $.initTable('screenTableList', screenColumnsArray, screenQueryObject, screenTableUrl,function(){
        $('#modalBody').find('.pull-left').remove();
    });
    $('#myModalLabel').html(addressName+'的屏幕管理，<a onclick="openSaveScreen()">创建新屏幕</a>');
    $('#modalBody').find('.pull-left').remove();
    $('#myModal').modal('show');
}

var delScreen = function (addressId,screenId, screenName) {
    if (confirm('确定要删除' + screenName + '吗？')) {
        var obj = {
            id:screenId
        };
        $.danmuAjax('/v1/api/admin/client/del', 'GET','json',obj, function (data) {
            if (data.result == 200) {
              console.log(data);
              var screenQueryObject = {
                  addressId:g_addressId,
                  pageSize: 6
              };
              $.initTable('screenTableList', screenColumnsArray, screenQueryObject, screenTableUrl);
              }else{
                 alert('删除失败')
              }
        }, function (data) {
            console.log(data);
        });
    }
}

var openSaveScreen = function(){
    $('#screenTableList').bootstrapTable('destroy');
    var htmlStr = '<form id="edit-profile" class="form-horizontal"><div class="control-group" style="margin-top: 18px;">'+
       '<label class="control-label" style="width:50px">名称</label><div class="controls" style="margin-left:60px;">'+
       '<input type="text" class="span4" id="screenName" maxlength="10" ></div><br>'+
       '<label class="control-label" style="width:50px">有效期(不填为永久)</label><div class="controls" style="margin-left:60px;">'+
           '<input type="text" class="span4" id="overdue" placeholder="yyyy-MM-dd" maxlength="10" ></div></div></form>';

    $('#modalBody').html(htmlStr);
    var footerHtml = '<a class="btn btn-primary" onclick="saveScreen()">创建</a><a class="btn" onclick="cancelSaveScreen()">取消</a>';
    $('#modalFooter').html(footerHtml);
}

var cancelSaveScreen = function(){
    var htmlStr = '<table id="screenTableList" class="table table-striped" table-height="360"></table>';
    $('#modalBody').html(htmlStr);
    $('#modalFooter').empty();
    var screenQueryObject = {
      addressId:g_addressId,
      pageSize: 6
  };
    $.initTable('screenTableList', screenColumnsArray, screenQueryObject, screenTableUrl,function(){
                                 $('#modalBody').find('.pull-left').remove();
    });
}

var checkDateTime = function(str){
    var reg=/^(\d+)-(\d{1,2})-(\d{1,2})$/;
    var r=str.match(reg);
    if(r==null) return false;
    var d= new Date(r[1],r[2],r[3]);
    if(d.getFullYear()!=r[1]) return false;
    if(d.getMonth()!=r[2]) return false;
    if(d.getDate()!=r[3]) return false;
    return true;
}

var saveScreen = function () {
    var screenName = $('#screenName').val();
    var overdue = $('#overdue').val();
    if( '' ==screenName){
        alert('名称不能为空');
        return;
    }
    if( screenName.length < 2){
        alert('名称最小长度大于1个字符');
        return;
    }

    if('' != overdue && !checkDateTime(overdue)){
        alert('日期格式错误');
        return;
    }

    var obj = {
        'addressId':g_addressId,
        'name': $('#screenName').val(),
        'overdueStr': $('#overdue').val()
    };
     $.danmuAjax('/v1/api/admin/client/save', 'POST','json',obj, function (data) {
        if (data.result == 200) {
          console.log(data);
          cancelSaveScreen();
          }else{
             alert('保存失败')
          }
    }, function (data) {
        console.log(data);
    });

}

//加载表格数据
$.initTable('tableList', columnsArray, quaryObject, tableUrl);