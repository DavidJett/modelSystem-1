<?php
	$model = $this->variables['model'];
	$worker = $this->variables['worker'];
	$part = $this->variables['part'];
	$dept = $this->variables['dept'];
	$machine = $this->variables['machine'];
	$task = $this->variables['task'];
	$modelId = $this->variables['modelId'];
	$workerId = $this->variables['workerId'];
	$partId = $this->variables['partId'];
	$deptId = $this->variables['deptId'];
	$machineId = $this->variables['machineId'];
	$finishedModels = $this->variables['finishedModels'];
	if(!$modelId) $modelId = '-1';
	if(!$workerId) $workerId = '-1';
	if(!$partId) $partId = '-1';
	if(!$deptId) $deptId = '-1';
	if(!$machineId) $machineId = '-1';
?>
<div class="model-system-container">
	<button><a style="color: #fff;text-decoration:none" href="<?php echo APP_URL ?>Root/deptView">更改部门信息</a></button>
	<button><a style="color: #fff;text-decoration:none" href="<?php echo APP_URL ?>Root/workerView">更改员工信息</a></button>
	<button><a style="color: #fff;text-decoration:none" href="<?php echo APP_URL ?>Root/machineView">更改机器信息</a></button>
	<button style="margin-right: 65px"><a style="color: #fff;text-decoration:none;" href="<?php echo APP_URL ?>Root/taskView">更改任务信息</a></button>
	<select  class="selectpicker" data-live-search="true" id="finished-models">
		<?php
			echo '<option value="-1">请选择模具</option>';
			foreach($finishedModels as $value) {
				echo '<option value="'.$value['id'].'">'.$value['code'].'</option>';
			}
		?>
	</select>
	<button id="remove-button" style="margin-left:5px;margin-right:0px">移除模具</button>
	<button id="reset-button" style="margin-left:5px">重新开始模具</button>
	<div style="text-align: left;margin: 0 auto;width:100%;">
		<div class="search" id="search-field">
			<select class="selectpicker model" data-live-search="true">
			<?php
				echo "<option value=\"-1\">全部模具</option>";
				foreach ($model as $value) {
					if($value['id'] == $modelId){
						echo "<option selected=\"selected\" value=\"${value['id']}\">${value['code']}</option>";
					}else{
						echo "<option value=\"${value['id']}\">${value['code']}</option>";
					}
				}
			?>
			</select>

			<select class="selectpicker part" data-live-search="true">
			<?php
				echo "<option code=\"\" name=\"\" value=\"-1\">所有零件</option>";
				foreach ($part as $value) {
					$code = $value['code'];
					$name = $value['name'];
					if($value['id'] == $partId){
						echo "<option selected=\"selected\" code=\"$code\" name=\"$name\" value=\"${value['id']}\">$code($name)</option>";
					}else{
						echo "<option code=\"$code\" name=\"$name\" value=\"${value['id']}\">$code($name)</option>";
					}
				}
			?>
			</select>

			<select class="selectpicker dept" data-live-search="true">
			<?php
				echo "<option value=\"-1\">所有部门</option>";
				foreach ($dept as $key => $value) {
					if($key == $deptId){
						echo "<option selected=\"selected\" value=\"$key\">$value</option>";
					}else{
						echo "<option value=\"$key\">$value</option>";
					}
				}
			?>
			</select>

			<select class="selectpicker machine" data-live-search="true">
			<?php
				echo "<option code=\"\" name=\"\" value=\"-1\">所有机器</option>";
				foreach ($machine as $value) {
					$code = $value['code'];
					$name = $value['name'];
					if($value['id'] == $machineId){
						echo "<option selected=\"selected\" code=\"$code\" name=\"$name\" value=\"${value['id']}\">$code($name)</option>";
					}else{
						echo "<option code=\"$code\" name=\"$name\" value=\"${value['id']}\">$code($name)</option>";
					}
				}
			?>
			</select>

			<select class="selectpicker worker" data-live-search="true">
			<?php
				echo "<option value=\"-1\">所有员工</option>";
				foreach ($worker as $key => $value) {
					$id = $value['id'];
					$name = $value['name'];
					if($value['id'] == $workerId){
						echo "<option selected=\"selected\" value=\"$id\">$id($name)</option>";
					}else{
						echo "<option value=\"$id\">$id($name)</option>";
					}
				}
			?>
			</select>
		</div>

		<table class="model-system-table" id="table">
			<thead>
			<tr>
				<th>模号</th>
				<th>零件编号</th>
				<th>零件名</th>
				<th>工序名</th>
				<th>机器编号</th>
				<th>机器名</th>
				<th>员工编号</th>
				<th>员工姓名</th>
				<th>非加班时间</th>
				<th>加班时间</th>
				<th>机器时间</th>
				<th>任务状态</th>
				<th>操作</th>
			</tr>
			</thead>
			<tbody>
				<?php
					foreach ($task[0] as $value) {
						echo "<tr id=\"${value['taskId']}\">";
						echo "<td>${value['modelCode']}</td>";
						echo "<td>${value['partCode']}</td>";
						echo "<td>${value['partName']}</td>";
						echo "<td>${value['taskName']}</td>";
						echo "<td>${value['machineCode']}</td>";
						echo "<td>${value['machineName']}</td>";
						echo "<td>${value['userId']}</td>";
						echo "<td>${value['userName']}</td>";
						echo "<td class=\"lowPayedTime\"><input style=\"width:80px\" disabled=\"disabled\" value=\"${value['lowPayedTime']}\"/>小时</td>";
						echo "<td class=\"highPayedTime\"><input style=\"width:80px\" disabled=\"disabled\" value=\"${value['highPayedTime']}\"/>小时</td>";
						echo "<td class=\"machineTime\"><input style=\"width:80px\" disabled=\"disabled\" value=\"${value['machineTime']}\"/>小时</td>";
						if($value['isFinished'] == '1'){
							echo "<td style=\"color:#2ed611\">已完成</td>";
						}else{
							echo "<td style=\"color:#df1919\">正在加工</td>";
						}
						echo "<td><button class=\"edit\">编辑</button><button disabled=\"disabled\" class=\"save\">保存</button>";
						echo '</tr>';
					}
				?>
			</tbody>
		</table>
		<div class="change-page">
			<?php
				$now = intval($this->variables['pageId']);
				$mx = intval($task[1]);
				echo '<p>当前显示第'.($now+1).'页, 共'.$mx.'页</p>';
				$preAddr = APP_URL . "Root/taskView/$modelId/$partId/$deptId/$machineId/$workerId/".($now-1);
				$nxtAddr = APP_URL . "Root/taskView/$modelId/$partId/$deptId/$machineId/$workerId/".($now+1);
				if($now>0){
					echo "<a href=\"$preAddr\"><<前一页</a>";
				}else{
					echo "<a><<前一页</a>";
				}
				if($now+1<$mx){
					echo "<a href=\"$nxtAddr\">后一页>></a>";
				}else{
					echo "<a>后一页>></a>";
				}
			?>
		</div>
	</div>
</div>
<script src="<?php echo APP_URL ?>public/js/auto-complete/jquery.min.js"></script>
<script src="<?php echo APP_URL ?>public/js/Root/taskView.js"></script>
<script src="<?php echo APP_URL ?>public/js/auto-complete/bootstrap.min.js"></script>
<script src="<?php echo APP_URL ?>public/js/auto-complete/bootstrap-select.js"></script>