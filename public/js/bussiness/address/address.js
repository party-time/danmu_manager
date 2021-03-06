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
        title: '操作',
        align: 'center',
        formatter: function (value, row, index) {
            var buttonStr =  '<a class="btn" onclick="delAddress(\''+row.name+'\',\''+row.id+'\')">删除</a><a class="btn" onclick="updateAddress(\''+row.id+'\')">修改</a>';
            if($.cookie('role')=='589a98cd77c8afdcbdeaeeb4' || $.cookie('role')=='589a98cd77c8afdcbdeaeeb5'){
                buttonStr += '<a class="btn" onclick="openScreenDialog(\''+row.name+'\',\''+row.id+'\')">屏幕管理</a>';
            }
            if($.cookie('role')=='589a98cd77c8afdcbdeaeeb4'){
                buttonStr += '<a class="btn" onclick="openDeviceDialog(\''+row.name+'\',\''+row.id+'\')">设备管理</a>';
            }
            buttonStr += '<a class="btn" onclick="openControlDialog(\''+row.name+'\',\''+row.id+'\')">控制台</a>';
            if(row.type ==0 && $.cookie('role')=='589a98cd77c8afdcbdeaeeb4'){
                buttonStr += '<a class="btn" onclick="openUpdateDialog(\''+row.name+'\',\''+row.id+'\')">版本升级</a>';
            }
            buttonStr += '<a class="btn" onclick="openCms(\''+row.id+'\')">电商管理</a>';
            buttonStr += '<a class="btn" onclick="openFuncControl(\''+row.id+'\')">功能开关</a>';
            return buttonStr;
        },
        events: 'operateEvents'
    }
];
var quaryObject = {
    pageSize: 20
};


var openFuncControl = function(addressId){
    var obj = {
            id:addressId
    }
    $.danmuAjax('/v1/api/admin/address/query', 'GET','json','',obj, function (data) {
        if (data.result == 200) {
          console.log(data);
          var htmlStr = '<form id="edit-profile" class="form-horizontal">';
             htmlStr += '<div>';
             if( data.data.controlerStatus != null ){
                if(data.data.controlerStatus.pay){
                    htmlStr += '打赏<input type="checkbox" value="pay" checked>&nbsp;&nbsp;&nbsp;';
                }else{
                    htmlStr += '打赏<input type="checkbox" value="pay" >&nbsp;&nbsp;&nbsp;';
                }
                if(data.data.controlerStatus.love){
                    htmlStr += '表白<input type="checkbox" value="love" checked>';
                }else{
                    htmlStr += '表白<input type="checkbox" value="love">';
                }

             }else{
                htmlStr += '打赏<input type="checkbox" value="pay">&nbsp;&nbsp;&nbsp;表白<input type="checkbox" value="love">';
             }
             htmlStr += '</div><br>';
             htmlStr += '</form>';
             $('#modalBody').html(htmlStr);
             $('#myModalLabel').html('以下功能选中不可用');
             var buttonHtml = '<button class="btn btn-primary" onclick="postFuncControl(\''+addressId+'\')">保存</button>';
             $('#modalFooter').html(buttonHtml);
             $('#myModal').modal('show');
        }else{
             alert('查询失败')
        }
    }, function (data) {
        console.log(data);
    });
}

var postFuncControl = function(addressId){
    var statusList="";
    $("input[type='checkbox']:checkbox:checked").each(function(){
        statusList+=$(this).val();
        statusList+=',';
    })
    if( statusList != ""){
        statusList = statusList.substr(0,statusList.length-1);
    }
    var obj = {
         addressId:addressId,
         keys:statusList
    }
    $.danmuAjax('/v1/api/admin/address/setAddressControle', 'GET','json','',obj, function (data) {
        if (data.result == 200) {
          console.log(data);
             $('#myModal').modal('hide');
          }else{
             alert('更新失败')
          }
    }, function (data) {
        console.log(data);
    });
}


var openCms = function(addressId){
    window.location.href = '/shopManager/cms?addressId='+addressId;
}

