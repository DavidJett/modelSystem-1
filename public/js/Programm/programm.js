var modelMenuItems;
var typeMenuItems;
var initialModels;
var modelSystemProgramm=function(){
	var startButton=document.getElementById("start-button");
	$('#modelList').selectpicker({size:10});
	startButton.onclick=function(){
		var table=$('#model-system-table');
		var rows=table.find('tr');
		var selectList=document.getElementById("modelList");
		var modelId=selectList.options[selectList.selectedIndex].value;
		var modelCode=selectList.options[selectList.selectedIndex].text;
		$.ajax({
				url:modelSystemURLHeader+'/Programm/start',
				type:'POST',
				data:{'modelId':modelId},
				success: function(data){
					data=data.trim();
					if(data=='success'){
						alert('开始计时!');
						location.reload();
					}
					else if(data == 'current_unfinished'){
						alert('该项任务已开始计时，若之前忘记结束该项任务，请联系管理员结束或自行结束后，再去修改时间！');
					}
					else if(data=='success_other_unfinished')
					{
						alert('该项任务开始计时，但您仍存在其它任务尚未结束，请联系管理员结束或自行找到该任务结束！');
					}
					else if(data=='sqlfail_other_unfinished')
					{				
						alert('计时失败，请稍后重试！同时您还有其它任务未结束！');
					}
					else if(data=='sqlfail')
					{
						alert('计时失败，请稍后重试！');
					}
					else
					{
						alert('未知错误');
					}
				},
				error:function(data)
				{
					alert('计时失败，请稍后重试！');
				}
		});
	}

	var finishButton=document.getElementById("end-button");
	finishButton.onclick=function(){
	    var table=$('#model-system-table');
	    var rows=table.find('tr');
		var selectList=document.getElementById("modelList");
		var modelId=selectList.options[selectList.selectedIndex].value;
		$.ajax({
			    url:modelSystemURLHeader+'/Programm/terminate',
				type:'POST',
				data:{'modelId':modelId},
				success: function(data){
					data=data.trim();
					if(data=="success"){
						alert('计时结束！');
						location.reload();
					}
					else if(data=='finished')
						alert('该项任务已处于结束状态，无法再次结束或该任务不存在！');
					else
						alert('异常状态！');
				},
				error:function(data)
				{
					alert('操作失败，请重试！');
				}
		});
	}
}
