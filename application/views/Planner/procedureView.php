<?php
	$procedure = $this->variables['procedures'];
	$procedure = json_decode($procedure, true);
?>
<div class="model-system-container">
	<input id="procedure-input"/>
	<button id="procedure-add">添加</button>
	<table id="model-system-table" style="margin: 0px auto" class="model-system-table">
		<tr>
			<th>编号</th>
			<th>工序名称</th>
			<th>操作</th>
		</tr>
		<?php
			$index = 1;
			foreach ($procedure as $key => $value) {
				echo '<tr>';
				echo '<td style="text-align: center">'.($index++).'</td>';
				echo '<td style="text-align: center">'.$key.'</td>';
				echo '<td style="text-align: center"><button class="procedure-delete">删除</button></td>';
				echo '</tr>';
			}
		?>
	</table>
</div>
<script src="<?php echo APP_URL ?>public/js/core.min.js"></script>
<script src="<?php echo APP_URL ?>public/js/Planner/procedure.js"></script>