var worker;
var dept;
var table;
var searchField;
var addMemberButton;
var modelSystemMask;
var workerSelect;
var deptSelect;
var finishedModelsSelect;
var removeButton;
var resetButton;
var uploadButton;

var modelSystemRootWorker = function(_dept){
	dept = _dept;
	table = $('#table');
	finishedModelsSelect = $('#finished-models');
	removeButton = $('#remove-button');
	resetButton = $('#reset-button');
	searchButton = $('#search-button');
	addMemberButton = $('#add-button');
	uploadButton = $('#upload-button');
	searchField = $('#search-field');
	workerSelect = searchField.find('.worker');
	deptSelect = searchField.find('.dept');
	workerSelect.selectpicker({size:10});
	deptSelect.selectpicker({size:10});
	finishedModelsSelect.selectpicker({size:10});

	workerSelect.on('change', function(){
		deptSelect.selectpicker('val', '-1');
		if(workerSelect.val() == '-1'){
			reloadTable();
			return;
		}
		reloadTable('workerId', workerSelect.val());
	});
	deptSelect.on('change', function(){
		workerSelect.selectpicker('val', '-1');
		if(deptSelect.val() == '-1'){
			reloadTable();
			return;
		}
		reloadTable('deptId', deptSelect.val());
	});
	table.find('.edit').on('click', edit);
	table.find('.save').on('click', save);
	table.find('.remove').on('click', remove);
	addMemberButton.on('click', addMember);

	removeButton.on('click', removeModel);
	resetButton.on('click', resetModel);

	uploadButton.on('click', upload);
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
		url: modelSystemURLHeader + '/Root/removeModel',
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
		url: modelSystemURLHeader + '/Root/resetModel',
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
	if(type == 'workerId'){
		$.ajax({
			url: modelSystemURLHeader + '/Root/getWorkerById',
			type:'POST',
			data:{'id':val},
			success: function(data){
				data = JSON.parse(data.trim());
				addTr(data['id'],data['name'],data['lowWage'],data['highWage'],data['phoneNum'],data['deptId']);
			}
		});
	}else if(type == 'deptId'){
		$.ajax({
			url: modelSystemURLHeader + '/Root/getWorkerByDeptId',
			type:'POST',
			data:{'id':val},
			success: function(data){
				data = JSON.parse(data.trim());
				for(var i in data){
					addTr(data[i]['id'],data[i]['name'],data[i]['lowWage'],data[i]['highWage'],data[i]['phoneNum'],data[i]['deptId']);
				}
			}
		});
	}else{
		$.ajax({
			url: modelSystemURLHeader + '/Root/getWorker',
			type:'POST',
			data:{},
			success: function(data){
				data = JSON.parse(data.trim());
				for(var i in data){
					addTr(data[i]['id'],data[i]['name'],data[i]['lowWage'],data[i]['highWage'],data[i]['phoneNum'],data[i]['deptId']);
				}
			}
		});
	}
}

var addTr = function(id,name,lowWage,highWage,phoneNum,deptId){
	var tr = $('<tr id="'+id+'"></tr>');
	var tdId = $('<td class="id">'+id+'</td>');
	var tdName = $('<td class="name"><input disabled="disabled" value="'+name+'"/></td>');
	var tdLowWage = $('<td class="lowwage"><input disabled="disabled" value="'+lowWage+'"/></td>');
	var tdHighWage = $('<td class="highwage"><input disabled="disabled" value="'+highWage+'"/></td>');
	var tdPhoneNum = $('<td class="phonenum"><input disabled="disabled" value="'+phoneNum+'"/></td>');
	var tdDept = $('<td class="deptid"><select disabled="disabled"></select></td>');
	var select = tdDept.find('select');
	for(var j in dept){
		select.append('<option value="'+j+'">'+dept[j]+'</option>');
	}
	select.val(deptId);
	var tdOperate = $('<td><button class="edit">编辑</button><button disabled="disabled" class="save">保存</button><button class="remove">删除</button></td>')

	tr.append(tdId);
	tr.append(tdName);
	tr.append(tdLowWage);
	tr.append(tdHighWage);
	tr.append(tdPhoneNum);
	tr.append(tdDept);
	tr.append(tdOperate);
	table.append(tr);

	tdOperate.find('.edit').on('click', edit);
	tdOperate.find('.save').on('click', save);
	tdOperate.find('.remove').on('click', remove);
}

