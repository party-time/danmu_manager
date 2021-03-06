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

var tableUrl = '/v1/api/admin/party/list';
var danmuLibraryList = [];
var columnsArray = [
    {
        field: 'name',
        title: '名称',
        align: 'center'
    },
    {
        title: '类型',
        align: 'center',
        formatter: function (value, row, index) {
            if( null != row.type){
                if( row.type == 0){
                    return "活动";
                }else{
                    return "电影";
                }
            }else{
                return "活动";
            }
        }
    },
    {
        field: 'movieAlias',
        title: 'tms指令',
        align: 'center',
    },
    {
        field: 'status',
        title: '状态',
        align: 'center',
        formatter: function(value,row,index){
            if(row.status == 0){
                return "未开始";
            }else if(row.status == 1){
                return "活动开始";
            }else if(row.status == 2){
                return "电影开始";
            }else if(row.status == 3){
                return '<a  href="#" onclick="partyReOpen(\''+row.id+'\')">活动重开</a>';
            }else if(row.status == 4){
                return "电影下线";
            }else{
                return "未知";
            }
        }
     },
    {
        field: 'danmuLibraryId', title: '操作',
        align: 'center',
        formatter: function (value, row, index) {
            var selectHtml = '<select id="dl_'+row.id+'" onchange="changeDanmuLibrary(\''+row.id+'\')" style="width: 100px;margin-bottom: 0px;">';
            if( null != danmuLibraryList){
                for( var i=0;i<danmuLibraryList.length;i++){
                        if(value == danmuLibraryList[i].id){
                            selectHtml += '<option value='+danmuLibraryList[i].id+' selected="selected">'+danmuLibraryList[i].name+'</option>';
                        }else{
                            selectHtml += '<option value='+danmuLibraryList[i].id+'>'+danmuLibraryList[i].name+'</option>';
                        }

                }
            }
            selectHtml += '</select>';
            var str='';
            if(row.type == 0){
                   str += '<a class="btn" href="#" onclick="openDanmuCheck(\''+row.name+'\',\''+row.id+'\')">弹幕审核</a>';
                   str += '<a class="btn" target="_blank" href="/party/historyDanmu?partyId='+row.id+'">历史弹幕</a>';
                   str += '<a class="btn" target="_blank" href="/v1/api/admin/download/downloadPartyResource?partyId='+row.id+'">资源下载</a>';
            }else if(row.type == 1){
                str += '<a class="btn" href="#" onclick="openMovieSchedule(\''+row.id+'\')">电影场次</a>';
                str += '<a class="btn" target="_blank" href="/party/historyDanmu?partyId='+row.id+'">历史弹幕</a>';
                str += '<a class="btn" href="#" onclick="openAddress(\''+row.name+'\',\''+row.id+'\')">广告弹幕</a>';
                str += '<a class="btn" href="#" onclick="openTimerDanmu(\''+row.id+'\')">定时弹幕</a>';
            }
            str += '<a class="btn" href="#" onclick="openFastDanmu(\''+row.id+'\')">一键弹幕</a>';
            return str+='<a class="btn" href="#" onclick="openH5temp(\''+row.id+'\',\''+row.name+'\')">页面管理</a><a class="btn" href="#" onclick="updateParty(\''+row.id+'\')">修改信息</a>';
        },
        events:'operateEvents'
    },
    {
        title: '特殊',
        align: 'center',
        formatter: function (value, row, index) {
            var str = '';
            if(row.type == 0){
                   str = '<a class="btn" onclick="delParty(\''+row.id+'\',\''+row.name+'\')">删除</a>';
            }else if(row.type==1){
                if(row.status==4){
                    str = '<a class="btn" onclick="delMovie(\''+row.id+'\',\''+row.name+'\')">删除</a>';
                }else{
                    str = '<a class="btn" href="#" onclick="offline(\''+row.name+'\',\''+row.id+'\')">下线</a>';
                }

            }
            return str;
        },
        events:'operateEvents'
    }
];
var quaryObject = {
    pageSize: 20
};



var partyReOpen = function (id) {
    $.danmuAjax('/v1/api/admin/party/partyReOpen', 'GET','json',{'id':id}, function (data) {
        if (data.result == 200) {
            //alert(data.result_msg);
            location.reload();
        } else {
            alert(data.result_msg);
        };
    }, function (data) {
        console.log(data);
    });
}

