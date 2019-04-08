<?php
   $models = $this->variables['models'];
   $modelInfo=$this->variables['modelInfo'];
?>
<div class="model-system-container">
	<table id="model-system-table" class="model-system-table">
		<tr>
			<th>选择模具</th>
			<th>状态</th>
			<th>操作</th>
		</tr>
		<tr>
			<td>
				<select class="selectpicker" data-live-search="true" id="modelList" <?php echo $modelInfo!='Unlock'?'disabled="disabled"':'';?>>
					<?php
						foreach($models as $value){
							if($modelInfo!='Unlock'&&$modelInfo[0]==$value['id']){
								echo "<option selected=\"selected\" value=\"${value['id']}\">${value['code']}</option>";
							}else{
								echo "<option value=\"${value['id']}\">${value['code']}</option>";
							}
						}
					?>
				</select>
			</td>
			<td>
				<?php
					if($modelInfo!='Unlock'){
						echo '<p class="state-y">任务进行中</p>';
					}else{
						echo '<p class="state-n">暂无任务进行</p>';
					}
				?>
			</td>
			<td>
				<button id="start-button">开始计时</button>
				<button id="end-button">结束计时</button>
			</td>
		</tr>
	</table>
</div>
<script src="<?php echo APP_URL ?>public/js/auto-complete/jquery.min.js"></script>
<script src="<?php echo APP_URL ?>public/js/menu/menu.js"></script>
<script src="<?php echo APP_URL ?>public/js/Designer/designer.js"></script>
<script src="<?php echo APP_URL ?>public/js/auto-complete/bootstrap.min.js"></script>
<script src="<?php echo APP_URL ?>public/js/auto-complete/bootstrap-select.js"></script>