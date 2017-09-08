
var findPartyByName = function(){
    var name = $('#name').val();
    if('' != name){
        var obj = {
            'name': name
        }
        $.danmuAjax('/v1/api/admin/party/name', 'GET','json',obj, function (data) {
            if( data.result == 200){
                if(data.data){
                    if(!$('#name').parent().children('.help-block').html()){
                        $('#name').after('<p class="help-block" style="color:red">活动名称重复</p>');
                    }
                    $('#saveParty').attr('disabled',true);
                }else{
                    if($('#name').parent().children('.help-block').html()){
                        $('#name').parent().children('.help-block').remove();
                    }
                    $('#saveParty').attr('disabled',false);
                }
            }
        }, function (data) {
            console.log(data);
        });
    }else{
        if(!$('#name').parent().children('.help-block').html()){
            $('#name').after('<p class="help-block" style="color:red">活动名称不能为空</p>');
        }
    }
};

var findPartyByShortName = function(){
    var shortName = $('#shortName').val();
    if('' != shortName){
        var reg = /^[0-9a-zA-Z]*$/g;
        if(!reg.test(shortName)){
            if(!$('#shortName').parent().children('.help-block').html()){
                $('#shortName').after('<p class="help-block" style="color:red">活动名称简写只能为字母和数字</p>');
                $('#saveParty').attr('disabled',true);
            }
        }else{
            var obj = {
                'shortName': shortName
            }
            $.danmuAjax('/v1/api/admin/party/shortName', 'GET','json',obj, function (data) {
                if( data.result == 200){
                    if(data.data){
                        if(!$('#shortName').parent().children('.help-block').html()){
                            $('#shortName').after('<p class="help-block" style="color:red">活动名称简写重复</p>');
                        }
                        $('#saveParty').attr('disabled',true);
                    }else{
                        if($('#shortName').parent().children('.help-block').html()){
                            $('#shortName').parent().children('.help-block').remove();
                        }
                        $('#saveParty').attr('disabled',false);
                     }
                }
            }, function (data) {
                console.log(data);
            });
        }

    }else{
        if(!$('#shortName').parent().children('.help-block').html()){
            $('#shortName').after('<p class="help-block" style="color:red">活动名称简写不能为空</p>');
            $('#saveParty').attr('disabled',true);
        }
    }
};

