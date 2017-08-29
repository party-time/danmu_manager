var tableUrl = '/v1/api/admin/report/page';
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

var columnsArray = [
    {
        title: '序号',
        align: 'center',
        formatter: function (value, row, index) {
            return index+1;
        }
    },
    {
        title: '举报人头像',
        align: 'center',
        width:'15%',
        formatter: function (value, row, index) {
            if(null != row && null != row.wechatUser){
                return '<img width="40%" src="'+row.wechatUser.imgUrl+'" />';
            }else{
               return "";
            }
        }
    },
    {
        title: '举报人昵称',
        align: 'center',
        formatter: function (value, row, index) {
            if(null != row && null != row.wechatUser){
                return row.wechatUser.nick;
            }else{
               return "";
            }
        }
    },
    {
        title: '被举报人头像',
        align: 'center',
        width:'15%',
        formatter: function (value, row, index) {
            if(null != row && null != row.wechatUser){
                return '<img width="40%" src="'+row.danmu.url+'" />';
            }else{
               return "";
            }
        }
    },
    {
        title: '举报人昵称',
        align: 'center',
        formatter: function (value, row, index) {
            if(null != row && null != row.danmu.nick){
                return row.danmu.nick;
            }else{
               return "";
            }
        }
    },
    {
        title: '举报弹幕',
        align: 'center',
        formatter: function (value, row, index) {
            if(null != row && null != row.danmu ){
              return row.danmu.msg;
            }
        }
    },
    {
        title: '状态',
        align: 'center',
        formatter: function (value, row, index) {
            if(null != row && null != row.report){
                if( null == row.report.status){
                    return "未处理";
                }else if( 0 == row.report.status){
                    return "已删除";
                }else if( 1== row.report.status){
                    return "不处理";
                }
              return row.h5Template.tempTitle;
            }
        }
    },
    {
        title: '时间',
        align: 'center',
        formatter: function (value, row, index) {
              return new Date(parseInt(row.report.createTime)).format('yyyy-MM-dd hh:mm:ss');
        }
    },
    {
        title: '操作',
        align: 'center',
        formatter: function (value, row, index) {
            if( null == row.report.status ){
                return '<a class="btn" onclick="blockDanmu(\''+row.wechatUser.openId+'\',\''+row.danmu.id+'\',\''+row.report.id+'\')">屏蔽弹幕</a><a class="btn" onclick="noProcess(\''+row.wechatUser.openId+'\',\''+row.report.id+'\')" >不做处理</a>';
            }
        }
    }

];
var quaryObject = {
    pageSize: 20
};


var blockDanmu = function(openId,danmuId,reportId){
    if (confirm('确认要屏蔽弹幕吗')) {
         $.danmuAjax('/v1/api/admin/report/blockDanmu?openId='+openId+'&danmuId='+danmuId+'&reportId='+reportId, 'GET','json',null, function (data) {
          if (data.result == 200) {
              console.log(data);
              alert('屏蔽成功');
              $.initTable('tableList', columnsArray, quaryObject, tableUrl);
          }else{
             alert('屏蔽失败')
          }
        }, function (data) {
            console.log(data);
        });
    }
}

var noProcess = function(openId,reportId){
    if (confirm('确认要不处理此条弹幕吗')) {
         $.danmuAjax('/v1/api/admin/report/noProcess?openId='+openId+'&reportId='+reportId, 'GET','json',null, function (data) {
          if (data.result == 200) {
              console.log(data);
              alert('提交成功');
              $.initTable('tableList', columnsArray, quaryObject, tableUrl);
          }else{
             alert('提交失败')
          }
        }, function (data) {
            console.log(data);
        });
    }
}

//加载表格数据
$.initTable('tableList', columnsArray, quaryObject, tableUrl);