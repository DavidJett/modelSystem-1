var pendingTasks;
var runningTasks;
var pendingDetails;
var refreshPendingLink;
var refreshRunningLink;
var modelSystemMask;
var pendingTable;
var runningTable;
var members;
var stateName = ['暂停', '进行中', '结束'];

var modelSystemFitter = function(_members){
	members = _members;
	refreshPendingLink = $('#refresh-pending-link');
	refreshRunningLink = $('#refresh-running-link');
	pendingTable = $('#pending-table');
	runningTable = $('#running-table');

	refreshPendingLink.on('click', refreshPendingTask);
	refreshRunningLink.on('click', refreshRunningTask);
	refreshPendingTask();
	refreshRunningTask();
}

var refreshPendingTask = function(){
	$.ajax({
			url: modelSystemURLHeader + '/Fitter/refreshPending',
			type:'POST',
			data:{},
			success: function(data){
				data = data.trim();
				var pending = JSON.parse(data);
				pendingTasks = pending;
				var tbody = pendingTable.find('tbody');
				tbody.empty();
				for(var i=1;i<=pending.length;i++){
					var tr = $('<tr>');
					var td1 = $('<td>任务('+String(i)+')</td>');
					var td2 = $('<td>'+pending[i-1]['publishTime']+'</td>');
					var td3 = $('<td><span id="'+String(i)+'" class="pending-details" style="color:#1d29bb">查看详细</span></td>');
					tr.append(td1);
					tr.append(td2);
					tr.append(td3);
					tbody.append(tr);
				}
				$('.pending-details').on('click', showPendingDetails);
			}
		});
}

var refreshRunningTask = function(){
	var tbody = runningTable.find('tbody');
	tbody.empty();
	tbody.append('<tr style="text-align: center;color: rgba(220,20,60,1);"><td colspan="4">请稍等...</td></tr>');
	$.ajax({
			url: modelSystemURLHeader + '/Fitter/refreshRunning',
			type:'POST',
			data:{},
			success: function(data){
				data = data.trim();
				tbody.empty();
				var running = JSON.parse(data);
				runningTasks = running;
				for(var i=1;i<=running.length;i++){
					var tr = $('<tr>');
					var td1 = $('<td>任务('+String(i)+')</td>');
					var time = parseInt(running[i-1]['userTime']);
					var hour = parseInt(time/60);
					var min = time%60;
					var td2 = $('<td>'+hour+'时'+min+'分</td>');
					var state = running[i-1]['state'];
					var td3 = $('<td class="state_'+state+'">'+stateName[state]+'</td>');
					var sp1 = $('<span id="'+String(i)+'" class="running-start">开始</span>');
					var sp2 = $('<span id="'+String(i)+'" class="running-pause">暂停</span>');
					var sp3 = $('<span id="'+String(i)+'" class="running-end">结束</span>');
					var sp4 = $('<span id="'+String(i)+'" class="running-details">查看详细</span>');
					var td4 = $('<td></td>');

					td4.append(sp1);
					td4.append(sp2);
					td4.append(sp3);
					td4.append(sp4);
					tr.append(td1);
					tr.append(td2);
					tr.append(td3);
					tr.append(td4);
					tbody.append(tr);
				}
				$('.running-start').on('click', startTask);
				$('.running-pause').on('click', pauseTask);
				$('.running-end').on('click', _endTask);
				$('.running-details').on('click', showRunningDetails);
			}
		});
}

var startTask = function(e){
	var target = $(e.target);
	var id = parseInt(target.attr('id'))-1;
	$.ajax({
		url: modelSystemURLHeader + '/Fitter/startTask',
		type:'POST',
		data:{'taskId': runningTasks[id]['id']},
		success: function(data){
			data = data.trim();
			if(data == 'success'){
				alert('任务已开始');
				refreshRunningTask();
			}
			else{
				alert('开始任务失败，请检查任务是否已开始');
			}
		},
		error: function(data){
			alert('开始任务失败，请刷新或稍后再试');
		}
	});
}

