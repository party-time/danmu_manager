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

var tableUrl = '/v1/api/admin/historyDanmu/page';
var sendPrizeUrl = '/api/api/admin/historyDanmu/addPrize';
var partyId;
var arrayArea = [];
var columnsArray = [
    {
        field: 'nick',
        title: '昵称',
        align: 'center'
    },
    {
        field: 'msg',
        title: '弹幕信息',
        halign: "center",
        align: "left"
    },
    {
        field: 'url',
        title: '图片',
        align: 'center',
        formatter: function (value, row, index) {
            return '<img src="' + value + '" style="width: 30px;height: 30px;"/>';
        }
    },{
        field: 'sendStatus',
        title: '发送状态',
        align: 'center',
        formatter: function (value, row, index) {
            if(value==0){
                return '未发送';
            }else if(value==1){
                return '已发送';
            }else{
                return '已发成功';
            }
        }
    },
    {
        field: 'danmuTypeName',
        title: '弹幕类型',
        align: 'center',
        formatter: function (value, row, index) {
            if(value==null || danmuTypeName=="" || danmuTypeName==undefined){
                return "未知类型"
            }else{
                return value;
            }
        }
    },
    {
        field: 'createTime',
        title: '发送时间',
        align: 'center',
        formatter: function (value, row, index) {
            return new Date(parseInt(value)).format('yyyy-MM-dd hh:mm');
        }
    },
    {
        field: '', title: '操作',
        align: 'center',
        formatter: function (value, row, index) {
            if (row.send) {
                return '已发送';
            } else {
                var str = '';
                if(row.blocked){
                    str='<button type="button" onclick="unblocked(\''+row.id+'\')">解除屏蔽</button>';
                }else{
                    str='<button type="button" onclick="blocked(\''+row.id+'\')">屏蔽</button>';
                }
                return str+'<button type="button" class = "sendPrize" id="row_' + row.id + '" onclick="openSendGift(\''+row.id+'\')">发奖品</button>';
            }
        },
        events: 'operateEvents'
    }
];
var quaryObject = {};
//加载表格数据
var initable = function () {
    var url = location.href;
    if (url.indexOf('partyId=') != -1) {
        var param = url.substr(url.indexOf('?') + 1).split("&");
        partyId = param[0].substr(param[0].indexOf('=') + 1);
        quaryObject.partyId = partyId;


        var arrayStr ='';
        if(arrayArea!=null && arrayArea.length>0){
            for(var i=0; i<arrayArea.length; i++){
                if(i==arrayArea.length-1){
                    arrayStr  +=arrayArea[i].id;
                }else{
                    arrayStr  +=arrayArea[i].id+",";
                }
            }
        }
        quaryObject.arrayArea = arrayStr;


        $.initTable('tableList', columnsArray, quaryObject, tableUrl);
    }
}

window.operateEvents = {
    'click .sendPrize': function (e, value, row, index) {
        var object = {
            'openId': row.openId,
            'danmuId': row.id,
            'addressId': quaryObject.addressId,
            'partyId': quaryObject.partyId
        }
        $.danmuAjax(sendPrizeUrl, 'GET','json',object, function (data) {
            if (data.result == 200) {
                row.send = true;
                $('#tableList').bootstrapTable('updateRow', {index: index, row: row});
            }
        }, function (data) {
            console.log(data);
        });
    }
};
function sucess(data) {
    alert(data);
}
function error(data) {
    alert(data);
}

var blocked = function(id){
    if(confirm('确定要屏蔽吗？')){
        var obj = {
            id:id
        }
        $.danmuAjax('/v1/api/admin/historyDanmu/block', 'GET','json',obj, function (data) {
            if(data.result == 200) {
              console.log(data);
                initable();
             }else{
                alert('操作失败');
             }
        }, function (data) {
            console.log(data);
        });
    }

}

initable();



function doShowAddress() {

    $('#myAddressModalLabel').html('<h3>场地：</h3>');
    movieSchedulePage();

    $('#addressModel').modal('show');

}