var delAddress = function(name,id){
    if (confirm('确定要删除' + name + '的地址吗？')) {
        var obj = {
                id:id
        }
        $.danmuAjax('/v1/api/admin/address/del', 'GET','json','',obj, function (data) {
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

var g_paramTemplate = [];

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
    field: 'screenId',
    title: '屏幕编号',
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
        title: '客户端模版',
        align: 'center',
        formatter: function (value, row, index) {
            if( null != g_paramTemplate){
                var shtml = '<select style="width:112px;" id="pt_'+row.id+'" onchange="selectParamTemplate(\''+row.id+'\')">';
                if( null == row.paramTemplateId){
                    shtml += '<option selected>无模版</option>';
                }else{
                    shtml += '<option>无模版</option>';
                }
                for(var i=0;i<g_paramTemplate.length;i++){
                    shtml += '<option ';
                    if(row.paramTemplateId == g_paramTemplate[i].id){
                         shtml += 'selected';
                    }
                    shtml +=' value="'+g_paramTemplate[i].id+'">'+g_paramTemplate[i].name+'</option>';
                }
                shtml += '</select>';
                return shtml;
            }
        }
  },
  {
     field: '',
      title: '操作',
     align: 'center',
     formatter: function (value, row, index) {
          return '<a class="btn" onclick="openUpdateParamDialog(\''+row.name+'\',\''+row.id+'\',\''+row.paramTemplateId+'\')" >改参数</a>' +
              '<a class="btn" onclick="delScreen(\''+g_addressId+'\',\''+row.id+'\',\''+row.name+'\')">删除</a>'+
              '<a class="btn btn-info" onclick="showProjectorDialog(\''+row.registCode+'\',\''+row.name+'\',\''+g_addressId+'\')">投影仪</a>';
              //'<a class="btn btn-info" onclick="showProjectorDialog(\''+row.registCode+'\')">投影仪</a>';
     }
  }
];

var drawParamHtml = function(param){
    var s0 = "";
    if( param.valueType == 0 ){
        s0 = "数字";
    }
    if( param.valueType == 1 ){
        s0 = "布尔值";
    }
    if( param.valueType == 2 ){
        s0 = "字符串";
    }
    if( param.valueType == 3 ){
        s0 = "数组";
    }

    var paramHtml = '<div><label class="control-label" style="width:60px">'+param.des+'</label>'+'<span class="span1"  style="color:red;margin-top: 3px;">'+s0+'</span>'+
           '<input type="text" class="param span3"  maxlength="20" value="'+param.paramValue+'" paramId="'+param.paramId+'" paramValueId="'+param.paramValueId+'"></div><br>';

    return paramHtml;
}

var openUpdateParamDialog = function(screenName,danmuClientId,paramTemplateId){
    var obj = {
        objId:danmuClientId,
        paramTempId:paramTemplateId
    }
    $.danmuAjax('/v1/api/admin/paramTemplate/findByObj', 'GET','json','',obj, function (data) {
        if(data.result == 200) {
          console.log(data);
          $('#myModalLabel').html(screenName+'的参数修改');
          if(data.data.length ==0){
            $('#modalBody').html("<div><h1>请先选择参数模版</h1></div>");
            var footerHtml = '<a class="btn" onclick="cancelSaveScreen()">取消</a>';
            $('#modalFooter').html(footerHtml);
          }else{
              var htmlStr = '<form id="edit-profile" class="form-horizontal"><div class="control-group" style="margin-top: 18px;">';
              for(var i=0;i<data.data.length;i++){
                  htmlStr += drawParamHtml(data.data[i]);
              }
              htmlStr+='</div></form>';
              $('#modalBody').html(htmlStr);
              var footerHtml = '<a class="btn btn-primary" onclick="saveParam(\''+danmuClientId+'\')">保存</a><a class="btn" onclick="cancelSaveScreen()">取消</a>';
              $('#modalFooter').html(footerHtml);
          }

          $('#myModal').modal('show');
         }else{
            alert('查询失败');
         }
    }, function (data) {
        console.log(data);
    });

}

var saveParam = function(danmuClientId){
    var paramList = $('.param.span3');

    var paramValueList = new Array();
    for(var i=0;i<paramList.length;i++){
        var param = new Object();
        if($(paramList[i]).attr('paramValueId') && 'null' != $(paramList[i]).attr('paramValueId')){
            param.id=$(paramList[i]).attr('paramValueId');
        }
        param.objId=danmuClientId;
        param.type=0;
        if($(paramList[i]).attr('paramId') && 'null' != $(paramList[i]).attr('paramId')){
             param.paramId = $(paramList[i]).attr('paramId');
        }
        param.value=$(paramList[i]).val();
        paramValueList.push(param);
    }

    $.danmuAjax('/v1/api/admin/paramTemplate/updateParam', 'POST','json','', JSON.stringify(paramValueList), function (data) {
            if(data.result == 200) {
                console.log(data);

                alert('修改成功');
            }else{
                alert('修改失败');
            }
        }, function (data) {
            console.log(data);
        });

}



var openScreenDialog = function(addressName,addressId){
    g_addressName = addressName;
    g_addressId = addressId;
    $('#modalBody').html('<table id="screenTableList" class="table table-striped" table-height="360"></table>');
    $('.modal-dialog').css("width","800px");
    $.danmuAjax('/v1/api/admin/paramTemplate/all', 'GET','json','',null, function (data) {
        if(data.result == 200) {
          console.log(data);

          g_paramTemplate = data.data;
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
         }else{
            alert('删除失败');
         }
    }, function (data) {
        console.log(data);
    });

}

var showProjectorDialog = function(registerCode,addressName,addressId){
    $('#myModalLabel').html(registerCode+'的投影仪');
    $('.modal-dialog').css("width","560px");


    initProjectorInfo(registerCode,addressName,addressId);
    $('#modalFooter').html("");
    $('#myModal').modal('show');
}


var initProjectorInfo = function (registerCode,addressName,addressId) {
    var usedHours = 0;
    var realUsedHours = 0;
    var realUsedMinute = 0;
    var id;

    $.danmuAjax('/v1/api/admin/projector/info/'+registerCode, 'GET','json','',{}, function (data) {

        if(data.result==200){
            var projectorObject = data.data;
            if(projectorObject!=null) {
                var intTime = parseInt(projectorObject.usedTime)
                var hour = parseInt(intTime/60/60);
                var minute = parseInt((intTime-hour*60*60)/60);
                var seconds = parseInt(intTime -hour*60*60 -minute*60);
                usedHours = hour +'时'+minute+'分'+seconds+'秒';
                realUsedHours = projectorObject.realUsedHours;
                realUsedMinute = projectorObject.realUsedMinute;
                id = projectorObject.id;
            }
        }
        var htmlStr = '<form id="edit-profile" class="form-horizontal">';
        htmlStr += '<label class="control-label" style="width:80px">实际时长</label><div class="controls" style="margin-left:60px;">';
        htmlStr += '<input type="text" style="width: 80px;" class="device" id="realUsedHours"  maxLength="4" value="'+realUsedHours+'">时';
        htmlStr += '<input type="text" style="width: 50px;" class="device" id="realUsedMinute"  maxLength="2" value="'+realUsedMinute+'">分';
        htmlStr += ' <input type="button" class="btn-info" onclick="setRealUsedHours(\''+registerCode+'\',\''+addressName+'\',\''+addressId+'\')" value="保存"/> ';
        htmlStr += '</div><br>';
        htmlStr += '<label class="control-label" style="width:80px">使用时长</label><div class="controls" style="margin-left:60px;">';
        htmlStr += '<input type="text" class="device span3" value="'+usedHours+'" readonly>';
        htmlStr += '</div><br>';
        htmlStr += '<label class="control-label" style="width:80px"></label><div class="controls" style="margin-left:60px;">';
        htmlStr += '<input type="button" onclick="resetHours(\''+registerCode+'\',\''+addressName+'\',\''+addressId+'\')" value="重置投影时间"/>';
        htmlStr += '&nbsp;<a class="btn btn-info" onclick="openScreenDialog(\''+addressName+'\',\''+addressId+'\')">返回</a>';
        htmlStr += '</div><br>';
        htmlStr += '</div><br>';
        htmlStr += '</form>';
        $('#modalBody').html(htmlStr);
    });
}


var resetHours=function (registerCode,addressName,addressId) {
    if (confirm('你确定要重置时间')) {
        $.danmuAjax('/v1/api/admin/projector/reset', 'GET','json','',{registerCode:registerCode}, function (data) {
            if(data.result==200){
                alert('更新成功');

                initProjectorInfo(registerCode,addressName,addressId);
            }
        });
    }
}

var setRealUsedHours=function (registerCode,addressName,addressId) {

    $.danmuAjax('/v1/api/admin/projector/setRealHours', 'GET','json','',{registerCode:registerCode,realUsedHours:$("#realUsedHours").val(),realUsedMinute:$("#realUsedMinute").val()}, function (data) {
        if(data.result==200){
            alert('更新成功');
            initProjectorInfo(registerCode,addressName,addressId);
        }
    });
}

var openDeviceDialog = function(addressName,addressId){
    var obj ={
        addressId:addressId
    }
    $.danmuAjax('/v1/api/admin/device/find', 'GET','json','',obj, function (data) {
        if(data.result ==200){
            $('#myModalLabel').html(addressName+'的设备管理');
            var htmlStr = '<form id="edit-profile" class="form-horizontal"><div class="control-group" style="margin-top: 18px;">';
            if(data.data && data.data.length >0){
                /*var url1,url1=''
                var ip1,ip2 = '';
                var port1,port2='';
                var id1,id2,id3,id4='';*/
                var javaClientNum=0;
                var projectorNum=0;
                for(var i=0; i<data.data.length; i++){
                    var type = data.data[i].type;
                    var id = data.data[i].id;
                    var ip = data.data[i].ip;
                    var port= data.data[i].port;
                    var number=data.data[i].number;

                    if( port == null ){
                        port = '';
                    }
                    var url=data.data[i].url;
                    if(type==0){
                        htmlStr += '<label class="control-label" style="width:80px">投影仪'+number+'</label><div class="controls" style="margin-left:60px;">';
                        htmlStr += '<input type="text" class="device span3" deviceType="'+type+'" value="'+url+'" deviceId="'+id+'"> ';
                        htmlStr += '<input type="hidden" value="'+number+'" class="number span1" style="width: 10px;">';
                        htmlStr += '</div><br>';
                    }else if(type==1){
                        htmlStr +=  '<label class="control-label" style="width:80px;">javaClient'+number+'</label><div class="controls" style="margin-left:60px;">';
                        htmlStr += '<input type="text" class="device span3"  maxlength="20" deviceType="'+type+'" value="'+ip+'" deviceId="'+id+'"> ';
                        htmlStr += 'port：<input type="text" class="port span1" value="'+port+'" style="width: 40px;">';
                        htmlStr += '<input type="hidden" value="'+number+'" class="number span1" style="width: 10px;"> ';
                        htmlStr += '</div><br>';
                        javaClientNum++;
                    }
                }

                if(javaClientNum<3){
                    htmlStr +=  '<label class="control-label" style="width:80px;">javaClient3</label><div class="controls" style="margin-left:60px;">';
                    htmlStr += '<input type="text" class="device span3"  maxlength="20" deviceType="1"> ';
                    htmlStr += 'port：<input type="text" class="port span1" value="" style="width: 40px;">';
                    htmlStr += '<input type="hidden" value="3" class="number span1" style="width: 10px;"> ';
                    htmlStr += '</div><br>';
                }

            }else{
                htmlStr += '<label class="control-label" style="width:80px">投影仪1</label><div class="controls" style="margin-left:60px;">';
                htmlStr += '<input type="text" class="device span3" deviceType="0"> ';
                htmlStr += '<input type="hidden" value="1" class="number span1" style="width: 10px;"> ';
                htmlStr += '</div><br>';

                htmlStr += '<label class="control-label" style="width:80px">投影仪2</label><div class="controls" style="margin-left:60px;">';
                htmlStr += '<input type="text" class="device span3" deviceType="0"> ';
                htmlStr += '<input type="hidden" value="2" class="number span1" style="width: 10px;"> ';
                htmlStr += '</div><br>';

                htmlStr +=  '<label class="control-label" style="width:80px;">javaClient1</label><div class="controls" style="margin-left:60px;">';
                htmlStr += '<input type="text" class="device span3"  maxlength="20" deviceType="1"> ';
                htmlStr += 'port：<input type="text" class="port span1" value="" style="width: 40px;">';
                htmlStr += '<input type="hidden" value="1" class="number span1" style="width: 10px;"> ';
                htmlStr += '</div><br>';

                htmlStr +=  '<label class="control-label" style="width:80px;">javaClient2</label><div class="controls" style="margin-left:60px;">';
                htmlStr += '<input type="text" class="device span3"  maxlength="20" deviceType="1"> ';
                htmlStr += 'port：<input type="text" class="port span1" value="" style="width: 40px;">';
                htmlStr += '<input type="hidden" value="2" class="number span1" style="width: 10px;"> ';
                htmlStr += '</div><br>';

                htmlStr +=  '<label class="control-label" style="width:80px;">javaClient3</label><div class="controls" style="margin-left:60px;">';
                htmlStr += '<input type="text" class="device span3"  maxlength="20" deviceType="1"> ';
                htmlStr += 'port：<input type="text" class="port span1" value="" style="width: 40px;">';
                htmlStr += '<input type="hidden" value="3" class="number span1" style="width: 10px;"> ';
                htmlStr += '</div><br>';
            }
            htmlStr+='</div></div></form>';
            $('#modalBody').html(htmlStr);
            var buttonHtml = '<button class="btn btn-primary" onclick="saveDevice(\''+addressId+'\')">保存</button>';
             $('#modalFooter').html(buttonHtml);
            $('#myModal').modal('show');
        }else{
            alert('失败');

        }

    }, function (data) {
        console.log(data);
    });
}

var saveDevice = function(addressId){
    var ipList = $('.device.span3');
    if( ipList && ipList.length>0){
        var deviceInfoList = new Array();
        var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;

        for(var i=0;i<ipList.length;i++){
            var deviceInfo = new Object();
            deviceInfo.ip=$(ipList[i]).val();
            if($(ipList[i]).attr("deviceType")==1 && !reg.test(deviceInfo.ip) && i<2){
                alert("ip地址格式不正确，请重新填写");
                return;
            }
            if($(ipList[i]).attr("deviceType")==1){
                deviceInfo.port = $(ipList[i]).parent().find(".port.span1").val();
            }
            if($(ipList[i]).attr("deviceType")==0){
                deviceInfo.url = $(ipList[i]).parent().find(".device.span3").val();
                deviceInfo.ip='';
            }
            deviceInfo.number = $(ipList[i]).parent().find(".number.span1").val();
            deviceInfo.type=$(ipList[i]).attr("deviceType");
            deviceInfo.addressId=addressId;
            if($(ipList[i]).attr("deviceId")){
                deviceInfo.id = $(ipList[i]).attr("deviceId");
            }
            deviceInfoList.push(deviceInfo);
        }
        $.danmuAjax('/v1/api/admin/device/save', 'POST','json','', JSON.stringify(deviceInfoList), function (data) {
                if(data.result == 200) {
                    console.log(data);
                    $('#myModal').modal('hide');
                    alert('创建成功');
                }else{
                    alert('创建失败');
                }
            }, function (data) {
                console.log(data);
            });
    }

}

var selectParamTemplate = function(id){
    var obj = {
        id:id,
        paramTemplateId:$("#pt_"+id).val()
    };
    $.danmuAjax('/v1/api/admin/client/selectParam', 'GET','json','',obj, function (data) {
        if (data.result == 200) {

          $.initTable('screenTableList', screenColumnsArray, screenQueryObject, screenTableUrl);
          }else{
             alert('选择失败')
          }
    }, function (data) {
        console.log(data);
    });
}

var delScreen = function (addressId,screenId, screenName) {
    if (confirm('确定要删除' + screenName + '吗？')) {
        var obj = {
            id:screenId
        };
        $.danmuAjax('/v1/api/admin/client/del', 'GET','json','',obj, function (data) {
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
       '<label class="control-label" style="width:50px">有效期</label><div class="controls" style="margin-left:60px;">'+
       '<input type="text" class="span4" id="overdue" placeholder="不填为永久,填写格式yyyy-MM-dd" maxlength="10" ></div><br>'+
       '<label class="control-label" style="width:60px">屏幕编号</label><div class="controls" style="margin-left:60px;">'+
       '<input type="text" class="span4" id="screenId" placeholder="屏幕编号，杨腾飞专用" maxlength="10" ></div><br>'+
       '<label class="control-label" style="width:60px">参数模版</label><div class="controls" style="margin-left:60px;">';

       var shtml = '<select class="span4" id="paramTemplateId">';
      for(var i=0;i<g_paramTemplate.length;i++){
          shtml += '<option ';
          shtml +=' value="'+g_paramTemplate[i].id+'">'+g_paramTemplate[i].name+'</option>';
      }
      shtml += '</select></div>';

      htmlStr+= shtml+'</div></form>';

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
        'overdueStr': $('#overdue').val(),
        'paramTemplateId':$('#paramTemplateId').val(),
        'screenId':$('#screenId').val()
    };
     $.danmuAjax('/v1/api/admin/client/save', 'POST','json','application/x-www-form-urlencoded; charset=UTF-8',obj, function (data) {
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
    $('#modalBody').html('<table id="screenTableList" class="table table-striped" table-height="360"></table>');
    var updatePlanTableUrl = '/v1/api/admin/updateplan/page';
    var updatePlanObject = {
        addressId:addressId,
        pageSize: 6
    }
    var updatePlanArray =[
        {
            title: '版本名称',
            align: 'center',
            formatter: function (value, row, index) {
                if(row.version){
                    return row.version.name;
                }else{
                    return '';
                }

            }
        },
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
                         }else if(updatePlanMachine.status == 4){
                            str += '版本回滚';
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
           title: '操作',
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
             $.danmuAjax('/v1/api/admin/updateplan/del', 'GET','json','',obj, function (data) {
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
           field: '', title: '操作',
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
           '<input type="text" class="span4" id="updatePlanTime" placeholder="yyyy-MM-dd" maxlength="20" ></div></div></form>';

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
    var now = new Date();
    var d1 = new Date(updatePlanTime.replace(/\-/g, "\/"));
    if(d1<now || d1 == now ){
        alert('更新时间必须晚于今天');
        return;
    }
    var obj = {
        addressId:addressId,
        versionId:versionId,
        updateTimeStr:updatePlanTime
    };
    $.danmuAjax('/v1/api/admin/updateplan/save', 'GET','json','',obj, function (data) {
        if (data.result == 200) {
          console.log(data);
          $('#modalBody').html('<table id="screenTableList" class="table table-striped" table-height="360"></table>');
           openUpdateDialog(addressName,addressId);
          }else{
             alert(data.result_msg)
          }
    }, function (data) {
        console.log(data);
    });
}

var _picRandom = new Date().getTime();
/**
 * projectStart 开启投影  projectClose 关闭投影  projectChange 投影切白
 * appRestart app重启  appStart app开启  appClose app关闭
 * flashUpdate flash更新  flashRollBack  flash回滚  javaUpdate java升级  javaRollBack java回滚
 * videoDown 视频下载   expressionDown 表情下载  specialImgDown 特效图片下载  timerDmDown 定时弹幕下载 adDmDown 广告弹幕下载
 * configCreate 生成配置表
 * teamViewStart1,teamViewStart2 开启teamView  teamViewClose1,teamViewClose2 关闭teamView  screenPic1,screenPic2 截屏
 */
var openControlDialog = function(addressName,addressId){
    g_addressId = addressId;
    var role = $.cookie('role');
    var htmlStr = '<form id="edit-profile" class="form-horizontal"><div class="control-group" style="margin-top: 18px;">';
    htmlStr +='<label class="control-label" style="width:60px">投影相关</label>';
    htmlStr +='<div class="controls" style="margin-left:60px;">';
    htmlStr +='<a class="btn" onclick="sendControl(\'projectorStart\')">投影开启</a>';
    htmlStr +='<a class="btn" onclick="sendControl(\'projectorClose\')">投影关闭</a>';
    htmlStr +='<a class="btn" onclick="sendControl(\'projectorChange\')">投影切白</a>';
    htmlStr +='</div><br>';

    htmlStr +='<label class="control-label" style="width:60px">app相关</label><div class="controls" style="margin-left:60px;">';
    htmlStr +='<a class="btn" onclick="sendControl(\'appRestart\')">重启</a> <a class="btn" onclick="sendControl(\'appStart\')">开启</a>';
    htmlStr +='<a class="btn" onclick="sendControl(\'appClose\')">关闭</a>';
    htmlStr +='</div><br>';

    htmlStr +='<label class="control-label" style="width:60px">下载相关</label><div class="controls" style="margin-left:60px;">';
    //htmlStr +='<a class="btn" onclick="sendControl(\'videoDown\')">特效视频下载</a>';
    //htmlStr +='<a class="btn" onclick="sendControl(\'expressionDown\')">表情下载</a>';
    //htmlStr +='<a class="btn" onclick="sendControl(\'specialImgDown\')">特效图片下载</a>';
    //htmlStr +='<a class="btn" onclick="sendControl(\'timerDmDown\')">定时弹幕下载</a>';
    //htmlStr +='<a class="btn" onclick="sendControl(\'adDmDown\')">广告弹幕下载</a>';
    htmlStr +='<a class="btn" onclick="sendControl(\'resourceAllDown\')">下载所有资源</a>';
    htmlStr +='</div><br>';

    htmlStr +='<label class="control-label" style="width:60px">配置表</label><div class="controls" style="margin-left:60px;">';
    htmlStr +='<a class="btn" onclick="sendControl(\'configCreate\')">生成配置表</a>';
    htmlStr +='</div><br>';

    htmlStr +='<label class="control-label" style="width:60px">预置弹幕</label><div class="controls" style="margin-left:60px;">';
    htmlStr +='<a class="btn" onclick="reinitPreDanmu()">重新加载预置弹幕</a>';
    htmlStr +='</div><br>';


    if(role == '589a98cd77c8afdcbdeaeeb4') {
        htmlStr +='<label class="control-label" style="width:60px">模拟指令</label><div class="controls" style="margin-left:60px;">';
        htmlStr +='<select id="selectDmStart">';
        for(var i=1; i<11; i++){
            htmlStr +='<option>danmu-start-'+i+'</option>';
        }
        htmlStr +='</select>';
        htmlStr +='<a class="btn" onclick="sendControl(\'danmu-start\')">确定</a>';
        htmlStr +='<a class="btn" onclick="sendControl(\'movie-start\')">电影开始</a>';
        htmlStr +='<a class="btn" onclick="sendControl(\'movie-close\')">电影结束</a>';
        htmlStr +='</div><br>';

        htmlStr += '<label class="control-label" style="width:60px">客户端更新</label><div class="controls" style="margin-left:60px;">';
        htmlStr += '<a class="btn" onclick="sendControl(\'updateClientDown\')">客户端下载（先）</a>';
        htmlStr += '<a class="btn" onclick="sendControl(\'updatePlanCreate\')">更新计划（后）</a>';
        htmlStr += '</div><br>';

        htmlStr += '<label class="control-label" style="width:60px">升级相关</label><div class="controls" style="margin-left:60px;">';
        htmlStr += '<a class="btn" onclick="sendControl(\'flashUpdate\')">flash升级</a>';
        htmlStr += '<a class="btn" onclick="sendControl(\'flashRollBack\')">flash还原</a>';
        htmlStr += '<a class="btn" onclick="sendControl(\'javaUpdate\')">java升级</a>';
        htmlStr += '<a class="btn" onclick="sendControl(\'javaRollBack\')">java还原</a>';
        htmlStr += '</div><br>';

        htmlStr += '<label class="control-label" style="width:60px">执行脚本</label><div class="controls" style="margin-left:60px;">';
        htmlStr += '<a class="btn" onclick="sendControl(\'scriptCreate\')">生成脚本</a>';
        htmlStr += '</div><br>';

        htmlStr += '<label class="control-label" style="width:60px">teamView</label><div class="controls" style="margin-left:60px;">';
        htmlStr += '<a class="btn" onclick="sendControl(\'teamViewStart1\')">开启左侧</a>';
        htmlStr += '<a class="btn" onclick="sendControl(\'screenPic1\')">左侧截图</a>';
        htmlStr += '<a class="btn" href="'+_baseImageUrl+'/screenpic/' + addressId + '_1.jpg" target="_blank">查看左侧截图</a>';
        htmlStr += '<a class="btn" onclick="sendControl(\'teamViewClose1\')">关闭左侧</a>';
        htmlStr += '<a class="btn" onclick="sendControl(\'teamViewStart2\')">开启右侧</a>';
        htmlStr += '<a class="btn" onclick="sendControl(\'screenPic2\')">右侧截图</a>';
        htmlStr += '<a class="btn" href="'+_baseImageUrl+'/screenpic/' + addressId + '_2.jpg" target="_blank">查看右侧截图</a>';
        htmlStr += '<a class="btn" onclick="sendControl(\'teamViewClose2\')">关闭右侧</a>';
        htmlStr += '<a class="btn" onclick="sendControl(\'teamViewStart3\')">开启第三台</a>';
        htmlStr += '<a class="btn" onclick="sendControl(\'screenPic3\')">第三台截图</a>';
        htmlStr += '<a class="btn" href="'+_baseImageUrl+'/screenpic/' + addressId + '_3.jpg" target="_blank">查看第三台截图</a>';
        htmlStr += '<a class="btn" onclick="sendControl(\'teamViewClose3\')">关闭第三台</a>';
        htmlStr += '</div><br>';

        htmlStr += '<label class="control-label" style="width:60px">投影重新开启</label><div class="controls" style="margin-left:60px;">';
        htmlStr +='<a class="btn" onclick="sendControl(\'projectorNewStart\')">投影开启（杭州厅）</a>';
        htmlStr += '<br>';

    }

    htmlStr	+='</div></div>';
    htmlStr+='</form>';

    var titleHtmlStr ='';
    $('#myModalLabel').html('<div><p><h1>'+addressName+'的控制台</h1></p><div id="deviceStatus" ><h5>java1:正常 java2:断开连接</h5></div></div>');
    $('#modalBody').html(htmlStr);
    $('#myModal').modal('show');
}

var reinitPreDanmu = function (partyId,addressId) {
    $.danmuAjax('/v1/api/admin/party/reinitPreDanmu?addressId='+g_addressId, 'GET','json',null, null);
}

var openScreenPic = function(addressId){
    window.open('/screenpic/'+addressId+'_1.jpg?r='+new Date().getTime());
}

var sendControl = function(cmd){
    /*if(cmd=='danmu-start'){
        cmd = $('#selectDmStart').val();
    }*/
    if( cmd == 'resourceAllDown'){
        var st = $.cookie('sendControlTime');
        if( st ){
            var aa = (new Date().getTime() - st ) /1000;
            if( aa > 600){
                $.cookie('sendControlTime', new Date().getTime(),{ expires: 1 });
            }else{
                alert("操作过于频繁，10分钟之内只能执行一次!");
                return;
            }
        }else{
            $.cookie('sendControlTime', new Date().getTime() , { expires: 1 });
        }
    }
    _picRandom = new Date().getTime();
    var obj = {
        'danmuStart':$('#selectDmStart').val(),
        'cmd':cmd,
        addressId:g_addressId
    }
    $.danmuAjax('/v1/api/admin/clientControl/control', 'GET','json','',obj, function (data) {
          if(data.result == 200) {
                console.log(data);
                alert("操作成功");
          }else{
             alert('保存失败');
          }
    }, function (data) {
        console.log(data);
    });

}



//加载表格数据
$.initTable('tableList', columnsArray, quaryObject, tableUrl);