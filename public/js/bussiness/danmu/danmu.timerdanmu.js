
var tableUrl ='/v1/api/admin/timerDanmu/page';
var chartUrl ='/v1/api/admin/timerDanmu/chart';
var baseUrl="http://testimages.party-time.cn/upload";
var columnsArray = [
    {field: '', title: '编号', align: 'center',formatter: function (value, row, index) {
        return index+1;
    }},
    {field: 'typeName', title: '内容', align: 'center'},
    {field: 'content', title: '内容', halign: "center", align: "left",formatter: function (value, row, index) {
        if(row.type==0 || row.type==3){
            return  '<span style="background-color: '+row.color+'"> '+row.content+'</span>';
        }else if(row.type==4){
            return ' <img src="'+baseUrl+row.content+'" style="width: 30px;height: 30px;"/>'
        }else if(row.type!=0 && row.type!=3 && row.type!=4){
            return row.content;
        }
    }},
    {field: 'time', title: '时间', align: 'center',formatter: function (value, row, index) {
        return parseInt(row.time / 60) + "分" + row.time % 60 + "秒";
    }},
];
var quaryObject = {pageSize: 10,partyId:"582a86620cf2d2a9f936ce77"};
var getAllDanmuLibrary = function() {
    $.initTable('tableList', columnsArray, quaryObject, tableUrl,function (data) {
        $.danmuAjax(chartUrl,'GET','json',quaryObject,function (data) {
            initHighcharts(data.data);
        },function (data) {
            console.log(data);
        });

    });
}
getAllDanmuLibrary();

function initHighcharts(data) {
    $('#container').highcharts({
        chart: {
            type: 'spline'
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        exporting:{
            enabled:false
        },
        credits:{
            enabled:false
        },
        xAxis: {
            //maxPadding: 360,
            showLastLabel: true,
            labels: {
                formatter: function () {
                    return this.value/60;
                }
            },
            min:0,
            tickPositions:data.xtickPositions,
            max:data.xmax
        },
        yAxis: {
            title: {
                text: ''
            },
            labels: {
                formatter: function () {
                    return this.value;
                }
            },
            min:0,
            tickPositions: data.ytickPositions,
            max:data.ymax,
            lineWidth: 1
        },
        legend: {
            enabled: false
        },
        tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            /*pointFormat: '{point.x/60} "分" +{point.x%60}"秒" : {point.y}'*/
            formatter: function () {
                return '<b>' + parseInt(this.x / 60) + "'" + this.x % 60 + "''" + '</b><br/>' +
                    '弹幕数: ' + this.y;
            }
        },
        plotOptions: {
            spline: {
                marker: {
                    enabled: true
                }
            }
        },
        series: [{
            name: 'Winter 2007-2008',
            data:data.series
        }]
    });
}

   /* $('#container').highcharts({
        chart: {
            type: 'line',
            inverted: false
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        exporting:{
            enabled:false
        },
        credits:{
            enabled:false
        },
        xAxis: {
            //maxPadding: 360,
            showLastLabel: true,
            labels: {
                formatter: function () {
                    return this.value/60;
                }
            },
            min:0,
            tickPositions: [0, 600, 1200, 1800, 2400,3000,3600,4200,4800,5400,6000,6600,7200],
            max:7200
        },
        yAxis: {
            title: {
                text: ''
            },
            labels: {
                formatter: function () {
                    return this.value;
                }
            },
            min:0,
            tickPositions: [0,5,10,15,20],
            max:20,
            lineWidth: 1
        },

        legend: {
            enabled: false
        },

        tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat: '{point.x}: {point.y}'
        },
        plotOptions: {
            spline: {
                marker: {
                    enable: true
                }
            }
        },
        series: [{
            name: '弹幕数',
            data: [ [600, 1],
                [610, 3],
                [611, 3],
                [630, 2],
                [640, 2],
                [680, 4],
                [720, 3]]
        }]
    });*/