var movieSchedulePage = function(){
    var object = {
        pageSize: 6
    }
    var movieScheduleTableUrl = '/v1/api/admin/address/getPageByPartyId?partyId='+partyId;
    var movieScheduleColumnsArray =[
         {
             field: 'id',
             title: '广告开始时间',
             align: 'center',
             width:'10%',
             formatter: function (value, row, index) {
                 var ischckfalse = false;
                 if(arrayArea!=null && arrayArea.length>0){
                     for(var i=0; i<arrayArea.length; i++){
                        if(row.id==arrayArea[i].id){
                            ischckfalse = true;
                            break;
                        }
                     }
                 }
                 if(ischckfalse){
                     return '<input type="checkbox" name="areaCheck" onclick="setArea(\''+row.id+'\',\''+row.name+'\',this)" checked/>'
                 }else{
                    return ' <input type="checkbox" name="areaCheck" onclick="setArea(\''+row.id+'\',\''+row.name+'\',this)"/>'
                 }

             }
         },
         {
             field: 'name',
             title: '地址',
             align: 'center'
         }
     ];
     var tableSuccess = function(){
     $('#modalBody').find('.pull-left').remove();
     }
     var buttonHtml = '<button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>';
     $('#modalFooter').html(buttonHtml);

     $.initTable('addressTableList', movieScheduleColumnsArray, object, movieScheduleTableUrl,function () {
         
     });
 }

function setArea(id,name,controlObject) {

    var object  = {
        id:id,
        name:name
    }
    if(controlObject.checked){
        var inputflg = false;
        if(arrayArea!=null && arrayArea.length>0){
            for(var i=0; i<arrayArea.length; i++){
                if(arrayArea[i].id!=id){
                    inputflg = true;
                }else{
                    return;
                }
            }
        }else{
            arrayArea = [];
            inputflg = true;
        }


        if(inputflg){
            arrayArea.push(object);
        }
    }else{
        removeArea(id);
    }
    resetAreaArray();
}

var removeArea = function (id) {

    var tempArray = [];
    for(var i=0; i<arrayArea.length; i++){
        if(arrayArea[i].id!=id){
            tempArray.push(arrayArea[i]);
        }
    }
    arrayArea = tempArray;

    resetAreaArray();
}

var resetAreaArray = function () {
    var contentHtml = '';
    for(var i=0; i<arrayArea.length; i++){
        contentHtml +='<span style="width: 100px;" id="'+arrayArea[i].id+'"><button>'+arrayArea[i].name+'</button><button onclick="removeArea(\''+arrayArea[i].id+'\')">x</button></span>&nbsp;'
    }
    $("#addressDivList").html(contentHtml);

    initable();
}

function doExport(){
    var arrayStr ='';
    if(arrayArea!=null && arrayArea.length>0){
        for(var i=0; i<arrayArea.length; i++){
            if(i==arrayArea.length-1){
                arrayStr  +=arrayArea[i].id;
            }else{
                arrayStr  +=arrayArea[i].id+",";
            }
        }
    }
    var form=$("<form>");//定义一个form表单
    form.attr("style","display:none");
    form.attr("target","");
    form.attr("method","POST");
    form.attr("action","/v1/api/admin/historyDanmu/download?addressArea="+arrayStr+"&partyId="+quaryObject.partyId);
    $("body").append(form);//将表单放置在web中
    form.submit();//表单提交
}


var openSendGift = function(id){
    var buttonHtml = '<button class="btn btn-primary" onclick="sendGift(\''+id+'\')">发送</button><button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>';
    $('#modalFooter').html(buttonHtml);
    $('#myModal').modal('show');
}

var sendGift = function(id){
    if( $('#giftMsg').val() == ''){
        alert('请填写奖品内容');
        return;
    }
    if(confirm('确定要发送吗？')){
        var obj = {
            id:id,
            msg:$('#giftMsg').val()
        }
        $.danmuAjax('/v1/api/admin/historyDanmu/sendGift', 'GET','json',obj, function (data) {
            if(data.result == 200) {
              console.log(data);
              $('#myModal').modal('hide');
                alert('操作成功');

             }else{
                alert('操作失败');
             }
        }, function (data) {
            console.log(data);
        });
    }
}



