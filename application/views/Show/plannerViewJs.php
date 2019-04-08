<script>
	window.onload = function(){
		var initialTasks = JSON.parse('<?php echo $this->variables['tasks'] ?>');
		modelSystemPlanner(initialTasks);
	}
</script>