var getAllDanmuLibrary = function() {
    $.danmuAjax('/v1/api/admin/getAllDanmuLibrary', 'GET','json',null, function (data) {
        if (data.result == 200) {
           danmuLibraryList = data.data;
          var dl = {
                 id:'0',
                 name:'选择弹幕库'
              }
           danmuLibraryList.unshift(dl);
        } else {
            alert(data.result_msg);
        };
    }, function (data) {
        console.log(data);
    });
}


var changeDanmuLibrary = function(partyId){
    var danmuLibraryId = $('#'+'dl_'+partyId).val();
    var obj = {
        'partyId':partyId,
        'danmuLibraryId':danmuLibraryId
    }
    $.danmuAjax('/v1/api/admin/party/updatePartyDanmuLibrary', 'GET','json',obj, function (data) {
            if (data.result == 200) {
              console.log(data);
              }
        }, function (data) {
            console.log(data);
        });
}

var delParty = function(id,name){
    if(confirm('确定要删除'+name+'活动吗？')){
        var obj = {
            'id':id
        }
        $.danmuAjax('/v1/api/admin/party/checkPartyIsOver', 'GET','json',obj, function (data) {
            if(data.result == 200){
                $.danmuAjax('/v1/api/admin/party/del', 'GET','json',obj, function (data) {
                    if( data.result == 200){
                        $.initTable('tableList', columnsArray, quaryObject, tableUrl);
                    }else{
                        alert('更新失败')
                    }

                }, function (data) {
                    console.log(data);
                });
            }else{
                alert("活动未结束")
            }
        });
    }

};

var updateParty = function(id){
    window.location.href="/party/update?id="+id;
}


var addParty = function(){
    window.location.href="/party/add";
}

var addMovie = function(){
    window.location.href="/party/addMovie";
}

var openAddress = function(partyName,partyId){
    var addressTableUrl = '/v1/api/admin/address/queryAdByPartyId';
    var addressQueryObject = {
        partyId:partyId,
        pageSize: 6
    }
    var addressColumnsArray =[
        {
            field: 'name',
            title: '场地',
            align: 'center'
        },
        {
            field: '', title: '广告',
            align: 'center',
            formatter: function (value, row, index) {
                if(row.adName!=null){
                    var name = row.adName;
                    if(name.length>4){
                        name = name.substring(0,2);
                    }
                    var str = '<a class="btn" onclick="openAdModel(\''+partyName+'\',\''+partyId+'\',\''+row.id+'\')" title="'+name+'">'+name+'</a>';
                        str+='<br/><br/><button type="button" class="btn btn-danger" onclick="delPartyAd(\''+partyName+'\',\''+partyId+'\',\''+row.id+'\',\''+row.name+'\')" >删除</button>';
                        return str;
                }else{
                    return '<a class="btn" onclick="openAdModel(\''+partyName+'\',\''+partyId+'\',\''+row.id+'\')" title="'+name+'">添加</a>'
                }
            }
        }
    ];
    var tableSuccess = function(){
        $('#modalBody').find('.pull-left').remove();
    }
    $.initTable('addressTableList', addressColumnsArray, addressQueryObject, addressTableUrl,tableSuccess);
    $('#myModalLabel').html(partyName+'的广告管理');
    var buttonHtml = '<button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>'
    $('#modalFooter').html(buttonHtml);
    $('#modalody').find('.pull-left').remove();
    $('#myModal').modal('show');
}


/**
 * 删除活的动场地广告
 * @param partyName
 * @param partyId
 * @param id
 */
var delPartyAd = function(partyName,partyId,addressId,addressName){
    if(confirm('确定要删除活动:'+partyName+'场地:'+addressName+'的广告吗？')){
        var obj = {
            partyId:partyId,
            addressId:addressId
        }
        $.danmuAjax('/v1/api/admin/partyAddressAdRelation/delete', 'GET','json',obj, function (data) {
            if(data.result == 200) {
                console.log(data);
                openAddress(partyName,partyId);
                alert('删除成功');
            }else{
                alert('删除失败');
            }
        }, function (data) {
            console.log(data);
        });
    }
}


