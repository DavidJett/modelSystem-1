<script>
	window.onload = function(){
		var members = JSON.parse('<?php echo $this->variables['members'] ?>');
		modelSystemFitter(members);	
	}
</script>