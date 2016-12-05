
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
    var obj = {
        'name': $('#name').val(),
        'startTimeStr':$('#startTime').val(),
        'endTimeStr':$('#endTime').val(),
        'shortName':$('#shortName').val()
    }

    findPartyByName();
    findPartyByShortName();
    checkStartTime();
    checkEndTime();

    if(!$('.help-block').html()){
        $.danmuAjax('/v1/api/admin/party/save', 'POST','json',obj, function (data) {
            if( data.result == 200){
                window.location.href='/party';
            }else{
                alert('保存失败')
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

initAddParty();