var tableUrl = '/v1/api/admin/address/page';
var columnsArray = [
    {
        title: 'ID',
        align: 'center',
        formatter:function(value, row, index){
            return row.id;
        }
    },
    {
        field: 'name',
        title: '名称',
        align: 'center'
    },
    {
        field: 'cityId',
        title: '城市',
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
        align: 'center'
    },
    {
        field: 'id',
        title: '操作',
        align: 'center',
        formatter: function (value, row, index) {
            var buttonStr =  '<a class="btn" onclick="delAddress(\''+row.name+'\',\''+row.id+'\')">删除</a><a class="btn" onclick="updateAddress(\''+row.id+'\')">修改</a>'+
            '<a class="btn" onclick="openScreenDialog(\''+row.name+'\',\''+row.id+'\')">屏幕管理</a>';
            if(row.type ==0 && $.cookie('role')=='589a98cd77c8afdcbdeaeeb4'){
                buttonStr += '<a class="btn" onclick="openUpdateDialog(\''+row.name+'\',\''+row.id+'\')">版本升级</a>';
            }
            return buttonStr;
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
        del
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
    r[2] = r[2]-1;
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

Date.prototype.format = function(f){
    var o ={
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(),    //day
        "h+" : this.getHours(),   //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
        "S" : this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(f))f=f.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(f))f = f.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));return f
}

var openUpdateDialog = function(addressName,addressId){
    var updatePlanTableUrl = '/v1/api/admin/updateplan/page';
    var updatePlanObject = {
        addressId:addressId,
        pageSize: 6
    }
    var updatePlanArray =[
        {
            title: '版本号',
            align: 'center',
            formatter: function (value, row, index) {
                if(row.version){
                    return row.version.version;
                }else{
                    return '';
                }

            }
        },
        {
            title: '更新时间',
            align: 'center',
            formatter: function (value, row, index) {
               return new Date(parseInt(row.updatePlan.updatePlanTime)).format('yyyy-MM-dd hh:mm');
            }
        },
        {
            title: '更新状态',
            align: 'center',
            formatter: function (value, row, index) {
                var str = '';
                var updatePlanMachineList = row.updatePlan.updatePlanMachineList;
                if(updatePlanMachineList){
                    for(var i=0;i<updatePlanMachineList.length;i++){
                        var updatePlanMachine = updatePlanMachineList[i];
                        if(updatePlanMachine.machineNum == 1){
                            str += '左边墙壁';
                        }else{
                            str += '右边墙壁';
                        }
                        if(updatePlanMachine.status==0){
                             str += '未更新';
                        }else if(updatePlanMachine.status == 1){
                             str += '更新成功';
                         }else if(updatePlanMachine.status == 2){
                             str += '更新失败';
                         }else if(updatePlanMachine.status == 3){
                             str += '开始更新';
                         }else{
                             str += '未知状态';
                         }
                    }
                }else{
                    str = '未更新';
                }
               return str;
            }
        },
        {
           field: 'id', title: '操作',
           align: 'center',
           formatter: function (value, row, index) {
                return '<a class="btn" onclick="delUpdatePlan(\''+row.updatePlan.id+'\',\''+addressName+'\',\''+addressId+'\')">删除</a>';
           }
        }
    ];
    var tableSuccess = function(){
        $('#modalBody').find('.pull-left').remove();
    }
    $.initTable('screenTableList', updatePlanArray, updatePlanObject, updatePlanTableUrl,tableSuccess);
    $('#myModalLabel').html(addressName+'的升级管理，<a onclick="openCreateUpdateDialog(\''+addressName+'\',\''+addressId+'\')">创建升级计划</a>');
    $('#modalBody').find('.pull-left').remove();
    $('#modalFooter').html("");
    $('#myModal').modal('show');
}

var delUpdatePlan = function(updatePlanId,addressName,addressId){
     if (confirm('确定要删除此升级计划吗？')) {
             var obj = {
                     id:updatePlanId
             }
             $.danmuAjax('/v1/api/admin/updateplan/del', 'GET','json',obj, function (data) {
                 if (data.result == 200) {
                   console.log(data);
                   openUpdateDialog(addressName,addressId)
                   }else{
                      alert('删除失败')
                   }
             }, function (data) {
                 console.log(data);
             });
         }
}

