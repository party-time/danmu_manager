var drawNavbar = function(){
    var htmlStr = '<li><a href="/party"><i class="icon-gamepad"></i><span>活动管理</span> </a> </li>';
        htmlStr += '<li><a href="/cinema"><i class="icon-film"></i><span>影院管理</span> </a> </li>';
        htmlStr += '<li><a href="/user"><i class="icon-user"></i><span>用户管理</span> </a></li>';
        htmlStr +='<li><a href="/blockword"><i class="icon-bar-chart"></i><span>屏蔽词管理</span> </a> </li>';
        htmlStr +='<li><a href="/predanmu"><i class="icon-list-alt"></i><span>预制弹幕管理</span> </a> </li>';
        htmlStr +='<li><a href="/adDanmuLibrary"><i class="icon-play-circle"></i><span>广告管理</span> </a> </li>';
        htmlStr += '<li><a href="/wechat"><i class="icon-camera"></i><span>微信自动回复管理</span> </a> </li>';
        htmlStr += '<li><a href="/reward"><i class="icon-font"></i><span>打赏管理</span> </a> </li>';
    var role = $.cookie('role');
    if(role == '589a98cd77c8afdcbdeaeeb4'){
        htmlStr +=  '<li><a href="/adminmanager"><i class="icon-bold"></i><span>管理员管理</span> </a> </li>';
        htmlStr +=  '<li><a href="/version"><i class="icon-list"></i><span>版本管理</span> </a> </li>'
        htmlStr +=  '<li><a href="/param"><i class="icon-picture"></i><span>参数管理</span> </a> </li>';
        htmlStr +=  '<li><a href="/danmucmd"><i class="icon-pencil"></i><span>指令管理</span> </a> </li>';
    }

    if(role != '589a98cd77c8afdcbdeaeeb6'){
        $('.mainnav').html(htmlStr);
    }

}

