month_quarter_year_calendar
===========================

Simple plugin for a specific need. It has three options Month, Quarter and Year. Date used for these options are in format:(YYYY-MM-DD)

Month: 2014-01-01, 2014-02-01 ... 2014-12-01
Quarter: 2014-01-01, 2014-04-01, 2014-07-01, 2014-10-01.
Year: 2014-01-01, 2015-01-01 ...

Date render for Month
M:2014-01-01 (M represent selection of Month option)

Date render for Quarter:
Q:2014-01-01 (Q represent selection of Quarter option)

Date render for Year:
Y:2014-01-01 (Y represent selection of Year option)

NOTE: Only way to distinguish dates for options Month, Quarter and Year are use of M, Q and Y in date.

Plugin is very simple to use:

Step 1: Include CSS and JS files

Step 2: This calendar render for single input on page. Use following piece of code

$(".img_cal").customcalendar({
	field_id : "variance_field", // ID of field that will be populated by date
	no_of_select_months : 12, // For range selection, No of months to select for range
	no_of_select_quarters : 12, // For range selection, No of quarters to select for range
	no_of_select_years : 5, // For range selection, No of quarters to select for range
	range_selection : true, // To select multiple months, quarters or year
	start_year : 2009, // Start year
	onSelect : function(){ // on select of date
		//$("#variance").submit();
	}
});
