<div class="model-system-header">
	<h1>模具成本统计系统</h1>
	<?php
		if(isset($_SESSION['username'])){
			echo 
				'<div class="header-container">'.
				"<p class=\"current-user\">当前用户：<span class=\"current-name\">${_SESSION['username']}</span></p>".
				'<p id="download-report">导出</p>'.
				'<span class="report-wait"></span>'.
				'<span style="float:right;font-size:18px;margin:0px 2px;">下载缓存</span>'.
				'<input id="cache" style="float:right;margin-left:5px;" type="checkbox" checked="checked">'.
				'<input type="text" class="ui-datepicker-time" readonly/>'.
				'<div class="ui-datepicker-css">'.	
				    '<div class="ui-datepicker-quick">'.
				        '<p>常用日期</p>'.
				        '<div>'.
				            '<span class="ui-date-quick-button" symbol="previous day">昨天</span>'.
				            '<span class="ui-date-quick-button" symbol="previous week">上一周</span>'.
				            '<span class="ui-date-quick-button" symbol="previous month">上一月</span>'.
				        '</div>'.
				    '</div>'.
				    '<div class="ui-datepicker-choose">'.
				        '<p>自选日期</p>'.
				        '<div class="ui-datepicker-date">'.
				            '<input name="startDate" id="startDate" class="startDate" readonly type="text">'.
				           '~'.
				            '<input name="endDate" id="endDate" class="endDate" readonly type="text">'.
				        '</div>'.
				    '</div>'.
				'</div>'.
				'</div>';

		}
	?>
	<hr/>
</div>
<script>
	var modelSystemURLHeader = "<?php echo APP_URL ?>";
</script>