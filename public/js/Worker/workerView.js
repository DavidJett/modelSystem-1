var pendingTasks;
var runningTasks;
var pendingDetails;
var refreshPendingLink;
var refreshRunningLink;
var modelSystemMask;
var pendingTable;
var runningTable;
var stateName = ['暂停', '进行中', '结束'];

var modelSystemWorker = function(){
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
			url: modelSystemURLHeader + '/Worker/refreshPending',
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
			url: modelSystemURLHeader + '/Worker/refreshRunning',
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
				$('.running-end').on('click', endTask);
				$('.running-details').on('click', showRunningDetails);
			}
		});
}

var startTask = function(e){
	var target = $(e.target);
	var id = parseInt(target.attr('id'))-1;
	$.ajax({
		url: modelSystemURLHeader + '/Worker/startTask',
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
		url: modelSystemURLHeader + '/Worker/pauseTask',
		type:'POST',
		data:{'taskId': runningTasks[id]['id']},
		success: function(data){
			data = data.trim();
			console.log(data);
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

var endTask = function(e){
	if(!confirm('确定结束任务?'))
		return;
	var target = $(e.target);
	var id = parseInt(target.attr('id'))-1;
	$.ajax({
		url: modelSystemURLHeader + '/Worker/endTask',
		type:'POST',
		data:{'taskId': runningTasks[id]['id']},
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
	var partCode = $('<p></p>');
	var partName = $('<p></p>');
	var procedureName = $('<p></p>');
	var acceptButton = $('<button>接收</button>');
	var rejectButton = $('<button>驳回</button>');
	var cancelButton = $('<button>取消</button>');

	machineCode.html('机器编号: '+pendingTasks[id]['machineCode']);
	machineName.html('机器名称: '+pendingTasks[id]['machineName']);
	modelCode.html('模号: '+pendingTasks[id]['modelCode']);
	partCode.html('零件编号: '+pendingTasks[id]['partCode']);
	partName.html('零件名: '+pendingTasks[id]['partName']);
	procedureName.html('工序名: '+pendingTasks[id]['procedureName']);

	container.append(machineCode);
	container.append(machineName);
	container.append(modelCode);
	container.append(partCode);
	container.append(partName);
	container.append(procedureName);
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
	var partCode = $('<p></p>');
	var partName = $('<p></p>');
	var procedureName = $('<p></p>');
	var confirmButton = $('<button style="display:block;margin: 0px auto">确认</button>');

	startTime.html('开始时间: '+runningTasks[id]['startTime']);
	machineCode.html('机器编号: '+runningTasks[id]['machineCode']);
	machineName.html('机器名称: '+runningTasks[id]['machineName']);
	modelCode.html('模号: '+runningTasks[id]['modelCode']);
	partCode.html('零件编号: '+runningTasks[id]['partCode']);
	partName.html('零件名: '+runningTasks[id]['partName']);
	procedureName.html('工序名: '+runningTasks[id]['name']);

	container.append(startTime);
	container.append(machineCode);
	container.append(machineName);
	container.append(modelCode);
	container.append(partCode);
	container.append(partName);
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
			url: modelSystemURLHeader + '/Worker/reject',
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
	if(confirm('确定要接收该任务吗？')){
		$.ajax({
			url: modelSystemURLHeader + '/Worker/accept',
			type:'POST',
			data:{'taskId': pendingTasks[e.data.id]['id']},
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