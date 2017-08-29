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
        width:'30%',
        formatter: function (value, row, index) {
            if(null != row && null != row.wechatUser){
                return '<img width="30%" src="'+row.wechatUser.imgUrl+'" />';
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
        width:'30%',
        formatter: function (value, row, index) {
            if(null != row && null != row.wechatUser){
                return '<img width="30%" src="'+row.danmu.url+'" />';
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
                    return "弹幕已删除";
                }else if( 1== row.report.status){
                    return "不做处理";
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
                return "<a class="btn" >屏蔽弹幕</a><a class="btn" >不做处理</a>";
            }
        }
    }

];
var quaryObject = {
    pageSize: 20
};


var blockDanmu = function(){

}

var noProcess = function(){}

}


//加载表格数据
$.initTable('tableList', columnsArray, quaryObject, tableUrl);