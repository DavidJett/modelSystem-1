//任务状态名
var stateName = ['队列中','等待工人确认','工人已接收任务','工人已驳回任务','任务已结束'];
//机器的所有显示信息
var machineInfo = ['code', 'name', 'dept'];
//任务的所有显示信息
var taskInfo = ['modelcode', 'partcode', 'partname', 'procedurename', 'starttime', 'duration', 'endtime', 'state'];
//初始的所有任务
var initialTasks;

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
	var machineButton = $('#model-system-machine-button');

	var searchModelSelect = $('#search-models');
	var searchPartSelect = $('#search-parts');
	var searchProcedureSelect = $('#search-procedures');
	var searchButton = $('#search-button');

	searchModelSelect.selectpicker({size:10});
	searchPartSelect.selectpicker({size:10});
	searchProcedureSelect.selectpicker({size:10});

	initialTasks = _initialTasks;
	identifyingTask = [];
	curFocusTask = null;
	initialKey = [];
	for(var index in initialTasks){
		initialKey.push(index);
	}
	loadStep = 5;
	loadIndex = 0;
	loadTimer = window.setInterval(asynLoad, 10, table);
	machineButton.on('click', function(){
		window.open(modelSystemURLHeader + 'Show/machineView');
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

var createMachine = function(machine){
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

var getFormatDate = function(date, isForLook){
	if(isForLook){
		return date.getFullYear()+'/'+(date.getMonth()+1)+'/'+date.getDate()+' '+date.getHours()+'时'+date.getMinutes()+'分';
	}else{
		return date.getFullYear()+'/'+(date.getMonth()+1)+'/'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
	}
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