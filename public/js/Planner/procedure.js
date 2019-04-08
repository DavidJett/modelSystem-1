var modelSystemProcedure = function(){
	var addButton = $('#procedure-add');
	var procedureInput = $('#procedure-input');
	addButton.on('click', function(){
		$.ajax({
			url: modelSystemURLHeader + '/Planner/addProcedure',
			type:'POST',
			data:{'name': procedureInput.val()},
			success: function(data){
				data = data.trim();
				if(data == 'success'){
					alert('添加成功');
					location.reload(true);
				}else{
					alert('添加失败请稍后再试');
				}
			}
		});
	});

	$('.procedure-delete').on('click', function(e){
		$.ajax({
			url: modelSystemURLHeader + '/Planner/delProcedure',
			type:'POST',
			data:{'name': $(e.target).parent().prev().html()},
			success: function(data){
				data = data.trim();
				if(data == 'success'){
					alert('添加成功');
					location.reload(true);
				}else{
					alert('添加失败请稍后再试');
				}
			}
		});
	});
}