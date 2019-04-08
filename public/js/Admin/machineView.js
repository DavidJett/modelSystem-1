var machine;
var dept;
var table;
var searchField;
var addMachineButton;
var modelSystemMask;
var machineSelect;
var deptSelect;
var finishedModelsSelect;
var removeButton;
var resetButton;

var modelSystemAdminMachine = function(_dept){
	dept = _dept;
	table = $('#table');
	finishedModelsSelect = $('#finished-models');
	removeButton = $('#remove-button');
	resetButton = $('#reset-button');
	addMachineButton = $('#add-button');
	searchField = $('#search-field');
	machineSelect = searchField.find('.machine');
	deptSelect = searchField.find('.dept');
	machineSelect.selectpicker({size:10});
	deptSelect.selectpicker({size:10});
	finishedModelsSelect.selectpicker({size:10});

	machineSelect.on('change', function(){
		deptSelect.selectpicker('val', '-1');
		if(machineSelect.val() == '-1'){
			reloadTable();
			return;
		}
		var op = machineSelect.find('option:selected');
		reloadTable('code&name', [op.attr('code'), op.attr('name')]);
	});
	deptSelect.on('change', function(){
		machineSelect.selectpicker('val', '-1');
		if(deptSelect.val() == '-1'){
			reloadTable();
			return;
		}
		reloadTable('deptId', deptSelect.val());
	});
	table.find('.edit').on('click', edit);
	table.find('.save').on('click', save);
	table.find('.remove').on('click', remove);
	addMachineButton.on('click', addMachine);

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

var reloadTable = function(type, val){
	var tbody = table.find('tbody');
	tbody.empty();
	if(type == 'code&name'){
		$.ajax({
			url: modelSystemURLHeader + '/Admin/getMachineByCodeAndName',
			type:'POST',
			data:{'code':val[0],'name':val[1]},
			success: function(data){
				data = JSON.parse(data.trim());
				for(var i in data){
					addTr(data[i]['id'],data[i]['code'],data[i]['name'],data[i]['deptId'],data[i]['workType']);
				}
			}
		});
	}else if(type == 'deptId'){
		$.ajax({
			url: modelSystemURLHeader + '/Admin/getMachineByDeptId',
			type:'POST',
			data:{'id':val},
			success: function(data){
				data = JSON.parse(data.trim());
				console.log(data);
				for(var i in data){
					addTr(data[i]['id'],data[i]['code'],data[i]['name'],data[i]['deptId'],data[i]['workType']);
				}
			}
		});
	}else{
		$.ajax({
			url: modelSystemURLHeader + '/Admin/getMachine',
			type:'POST',
			data:{},
			success: function(data){
				data = JSON.parse(data.trim());
				for(var i in data){
					addTr(data[i]['id'],data[i]['code'],data[i]['name'],data[i]['deptId'],data[i]['workType']);
				}
			}
		});
	}
}

var addTr = function(id,code,name,deptId,workType){
	var tr = $('<tr id="'+id+'"></tr>');
	var tdCode = $('<td class="code">'+code+'</td>');
	var tdName = $('<td class="name"><input style="width:270px" disabled="disabled" value="'+name+'"/></td>');
	var tdWorkWay = $('<td class="workway"><select disabled="disabled"></select></td>');
	var tdDept = $('<td class="deptid"><select disabled="disabled"></select></td>');

	var select = tdWorkWay.find('select');
	select.append('<option value="0">8小时工作</option>');
	select.append('<option value="1">24小时工作</option>');
	select.val(workType);

	select = tdDept.find('select');
	for(var j in dept){
		select.append('<option value="'+j+'">'+dept[j]+'</option>');
	}
	select.val(deptId);
	var tdOperate = $('<td><button class="edit">编辑</button><button disabled="disabled" class="save">保存</button><button class="remove">删除</button></td>')

	tr.append(tdCode);
	tr.append(tdName);
	tr.append(tdWorkWay);
	tr.append(tdDept);
	tr.append(tdOperate);
	table.append(tr);

	tdOperate.find('.edit').on('click', edit);
	tdOperate.find('.save').on('click', save);
	tdOperate.find('.remove').on('click', remove);
}

var edit = function(e){
	var target = $(e.target).parent().parent();
	target.find('input').attr('disabled', false);
	target.find('select').attr('disabled', false);
	$(e.target).attr('disabled', 'disabled');
	target.find('.save').attr('disabled', false);
}

var save = function(e){
	var target = $(e.target).parent().parent();
	var id = target.attr('id');
	var s = /^\+?\d+(\.\d+)?$/;
	var name = target.find('.name').find('input').val();
	var workWay = target.find('.workway').find('select').val();
	var deptId = target.find('.deptid').find('select').val();

	$.ajax({
		url: modelSystemURLHeader + '/Admin/machineSave',
		type:'POST',
		data:{'id':id, 'name':name, 'workWay':workWay, 'deptId':deptId},
		success: function(data){
			data = data.trim();
			if(data == 'success'){
				alert('保存成功');
				target.find('input').attr('disabled', 'disabled');
				target.find('select').attr('disabled', 'disabled');
				$(e.target).attr('disabled', 'disabled');
				target.find('.edit').attr('disabled', false);
				if(machineSelect.val() != '-1'){
					var op = machineSelect.find('option:selected');
					reloadTable('code&name', [op.attr('code'), op.attr('name')]);
				}else if(deptSelect.val() != '-1'){
					reloadTable('deptId', deptSelect.val());
				}
			}else{
				alert('系统错误请稍后再试');
			}
		}
	});
}

var remove = function(e){
	var target = $(e.target).parent().parent();
	var id = target.attr('id');
	if(confirm('确定要删除机器: '+target.find('.code').html()+"?")){
		$.ajax({
			url: modelSystemURLHeader + '/Admin/machineRemove',
			type:'POST',
			data:{'id':id},
			success: function(data){
				data = data.trim();
				if(data == 'success'){
					alert('删除成功');
					target.remove();
				}else{
					alert('删除失败，请确认该机器的所有任务已经结束');
				}
			}
		});
	}
}

var addMachine = function(){
	if(modelSystemMask)
		return;
	modelSystemMask = $('<div class="model-system-mask"><div>');
	$('body').append(modelSystemMask);
	var container = $('<div class="mask-container"></div>');
	modelSystemMask.append(container);

	var message = $('<p class="mask-text">请填写机器信息</p>');
	container.append(message);

	var codeContainer = $('<div><p class="label">编号:</p></div>');
	var nameContainer = $('<div><p class="label">名称:</p></div>');
	var powerContainer = $('<div><p class="label">功率:</p></div>');
	var workWayContainer = $('<div><p class="label">工作方式:</p></div>');
	var deptIdContainer = $('<div><p class="label">所属部门:</p></div>');

	var codeInput = $('<input/>');
	var nameInput = $('<input/>');
	var powerInput = $('<input/>');
	var workWaySelect = $('<select></select>');
	workWaySelect.append('<option value="'+0+'">8小时工作</option>');
	workWaySelect.append('<option value="'+1+'">16小时工作</option>');
	workWaySelect.append('<option value="'+2+'">24小时工作</option>');
	var deptIdSelect = $('<select></select>');
	for(var j in dept){
		deptIdSelect.append('<option value="'+j+'">'+dept[j]+'</option>');
	}
	var notice = $('<p class="mask-text"></p>');
	var checkButton = $('<button>确认</button>');
	var cancleButton = $('<button>取消</button>');

	codeContainer.append(codeInput);
	nameContainer.append(nameInput);
	powerContainer.append(powerInput);
	workWayContainer.append(workWaySelect);
	deptIdContainer.append(deptIdSelect);

	container.append(codeContainer);
	container.append(nameContainer);
	container.append(powerContainer);
	container.append(workWayContainer);
	container.append(deptIdContainer);
	container.append(notice);
	container.append(checkButton);
	container.append(cancleButton);

	codeInput.focus();

	modelSystemMask[0].onkeydown=function(e){
		if(e.keyCode==13){
			checkButton.click();
		}
	}

	cancleButton.on('click', function(){
		modelSystemMask.remove();
		modelSystemMask = null;
	});

	checkButton.on('click', function(){
		var code = codeInput.val();
		var name = nameInput.val();
		var power = powerInput.val();
		var workWay = workWaySelect.val();
		var deptId = deptIdSelect.val();
		var s = /^\+?\d+(\.\d+)?$/;

		checkButton.attr('disabled', 'disabled');

		if(!power.match(s)){
			notice.html('输入的功率必须是一个不小于零的数字');
			checkButton.attr('disabled', false);
			return;
		}
		$.ajax({
			url: modelSystemURLHeader + '/Admin/machineAdd',
			type:'POST',
			data:{'code':code, 'name':name, 'power':power, 'workWay':workWay, 'deptId':deptId},
			success: function(data){
				data = data.trim();
				console.log(data);
				if(data == 'success'){
					alert('添加成功');
					modelSystemMask.remove();
					modelSystemMask = null;
					checkButton.attr('disabled', false);
					location.reload(true);
				}else{
					alert('添加失败，请稍后再试');
					checkButton.attr('disabled', false);
				}
			}
		});
	});
}