//任务状态名
var stateName = ['队列中','等待工人确认','工人已接收任务','工人已驳回任务','任务已结束'];
//机器的所有显示信息
var machineInfo = ['code', 'name', 'dept'];
//任务的所有显示信息
var taskInfo = ['modelcode', 'partcode', 'partname', 'procedurename', 'starttime', 'duration', 'endtime', 'state'];
//可选的年份、月份、日期
var optionalYears,optionalMonths,optionalDays,optionalHours;
//可选的工序名
var optionalProcedure;
//所有可计划的部门
var depts;
//初始的所有任务
var initialTasks;
//所有可计划的模具
var models;
//计划表是否发生更改
var isChanged;
//任务缓存(用于剪切功能)
var taskCache;
//机器右击菜单
var machineMenuItems;
//任务右击菜单
var taskMenuItems;

//所有机器的ID
var initialKey;
//异步加载步长
var loadStep;
//异步加载当前位置
var loadIndex;
//异步加载时间侦听
var loadTimer;

//所有被标识的任务
var identifyingTask;
//当前聚焦的任务
var curFocusTask;

var activeModelsSelect;
var finishedModelsSelect;

var __sto = setInterval;    
window.setInterval = function(callback,timeout,param){    
    var args = Array.prototype.slice.call(arguments,2);
    var _cb = function(){    
        callback.apply(null,args);    
    }    
    return __sto(_cb,timeout);
}

var modelSystemPlanner = function(_initialTasks, _models, _depts, _procedures){
	var table = $('#model-system-table');
	var saveButton = $('#model-system-save-button');
	var machineButton = $('#model-system-machine-button');
	var downloadButton = $('#download-button');
	var finishButton = $('#finish-button');
	var procedureButton = $('#procedure-button');
	activeModelsSelect = $('#active-models');
	finishedModelsSelect = $('#finished-models');
	var searchModelSelect = $('#search-models');
	var searchPartSelect = $('#search-parts');
	var searchProcedureSelect = $('#search-procedures');
	var searchButton = $('#search-button');

	activeModelsSelect.selectpicker({size:10});
	finishedModelsSelect.selectpicker({size:10});
	searchModelSelect.selectpicker({size:10});
	searchPartSelect.selectpicker({size:10});
	searchProcedureSelect.selectpicker({size:10});

	isChanged = false;
	initialTasks = _initialTasks;
	models = _models;
	depts = _depts;
	optionalProcedure = _procedures;
	identifyingTask = [];
	curFocusTask = null;
	optionalYears = new Array();
	for(var i=0;i<20;i++)
		optionalYears[i] = String(2017+i);
	optionalMonths = new Array();
	for(var i=0;i<12;i++)
		optionalMonths[i] = String(i+1);
	optionalDays = new Array();
	for(var i=0;i<31;i++)
		optionalDays[i] = String(i+1);
	optionalHours = new Array();
	for(var i=0;i<24;i++)
		optionalHours[i] = String(i);
	initialKey = [];
	for(var index in initialTasks){
		initialKey.push(index);
	}
	loadStep = 5;
	loadIndex = 0;
	loadTimer = window.setInterval(asynLoad, 10, table);
	finishButton.on('click', finishModel);
	downloadButton.on('click', downloadModel);
	saveButton.on('click', savePlan);
	machineButton.on('click', function(){
		window.open(modelSystemURLHeader + 'Show/machineView');
	});
	window.onbeforeunload = function(){
		if(isChanged == false)
			return;
		return " ";
	}
	procedureButton.on('click', function(){
		window.open(modelSystemURLHeader + 'Planner/procedureView');
	});

	searchModelSelect.bind('change', function(){
		var val = searchModelSelect.val();
		searchPartSelect.empty();
		if(val==-1){
			searchPartSelect.selectpicker('refresh');
		}else{
			$.ajax({
				url: modelSystemURLHeader + '/Planner/getParts',
				type:'POST',
				data:{'id':val},
				success: function(data){
					data = JSON.parse(data.trim());
					searchPartSelect.append('<option value="-1">所有零件</option>');
					for(var i=0;i<data.length;i++){
						var partCode = data[i]['code'];
						var partName = data[i]['name'];
						searchPartSelect.append('<option partcode="'+partCode+'" partname="'+partName+'">'+partCode+'('+partName+')</option>');
					}
					searchPartSelect.selectpicker('refresh');
				}
			});
		}
		var modelCode=null, partCode=null, partName=null, procedureName=null;
		var mop = searchModelSelect.find("option:selected");
		var paop = searchPartSelect.find("option:selected");
		var prop = searchProcedureSelect.find("option:selected");
		if(mop.size()>0 && mop.val()!=-1){
			modelCode = mop.text();
		}
		if(paop.size()>0 && paop.val()!=-1){
			partCode = paop.attr('partcode');
			partName = paop.attr('partname');
		}
		if(prop.size()>0 && prop.val()!=-1){
			procedureName = prop.text();
		}
		searchTask(modelCode, partCode, partName, procedureName);
	});

	searchPartSelect.bind('change', function(){
		var modelCode=null, partCode=null, partName=null, procedureName=null;
		var mop = searchModelSelect.find("option:selected");
		var paop = searchPartSelect.find("option:selected");
		var prop = searchProcedureSelect.find("option:selected");
		if(mop.size()>0 && mop.val()!=-1){
			modelCode = mop.text();
		}
		if(paop.size()>0 && paop.val()!=-1){
			partCode = paop.attr('partcode');
			partName = paop.attr('partname');
		}
		if(prop.size()>0 && prop.val()!=-1){
			procedureName = prop.text();
		}
		searchTask(modelCode, partCode, partName, procedureName);
	});

	searchProcedureSelect.bind('change', function(){
		var modelCode=null, partCode=null, partName=null, procedureName=null;
		var mop = searchModelSelect.find("option:selected");
		var paop = searchPartSelect.find("option:selected");
		var prop = searchProcedureSelect.find("option:selected");
		if(mop.size()>0 && mop.val()!=-1){
			modelCode = mop.text();
		}
		if(paop.size()>0 && paop.val()!=-1){
			partCode = paop.attr('partcode');
			partName = paop.attr('partname');
		}
		if(prop.size()>0 && prop.val()!=-1){
			procedureName = prop.text();
		}
		searchTask(modelCode, partCode, partName, procedureName);
	});

	searchButton.on('click', findNextTask);

	$('.search-field').find('.bootstrap-select').find('button').keypress(cancleEnter);
	searchButton.keypress(cancleEnter);
}

