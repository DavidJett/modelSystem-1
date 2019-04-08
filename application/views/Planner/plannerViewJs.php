<script>
	window.onload = function(){
		var initialTasks = JSON.parse('<?php echo $this->variables['tasks'] ?>');
		var activeModels = JSON.parse('<?php echo $this->variables['activeModels'] ?>');
		var depts = JSON.parse('<?php echo $this->variables['depts'] ?>');
		var procedure = JSON.parse('<?php echo $this->variables['procedures'] ?>');
		modelSystemPlanner(initialTasks, activeModels, depts, procedure);
	}
</script>