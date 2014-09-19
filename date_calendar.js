(function($) {
    $.fn.customcalendar = function(options) {
        var current_date = new Date();
        var months_arr = {"Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6, "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12};
        var quarters_arr = {"Q1": 1, "Q2": 2, "Q3": 3, "Q4": 4};
		var start_date = "";
		var end_date = "";

        // Default settings
        var settings = $.extend({
            field_id: null,
            no_of_select_months: 6,
            no_of_select_quarters: 4,
            no_of_select_years: 3,
            start_year: 1980,
            selected_filter: 'monthly',
            end_year: current_date.getFullYear(),
            onSelect: null,
            disable_date_greater_today: true,
			range_selection: false,
        }, options);

        var variance = (settings.field_id) ? $("#" + settings.field_id).val() : "";
//		var variance = "M:2012-05-01,2012-06-01,2012-07-01,2012-08-01,2012-09-01,2012-10-01";

        // Create options for month drop down
        var populate_month_options = function(default_selected) {
            var selected = "";
            // first remove if any added
            $(".cal-select-month option").remove();

            // create options on the basis of start and end year
            for (var i = parseInt(settings.end_year); i >= parseInt(settings.start_year); i--) {
                // Show current year
                selected = (i == current_date.getFullYear()) ? "selected" : "";
                var opt = $(".cal-select-month").append('<option ' + selected + ' value="' + i + '">' + i + '</option>');
                //$(".cal-select-month").append('<option value="'+(i-1)+'_'+i+'">'+(i-1)+' - '+i+'</option>');
            }
        }

        // Create options for quarter drop down
        var populate_quarter_options = function(default_selected) {
            var selected = "";
            // first remove if any added
            $(".cal-select-quarter option").remove();
            // create options on the basis of start and end year
            for (var i = current_date.getFullYear(); i >= parseInt(settings.start_year); i = i - 3) {
                // Show current year
                selected = (i == current_date.getFullYear()) ? "selected" : "";
                var opt = $(".cal-select-quarter").append('<option ' + selected + ' value="' + i + '">' + i + '</option>');
            }
        }

        // Create options for year drop down
        var populate_years_options = function(default_selected) {
            var selected = "";
            var current_year = current_date.getFullYear();

            //for(var i = current_year; i > parseInt(current_year) - year_diff ; i = i - 5){
            for (var i = current_year; i > settings.start_year; i = i - 5) {
                // Show current year
                selected = (i == current_date.getFullYear()) ? "selected" : "";
                var opt = $(".cal-select-year").append('<option ' + selected + ' value="' + i + '">' + i + '</option>');
            }

        }

        var create_month_layout = function(year) {
            var months_html = '';
            var selected = "";
            var selected_month_arr = new Array();
            var month = "";
			// show date selected, 
			var sdt = "";
            // check, months are selected previously
            if (variance != "" && variance.split(':')[0] == "M") {
                selected_month_arr = variance.split(':')[1].split(',');
            }
            var vclass = "";
            $.each(months_arr, function(i, v) {
                month = months_arr[i];
                // disable months on the basis of no_of_select_months
                if (settings.start_year == year && month < settings.no_of_select_months) {
                    vclass = "disabled";
                } else {
                    vclass = "cal-body-box";
                }

                if (month < 10)
                    month = "0" + month;

                selected = ($.inArray(year + "-" + month + "-01", selected_month_arr) != -1) ? "selected" : "";
				if(start_date != "" || end_date != ""){
					sdt = year+"-"+month+"-01";
				}
				selected += (sdt != "" && (start_date == sdt || end_date == sdt)) ? " selected" : "";
                months_html += '<div class="' + vclass + ' y_' + year + ' ' + selected + '">' + i + '</div>';
            });
            $("#cal-month").html(months_html);

        }

        var create_quarter_layout = function(year) {

            // create year options within calendar
            st_year = parseInt(year) - 3;
            en_year = parseInt(year);

            var selected_quarter_arr = new Array();
            var sel_cls = "";
            var quarter_html = "";

            // check, year is selected previously
            if (variance != "" && variance.split(':')[0] == "Q") {
                selected_quarter_arr = variance.split(':')[1].split(',');
            }

            $("#cal-quarter").html('');
            var vclass = "";
            for (i = st_year; i <= en_year; i++) {


                vclass = "cal-body-box-sml";
                
                quarter_html += '<div class="row">';
                quarter_html += '<div class="cal-body-quarter-header">' + i + '</div>';
                sel_cls = ($.inArray(i + "-01-01", selected_quarter_arr) != -1) ? "selected" : "";
                quarter_html += '<div class="' + vclass + ' y_' + i + ' ' + sel_cls + '">Q1</div>';
                sel_cls = ($.inArray(i + "-04-01", selected_quarter_arr) != -1) ? "selected" : "";
                quarter_html += '<div class="' + vclass + ' y_' + i + ' ' + sel_cls + '">Q2</div>';
                sel_cls = ($.inArray(i + "-07-01", selected_quarter_arr) != -1) ? "selected" : "";
                quarter_html += '<div class="' + vclass + ' y_' + i + ' ' + sel_cls + '">Q3</div>';
                sel_cls = ($.inArray(i + "-10-01", selected_quarter_arr) != -1) ? "selected" : "";
                quarter_html += '<div class="' + vclass + ' y_' + i + ' ' + sel_cls + '">Q4</div>';
                quarter_html += '</div>';

            }

            $("#cal-quarter").html(quarter_html);

        }

        var create_year_layout = function(year) {
            var selected_year_arr = new Array();
            var sel_cls = "";
            var starting_year = settings.start_year;
			var disabled_years = settings.no_of_select_years;

            // create year options within calendar
            st_year = parseInt(year) - 6;
            en_year = parseInt(year) + 6;

            // check, year is selected previously
            if (variance != "" && variance.split(':')[0] == "Y") {
                selected_year_arr = variance.split(':')[1].split(',');
            }

            var year_html = "";
            for(i = st_year; i < en_year; i++){
				sel_cls = ($.inArray(i+"-01-01",selected_year_arr) != -1 ) ? "selected" : "";
				--disabled_years;
				if(i < starting_year && settings.range_selection == true){
					year_html += '<div class=" disabled '+sel_cls+'">'+i+'</div>';
				}else if(i < starting_year && disabled_years > 0 && settings.range_selection == false){
					year_html += '<div class=" disabled '+sel_cls+'">'+i+'</div>';
				}else{
					year_html += '<div class="cal-body-box '+sel_cls+'">'+i+'</div>';
				}
			}

            $("#cal-year").html(year_html);

        }


        var set_calendar_config = function(select_year) {

            if (!select_year) {
                select_year = current_date.getFullYear() + "";
            }

            // create calendar filters layouts (months, quarters, years)
            // show respective calendar
            // add class to selected filter 

            // remove all activated classes first
            $(".cal-select-sec select").removeClass("activated");
            $(".cal-select-sec select").hide();

            switch (settings.selected_filter) {
                case "monthly":
                    create_month_layout(select_year);
                    $("#cal-month").show();
                    $(".cal-select-month").addClass("activated").show();

                    $(".select_value").text($(".activated").val());

                    break;
                case "quarterly":
                    create_quarter_layout(select_year);
                    $("#cal-quarter").show();
                    $(".cal-select-quarter").addClass("activated").show();
                    $(".select_value").text($(".activated").val());
                    break;
                case "yearly":
                    create_year_layout(select_year);
                    $("#cal-year").show();
                    $(".cal-select-year").addClass("activated").show();
                    $(".select_value").text($(".activated").val());
                    break;
            }
            if (settings.disable_date_greater_today == true) {
                add_disable();
            }

        }

        var select_quarters = function(year, jqObjText) {
			var last_date_selected = "";
			var no_of_select_quarters = settings.no_of_select_quarters;
			var cr_var_str = "";
			
			// create date string
			last_date_selected = create_date(jqObjText, year); 
			last_date_selected = last_date_selected.replace(/-/gi,",");
			
			var dt = "";
			var mth = "";
			// create date range for selected quarters
			for(var i = 0; i < no_of_select_quarters; i++){
				dt = new Date(last_date_selected);
				dt.setMonth(dt.getMonth() - i * 3);
				mth = dt.getMonth() + 1;
				mth = (mth < 10) ? "0"+mth : mth;
				
				cr_var_str += dt.getFullYear()+"-"+mth+"-01,";
			}
			cr_var_str = cr_var_str.substr(0, cr_var_str.length - 1);
			cr_var_str = cr_var_str.split(',');
			cr_var_str = cr_var_str.reverse();
			cr_var_str = cr_var_str.toString();
			
			variance = "Q:"+cr_var_str+",";
            if (settings.field_id != null && document.getElementById(settings.field_id)) {
                document.getElementById(settings.field_id).value = variance.substr(0, variance.length - 1);
            }
			
			fn_select_filter_onload("cal-select-quarter");
			
		/*
            var total_count = settings.no_of_select_quarters;
            var prev_row = "";

            // select quarters in current row
            $("." + year + "").reverse().each(function(i, v) {
                if ($(this).text().split('Q') <= jqObj.text().split('Q')) {
                    $(this).addClass("selected");
                    total_count--;

                }
                if (total_count <= 0) {
                    return false;
                }
            });
            if (total_count > 0) {

                prev_row = $("." + year + "").closest('div.row').prev();
                if (prev_row.attr('class') == 'row') {
                    // Select quarters in previous row
//				$("."+year+"").closest('.row').prev('.row').find('.cal-body-box-sml').reverse().each(function(){
                    $("." + year + "").closest('.row').prev('.row').find('div').reverse().each(function() {
                        if (total_count > 0) {
                            $(this).addClass('selected');
                            total_count--;
                        }
                    });

                } else {
                    selected_year = $(".activated option:selected").next().val();
                    if (selected_year) {
                        $(".activated").val(selected_year);
                        set_calendar_config(selected_year);
                        select_quarters(year, jqObj);
                    }
                }

            }
*/
			

        }

        var select_years = function(selected_year) {
            var start_year = selected_year - settings.no_of_select_years;
            var end_year = selected_year;
            var render_new_layout = false;

            // check if selected year index is less than 2
            $("#cal-year").find(".cal-body-box").each(function(i, o) {
                if ($(this).text() == selected_year && i < 3) {
                    render_new_layout = true;
                    return;
                }
            });

            // render new layout for years
            if (render_new_layout) {
                selected_year = $(".activated option:selected").next().val();
                if (selected_year) {
                    $(".activated").val(selected_year);
                    set_calendar_config(selected_year);
                }
            }

            $("#cal-year").find(".cal-body-box").removeClass("selected");

            // select years
            $("#cal-year").find("div").each(function(i, o) {
                if ($(this).text() * 1 > start_year && $(this).text() * 1 <= end_year) {
                    $(this).addClass('selected');
                }
            });

        }

        var select_months = function(year, month_text) {

            $(".activated").val(year);
            set_calendar_config(year);
            // line added to remove class 'selected'
//			$("#cal-month").find(".cal-body-box").removeClass("selected");					
            $("#cal-month").find("div").removeClass("selected");

            var start_index = months_arr[month_text] - settings.no_of_select_months;

            $("#cal-month .y_" + year).slice(start_index, (start_index + settings.no_of_select_months)).addClass('selected');

        }

        var save_selection = function() {
            variance = "";
            switch (settings.selected_filter) {
                case "yearly":
                    variance = "Y";
                    break;
                case "monthly":
                    variance = "M";
                    break;
                case "quarterly":
                    variance = "Q";
                    break;
            }
            var cal_date = "";
            var year = "";
            var month = "";
            // get selection
            $(".selected").each(function() {
                year = $(this).attr("class").split(" ")[1];
                if (year != "selected") {
                    year = year.split('_')[1];

                } else {
                    year = $(this).text();
                }

                if (variance == "M") {

                    month = months_arr[$(this).text()];
                    if (month < 10)
                        month = "0" + month
                    cal_date += year + "-" + month + "-01,";
                }

                if (variance == "Q") {
                    switch ($(this).text()) {
                        case "Q1":
                            month = "01";
                            break;
                        case "Q2":
                            month = "04";
                            break;
                        case "Q3":
                            month = "07";
                            break;
                        case "Q4":
                            month = "10";
                            break;
                    }
                    cal_date += year + "-" + month + "-01,";
                }

                if (variance == "Y") {
                    if (year) {
                        cal_date += year + "-01-01,";
                    }

                }
            });

            variance = variance + ":" + cal_date;

            if (settings.field_id != null && document.getElementById(settings.field_id)) {
                document.getElementById(settings.field_id).value = variance.substr(0, variance.length - 1);
            }

        }

        var add_disable = function() {

            var crr_year = current_date.getFullYear();
            var crr_month = current_date.getMonth();
            var selected_filter = $(".cal-label-sel").text().toLowerCase();
            var crr_quarter = "";
            var st_year = "";

            if (selected_filter == "yearly") {

                $(".cal-body-year").find("div").each(function(i, obj) {
                    if ($(this).text() * 1 >= crr_year) {
                        $(this).removeClass('cal-body-box');
                        $(this).addClass('disabled');
                    }

                });

            } else {

                if (crr_month > 0 && crr_month <= 3) {
                    crr_quarter = 1;
                } else if (crr_month > 3 && crr_month <= 6) {
                    crr_quarter = 2;
                } else if (crr_month > 6 && crr_month <= 10) {
                    crr_quarter = 3;
                } else if (crr_month > 10) {
                    crr_quarter = 4;
                }

                // loop through current year boxes in calendar
                $(".y_" + crr_year).each(function(i, obj) {
                    if (selected_filter == "monthly") {
                        // month
                        if (i >= crr_month) {
                            $(this).removeClass('cal-body-box');
                            $(this).addClass('disabled');
                        }
                    } else if (selected_filter == "quarterly") {
                        if (crr_quarter && crr_quarter * 1 <= quarters_arr[$(this).text()] * 1) {
                            $(this).removeClass('cal-body-box-sml');
                            $(this).addClass('disabled-sml');
                        }
                    }

                });

                // loop through start year and disable quarter on the basis of no_of_select_quarters
                if (selected_filter == "quarterly") {
                    st_year = parseInt(settings.start_year) - 1;
                }
                $(".y_" + st_year).each(function(i, obj) {

                    if (selected_filter == "quarterly") {
                        if (settings.no_of_select_quarters >= quarters_arr[$(this).text()] * 1) {
                            $(this).removeClass('cal-body-box-sml');
                            $(this).addClass('disabled-sml');
                        }
                    }

                });


            }

        }

        var show_selection = function(jqObj) {

            switch (settings.selected_filter) {
                case "monthly":
                    var get_year = jqObj.attr('class').split(' ')[1];
                    get_year = get_year.split('_')[1] * 1;

                    // If selected month is Dec or less than Dec upto Jul
                    if (months_arr[jqObj.text()] >= settings.no_of_select_months && months_arr[jqObj.text()] <= 11) {

                        select_months(get_year, jqObj.text());
                        save_selection();
                    } else {
                        // If selected month is Jan or greater than Jan upto Jun

                        var start_index = Math.abs(months_arr[jqObj.text()] - settings.no_of_select_months);
                        // push start and end selection of months
                        var start_year = --get_year;
                        var end_year = ++get_year;
                        var month = "";

                        variance = "M:";
                        for (var i = 12 - start_index; i <= 12; i++) {
                            if (i < 10) {
                                month = "0" + i;
                            } else {
                                month = i;
                            }
                            variance += start_year + "-" + month + "-01,";
                        }


                        for (var i = 0; i < months_arr[jqObj.text()]; i++) {
                            if (i < 10) {
                                month = "0" + (i + 1);
                            } else {
                                month = i;
                            }
                            variance += end_year + "-" + month + "-01,";
                        }

                        // save selection
                        if (settings.field_id != null && document.getElementById(settings.field_id)) {
                            document.getElementById(settings.field_id).value = variance.substr(0, variance.length - 1);
                        }

                        $(".activated").val(start_year);
                        set_calendar_config(start_year);
                    }

                    break;
                case "quarterly":
                    var get_year = jqObj.attr('class').split(' ')[1];
					select_quarters(get_year,jqObj.text());
                    //save_selection();

                    break;
                case "yearly":
                    select_years(jqObj.text());
                    save_selection();

                    break;
            }



        }


        var fn_select_filter_onload = function(vclass) {
            var filter = variance.split(':')[0];
            var vsstart_year = "";
            var vend_year = "";
            var sel_year = "";
            var vranges = variance.split(':')[1];
            var vranges = vranges.split(',');
            var vdt = vranges[0].substr(0, 4);
            $("." + vclass + " option:selected").removeAttr('selected');
            $("." + vclass + " option").reverse().each(function(i, o) {
                if (filter == 'Y') {
                    vsstart_year = $(o).text() - 6;
                    vend_year = $(o).text() + 6;
                } else if (filter == 'Q') {
                    vsstart_year = $(o).text() - 3;
                    vend_year = $(o).text();
                } else if (filter == 'M') {
                    vsstart_year = vend_year = $(o).text();
                }

                if (vdt >= vsstart_year && vdt <= vend_year) {
                    sel_year = $(o).text();
                    $(o).attr('selected', 'selected');
                    return false;
                }
            });
            set_calendar_config(sel_year);
        }


        // click event
        this.on('click.' + this.attr('class'), function() {
            var pos = $(this).offset();
            if (settings.disable_date_greater_today == true) {
                add_disable();
            }
            $(".calendar_container").css({'position': 'absolute', 'top': pos.top + 40, 'left': pos.left - 237}).show();
        });


		var create_date = function(sText, sClass){
			var year = "";
			var month = "";
			var sDate = "";
			switch(settings.selected_filter){
				case "monthly":
					year = sClass.split("y_")[1];	
					month = months_arr[sText];
					break;
				case "quarterly":
					year = sClass.split("y_")[1];
					if(sText == "Q1"){
						month = "01";
					}else if(sText == "Q2"){
						month = "04";
					}else if(sText == "Q3"){
						month = "07";
					}else{
						month = "10";
					}
					break;	
				case "yearly":
					year = sText;
					month = "01";
					break;	
			}
			year = year.replace(/ /gi,'');
			month = (month * 1 < 10)? "0"+ month * 1 : month;
			return sDate = year+"-"+month+"-01";
		}
		
		// Passing params should be string in format (YYYY-MM-DD)
		// third param possible value (month, year, date, second, millisecond)
		// Note: +1 added in return result to synchronize the date range
		var date_difference = function(start, end, retType){
			// create date objects
			var s = new Date(start.replace(/-/gi, ','));
			var e = new Date(end.replace(/-/gi, ','));
			var diffY, diffM, diffD, diffS, diffMS, diffQ;
			var retDate = "";
			
			diffM = function(start, end){
				var d1Y = start.getFullYear();
				var d2Y = end.getFullYear();
				var d1M = start.getMonth();
				var d2M = end.getMonth();

				return (d2M+12*d2Y)-(d1M+12*d1Y) + 1;
			}
			
			diffY = function(start, end){
				return end.getFullYear()-start.getFullYear() + 1;
			}
			
			diffQ = function(start, end){
				var d1Y = start.getFullYear();
				var d2Y = end.getFullYear();
				var d1M = start.getMonth();
				var d2M = end.getMonth();

				return Math.ceil(((d2M+12*d2Y)-(d1M+12*d1Y)) / 3) + 1;
				
			}
			
			diffD = function(start, end){
				var t2 = end.getTime();
				var t1 = start.getTime();
		 
				return parseInt((t2-t1)/(24*3600*1000));
			}
			
			switch(retType){
				case "months":
					retDate = diffM(s, e);
					break;
				case "years":
					retDate = diffY(s,e);
					break;
				case "days":
					retDate = diffD(s,e);
					break;
				case "quarters":
					retDate = diffQ(s,e);
					break;	
					
			}
			
			return retDate;
		}
		
		var create_date_range = function(start, date){
			var sDate = "";
			var loopCount = 0;
			var y,m,dt;
			switch(settings.selected_filter){
				case "monthly":
					sDate = "M:";
					loopCount = date_difference(start, date, "months");
					//console.log("Month Diff : "+loopCount);
					// Start loop from 0, to add start date in the date range
					for(var i = 0; i < loopCount; i++){
						dt = new Date(start);
						dt.setMonth(dt.getMonth() * 1 + i);
						y = dt.getFullYear();
						m = dt.getMonth() * 1 + 1;
						if(m < 10)	
							m = "0"+m;
							
						sDate += y+"-"+m+"-01,";
					}
					//console.log("Months Range : "+sDate);
					break;
				case "quarterly":
					sDate = "Q:";
					loopCount = date_difference(start, date, "quarters");
					// Start loop from 0, to add start date in the date range
					for(var i = 0; i < loopCount; i++){
						dt = new Date(start);
						dt.setMonth(dt.getMonth() * 1 + i * 3);
						y = dt.getFullYear();
						m = dt.getMonth() * 1 + 1;
						if(m < 10)	
							m = "0"+m;
							
						sDate += y+"-"+m+"-01,";
					}
					break;
				case "yearly":
					sDate = "Y:";
					loopCount = date_difference(start, date, "years");
					// Start loop from 0, to add start date in the date range
					for(var i = 0; i < loopCount; i++){
						dt = new Date(start);
						dt.setMonth(dt.getMonth() * 1 + i * 12);
						y = dt.getFullYear();
							
						sDate += y+"-01-01,";
					}
					break;			
			}
			
			return sDate;
		}
		
		var select_date_range = function(oSelectDate){
			var dateDiff = 0;
			variance = "";
			
			if(start_date == "" && end_date == ""){
                                // if already selected (months, quarter, years)
                                $(".cal-body").find("div.selected").removeClass("selected");
                                
				start_date = create_date($(oSelectDate).text(), $(oSelectDate).attr("class"));
				$(".choose_date_notice").html("Pick End Date");
				// Add selected class to dates
				$(oSelectDate).addClass("selected");
			}
			else if(end_date == "" && start_date != ""){
				end_date = create_date($(oSelectDate).text(), $(oSelectDate).attr("class"));
				// check for date difference
				$(".choose_date_notice").html("Pick Start Date");
				$(".choose_date_notice").hide();
				
				// Add selected class to dates
				$(oSelectDate).addClass("selected");
			}
			
			var sDate = new Date(start_date.replace(/-/gi,','));
			var eDate = new Date(end_date.replace(/-/gi,','));
			var dateDiff = eDate - sDate;
			if(dateDiff < 0 ){
				alert('Start date should be greater than End date');
				$(".choose_date_notice").html("Pick End Date");
				$(oSelectDate).removeClass("selected");
				end_date = "";
				return;
			}
			
			if(start_date != "" && end_date != ""){
			
				// check for date range
				switch(settings.selected_filter){
					case "monthly":
						dateDiff = date_difference(start_date, end_date, "months");
						if(dateDiff > settings.no_of_select_months ){
							alert('No more than '+settings.no_of_select_months+' months can be selected');
							$(".choose_date_notice").html("Pick End Date");
							$(oSelectDate).removeClass("selected");
							end_date = "";
							return;
						}	
						// Valid date range is selected. Create date variance from the selected range;
						variance = create_date_range(start_date, end_date);
						
						break;
					case "quarterly":
						dateDiff = date_difference(start_date, end_date, "quarters");
						if(dateDiff > settings.no_of_select_quarters ){
							alert('No more than '+settings.no_of_select_quarters+' quarters can be selected');
							$(".choose_date_notice").html("Pick End Date");
							$(oSelectDate).removeClass("selected");
							end_date = "";
							return;
						}
						
						// Valid date range is selected. Create date variance from the selected range;
						variance = create_date_range(start_date, end_date);
						
						break;
					case "yearly":
						dateDiff = date_difference(start_date, end_date, "years");
						
						if(dateDiff > settings.no_of_select_years ){
							alert('No more than '+settings.no_of_select_years+' years can be selected');
							$(".choose_date_notice").html("Pick End Date");
							$(oSelectDate).removeClass("selected");
							end_date = "";
							return;
						}
						
						// Valid date range is selected. Create date variance from the selected range;
						variance = create_date_range(start_date, end_date);
						
						break;
				}
			
			
				set_calendar_config($(".activated").val());	
			}	
			
			if(settings.field_id != null && document.getElementById(settings.field_id)){
				document.getElementById(settings.field_id).value = variance.substr(0,variance.length -1);
			}
			
		}
		
		
        return this.each(function() {
			// show pick date string
			if(settings.range_selection == true){
				$(".choose_date_notice").show();
			}
		
            // create months, quarter and years options in respective dropdowns
            populate_month_options();
            populate_quarter_options();
            populate_years_options();

            // label click event listener
            $(".cal-label").click(function() {
                $(".cal-label").removeClass("cal-label-sel");
                settings.selected_filter = $(this).text().toLowerCase();
                $(this).addClass("cal-label-sel");
                $("div.cal-body div").hide();

                set_calendar_config();
                if(settings.range_selection == true){
                    $(".choose_date_notice").show();		
                }
		
                start_date = "";
                end_date = "";

            });

            // Next Previous button actions
            $(".cal-next-btn").click(function(e) {
                e.preventDefault();
                //next_prev_btn('next');
                selected_year = $(".activated option:selected").prev().val();
                if (selected_year) {
                    $(".activated").val(selected_year);
                    set_calendar_config(selected_year);
                }
                throw "dont click again!";
            });

            $(".cal-prev-btn").click(function(e) {
                e.preventDefault();
                //next_prev_btn('prev');
                selected_year = $(".activated option:selected").next().val();

                if (selected_year) {
                    $(".activated").val(selected_year);
                    set_calendar_config(selected_year);
                }
                throw "dont click again!";
            });

            // Trigger filters if already field_id
            if (variance != "") {
                var filter = variance.split(':')[0];
                if (filter == "Y") {
                    $(".cal-label:last").trigger('click');
                    fn_select_filter_onload("cal-select-year");
                } else if (filter == "Q") {
                    $(".cal-label:nth-child(2)").trigger('click');
                    fn_select_filter_onload("cal-select-quarter");
                } else {
                    $(".cal-label:first").trigger('click');
                    fn_select_filter_onload("cal-select-month");
                }

            } else {
                $(".cal-label:first").trigger('click');
            }



            // on change of select value
            $(".cal-select-sec select").change(function() {
                set_calendar_config(this.value + "");
            });

            // on month, quarter and year selection
            $(".cal-body").on('click', '.cal-body-box, .cal-body-box-sml', function() {
                if(settings.range_selection == false){
                        // remove if any column selected previously
                        $(".cal-body").find(".cal-body-box-sml").removeClass("selected");
                        $("#cal-month").find("div").removeClass("selected");
                        $("#cal-quarter").find("div").removeClass("selected");
                        $("#cal-year").find("div").removeClass("selected");
                        $("#cal-year").find(".cal-body-box").removeClass("selected");

                        show_selection($(this));
                }else{
                        select_date_range($(this));

                }

                if (settings.range_selection == false && $.isFunction(settings.onSelect)) {
                    settings.onSelect.call(this);
                }else if(settings.range_selection == true && $.isFunction(settings.onSelect)){
                    if(start_date != "" && end_date != ""){
                        settings.onSelect.call(this);
                    }
                }

            });

        });


    }

    // Hide calendar on click 
    $(document).mouseup(function(e)
    {
        var container = $(".calendar_container");

        if (!container.is(e.target) // if the target of the click isn't the container...
                && container.has(e.target).length === 0) // ... nor a descendant of the container
        {
            container.hide();
            return false;
        }
    });


}(jQuery));


// Reverse jquery plugin
$.fn.reverse = [].reverse;


