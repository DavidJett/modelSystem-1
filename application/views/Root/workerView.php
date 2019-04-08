<?php
	$worker = $this->variables['worker'];
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
			<select class="selectpicker worker" data-live-search="true">
				<?php
					echo "<option id=\"\" value=\"-1\">所有员工</option>";
					foreach ($worker as $key => $value) {
						$id = $value['id'];
						$name = $value['name'];
						echo "<option value=\"$id\">$id($name)</option>";
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
			<button id="add-button">添加员工</button>
			<input type="file" id="upload-input" accept=".xls,.xlsx" style="display: inline-block;margin-left: 50px;border: 2px solid rgba(214, 16, 86,1);"/>
			<span id="upload-wait" style="color: rgba(220,20,60,1);font-size: 12px"></span>
			<button id="upload-button">导入</button>
		</div>
		<table class="model-system-table" id="table">
			<thead>
			<tr>
				<th>员工编号</th>
				<th>员工姓名</th>
				<th>非加班工资</th>
				<th>加班工资</th>
				<th>社保</th>
				<th>联系方式</th>
				<th>所属部门</th>
				<th>操作</th>
			</tr>
			</thead>
			<tbody>
				<?php
					foreach ($worker as $value) {
						echo "<tr id=\"${value['id']}\">";
						echo "<td class=\"id\">${value['id']}</td>";
						echo "<td class=\"name\"><input disabled=\"disabled\" value=\"${value['name']}\"/></td>";
						echo "<td class=\"lowwage\"><input disabled=\"disabled\" value=\"${value['lowWage']}\"/></td>";
						echo "<td class=\"highwage\"><input disabled=\"disabled\" value=\"${value['highWage']}\"/></td>";
						echo "<td class=\"social\"><input disabled=\"disabled\" value=\"${value['social']}\"/></td>";
						echo "<td class=\"phonenum\"><input disabled=\"disabled\" value=\"${value['phoneNum']}\"/></td>";
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
<script src="<?php echo APP_URL ?>public/js/Root/workerView.js"></script>
<script src="<?php echo APP_URL ?>public/js/auto-complete/bootstrap.min.js"></script>
<script src="<?php echo APP_URL ?>public/js/auto-complete/bootstrap-select.js"></script>