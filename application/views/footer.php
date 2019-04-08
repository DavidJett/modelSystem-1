	<script>

		$('.report').on('click', function(e){
			var target = $(e.target);
			target.find('.report-wait').html('请稍后...');
			$.ajax({
				url: target.attr('href'),
				type: 'POST',
				success: function(data){
					data = data.trim();
					target.find('.report-wait').html('');
					window.location = modelSystemURLHeader + 'Index/downloadReport/' + data;
				}
			});
		});
	</script>
	<script src="<?php echo APP_URL ?>public/js/date/jquery-ui-1.9.2.custom.js"></script>
	<script src="<?php echo APP_URL ?>public/js/date/date.js"></script>
    </body>
</html>