var cancleEnter = function(e){
	var key = window.event ? e.keyCode : e.which;
	if (key.toString() == "13") {
 		return false;
	}
}

var finishModel = function(e){
	var button = $(e.target);
	var modelId = activeModelsSelect.val();
	var message = $('#finish-wait');
	button.attr('disabled', 'disabled');
	if(modelId == '-1'){
		alert('请选择要结束的模具');
		button.attr('disabled', false);
		return;
	}
	var flag = true;
	$.each($('.model-system-task'),  function(index, value){
		var id = $(value).attr('modelid');
		if(modelId == id){	
			flag = false;
			button.attr('disabled', false);
			return;
		}
	});
	if(!flag){
		if(!confirm('计划表中还有该模具的任务，是否继续结束？')){
			button.attr('disabled', false);
			return;
		}
	}
	message.html('请稍后...');
	$.ajax({
		url: modelSystemURLHeader + '/Planner/finishCheck',
		type: 'POST',
		data: {'id': modelId},
		success: function(data){
			data = data.trim();
			if(data=='yes' || (data=='no'&&confirm('该模具还有未完成工序，是否继续结束？'))){
				$.ajax({
					url: modelSystemURLHeader + '/Planner/finishModel',
					type: 'POST',
					data: {'id': modelId},
					success: function(_data){
						_data = _data.trim();
						if(_data == 'success'){
							message.html('');
							alert('结束模具成功');
							var op = activeModelsSelect.find('option[value='+modelId+']');
							finishedModelsSelect.append('<option value="'+modelId+'">'+op.text()+'</option>')
							op.remove();
							activeModelsSelect.selectpicker('refresh');
							finishedModelsSelect.selectpicker('refresh');
							button.attr('disabled', false);
						}else{
							console.log(_data);
							alert('结束模具失败，请稍后再试');
							button.attr('disabled', false);
						}
					}
				});
			}
		}
	});
}

var downloadModel = function(){
	var modelId = finishedModelsSelect.val();
	if(modelId == '-1'){
		alert('请选择要下载的模具');
		return;
	}
	window.location.href = modelSystemURLHeader + 'Planner/downloadExcel/' + modelId;
}

var asynLoad = function(table){
	if(loadIndex == initialKey.length){
		window.clearInterval(loadTimer);
	}
	for(var cnt=0;loadIndex<initialKey.length && cnt<loadStep;loadIndex++,cnt++){
		var tr = $('<tr></tr>');
		var index = initialKey[loadIndex];
		tr.attr('rid', index);
		tr.append(createMachine(initialTasks[index][0]));
		tr.append(createTasks(index, initialTasks[index][1]));
		table.append(tr);
	}
}

var savePlan = function(e){
	var button = $(e.target);
	var table = $('#model-system-table');
	var rows = table.find('tr');
	var saveWait = $('#save-wait');
	button.attr('disabled', 'disabled');
	saveWait.html('请稍等...');
	var res = {};
	for(var i=1;i<rows.length;i++){
		var rid = $(rows[i]).attr('rid');
		var machine = $(rows[i]).find('.model-system-machine');
		var mp = machine.find('p');
		var tasks = $(rows[i]).find('.model-system-task');
		res[rid] = [];
		res[rid][0] = {};
		res[rid][1] = [];
		res[rid][0]['id'] = rid;
		for(var mi in machineInfo){
			var val = machineInfo[mi];
			res[rid][0][val] = machine.find("[fieldname='"+val+"']").find('.value').html();
		}
		res[rid][0]['resttime'] = JSON.parse(machine.attr('resttime'));

		for(var j=0;j<tasks.length;j++){
			var tmp = $(tasks[j]);
			res[rid][1][j] = {};
			res[rid][1][j]['modelid'] = tmp.attr('modelid');
			res[rid][1][j]['partid'] = tmp.attr('partid');
			for(var ti in taskInfo){
				var val = taskInfo[ti];
				res[rid][1][j][val] = tmp.find("[fieldname='"+val+"']").attr('textval');
			}
			res[rid][1][j]['id'] = tmp.attr('id');
		}
	}
	var jsonStr = JSON.stringify(res);
	console.log(jsonStr.length);
	$.ajax({
		url: modelSystemURLHeader + '/Planner/save',
		type:'POST',
		data:{'data': jsonStr},
		success: function(data){
			data = data.trim();
			console.log(data);
			if(data == 'success'){
				isChanged = false;
				alert('保存成功');
				saveWait.html('');
				button.attr('disabled', false);
			}
			else{
				alert('系统错误请稍后再试');
				saveWait.html('');
				button.attr('disabled', false);
			}
		},
		error: function(data){
			alert('系统错误请稍后再试');
			saveWait.html('');
			button.attr('disabled', false);
		}
	});
}

