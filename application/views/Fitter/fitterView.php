<div class="model-system-container">
	<p class="model-system-text">还未接受的任务(<span style="color:#1d29bb" id="refresh-pending-link">点此刷新</span>)</p>
	
	<table id="pending-table" class="model-system-table">
		<thead>
		<tr>
			<th>任务编号</th>
			<th>发布时间</th>
			<th>操作</th>
		</tr>
		</thead>
		<tbody>
		</tbody>
	</table>

	<p class="model-system-text">正在进行的任务(<span style="color:#1d29bb" id="refresh-running-link">点此刷新</span>)</p>
	<table id="running-table" class="model-system-table">
		<thead>
		<tr>
			<th>任务编号</th>
			<th>持续时间</th>
			<th>任务状态</th>
			<th>操作</th>
		</tr>
		</thead>
		<tbody>
		</tbody>
	</table>
</div>
<script src="<?php echo APP_URL ?>public/js/core.min.js"></script>
<script src="<?php echo APP_URL ?>public/js/Fitter/fitterView.js"></script>