(function($){
	var cal = function(symbol){
		var res = [];
		var date = new Date();
		if(symbol == 'previous day'){
			date.setHours(0,0,0,0);
			res[0] = new Date(date.getTime() - 86400000);
			res[1] = res[0];
		}else if(symbol == 'previous week'){
			var week = date.getUTCDay();
			date.setHours(0,0,0,0);
			res[1] = new Date(date.getTime() - 86400000*((week+6)%7 + 1));
			res[0] = new Date(res[1].getTime() - 86400000*6);
		}else if(symbol == 'previous month'){
			date.setHours(0,0,0,0);
			date.setDate(1);
			res[1] = new Date(date.getTime() - 86400000);
			res[0] = new Date(date.getTime() - 86400000*(new Date(res[1].getFullYear(), res[1].getMonth()+1, 0)).getDate())
		}
		return res;
	}

	var init = function(){
		var startDate = $('.startDate');
		var endDate = $('.endDate');
		var container = $(".ui-datepicker-css");
		var dateRange = $(".ui-datepicker-time");
		var reportButton = $('#download-report');
		startDate.datepicker({
	       	dateFormat: "yy-mm-dd",
	        maxDate: "+d",
	        defaultDate: 0,
	        onClose : function(dateText, inst) {
	        	setTimeout(function(){
	        		if(container.css('display') == 'block'){
	        			endDate.datepicker("show");
	        		}
	        	}, 200);
	        },
			onSelect:function(dateText, inst) {
	            endDate.datepicker("option", "minDate", dateText);
	            dateRange.val(dateText + '~' + endDate.val());
	        }
	    });
	    endDate.datepicker({
	       	dateFormat: "yy-mm-dd",
	        maxDate: "+d",
	        Default: 0,
	        minDate: 0,
	        onSelect:function(dateText, inst) {
	            dateRange.val(startDate.val() + '~' + dateText);
	        }
	    });
	    startDate.datepicker("setDate", new Date());
	    endDate.datepicker("option", "minDate", new Date());
	    endDate.datepicker("setDate", new Date());
	    dateRange.val(startDate.val() + '~' + endDate.val());
		dateRange.on("click",function(e){
	       	container.css("display","block");
	       	container.css("position","absolute");
	       	container.offset({top:dateRange.offset().top + dateRange.height() +8, left:dateRange.offset().left});

	       	$(document).bind("click", function(e){
	    		container.css("display","none");
	    		startDate.datepicker("hide");
	    		endDate.datepicker("hide");
	    	});
	       	e.stopPropagation();
	    });
	    $(".ui-date-quick-button").on("click",function(e){
	    	var symbol = $(e.target).attr('symbol');
	    	var t = cal(symbol);
	    	startDate.datepicker("setDate", t[0]);
	    	endDate.datepicker("option", "minDate", t[0]);
	    	endDate.datepicker("setDate", t[1]);
	    	dateRange.val(startDate.val() + '~' + endDate.val());
	    	container.css("display","none");
	    	startDate.datepicker("hide");
	    	endDate.datepicker("hide");
	    });
	    container.on('click', function(e){
	    	e.stopPropagation();
	    });
	    $('#ui-datepicker-div').on('click', function(e){
	    	e.stopPropagation();
	    });

	    var report = function(e){
	    	$('.report-wait').html('请稍后...');
	    	reportButton.unbind("click");
	    	$.ajax({
	    		url: modelSystemURLHeader + 'Index/downloadReport/',
	    		type: 'POST',
	    		data: {'date':dateRange.val(), 'cache':$('#cache').is(':checked')},
	    		success: function(data){
	    			data = data.trim();
	    			$('.report-wait').html('');
					window.location = modelSystemURLHeader + 'Index/printReport/' + data;
					reportButton.on('click', report);
	    		}
	    	});
	    }

	    reportButton.on('click', report);
	    console.log($.data(reportButton, 'events'));
	}
    init();
})(jQuery);