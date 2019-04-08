<?php
	$dept = $this->variables['dept'];
	$right = $this->variables['right'];
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
			<button id="add-button">添加部门</button>
		</div>
		<table class="model-system-table" id="table">
			<thead>
			<tr>
				<th>部门名称</th>
				<th>是否用于计划</th>
				<th>是否拥有机器</th>
				<th>权限</th>
				<th>操作</th>
			</tr>
			</thead>
			<tbody>
				<?php
					foreach ($dept as $key => $value) {
						echo "<tr id=\"${value['id']}\">";
						echo "<td class=\"name\"><input style=\"width:200px\" disabled=\"disabled\" value=\"${value['name']}\"/></td>";
						echo "<td class=\"isplan\"><select disabled=\"disabled\">";
						if($value['isPlan'] == '0'){
							echo "<option selected=\"selected\" value=\"0\">否</option>";
							echo "<option value=\"1\">是</option>";	
						}else{
							echo "<option value=\"0\">否</option>";
							echo "<option selected=\"selected\" value=\"1\">是</option>";
						}
						echo "</select></td>";
						echo "<td class=\"hasmachine\"><select disabled=\"disabled\">";
						if($value['hasMachine'] == '0'){
							echo "<option selected=\"selected\" value=\"0\">否</option>";
							echo "<option value=\"1\">是</option>";	
						}else{
							echo "<option value=\"0\">否</option>";
							echo "<option selected=\"selected\" value=\"1\">是</option>";
						}
						echo "</select></td>";
						echo "<td class=\"rightid\"><select disabled=\"disabled\">";
						foreach ($right as $k => $val) {
							if($k == $value['rightId']){
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
<script src="<?php echo APP_URL ?>public/js/Root/deptView.js"></script>
<script src="<?php echo APP_URL ?>public/js/auto-complete/bootstrap.min.js"></script>
<script src="<?php echo APP_URL ?>public/js/auto-complete/bootstrap-select.js"></script>