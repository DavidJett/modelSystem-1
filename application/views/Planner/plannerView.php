<?php
	$activeModels = json_decode($this->variables['activeModels'], true);
	$finishedModels = json_decode($this->variables['finishedModels'], true);
	$procedure = json_decode($this->variables['procedures'], true);
?>
<div class="model-system-container">
	<div class="operator-field">
		<button id="model-system-save-button" style="margin-right: 0px;">保存</button>
		<span id="save-wait" style="color: rgba(220,20,60,1);font-size: 12px;margin-left: 0px;"></span>
		<button id="model-system-machine-button" style="margin-right: 50px">查看机器状态</button>
		<select  class="selectpicker" data-live-search="true" id="finished-models">
			<?php
				echo '<option value="-1">选择要下载的模具</option>';
				foreach($finishedModels as $value) {
					echo '<option value="'.$value['id'].'">'.$value['code'].'</option>';
				}
			?>
		</select>
		<button id="download-button" style="margin: 0px 50px 0px 5px">下载模具报表</button>
		<select  class="selectpicker" data-live-search="true" id="active-models">
			<?php
				echo '<option value="-1">选择要结束的模具</option>';
				foreach($activeModels as $value) {
					echo '<option value="'.$value['id'].'">'.$value['code'].'</option>';
				}
			?>
		</select>
		<span id="finish-wait" style="color: rgba(220,20,60,1);font-size: 12px"></span>
		<button id="finish-button" style="margin: 0px 50px 0px 5px">结束模具</button>
		<button id="procedure-button">修改工序</button>
	</div>
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
	</div>
	<table id="model-system-table" class="model-system-table">
		<tr>
			<th>机台信息</th>
			<th>任务信息</th>
		</tr>
	</table>
</div>
<script src="<?php echo APP_URL ?>public/js/auto-complete/jquery.min.js"></script>
<script src="<?php echo APP_URL ?>public/js/menu/menu.js"></script>
<script src="<?php echo APP_URL ?>public/js/auto-complete/bootstrap.min.js"></script>
<script src="<?php echo APP_URL ?>public/js/auto-complete/bootstrap-select.js"></script>
<script src="<?php echo APP_URL ?>public/js/Planner/planner.js"></script>