var edit = function(e){
	var target = $(e.target).parent().parent();
	var id = target.attr('id');
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
	var lowWage = target.find('.lowwage').find('input').val();
	var highWage = target.find('.highwage').find('input').val();
	var social = target.find('.social').find('input').val();
	var phoneNum = target.find('.phonenum').find('input').val();
	var deptId = target.find('.deptid').find('select').val();

	if(!lowWage.match(s) || !highWage.match(s) || !social.match(s)){
		alert('输入的工资和社保必须是一个不小于零的数字');
		return;
	}
	$.ajax({
		url: modelSystemURLHeader + '/Root/workerSave',
		type:'POST',
		data:{'id':id, 'name':name, 'lowWage':lowWage, 'highWage':highWage, 'social':social, 'phoneNum':phoneNum, 'deptId':deptId},
		success: function(data){
			data = data.trim();
			if(data == 'success'){
				alert('保存成功');
				target.find('input').attr('disabled', "disabled");
				target.find('select').attr('disabled', "disabled");
				$(e.target).attr('disabled', 'disabled');
				target.find('.edit').attr('disabled', false);
				if(workerSelect.val() != '-1'){
					reloadTable('workerId', workerSelect.val());
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
	if(confirm('确定要删除员工: '+id+"?")){
		$.ajax({
			url: modelSystemURLHeader + '/Root/workerRemove',
			type:'POST',
			data:{'id':id},
			success: function(data){
				data = data.trim();
				if(data == 'success'){
					alert('删除成功');
					target.remove();
				}else{
					alert('删除失败，请确认该员工的所有任务已经结束');
				}
			}
		});
	}
}

var addMember = function(){
	if(modelSystemMask)
		return;
	modelSystemMask = $('<div class="model-system-mask"><div>');
	$('body').append(modelSystemMask);
	var container = $('<div class="mask-container"></div>');
	modelSystemMask.append(container);

	var message = $('<p class="mask-text">请填写员工信息</p>');
	container.append(message);

	var idContainer = $('<div><p class="label">工号:</p></div>');
	var nameContainer = $('<div><p class="label">姓名:</p></div>');
	var lowWageContainer = $('<div><p class="label">非加班工资:</p></div>');
	var highWageContainer = $('<div><p class="label">加班工资:</p></div>');
	var socialContainer = $('<div><p class="label">社保:</p></div>');
	var phoneNumContainer = $('<div><p class="label">联系方式:</p></div>');
	var deptIdContainer = $('<div><p class="label">所属部门:</p></div>');

	var idInput = $('<input/>');
	var nameInput = $('<input/>');
	var lowWageInput = $('<input/>');
	var highWageInput = $('<input/>');
	var socialInput = $('<input/>');
	var phoneNumInput = $('<input/>');
	var deptIdSelect = $('<select></select>');

	idContainer.append(idInput);
	nameContainer.append(nameInput);
	lowWageContainer.append(lowWageInput);
	highWageContainer.append(highWageInput);
	socialContainer.append(socialInput);
	phoneNumContainer.append(phoneNumInput);
	deptIdContainer.append(deptIdSelect);

	for(var j in dept){
		deptIdSelect.append('<option value="'+j+'">'+dept[j]+'</option>');
	}
	var notice = $('<p class="mask-text"></p>');
	var checkButton = $('<button>确认</button>');
	var cancleButton = $('<button>取消</button>');

	container.append(idContainer);
	container.append(nameContainer);
	container.append(lowWageContainer);
	container.append(highWageContainer);
	container.append(socialContainer);
	container.append(phoneNumContainer);
	container.append(deptIdContainer);
	container.append(notice);
	container.append(checkButton);
	container.append(cancleButton);

	idInput.focus();

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
		var id = idInput.val();
		var name = nameInput.val();
		var lowWage = lowWageInput.val();
		var highWage = highWageInput.val();
		var social = socialInput.val();
		var phoneNum = phoneNumInput.val();
		var deptId = deptIdSelect.val();
		var s = /^\+?\d+(\.\d+)?$/;

		checkButton.attr('disabled', 'disabled');

		if(!lowWage.match(s) || !highWage.match(s) || !social.match(s)){
			notice.html('输入的工资或社保必须是一个不小于零的数字');
			checkButton.attr('disabled', false);
			return;
		}
		$.ajax({
			url: modelSystemURLHeader + '/Root/workerAdd',
			type:'POST',
			data:{'id':id, 'name':name, 'lowWage':lowWage, 'highWage':highWage, 'social':social, 'phoneNum':phoneNum, 'deptId':deptId},
			success: function(data){
				data = data.trim();
				if(data == 'success'){
					alert('添加成功');
					modelSystemMask.remove();
					modelSystemMask = null;
					checkButton.attr('disabled', false);
					location.reload(true);
				}else{
					alert('添加失败，请确认工号是否唯一');
					checkButton.attr('disabled', false);
				}
			}
		});
	});
}

var upload = function(){
	var input = $('#upload-input');
	if(!input.val()){
		return;
	}
	$('#upload-wait').html('请稍后...');
	uploadButton.attr('disabled', 'disabled');
	var formData = new FormData();
	formData.append('upload', 1);
	formData.append('upfile', input[0].files[0]);
	$.ajax({
		url: modelSystemURLHeader + '/Root/upload',
		type:'POST',
		processData: false,
		contentType: false,
		data:formData,
		success: function(data){
			data = data.trim();
			alert(data);		
			uploadButton.attr('disabled', false);
			$('#upload-wait').html('');
		}
	});
}