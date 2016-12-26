var tableUrl = '/v1/api/admin/reward/page';
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
        field: 'wechatUser.imgUrl',
        title: '微信头像',
        align: 'center',
        width:'30%',
        formatter: function (value, row, index) {
            return '<img width="30%" src="'+row.wechatUser.imgUrl+'" />';
        }
    },
    {
        field: 'wechatUser.nick',
        title: '微信昵称',
        align: 'center'
    },
    {
        title: '活动名称',
        align: 'center',
        formatter: function (value, row, index) {
            if(null != row && null != row.party && "null" != row.party){
              return row.party.name;
            }
        }
    },
    {
        field: 'wechatReward.total_fee',
        title: '金额',
        align: 'center',
    },
    {
        field: 'wechatReward.createTime',
        title: '时间',
        align: 'center',
        formatter: function (value, row, index) {
              return new Date(parseInt(row.wechatReward.createTime)).format('yyyy-MM-dd hh:mm:ss');
        }
    }
];
var quaryObject = {
    pageSize: 20
};

//加载表格数据
$.initTable('tableList', columnsArray, quaryObject, tableUrl);