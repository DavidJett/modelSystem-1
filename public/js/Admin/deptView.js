 var table;
 var finishedModelsSelect;
 var removeButton;
 var resetButton;
 var addDeptButton;
 var right;
 var modelSystemMask;

 var modelSystemAdminDept = function(_right){
 	right = _right;
 	table = $('#table');
 	finishedModelsSelect = $('#finished-models');
	removeButton = $('#remove-button');
	resetButton = $('#reset-button');
	addDeptButton = $('#add-button');

	finishedModelsSelect.selectpicker({size:10});

	table.find('.edit').on('click', edit);
	table.find('.save').on('click', save);
	table.find('.remove').on('click', remove);
	addDeptButton.on('click', addDept);

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
	var name = target.find('.name').find('input').val();
	var isPlan = target.find('.isplan').find('select').val();
	var hasMachine = target.find('.hasmachine').find('select').val();
	var rightId = target.find('.rightid').find('select').val();

	if(!name){
		alert('输入的部门名不能为空！');
		return;
	}

	$.ajax({
		url: modelSystemURLHeader + '/Admin/deptSave',
		type:'POST',
		data:{'id':id, 'name':name, 'isPlan':isPlan, 'hasMachine':hasMachine, 'rightId':rightId},
		success: function(data){
			data = data.trim();
			if(data == 'success'){
				alert('保存成功');
				target.find('input').attr('disabled', 'disabled');
				target.find('select').attr('disabled', 'disabled');
				$(e.target).attr('disabled', 'disabled');
				target.find('.edit').attr('disabled', false);
			}else{
				alert('系统错误请稍后再试');
			}
		}
	});
}

var remove = function(e){
	var target = $(e.target).parent().parent();
	var id = target.attr('id');
	var name = target.find('.name').find('input').val();
	if(confirm('确定要删除部门: '+name+"?")){
		$.ajax({
			url: modelSystemURLHeader + '/Admin/deptRemove',
			type:'POST',
			data:{'id':id},
			success: function(data){
				data = data.trim();
				if(data == 'success'){
					alert('删除成功');
					target.remove();
				}else{
					alert('删除失败，还有机器或者员工属于这个部门');
				}
			}
		});
	}
}

var addDept = function(e){
	if(modelSystemMask)
		return;
	modelSystemMask = $('<div class="model-system-mask"><div>');
	$('body').append(modelSystemMask);
	var container = $('<div class="mask-container"></div>');
	modelSystemMask.append(container);
	var message = $('<p class="mask-text">请填写部门信息</p>');
	container.append(message);

	var nameContainer = $('<div><p class="label">名称:</p></div>');
	var isPlanContainer = $('<div><p class="label">是否用于计划:</p></div>');
	var hasMachineContainer = $('<div><p class="label">是否拥有机器:</p></div>');
	var rightContainer = $('<div><p class="label">权限:</p></div>');

	var nameInput = $('<input/>');
	var isPlanSelect = $('<select></select>');
	var hasMachineSelect = $('<select></select>');
	var rightSelect = $('<select></select>');
	var notice = $('<p class="mask-text"></p>');
	var checkButton = $('<button>确认</button>');
	var cancleButton = $('<button>取消</button>');

	isPlanSelect.append('<option value="'+1+'">是</option>');
	isPlanSelect.append('<option value="'+0+'">否</option>');
	hasMachineSelect.append('<option value="'+1+'">是</option>');
	hasMachineSelect.append('<option value="'+0+'">否</option>');
	for(var i in right){
		rightSelect.append('<option value="'+i+'">'+right[i]+'</option>');
	}

	nameContainer.append(nameInput);
	isPlanContainer.append(isPlanSelect);
	hasMachineContainer.append(hasMachineSelect);
	rightContainer.append(rightSelect);

	container.append(nameContainer);
	container.append(isPlanContainer);
	container.append(hasMachineContainer);
	container.append(rightContainer);
	container.append(notice);
	container.append(checkButton);
	container.append(cancleButton);

	nameInput.focus();

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
		var name = nameInput.val();
		var isPlan = isPlanSelect.val();
		var hasMachine = hasMachineSelect.val();
		var rightId = rightSelect.val();

		checkButton.attr('disabled', 'disabled');

		if(!name){
			notice.html('输入的部门名不能为空！');
			checkButton.attr('disabled', false);
			return;
		}
		$.ajax({
			url: modelSystemURLHeader + '/Admin/deptAdd',
			type:'POST',
			data:{'name':name, 'isPlan':isPlan, 'hasMachine':hasMachine, 'rightId':rightId},
			success: function(data){
				data = data.trim();
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