var openMoreAddress = function(partyName,partyId){
    var addressTableUrl = '/v1/api/admin/address/queryNoParty';
    var addressQueryObject = {
        partyId:partyId,
        pageSize: 6
    }
    var addressColumnsArray =[
        {
            field: 'name',
            title: '名称',
            align: 'center'
        },
        {
           field: '', title: '操作',
           align: 'center',
           formatter: function (value, row, index) {
                return '<a class="btn" onclick="selectAddress(\''+partyName+'\',\''+partyId+'\',\''+row.id+'\')">添加</a>';
           }
        }
    ];

    var tableSuccess = function(){
        $('#modalBody').find('.pull-left').remove();
    }
    $.initTable('addressTableList', addressColumnsArray, addressQueryObject, addressTableUrl,tableSuccess);

    var buttonHtml = '<button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>' +
    '<button class="btn btn-primary" onclick="openAddress(\''+partyName+'\',\''+partyId+'\')">本活动的场地</button>';
    $('#modalFooter').html(buttonHtml);
}


var adAdd = function (partyName,partyId,addressId,id) {
    var obj = {
        partyId:partyId,
        addressId:addressId,
        poolId:id
    }
    $.danmuAjax('/v1/api/admin/partyAddressAdRelation/save', 'GET','json',obj, function (data) {
        if(data.result == 200) {
            console.log(data);
            openAddress(partyName,partyId,addressId);
            alert('添加成功');
        }else{
            alert('添加失败');
        }
    }, function (data) {
        console.log(data);
    });
}

var openAdModel = function(partyName,partyId,addressId){
    var addressTableUrl = '/v1/api/admin/adDanmuLibrary/list';
    var addressQueryObject = {
        pageSize: 6,
        flg:0
    }
    var addressColumnsArray =[
        {
            field: 'name',
            title: '名称',
            align: 'center'
        },
        {
            field: '', title: '操作',
            align: 'center',
            formatter: function (value, row, index) {
                return '<a class="btn" onclick="adAdd(\''+partyName+'\',\''+partyId+'\',\''+addressId+'\',\''+row.id+'\')">添加</a>';
            }
        }
    ];
    var tableSuccess = function(){
        $('#modalBody').find('.pull-left').remove();
    }
    $.initTable('addressTableList', addressColumnsArray, addressQueryObject, addressTableUrl,tableSuccess);
    $('#myModalLabel').html('广告');
    var buttonHtml = '<button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>';
    $('#modalFooter').html(buttonHtml);
}




var selectAddress = function(partyName,partyId,addressId){
    var obj = {
        partyId:partyId,
        addressId:addressId
    }
    $.danmuAjax('/v1/api/admin/partyAddressRelation/save', 'GET','json',obj, function (data) {
        if(data.result == 200) {
          console.log(data);
          openAddress(partyName,partyId);
          alert('添加成功');
         }else{
            alert('添加失败');
         }
    }, function (data) {
        console.log(data);
    });

}

var delAddress = function(partyName,addressName,partyId,addressId){
    if(confirm('确定要删除'+addressName+'吗？')){
        var obj = {
            partyId:partyId,
            addressId:addressId
        }
        $.danmuAjax('/v1/api/admin/partyAddressRelation/delByPartyIdAndAddressId', 'GET','json',obj, function (data) {
            if(data.result == 200) {
              console.log(data);
              openAddress(partyName,partyId);
              alert('删除成功');
             }else{
                alert('删除失败');
             }
        }, function (data) {
            console.log(data);
        });
    }
}

var openNewWindow = function(url){
    window.open(url);
}

var openDanmuCheck = function(partyName,partyId){
    var addressTableUrl = '/v1/api/admin/address/queryByPartyId';
    var addressQueryObject = {
        partyId:partyId,
        pageSize: 6
    }
    var addressColumnsArray =[
        {
            field: 'name',
            title: '名称',
            align: 'center'
        },
        {
           field: '', title: '操作',
           align: 'center',
           formatter: function (value, row, index) {
                return '<a class="btn" onclick="openNewWindow(\'/party/danmuCheck?partyId='+partyId+'&addressId='+row.id+'\')">审核</a>';
           }
        }
    ];
    $.initTable('addressTableList', addressColumnsArray, addressQueryObject, addressTableUrl,null,'还没有添加场地，请去添加场地');
    $('#myModalLabel').html(partyName+'的弹幕审核');
    var buttonHtml = '<button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>';
    $('#modalFooter').html(buttonHtml);
    $('#modalBody').find('.pull-left').remove();
    $('#myModal').modal('show');
}

var openTimerDanmu = function(partyId){
       openNewWindow('/party/timerDanmu?partyId='+partyId);
}

var openPartyResource = function(partyId){
       openNewWindow('/party/resource?partyId='+partyId);
}