var createMachine = function(machine){
	if(!machineMenuItems){
		machineMenuItems = 
		[
			{
				label: '新建任务并添加到队头',
				action: addToHead
			}, 
			{
				label: '新建任务并添加到队尾',
				action: addToTail
			}
		];
	}

	var td = $('<td></td>');
	var container = $('<div class="model-system-machine"></div>');
	var code = $('<p fieldname="code"><span class="name">机台编号: </span><span class="value">'+machine['code']+'</span></p>');
	var name = $('<p fieldname="name"><span class="name">机台名称: </span><span class="value">'+machine['name']+'</span></p>');
	var department = $('<p fieldname="dept"><span class="name">所属部门: </span><span class="value">'+machine['dept']+'</span></p>');

	container.attr('rid', machine['id']);
	container.attr('resttime', JSON.stringify(machine['resttime']));

	code.attr('textval', machine['code']);
	name.attr('textval', machine['name']);
	department.attr('textval', machine['dept']);

	container.append(code);
	container.append(name);
	container.append(department);
	container.contextPopup({title:'', items: machineMenuItems});
	td.append(container);
	return td;
}

var createTasks = function(rId, tasks){
	var td = $('<td></td>');
	var w = document.documentElement.clientWidth;
	var queue = $('<div style="width: '+(w-330)+'px" class="model-system-task-queue"></div>');
	for(var j=0;j<tasks.length;j++){
		queue.append(createTask(rId, tasks[j]));
	}
	td.append(queue);
	return td;
}

var createTask = function(rId, task){
	if(!taskMenuItems){
		taskMenuItems = 
		[
			{
				label: '发布任务',
				action: chooseWorker
			},
			{
				label: '新建任务并添加到左侧',
				action: addToLeft
			}, 
			{
				label: '新建任务并添加到右侧',
				action: addToRight
			},
			{
				label: '删除任务',
				action: deleteTask
			},
			{
				label: '剪切',
				action: shearTask
			},
			{
				label: '粘贴到右侧',
				action: copyToRight
			}
		];
	}

	var container = $('<div class="model-system-task"></div>');

	var modelCode = $('<p fieldname="modelcode"><span class="name">模号: </span><span style="font-weight: bold" class="value">'+task['modelcode']+'</span></p>');
	var partCode = $('<p fieldname="partcode"><span class="name">零件号: </span><span class="value">'+task['partcode']+'</span></p>');
	var partName = $('<p fieldname="partname"><span class="name">零件名: </span><span style="font-weight: bold" class="value">'+task['partname']+'</span></p>');
	var procedureName = $('<p fieldname="procedurename"><span class="name">工序名: </span><span class="value">'+task['procedurename']+'</span></p>');
	var startTime = $('<p fieldname="starttime"><span class="name">开始时间: </span><span class="value">'+getFormatDate(new Date(task['starttime']), true)+'</span></p>');
	var duration = $('<p fieldname="duration"><span class="name">计划时长: </span><span class="value">'+task['duration']+'</span></p>');
	var endTime = $('<p fieldname="endtime"><span class="name">结束时间: </span><span class="value">'+getFormatDate(new Date(task['endtime']), true)+'</span></p>');
	var state = $('<p fieldname="state"><span class="name">任务状态: </span><span class="value state_'+task['state']+'">'+stateName[task['state']]+'</span></p>');
	
	container.attr('id', task['id']);
	container.attr('rid', rId);
	container.attr('modelid', task['modelid']);
	container.attr('partid', task['partid']);

	modelCode.attr('textval', task['modelcode']);
	partCode.attr('textval', task['partcode']);
	partName.attr('textval', task['partname']);
	procedureName.attr('textval', task['procedurename']);
	startTime.attr('textval', task['starttime']);
	duration.attr('textval', task['duration']);
	endTime.attr('textval', task['endtime']);
	state.attr('textval', task['state']);

	if(task['state'] == '1'){
		var stateSp = state.find('.value');
		var int = window.setInterval(getState, 1000, stateSp, task['id']);
		stateSp.attr('timerid', String(int));
	}
	
	container.append(modelCode);
	container.append(partCode);
	container.append(partName);
	container.append(procedureName);
	container.append(startTime);
	container.append(duration);
	container.append(endTime);
	container.append(state);

	container.contextPopup({title:'', items: taskMenuItems});

	return container;
}

