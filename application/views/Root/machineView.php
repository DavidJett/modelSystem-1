<?php
	$machine = $this->variables['machine'];
	$dept = $this->variables['dept'];
	$finishedModels = $this->variables['finishedModels'];
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
	<div style="text-align: left;margin: 0 auto;width:90%;">
		<div class="search" id="search-field">
			<select class="selectpicker machine" data-live-search="true">
				<?php
					echo "<option code=\"\" name=\"\" value=\"-1\">所有机器</option>";
					foreach ($machine as $value) {
						$code = $value['code'];
						$name = $value['name'];
						echo "<option code=\"$code\" name=\"$name\" value=\"${value['id']}\">$code($name)</option>";
					}
				?>
			</select>
			<select class="selectpicker dept" data-live-search="true">
				<?php
					echo "<option value=\"-1\">所有部门</option>";
					foreach ($dept as $key => $value) {
						echo "<option value=\"$key\">$value</option>";
					}
				?>
			</select>
			<button id="add-button">添加机器</button>
		</div>
		<table class="model-system-table" id="table">
			<thead>
			<tr>
				<th>机器编号</th>
				<th>机器名称</th>
				<th>月折旧</th>
				<th>功率</th>
				<th>工作方式</th>
				<th>所属部门</th>
				<th>操作</th>
			</tr>
			</thead>
			<tbody>
				<?php
					foreach ($machine as $key => $value) {
						echo "<tr id=\"${value['id']}\">";
						echo "<td class=\"code\">${value['code']}</td>";
						echo "<td class=\"name\"><input style=\"width:270px\"  disabled=\"disabled\" value=\"${value['name']}\"/></td>";
						echo "<td class=\"depreFee\"><input disabled=\"disabled\" value=\"${value['depreFee']}\"/></td>";
						echo "<td class=\"power\"><input disabled=\"disabled\" value=\"${value['power']}\"/></td>";
						echo "<td class=\"workway\"><select disabled=\"disabled\">";
						if($value['workType'] == '0'){
							echo "<option selected=\"selected\" value=\"0\">8小时工作</option>";
							echo "<option value=\"1\">16小时工作</option>";
							echo "<option value=\"2\">24小时工作</option>";
						}else if($value['workType'] == '1'){
							echo "<option value=\"0\">8小时工作</option>";
							echo "<option selected=\"selected\" value=\"1\">16小时工作</option>";
							echo "<option value=\"2\">24小时工作</option>";
						}else{
							echo "<option value=\"0\">8小时工作</option>";
							echo "<option value=\"1\">16小时工作</option>";
							echo "<option selected=\"selected\" value=\"2\">24小时工作</option>";
						}
						
						echo "</select></td>";
						echo "<td class=\"deptid\"><select disabled=\"disabled\">";
						foreach ($dept as $k => $val) {
							if($k == $value['deptId']){
								echo "<option selected = \"selected\" value=\"$k\">$val</option>";
							}else{
								echo "<option value=\"$k\">$val</option>";
							}
						}
						echo "</select></td>";
						echo "<td><button class=\"edit\">编辑</button><button disabled=\"disabled\" class=\"save\">保存</button><button class=\"remove\">删除</button></td>";
						echo '</tr>';
					}
				?>
			</tbody>
		</table>
	</div>
</div>
<script src="<?php echo APP_URL ?>public/js/auto-complete/jquery.min.js"></script>
<script src="<?php echo APP_URL ?>public/js/Root/machineView.js"></script>
<script src="<?php echo APP_URL ?>public/js/auto-complete/bootstrap.min.js"></script>
<script src="<?php echo APP_URL ?>public/js/auto-complete/bootstrap-select.js"></script>