var pauseTask = function(e){
	var target = $(e.target);
	var id = parseInt(target.attr('id'))-1;
	$.ajax({
		url: modelSystemURLHeader + '/Fitter/pauseTask',
		type:'POST',
		data:{'taskId': runningTasks[id]['id']},
		success: function(data){
			data = data.trim();
			if(data == 'success'){
				alert('任务已暂停');
				refreshRunningTask();
			}
			else{
				alert('暂停任务失败，请检查任务是否已暂停');
			}
		},
		error: function(data){
			alert('暂停任务失败，请刷新或稍后再试');
		}
	});
}

var _endTask = function(e){
	if(!confirm('确定结束任务?'))
		return;
	if(modelSystemMask)
		return;
	modelSystemMask = $('<div class="model-system-mask"><div>');
	$('body').append(modelSystemMask);
	var container = $('<div class="mask-container"></div>');
	modelSystemMask.append(container);
	var input = $('<input placeholder="输入使用机器的小时数"/>');
	var buttonCheck = $('<button>确认</button>');
	var buttonCancle = $('<button>取消</button>');
	var message = $('<p style="color: rgba(220,20,60,1);margin-bottom:5px;"></p>');
	container.append(input);
	container.append(buttonCheck);
	container.append(buttonCancle);
	container.append(message);
	buttonCheck.on('click', function(){
		var s = /^\+?\d+(\.\d+)?$/;
		var val = input.val();
		if(val.match(s)){
			var target = $(e.target);
			var id = parseInt(target.attr('id'))-1;
			endTask(id, parseFloat(val));
			modelSystemMask.remove();
			modelSystemMask = null;
		}else{
			message.html('输入的数值不正确');
		}
	});

	buttonCancle.on('click', function(){
		modelSystemMask.remove();
		modelSystemMask = null;
	});
}

var endTask = function(id, machineTime){
	$.ajax({
		url: modelSystemURLHeader + '/Fitter/endTask',
		type:'POST',
		data:{'taskId': runningTasks[id]['id'], 'machineTime':machineTime},
		success: function(data){
			data = data.trim();
			if(data == 'success'){
				alert('任务已结束');
				refreshRunningTask();
			}
			else{
				alert('结束任务失败，请刷新或稍后再试');
			}
		},
		error: function(data){
			alert('结束任务失败，请刷新或稍后再试');
		}
	});
}

var showPendingDetails = function(e){
	if(modelSystemMask)
		return;
	var target = $(e.target);
	var id = parseInt(target.attr('id'))-1;
	modelSystemMask = $('<div class="model-system-mask"><div>');
	$('body').append(modelSystemMask);
	var container = $('<div class="mask-container"></div>');
	modelSystemMask.append(container);
	
	var machineCode = $('<p></p>');
	var machineName = $('<p></p>');
	var modelCode = $('<p></p>');
	var procedureName = $('<p></p>');
	var acceptButton = $('<button>接收</button>');
	var rejectButton = $('<button>驳回</button>');
	var cancelButton = $('<button>取消</button>');
	var checkBox = $('<div style="margin-bottom:15px;"></div>');
	var message = $('<p id="mask-message" style="color: rgba(220,20,60,1);margin-bottom:5px;"></p>');
	for(var i=0;i<members.length;i++){
		var lable = $('<lable style="margin-right:5px;"></lable>');
		var check = $('<input type="checkbox" id="'+members[i]['id']+'"/>');
		check.attr('checked', true);
		lable.append(check);
		lable.append($('<span>'+members[i]['name']+'</span>'));
		checkBox.append(lable);
	}

	message.html('请选择参加任务的小组成员');
	machineCode.html('机器编号: '+pendingTasks[id]['machineCode']);
	machineName.html('机器名称: '+pendingTasks[id]['machineName']);
	modelCode.html('模号: '+pendingTasks[id]['modelCode']);
	procedureName.html('工序名: '+pendingTasks[id]['procedureName']);

	container.append(machineCode);
	container.append(machineName);
	container.append(modelCode);
	container.append(procedureName);
	container.append(message);
	container.append(checkBox);
	container.append(acceptButton);
	container.append(rejectButton);
	container.append(cancelButton);


	cancelButton.on('click', maskCancel);
	rejectButton.on('click', {'id':id}, maskReject);
	acceptButton.on('click', {'id':id}, maskAccept);
}