var getState = function(state, id){
	$.ajax({
		url: modelSystemURLHeader + '/Planner/getState',
		type:'POST',
		data:{'id': id},
		success: function(data){
			data = data.trim();
			for(var i=1;i<=stateName.length;i++){
				if(state.hasClass('state_'+i)){
					state.removeClass('state_'+i)
				}
				state.parent().attr('textval', data);
				state.addClass('state_'+data);
				state.html(stateName[parseInt(data)]);
			}
			if(data != '1'){
				clearInterval(parseInt(state.attr('timerid')));
			}
		}
	});
}

var chooseWorker = function(e){
	var target = $(e.target);
	while(true){
		if(target.hasClass('model-system-task'))
			break;
		target = target.parent();
	}
	var mask = $('<div class="model-system-mask"><div>');
	$('body').append(mask);

	var workersContainer = $('<div class="mask-workers-container"></div>');
	var workersText = $('<p class="mask-text">请选择任务的操作工人</p>');

	var deptContainer = $('<div class="mask-part-container"></div>');
	var deptLabel = $('<span>所属部门</span>');
	var deptSelect = $('<select class="selectpicker" data-live-search="true"></select>');
	deptSelect.append('<option value="-1">请选择</option>');
	for(var i=0;i<depts.length;i++){
		deptSelect.append('<option value="'+depts[i]['id']+'">'+depts[i]['name']+'</option>')
	}
	

	var personContainer = $('<div class="mask-part-container"></div>');
	var personLabel = $('<span>工人姓名</span>');
	var personSelect = $('<select class="selectpicker" data-live-search="true"></select>');

	var message = $('<p class="mask-text"></p>');
	var checkButton = $('<button>确认</button>');
	var cancleButton = $('<button>取消</button>');

	deptContainer.append(deptLabel);
	deptContainer.append(deptSelect);
	personContainer.append(personLabel);
	personContainer.append(personSelect);
	workersContainer.append(workersText);
	workersContainer.append(deptContainer);
	workersContainer.append(personContainer);
	mask.append(workersContainer);
	mask.append(message);
	mask.append(checkButton);
	mask.append(cancleButton);
	deptSelect.selectpicker({size:10});
	personSelect.selectpicker({size:10});

	deptSelect.bind('change', function(){
		var val = deptSelect.val();
		personSelect.empty();
		if(val==-1){
			personSelect.selectpicker('refresh');
			return;
		}
		$.ajax({
			url: modelSystemURLHeader + '/Planner/getWorkers',
			type:'POST',
			data:{'id':val},
			success: function(data){
				data = JSON.parse(data.trim());
				personSelect.append('<option value="-1">请选择</option>');
				for(var i=0;i<data.length;i++){
					var workerId = data[i]['id'];
					var workerName = data[i]['name'];
					personSelect.append('<option workername="'+workerName+'" value="'+workerId+'">'+workerName+'('+workerId+')'+'</option>');
				}
				personSelect.selectpicker('refresh');
			}
		});
	});
	var data = {};
	data['target'] = target;
	data['deptSelect'] = deptSelect;
	data['personSelect'] = personSelect;
	data['message'] = message;
	data['mask'] = mask;
	checkButton.on('click', data, publishTask);
	cancleButton.on('click', function(){
		mask.remove();
	});
}

var publishTask = function(e){
	var target = e.data.target;
	var deptSelect = e.data.deptSelect;
	var personSelect = e.data.personSelect;
	var message = e.data.message;
	var mask = e.data.mask;
	if(!deptSelect.val() || deptSelect.val() == -1){
		message.html('未选择部门');
		return;
	}
	var machineId = target.attr('rid');
	var modelId = target.attr('modelid');
	var modelCode = target.find("[fieldname='modelcode']").attr('textval');
	var partId = target.attr('partid');
	var partCode = target.find("[fieldname='partcode']").attr('textval');
	var partName = target.find("[fieldname='partname']").attr('textval');
	var procedureName = target.find("[fieldname='procedurename']").attr('textval');
	var machine = target.parent().parent().prev().find('.model-system-machine');
	var machineCode = machine.find("[fieldname='code']").attr('textval');
	var machineName = machine.find("[fieldname='name']").attr('textval');
	var deptId = deptSelect.val();
	var deptName = deptSelect.find("option:selected").html();
	var workerId = personSelect.val();
	var workerName = personSelect.find("option:selected").attr('workername');
	if(workerId == -1){
		workerId = null;
		workerName = null;
	}

	var confirmStr = "请确认以下信息: \n\n  模号: "+modelCode+"\n  零件号: "+partCode+"\n  零件名: "+partName+"\n  工序名: "+procedureName+"\n  机器编号: "+machineCode+"\n  机器名: "+machineName+"\n";
	if(workerName){
		confirmStr += ("  工人姓名: "+workerName+"\n\n");
	}else{
		confirmStr += ("  部门名: "+deptName+"\n\n");
	}
	confirmStr += '确认分布此任务?';

	var id = target.attr('id');
	if(confirm(confirmStr)){
		$.ajax({
			url: modelSystemURLHeader + '/Planner/publish',
			type:'POST',
			data:{'machineId': machineId,'modelId': modelId,'partId': partId,'procedureName': procedureName,'deptId': deptId,'workerId': workerId,'id': id},
			success: function(data){
				data = data.trim();
				console.log(data);
				if(data == 'success'){
					var sp = $(target.find("[fieldname='state']")).find('.value');
					var int = window.setInterval(getState, 1000, sp, id);
					sp.attr('timerid', String(int));
					alert('任务发布成功');
				}else{
					alert('任务发布失败请稍后再试');
				}
			},
			error: function(){
				alert('任务发布失败请稍后再试');
			}
		});
		mask.remove();
	}
}