var searchParty = function(){
    var quaryObject = {
        pageSize: 20,
        type:$('#searchType').val(),
        status:$('#searchStatus').val()
    };
    $.initTable('tableList', columnsArray, quaryObject, tableUrl);
}

var offline = function(partyName,partyId){
    if(confirm('确定要下线'+partyName+'吗？')){
        var obj = {
            partyId:partyId
        }
        $.danmuAjax('/v1/api/admin/party/offline', 'GET','json',obj, function (data) {
            if(data.result == 200) {
              console.log(data);
                $.initTable('tableList', columnsArray, quaryObject, tableUrl);
             }else{
                alert('操作失败');
             }
        }, function (data) {
            console.log(data);
        });
    }
}

var delMovie = function(id,name){
    if(confirm('确定要删除'+name+'吗？')){
        var obj = {
            'id':id
        }

        $.danmuAjax('/v1/api/admin/party/del', 'GET','json',obj, function (data) {
            if( data.result == 200){
                $.initTable('tableList', columnsArray, quaryObject, tableUrl);
            }else{
                alert('更新失败')
            }

        }, function (data) {
            console.log(data);
        });

    }
};

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

var delMovieSchedule = function(id,partyId){
    if(confirm('确定要删除吗？')){
        var obj = {
            'id':id
        }
        $.danmuAjax('/v1/api/admin/movieSchedule/del', 'GET','json',obj, function (data) {
            if( data.result == 200){
                movieSchedulePage(partyId);
            }else{
                alert('更新失败')
            }

        }, function (data) {
            console.log(data);
        });

    }
};

var movieSchedulePage = function(partyId){
    var msAddressId = $('#movieScheduleAddress').val();
    var movieScheduleTableUrl = '/v1/api/admin/movieSchedule/list';
    var movieScheduleQueryObject = {
        partyId:partyId,
        addressId:msAddressId,
        pageSize: 6
    }
    var movieScheduleColumnsArray =[
        {
            title: '地址',
            align: 'center',
            formatter: function(value, row, index){
                if(row.danmuAddress){
                    return row.danmuAddress.name;
                }else{
                    return "未知";
                }
            }
        },
        {
            field: 'movieSchedule.startTime',
            title: '广告开始时间',
            align: 'center',
            formatter: function (value, row, index) {
                  return new Date(parseInt(row.movieSchedule.clientStartTime)).format('yyyy-MM-dd hh:mm:ss');
            }
        },
        {
            field: 'movieSchedule.moviceStartTime',
            title: '电影开始时间',
            align: 'center',
            formatter: function (value, row, index) {
                  if( null == row.movieSchedule.clientMoviceStartTime){
                    return "电影未开始";
                  }else{
                    return new Date(parseInt(row.movieSchedule.clientMoviceStartTime)).format('yyyy-MM-dd hh:mm:ss');
                  }

            }
        },
        {
            field: 'movieSchedule.endTime',
            title: '电影结束时间',
            align: 'center',
            formatter: function (value, row, index) {
                if( null == row.movieSchedule.clientEndTime){
                    return "电影未结束";
                }else{
                    return new Date(parseInt(row.movieSchedule.endTime)).format('yyyy-MM-dd hh:mm:ss');
                }

            }
        },
        {
           field: '', title: '操作',
           align: 'center',
           formatter: function (value, row, index) {
                return '<a class="btn" onclick="delMovieSchedule(\''+row.movieSchedule.id+'\',\''+partyId+'\')">删除</a>';
           }
        }
    ];
    var tableSuccess = function(){
        $('#modalBody').find('.pull-left').remove();
    }
    var buttonHtml = '<button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>';
    $('#modalFooter').html(buttonHtml);

    $.initTable('addressTableList', movieScheduleColumnsArray, movieScheduleQueryObject, movieScheduleTableUrl,tableSuccess);
}

var getAddressByParty = function(partyId){
    var obj = {
        partyId:partyId
    }
    $.danmuAjax('/v1/api/admin/address/getByPartyId', 'GET','json',obj, function (data) {
        if( data.result == 200){
            if(data.data && data.data.length >0){
                $('#movieScheduleAddress').append('<option value="0">全部</option>');
                for(var i=0;i<data.data.length;i++){
                    $('#movieScheduleAddress').append('<option value="'+data.data[i].id+'">'+data.data[i].name+'</option>');
                }
            }else{
                 $('#movieScheduleAddress').append('<option value="-1">无</option>');
            }

        }else{
            alert('更新失败')
        }

    }, function (data) {
        console.log(data);
    });
}

