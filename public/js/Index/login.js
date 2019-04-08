var modelSystemHint;
var modelSystemMask;

var modelSystemIndex = function (){
	var button = $('#model-system-button');
	var modifyPasswordLink = $('#modify-password');
	modelSystemHint = $('#model-system-hint');
	button.on('click', modelSystemLogin);
	modifyPasswordLink.on('click', modifyPassword);
}

var modifyPassword = function(){
	if(modelSystemMask)
		return;
	modelSystemMask = $('<div class="model-system-mask"><div>');
	$('body').append(modelSystemMask);
	$('body').css('position', 'fixed');
	var container = $('<div class="mask-container"></div>');
	var text = $('<p class="mask-text">修改密码</p>');

	var usernameContainer = $('<div class="sub-container"></div>');
	var usernameLabel = $('<p class="mask-label">用户名: </p>');
	var usernameInput = $('<input/>');
	var oldPasswordContainer = $('<div class="sub-container"></div>');
	var oldPasswordLabel = $('<p class="mask-label">旧密码: </p>');
	var oldPasswordInput = $('<input type="password"/>');
	var newPasswordContainer = $('<div class="sub-container"></div>');
	var newPasswordLabel = $('<p class="mask-label">新密码: </p>');
	var newPasswordInput = $('<input type="password"/>');
	var rnewPasswordContainer = $('<div class="sub-container"></div>');
	var rnewPasswordLabel = $('<p class="mask-label">重复新密码: </p>');
	var rnewPasswordInput = $('<input type="password"/>');

	var notice = $('<p class="notice"></p>');
	var checkButton = $('<button>确认</button>');
	var cancleButton = $('<button>取消</button>');

	usernameContainer.append(usernameLabel);
	usernameContainer.append(usernameInput);
	oldPasswordContainer.append(oldPasswordLabel);
	oldPasswordContainer.append(oldPasswordInput);
	newPasswordContainer.append(newPasswordLabel);
	newPasswordContainer.append(newPasswordInput);
	rnewPasswordContainer.append(rnewPasswordLabel);
	rnewPasswordContainer.append(rnewPasswordInput);


	container.append(text);
	container.append(usernameContainer);
	container.append(oldPasswordContainer);
	container.append(newPasswordContainer);
	container.append(rnewPasswordContainer);
	container.append(notice);
	container.append(checkButton);
	container.append(cancleButton);
	modelSystemMask.append(container);

	cancleButton.on('click', function(){
		$('body').css('position', 'static');
		modelSystemMask.remove();
		modelSystemMask = null;
	});

	checkButton.on('click', function(){
		var username = usernameInput.val();
		var oldPassword = oldPasswordInput.val();
		var newPassword = newPasswordInput.val();
		var rnewPassword = rnewPasswordInput.val();

		if(newPassword != rnewPassword){
			notice.html('两次输入的密码不一致');
			return;
		}else{
			$.ajax({
				url: modelSystemURLHeader + '/Index/modifyPassword',
				type:'POST',
				data:{'username': username, 'oldPassword': oldPassword, 'newPassword': newPassword},
				success: function(data){
					data = data.trim();
					if(data == 'success'){
						alert('密码修改成功');
						$('body').css('position', 'static');
						modelSystemMask.remove();
						modelSystemMask = null;
					}else if(data == 'wrong password'){
						alert('用户名或密码错误');
					}else{
						alert('系统错误请稍后再试');
					}
				}
			});
		}
	});
}

var modelSystemLogin = function (){
	var username = $('#model-system-username').val();
	var password = $('#model-system-password').val();
	if(!username || username == ''){
		modelSystemHint.html('用户名或密码错误');
	}
	else{
		$.ajax({
			url: modelSystemURLHeader + '/Index/validate',
			type:'POST',
			data:{'username': username, 'password': password},
			success: modelSystemCallBack,
			error: function(){modelSystemHint.html('系统错误请稍后再试');}
		});
	}
}

var modelSystemCallBack = function(data){
	data = data.trim();
	console.log(data);
	if(data.indexOf('success:') == 0){
		window.location = data.substring(8);
	}else{
		modelSystemHint.html('用户名或密码错误');
	}
}

document.onkeydown=function(e){
	if(e.keyCode==13){
		modelSystemLogin();
	}
}