var addToHead = function(e){
	var target = $(e.target);
	while(true){
		if(target.hasClass('model-system-machine'))
			break;
		target = target.parent();
	}
	var tmp = target.parent().next().find('.model-system-task').get(0);
	if(!tmp)
		chooseAndAdd(target, 'left', true);
	else
		chooseAndAdd($(tmp), 'left', true);
}

var addToTail = function(e){
	var target = $(e.target);
	while(true){
		if(target.hasClass('model-system-machine'))
			break;
		target = target.parent();
	}
	var tmp = target.parent().next().find('.model-system-task');
	tmp = tmp.get(tmp.length-1);
	if(!tmp)
		chooseAndAdd(target, 'left', true);
	else
		chooseAndAdd($(tmp), 'right', false);
}

var addToLeft = function(e){
	var target = $(e.target);
	while(true){
		if(target.hasClass('model-system-task'))
			break;
		target = target.parent();
	}
	if(target.prev().length>0){
		chooseAndAdd(target, 'left', false);
	}else{
		chooseAndAdd(target, 'left', true);
	}
}

var addToRight = function(e){
	var target = $(e.target);
	while(true){
		if(target.hasClass('model-system-task'))
			break;
		target = target.parent();
	}
	chooseAndAdd(target, 'right', false);
}

var deleteTask = function(e){
	var target = $(e.target);
	while(true){
		if(target.hasClass('model-system-task'))
			break;
		target = target.parent();
	}
	if(target.prev().length>0){
		var p = target.prev();
		target.remove();
		abjustTime(p.nextAll());
	}else{
		target.remove();
	}
	isChanged = true;
	reSearch(target.find("[fieldname='modelcode']").attr('textval'),
		target.find("[fieldname='partcode']").attr('textval'),
		target.find("[fieldname='partname']").attr('textval'),
		target.find("[fieldname='procedurename']").attr('textval'));
}

var shearTask = function(e){
	var target = $(e.target);
	while(true){
		if(target.hasClass('model-system-task'))
			break;
		target = target.parent();
	}
	taskCache = makeClone(target);
	if(target.prev().length>0){
		var p = target.prev();
		target.remove();
		abjustTime(p.nextAll());
	}else{
		target.remove();
	}
	isChanged = true;
	reSearch(taskCache.find("[fieldname='modelcode']").attr('textval'),
		taskCache.find("[fieldname='partcode']").attr('textval'),
		taskCache.find("[fieldname='partname']").attr('textval'),
		taskCache.find("[fieldname='procedurename']").attr('textval'));
}

var makeClone = function(target){
	var task = {};
	task['modelid'] = target.attr('modelid');
	task['partid'] = target.attr('partid');
	for(var ti in taskInfo){
		var val = taskInfo[ti];
		task[val] = target.find("[fieldname='"+val+"']").attr('textval');
	}
	task['id'] = target.attr('id');
	return createTask(target.attr('rid'), task);
}

var copyToRight = function(e){
	var target = $(e.target);
	while(true){
		if(target.hasClass('model-system-task'))
			break;
		target = target.parent();
	}
	if(!taskCache)
		return;
	taskCache.attr('rid', target.attr('rid'));
	target.after(taskCache);
	abjustTime(target.nextAll());
	isChanged = true;
	reSearch(taskCache.find("[fieldname='modelcode']").attr('textval'),
		taskCache.find("[fieldname='partcode']").attr('textval'),
		taskCache.find("[fieldname='partname']").attr('textval'),
		taskCache.find("[fieldname='procedurename']").attr('textval'));
}