var checkDateTime = function(str){
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

var dateAfter = function(date,afterDate){
    if(date>afterDate){
        return false;
    }else{
        return true;
    }
}



var checkStartTime = function(){
    var startTime = $('#startTime').val();
    var helpBlock = ''
    if( '' == startTime){
        helpBlock = '请填写开始时间';
    }else if(!checkDateTime(startTime)){
        helpBlock = '开始时间格式错误';
    }else if(!dateAfter(new Date(),new Date(startTime))){
        helpBlock = '开始时间必须要早于当前时间';
    }
    if( '' != helpBlock){
        if($('#startTime').parent().children('.help-block').html()){
            $('#startTime').parent().children('.help-block').remove();
        }
        if(!$('#startTime').parent().children('.help-block').html()){
            $('#startTime').after('<p class="help-block" style="color:red">'+helpBlock+'</p>');
            $('#saveParty').attr('disabled',true);
        }
    }else{
        if($('#startTime').parent().children('.help-block').html()){
            $('#startTime').parent().children('.help-block').remove();
        }
        $('#saveParty').attr('disabled',false);
    }
}

var initEndTime = function(){
    var startTime = new Date($('#startTime').val());
    var month = startTime.getMonth()+1;
    if(month<10){
        month = '0'+month;
    }

    var dd = startTime.getDate();
    if( dd <10){
        dd = '0'+dd;
    }
    var hour = startTime.getHours();
    hour = hour+2;
    if(hour<10){
        hour = '0'+hour;
    }
    var minute = startTime.getMinutes();
    if( minute<10){
        minute = '0'+minute;
    }
    $('#endTime').val(startTime.getFullYear()+'-'+month+'-'+dd+' '+hour+':'+minute);
}


var checkEndTime = function(){
    var endTime = $('#endTime').val();

        var helpBlock = ''
        if( '' == endTime){
            initEndTime();
        }else if(!checkDateTime(endTime)){
            helpBlock = '结束时间格式错误';
        }else if(!dateAfter(new Date($('#startTime').val()),new Date(endTime))){
            helpBlock = '结束时间必须要晚于开始时间';
        }
        if( '' != helpBlock){
            if($('#endTime').parent().children('.help-block').html()){
                $('#endTime').parent().children('.help-block').remove();
            }
            if(!$('#endTime').parent().children('.help-block').html()){
                $('#endTime').after('<p class="help-block" style="color:red">'+helpBlock+'</p>');
                $('#saveParty').attr('disabled',true);
            }
        }else{
            if($('#endTime').parent().children('.help-block').html()){
                $('#endTime').parent().children('.help-block').remove();
            }
            $('#saveParty').attr('disabled',false);
        }
}



var saveParty = function(){
    var partyType = $('#partyType').val();
    var densitrys='',ids='',idNum=0,densitryNum=0;
    if($('.dlSelect')){
        $('.dlSelect').each(function(){
            if($(this).val()!=0){
                ids += $(this).val();
                ids += ',';
                idNum++;
            }
        });
        if( ids != ''){
            ids = ids.substr(0,ids.length-1);
        }
    }
    var dlTextMsg= '';
    var dlCount=0;
    if($('.dlText')){
        $('.dlText').each(function(){
            if( '' != $(this).val()){
                var reg = /^[0-9]*$/g;
                if(!reg.test($(this).val())){
                    dlTextMsg='弹幕密度只能为数字';
                    return;
                }
                if($(this).val()==0){
                    dlTextMsg='弹幕密度不能为0';
                    return;
                }
                dlCount += $(this).val();
                densitrys += $(this).val();
                densitrys += ',';
                densitryNum++;
            }

        })
        if( densitrys != ''){
            densitrys = densitrys.substr(0,densitrys.length-1);
        }
    }
    if( dlTextMsg != ''){
        alert(dlTextMsg);
        return;
    }
    if( dlCount > 15){
        alert('弹幕密度总数不能大于15');
        return;
    }
    if( ids != '' ){
        if( densitrys == ''){
            alert('请填写弹幕密度');
            return;
        }
        if(idNum != densitryNum){
            alert('请填写弹幕密度');
            return;
        }
    }

    if( partyType == 0){
       var aList = $('#selectAddress').children('a');
       var addressIds = '';
       if( aList && aList.length > 0){
           for(var i=0;i<aList.length;i++){
               addressIds += $(aList[i]).attr('addressId');
               if( i < aList.length-1){
                   addressIds += ',';
               }
           }
       }
        if( aList.length == 0){
            alert("请选择场地");
            return;
        }
        var obj = {
            'name': $('#name').val(),
            'type':partyType,
            'danmuLibraryId':$('#danmuLibraryId').val(),
            'addressIds':addressIds,
            'densitrys':densitrys,
            'ids':ids
        }

        findPartyByName();
        //findPartyByShortName();
        //checkStartTime();
        //checkEndTime();

    }else{

        var obj = {
            'name': $('#name').val(),
            'type':partyType,
            'movieAlias': $('#movieAlias').val(),
            'densitrys':densitrys,
            'ids':ids
        }

        findPartyByName();
        //findPartyByShortName();
    }


    if(!$('.help-block').html()){
        $.danmuAjax('/v1/api/admin/party/save', 'POST','json',obj, function (data) {
            if( data.result == 200){
                window.location.href='/party/resource?partyId='+data.data.id+'&type='+partyType;
            }else{
                if(data.result_msg){
                    alert(data.result_msg)
                }else{
                    alert('保存失败')
                }
            }
        }, function (data) {
            console.log(data);
        });
    }else{
        $('#saveParty').attr('disabled',true);
    }
}

var returnPartyList = function(){
    window.location.href='/party/';
}

var initAddParty = function(){
    var now = new Date();
    var month = now.getMonth()+1;
    if(month<10){
        month = '0'+month;
    }

    var dd = now.getDate();
    if( dd <10){
        dd = '0'+dd;
    }
    var hour = now.getHours();
    if( hour < 24 ){
        hour = hour + 1;
    }
    if(hour<10){
        hour = '0'+hour;
    }

    var minute = now.getMinutes();
    if( minute<10){
        minute = '0'+minute;
    }
    $('#startTime').val(now.getFullYear()+'-'+month+'-'+dd+' '+hour+':'+minute);
}

var selectMovie = function(){
    var partyType = $('#partyType').val();
    if(partyType == 0){
        $('#movieTable').hide();
        $('#partyTable').show();
        $('#selectAddressTable').show();
    }else{
        $('#movieTable').show();
        $('#partyTable').hide();
        $('#selectAddressTable').hide();
    }
}

var initMovieAlias = function(){
    $.danmuAjax('/v1/api/admin/party/movieAlias', 'GET','json',null, function (data) {
        if( data.result == 200){
            var movieAliasList = data.data;
            for(var i=0;i<movieAliasList.length;i++){
                $('#movieAlias').append("<option value='"+movieAliasList[i].value+"'>"+movieAliasList[i].name+"</option>");
            }
        }
    }, function (data) {
        console.log(data);
    });
}

var dl_count=0;

var getAllDanmuLibrary = function() {
    if( dl_count >= 3){
        alert('只能增加3个弹幕库');
        return;
    }

    var ids='';

    if($('.dlSelect')){
        $('.dlSelect').each(function(){
            if($(this).val()!=0){
                ids += $(this).val();
                ids += ',';
            }
        });
        ids = ids.substr(0,ids.length-1);
    }


    $.danmuAjax('/v1/api/admin/preDm/getAllLibraryNotInIds?ids='+ids, 'GET','json',null, function (data) {
        if (data.result == 200) {
            danmuLibraryList = data.data;
            var dl = {
                 id:'0',
                 name:'选择弹幕库'
            }
            danmuLibraryList.unshift(dl);

           var selectHtml = '<select class="dlSelect"  style="width: 100px;margin-bottom: 0px;" id="danmuLibraryId'+dl_count+'" onchange="changeDmSelect(this)">';
           var selectoption = '';
           if( null != danmuLibraryList){
               for( var i=0;i<danmuLibraryList.length;i++){
                    selectoption += '<option value='+danmuLibraryList[i].id+'>'+danmuLibraryList[i].name+'</option>';
               }
           }
           selectHtml +=selectoption;
           selectHtml += '</select>';
           selectHtml +='<input type="text" class="dlText" style="width:20px;" maxLength="2"/>';
           if($('#selectPreDm').html() == ''){
                $('#selectPreDm').html(selectHtml);
           }else{
                if(dl_count == 1){
                    selectHtml = '<a class="btn rmDmL" onclick="delDmLibrary(this)">-</a>'+selectHtml+'<a class="btn rmDmL" onclick="delDmLibrary(this)">-</a>';
                }else{
                    selectHtml += '<a class="btn rmDmL" onclick="delDmLibrary(this)">-</a>';
                }
                $('#selectPreDm').append(selectHtml);
           }


           dl_count++;
        } else {
            alert(data.result_msg);
        };
    }, function (data) {
        console.log(data);
    });
}

var changeDmSelect = function(obj){
    var option = $(obj).val();
    var thisId = $(obj).attr('id');
    if(dl_count > 0 ){
        for(var i=0;i<dl_count;i++){
            if(thisId != 'danmuLibraryId'+i){
                $('#danmuLibraryId'+i+' option[value='+option+']').remove();
            }
        }
    }
}


var delDmLibrary = function(obj){
    dl_count--;
    $(obj).prev('.dlText').remove();
    $(obj).prev('.dlSelect').remove();
    if(dl_count == 1){
          $(obj).prev('.btn.rmDmL').remove();
     }
    $(obj).remove();
}



var selectAddress = function(id,name){
    var html = '<span class="_s'+id+'">'+name+'</span><a class="btn _a'+id+'" onclick="removeAddress(\''+id+'\')" addressId="'+id+'">删除</a>';
    var spanList = $('#selectAddress').children('span');
    if(spanList.length % 5 == 0){
        $('#selectAddress').append('<br>');
        $('#selectAddress').append(html);
    }else{
        $('#selectAddress').append(html);
    }
    openAddress();

}

var removeAddress = function(id){
    $('._s'+id).remove();
    $('.btn._a'+id).remove();
    var spanList = $('#selectAddress').children('span');
    if(spanList.length ==0){
        $('#selectAddress').empty();
    }
}

var openAddress = function(){
    var aList = $('#selectAddress').children('a');
    var addressIds = '';
    if( aList && aList.length > 0){
        for(var i=0;i<aList.length;i++){
            addressIds += $(aList[i]).attr('addressId');
            if( i < aList.length-1){
                addressIds += ',';
            }
        }
    }
    var addressTableUrl = '/v1/api/admin/address/queryAll';
    var addressQueryObject = {
        addressIds:addressIds,
        pageSize:6
    }
    var addressColumnsArray =[
        {
            field: 'name',
            title: '名称',
            align: 'center'
        },
        {
           title: '操作',
           align: 'center',
           formatter: function (value, row, index) {
                return '<a class="btn" onclick="selectAddress(\''+row.id+'\',\''+row.name+'\')">选择</a>';
           }
        }
    ];

    var tableSuccess = function(){
        $('#modalBody').find('.pull-left').remove();
    }
    $.initTable('addressTableList', addressColumnsArray, addressQueryObject, addressTableUrl,tableSuccess);
    $('#myModalLabel').html('场地管理');
    var buttonHtml = '<button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>';
    $('#modalFooter').html(buttonHtml);
    $('#modalody').find('.pull-left').remove();
    $('#myModal').modal('show');
}

initMovieAlias();

initAddParty();
getAllDanmuLibrary();