var searchField;
var modelSelect;
var partSelect;
var deptSelect;
var machineSelect;
var workerSelect;
var table;
var finishedModelsSelect;
var removeButton;
var resetButton;

var modelSystemAdminTask = function(){
	table = $('#table');
	finishedModelsSelect = $('#finished-models');
	removeButton = $('#remove-button');
	resetButton = $('#reset-button');
	searchField = $('#search-field');
	modelSelect = searchField.find('.model');
	partSelect = searchField.find('.part');
	deptSelect = searchField.find('.dept');
	machineSelect = searchField.find('.machine');
	workerSelect = searchField.find('.worker');
	finishedModelsSelect.selectpicker({size:10});

	modelSelect.selectpicker({size:10});
	partSelect.selectpicker({size:10});
	deptSelect.selectpicker({size:10});
	machineSelect.selectpicker({size:10});
	workerSelect.selectpicker({size:10});

	modelSelect.on('change', function(){
		partSelect.val('-1');
		reloadTable();
	});

	partSelect.on('change', function(){
		reloadTable();
	});

	deptSelect.on('change', function(){
		machineSelect.val('-1');
		workerSelect.val('-1');
		reloadTable();
	});

	machineSelect.on('change', function(){
		reloadTable();
	});

	workerSelect.on('change', function(){
		reloadTable();
	});

	table.find('.edit').on('click', edit);
	table.find('.save').on('click', save);

	removeButton.on('click', removeModel);
	resetButton.on('click', resetModel);
}

var removeModel = function(){
	var id = finishedModelsSelect.val();
	if(id == '-1'){
		alert('请先选择模具');
		return;
	}
	if(!confirm('确定移除该模具？')){
		return;
	}
	$.ajax({
		url: modelSystemURLHeader + '/Admin/removeModel',
		type:'POST',
		data:{'id':id},
		success: function(data){
			data = data.trim();
			if(data == 'success'){
				var op = finishedModelsSelect.find('option[value='+id+']');
				op.remove();
				finishedModelsSelect.selectpicker('refresh');
				alert('移除模具成功');
			}else{
				alert('移除模具失败，请稍后再试');
			}
		}
	});
}

var resetModel = function(){
	var id = finishedModelsSelect.val();
	if(id == '-1'){
		alert('请先选择模具');
		return;
	}
	if(!confirm('确定修改该模具状态为未完成？')){
		return;
	}
	$.ajax({
		url: modelSystemURLHeader + '/Admin/resetModel',
		type:'POST',
		data:{'id':id},
		success: function(data){
			data = data.trim();
			if(data == 'success'){
				var op = finishedModelsSelect.find('option[value='+id+']');
				op.remove();
				finishedModelsSelect.selectpicker('refresh');
				alert('修改成功');
			}else{
				alert('修改失败，请稍后再试');
			}
		}
	});
}

var reloadTable = function(){
	var modelId = modelSelect.val();
	var partId = partSelect.val();
	var deptId = deptSelect.val();
	var machineId = machineSelect.val();
	var workerId = workerSelect.val();

	location.href = modelSystemURLHeader + 'Admin/taskView/'+modelId+'/'+partId+'/'+deptId+'/'+machineId+'/'+workerId;
}

var edit = function(e){
	var target = $(e.target).parent().parent();
	target.find('input').attr('disabled', false);
	$(e.target).attr('disabled', 'disabled');
	target.find('.save').attr('disabled', false);
}

var save = function(e){
	var target = $(e.target).parent().parent();
	var id = target.attr('id');
	var s = /^\+?\d+(\.\d+)?$/;
	var lowPayedTime = target.find('.lowPayedTime').find('input').val();
	var highPayedTime = target.find('.highPayedTime').find('input').val();
	var machineTime = target.find('.machineTime').find('input').val();

	if(!lowPayedTime.match(s) || !highPayedTime.match(s) ||!machineTime.match(s)){
		alert('输入的工作时间必须是一个不小于零的数字');
		return;
	}
	$.ajax({
		url: modelSystemURLHeader + '/Admin/taskSave',
		type:'POST',
		data:{'id':id,'lowPayedTime':lowPayedTime,'highPayedTime':highPayedTime,'machineTime':machineTime},
		success: function(data){
			data = data.trim();
			if(data == 'success'){
				alert('保存成功');
				target.find('input').attr('disabled', 'disabled');
				$(e.target).attr('disabled', 'disabled');
				target.find('.edit').attr('disabled', false);
			}else{
				alert('系统错误请稍后再试');
			}
		}
	});
}