var chooseAndAdd = function(target, position, hasDate){
	var mask = $('<div class="model-system-mask"><div>');
	$('body').append(mask);
	if(hasDate){
		var dateContainer = $('<div class="mask-date-container"></div>');

		var dateText = $('<p class="mask-text">请选择日期</p>');

		var yearContainer = $('<div class="mask-part-container"></div>');
		var yearSelect = $('<select class="selectpicker" data-live-search="true"></select>');
		var yearLabel = $('<span>年</span>');
		for(var i=0;i<optionalYears.length;i++){
			yearSelect.append('<option>'+optionalYears[i]+'</option>')
		}
		
		var monthContainer = $('<div class="mask-part-container"></div>');
		var monthSelect = $('<select class="selectpicker" data-live-search="true"></select>');
		var monthLabel = $('<span>月</span>');
		for(var i=0;i<optionalMonths.length;i++){
			monthSelect.append('<option>'+optionalMonths[i]+'</option>')
		}

		var dayContainer = $('<div class="mask-part-container"></div>');
		var daySelect = $('<select class="selectpicker" data-live-search="true"></select>');
		var dayLabel = $('<span>日</span>');
		for(var i=0;i<optionalDays.length;i++){
			daySelect.append('<option>'+optionalDays[i]+'</option>')
		}
	
		var hourContainer = $('<div class="mask-part-container"></div>');
		var hourSelect = $('<select class="selectpicker" data-live-search="true"></select>');
		var hourLabel = $('<span>时</span>');
		for(var i=0;i<optionalHours.length;i++){
			hourSelect.append('<option>'+optionalHours[i]+'</option>')
		}
		

		yearContainer.append(yearSelect);
		yearContainer.append(yearLabel);

		monthContainer.append(monthSelect);
		monthContainer.append(monthLabel);

		dayContainer.append(daySelect);
		dayContainer.append(dayLabel);

		hourContainer.append(hourSelect);
		hourContainer.append(hourLabel);

		dateContainer.append(dateText);
		dateContainer.append(yearContainer);
		dateContainer.append(monthContainer);
		dateContainer.append(dayContainer);
		dateContainer.append(hourContainer);

		mask.append(dateContainer);
		yearSelect.selectpicker({size:10});
		monthSelect.selectpicker({size:10});
		daySelect.selectpicker({size:10});
		hourSelect.selectpicker({size:10});
	}
	var modelPartsContainer = $('<div class="mask-modelParts-container"></div>');

	var modelPartsText = $('<p class="mask-text">请选择工序</p>');

	var modelContainer = $('<div class="mask-part-container"></div>');
	var modelLabel = $('<span>模具编号</span>');
	var modelSelect = $('<select class="selectpicker" data-live-search="true"></select>');
	modelSelect.append('<option value="-1">请选择</option>');
	for(var i=0;i<models.length;i++){
		modelSelect.append('<option value="'+models[i]['id']+'">'+models[i]['code']+'</option>')
	}
	
	var partContainer = $('<div class="mask-part-container"></div>');
	var partLabel = $('<span>零件编号</span>');
	var partSelect = $('<select class="selectpicker" data-live-search="true"></select>');

	var procedureContainer = $('<div class="mask-part-container"></div>');
	var procedureLabel = $('<span>工序名</span>');
	var procedureSelect = $('<select class="selectpicker" data-live-search="true"></select>');
	procedureSelect.append('<option value="-1">请选择</option>');
	var index = 1;
	for(var i in optionalProcedure){
		procedureSelect.append('<option value="'+i+'">('+(index++)+')'+i+'</option>')
	}

	var durationContainer = $('<div class="mask-part-container"></div>');
	var durationLabel = $('<span>计划时长</span>');
	var durationInput = $('<input style="margin-top:15px;"/>');

	modelContainer.append(modelLabel);
	modelContainer.append(modelSelect);

	partContainer.append(partLabel);
	partContainer.append(partSelect);

	procedureContainer.append(procedureLabel);
	procedureContainer.append(procedureSelect);

	durationContainer.append(durationLabel);
	durationContainer.append(durationInput);

	modelPartsContainer.append(modelPartsText);
	modelPartsContainer.append(modelContainer);
	modelPartsContainer.append(partContainer);
	modelPartsContainer.append(procedureContainer);
	modelPartsContainer.append(durationContainer);

	mask.append(modelPartsContainer);
	modelSelect.selectpicker({size:10});
	partSelect.selectpicker({size:10});
	procedureSelect.selectpicker({size:10});

	var message = $('<p class="mask-text"></p>');
	var checkButton = $('<button>确认</button>');
	var cancleButton = $('<button>取消</button>');
	var data = {};
	if(hasDate){
		data['year'] = yearSelect;
		data['month'] = monthSelect;
		data['day'] = daySelect;
		data['hour'] = hourSelect;
	}
	data['model'] = modelSelect;
	data['part'] = partSelect;
	data['procedure'] = procedureSelect;
	data['target'] = target;
	data['position'] = position;
	data['hasDate'] = hasDate;
	data['message'] = message;
	data['duration'] = durationInput;
	data['mask'] = mask;
	checkButton.on('click', data, addTask);
	cancleButton.on('click', function(){
		mask.remove();
	});
	mask.append(message);
	mask.append(checkButton);
	mask.append(cancleButton);

	modelSelect.bind('change', function(){
		var val = modelSelect.val();
		partSelect.empty();
		if(val==-1){
			partSelect.selectpicker('refresh');
			return;
		}
		$.ajax({
			url: modelSystemURLHeader + '/Planner/getParts',
			type:'POST',
			data:{'id':val},
			success: function(data){
				data = JSON.parse(data.trim());
				partSelect.append('<option value="-1">请选择</option>');
				for(var i=0;i<data.length;i++){
					var partId = data[i]['id'];
					var partCode = data[i]['code'];
					var partName = data[i]['name'];
					var partAmount = data[i]['amount'];
					partSelect.append('<option value="'+partId+'" partcode="'+partCode+'" partname="'+partName+'">'+partCode+'('+partName+','+partAmount+')</option>');
				}
				partSelect.selectpicker('refresh');
			}
		});
	});
}