var showRunningDetails = function(e){
	if(modelSystemMask)
		return;
	var target = $(e.target);
	var id = parseInt(target.attr('id'))-1;
	modelSystemMask = $('<div class="model-system-mask"><div>');
	$('body').append(modelSystemMask);
	var container = $('<div class="mask-container"></div>');
	modelSystemMask.append(container);

	var startTime = $('<p></p>');
	var machineCode = $('<p></p>');
	var machineName = $('<p></p>');
	var modelCode = $('<p></p>');
	var procedureName = $('<p></p>');
	var confirmButton = $('<button style="display:block;margin: 0px auto">确认</button>');

	startTime.html('开始时间: '+runningTasks[id]['startTime']);
	machineCode.html('机器编号: '+runningTasks[id]['machineCode']);
	machineName.html('机器名称: '+runningTasks[id]['machineName']);
	modelCode.html('模号: '+runningTasks[id]['modelCode']);
	procedureName.html('工序名: '+runningTasks[id]['name']);

	container.append(startTime);
	container.append(machineCode);
	container.append(machineName);
	container.append(modelCode);
	container.append(procedureName);
	container.append(confirmButton);

	confirmButton.on('click', maskCancel);
}

var maskCancel = function(){
	modelSystemMask.remove();
	modelSystemMask = null;
}

var maskReject = function(e){
	var target = $(e.target);
	target.attr('disabled', 'disabled');
	if(confirm('确定要驳回该任务吗？')){
		$.ajax({
			url: modelSystemURLHeader + '/Fitter/reject',
			type:'POST',
			data:{'taskId': pendingTasks[e.data.id]['id']},
			success: function(data){
				data = data.trim();
				if(data == 'success'){
					alert('驳回任务成功');
					target.attr('disabled', false);
					refreshPendingTask();
				}
				else{
					alert('驳回任务失败，请刷新任务列表再试');
					target.attr('disabled', false);
				}
			},
			error: function(data){
				alert('驳回任务失败，请刷新任务列表再试');
				target.attr('disabled', false);
			}
		});
		modelSystemMask.remove();
		modelSystemMask = null;
	}else{
		target.attr('disabled', false);
	}
}

var maskAccept = function(e){
	var target = $(e.target);
	target.attr('disabled', 'disabled');
	var mes = modelSystemMask.find('input:checkbox:checked');
	if(mes.length == 0){
		modelSystemMask.find('#mask-message').html('至少需要选择一个组员');
		target.attr('disabled', false);
		return;
	}
	var choicedMembers = [];
	for(var i=0;i<mes.length;i++){
		choicedMembers[i] = $(mes[i]).attr('id');
	}
	if(confirm('确定要接收该任务吗？')){
		$.ajax({
			url: modelSystemURLHeader + '/Fitter/accept',
			type:'POST',
			data:{'taskId': pendingTasks[e.data.id]['id'], 'members': choicedMembers},
			success: function(data){
				data = data.trim();
				if(data == 'success'){
					alert('接收任务成功');
					target.attr('disabled', false);
					refreshPendingTask();
					refreshRunningTask();
				}
				else{
					alert('接收任务失败，请刷新任务列表再试');
					target.attr('disabled', false);
				}
			},
			error: function(data){
				alert('接收任务失败，请刷新任务列表再试');
				target.attr('disabled', false);
			}
		});
		modelSystemMask.remove();
		modelSystemMask = null;
	}else{
		target.attr('disabled', false);
	}
}