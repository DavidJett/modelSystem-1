<?php
	$activeModels = json_decode($this->variables['activeModels'], true);
	$procedure = json_decode($this->variables['procedures'], true);
?>
<div class="model-system-container">
	<div class="search-field">
		<select  class="selectpicker" data-live-search="true" id="search-models">
			<?php
				echo '<option value="-1">所有模具</option>';
				foreach($activeModels as $value) {
					echo '<option value="'.$value['id'].'">'.$value['code'].'</option>';
				}
			?>
		</select>
		<select  class="selectpicker" data-live-search="true" id="search-parts">
			<option value="-1">所有零件</option>
		</select>
		<select  class="selectpicker" data-live-search="true" id="search-procedures">
			<?php
				echo '<option value="-1">所有工序</option>';
				foreach($procedure as $key=>$value) {
					echo '<option value="'.$key.'">'.$key.'</option>';
				}
			?>
		</select>
		<button id="search-button">查找下一个</button>
		<button id="model-system-machine-button" style="margin-right: 50px">查看机器状态</button>
	</div>
	<table id="model-system-table" class="model-system-table">
		<tr>
			<th>机台信息</th>
			<th>任务信息</th>
		</tr>
	</table>
</div>
<script src="<?php echo APP_URL ?>public/js/auto-complete/jquery.min.js"></script>
<script src="<?php echo APP_URL ?>public/js/auto-complete/bootstrap.min.js"></script>
<script src="<?php echo APP_URL ?>public/js/auto-complete/bootstrap-select.js"></script>
<script src="<?php echo APP_URL ?>public/js/Show/plannerView.js"></script>
