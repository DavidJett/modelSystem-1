<?php
	$data = $this->variables['data'];
?>
<div class="model-system-container">
	<table class="model-system-table">
		<tr>
			<th>机台信息</th>
			<th>加工的工序信息</th>
			<th>操作工信息</th>
			<th>时间信息</th>
		</tr>
		<tr>
			<td>
				<table class="inside-table">
					<tr>
						<th>机台编号</th>
						<th>机台名称</th>
						<th>机台状态</th>
						<th>所属部门</th>
					</tr>
					<?php
						foreach ($data as $value) {
							echo '<tr>';
							echo "<td>${value['machineCode']}</td>";
							echo "<td>${value['machineName']}</td>";
							if($value['state'] == '1')
								echo '<td style="color:#df1919">工作中</td>';
							else
								echo '<td style="color:#2ed611">空闲</td>';
							echo "<td>${value['deptName']}</td>";
							echo '</tr>';
						}
					?>
				</table>
			</td>
			<td>
				<table class="inside-table">
					<tr>
						<th>模号</th>
						<th>零件号</th>
						<th>零件名</th>
						<th>工序名</th>
					</tr>
					<?php
						foreach ($data as $value) {
							echo '<tr>';
							echo "<td>${value['modelCode']}</td>";
							echo "<td>${value['partCode']}</td>";
							echo "<td>${value['partName']}</td>";
							echo "<td>${value['taskName']}</td>";
							echo '</tr>';
						}
					?>
				</table>
			</td>
			<td>
				<table class="inside-table">
					<tr>
						<th>工人Id</th>
						<th>工人姓名</th>
					</tr>
					<?php
						foreach ($data as $value) {
							echo '<tr>';
							echo "<td>${value['userId']}</td>";
							echo "<td>${value['userName']}</td>";
							echo '</tr>';
						}
					?>
				</table>
			</td>
			<td>
				<table class="inside-table">
					<tr>
						<th>开始时间</th>
						<th>已持续时间</th>
					</tr>
					<?php
						foreach ($data as $value) {
							echo '<tr>';
							if(preg_match('/^[0-9]*$/', $value['startTime'])){
								echo '<td>'.date("Y-m-d H:i:s", intval($value['startTime'])).'</td>';
							}else{
								echo '<td>'.$value['startTime'].'</td>';
							}
							if(preg_match('/^[0-9]*$/', $value['totalTime'])){
								$m = intval($value['totalTime'] / 60);
								echo '<td>'.intval($m/60).'时'.($m%60).'分'.'</td>';
							}else{
								echo "<td>${value['totalTime']}</td>";
							}
							echo '</tr>';
						}
					?>
				</table>
			</td>
		</tr>
	</table>
</div>
<script src="<?php echo APP_URL ?>public/js/core.min.js"></script>
<script src="<?php echo APP_URL ?>public/js/Show/machineView.js"></script>