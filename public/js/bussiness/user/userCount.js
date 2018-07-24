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
var tableUrl = '/v1/api/admin/wechatCount/page';
var columnsArray = [
    {
        field: 'addressName',
        title: '地址',
        align: 'center'
    },
    {
        title: '周一',
        align: 'center',
        formatter: function (value, row, index) {
            if(row){
                return new Date(parseInt(row.startDate)).format('yyyy-MM-dd hh:mm:ss');
            }
        }
    },{
        title: '周日',
        align: 'center',
        formatter: function (value, row, index) {
            if(row){
                return new Date(parseInt(row.endDate)).format('yyyy-MM-dd hh:mm:ss');
            }
        }
    },
    {
        field: 'count',
        title: '人数',
        align: 'center'
    }
];
var quaryObject = {
    pageSize: 20
};
var getDate = function(){
    $.danmuAjax('/v1/api/admin/wechatCount/currentYearCountDate', 'GET','json',null, function (data) {
        if(data.result == 200){
            console.log(data);
            if(data.data!=null && data.data!=undefined){
                data.data.forEach(function( val, index ) {
                    //console.log( val, index, this );
                    $(".dateSelect").append("<option value='"+val+"'>"+val+"</option>");
                });
            }
        }else{

        }
    }, function (data) {
        console.log(data);
    });
}

var queryCountData = function () {
    quaryObject.date = $(".dateSelect").val();
    //加载表格数据
    $.initTable('tableList', columnsArray, quaryObject, tableUrl);
}
var init = function () {
    getDate();
    queryCountData();

}

$(".dateSelect").change(function (e) {
    queryCountData();
});

init();