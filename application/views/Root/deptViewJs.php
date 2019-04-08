<script>
	window.onload = function(){
		var right = JSON.parse('<?php echo json_encode($this->variables['right'], JSON_UNESCAPED_UNICODE) ?>');
		modelSystemRootDept(right);
	}
</script>