var openMovieSchedule = function(partyId){
    $('#myModalLabel').html('<div><h1 style="float:left;">电影场次</h1> <h5 style="float:left;margin-top:10px;margin-left:10px;">场地：</h5><select id="movieScheduleAddress" style="margin-top:5px;" onchange="movieSchedulePage(\''+partyId+'\')"></select></div>');
    getAddressByParty(partyId);
    movieSchedulePage(partyId);
    $('#myModal').modal('show');
}

var selectSearchType = function(){
    var searchType = $('#searchType').val();
    if( searchType == -1){
        $('#searchStatus').empty();
        $('#searchStatus').append('<option value="0">全部</option>');
        $('#searchStatus').append('<option value="1">未下线或未结束</option>');
        $('#searchStatus').append('<option value="2">已下线或已结束</option>');
    }else if( searchType == 0){
        $('#searchStatus').empty();
        $('#searchStatus').append('<option value="-1" selected>全部</option>');
        $('#searchStatus').append('<option value="0">未开始</option>');
        $('#searchStatus').append('<option value="1">活动开始</option>');
        $('#searchStatus').append('<option value="2">电影开始</option>');
        $('#searchStatus').append('<option value="3">电影结束</option>');
    }else if( searchType == 1){
        $('#searchStatus').empty();
        $('#searchStatus').append('<option value="-1" selected>全部</option>');
        $('#searchStatus').append('<option value="0">未下线</option>');
        $('#searchStatus').append('<option value="4">已下线</option>');
    }
}

var openH5temp = function(partyId,partyName){
    var addressTableUrl = '/v1/api/admin/h5temp/findbyPartyId';
    var addressQueryObject = {
        partyId:partyId,
        pageSize: 6
    }
    var addressColumnsArray =[
        {
            field: 'tempTitle',
            title: '名称',
            align: 'center'
        },
        {
           field: '', title: '操作',
           align: 'center',
           formatter: function (value, row, index) {
                return '<a class="btn" onclick="delH5Temp(\''+row.id+'\',\''+partyId+'\',\''+partyName+'\')">删除</a>';
           }
        }
    ];

    var tableSuccess = function(){
        $('#modalBody').find('.pull-left').remove();
    }
    $.initTable('addressTableList', addressColumnsArray, addressQueryObject, addressTableUrl,tableSuccess);
    $('#myModalLabel').html(partyName+'的页面管理');
    var buttonHtml = '<button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>' +
    '<button class="btn btn-primary" onclick="openMoreH5temp(\''+partyId+'\',\''+partyName+'\')">查看更多页面</button>';
    $('#modalFooter').html(buttonHtml);
    $('#modalody').find('.pull-left').remove();
    $('#myModal').modal('show');
}

var openMoreH5temp = function(partyId,partyName){
    var addressTableUrl = '/v1/api/admin/h5temp/pageByParty';
    var addressQueryObject = {
        partyId:partyId,
        pageSize: 6
    }
    var addressColumnsArray =[
        {
            field: 'tempTitle',
            title: '名称',
            align: 'center'
        },
        {
           field: '', title: '操作',
           align: 'center',
           formatter: function (value, row, index) {
                return '<a class="btn" onclick="setPartyId(\''+row.id+'\',\''+partyId+'\',\''+partyName+'\')">添加</a>';
           }
        }
    ];

    var tableSuccess = function(){
        $('#modalBody').find('.pull-left').remove();
    }
    $.initTable('addressTableList', addressColumnsArray, addressQueryObject, addressTableUrl,tableSuccess);
    var buttonHtml = '<button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>' +
    '<button class="btn btn-primary" onclick="openH5temp(\''+partyId+'\',\''+partyName+'\')">本活动的页面</button>';
    $('#modalFooter').html(buttonHtml);
}

var setPartyId = function(id,partyId,partyName){
    var obj = {
        h5TempId:id,
        partyId:partyId
    }
    $.danmuAjax('/v1/api/admin/h5temp/setH5TempId', 'GET','json',obj, function (data) {
        if(data.result == 200) {
            console.log(data);
            var resultStr = '';
            openH5temp(partyId,partyName);
            alert('添加成功');
        }else{
            alert('操作失败');
        }

    }, function (data) {
        console.log(data);
    });
}