var addTask = function(e){
	var hasDate = e.data.hasDate;
	var message = e.data.message;
	var year;
	var month;
	var day;
	var hour;
	var target = e.data.target;
	var position = e.data.position;
	if(hasDate){
		year = parseInt(e.data.year.find("option:selected").text());
		month = parseInt(e.data.month.find("option:selected").text());
		day = parseInt(e.data.day.find("option:selected").text());
		hour = parseInt(e.data.hour.find("option:selected").text());
		var mxDay = [[31,28,31,30,31,30,31,31,30,31,30,31], [31,29,31,30,31,30,31,31,30,31,30,31]];
		var p = 0;;
		if((year % 4 == 0) && (year % 100 != 0 || year % 400 == 0))
			p = 1;
		if(day>mxDay[p][month-1]){
			message.html('非法的日期: '+year+'年的'+month+'月没有'+day+'日');
			return;
		}
	}
	var modelSelect = e.data.model;
	var partSelect = e.data.part;
	var procedureSelect = e.data.procedure;

	if(modelSelect.val()==-1 || partSelect.val()==-1 || procedureSelect.val()==-1){
		message.html('未完整选择工序');
		return;
	}

	var duration = e.data.duration.val().trim();
	if(!/^\d+$/.test(duration)){
		message.html('输入的计划时长无法识别');
		return;
	}else{
		duration = parseInt(duration);
		if(duration<=0){
			message.html('计划时长必须大于0');
			return;
		}
	}

	var modelId = modelSelect.val();
	var modelCode = modelSelect.find("option:selected").text();
	var partId = partSelect.val();
	var partCode = partSelect.find("option:selected").attr('partcode');
	var partName = partSelect.find("option:selected").attr('partname');
	var procedure = procedureSelect.val();

	var task = [];
	task['modelid'] = modelId;
	task['modelcode'] = modelCode;
	task['partid'] = partId;
	task['partcode'] = partCode;
	task['partname'] = partName;
	task['procedurename'] = procedure;
	if(hasDate){
		task['starttime'] = getFormatDate(new Date(year, month-1, day, hour, 0, 0), false);
	}
	else{
		var tmp;
		if(position == 'left'){
			tmp = target.prev();
		}else{
			tmp = target;
		}
		var str = tmp.find("[fieldname='endtime']").attr('textval');
		task['starttime'] = str;
	}
	task['duration'] = duration;
	var rId = target.attr('rid');
	task['endtime'] = getFormatDate(calEndTime(new Date(task['starttime']), duration, initialTasks[rId][0]['resttime']), false);
	task['id'] = String((new Date).getTime())+String(Math.random()*10000);
	task['state'] = '0';
	var newTask = createTask(rId, task);
	if(target.hasClass('model-system-machine')){
		target.parent().next().find('.model-system-task-queue').append(newTask);
	}
	else{
		if(position=='left')
			target.before(newTask);
		else
			target.after(newTask);
		abjustTime(newTask.nextAll());
	}
	isChanged = true;
	e.data.mask.remove();
	reSearch(modelCode, partCode, partName, procedure);
}

var abjustTime = function(list){
	list.each(function(){
		var cur = $(this);
		var per = cur.prev();
		var curStart = $(cur.find("[fieldname='starttime']")).find('.value');
		var curduration = $(cur.find("[fieldname='duration']")).find('.value').html();
		var curEnd = $(cur.find("[fieldname='endtime']")).find('.value');
		var perEnd = $(per.find("[fieldname='endtime']")).attr('textval');
		var rId = cur.attr('rid');
		var tmpDate = new Date(perEnd);

		curStart.parent().attr('textval', perEnd);
		curStart.html(getFormatDate(tmpDate, true));
		tmpDate = calEndTime(tmpDate, parseInt(curduration), initialTasks[rId][0]['resttime']);
		curEnd.parent().attr('textval', getFormatDate(tmpDate, false))
		curEnd.html(getFormatDate(tmpDate, true));
	});
}

var getFormatDate = function(date, isForLook){
	if(isForLook){
		return date.getFullYear()+'/'+(date.getMonth()+1)+'/'+date.getDate()+' '+date.getHours()+'时'+date.getMinutes()+'分';
	}else{
		return date.getFullYear()+'/'+(date.getMonth()+1)+'/'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
	}
}

var calEndTime = function(start, duration, rest){
	rest = JSON.parse(rest);
	var cur = start.getHours()*60+start.getMinutes();
	var res = 0;
	var dur = parseInt(duration)*60;

	for(var i=0;i<rest.length;i++){
		if(cur>=rest[i][0] && cur<=rest[i][1]){
			res += rest[i][1] - cur;
			cur = rest[i][1];
			if(cur == 1440){
				cur = 0;
				for(var j=0;j<rest.length;j++){
					if(cur>=rest[j][0] && cur<=rest[j][1]){
						res += rest[j][1] - cur;
						cur = rest[j][1];
					}
				}
			}
		}
	}

	var activeTime = 1440;
	for(var i=0;i<rest.length;i++){
		activeTime -= (rest[i][1] - rest[i][0]);
	}
	var r = parseInt(dur/activeTime);
	res += r*1440;
	dur -= r*activeTime;
	while(dur>0){
		tmp = findNextRest(cur, rest, dur);
		res += tmp[0];
		dur -= tmp[1];
		cur = tmp[2];
	}
	return new Date(start.getTime()+res*60000);
}

