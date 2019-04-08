<script>
	window.onload = function(){
		var dept = JSON.parse('<?php echo json_encode($this->variables['dept'], JSON_UNESCAPED_UNICODE) ?>');
		modelSystemRootMachine(dept);
	}
</script>