var delH5Temp = function(id,partyId,partyName){
    var obj = {
        h5TempId:id,
        partyId:''
    }
    $.danmuAjax('/v1/api/admin/h5temp/setH5TempId', 'GET','json',obj, function (data) {
        if(data.result == 200) {
            console.log(data);
            openMoreH5temp(partyId,partyName);
            alert('删除成功');
        }else{
            alert('操作失败');
        }

    }, function (data) {
        console.log(data);
    });
}


getAllDanmuLibrary();

//加载表格数据
$.initTable('tableList', columnsArray, quaryObject, tableUrl);


function filmCheck(){
    openNewWindow('/film/danmuCheck')
}

var manageRealTimeDm = function(){
    $('#myModalLabel').html('管理实时弹幕池');
    var realTimeDmUrl = '/v1/api/admin/realTimeDm/list';
    var realTimeDmQueryObject = {
        pageSize: 6
    }
    var realTimeDmColumnsArray =[
        {
            field: 'name',
            title: '名称',
            align: 'center'
        },
        {
           field: '', title: '操作',
           align: 'center',
           formatter: function (value, row, index) {
                return '<a class="btn" onclick="delRealTimeDm(\''+row.id+'\')">删除</a>';
           }
        }
    ];
    var tableSuccess = function(){
        $('#modalBody').find('.pull-left').remove();
    }
    var buttonHtml = '<button class="btn btn-primary" onclick="openSaveRealTimeDm()">新增</button><button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>';
    $('#modalFooter').html(buttonHtml);
    $.initTable('addressTableList', realTimeDmColumnsArray, realTimeDmQueryObject, realTimeDmUrl,tableSuccess);
    $('#myModal').modal('show');
}

var openSaveRealTimeDm = function(){
    window.location.href="/party/addRealTimeDm";
}

var delRealTimeDm = function(id){
    var obj = {
        id:id
    }
    $.danmuAjax('/v1/api/admin/realTimeDm/delete', 'GET','json',obj, function (data) {
        if(data.result == 200) {
            console.log(data);
            manageRealTimeDm();
            alert('删除成功');
        }else{
            alert('操作失败');
        }

    }, function (data) {
        console.log(data);
    });
}

var openSpider = function(){
    openNewWindow('/party/spider');
}

var openFastDanmu = function(partyId){
    $('#myModalLabel').html('管理一键弹幕');
    var html = '<input type="text" style="margin-bottom:0px;" id="fastdm" /> <a class="btn btn-primary" onclick="saveFastDanmu(\''+partyId+'\');">新增</a>';
    $('#headerHtml').html(html);
    var fastDmUrl = '/v1/api/admin/fastdm/page';
    var fastDmQueryObject = {
        pageSize: 6,
        partyId:partyId
    }
    var fastDmColumnsArray =[
        {
            field: 'word',
            title: '弹幕',
            align: 'center'
        },
        {
           field: '', title: '操作',
           align: 'center',
           formatter: function (value, row, index) {
                return '<a class="btn" onclick="delFastdm(\''+row.id+'\',\''+partyId+'\')">删除</a>';
           }
        }
    ];
    var tableSuccess = function(){
        $('#modalBody').find('.pull-left').remove();
    }
    $.initTable('addressTableList', fastDmColumnsArray, fastDmQueryObject, fastDmUrl,tableSuccess);
    $('#myModal').modal('show');
}

var saveFastDanmu = function(partyId){
    var obj = {
        partyId:partyId,
        word:$('#fastdm').val()
    }

    $.danmuAjax('/v1/api/admin/fastdm/find', 'GET','json',obj, function (data) {
            if(data.result == 200 && null ==data.data) {
                $.danmuAjax('/v1/api/admin/fastdm', 'POST','json',obj, function (data) {
                        if(data.result == 200) {
                            alert('创建成功');
                            openFastDanmu(partyId);
                        }else{
                            alert('操作失败');
                        }
                    }, function (data) {
                        console.log(data);
                    });
            }else{
                alert('有重复的一键弹幕');
            }
        }, function (data) {
            console.log(data);
        });

}

var delFastdm = function(id,partyId){
     if(confirm('确定要删除一键弹幕吗？')){
        $.danmuAjax('/v1/api/admin/fastdm/'+id, 'DELETE','json',null, function (data) {
            if(data.result == 200) {
                alert('删除成功');
                openFastDanmu(partyId);
            }else{
                alert('操作失败');
            }
        }, function (data) {
            console.log(data);
        });
     }
}