var openCreateUpdateDialog = function(addressName,addressId){
    var versionTableUrl = '/v1/api/admin/version/pageByAddressId';
    var versionObject = {
        addressId:addressId,
        pageSize: 6
    }
    var versionArray =[
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
                return '<a class="btn" onclick="selectVersion(\''+addressId+'\',\''+row.id+'\',\''+addressName+'\',\''+row.version+'\')">选择</a>';
           }
        }
    ];
    var tableSuccess = function(){
        $('#modalBody').find('.pull-left').remove();
    }
    $.initTable('screenTableList', versionArray, versionObject, versionTableUrl,tableSuccess);
    $('#myModalLabel').html(addressName+'选择需要升级的版本号');
    $('#modalBody').find('.pull-left').remove();
    var footerHtml = '<a class="btn" onclick="openUpdateDialog(\''+addressName+'\',\''+addressId+'\')">取消</a>';
    $('#modalFooter').html(footerHtml);
    $('#myModal').modal('show');
}

var selectVersion = function(addressId,versionId,addressName,versionNum){
    var htmlStr = '<form id="edit-profile" class="form-horizontal"><div class="control-group" style="margin-top: 18px;">'+
       '<label class="control-label" style="width:80px">版本号</label><div class="controls" style="margin-left:60px;">'+
       '<p class="span4">'+versionNum+'</p></div><br>'+
       '<label class="control-label" style="width:80px">更新时间</label><div class="controls" style="margin-left:60px;">'+
           '<input type="text" class="span4" id="updatePlanTime" placeholder="yyyy-MM-dd HH:mm" maxlength="16" ></div></div></form>';

    $('#modalBody').html(htmlStr);
    $('#myModalLabel').html(addressName+'填写升级时间');
    var footerHtml = '<a class="btn btn-primary" onclick="saveUpdatePlan(\''+addressName+'\',\''+addressId+'\',\''+versionId+'\')">创建</a><a class="btn" onclick="cancelSelectVersion(\''+addressName+'\',\''+addressId+'\')">取消</a>';
    $('#modalFooter').html(footerHtml);
    $('#myModal').modal('show');
}

var cancelSelectVersion = function(addressName,addressId){
    $('#modalBody').html('<table id="screenTableList" class="table table-striped" table-height="360"></table>');
    openCreateUpdateDialog(addressName,addressId);
}

var checkUpdatePlanDateTime = function(str){
    var reg=/^(\d+)-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2})$/;
    var r=str.match(reg);
    if(r==null) return false;
    r[2] = r[2]-1;
    var d= new Date(r[1],r[2],r[3],r[4],r[5]);
    if(d.getFullYear()!=r[1]) return false;
    if(d.getMonth()!=r[2]) return false;
    if(d.getDate()!=r[3]) return false;
    if(d.getHours()!=r[4]) return false;
    if(d.getMinutes()!=r[5]) return false;
    return true;
}

var saveUpdatePlan = function(addressName,addressId,versionId){
    var updatePlanTime = $('#updatePlanTime').val();
    if( '' == updatePlanTime){
        alert('更新时间不能为空');
        return;
    }
    if(!checkUpdatePlanDateTime(updatePlanTime)){
        alert('更新时间格式错误');
        return;
    }
    var obj = {
        addressId:addressId,
        versionId:versionId,
        updateTimeStr:updatePlanTime
    };
    $.danmuAjax('/v1/api/admin/updateplan/save', 'GET','json',obj, function (data) {
        if (data.result == 200) {
          console.log(data);
          $('#modalBody').html('<table id="screenTableList" class="table table-striped" table-height="360"></table>');
           openUpdateDialog(addressName,addressId);
          }else{
             alert('保存失败')
          }
    }, function (data) {
        console.log(data);
    });
}

//加载表格数据
$.initTable('tableList', columnsArray, quaryObject, tableUrl);