var findNextRest = function(cur, rest, dur){
	var res = new Array();
	var pos = -1;
	for(var i=0;i<rest.length;i++){
		if(rest[i][0]>=cur){
			pos = i;
			break;
		}
	}
	if(pos==-1){
		var e = 1440;
		if(e-cur>=dur){
			res[0] = dur;
			res[1] = dur;
			res[2] = dur + cur;
		}else{
			res[0] = e - cur;
			res[1] = e - cur;
			res[2] = e;
		}
	}else{
		if(rest[pos][0]-cur>=dur){
			res[0] = dur;
			res[1] = dur;
			res[2] = dur + cur;
		}else{
			res[0] = rest[pos][1] - cur;
			res[1] = rest[pos][0] - cur;
			res[2] = rest[pos][1];
		}
	}
	if(res[2] == 1440)
		res[2] = 0;
	return res;
}

var searchTask = function(modelCode, partCode, partName, procedureName){
	var table = $('#model-system-table');
	var rows = table.find('tr');
	if(curFocusTask!=null){
		identifyingTask[curFocusTask].removeClass('search-focus');
		curFocusTask = null;
	}
	identifyingTask = [];
	if(modelCode==null && partCode==null && partName==null && procedureName==null){
		table.find('.search-identifying').removeClass('search-identifying');
		return;	
	}
	for(var i=1;i<rows.length;i++){
		var tasks = $(rows[i]).find('.model-system-task');
		for(var j=0;j<tasks.length;j++){
			var tmp = $(tasks[j]);
			if((modelCode==null||tmp.find("[fieldname='modelcode']").attr('textval')==modelCode)&&
				(partCode==null||tmp.find("[fieldname='partcode']").attr('textval')==partCode)&&
				(partName==null||tmp.find("[fieldname='partname']").attr('textval')==partName)&&
				(procedureName==null||tmp.find("[fieldname='procedurename']").attr('textval')==procedureName)){
				tmp.addClass('search-identifying');
				identifyingTask.push(tmp);
			}else{
				if(tmp.hasClass('search-identifying')){
					tmp.removeClass('search-identifying');
				}
			}
		}
	}
}

var findNextTask = function(){
	if(!identifyingTask || identifyingTask.length==0){
		return;
	}
	$(document).scrollLeft(0);
	if(curFocusTask == null){
		curFocusTask = 0;
		identifyingTask[curFocusTask].addClass('search-focus');
		abjustScroll(identifyingTask[curFocusTask]);
	}else{
		identifyingTask[curFocusTask].removeClass('search-focus');
		curFocusTask = (curFocusTask+1)%identifyingTask.length;
		identifyingTask[curFocusTask].addClass('search-focus');
		abjustScroll(identifyingTask[curFocusTask]);
	}
}

var abjustScroll = function(target){
	var Q = target.parent();
	var bodyWidth = document.body.clientWidth;
	var bodyHeight = document.body.clientHeight;
	var docScroLeft = $(document).scrollLeft();
	var docScroTop = $(document).scrollTop();
	var QScroLeft = Q.scrollLeft();
	var QTop = Q.offset().top - docScroTop;
	var QBottom = QTop + Q[0].offsetHeight;
	var QLeft = Q.offset().left;
	var QRight = QLeft + Q[0].offsetWidth;
	var targetLeft = target.offset().left - docScroLeft;
	var targetTop = target.offset().top - docScroTop;
	var targetRight = targetLeft + target[0].offsetWidth;
	var targetBottom = targetTop + target[0].offsetHeight;
	
	if(QTop > bodyHeight){
		$(document).scrollTop(docScroTop+(QBottom-bodyHeight));
	}else if(QBottom < 0){
		$(document).scrollTop(docScroTop+QTop);
	}else if(QTop < 0){
		$(document).scrollTop(docScroTop+QTop);
	}else if(QBottom > bodyHeight){
		$(document).scrollTop(docScroTop+(QBottom-bodyHeight));
	}

	if(targetRight < QLeft){
		Q.scrollLeft(QScroLeft-(QLeft-targetLeft));
	}else if(targetLeft > QRight){
		Q.scrollLeft(QScroLeft+(targetRight-QRight));
	}else if(targetLeft < QLeft){
		Q.scrollLeft(QScroLeft-(QLeft-targetLeft));
	}else if(targetRight > QRight){
		Q.scrollLeft(QScroLeft+(targetRight-QRight));
	}
}

document.onkeydown = function(e){
	if(e.keyCode==13){
		findNextTask();
	}
}

var reSearch = function(modelCode, partCode, partName, procedureName){
	var modelcode=null, partcode=null, partname=null, procedurename=null;
	var mop = $("#search-models").find("option:selected");
	var paop = $("#search-parts").find("option:selected");
	var prop = $("#search-procedures").find("option:selected");
	if(mop.size()>0 && mop.val()!=-1){
		modelcode = mop.text();
	}
	if(paop.size()>0 && paop.val()!=-1){
		partcode = paop.attr('partcode');
		partname = paop.attr('partname');
	}
	if(prop.size()>0 && prop.val()!=-1){
		procedurename = prop.text();
	}
	if((modelcode==null||modelcode==modelCode)&&
		(partcode==null||partcode==partCode)&&
		(partname==null||partname==partName)&&
		(procedurename==null||procedurename==procedureName)){
		searchTask(modelcode, partcode, partname, procedurename);
	}
}